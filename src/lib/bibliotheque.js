import { ecouter, enregistrer, modifier, supprimer, supprimerAvecFichiers } from './firestore.js';
import { envoyerFichier, lireDuree } from './storage.js';
import { extensionDe } from './chemins.js';

/**
 * Bibliothèques de fichiers — Vidéos et Rushs.
 *
 * Les deux pages sont la même chose : une arborescence d'un seul niveau, des
 * dossiers et des fichiers, du glisser-déposer. Une seule couche les sert donc
 * toutes les deux, paramétrée par le nom de la collection. Les dupliquer aurait
 * garanti qu'elles divergent — un correctif appliqué d'un côté et pas de
 * l'autre, et deux comportements pour un seul concept.
 *
 * La collection Firestore et le dossier de stockage portent le même nom, ce qui
 * évite une table de correspondance de plus.
 */

export const VIDEOS = 'videos';
export const RUSHES = 'rushes';

const CONNUES = new Set([VIDEOS, RUSHES]);

function verifier(collection) {
  if (!CONNUES.has(collection)) throw new Error(`Bibliothèque inconnue : ${collection}`);
  return collection;
}

/** Identifiant triable dans l'ordre de création, sans collision entre onglets. */
function nouvelId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Écoute une bibliothèque. Renvoie la fonction de désabonnement. */
export function ecouterBibliotheque(collection, onChange, onError) {
  return ecouter(verifier(collection), onChange, onError);
}

/** Crée un dossier, éventuellement à l'intérieur d'un autre. */
export async function creerDossier(collection, nom, parent = null) {
  const id = nouvelId();
  await enregistrer(verifier(collection), id, { kind: 'folder', name: nom, parent });
  return id;
}

/**
 * Envoie un fichier puis crée la fiche qui le référence.
 *
 * Le fichier part en premier : créer la fiche avant l'envoi ferait apparaître
 * une vidéo qui n'arrivera peut-être jamais. Le nom stocké dérive de
 * l'identifiant et non du nom d'origine — deux « export final.mp4 » envoyés le
 * même jour ne doivent pas s'écraser l'un l'autre.
 *
 * La durée est lue localement avant l'envoi : la demander au navigateur coûte
 * quelques millisecondes, la recalculer plus tard imposerait de retélécharger
 * le fichier.
 */
export async function envoyerDansBibliotheque(collection, fichier, parent = null, onAvancement) {
  verifier(collection);
  const id = nouvelId();
  const ext = extensionDe(fichier.name);
  const duree = await lireDuree(fichier);

  const { chemin, url } = await envoyerFichier(collection, `${id}.${ext}`, fichier, onAvancement);

  const fiche = {
    kind: 'file',
    name: fichier.name,
    parent,
    size: fichier.size || 0,
    ext: ext.toUpperCase(),
    duration: duree,
    url,
    chemin,
  };
  // Seules les vidéos montées portent un statut de production ; un rush est un
  // fichier brut, il n'a pas d'étape.
  if (collection === VIDEOS) fiche.status = 'À monter';

  await enregistrer(collection, id, fiche);
  return id;
}

export function renommer(collection, id, nom) {
  return modifier(verifier(collection), id, { name: nom });
}

export function deplacer(collection, id, parent) {
  return modifier(verifier(collection), id, { parent: parent ?? null });
}

export function changerStatut(collection, id, statut) {
  return modifier(verifier(collection), id, { status: statut });
}

/**
 * Supprime un élément — et, pour un dossier, tout ce qu'il contient.
 *
 * Firestore ne connaît pas la hiérarchie : `parent` n'est qu'un champ, et
 * supprimer un dossier laisserait ses fichiers en place, invisibles puisque
 * plus rien ne les affiche, mais toujours facturés. On descend donc l'arbre
 * explicitement, à partir de la liste déjà en mémoire.
 *
 * Les fichiers partent avant leurs fiches : si un envoi échoue, l'élément reste
 * visible et la suppression peut être relancée, là où l'ordre inverse
 * produirait un objet orphelin introuvable.
 */
export async function supprimerElement(collection, element, tous = []) {
  verifier(collection);

  const aSupprimer = [element];
  if (element.kind === 'folder') {
    for (const e of tous) {
      if (e.parent === element.id) aSupprimer.push(e);
    }
  }

  for (const e of aSupprimer) {
    if (e.chemin) await supprimerAvecFichiers(collection, e.id, [e.chemin]);
    else await supprimer(collection, e.id);
  }
  return aSupprimer.length;
}
