import {
  getStorage,
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';

import { app } from './firebase.js';
import { requireUid } from './auth.js';
import { cheminUtilisateur } from './chemins.js';

const storage = getStorage(app);

/**
 * Fichiers — Firebase Storage.
 *
 * Tous les chemins sont préfixés par `users/{uid}/`. Ce n'est pas une
 * convention de nommage mais le mécanisme de cloisonnement lui-même : les
 * règles Storage comparent ce segment à `request.auth.uid`, donc un chemin
 * fabriqué à la main hors de son espace est refusé par le serveur.
 *
 * Aucune fonction d'ici ne prend d'uid en paramètre : il est toujours lu sur la
 * session courante, pour qu'aucun appelant ne puisse écrire ailleurs que chez
 * lui, même par erreur.
 */

function chemin(dossier, nomFichier) {
  return cheminUtilisateur(requireUid(), dossier, nomFichier);
}

/**
 * Envoie un fichier volumineux avec suivi de progression.
 * `onProgress` reçoit un pourcentage entier de 0 à 100.
 * Renvoie le chemin de stockage et l'URL de téléchargement.
 */
export function envoyerFichier(dossier, nomFichier, file, onProgress) {
  const cheminComplet = chemin(dossier, nomFichier);
  const objet = ref(storage, cheminComplet);
  const tache = uploadBytesResumable(objet, file, { contentType: file.type || undefined });

  return new Promise((resolve, reject) => {
    tache.on(
      'state_changed',
      (snap) => {
        if (onProgress && snap.totalBytes) {
          onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
        }
      },
      reject,
      async () => {
        try {
          resolve({ chemin: cheminComplet, url: await getDownloadURL(objet) });
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

/** Envoie un petit fichier (miniature, avatar) en une fois. */
export async function envoyerPetitFichier(dossier, nomFichier, blob, contentType) {
  const cheminComplet = chemin(dossier, nomFichier);
  const objet = ref(storage, cheminComplet);
  await uploadBytes(objet, blob, { contentType: contentType || blob.type || undefined });
  return { chemin: cheminComplet, url: await getDownloadURL(objet) };
}

/**
 * Supprime un objet à partir de son chemin de stockage.
 *
 * Un objet déjà absent n'est pas une erreur : la suppression est idempotente,
 * pour qu'un nouvel essai après un échec partiel aboutisse au lieu de bloquer.
 */
export async function supprimerFichier(cheminComplet) {
  if (!cheminComplet) return;
  try {
    await deleteObject(ref(storage, cheminComplet));
  } catch (err) {
    if (err?.code === 'storage/object-not-found') return;
    throw err;
  }
}

/**
 * Extrait une première image de la vidéo, pour servir de miniature.
 *
 * C'est le principal levier sur la facture : afficher une carte ne doit pas
 * coûter le téléchargement partiel de la vidéo. Renvoie null si le navigateur
 * n'y parvient pas — l'appelant doit savoir s'en passer.
 */
export function extraireMiniature(file, secondes = 1) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    let fini = false;

    const terminer = (valeur) => {
      if (fini) return;
      fini = true;
      URL.revokeObjectURL(url);
      video.removeAttribute('src');
      resolve(valeur);
    };

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.onerror = () => terminer(null);
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(secondes, Math.max(0, (video.duration || 0) / 2));
    };
    video.onseeked = () => {
      try {
        const largeur = 480;
        const ratio = video.videoHeight / video.videoWidth || 0.5625;
        const canvas = document.createElement('canvas');
        canvas.width = largeur;
        canvas.height = Math.round(largeur * ratio);
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => terminer(blob), 'image/jpeg', 0.72);
      } catch {
        terminer(null);
      }
    };

    setTimeout(() => terminer(null), 10000);
    video.src = url;
  });
}

/** Durée d'une vidéo locale, en secondes. null si illisible. */
export function lireDuree(file) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    const terminer = (v) => {
      URL.revokeObjectURL(url);
      resolve(v);
    };
    video.preload = 'metadata';
    video.onloadedmetadata = () => terminer(Number.isFinite(video.duration) ? video.duration : null);
    video.onerror = () => terminer(null);
    video.src = url;
  });
}
