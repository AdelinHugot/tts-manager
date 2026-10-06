import {
  browserLocalPersistence,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';

import { auth } from './firebase.js';

/**
 * Authentification.
 *
 * L'uid produit ici n'est pas qu'une porte d'entrée : c'est la clé du
 * cloisonnement. Tous les chemins Firestore et Storage sont préfixés par
 * `users/{uid}`, et les règles de sécurité comparent ce segment à
 * `request.auth.uid`. Sans utilisateur connecté, aucune donnée n'est lisible.
 */

/** Session conservée entre les rechargements d'onglet. */
export const persistenceReady = setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error('Persistance de session indisponible', err);
});

/** Écoute l'état de connexion. Renvoie la fonction de désabonnement. */
export function observeUser(callback) {
  return onAuthStateChanged(auth, callback);
}

/** Utilisateur courant, ou null. */
export function currentUser() {
  return auth.currentUser;
}

/** uid courant. Lève si personne n'est connecté — sécurité de la couche données. */
export function requireUid() {
  const user = auth.currentUser;
  if (!user) throw new Error('Aucun utilisateur connecté');
  return user.uid;
}

const MESSAGES = {
  'auth/invalid-email': 'Cette adresse email n’est pas valide.',
  'auth/invalid-credential': 'Email ou mot de passe incorrect.',
  'auth/wrong-password': 'Email ou mot de passe incorrect.',
  'auth/user-not-found': 'Email ou mot de passe incorrect.',
  'auth/user-disabled': 'Ce compte a été désactivé.',
  'auth/too-many-requests': 'Trop de tentatives. Réessaie dans quelques minutes.',
  'auth/network-request-failed': 'Connexion impossible. Vérifie ton réseau.',
  'auth/weak-password': 'Mot de passe trop court — 8 caractères minimum.',
  'auth/requires-recent-login': 'Reconnecte-toi avant de changer ton mot de passe.',
};

/** Traduit un code Firebase en message affichable. */
export function messageErreur(err) {
  return MESSAGES[err?.code] ?? 'Une erreur est survenue. Réessaie.';
}

export async function connexion(email, motDePasse) {
  await persistenceReady;
  const { user } = await signInWithEmailAndPassword(auth, email.trim(), motDePasse);
  return user;
}

/**
 * Envoie un lien de réinitialisation.
 *
 * Sans ce chemin, un mot de passe oublié enferme définitivement dehors : les
 * comptes sont créés à la main, il n'y a pas d'inscription par laquelle
 * repasser.
 *
 * On ne dit jamais si l'adresse existe. Répondre « compte inconnu » laisserait
 * n'importe qui vérifier, une adresse à la fois, qui possède un compte ici.
 */
export async function reinitialiserMotDePasse(email) {
  const adresse = String(email ?? '').trim();
  if (!adresse) throw new Error('Renseigne ton adresse e-mail.');
  try {
    await sendPasswordResetEmail(auth, adresse);
  } catch (err) {
    // Une adresse inconnue ou mal formée ne doit rien révéler ; le reste
    // (réseau coupé, trop de tentatives) mérite d'être signalé.
    if (err?.code === 'auth/user-not-found' || err?.code === 'auth/invalid-email') return;
    throw err;
  }
}

export async function deconnexion() {
  await signOut(auth);
}

/**
 * Change le mot de passe. Firebase exige une authentification récente : on
 * réauthentifie avec le mot de passe actuel plutôt que de renvoyer l'erreur
 * `requires-recent-login` à la figure de l'utilisatrice.
 */
export async function changerMotDePasse(actuel, nouveau) {
  const user = auth.currentUser;
  if (!user) throw new Error('Aucun utilisateur connecté');
  const credential = EmailAuthProvider.credential(user.email, actuel);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, nouveau);
}
