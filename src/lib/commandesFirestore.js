import {
  getFirestore,
  Timestamp,
  collection,
  count,
  doc,
  documentId,
  getAggregateFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  sum,
  where,
  writeBatch,
} from 'firebase/firestore';

import { app } from './firebase.js';
import { requireUid } from './auth.js';
import { adapterCommande, uniformiserVendeurs } from './commandes.js';
import { jour } from './periodes.js';

/**
 * Commandes — lecture Firestore.
 *
 * Comme le reste de la couche données, tout vit sous `users/{uid}/…` et l'uid
 * est lu sur la session courante, jamais passé en paramètre : une requête hors
 * de son espace est refusée côté serveur.
 *
 * La lecture est **bornée par une période**, jamais globale. Le compte contient
 * plusieurs dizaines de milliers de commandes : les charger toutes rendait
 * l'application inutilisable pendant plusieurs secondes à chaque ouverture.
 *
 * Une fois la période chargée, tri, filtres, pagination et totaux se calculent
 * en mémoire. C'est volontaire : la colonne « Commission » n'existe pas en base
 * — elle est la somme de deux champs, calculée à la lecture — et Firestore ne
 * sait pas trier sur une valeur qu'il ne stocke pas. Un filtre d'intervalle sur
 * la date l'obligerait de surcroît à trier d'abord par date, ce qui interdirait
 * de trier par produit ou par vendeur. Borner puis calculer en mémoire préserve
 * donc toutes les colonnes triables, et rend les totaux exacts sur la période
 * entière plutôt que sur la page affichée.
 */

const db = getFirestore(app);

const commandes = () => collection(db, 'users', requireUid(), 'orders');

/** Début du jour local. Les dates de filtre sont des jours, pas des instants. */
const debutDuJour = (iso) => Timestamp.fromDate(new Date(`${iso}T00:00:00`));
const finDuJour = (iso) => Timestamp.fromDate(new Date(`${iso}T23:59:59.999`));

/**
 * Période à ouvrir par défaut : le mois de la commande la plus récente.
 *
 * Ouvrir sur le mois courant afficherait un écran vide dès qu'un import a du
 * retard — ce qui ressemble à une panne. Partir de la dernière commande connue
 * coûte une seule lecture et garantit d'atterrir sur des données.
 *
 * Renvoie null si le compte n'a aucune commande.
 */
export async function periodeParDefaut() {
  const snap = await getDocs(query(commandes(), orderBy('date', 'desc'), limit(1)));
  if (snap.empty) return null;

  const d = adapterCommande(snap.docs[0].id, snap.docs[0].data());
  const [a, m] = d.dateKey.split('-').map(Number);
  return { from: jour(new Date(a, m - 1, 1)), to: jour(new Date(a, m, 0)) };
}

/**
 * Toutes les commandes d'une période, de la plus récente à la plus ancienne.
 *
 * Sans période, la requête n'est pas bornée : réservé aux cas où l'absence de
 * borne est un choix explicite de l'utilisateur, jamais au chargement initial.
 */
export async function chargerPeriode({ from, to } = {}) {
  const bornes = [];
  if (from) bornes.push(where('date', '>=', debutDuJour(from)));
  if (to) bornes.push(where('date', '<=', finDuJour(to)));

  const snap = await getDocs(query(commandes(), ...bornes, orderBy('date', 'desc')));
  return uniformiserVendeurs(snap.docs.map((d) => adapterCommande(d.id, d.data())));
}

/**
 * Numéros déjà présents en base, parmi ceux fournis.
 *
 * Sert uniquement à rendre compte de l'import (« tant d'ajoutées, tant de mises
 * à jour »). L'absence de doublons, elle, ne dépend pas de cette vérification :
 * elle est garantie par l'identifiant de document — voir importerCommandes.
 */
async function numerosPresents(numeros) {
  const presents = new Set();
  if (!numeros.length) return presents;

  const PAR_REQUETE = 30; // limite Firestore pour un filtre `in`
  const EN_PARALLELE = 10; // au-delà, on sature le navigateur sans aller plus vite

  const paquets = [];
  for (let i = 0; i < numeros.length; i += PAR_REQUETE) {
    paquets.push(numeros.slice(i, i + PAR_REQUETE));
  }

  const col = commandes();
  for (let i = 0; i < paquets.length; i += EN_PARALLELE) {
    const resultats = await Promise.all(
      paquets
        .slice(i, i + EN_PARALLELE)
        .map((p) => getDocs(query(col, where(documentId(), 'in', p))))
    );
    for (const snap of resultats) snap.docs.forEach((d) => presents.add(d.id));
  }
  return presents;
}

/**
 * Écrit des commandes importées.
 *
 * **L'identifiant du document est le numéro de commande TikTok Shop.** C'est là,
 * et nulle part ailleurs, que se joue l'absence de doublons : réimporter un
 * export déjà traité remplace chaque fiche au lieu d'en créer une seconde. Aucun
 * décompte, aucune comparaison préalable n'est nécessaire pour cela — la
 * propriété tient à la structure, pas à la vigilance de l'appelant.
 *
 * L'écrasement est volontairement total : une commande change d'état avec le
 * temps (« En attente » devient « Réglée »), et c'est l'export le plus récent
 * qui fait foi.
 */
export async function importerCommandes(lignes, onAvancement) {
  const col = commandes();
  const presents = await numerosPresents(lignes.map((l) => l.id));

  const PAR_LOT = 400; // sous la limite de 500 écritures par lot
  let ecrites = 0;

  for (let i = 0; i < lignes.length; i += PAR_LOT) {
    const lot = writeBatch(db);
    for (const l of lignes.slice(i, i + PAR_LOT)) {
      lot.set(doc(col, l.id), {
        date: Timestamp.fromDate(l.date),
        productName: l.productName,
        boutiqueName: l.boutiqueName,
        price: l.price,
        commissionStandard: l.commissionStandard,
        commissionPub: l.commissionPub,
        orderType: l.orderType,
        status: l.status,
        ...(l.videoUrl ? { videoUrl: l.videoUrl } : {}),
      });
    }
    await lot.commit();
    ecrites += Math.min(PAR_LOT, lignes.length - i);
    if (onAvancement) onAvancement(ecrites, lignes.length);
  }

  const ajoutees = lignes.reduce((n, l) => n + (presents.has(l.id) ? 0 : 1), 0);
  return { ecrites, ajoutees, misesAJour: lignes.length - ajoutees };
}


/**
 * Commandes d'une période **et** de sa période de comparaison, en une requête.
 *
 * Les deux intervalles sont contigus : les demander ensemble puis les séparer
 * en mémoire évite un aller-retour, et surtout évite de croiser un filtre de
 * date avec un filtre de statut — ce qui réclamerait un index composite que
 * Firestore refuse tant qu'il n'est pas déployé.
 */
export async function chargerPeriodeEtPrecedente(bornes) {
  const lignes = await chargerPeriode({ from: bornes.precedent.from, to: bornes.to });
  const dans = (l, b) => l.dateKey >= b.from && l.dateKey <= b.to;
  return {
    courant: lignes.filter((l) => dans(l, bornes)),
    precedent: lignes.filter((l) => dans(l, bornes.precedent)),
  };
}

// Réexports : la vue n'a ainsi qu'un seul module de données à connaître.
export { analyserFichier } from './importCommandes.js';
export { bornesPeriode, intervalles, jour } from './periodes.js';
export { ecouterIdees, ajouterIdee, ajouterIdeeVideo, marquerIdee, supprimerIdee } from './idees.js';
export { ecouterProfil, enregistrerProfil, envoyerAvatar, retirerAvatar } from './profil.js';
export {
  VIDEOS, RUSHES, ecouterBibliotheque, creerDossier, envoyerDansBibliotheque,
  renommer, deplacer, changerStatut, supprimerElement,
} from './bibliotheque.js';
export {
  totaux, evolutions, serie, topProduits,
  parVendeur, parProduit, parVideo, parPartenaire,
} from './statsCommandes.js';

/**
 * Totaux d'un intervalle, calculés par le serveur.
 *
 * Firestore agrège sans transmettre les documents : compter un mois de
 * commandes coûte quelques lectures au lieu de plusieurs milliers. C'est ce qui
 * rend un résumé de tout l'historique abordable.
 */
async function totauxServeur(from, to) {
  const r = await getAggregateFromServer(
    query(
      commandes(),
      where('date', '>=', debutDuJour(from)),
      where('date', '<=', finDuJour(to))
    ),
    { nb: count(), ca: sum('price'), cs: sum('commissionStandard'), cp: sum('commissionPub') }
  );
  const d = r.data();
  return { nb: d.nb || 0, ca: d.ca || 0, com: (d.cs || 0) + (d.cp || 0) };
}

/**
 * Résumé mois par mois de tout l'historique du compte.
 *
 * Sert à l'assistant : sans lui, il ne voit que la période affichée et conclut
 * que le compte compte deux mille commandes alors qu'il y en a dix fois plus.
 * Lui donner le détail complet serait hors de question — des dizaines de
 * milliers de lignes — mais une ligne par mois tient en quelques centaines de
 * caractères et suffit à raisonner sur une tendance.
 */
export async function resumeMensuel() {
  const col = commandes();
  const [plusAncienne, plusRecente] = await Promise.all([
    getDocs(query(col, orderBy('date', 'asc'), limit(1))),
    getDocs(query(col, orderBy('date', 'desc'), limit(1))),
  ]);
  if (plusAncienne.empty) return [];

  const jourDe = (snap) => adapterCommande(snap.docs[0].id, snap.docs[0].data()).dateKey;
  const [a1, m1] = jourDe(plusAncienne).split('-').map(Number);
  const [a2, m2] = jourDe(plusRecente).split('-').map(Number);

  const mois = [];
  for (let d = new Date(a1, m1 - 1, 1); d <= new Date(a2, m2 - 1, 1); d.setMonth(d.getMonth() + 1)) {
    const premier = new Date(d.getFullYear(), d.getMonth(), 1);
    const dernier = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    mois.push({ premier: jour(premier), dernier: jour(dernier) });
  }

  const totaux = await Promise.all(mois.map((m) => totauxServeur(m.premier, m.dernier)));
  return mois.map((m, i) => ({ mois: m.premier.slice(0, 7), ...totaux[i] }));
}
