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
  cmd('2026-08-02', 30, 0, 'Inéligible', 'Crème'),
  cmd('2026-08-15', 20, 2, 'Réglée', 'Crème'),
];

describe('totaux', () => {
  test('somme les montants et compte chaque statut', () => {
    const t = totaux(JEU);
    assert.equal(t.ca, 200);
    assert.equal(t.com, 17);
    assert.equal(t.orders, 4);
    assert.equal(t.reglees, 2);
    assert.equal(t.attente, 1);
    assert.equal(t.ineligibles, 1);
  });

  test('le panier moyen porte sur toutes les commandes', () => {
    assert.equal(totaux(JEU).panier, 50);
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
    assert.equal(e.caT, 100);
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
    assert.equal(s[0].ca, 180);
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
    assert.equal(top[0].name, 'Crème');
    assert.equal(top[0].ca, 100);
    assert.equal(top[0].orders, 3);
    assert.equal(top[1].name, 'Sérum');
    assert.equal(top[1].ca, 100);
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
