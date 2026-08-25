/**
 * Proxy serveur vers l'API Anthropic.
 *
 * C'est le SEUL endroit du projet qui connaît `ANTHROPIC_API_KEY`. Le code
 * client (`src/lib/claude.js`) appelle `/api/claude` sans jamais manipuler de
 * secret : la clé reste dans les variables d'environnement Netlify et ne peut
 * donc pas fuiter dans le bundle, le dépôt Git ou les DevTools.
 *
 * Défenses en place :
 *  - méthode POST uniquement ;
 *  - vérification de l'origine (`ALLOWED_ORIGINS`, ou l'origine du déploiement) ;
 *  - liste blanche de modèles et plafond sur `max_tokens` ;
 *  - taille de requête et longueur d'historique bornées ;
 *  - limitation de débit par IP ;
 *  - erreurs amont renvoyées sans détail exploitable.
 */

const ALLOWED_MODELS = new Set(['claude-haiku-4-5', 'claude-sonnet-4-5']);
const DEFAULT_MODEL = 'claude-haiku-4-5';
const MAX_TOKENS_CAP = 1500;
const MAX_BODY_BYTES = 64 * 1024;
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 8000;
const MAX_SYSTEM_CHARS = 20000;

// Limitation de débit : la mémoire d'une lambda est partagée entre les
// invocations d'une même instance. Cela absorbe les abus les plus courants ;
// pour une protection stricte à l'échelle, passer par un store partagé
// (Netlify Blobs, Upstash…) ou un WAF.
const RATE_LIMIT = { windowMs: 60_000, max: 20 };
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const win = hits.get(ip);
  if (!win || now - win.start > RATE_LIMIT.windowMs) {
    hits.set(ip, { start: now, count: 1 });
    if (hits.size > 5000) hits.clear();
    return false;
  }
  win.count += 1;
  return win.count > RATE_LIMIT.max;
}

function json(status, body, extraHeaders) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}

/** N'autorise que les origines du déploiement (et celles listées explicitement). */
function originAllowed(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true; // requête same-origin sans en-tête Origin

  const allowed = new Set(
    (process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  );
  for (const envVar of ['URL', 'DEPLOY_PRIME_URL', 'DEPLOY_URL']) {
    if (process.env[envVar]) allowed.add(process.env[envVar]);
  }
  try {
    allowed.add(new URL(request.url).origin);
  } catch {
    /* ignore */
  }
  if (process.env.NETLIFY_DEV) {
    allowed.add('http://localhost:8888');
    allowed.add('http://localhost:5173');
  }
  return allowed.has(origin);
}

function clampMessages(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));
}

export default async function handler(request) {
  if (request.method !== 'POST') {
    return json(405, { error: 'method_not_allowed' }, { Allow: 'POST' });
  }
  if (!originAllowed(request)) {
    return json(403, { error: 'origin_not_allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY absente de l’environnement');
    return json(503, { error: 'assistant_unavailable' });
  }

  const ip =
    request.headers.get('x-nf-client-connection-ip') ||
    (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    'unknown';
  if (rateLimited(ip)) {
    return json(429, { error: 'rate_limited' }, { 'Retry-After': '60' });
  }

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return json(413, { error: 'payload_too_large' });
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return json(400, { error: 'invalid_json' });
  }

  const messages = clampMessages(body.messages);
  if (!messages.length) {
    return json(400, { error: 'messages_required' });
  }

  const model = ALLOWED_MODELS.has(body.model) ? body.model : DEFAULT_MODEL;
  const maxTokens = Math.min(
    Math.max(parseInt(body.max_tokens, 10) || 900, 1),
    MAX_TOKENS_CAP
  );
  const system = typeof body.system === 'string' ? body.system.slice(0, MAX_SYSTEM_CHARS) : undefined;

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        ...(system ? { system } : {}),
        messages,
      }),
    });

    if (!upstream.ok) {
      // On journalise le détail côté serveur, on ne le renvoie pas au client.
      console.error('Anthropic API', upstream.status, (await upstream.text()).slice(0, 500));
      return json(upstream.status === 429 ? 429 : 502, { error: 'upstream_error' });
    }

    const data = await upstream.json();
    const text = (data.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('')
      .trim();

    return json(200, { text, model: data.model, stop_reason: data.stop_reason });
  } catch (err) {
    console.error('Appel Anthropic échoué', err);
    return json(502, { error: 'upstream_unreachable' });
  }
}

export const config = { path: '/api/claude' };
