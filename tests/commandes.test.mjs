/**
 * Tests de la conversion des commandes vers le format de la vue.
 *
 * Le document de référence utilisé ici est une commande réelle de la base
 * (id 576778595134839565) : c'est elle qui a servi à établir la correspondance
 * des champs, en recoupant son montant avec les agrégats mensuels.
 *
 * Aucune dépendance à Firebase : le module vit à part précisément pour rester
 * testable sans émulateur ni réseau.
 */
import test, { describe } from 'node:test';
import assert from 'node:assert/strict';

import { adapterCommande, cleVendeur, uniformiserVendeurs } from '../src/lib/commandes.js';

/** Imite un Timestamp Firestore. */
const timestamp = (secondes) => ({ toDate: () => new Date(secondes * 1000) });

const COMMANDE_REELLE = {
  date: timestamp(1755554400),
  productName: 'Vitamine C pure en poudre 500 grammes (acide L-ascorbique)',
  boutiqueName: 'NUTRIZOÉ SHOP',
  price: 20.4,
  commissionStandard: 0,
  commissionPub: 7.2,
  orderType: 'pub_shopping',
  status: 'Réglée',
  videoUrl: 'https://www.tiktok.com/@dorian_scal3/video/7540061378007108886',
};

describe('adapterCommande', () => {
  test('convertit une commande réelle vers les champs de la vue', () => {
    const o = adapterCommande('576778595134839565', COMMANDE_REELLE);

    assert.equal(o.id, '576778595134839565');
    assert.equal(o.produit, COMMANDE_REELLE.productName);
    assert.equal(o.vendeur, 'NUTRIZOÉ SHOP');
    assert.equal(o.statut, 'Réglée');
    assert.equal(o.gmv, 20.4);
    assert.equal(o.orderType, 'pub_shopping');
    assert.equal(o.videoUrl, COMMANDE_REELLE.videoUrl);
  });

  test('additionne les deux commissions', () => {
    const base = { ...COMMANDE_REELLE };
    assert.equal(adapterCommande('x', base).com, 7.2);
    assert.equal(
      adapterCommande('x', { ...base, commissionStandard: 3.5, commissionPub: 0 }).com,
      3.5
    );
    assert.equal(
      adapterCommande('x', { ...base, commissionStandard: 1.25, commissionPub: 2.75 }).com,
      4
    );
  });

  test('date lue en heure locale, pas en UTC', () => {
    // 1755554400 = 18/08/2025 22h00 UTC = 19/08/2025 00h00 à Paris.
    // Le jour retenu doit être celui de la personne qui consulte.
    const attendu = new Date(1755554400 * 1000);
    const o = adapterCommande('x', COMMANDE_REELLE);
    assert.equal(o.dateKey.slice(0, 4), String(attendu.getFullYear()));
    assert.equal(Number(o.dateKey.slice(8, 10)), attendu.getDate());
    assert.equal(Number(o.dateKey.slice(5, 7)), attendu.getMonth() + 1);
  });

  test('dateLabel est le jour de dateKey, en format français', () => {
    const o = adapterCommande('x', COMMANDE_REELLE);
    const [a, m, j] = o.dateKey.split('-');
    assert.equal(o.dateLabel, `${j}/${m}/${a}`);
  });

  test('accepte une Date et un objet { seconds } en plus du Timestamp', () => {
    const ref = adapterCommande('x', COMMANDE_REELLE).dateKey;
    assert.equal(adapterCommande('x', { ...COMMANDE_REELLE, date: new Date(1755554400 * 1000) }).dateKey, ref);
    assert.equal(adapterCommande('x', { ...COMMANDE_REELLE, date: { seconds: 1755554400 } }).dateKey, ref);
  });

  test('un document incomplet ne fait pas tomber la vue', () => {
    const o = adapterCommande('vide', { date: timestamp(1755554400) });
    assert.equal(o.produit, '');
    assert.equal(o.vendeur, '');
    assert.equal(o.gmv, 0);
    assert.equal(o.com, 0);
    assert.equal(o.statut, 'En attente');
  });
});

/** Raccourci : n commandes portant cette graphie de vendeur. */
const lots = (graphie, n) => Array.from({ length: n }, (_, i) => ({ id: `${graphie}-${i}`, vendeur: graphie }));

describe('cleVendeur', () => {
  test('ignore la casse et les espaces superflus', () => {
    const attendu = cleVendeur('LUXALIA');
    assert.equal(cleVendeur('Luxalia'), attendu);
    assert.equal(cleVendeur('  luxalia  '), attendu);
    assert.equal(cleVendeur('LUXALIA'), attendu);
  });

  test('réduit les espaces internes multiples', () => {
    assert.equal(cleVendeur('medicube   France'), cleVendeur('medicube France'));
  });

  test('ne gomme pas les accents — deux boutiques peuvent légitimement différer', () => {
    assert.notEqual(cleVendeur('Léa Shop'), cleVendeur('Lea Shop'));
  });

  test('un vendeur absent donne une clé vide', () => {
    assert.equal(cleVendeur(undefined), '');
    assert.equal(cleVendeur('   '), '');
  });
});

describe('uniformiserVendeurs', () => {
  test('rassemble les graphies sur la plus fréquente', () => {
    const lignes = [...lots('LUXALIA', 2), ...lots('Luxalia', 7)];
    const noms = new Set(uniformiserVendeurs(lignes).map((l) => l.vendeur));
    assert.deepEqual([...noms], ['Luxalia']);
  });

  test('la graphie majoritaire l’emporte quel que soit l’ordre de lecture', () => {
    const a = uniformiserVendeurs([...lots('Luxalia', 7), ...lots('LUXALIA', 2)]);
    const b = uniformiserVendeurs([...lots('LUXALIA', 2), ...lots('Luxalia', 7)]);
    assert.equal(new Set(a.map((l) => l.vendeur)).size, 1);
    assert.deepEqual([...new Set(a.map((l) => l.vendeur))], [...new Set(b.map((l) => l.vendeur))]);
  });

  test('à égalité, le choix reste le même quel que soit l’ordre', () => {
    const a = uniformiserVendeurs([...lots('LUXALIA', 3), ...lots('Luxalia', 3)]);
    const b = uniformiserVendeurs([...lots('Luxalia', 3), ...lots('LUXALIA', 3)]);
    assert.deepEqual([...new Set(a.map((l) => l.vendeur))], [...new Set(b.map((l) => l.vendeur))]);
  });

  test('le filtre par vendeur retrouve alors toutes les commandes', () => {
    const lignes = uniformiserVendeurs([...lots('LUXALIA', 2), ...lots('Luxalia', 7)]);
    const choisi = lignes[0].vendeur;
    assert.equal(lignes.filter((l) => l.vendeur === choisi).length, 9);
  });

  test('ne touche pas aux vendeurs réellement distincts', () => {
    const lignes = uniformiserVendeurs([...lots('LUXALIA', 2), ...lots('DreameEU', 3)]);
    assert.deepEqual([...new Set(lignes.map((l) => l.vendeur))].sort(), ['DreameEU', 'LUXALIA']);
  });

  test('laisse passer une liste vide et les vendeurs manquants', () => {
    assert.deepEqual(uniformiserVendeurs([]), []);
    assert.deepEqual(uniformiserVendeurs([{ id: 'x', vendeur: '' }]), [{ id: 'x', vendeur: '' }]);
  });
});
