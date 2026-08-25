/**
 * Vérifie que la CSP de production autorise ce que l'application appelle.
 *
 * Ce test existe à cause d'une vraie panne : `connect-src 'self'` avait été
 * écrit avant l'ajout de Firebase, et bloquait la connexion en production sans
 * rien casser en développement — le serveur Vite n'applique pas ces en-têtes.
 * L'application signalait une panne réseau pour ce qui était un refus de CSP.
 *
 * Une CSP trop stricte ne se voit pas : elle bloque en silence. Ce test la
 * confronte donc à la liste des hôtes que le code appelle réellement.
 */
import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const toml = readFileSync('netlify.toml', 'utf8');
const csp = /Content-Security-Policy = "([^"]+)"/.exec(toml)?.[1];

/** Directives de la CSP, sous forme de dictionnaire nom -> liste de sources. */
const directives = Object.fromEntries(
  (csp ?? '')
    .split(';')
    .map((bloc) => bloc.trim().split(/\s+/))
    .filter((parts) => parts[0])
    .map(([nom, ...sources]) => [nom, sources])
);

/**
 * Hôtes appelés par le SDK Firebase, et par quoi.
 * Toute nouvelle dépendance réseau doit être ajoutée ici ET dans netlify.toml.
 */
const HOTES_REQUIS = {
  'connect-src': [
    ['https://identitytoolkit.googleapis.com', 'connexion'],
    ['https://securetoken.googleapis.com', 'renouvellement du jeton'],
    ['https://firestore.googleapis.com', 'fiches Firestore'],
    ['https://firebasestorage.googleapis.com', 'fichiers Storage'],
  ],
  'img-src': [['https://firebasestorage.googleapis.com', 'miniatures et avatars']],
  'media-src': [['https://firebasestorage.googleapis.com', 'lecture des vidéos']],
  'font-src': [['https://fonts.gstatic.com', 'police Inter']],
  'style-src': [['https://fonts.googleapis.com', 'feuille de style des polices']],
};

describe('CSP de production', () => {
  test('la directive est présente et analysable', () => {
    assert.ok(csp, 'aucune Content-Security-Policy dans netlify.toml');
    assert.ok(directives['default-src'], 'default-src manquante');
  });

  for (const [directive, hotes] of Object.entries(HOTES_REQUIS)) {
    test(`${directive} autorise les hôtes nécessaires`, () => {
      const sources = directives[directive];
      assert.ok(sources, `directive ${directive} absente : elle retombe sur default-src`);
      for (const [hote, usage] of hotes) {
        assert.ok(
          sources.includes(hote),
          `${directive} ne contient pas ${hote} (${usage}) — l'appel sera bloqué en production`
        );
      }
    });
  }

  test('/api/claude reste joignable', () => {
    assert.ok(
      directives['connect-src'].includes("'self'"),
      "connect-src doit garder 'self' pour la fonction /api/claude"
    );
  });

  test('la CSP ne s’ouvre pas plus que nécessaire', () => {
    assert.ok(
      !directives['script-src'].includes("'unsafe-inline'"),
      "script-src ne doit pas autoriser 'unsafe-inline'"
    );
    assert.ok(
      !directives['script-src'].includes("'unsafe-eval'"),
      "script-src ne doit pas autoriser 'unsafe-eval'"
    );
    for (const [directive, sources] of Object.entries(directives)) {
      assert.ok(
        !sources.includes('*'),
        `${directive} autorise toutes les origines`
      );
    }
    assert.deepEqual(directives['frame-ancestors'], ["'none'"]);
    assert.deepEqual(directives['object-src'], ["'none'"]);
  });
});
