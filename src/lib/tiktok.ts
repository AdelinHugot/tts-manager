// ─── TikTok API utilities ────────────────────────────────────────────────────
// Uses PKCE (no client_secret needed) for a pure SPA/PWA OAuth flow.
// The redirect URI must be registered in your TikTok Developer App.

export const TIKTOK_CLIENT_KEY = import.meta.env.VITE_TIKTOK_CLIENT_KEY as string | undefined

// ── PKCE helpers ──────────────────────────────────────────────────────────────

function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array).map((b) => chars[b % chars.length]).join('')
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(plain))
}

function base64URLEncode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export async function generatePKCE(): Promise<{ verifier: string; challenge: string }> {
  const verifier = generateRandomString(64)
  const challenge = base64URLEncode(await sha256(verifier))
  return { verifier, challenge }
}

// ── Auth URL ──────────────────────────────────────────────────────────────────

export function buildAuthUrl(challenge: string, state: string): string {
  if (!TIKTOK_CLIENT_KEY) throw new Error('VITE_TIKTOK_CLIENT_KEY non défini')
  const params = new URLSearchParams({
    client_key: TIKTOK_CLIENT_KEY,
    scope: 'video.list',
    response_type: 'code',
    redirect_uri: getRedirectUri(),
    code_challenge: challenge,
    code_challenge_method: 'S256',
    state,
  })
  return `https://www.tiktok.com/v2/auth/authorize?${params.toString()}`
}

export function getRedirectUri(): string {
  return window.location.origin
}

// ── Token exchange ────────────────────────────────────────────────────────────

export type TikTokTokenData = {
  accessToken: string
  refreshToken: string
  expiresAt: number        // timestamp ms
  refreshExpiresAt: number // timestamp ms
  scope: string
}

export async function exchangeCodeForToken(
  code: string,
  codeVerifier: string,
): Promise<TikTokTokenData> {
  if (!TIKTOK_CLIENT_KEY) throw new Error('VITE_TIKTOK_CLIENT_KEY non défini')
  const params = new URLSearchParams({
    client_key: TIKTOK_CLIENT_KEY,
    code,
    grant_type: 'authorization_code',
    redirect_uri: getRedirectUri(),
    code_verifier: codeVerifier,
  })
  const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })
  if (!res.ok) throw new Error(`Token exchange HTTP ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error_description ?? data.error)
  const now = Date.now()
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: now + data.expires_in * 1000,
    refreshExpiresAt: now + data.refresh_expires_in * 1000,
    scope: data.scope ?? 'video.list',
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<TikTokTokenData> {
  if (!TIKTOK_CLIENT_KEY) throw new Error('VITE_TIKTOK_CLIENT_KEY non défini')
  const params = new URLSearchParams({
    client_key: TIKTOK_CLIENT_KEY,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  })
  const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })
  if (!res.ok) throw new Error(`Token refresh HTTP ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error_description ?? data.error)
  const now = Date.now()
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: now + data.expires_in * 1000,
    refreshExpiresAt: now + data.refresh_expires_in * 1000,
    scope: data.scope ?? 'video.list',
  }
}

// ── Video metrics ─────────────────────────────────────────────────────────────

export type TikTokVideoMetrics = {
  id: string
  view_count: number
  like_count: number
  comment_count: number
  share_count: number
}

export async function fetchVideoMetrics(
  accessToken: string,
  videoIds: string[],
): Promise<TikTokVideoMetrics[]> {
  if (videoIds.length === 0) return []
  // API allows max 20 IDs per request
  const chunks: string[][] = []
  for (let i = 0; i < videoIds.length; i += 20) {
    chunks.push(videoIds.slice(i, i + 20))
  }
  const results: TikTokVideoMetrics[] = []
  for (const chunk of chunks) {
    const res = await fetch(
      'https://open.tiktokapis.com/v2/video/query/?fields=id,view_count,like_count,comment_count,share_count',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filters: { video_ids: chunk } }),
      },
    )
    if (!res.ok) {
      if (res.status === 401) throw new Error('TOKEN_EXPIRED')
      throw new Error(`fetchVideoMetrics HTTP ${res.status}`)
    }
    const data = await res.json()
    if (data.data?.videos) results.push(...data.data.videos)
  }
  return results
}

// ── Session storage keys ──────────────────────────────────────────────────────

export const SS_CODE_VERIFIER = 'tiktok_pkce_verifier'
export const SS_OAUTH_STATE   = 'tiktok_oauth_state'
