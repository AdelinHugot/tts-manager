/**
 * Lecture des exports de commissions TikTok Shop.
 *
 * Porté depuis la V1, dont le format de colonnes est le fruit de l'observation
 * des exports réels. Aucune dépendance à Firebase : c'est de l'analyse de texte,
 * et ça doit rester vérifiable sans réseau. SheetJS n'est chargé qu'à la demande,
 * pour ne pas peser sur le bundle de celles qui n'importent jamais rien.
 *
 * Les commandes produites portent les noms de champs du stockage
 * (`productName`, `price`, `commissionStandard`…), pas ceux de la vue : c'est
 * la forme qui part en base, et on ne transforme jamais la donnée au repos.
 */

const EXT_TABLEUR = /\.xlsx?$/i;

/** Montant français : virgule décimale, « / » et vide valant zéro. */
function montant(s) {
  const t = String(s ?? '').trim();
  if (!t || t === '/') return 0;
  const v = parseFloat(t.replace(',', '.'));
  return Number.isNaN(v) ? 0 : v;
}

/** « JJ/MM/AAAA HH:MM:SS » → Date locale à minuit. L'heure n'est pas conservée. */
function dateDe(s) {
  const [jourMois] = String(s).trim().split(' ');
  const [j, m, a] = jourMois.split('/');
  return new Date(+a, +m - 1, +j);
}

const typeDe = (s) => (String(s).toLowerCase().includes('affili') ? 'affiliée' : 'pub_shopping');

function statutDe(s) {
  const t = String(s).trim();
  if (t === 'Réglée') return 'Réglée';
  if (t === 'Inéligible') return 'Inéligible';
  return 'En attente';
}

/**
 * Devine le séparateur d'un fichier CSV.
 *
 * TikTok Shop livre tantôt des virgules, tantôt des points-virgules selon
 * l'export. Se tromper ne produit pas une erreur franche mais une seule colonne
 * géante, donc un fichier « illisible » sans explication : mieux vaut regarder.
 * Les séparateurs entre guillemets ne comptent pas — un nom de produit contient
 * souvent des virgules.
 */
export function detecterSeparateur(premiereLigne) {
  let pointsVirgules = 0;
  let virgules = 0;
  let entreGuillemets = false;

  for (const c of String(premiereLigne ?? '')) {
    if (c === '"') entreGuillemets = !entreGuillemets;
    else if (entreGuillemets) continue;
    else if (c === ';') pointsVirgules++;
    else if (c === ',') virgules++;
  }
  return pointsVirgules > virgules ? ';' : ',';
}

/** Découpe une ligne CSV en respectant les guillemets (RFC 4180). */
function champsCsv(ligne, separateur) {
  const champs = [];
  let courant = '';
  let entreGuillemets = false;

  for (let i = 0; i < ligne.length; i++) {
    const c = ligne[i];
    if (c === '"') {
      if (entreGuillemets && ligne[i + 1] === '"') {
        courant += '"';
        i++;
      } else {
        entreGuillemets = !entreGuillemets;
      }
    } else if (c === separateur && !entreGuillemets) {
      champs.push(courant);
      courant = '';
    } else {
      courant += c;
    }
  }
  champs.push(courant);
  return champs;
}

/* Les deux dispositions de colonnes rencontrées dans les exports réels. */
const COLONNES_CSV = {
  id: 0, date: 1, prix: 2,
  produit: 9, boutique: 12,
  type: 16, statut: 17,
  video: 7, videoEstUnId: false,
  comPub: 38, comStandard: 39,
  minimum: 40,
};

const COLONNES_TABLEUR = {
  id: 0, date: 45, prix: 4,
  produit: 2, boutique: 7,
  type: 12, statut: 13,
  video: 17, videoEstUnId: true,
  comStandard: 35, comPub: 36,
  // Tant qu'une commande n'est pas réglée, les colonnes de commission réelles
  // sont vides : on se rabat alors sur les colonnes « estimées ».
  comStandardEstimee: 25, comPubEstimee: 26,
  minimum: 46,
};

/* ------------------------------------------------ reperage par intitule --- */

/** Compare des intitulés sans se soucier de la casse, des accents ni des espaces. */
function normaliser(libelle) {
  return String(libelle ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Intitulés attendus, du plus précis au plus tolérant.
 *
 * La correspondance est **exacte** après normalisation, jamais partielle :
 * « Commission standard » et « Commission standard estimée » ne diffèrent que
 * par un mot, et les confondre ferait entrer un montant estimé là où un montant
 * réglé est attendu.
 */
const INTITULES = {
  id: ['id de commande'],
  produit: ['nom du produit'],
  prix: ['prix'],
  boutique: ['nom de la boutique'],
  type: ['type de commande'],
  statut: ['statut de reglement de la commission', 'statut de la commande'],
  date: ['date de la commande'],
  video: ['contenu'],
  comStandard: ['commission standard'],
  comPub: ['commission des publicites shopping', 'commission de publicites shopping'],
  comStandardEstimee: ['commission standard estimee'],
  comPubEstimee: [
    'commission de publicites shopping estimee',
    'commission des publicites shopping estimee',
  ],
};

/** Champs sans lesquels une ligne ne peut être ni identifiée, ni datée, ni valorisée. */
const INDISPENSABLES = ['id', 'date', 'produit', 'prix'];

/**
 * Déduit la disposition des colonnes de la ligne d'en-tête.
 *
 * C'est la méthode à privilégier : TikTok Shop ajoute et déplace des colonnes
 * d'un export à l'autre — « Date de la commande » est passée de la position 45
 * à la 46 — et une disposition figée se périme en silence. Un intitulé, lui,
 * reste stable.
 *
 * Renvoie null si l'en-tête ne permet pas de situer l'essentiel ; on se rabat
 * alors sur les positions historiques.
 */
function dispositionParEntete(entete) {
  if (!Array.isArray(entete)) return null;

  const positions = new Map();
  entete.forEach((libelle, i) => {
    const cle = normaliser(libelle);
    if (cle && !positions.has(cle)) positions.set(cle, i);
  });

  const col = {};
  for (const [champ, intitules] of Object.entries(INTITULES)) {
    for (const intitule of intitules) {
      if (positions.has(intitule)) {
        col[champ] = positions.get(intitule);
        break;
      }
    }
  }

  if (INDISPENSABLES.some((champ) => col[champ] === undefined)) return null;

  const indices = Object.values(col).filter((v) => typeof v === 'number');
  col.minimum = Math.max(...indices) + 1;
  return col;
}

/** En-tête exploitable → on suit les intitulés ; sinon, positions historiques. */
function disposition(entete) {
  return (
    dispositionParEntete(entete) ||
    (String(entete?.[45] ?? '').toLowerCase().includes('date') ? COLONNES_TABLEUR : COLONNES_CSV)
  );
}

/**
 * Convertit des lignes brutes en commandes.
 *
 * Les doublons internes au fichier sont écrasés par la dernière occurrence : un
 * même numéro de commande ne peut donc produire qu'une seule fiche, quel que
 * soit le nombre de fois qu'il apparaît.
 */
export function analyserLignes(lignes) {
  const parNumero = new Map();
  let ignorees = 0;

  if (!lignes || lignes.length < 2) return { commandes: [], ignorees: 0, doublonsDansLeFichier: 0 };

  const col = disposition(lignes[0]);
  let doublonsDansLeFichier = 0;

  for (let i = 1; i < lignes.length; i++) {
    const c = lignes[i];
    if (!c || c.length < col.minimum) {
      ignorees++;
      continue;
    }

    const numero = String(c[col.id] ?? '').trim();
    const dateBrute = String(c[col.date] ?? '').trim();
    const produit = String(c[col.produit] ?? '').trim();

    // Sans numéro, pas de dédoublonnage possible : la ligne est inexploitable.
    // Un numéro contenant « / » ou valant « . » / « .. » ne peut pas servir
    // d'identifiant de document : mieux vaut l'écarter ici que voir l'écriture
    // échouer au milieu d'un import.
    const numeroUtilisable = numero && !/[/\\]/.test(numero) && numero !== '.' && numero !== '..';
    if (!numeroUtilisable || !dateBrute || !produit) {
      ignorees++;
      continue;
    }

    const date = dateDe(dateBrute);
    if (Number.isNaN(date.getTime())) {
      ignorees++;
      continue;
    }

    // Selon l'export, la colonne porte une URL complète ou un identifiant nu.
    // On le déduit de la valeur plutôt que de la disposition : c'est vrai dans
    // les deux formats, et ça ne se périme pas.
    const videoBrute = String(c[col.video] ?? '').trim();
    const videoUrl = !videoBrute
      ? ''
      : /^https?:/i.test(videoBrute)
        ? videoBrute
        : `https://www.tiktok.com/video/${videoBrute}`;

    const comStandard =
      montant(c[col.comStandard]) ||
      (col.comStandardEstimee !== undefined ? montant(c[col.comStandardEstimee]) : 0);
    const comPub =
      montant(c[col.comPub]) ||
      (col.comPubEstimee !== undefined ? montant(c[col.comPubEstimee]) : 0);

    if (parNumero.has(numero)) doublonsDansLeFichier++;

    parNumero.set(numero, {
      id: numero,
      date,
      productName: produit,
      boutiqueName: String(c[col.boutique] ?? '').trim(),
      price: montant(c[col.prix]),
      commissionStandard: comStandard,
      commissionPub: comPub,
      orderType: typeDe(c[col.type]),
      status: statutDe(c[col.statut]),
      videoUrl,
    });
  }

  return { commandes: [...parNumero.values()], ignorees, doublonsDansLeFichier };
}

/** Analyse un export CSV (locale française). */
export function analyserCsv(texte) {
  const propre = texte.startsWith('﻿') ? texte.slice(1) : texte;
  const lignes = propre.split(/\r?\n/).filter((l) => l.trim());
  if (!lignes.length) return { commandes: [], ignorees: 0, doublonsDansLeFichier: 0 };
  const separateur = detecterSeparateur(lignes[0]);
  return analyserLignes(lignes.map((l) => champsCsv(l, separateur)));
}

/** Analyse un export tableur. SheetJS n'est chargé qu'ici. */
export async function analyserTableur(buffer) {
  const XLSX = await import('xlsx');
  const classeur = XLSX.read(buffer, { type: 'array', cellText: true, cellDates: false });
  const feuille = classeur.Sheets[classeur.SheetNames[0]];
  const brut = XLSX.utils.sheet_to_json(feuille, { header: 1, defval: '', raw: false });
  return analyserLignes(brut.map((ligne) => ligne.map((cell) => String(cell ?? ''))));
}

/** Analyse un fichier choisi par l'utilisatrice, d'après son extension. */
export async function analyserFichier(fichier) {
  if (EXT_TABLEUR.test(fichier.name)) return analyserTableur(await fichier.arrayBuffer());
  return analyserCsv(await fichier.text());
}
