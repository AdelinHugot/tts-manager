/**
 * Construction des chemins de stockage.
 *
 * Isolé dans son propre module, sans aucune dépendance à Firebase : c'est ici
 * que se décide où atterrit chaque fichier, donc l'endroit qui mérite d'être
 * testable directement, sans émulateur ni réseau.
 */

/** Dossiers autorisés — doivent correspondre aux blocs de storage.rules. */
export const DOSSIERS = Object.freeze([
  'rushes',
  'videos',
  'ideas',
  'thumbnails',
  'products',
  'avatar',
]);

const DOSSIERS_VALIDES = new Set(DOSSIERS);

/**
 * Nettoie un nom de fichier.
 *
 * Un nom contenant `/` ou `..` ne permettrait pas de sortir de son espace — les
 * règles Storage filtrent sur un segment unique, donc le serveur refuserait —
 * mais mieux vaut que la tentative échoue ici, avec un message clair, qu'au
 * bout d'un envoi de 1 Go. Les accents et espaces sont conservés : ils sont
 * légitimes dans un nom de rush.
 */
export function nettoyerNomFichier(nom) {
  const brut = String(nom ?? '').trim();
  if (!brut) throw new Error('Nom de fichier vide');

  const invalide =
    /[/\\]/.test(brut) || // séparateurs de chemin
    // eslint-disable-next-line no-control-regex
    /[\u0000-\u001f\u007f]/.test(brut) || // caractères de contrôle
    brut === '.' ||
    brut === '..';

  if (invalide) throw new Error(`Nom de fichier invalide : ${JSON.stringify(nom)}`);
  return brut;
}

/**
 * Chemin complet d'un objet dans le bucket.
 *
 * Le préfixe `users/{uid}/` n'est pas décoratif : les règles Storage comparent
 * ce segment à `request.auth.uid`. C'est le cloisonnement lui-même.
 */
export function cheminUtilisateur(uid, dossier, nomFichier) {
  const compte = String(uid ?? '').trim();
  if (!compte) throw new Error('uid manquant');
  if (!DOSSIERS_VALIDES.has(dossier)) throw new Error(`Dossier de stockage inconnu : ${dossier}`);
  return `users/${compte}/${dossier}/${nettoyerNomFichier(nomFichier)}`;
}

/** Extension d'un nom de fichier, en minuscules, sans le point. */
export function extensionDe(nom, defaut = 'mp4') {
  const texte = String(nom ?? '');
  const point = texte.lastIndexOf('.');
  if (point <= 0 || point === texte.length - 1) return defaut;
  return texte.slice(point + 1).toLowerCase();
}
