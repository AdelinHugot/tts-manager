/**
 * Tests de la fonction serverless `/api/claude`.
 *
 * Ils vérifient les garde-fous de sécurité sans jamais toucher l'API Anthropic :
 * `fetch` global est remplacé par un espion.
 *
 * Lancer avec :  npm test
 */
import test from 'node:test';
import assert from 'node:assert/strict';

const { default: handler } = await import('../netlify/functions/claude.js');

const ORIGIN = 'https://site.netlify.app';

function makeRequest({ method = 'POST', headers = {}, body } = {}) {
  const payload =
    method === 'GET'
      ? undefined
      : body !== undefined
        ? body
        : JSON.stringify({ messages: [{ role: 'user', content: 'salut' }] });

  return new Request(`${ORIGIN}/api/claude`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: payload,
  });
}

/** Remplace `fetch` et renvoie la liste des appels observés. */
function spyOnUpstream(response) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, headers: init.headers, body: JSON.parse(init.body) });
    return (
      response ??
      new Response(
        JSON.stringify({
          content: [{ type: 'text', text: 'ok!' }],
          model: 'claude-haiku-4-5',
          stop_reason: 'end_turn',
        }),
        { status: 200 }
      )
    );
  };
  return calls;
}

test('refuse de répondre si la clé serveur est absente', async () => {
  delete process.env.ANTHROPIC_API_KEY;
  const res = await handler(makeRequest());
  assert.equal(res.status, 503);
  assert.equal((await res.json()).error, 'assistant_unavailable');
});

test('rejette les méthodes autres que POST', async () => {
  process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
  const res = await handler(makeRequest({ method: 'GET' }));
  assert.equal(res.status, 405);
});

test('rejette une origine non autorisée', async () => {
  process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
  const res = await handler(makeRequest({ headers: { origin: 'https://evil.example' } }));
  assert.equal(res.status, 403);
});

test('rejette un corps JSON invalide', async () => {
  process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
  const res = await handler(makeRequest({ body: '{oops' }));
  assert.equal(res.status, 400);
});

test('exige au moins un message exploitable', async () => {
  process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
  const res = await handler(makeRequest({ body: JSON.stringify({ messages: [] }) }));
  assert.equal(res.status, 400);
});

test("borne le modèle, max_tokens et l'historique, et garde la clé côté serveur", async () => {
  process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
  const calls = spyOnUpstream();

  const res = await handler(
    makeRequest({
      body: JSON.stringify({
        model: 'un-modele-non-autorise',
        max_tokens: 999999,
        system: 'consignes',
        messages: Array.from({ length: 40 }, (_, i) => ({
          role: i % 2 ? 'assistant' : 'user',
          content: 'message ' + i,
        })),
      }),
    })
  );

  assert.equal(res.status, 200);
  assert.equal((await res.json()).text, 'ok!');

  const [call] = calls;
  assert.equal(call.url, 'https://api.anthropic.com/v1/messages');
  assert.equal(call.body.model, 'claude-haiku-4-5', 'modèle hors liste blanche remplacé par défaut');
  assert.equal(call.body.max_tokens, 1500, 'max_tokens plafonné');
  assert.equal(call.body.messages.length, 12, 'historique tronqué');
  assert.equal(call.headers['x-api-key'], 'sk-ant-test', 'clé transmise uniquement en amont');
});

test('ne divulgue pas le détail des erreurs amont', async () => {
  process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
  spyOnUpstream(new Response('clé invalide: sk-ant-secret', { status: 401 }));

  const res = await handler(makeRequest());
  assert.equal(res.status, 502);
  const body = await res.text();
  assert.equal(JSON.parse(body).error, 'upstream_error');
  assert.ok(!body.includes('sk-ant-secret'));
});

test('limite le débit par IP', async () => {
  process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
  spyOnUpstream();

  let last;
  for (let i = 0; i < 25; i++) {
    last = await handler(makeRequest({ headers: { 'x-nf-client-connection-ip': '203.0.113.7' } }));
  }
  assert.equal(last.status, 429);
  assert.equal(last.headers.get('Retry-After'), '60');
});
