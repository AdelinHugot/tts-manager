import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

import { app } from './firebase.js';
import { requireUid } from './auth.js';
import { envoyerPetitFichier, supprimerFichier } from './storage.js';
import { extensionDe } from './chemins.js';

/**
 * Profil du compte.
 *
 * Contrairement au reste, le profil n'est pas une sous-collection mais le
 * document `users/{uid}` lui-même — celui qui porte déjà les sous-collections.
 * Les règles de sécurité le couvrent au même titre : `match /users/{uid}`.
 *
 * L'adresse e-mail n'est volontairement pas stockée ici : elle appartient à
 * l'authentification, qui en est la seule source de vérité. La dupliquer
 * garantirait qu'un jour les deux divergent.
 */

const db = getFirestore(app);
const TAILLE_MAX = 5 * 1024 * 1024; // la règle Storage refuse au-delà

const fiche = () => doc(db, 'users', requireUid());

/** Écoute le profil. Renvoie la fonction de désabonnement. */
export function ecouterProfil(onChange, onError) {
  return onSnapshot(
    fiche(),
    (snap) => onChange(snap.exists() ? snap.data() : {}),
    (err) => {
      console.error('Écoute du profil interrompue', err);
      if (onError) onError(err);
    }
  );
}

/** Enregistre les champs modifiés, sans toucher au reste du document. */
export function enregistrerProfil(champs) {
  return setDoc(fiche(), champs, { merge: true });
}

/**
 * Remplace la photo de profil.
 *
 * Le nom du fichier est fixe plutôt qu'unique : une personne n'a qu'un avatar,
 * et réécrire au même endroit évite d'accumuler les anciennes images dans le
 * stockage à chaque changement. L'URL renvoyée par Storage porte un jeton qui
 * change à chaque envoi, donc le cache du navigateur ne pose pas de problème.
 */
export async function envoyerAvatar(fichier) {
  if (!fichier.type || !fichier.type.startsWith('image/')) {
    throw new Error('Choisis une image (JPG ou PNG).');
  }
  if (fichier.size > TAILLE_MAX) {
    throw new Error('Image trop lourde — 5 Mo maximum.');
  }

  const { chemin, url } = await envoyerPetitFichier(
    'avatar',
    `photo.${extensionDe(fichier.name, 'jpg')}`,
    fichier,
    fichier.type
  );
  await enregistrerProfil({ avatarUrl: url, avatarPath: chemin });
  return { chemin, url };
}

/** Retire la photo : le fichier d'abord, la référence ensuite. */
export async function retirerAvatar(chemin) {
  if (chemin) await supprimerFichier(chemin);
  await enregistrerProfil({ avatarUrl: null, avatarPath: null });
}
