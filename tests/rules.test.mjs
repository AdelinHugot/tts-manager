/**
 * Tests des règles de sécurité Firestore et Storage.
 *
 * Ces tests sont la preuve du cloisonnement : ils vérifient qu'Alice ne peut
 * pas lire ni écrire chez Bob, et qu'une personne non connectée ne voit rien.
 * Sans eux, « c'est cloisonné » n'est qu'une intention.
 *
 * ⚠️  Ils nécessitent l'émulateur Firebase, qui a besoin d'un runtime Java :
 *
 *     brew install --cask temurin      # une seule fois, si Java manque
 *     npm run test:rules
 *
 * Le script `test:rules` lance l'émulateur puis ces tests. Ils tournent aussi
 * en CI, où Java est préinstallé. `npm test` ne les inclut pas, pour ne pas
 * exiger Java sur une machine de développement.
 */
import test, { after, before, describe } from 'node:test';
import { readFileSync } from 'node:fs';

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getBytes, deleteObject } from 'firebase/storage';

const ALICE = 'alice-uid';
const BOB = 'bob-uid';

let env;

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'tts-manager-test',
    firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 },
    storage: { rules: readFileSync('storage.rules', 'utf8'), host: '127.0.0.1', port: 9199 },
  });
});

after(async () => {
  if (env) await env.cleanup();
});

const fsAlice = () => env.authenticatedContext(ALICE).firestore();
const fsBob = () => env.authenticatedContext(BOB).firestore();
const fsAnonyme = () => env.unauthenticatedContext().firestore();

const stAlice = () => env.authenticatedContext(ALICE).storage();
const stAnonyme = () => env.unauthenticatedContext().storage();

const videoFactice = () => new Uint8Array([0, 0, 0, 1]);
const METADATA_VIDEO = { contentType: 'video/mp4' };

describe('Firestore — cloisonnement par compte', () => {
  test('chacun écrit et relit chez soi', async () => {
    const chemin = (db, uid) => doc(db, 'users', uid, 'rushes', 'r1');
    await assertSucceeds(setDoc(chemin(fsAlice(), ALICE), { name: 'rush alice' }));
    await assertSucceeds(getDoc(chemin(fsAlice(), ALICE)));
  });

  test('Alice ne peut pas lire les rushs de Bob', async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'users', BOB, 'rushes', 'secret'), { name: 'rush bob' });
    });
    await assertFails(getDoc(doc(fsAlice(), 'users', BOB, 'rushes', 'secret')));
  });

  test('Alice ne peut pas écrire chez Bob', async () => {
    await assertFails(setDoc(doc(fsAlice(), 'users', BOB, 'rushes', 'intrus'), { name: 'x' }));
  });

  test('Alice ne peut pas supprimer chez Bob', async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'users', BOB, 'videos', 'v1'), { name: 'video bob' });
    });
    await assertFails(deleteDoc(doc(fsAlice(), 'users', BOB, 'videos', 'v1')));
  });

  test('Bob accède bien à ses propres données', async () => {
    await assertSucceeds(setDoc(doc(fsBob(), 'users', BOB, 'ideas', 'i1'), { text: 'idée' }));
    await assertSucceeds(getDoc(doc(fsBob(), 'users', BOB, 'ideas', 'i1')));
  });

  test('une personne non connectée ne voit rien', async () => {
    await assertFails(getDoc(doc(fsAnonyme(), 'users', ALICE, 'rushes', 'r1')));
    await assertFails(setDoc(doc(fsAnonyme(), 'users', ALICE, 'rushes', 'r2'), { name: 'x' }));
  });

  test('les anciennes collections racine de la V1 sont fermées', async () => {
    for (const nom of ['rushes', 'realisations', 'ideas', 'orders', 'products', 'marques']) {
      await assertFails(getDoc(doc(fsAlice(), nom, 'quelconque')));
      await assertFails(setDoc(doc(fsAlice(), nom, 'quelconque'), { x: 1 }));
    }
  });
});

describe('Storage — cloisonnement par compte', () => {
  test('chacun envoie et relit dans son propre espace', async () => {
    const objet = ref(stAlice(), `users/${ALICE}/rushes/r1.mp4`);
    await assertSucceeds(uploadBytes(objet, videoFactice(), METADATA_VIDEO));
    await assertSucceeds(getBytes(objet));
  });

  test('Alice ne peut pas lire les fichiers de Bob', async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await uploadBytes(
        ref(ctx.storage(), `users/${BOB}/rushes/secret.mp4`),
        videoFactice(),
        METADATA_VIDEO
      );
    });
    await assertFails(getBytes(ref(stAlice(), `users/${BOB}/rushes/secret.mp4`)));
  });

  test('Alice ne peut pas écrire ni supprimer chez Bob', async () => {
    await assertFails(
      uploadBytes(ref(stAlice(), `users/${BOB}/rushes/intrus.mp4`), videoFactice(), METADATA_VIDEO)
    );
    await assertFails(deleteObject(ref(stAlice(), `users/${BOB}/rushes/secret.mp4`)));
  });

  test('un non-connecté ne peut rien lire', async () => {
    await assertFails(getBytes(ref(stAnonyme(), `users/${ALICE}/rushes/r1.mp4`)));
  });

  test('les anciens chemins non cloisonnés de la V1 sont fermés', async () => {
    await assertFails(getBytes(ref(stAlice(), 'rushes/ancien.mp4')));
    await assertFails(
      uploadBytes(ref(stAlice(), 'rushes/ancien.mp4'), videoFactice(), METADATA_VIDEO)
    );
  });

  test('un type de fichier non conforme est refusé', async () => {
    await assertFails(
      uploadBytes(ref(stAlice(), `users/${ALICE}/rushes/piege.mp4`), videoFactice(), {
        contentType: 'application/x-msdownload',
      })
    );
  });

  test('une miniature doit être une image', async () => {
    await assertSucceeds(
      uploadBytes(ref(stAlice(), `users/${ALICE}/thumbnails/r1.jpg`), videoFactice(), {
        contentType: 'image/jpeg',
      })
    );
    await assertFails(
      uploadBytes(ref(stAlice(), `users/${ALICE}/thumbnails/r2.jpg`), videoFactice(), METADATA_VIDEO)
    );
  });
});
