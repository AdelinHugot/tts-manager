/**
 * Tests des indicateurs du tableau de bord.
 *
 * Ce sont les chiffres que l'on lit en premier et que l'on ne recompte jamais :
 * un total faux y est crédible. D'où une attention particulière aux cas
 * dégénérés — période vide, comparaison à zéro — où un calcul naïf produit des
 * « +100 % » ou des NaN qui passent pour des données.
 */
import test, { describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  evolutions, parPartenaire, parProduit, parVendeur, parVideo,
  serie, topProduits, totaux, variation,
} from '../src/lib/statsCommandes.js';

const cmd = (dateKey, gmv, com, statut = 'Réglée', produit = 'Sérum') => ({
  dateKey, gmv, com, statut, produit,
});

const JEU = [
  cmd('2026-08-01', 100, 10),
  cmd('2026-08-01', 50, 5, 'En attente', 'Crème'),
  cmd('2026-08-02', 30, 3, 'Inéligible', 'Crème'),
  cmd('2026-08-15', 20, 2, 'Réglée', 'Crème'),
];

describe('totaux', () => {
  test('somme les montants des commandes retenues et compte chaque statut', () => {
    const t = totaux(JEU);
    // 100 + 50 + 20 : la commande inéligible (30 €, 3 €) est écartée des montants.
    assert.equal(t.ca, 170);
    assert.equal(t.com, 17);
    assert.equal(t.orders, 4);
    assert.equal(t.reglees, 2);
    assert.equal(t.attente, 1);
    assert.equal(t.ineligibles, 1);
  });

  test('le panier moyen rapporte le CA aux seules commandes retenues', () => {
    assert.equal(totaux(JEU).panier, 170 / 3);
  });

  test('une période vide donne des zéros, jamais NaN', () => {
    const t = totaux([]);
    for (const [cle, v] of Object.entries(t)) {
      assert.equal(v, 0, `${cle} devrait valoir 0`);
      assert.ok(Number.isFinite(v), `${cle} ne doit pas être NaN`);
    }
  });

  test('un statut inattendu est compté comme « en attente », jamais perdu', () => {
    const t = totaux([cmd('2026-08-01', 10, 1, 'Remboursée')]);
    assert.equal(t.reglees + t.attente + t.ineligibles, t.orders);
    assert.equal(t.attente, 1);
  });

  test('les trois compteurs de statut couvrent toujours le total', () => {
    const t = totaux(JEU);
    assert.equal(t.reglees + t.attente + t.ineligibles, t.orders);
  });
});

describe('variation', () => {
  test('calcule une hausse et une baisse', () => {
    assert.equal(variation(150, 100), 50);
    assert.equal(variation(50, 100), -50);
    assert.equal(variation(100, 100), 0);
  });

  test('sans point de comparaison, renvoie null plutôt qu’un pourcentage inventé', () => {
    assert.equal(variation(100, 0), null);
    assert.equal(variation(0, 0), null);
  });

  test('tomber à zéro vaut -100 %', () => {
    assert.equal(variation(0, 80), -100);
  });
});

describe('evolutions', () => {
  test('produit les quatre variations attendues par la vue', () => {
    const e = evolutions(totaux(JEU), totaux([cmd('2026-07-01', 100, 10)]));
    assert.deepEqual(Object.keys(e).sort(), ['caT', 'comT', 'ordT', 'panierT']);
    assert.equal(e.caT, 70);
  });

  test('face à une période de comparaison vide, tout est null', () => {
    const e = evolutions(totaux(JEU), totaux([]));
    for (const v of Object.values(e)) assert.equal(v, null);
  });
});

describe('serie', () => {
  const decoupage = [
    { from: '2026-08-01', to: '2026-08-07', label: 'S1' },
    { from: '2026-08-08', to: '2026-08-14', label: 'S2' },
    { from: '2026-08-15', to: '2026-08-21', label: 'S3' },
  ];

  test('range chaque commande dans son intervalle', () => {
    const s = serie(JEU, decoupage);
    assert.deepEqual(s.map((p) => p.label), ['S1', 'S2', 'S3']);
    assert.equal(s[0].ca, 150);
    assert.equal(s[1].ca, 0);
    assert.equal(s[2].ca, 20);
  });

  test('la somme de la série égale le total de la période', () => {
    const s = serie(JEU, decoupage);
    assert.equal(s.reduce((a, p) => a + p.ca, 0), totaux(JEU).ca);
    assert.equal(s.reduce((a, p) => a + p.com, 0), totaux(JEU).com);
  });

  test('un intervalle sans commande vaut zéro, il n’est pas omis', () => {
    const s = serie([], decoupage);
    assert.equal(s.length, 3);
    assert.deepEqual(s.map((p) => p.ca), [0, 0, 0]);
  });

  test('une commande hors des intervalles n’est comptée nulle part', () => {
    const s = serie([cmd('2026-09-01', 999, 99)], decoupage);
    assert.equal(s.reduce((a, p) => a + p.ca, 0), 0);
  });
});

describe('topProduits', () => {
  test('classe par chiffre d’affaires et agrège les commandes', () => {
    const top = topProduits(JEU, 'ca');
    assert.equal(top[0].name, 'Sérum');
    assert.equal(top[0].ca, 100);
    // Crème : 50 + 20, la commande inéligible de 30 € n'entre pas, et la
    // commande correspondante n'est pas comptée non plus.
    assert.equal(top[1].name, 'Crème');
    assert.equal(top[1].ca, 70);
    assert.equal(top[1].orders, 2);
  });

  test('classe aussi par commissions', () => {
    const top = topProduits(JEU, 'com');
    assert.equal(top[0].name, 'Sérum');
    assert.equal(top[0].com, 10);
  });

  test('à égalité, l’ordre alphabétique départage — donc reste stable', () => {
    const a = topProduits(JEU, 'ca').map((p) => p.name);
    const b = topProduits([...JEU].reverse(), 'ca').map((p) => p.name);
    assert.deepEqual(a, b);
  });

  test('limite le nombre de lignes rendues', () => {
    const beaucoup = Array.from({ length: 20 }, (_, i) => cmd('2026-08-01', i, i, 'Réglée', 'P' + i));
    assert.equal(topProduits(beaucoup, 'ca', 5).length, 5);
  });

  test('une liste vide ne produit aucune ligne', () => {
    assert.deepEqual(topProduits([], 'ca'), []);
  });

  test('les commandes sans nom de produit sont écartées', () => {
    const top = topProduits([cmd('2026-08-01', 10, 1, 'Réglée', '')], 'ca');
    assert.deepEqual(top, []);
  });
});

/* ------------------------------------------------------------------------- *
 * Regroupements d'Analytics.
 *
 * L'invariant qui compte n'est pas le détail d'une ligne mais la réconciliation :
 * quelle que soit la façon de regrouper, la somme doit retomber sur le total de
 * la période. Un regroupement qui perd des commandes en route produit des
 * tableaux crédibles et faux.
 * ------------------------------------------------------------------------- */

const vente = (vendeur, produit, gmv, com, videoUrl = 'https://tk/1') => ({
  dateKey: '2026-08-01', gmv, com, statut: 'Réglée', produit, vendeur, videoUrl,
});

const VENTES = [
  vente('medicube France', 'Sérum', 100, 16, 'https://tk/1'),
  vente('medicube France', 'Sérum', 50, 8, 'https://tk/1'),
  vente('medicube France', 'Peel', 30, 5, 'https://tk/2'),
  vente('LUXALIA', 'Monoï', 20, 2, 'https://tk/3'),
];

describe('regroupements Analytics', () => {
  for (const [nom, fn] of [
    ['parVendeur', parVendeur],
    ['parProduit', parProduit],
    ['parPartenaire', parPartenaire],
    ['parVideo', parVideo],
  ]) {
    test(`${nom} : la somme des groupes égale le total de la période`, () => {
      const t = totaux(VENTES);
      const g = fn(VENTES);
      assert.equal(g.reduce((a, x) => a + x.ca, 0), t.ca);
      assert.equal(g.reduce((a, x) => a + x.com, 0), t.com);
      assert.equal(g.reduce((a, x) => a + x.orders, 0), t.orders);
    });
  }

  test('parVendeur cumule par boutique', () => {
    const v = parVendeur(VENTES).find((x) => x.name === 'medicube France');
    assert.equal(v.ca, 180);
    assert.equal(v.com, 29);
    assert.equal(v.orders, 3);
    assert.equal(v.panier, 60);
  });

  test('le taux de commission est le rapport des deux cumuls', () => {
    const v = parVendeur(VENTES).find((x) => x.name === 'LUXALIA');
    assert.equal(v.taux, 10);
  });

  test('un groupe sans chiffre d’affaires ne produit pas de NaN', () => {
    const [v] = parVendeur([vente('Boutique', 'P', 0, 0)]);
    assert.equal(v.taux, 0);
    assert.equal(v.panier, 0);
    assert.ok(Number.isFinite(v.taux) && Number.isFinite(v.panier));
  });

  test('parProduit rattache chaque produit à sa boutique', () => {
    const p = parProduit(VENTES).find((x) => x.name === 'Sérum');
    assert.equal(p.boutique, 'medicube France');
    assert.equal(p.orders, 2);
  });

  test('parPartenaire compte les produits distincts, pas les commandes', () => {
    const pa = parPartenaire(VENTES).find((x) => x.name === 'medicube France');
    assert.equal(pa.orders, 3);
    assert.equal(pa.nbProduits, 2);
  });

  test('parVideo regroupe sur l’URL et retient le produit à défaut de titre', () => {
    const v = parVideo(VENTES);
    assert.equal(v.length, 3);
    const premiere = v.find((x) => x.url === 'https://tk/1');
    assert.equal(premiere.orders, 2);
    assert.equal(premiere.titre, 'Sérum');
  });

  test('les commandes sans clé de regroupement sont écartées, pas comptées à zéro', () => {
    assert.deepEqual(parVendeur([vente('', 'P', 10, 1)]), []);
    assert.deepEqual(parProduit([vente('B', '', 10, 1)]), []);
  });

  test('une période vide ne produit aucun groupe', () => {
    for (const fn of [parVendeur, parProduit, parPartenaire, parVideo]) {
      assert.deepEqual(fn([]), []);
    }
  });
});

/* ------------------------------------------------------------------------- *
 * Commandes inéligibles.
 *
 * Elles ne seront jamais payées : les compter dans les montants gonfle des
 * chiffres sur lesquels on décide quoi filmer. Sur un mois réel, elles
 * représentaient 24 % du GMV affiché. Elles restent comptées en volume et
 * conservées dans l'historique.
 * ------------------------------------------------------------------------- */

const MIXTE = [
  cmd('2026-08-01', 100, 10, 'Réglée', 'Sérum'),
  cmd('2026-08-01', 60, 6, 'En attente', 'Sérum'),
  cmd('2026-08-01', 40, 4, 'Inéligible', 'Sérum'),
];

describe('les inéligibles sortent des montants, pas de l’historique', () => {
  test('ni dans le CA, ni dans les commissions', () => {
    const t = totaux(MIXTE);
    assert.equal(t.ca, 160);
    assert.equal(t.com, 16);
  });

  test('mais comptées en volume et par statut', () => {
    const t = totaux(MIXTE);
    assert.equal(t.orders, 3);
    assert.equal(t.ineligibles, 1);
    assert.equal(t.reglees + t.attente + t.ineligibles, t.orders);
  });

  test('le panier moyen ne divise pas un CA amputé par un volume complet', () => {
    // 160 € sur les 2 commandes retenues, et non sur les 3.
    assert.equal(totaux(MIXTE).panier, 80);
  });

  test('une période entièrement inéligible ne produit aucun montant', () => {
    const t = totaux([cmd('2026-08-01', 99, 9, 'Inéligible')]);
    assert.equal(t.ca, 0);
    assert.equal(t.com, 0);
    assert.equal(t.panier, 0);
    assert.equal(t.orders, 1);
  });

  test('la série du graphique les écarte aussi', () => {
    const s = serie(MIXTE, [{ from: '2026-08-01', to: '2026-08-01', label: 'J' }]);
    assert.equal(s[0].ca, 160);
    assert.equal(s[0].com, 16);
  });

  test('le top produits les écarte aussi', () => {
    const [p] = topProduits(MIXTE, 'ca');
    assert.equal(p.ca, 160);
    assert.equal(p.orders, 2);
  });

  for (const [nom, fn] of [
    ['parVendeur', parVendeur],
    ['parProduit', parProduit],
    ['parPartenaire', parPartenaire],
    ['parVideo', parVideo],
  ]) {
    test(`${nom} reste réconcilié avec le total, inéligibles écartées`, () => {
      const avecInel = VENTES.concat([
        { ...vente('medicube France', 'Sérum', 500, 90), statut: 'Inéligible' },
      ]);
      const t = totaux(avecInel);
      const g = fn(avecInel);
      assert.equal(g.reduce((a, x) => a + x.ca, 0), t.ca);
      assert.equal(g.reduce((a, x) => a + x.com, 0), t.com);
    });
  }
});
