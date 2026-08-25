/**
 * Tests de la construction des chemins de stockage.
 *
 * Ils vérifient la moitié applicative du cloisonnement : que tout chemin
 * fabriqué par l'application atterrit bien sous `users/{uid}/`, et qu'aucun nom
 * de fichier ne peut en sortir. L'autre moitié — le refus côté serveur — est
 * couverte par tests/rules.test.mjs.
 *
 * Aucune dépendance à Firebase ici : ces fonctions vivent dans leur propre
 * module précisément pour rester testables sans émulateur ni réseau.
 */
import test, { describe } from 'node:test';
import assert from 'node:assert/strict';

import { cheminUtilisateur, extensionDe, nettoyerNomFichier, DOSSIERS } from '../src/lib/chemins.js';

describe('cheminUtilisateur', () => {
  test('préfixe toujours par users/{uid}', () => {
    assert.equal(cheminUtilisateur('alice', 'rushes', 'r1.mp4'), 'users/alice/rushes/r1.mp4');
    assert.equal(
      cheminUtilisateur('bob', 'thumbnails', 'r1.jpg'),
      'users/bob/thumbnails/r1.jpg'
    );
  });

  test('accepte tous les dossiers déclarés, et eux seuls', () => {
    for (const dossier of DOSSIERS) {
      assert.match(cheminUtilisateur('alice', dossier, 'f.bin'), new RegExp(`^users/alice/${dossier}/`));
    }
    assert.throws(() => cheminUtilisateur('alice', 'ailleurs', 'f.bin'), /Dossier de stockage inconnu/);
    assert.throws(() => cheminUtilisateur('alice', '', 'f.bin'), /Dossier de stockage inconnu/);
  });

  test('refuse un uid vide plutôt que d’écrire à la racine', () => {
    for (const uid of [undefined, null, '', '   ']) {
      assert.throws(() => cheminUtilisateur(uid, 'rushes', 'r.mp4'), /uid manquant/);
    }
  });

  test('un nom de fichier ne peut pas faire sortir de l’espace du compte', () => {
    const tentatives = [
      '../bob/rushes/vole.mp4',
      '..%2Fbob',
      'a/b.mp4',
      'a\\b.mp4',
      '..',
      '.',
    ];
    for (const nom of tentatives) {
      const construit = () => cheminUtilisateur('alice', 'rushes', nom);
      let chemin = null;
      try {
        chemin = construit();
      } catch {
        continue; // rejeté : c'est le comportement attendu
      }
      // S'il est accepté, il doit malgré tout rester confiné.
      assert.equal(
        chemin.split('/').length,
        4,
        `${JSON.stringify(nom)} produit un chemin à plusieurs segments : ${chemin}`
      );
      assert.ok(chemin.startsWith('users/alice/rushes/'), `${nom} sort de l’espace du compte`);
    }
  });
});

describe('nettoyerNomFichier', () => {
  test('conserve les noms légitimes, accents et espaces compris', () => {
    for (const nom of ['rush 1.mp4', 'avant-après_v2.MOV', 'plan (final).mkv', 'éàü.webm']) {
      assert.equal(nettoyerNomFichier(nom), nom);
    }
  });

  test('rogne les espaces de bord', () => {
    assert.equal(nettoyerNomFichier('  r1.mp4  '), 'r1.mp4');
  });

  test('refuse un nom vide', () => {
    for (const nom of ['', '   ', null, undefined]) {
      assert.throws(() => nettoyerNomFichier(nom), /Nom de fichier/);
    }
  });

  test('refuse les caractères de contrôle', () => {
    for (const code of [0x00, 0x09, 0x0a, 0x1f, 0x7f]) {
      const nom = `r${String.fromCharCode(code)}.mp4`;
      assert.throws(() => nettoyerNomFichier(nom), /invalide|vide/, `code ${code} accepté`);
    }
  });
});

describe('extensionDe', () => {
  test('renvoie l’extension en minuscules', () => {
    assert.equal(extensionDe('rush.MP4'), 'mp4');
    assert.equal(extensionDe('a.b.WebM'), 'webm');
  });

  test('retombe sur la valeur par défaut quand il n’y a pas d’extension', () => {
    assert.equal(extensionDe('rush'), 'mp4');
    assert.equal(extensionDe('rush.'), 'mp4');
    assert.equal(extensionDe('.cache'), 'mp4');
    assert.equal(extensionDe('avatar', 'jpg'), 'jpg');
  });
});
