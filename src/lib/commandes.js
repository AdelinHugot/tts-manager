/**
 * Conversion des commandes TikTok Shop vers le format de la vue.
 *
 * Isolé dans son propre module, sans aucune dépendance à Firebase : c'est ici
 * que se décide comment chaque champ stocké devient une colonne affichée, donc
 * l'endroit qui mérite d'être testable directement, sans émulateur ni réseau.
 *
 * Les documents Firestore portent les noms de champs d'origine (`productName`,
 * `price`, `commissionStandard`…) tandis que la vue issue du design attend les
 * siens (`produit`, `gmv`, `com`…). La conversion se fait à la lecture, jamais
 * à l'écriture : transformer la donnée au repos serait irréversible,
 * la transformer à l'affichage se corrige d'un commit.
 */

const deux = (n) => (n < 10 ? '0' + n : String(n));

/** Date d'une commande, qu'elle soit un Timestamp Firestore, une Date ou un texte. */
function versDate(valeur) {
  if (typeof valeur?.toDate === 'function') return valeur.toDate();
  if (valeur instanceof Date) return valeur;
  if (typeof valeur?.seconds === 'number') return new Date(valeur.seconds * 1000);
  return new Date(valeur);
}

/**
 * Convertit un document en ligne de commande.
 *
 * La date est lue en heure locale, pas en UTC. Une commande passée à 00h30 à
 * Paris est enregistrée la veille en temps universel : l'afficher au jour UTC
 * la ferait basculer dans le mois précédent en début de mois, et décalerait
 * les totaux quotidiens d'une journée entière.
 */
export function adapterCommande(id, d) {
  const date = versDate(d.date);
  const a = date.getFullYear();
  const m = deux(date.getMonth() + 1);
  const j = deux(date.getDate());

  return {
    id,
    dateKey: `${a}-${m}-${j}`,
    dateLabel: `${j}/${m}/${a}`,
    produit: d.productName ?? '',
    vendeur: d.boutiqueName ?? '',
    statut: d.status ?? 'En attente',
    gmv: Number(d.price) || 0,
    // Les deux commissions s'additionnent. Une commande « pub shopping » porte
    // son montant dans commissionPub et 0 dans commissionStandard, une commande
    // affiliée l'inverse : la vue n'affiche qu'un total.
    com: (Number(d.commissionStandard) || 0) + (Number(d.commissionPub) || 0),
    orderType: d.orderType ?? 'affiliée',
    videoUrl: d.videoUrl ?? '',
  };
}

/** Clé de regroupement d'un vendeur : insensible à la casse et aux espaces superflus. */
export function cleVendeur(nom) {
  return String(nom ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('fr');
}

/**
 * Uniformise la graphie des vendeurs sur un jeu de commandes.
 *
 * TikTok Shop renvoie tantôt « LUXALIA », tantôt « Luxalia » pour la même
 * boutique. Sans uniformisation, le filtre les propose comme deux vendeurs
 * distincts, n'en montre qu'une moitié quand on en choisit un, et tout
 * regroupement par marque compte la boutique deux fois.
 *
 * La graphie retenue est la plus fréquente : c'est celle que la boutique emploie
 * le plus souvent, donc celle que l'on reconnaît. À égalité, on prend la
 * première dans l'ordre alphabétique, pour que l'affichage ne dépende pas de
 * l'ordre dans lequel les commandes ont été lues.
 *
 * Les accents ne sont volontairement pas gommés : « Léa » et « Lea » peuvent
 * être deux boutiques différentes, alors que « LUXALIA » et « Luxalia » ne le
 * sont jamais.
 */
export function uniformiserVendeurs(lignes) {
  const graphies = new Map();
  for (const ligne of lignes) {
    const cle = cleVendeur(ligne.vendeur);
    if (!cle) continue;
    const compte = graphies.get(cle) || new Map();
    compte.set(ligne.vendeur, (compte.get(ligne.vendeur) || 0) + 1);
    graphies.set(cle, compte);
  }

  const retenue = new Map();
  for (const [cle, compte] of graphies) {
    const classees = [...compte.entries()].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'fr')
    );
    retenue.set(cle, classees[0][0]);
  }

  return lignes.map((ligne) => {
    const nom = retenue.get(cleVendeur(ligne.vendeur));
    return nom && nom !== ligne.vendeur ? { ...ligne, vendeur: nom } : ligne;
  });
}
