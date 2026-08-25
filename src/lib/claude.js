/**
 * Client de l'assistant IA.
 *
 * ⚠️  SÉCURITÉ — aucune clé d'API ne transite ni ne réside ici.
 * Le navigateur ne parle qu'à notre propre endpoint `/api/claude`, servi par la
 * fonction Netlify `netlify/functions/claude.js`, qui détient seule la clé
 * `ANTHROPIC_API_KEY` (variable d'environnement côté serveur).
 *
 * Toute variable exposée au bundle par Vite doit être préfixée `VITE_` : ne
 * mettez JAMAIS de secret dans une variable `VITE_*`, elle finirait en clair
 * dans le JavaScript public.
 */

const ENDPOINT = '/api/claude';
const TIMEOUT_MS = 45000;

/**
 * Remplace `window.claude.complete()` du prototype, avec la même signature :
 * soit une chaîne (prompt simple), soit un objet `{ model, max_tokens, system,
 * messages }`. Renvoie le texte de la réponse.
 */
export async function complete(input) {
  const payload =
    typeof input === 'string'
      ? { messages: [{ role: 'user', content: input }] }
      : {
          model: input?.model,
          max_tokens: input?.max_tokens,
          system: input?.system,
          messages: input?.messages || [],
        };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`assistant: HTTP ${res.status}${detail ? ` — ${detail.slice(0, 200)}` : ''}`);
    }

    const data = await res.json();
    return typeof data?.text === 'string' ? data.text : '';
  } finally {
    clearTimeout(timer);
  }
}

export default { complete };
