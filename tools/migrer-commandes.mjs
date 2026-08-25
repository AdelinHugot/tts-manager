#!/usr/bin/env node
/**
 * Migration des commandes de la V1 vers l'espace cloisonné de la V2.
 *
 *   orders/{orderId}  ->  users/{uid}/orders/{orderId}
 *
 * L'identifiant de document reste l'identifiant de commande TikTok Shop. C'est
 * lui qui assure le dédoublonnage : réimporter un export déjà traité écrase la
 * fiche au lieu d'en créer une seconde. Le conserver garde donc les futurs
 * imports idempotents, exactement comme dans la V1.
 *
 * Seules les commandes sont migrées : réalisations, rushs, idées, produits et
 * marques sont abandonnés volontairement.
 *
 * Ce script utilise le SDK Admin, qui contourne les règles de sécurité — il
 * fonctionne donc que les nouvelles règles soient déjà déployées ou non.
 *
 * ── Utilisation ────────────────────────────────────────────────────────────
 *
 *   1. Console Firebase > Paramètres du projet > Comptes de service
 *      > « Générer une nouvelle clé privée ». Enregistrer le fichier HORS du
 *        dépôt (le téléchargement atterrit en général dans ~/Downloads).
 *
 *   2. Récupérer l'uid du compte destinataire :
 *      Console Firebase > Authentication > onglet Users > colonne « User UID ».
 *
 *   3. Simulation (n'écrit rien) :
 *      node tools/migrer-commandes.mjs --uid=LE_UID --cle="/chemin/vers/cle.json"
 *
 *   4. Migration réelle : ajouter --appliquer
 *
 *   5. Supprimer la clé de service une fois terminé : c'est un accès total au
 *      projet, elle ne doit ni traîner ni être committée.
 *
 * La collection racine `orders` n'est PAS supprimée : vérifier d'abord que tout
 * est arrivé, puis la supprimer à la main depuis la console.
 */
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';

const args = new Map(
  process.argv.slice(2).map((a) => {
    const [cle, valeur] = a.replace(/^--/, '').split('=');
    return [cle, valeur ?? true];
  })
);

const uid = args.get('uid');
const appliquer = args.has('appliquer');
const ecraser = args.has('ecraser');

function abandonner(...lignes) {
  console.error(lignes.join('\n'));
  process.exit(1);
}

if (!uid || uid === true) {
  abandonner(
    'Usage : node tools/migrer-commandes.mjs --uid=UID --cle=CHEMIN [--appliquer] [--ecraser]',
    '',
    '  --uid        uid du compte destinataire (console > Authentication > User UID)',
    '  --cle        chemin du fichier de clé de compte de service',
    '               (à défaut : variable GOOGLE_APPLICATION_CREDENTIALS)',
    '  --appliquer  écrit réellement — sans lui, simulation',
    '  --ecraser    remplace les commandes déjà présentes chez ce compte'
  );
}

/** Développe `~` et renvoie un chemin absolu. */
function cheminAbsolu(brut) {
  const texte = String(brut).trim().replace(/^~(?=$|\/)/, homedir());
  return resolve(texte);
}

const cleBrute = args.get('cle') !== undefined && args.get('cle') !== true
  ? args.get('cle')
  : process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!cleBrute) {
  abandonner(
    'Aucune clé de compte de service fournie.',
    '',
    'Console Firebase > Paramètres du projet > Comptes de service',
    '  > « Générer une nouvelle clé privée ». Puis :',
    '',
    '  node tools/migrer-commandes.mjs --uid=' + uid + ' --cle="/chemin/vers/la/cle.json"'
  );
}

const cheminCle = cheminAbsolu(cleBrute);

if (!existsSync(cheminCle)) {
  abandonner(
    `Fichier de clé introuvable : ${cheminCle}`,
    '',
    'Vérifier le chemin. Les clés téléchargées atterrissent en général dans',
    '~/Downloads, avec un nom du type « … Firebase Admin SDK.json ».',
    'Les espaces dans le chemin doivent être entre guillemets :',
    '',
    '  node tools/migrer-commandes.mjs --uid=' + uid + ' \\',
    '    --cle="$HOME/Downloads/TTS Manager Firebase Admin SDK.json"'
  );
}

let identifiants;
try {
  identifiants = JSON.parse(readFileSync(cheminCle, 'utf8'));
} catch (err) {
  abandonner(`Clé illisible (${cheminCle}) : ${err.message}`);
}

if (identifiants.type !== 'service_account' || !identifiants.project_id) {
  abandonner(
    `Ce fichier n'est pas une clé de compte de service : ${cheminCle}`,
    'Attendu un JSON contenant "type": "service_account".'
  );
}

console.log(`  projet : ${identifiants.project_id}`);
initializeApp({ credential: cert(identifiants) });

const db = getFirestore();
const LOT = 400;

async function main() {
  console.log(appliquer ? '▶ Migration réelle' : '▶ Simulation — aucune écriture');
  console.log(`  destination : users/${uid}/orders\n`);

  const source = await db.collection('orders').get();
  if (source.empty) {
    console.log('Aucune commande dans la collection racine. Rien à faire.');
    return;
  }

  const destination = db.collection('users').doc(uid).collection('orders');
  const dejaPresents = new Set((await destination.select().get()).docs.map((d) => d.id));

  const aEcrire = [];
  let ignorees = 0;

  for (const fiche of source.docs) {
    if (dejaPresents.has(fiche.id) && !ecraser) {
      ignorees += 1;
      continue;
    }
    aEcrire.push(fiche);
  }

  console.log(`  ${source.size} commande(s) à la racine`);
  console.log(`  ${dejaPresents.size} déjà présente(s) à destination`);
  console.log(`  ${ignorees} ignorée(s) — déjà migrée(s), relancer avec --ecraser pour les remplacer`);
  console.log(`  ${aEcrire.length} à écrire\n`);

  if (aEcrire.length) {
    const exemple = aEcrire[0];
    console.log(`  exemple : ${exemple.id}`);
    console.log(`  ${JSON.stringify(exemple.data(), null, 2).split('\n').join('\n  ')}\n`);
  }

  if (!appliquer) {
    console.log('Simulation terminée. Relancer avec --appliquer pour écrire.');
    return;
  }

  let ecrites = 0;
  for (let i = 0; i < aEcrire.length; i += LOT) {
    const lot = db.batch();
    for (const fiche of aEcrire.slice(i, i + LOT)) {
      lot.set(destination.doc(fiche.id), fiche.data());
    }
    await lot.commit();
    ecrites += Math.min(LOT, aEcrire.length - i);
    process.stdout.write(`\r  écrites : ${ecrites}/${aEcrire.length}`);
  }
  console.log('\n');

  // Vérification : on relit la destination plutôt que de faire confiance aux
  // écritures. Une migration qu'on n'a pas recomptée n'est pas terminée.
  const apres = await destination.select().get();
  const manquantes = source.docs.filter((d) => !apres.docs.some((x) => x.id === d.id));

  console.log(`✓ ${apres.size} commande(s) chez users/${uid}`);
  if (manquantes.length) {
    console.error(`✗ ${manquantes.length} commande(s) manquante(s) : ${manquantes.slice(0, 5).map((d) => d.id).join(', ')}…`);
    process.exit(1);
  }
  console.log('✓ Toutes les commandes de la racine sont présentes à destination.');
  console.log('\nLa collection racine `orders` est intacte. La supprimer depuis la');
  console.log('console une fois la V2 vérifiée.');
}

main().catch((err) => {
  console.error('\nÉchec de la migration :', err.message);
  process.exit(1);
});
