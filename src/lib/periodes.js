/**
 * Bornes des périodes du tableau de bord.
 *
 * Isolé de Firebase et de React : ce sont des mathématiques de calendrier, et
 * c'est exactement le genre de code qu'on veut pouvoir vérifier sans réseau —
 * les fins de mois, les trimestres et les changements d'année sont des nids à
 * erreurs qu'un test attrape et qu'une relecture laisse passer.
 *
 * Les dates sont des **jours locaux** au format `AAAA-MM-JJ`, cohérents avec la
 * lecture des commandes : une commande passée à 00h30 à Paris appartient à son
 * jour parisien, pas au jour UTC de la veille.
 */

const deux = (n) => (n < 10 ? '0' + n : String(n));

/** `AAAA-MM-JJ` d'une Date, en heure locale. */
export function jour(d) {
  return `${d.getFullYear()}-${deux(d.getMonth() + 1)}-${deux(d.getDate())}`;
}

/** Intervalle couvrant `nb` mois à partir du mois de `debut`. */
function surMois(annee, mois, nb) {
  return {
    from: jour(new Date(annee, mois, 1)),
    // Le jour 0 du mois suivant est le dernier jour du mois courant : ça évite
    // d'avoir à connaître la longueur des mois et les années bissextiles.
    to: jour(new Date(annee, mois + nb, 0)),
  };
}

/**
 * Définition des six périodes, exprimées en décalage de mois.
 *
 * `decalage` est le nombre de mois à reculer depuis le mois de référence, et
 * `duree` le nombre de mois couverts. La période de comparaison est la même
 * durée, immédiatement avant.
 */
const DEFINITIONS = {
  mois: { gran: 'day', duree: 1, recul: 0 },
  moisprec: { gran: 'day', duree: 1, recul: 1 },
  trim: { gran: 'week', duree: 3, recul: 0 },
  trimprec: { gran: 'week', duree: 3, recul: 1 },
  annee: { gran: 'month', duree: 12, recul: 0 },
  anneeprec: { gran: 'month', duree: 12, recul: 1 },
};

export const PERIODES_CONNUES = Object.keys(DEFINITIONS);

/** Premier mois de la période contenant `reference`, pour une durée donnée. */
function moisDeDepart(reference, duree) {
  const annee = reference.getFullYear();
  const mois = reference.getMonth();
  if (duree === 1) return { annee, mois };
  if (duree === 3) return { annee, mois: Math.floor(mois / 3) * 3 }; // trimestre civil
  return { annee, mois: 0 }; // année civile
}

/**
 * Bornes d'une période et de celle qui lui sert de comparaison.
 *
 * `reference` est la date du jour ; la passer en paramètre plutôt que de lire
 * l'horloge rend la fonction vérifiable.
 */
export function bornesPeriode(id, reference = new Date()) {
  const def = DEFINITIONS[id];
  if (!def) throw new Error(`Période inconnue : ${id}`);

  const { annee, mois } = moisDeDepart(reference, def.duree);
  const debut = mois - def.recul * def.duree;

  return {
    gran: def.gran,
    ...surMois(annee, debut, def.duree),
    precedent: surMois(annee, debut - def.duree, def.duree),
  };
}

/** Libellés des mois, pour l'axe du graphique. */
const MOIS_COURTS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

/**
 * Découpe une période en intervalles d'affichage, selon sa granularité.
 *
 * Jour pour un mois, semaine pour un trimestre, mois pour une année — soit
 * respectivement une trentaine, une douzaine et douze points, ce qui reste
 * lisible sur la largeur d'un graphique.
 */
export function intervalles({ from, to, gran }) {
  const debut = new Date(`${from}T00:00:00`);
  const fin = new Date(`${to}T00:00:00`);
  const out = [];

  if (gran === 'month') {
    for (let d = new Date(debut); d <= fin; d.setMonth(d.getMonth() + 1)) {
      out.push({
        from: jour(new Date(d.getFullYear(), d.getMonth(), 1)),
        to: jour(new Date(d.getFullYear(), d.getMonth() + 1, 0)),
        label: MOIS_COURTS[d.getMonth()],
      });
    }
    return out;
  }

  if (gran === 'week') {
    let semaine = 1;
    for (let d = new Date(debut); d <= fin; d.setDate(d.getDate() + 7)) {
      const borne = new Date(d);
      borne.setDate(borne.getDate() + 6);
      out.push({
        from: jour(d),
        to: jour(borne > fin ? fin : borne),
        label: 'S' + semaine++,
      });
    }
    return out;
  }

  for (let d = new Date(debut); d <= fin; d.setDate(d.getDate() + 1)) {
    out.push({ from: jour(d), to: jour(d), label: String(d.getDate()) });
  }
  return out;
}
