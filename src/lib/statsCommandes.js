/**
 * Indicateurs du tableau de bord, calculés à partir des commandes.
 *
 * Sans dépendance à Firebase ni à React : ce sont des sommes et des
 * regroupements, donc du code qui se vérifie par l'exemple. Les commandes
 * reçues ici ont déjà la forme de la vue (`gmv`, `com`, `statut`…).
 */

/**
 * Une commande inéligible compte-t-elle dans les montants ?
 *
 * Non. Une commande inéligible ne sera jamais payée : la faire entrer dans le
 * chiffre d'affaires ou les commissions gonfle des chiffres sur lesquels on
 * prend des décisions. L'export porte pourtant une commission « estimée » pour
 * ces commandes — c'est ce que TikTok aurait versé si elles avaient été
 * retenues, pas ce qu'elles rapportent.
 *
 * Elles restent comptées en volume et conservées dans l'historique : on veut
 * savoir combien on en perd, et sur quels produits.
 */
export const compteDansLesMontants = (c) => c.statut !== 'Inéligible';

/** Totaux d'un ensemble de commandes. */
export function totaux(commandes) {
  let ca = 0;
  let com = 0;
  let reglees = 0;
  let attente = 0;
  let ineligibles = 0;

  for (const c of commandes) {
    if (compteDansLesMontants(c)) {
      ca += c.gmv || 0;
      com += c.com || 0;
    }
    if (c.statut === 'Réglée') reglees++;
    else if (c.statut === 'Inéligible') ineligibles++;
    else attente++;
  }

  // Panier moyen rapporté aux seules commandes qui portent un montant, sinon
  // on diviserait un CA amputé par un volume complet.
  const retenues = commandes.length - ineligibles;

  return {
    ca,
    com,
    orders: commandes.length,
    reglees,
    attente,
    ineligibles,
    panier: retenues ? ca / retenues : 0,
  };
}

/**
 * Variation en pourcentage entre deux valeurs.
 *
 * Renvoie null quand la période de comparaison est vide : annoncer « +100 % »
 * en partant de zéro ne veut rien dire, et afficher « — » est plus honnête
 * qu'un chiffre inventé.
 */
export function variation(courant, precedent) {
  if (!precedent) return null;
  return ((courant - precedent) / precedent) * 100;
}

/** Les quatre variations affichées en tête du tableau de bord. */
export function evolutions(courant, precedent) {
  return {
    caT: variation(courant.ca, precedent.ca),
    comT: variation(courant.com, precedent.com),
    ordT: variation(courant.reglees, precedent.reglees),
    panierT: variation(courant.panier, precedent.panier),
  };
}

/**
 * Série du graphique : un point par intervalle, dans l'ordre.
 *
 * Les commandes sont rangées par jour une seule fois puis distribuées, plutôt
 * que de reparcourir la liste pour chaque intervalle : sur une année, la
 * différence se voit.
 */
export function serie(commandes, decoupage) {
  const parJour = new Map();
  for (const c of commandes) {
    if (!compteDansLesMontants(c)) continue;
    const b = parJour.get(c.dateKey) || { ca: 0, com: 0 };
    b.ca += c.gmv || 0;
    b.com += c.com || 0;
    parJour.set(c.dateKey, b);
  }

  return decoupage.map(({ from, to, label }) => {
    let ca = 0;
    let com = 0;
    for (const [jour, b] of parJour) {
      if (jour >= from && jour <= to) {
        ca += b.ca;
        com += b.com;
      }
    }
    return { label, ca, com };
  });
}

/**
 * Produits les plus performants, classés sur la métrique demandée.
 *
 * Le regroupement se fait sur le nom du produit : c'est ce que l'export fournit
 * et ce que la vue affiche. Deux libellés différents restent donc deux produits,
 * ce qui est le comportement attendu tant qu'on n'a pas d'identifiant produit
 * en base.
 */
export function topProduits(commandes, metrique = 'ca', combien = 5) {
  const parProduit = new Map();

  for (const c of commandes) {
    const nom = c.produit || '';
    if (!nom || !compteDansLesMontants(c)) continue;
    const b = parProduit.get(nom) || { name: nom, ca: 0, com: 0, orders: 0 };
    b.ca += c.gmv || 0;
    b.com += c.com || 0;
    b.orders++;
    parProduit.set(nom, b);
  }

  return [...parProduit.values()]
    .sort((a, b) => b[metrique] - a[metrique] || a.name.localeCompare(b.name, 'fr'))
    .slice(0, combien);
}

/**
 * Regroupe des commandes et cumule montants, volumes et ratios.
 *
 * `cle` désigne le champ de regroupement, `enrichir` ajoute au besoin des
 * informations issues de la première commande du groupe — la boutique d'un
 * produit, par exemple.
 */
function regrouper(commandes, cle, enrichir) {
  const groupes = new Map();

  for (const c of commandes) {
    const nom = c[cle];
    if (!nom || !compteDansLesMontants(c)) continue;
    let g = groupes.get(nom);
    if (!g) {
      g = { name: nom, ca: 0, com: 0, orders: 0 };
      if (enrichir) enrichir(g, c);
      groupes.set(nom, g);
    }
    g.ca += c.gmv || 0;
    g.com += c.com || 0;
    g.orders++;
  }

  return [...groupes.values()].map((g) => ({
    ...g,
    panier: g.orders ? g.ca / g.orders : 0,
    // Taux de commission du groupe. Sans chiffre d'affaires il n'y a pas de
    // taux : zéro serait aussi faux qu'un NaN, mais au moins il ne casse rien.
    taux: g.ca ? (g.com / g.ca) * 100 : 0,
  }));
}

/** Performances par boutique. */
export function parVendeur(commandes) {
  return regrouper(commandes, 'vendeur');
}

/** Performances par produit, avec la boutique qui le vend. */
export function parProduit(commandes) {
  return regrouper(commandes, 'produit', (g, c) => {
    g.boutique = c.vendeur || '';
  });
}

/**
 * Performances par vidéo.
 *
 * Le regroupement se fait sur l'URL TikTok, seule information stable dont
 * disposent les commandes. Le titre de la vidéo n'est pas dans la commande :
 * à défaut, on affiche le produit, et le vrai titre viendra le jour où les
 * réalisations seront branchées.
 */
export function parVideo(commandes) {
  const groupes = regrouper(commandes, 'videoUrl', (g, c) => {
    g.produit = c.produit || '';
  });
  return groupes.map((g) => ({ ...g, titre: g.produit, url: g.name }));
}

/** Boutiques, avec le nombre de produits distincts vendus sur la période. */
export function parPartenaire(commandes) {
  const produitsParVendeur = new Map();
  for (const c of commandes) {
    if (!c.vendeur || !compteDansLesMontants(c)) continue;
    const s = produitsParVendeur.get(c.vendeur) || new Set();
    if (c.produit) s.add(c.produit);
    produitsParVendeur.set(c.vendeur, s);
  }
  return parVendeur(commandes).map((v) => ({
    ...v,
    nbProduits: (produitsParVendeur.get(v.name) || new Set()).size,
  }));
}
