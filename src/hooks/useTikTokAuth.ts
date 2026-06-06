import { useCallback, useEffect, useState } from 'react'
import { auth } from '../lib/firebase'
import {
  fsSaveTikTokToken,
  fsGetTikTokToken,
  fsDeleteTikTokToken,
  fsGetCachedMetrics,
  fsCacheTikTokMetrics,
} from '../lib/firestore'
import {
  generatePKCE,
  buildAuthUrl,
  exchangeCodeForToken,
  refreshAccessToken,
  fetchVideoMetrics,
  SS_CODE_VERIFIER,
  SS_OAUTH_STATE,
  TIKTOK_CLIENT_KEY,
  type TikTokTokenData,
  type TikTokVideoMetrics,
} from '../lib/tiktok'

export type TikTokAuthStatus =
  | 'loading'
  | 'not_configured' // VITE_TIKTOK_CLIENT_KEY not set
  | 'disconnected'
  | 'connected'
  | 'error'

export function useTikTokAuth() {
  const [status, setStatus] = useState<TikTokAuthStatus>('loading')
  const [token, setToken] = useState<TikTokTokenData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load token from Firestore on mount
  useEffect(() => {
    if (!TIKTOK_CLIENT_KEY) {
      setStatus('not_configured')
      return
    }
    const uid = auth.currentUser?.uid
    if (!uid) {
      setStatus('disconnected')
      return
    }
    fsGetTikTokToken(uid).then((t) => {
      if (t && t.refreshExpiresAt > Date.now()) {
        setToken(t)
        setStatus('connected')
      } else {
        setStatus('disconnected')
      }
    }).catch(() => setStatus('disconnected'))
  }, [])

  // Start OAuth flow
  const connect = useCallback(async () => {
    if (!TIKTOK_CLIENT_KEY) return
    const { verifier, challenge } = await generatePKCE()
    const state = Math.random().toString(36).slice(2)
    sessionStorage.setItem(SS_CODE_VERIFIER, verifier)
    sessionStorage.setItem(SS_OAUTH_STATE, state)
    window.location.href = buildAuthUrl(challenge, state)
  }, [])

  // Disconnect — delete token from Firestore
  const disconnect = useCallback(async () => {
    const uid = auth.currentUser?.uid
    if (!uid) return
    await fsDeleteTikTokToken(uid)
    setToken(null)
    setStatus('disconnected')
  }, [])

  // Handle OAuth callback (called from App.tsx on mount when ?code= is detected)
  const handleCallback = useCallback(async (code: string, returnedState: string) => {
    const verifier = sessionStorage.getItem(SS_CODE_VERIFIER)
    const expectedState = sessionStorage.getItem(SS_OAUTH_STATE)
    sessionStorage.removeItem(SS_CODE_VERIFIER)
    sessionStorage.removeItem(SS_OAUTH_STATE)

    if (!verifier || returnedState !== expectedState) {
      setError('Erreur de sécurité OAuth (state mismatch)')
      setStatus('error')
      return
    }

    const uid = auth.currentUser?.uid
    if (!uid) {
      setError('Non connecté à l\'app')
      setStatus('error')
      return
    }

    try {
      const t = await exchangeCodeForToken(code, verifier)
      await fsSaveTikTokToken(uid, t)
      setToken(t)
      setStatus('connected')
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg)
      setStatus('error')
    }
  }, [])

  // Get a valid access token (auto-refresh if expired)
  const getValidToken = useCallback(async (): Promise<string | null> => {
    if (!token) return null
    const uid = auth.currentUser?.uid
    if (!uid) return null

    // Token still valid (with 60s buffer)
    if (token.expiresAt > Date.now() + 60_000) return token.accessToken

    // Refresh token expired — need to reconnect
    if (token.refreshExpiresAt <= Date.now()) {
      setToken(null)
      setStatus('disconnected')
      return null
    }

    try {
      const refreshed = await refreshAccessToken(token.refreshToken)
      await fsSaveTikTokToken(uid, refreshed)
      setToken(refreshed)
      return refreshed.accessToken
    } catch {
      setToken(null)
      setStatus('disconnected')
      return null
    }
  }, [token])

  // Fetch metrics for given video IDs, with Firestore cache
  const getVideoMetrics = useCallback(async (
    videoIds: string[],
  ): Promise<Map<string, TikTokVideoMetrics>> => {
    if (videoIds.length === 0 || status !== 'connected') return new Map()
    const uid = auth.currentUser?.uid
    if (!uid) return new Map()

    const { fresh, stale } = await fsGetCachedMetrics(uid, videoIds)

    if (stale.length > 0) {
      const accessToken = await getValidToken()
      if (!accessToken) return fresh

      try {
        const fetched = await fetchVideoMetrics(accessToken, stale)
        await fsCacheTikTokMetrics(uid, fetched)
        for (const m of fetched) fresh.set(m.id, m)
      } catch (err) {
        if (err instanceof Error && err.message === 'TOKEN_EXPIRED') {
          setToken(null)
          setStatus('disconnected')
        }
        // Return what we have from cache
      }
    }

    return fresh
  }, [status, getValidToken])

  return { status, error, connect, disconnect, handleCallback, getVideoMetrics }
}
