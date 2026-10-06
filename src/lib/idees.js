import { ecouter, enregistrer, modifier, supprimer, supprimerAvecFichiers } from './firestore.js';
import { envoyerFichier } from './storage.js';
import { extensionDe } from './chemins.js';

/**
 * Idées — persistance.
 *
 * Une fine couche au-dessus de `firestore.js` et `storage.js`, qui se contente
 * de donner un nom métier aux opérations et de garder au même endroit la forme
 * des documents écrits.
 *
 * La lecture passe par une écoute continue plutôt que par un chargement
 * ponctuel : une idée reste une note qu'on jette vite, souvent depuis un autre
 * appareil, et la voir apparaître sans recharger est l'essentiel du confort.
 */

const COLLECTION = 'ideas';
const DOSSIER = 'ideas';

/**
 * Identifiant de document.
 *
 * Préfixé par l'horodatage en base 36 : les identifiants restent donc triables
 * dans l'ordre de création, ce qui aide à lire la console Firebase. La part
 * aléatoire évite toute collision entre deux onglets ouverts en même temps.
 */
function nouvelId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Écoute les idées du compte connecté. Renvoie la fonction de désabonnement. */
export function ecouterIdees(onChange, onError) {
  return ecouter(COLLECTION, onChange, onError);
}

/** Ajoute une note ou un lien. L'horodatage est posé par le serveur. */
export async function ajouterIdee(contenu) {
  const id = nouvelId();
  await enregistrer(COLLECTION, id, { ...contenu, pinned: false });
  return id;
}

/** Marque ou démarque une idée. */
export function marquerIdee(id, marquee) {
  return modifier(COLLECTION, id, { pinned: !!marquee });
}

/**
 * Supprime une idée, et le fichier qu'elle référence le cas échéant.
 *
 * L'ordre — fichier d'abord, fiche ensuite — est celui de `supprimerAvecFichiers` :
 * si l'envoi échoue, la fiche subsiste et la suppression peut être relancée,
 * là où l'ordre inverse laisserait une vidéo orpheline, facturée et invisible.
 */
export function supprimerIdee(idee) {
  if (idee && idee.chemin) return supprimerAvecFichiers(COLLECTION, idee.id, [idee.chemin]);
  return supprimer(COLLECTION, idee.id);
}

/**
 * Envoie une vidéo puis crée l'idée qui la référence.
 *
 * Le fichier part en premier : créer la fiche avant l'envoi afficherait une
 * idée dont la vidéo n'arrivera peut-être jamais. Le nom stocké est dérivé de
 * l'identifiant, pas du nom d'origine — deux fichiers « export final.mp4 » ne
 * doivent pas s'écraser l'un l'autre.
 */
export async function ajouterIdeeVideo(fichier, onAvancement) {
  const id = nouvelId();
  const { chemin, url } = await envoyerFichier(
    DOSSIER,
    `${id}.${extensionDe(fichier.name)}`,
    fichier,
    onAvancement
  );
  await enregistrer(COLLECTION, id, {
    type: 'video',
    videoUrl: url,
    videoName: fichier.name,
    chemin,
    pinned: false,
  });
  return id;
}
