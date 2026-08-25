import {
  getFirestore,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { app } from './firebase.js';
import { requireUid } from './auth.js';
import { supprimerFichier } from './storage.js';

const db = getFirestore(app);

/**
 * Fiches — Firestore.
 *
 * Tout vit sous `users/{uid}/…`. Comme pour Storage, le cloisonnement tient au
 * chemin : il n'y a pas de filtre `where('ownerId', …)` qu'un appelant pourrait
 * oublier de poser, et une requête hors de son espace est refusée côté serveur.
 *
 * L'uid n'est jamais un paramètre : il est lu sur la session courante.
 */

const COLLECTIONS = new Set(['rushes', 'videos', 'ideas', 'products', 'marques', 'orders']);

function col(nom) {
  if (!COLLECTIONS.has(nom)) throw new Error(`Collection inconnue : ${nom}`);
  return collection(db, 'users', requireUid(), nom);
}

function fiche(nom, id) {
  if (!COLLECTIONS.has(nom)) throw new Error(`Collection inconnue : ${nom}`);
  return doc(db, 'users', requireUid(), nom, String(id));
}

/** Convertit un Timestamp Firestore en millisecondes, à défaut la valeur brute. */
function enMillisecondes(valeur) {
  if (!valeur) return Date.now();
  if (typeof valeur?.toMillis === 'function') return valeur.toMillis();
  if (valeur instanceof Date) return valeur.getTime();
  const n = Number(valeur);
  return Number.isFinite(n) ? n : Date.parse(valeur) || Date.now();
}

function versObjet(snap) {
  const d = snap.data() || {};
  return { ...d, id: snap.id, createdAt: enMillisecondes(d.createdAt) };
}

/** Lecture ponctuelle, triée du plus récent au plus ancien. */
export async function lister(nom) {
  const snap = await getDocs(query(col(nom), orderBy('createdAt', 'desc')));
  return snap.docs.map(versObjet);
}

/**
 * Écoute une collection en continu.
 * `onChange` reçoit le tableau complet à chaque modification.
 * Renvoie la fonction de désabonnement.
 */
export function ecouter(nom, onChange, onError) {
  return onSnapshot(
    query(col(nom), orderBy('createdAt', 'desc')),
    (snap) => onChange(snap.docs.map(versObjet)),
    (err) => {
      console.error(`Écoute de ${nom} interrompue`, err);
      if (onError) onError(err);
    }
  );
}

/** Crée ou remplace une fiche. L'id est fourni par l'appelant. */
export async function enregistrer(nom, id, donnees) {
  await setDoc(fiche(nom, id), { ...donnees, createdAt: donnees.createdAt ?? serverTimestamp() });
}

/** Modifie une fiche existante. */
export async function modifier(nom, id, champs) {
  await updateDoc(fiche(nom, id), champs);
}

/** Supprime une fiche, sans toucher aux fichiers associés. */
export async function supprimer(nom, id) {
  await deleteDoc(fiche(nom, id));
}

/**
 * Supprime une fiche ET les fichiers qu'elle référence.
 *
 * L'ordre compte, et il est volontaire : les fichiers d'abord, la fiche
 * ensuite. Si la suppression d'un fichier échoue, la fiche subsiste — l'élément
 * reste donc visible dans l'application et la suppression peut être relancée.
 * L'ordre inverse produirait un objet orphelin : facturé indéfiniment, et
 * invisible puisque plus rien ne le référence.
 *
 * C'est ce qui garantit que le stock de rushs reste borné.
 */
export async function supprimerAvecFichiers(nom, id, chemins) {
  for (const c of chemins.filter(Boolean)) {
    await supprimerFichier(c);
  }
  await supprimer(nom, id);
}
