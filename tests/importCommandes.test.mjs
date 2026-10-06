/**
 * Tests de l'analyse des exports de commissions TikTok Shop.
 *
 * L'enjeu central est le numéro de commande : c'est lui qui sert d'identifiant
 * de document, donc lui seul qui empêche les doublons. Une ligne sans numéro
 * exploitable doit être écartée plutôt qu'écrite sous une clé inventée.
 *
 * Aucune dépendance à Firebase ni à SheetJS ici : `analyserLignes` travaille sur
 * des tableaux de chaînes, ce qui rend le format vérifiable sans fichier réel.
 */
import test, { describe } from 'node:test';
import assert from 'node:assert/strict';

import { analyserCsv, analyserLignes, detecterSeparateur } from '../src/lib/importCommandes.js';

/* ---------- fabriques de lignes, calées sur les colonnes réelles ---------- */

const COLONNES_CSV = 40;

function ligneCsv({ id, date, prix, produit, boutique, type, statut, video, comPub, comStd } = {}) {
  const c = Array(COLONNES_CSV).fill('');
  c[0] = id ?? '576778595134839565';
  c[1] = date ?? '19/08/2025 00:30:12';
  c[2] = prix ?? '20,40';
  c[7] = video ?? 'https://www.tiktok.com/@dorian_scal3/video/7540061378007108886';
  c[9] = produit ?? 'Vitamine C pure en poudre 500 grammes';
  c[12] = boutique ?? 'NUTRIZOÉ SHOP';
  c[16] = type ?? 'Commande affiliée';
  c[17] = statut ?? 'Réglée';
  c[38] = comPub ?? '7,20';
  c[39] = comStd ?? '0';
  return c;
}

const ENTETE_CSV = ligneCsv({ id: 'ID de commande', date: 'Date' });

/* Le tableur se reconnaît à « Date de la commande » en colonne 45. */
const COLONNES_TABLEUR = 46;
function ligneTableur({ id, date, comStd, comPub, comStdEst, comPubEst } = {}) {
  const c = Array(COLONNES_TABLEUR).fill('');
  c[0] = id ?? '576778595134839565';
  c[2] = 'Sérum raffermissant';
  c[4] = '16,60';
  c[7] = 'medicube France';
  c[12] = 'Pub shopping';
  c[13] = 'En attente';
  c[17] = '7652668221186706720';
  c[25] = comStdEst ?? '';
  c[26] = comPubEst ?? '';
  c[35] = comStd ?? '';
  c[36] = comPub ?? '';
  c[45] = date ?? '21/08/2026 14:02:00';
  return c;
}
const ENTETE_TABLEUR = (() => {
  const c = Array(COLONNES_TABLEUR).fill('');
  c[45] = 'Date de la commande';
  return c;
})();

/* ------------------------------------------------------------------ tests */

describe('numéro de commande — garantie anti-doublon', () => {
  test('un numéro répété dans le fichier ne produit qu’une commande', () => {
    const r = analyserLignes([
      ENTETE_CSV,
      ligneCsv({ id: '111', statut: 'En attente' }),
      ligneCsv({ id: '111', statut: 'Réglée' }),
      ligneCsv({ id: '222' }),
    ]);
    assert.equal(r.commandes.length, 2);
    assert.equal(r.doublonsDansLeFichier, 1);
    assert.deepEqual(r.commandes.map((c) => c.id).sort(), ['111', '222']);
  });

  test('en cas de répétition, la dernière ligne fait foi', () => {
    const r = analyserLignes([
      ENTETE_CSV,
      ligneCsv({ id: '111', statut: 'En attente' }),
      ligneCsv({ id: '111', statut: 'Réglée' }),
    ]);
    assert.equal(r.commandes[0].status, 'Réglée');
  });

  test('les numéros produits sont uniques, toujours', () => {
    const lignes = [ENTETE_CSV];
    for (let i = 0; i < 50; i++) lignes.push(ligneCsv({ id: String(i % 10) }));
    const ids = analyserLignes(lignes).commandes.map((c) => c.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.equal(ids.length, 10);
  });

  test('analyser deux fois le même fichier donne exactement le même jeu de numéros', () => {
    const lignes = [ENTETE_CSV, ligneCsv({ id: '111' }), ligneCsv({ id: '222' })];
    const a = analyserLignes(lignes).commandes.map((c) => c.id);
    const b = analyserLignes(lignes).commandes.map((c) => c.id);
    assert.deepEqual(a, b);
  });

  test('une ligne sans numéro est écartée, jamais écrite sous une clé inventée', () => {
    const r = analyserLignes([ENTETE_CSV, ligneCsv({ id: '' }), ligneCsv({ id: '   ' })]);
    assert.equal(r.commandes.length, 0);
    assert.equal(r.ignorees, 2);
  });

  test('un numéro inutilisable comme identifiant de document est écarté', () => {
    for (const id of ['a/b', 'a\\b', '.', '..']) {
      const r = analyserLignes([ENTETE_CSV, ligneCsv({ id })]);
      assert.equal(r.commandes.length, 0, `${id} aurait dû être écarté`);
      assert.equal(r.ignorees, 1);
    }
  });
});

describe('analyse des champs', () => {
  test('lit une commande CSV complète', () => {
    const [c] = analyserLignes([ENTETE_CSV, ligneCsv()]).commandes;
    assert.equal(c.id, '576778595134839565');
    assert.equal(c.productName, 'Vitamine C pure en poudre 500 grammes');
    assert.equal(c.boutiqueName, 'NUTRIZOÉ SHOP');
    assert.equal(c.price, 20.4);
    assert.equal(c.commissionPub, 7.2);
    assert.equal(c.commissionStandard, 0);
    assert.equal(c.orderType, 'affiliée');
    assert.equal(c.status, 'Réglée');
  });

  test('la date est lue en jour local, heure ignorée', () => {
    const [c] = analyserLignes([ENTETE_CSV, ligneCsv({ date: '19/08/2025 23:45:00' })]).commandes;
    assert.equal(c.date.getFullYear(), 2025);
    assert.equal(c.date.getMonth() + 1, 8);
    assert.equal(c.date.getDate(), 19);
    assert.equal(c.date.getHours(), 0);
  });

  test('montants à virgule, « / » et vide valant zéro', () => {
    const [c] = analyserLignes([ENTETE_CSV, ligneCsv({ prix: '1 234,56'.replace(' ', ''), comPub: '/', comStd: '' })]).commandes;
    assert.equal(c.price, 1234.56);
    assert.equal(c.commissionPub, 0);
    assert.equal(c.commissionStandard, 0);
  });

  test('statuts inconnus retombent sur « En attente »', () => {
    const cas = [['Réglée', 'Réglée'], ['Inéligible', 'Inéligible'], ['Remboursée', 'En attente'], ['', 'En attente']];
    for (const [brut, attendu] of cas) {
      const [c] = analyserLignes([ENTETE_CSV, ligneCsv({ statut: brut })]).commandes;
      assert.equal(c.status, attendu, `statut « ${brut} »`);
    }
  });

  test('le type se déduit du mot « affili »', () => {
    assert.equal(analyserLignes([ENTETE_CSV, ligneCsv({ type: 'Commande affiliée' })]).commandes[0].orderType, 'affiliée');
    assert.equal(analyserLignes([ENTETE_CSV, ligneCsv({ type: 'Pub shopping' })]).commandes[0].orderType, 'pub_shopping');
  });

  test('une ligne trop courte est ignorée', () => {
    const r = analyserLignes([ENTETE_CSV, ['123', '19/08/2025 00:00:00']]);
    assert.equal(r.commandes.length, 0);
    assert.equal(r.ignorees, 1);
  });

  test('un fichier vide ou sans ligne de données ne produit rien', () => {
    assert.deepEqual(analyserLignes([]).commandes, []);
    assert.deepEqual(analyserLignes([ENTETE_CSV]).commandes, []);
  });
});

describe('format tableur', () => {
  test('reconnu par sa colonne 45, et lu avec ses propres colonnes', () => {
    const [c] = analyserLignes([ENTETE_TABLEUR, ligneTableur({ comStd: '2,16', comPub: '0' })]).commandes;
    assert.equal(c.productName, 'Sérum raffermissant');
    assert.equal(c.boutiqueName, 'medicube France');
    assert.equal(c.price, 16.6);
    assert.equal(c.commissionStandard, 2.16);
    assert.equal(c.orderType, 'pub_shopping');
    assert.equal(c.status, 'En attente');
    assert.equal(c.date.getDate(), 21);
  });

  test('un identifiant de vidéo nu devient une URL complète', () => {
    const [c] = analyserLignes([ENTETE_TABLEUR, ligneTableur()]).commandes;
    assert.equal(c.videoUrl, 'https://www.tiktok.com/video/7652668221186706720');
  });

  test('commissions estimées en repli quand les réelles sont vides', () => {
    const [c] = analyserLignes([
      ENTETE_TABLEUR,
      ligneTableur({ comStd: '', comPub: '', comStdEst: '1,50', comPubEst: '2,50' }),
    ]).commandes;
    assert.equal(c.commissionStandard, 1.5);
    assert.equal(c.commissionPub, 2.5);
  });

  test('les commissions réelles priment sur les estimées', () => {
    const [c] = analyserLignes([
      ENTETE_TABLEUR,
      ligneTableur({ comStd: '3,00', comStdEst: '1,50' }),
    ]).commandes;
    assert.equal(c.commissionStandard, 3);
  });
});

describe('analyserCsv', () => {
  /**
   * Sérialise une ligne comme le fait TikTok Shop : tout champ contenant une
   * virgule — donc tous les montants français — est entouré de guillemets.
   */
  const enCsv = (champs) =>
    champs.map((v) => (/["',]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v)).join(',');

  test('gère les guillemets, les virgules internes et le BOM', () => {
    const texte =
      '﻿' + enCsv(ENTETE_CSV) + '\r\n' + enCsv(ligneCsv({ produit: 'Sérum, vitamine C' })) + '\r\n';
    const r = analyserCsv(texte);
    assert.equal(r.commandes.length, 1);
    assert.equal(r.commandes[0].productName, 'Sérum, vitamine C');
  });

  test('les montants entre guillemets gardent leur virgule décimale', () => {
    const r = analyserCsv([enCsv(ENTETE_CSV), enCsv(ligneCsv({ prix: '1234,56' }))].join('\n'));
    assert.equal(r.commandes[0].price, 1234.56);
  });

  test('un guillemet échappé à l’intérieur d’un champ est restitué', () => {
    const r = analyserCsv([enCsv(ENTETE_CSV), enCsv(ligneCsv({ produit: 'Écran 27" pro' }))].join('\n'));
    assert.equal(r.commandes[0].productName, 'Écran 27" pro');
  });

  test('les lignes vides en fin de fichier ne comptent pas comme ignorées', () => {
    const texte = [enCsv(ENTETE_CSV), enCsv(ligneCsv()), '', '  ', ''].join('\n');
    const r = analyserCsv(texte);
    assert.equal(r.commandes.length, 1);
    assert.equal(r.ignorees, 0);
  });
});

/* ------------------------------------------------------------------------- *
 * Export réel d'août 2026 : 48 colonnes, séparées par des points-virgules.
 * Les positions ont bougé par rapport aux exports précédents — « Date de la
 * commande » est passée de 45 à 46 — d'où le repérage par intitulé.
 * ------------------------------------------------------------------------- */

const ENTETE_REELLE = [
  'ID de commande', "ID de l'UGS", 'Nom du produit', 'ID du produit', 'Prix',
  'Articles vendus', 'Articles remboursés', 'Nom de la boutique', 'Code de la boutique',
  'Partenaire affilié', 'Agence', 'Devise', 'Type de commande',
  'Statut de règlement de la commission', 'Indirecte', 'Type de commission',
  'Type de contenu', 'Carrousel', 'Contenu', 'Standard', 'Publicités shopping',
  'Bonus TikTok', 'Bonus de partenaire', 'Part de partage des revenus', 'GMV',
  'Base de commission estimée', 'Commission standard estimée',
  'Commission de Publicités shopping estimée', 'Bonus estimé',
  'Bonus du partenaire affilié estimé', 'IVA estimé', 'ISR estimé', 'Est. CedularTax',
  'PIT estimé', 'Part estimée de partage des revenus', 'Base de commission réelle',
  'Commission standard', 'Commission des Publicités shopping', 'Bonus',
  'Bonus du partenaire affilié', 'Taxe - ISR', 'Taxe - IVA', 'cedular_tax',
  'Taxe - PIT', 'Partagé avec le partenaire', 'Montant total gagné au final',
  'Date de la commande', 'Date de paiement de la commande',
];

function ligneReelle({ id, comStd, comPub, comStdEst, video, statut } = {}) {
  const c = Array(ENTETE_REELLE.length).fill('');
  c[0] = id ?? '576944949268290041';
  c[2] = 'Nuclever Cortisol Manager';
  c[3] = '1729623940343765718';
  c[4] = '52,35';
  c[7] = 'Nuclever France';
  c[12] = 'Commande Publicités shopping';
  c[13] = statut ?? 'En attente';
  c[18] = video ?? '7675321843577900320';
  c[24] = '52,35';
  c[26] = comStdEst ?? '15,71';
  c[36] = comStd ?? '';
  c[37] = comPub ?? '';
  c[46] = '31/08/2026 23:39:41';
  c[47] = '/';
  return c;
}

describe('export réel — repérage par intitulé', () => {
  test('lit le format que les positions historiques ne savaient pas lire', () => {
    const [c] = analyserLignes([ENTETE_REELLE, ligneReelle()]).commandes;
    assert.equal(c.id, '576944949268290041');
    assert.equal(c.productName, 'Nuclever Cortisol Manager');
    assert.equal(c.boutiqueName, 'Nuclever France');
    assert.equal(c.price, 52.35);
    assert.equal(c.orderType, 'pub_shopping');
    assert.equal(c.status, 'En attente');
  });

  test('la date est prise en colonne 46, pas 45', () => {
    const [c] = analyserLignes([ENTETE_REELLE, ligneReelle()]).commandes;
    assert.equal(c.date.getDate(), 31);
    assert.equal(c.date.getMonth() + 1, 8);
    assert.equal(c.date.getFullYear(), 2026);
  });

  test('« Commission standard » n’est jamais confondue avec « … estimée »', () => {
    const reglee = analyserLignes([
      ENTETE_REELLE,
      ligneReelle({ comStd: '9,99', comStdEst: '15,71', statut: 'Réglée' }),
    ]).commandes[0];
    assert.equal(reglee.commissionStandard, 9.99);

    // Commande pas encore réglée : la colonne réelle est vide, l'estimée prend le relais.
    const attente = analyserLignes([ENTETE_REELLE, ligneReelle({ comStd: '' })]).commandes[0];
    assert.equal(attente.commissionStandard, 15.71);
  });

  test('un identifiant de vidéo nu devient une URL, une URL reste intacte', () => {
    const nu = analyserLignes([ENTETE_REELLE, ligneReelle()]).commandes[0];
    assert.equal(nu.videoUrl, 'https://www.tiktok.com/video/7675321843577900320');

    const url = 'https://www.tiktok.com/@dorian_scal3/video/7540061378007108886';
    const complet = analyserLignes([ENTETE_REELLE, ligneReelle({ video: url })]).commandes[0];
    assert.equal(complet.videoUrl, url);
  });

  test('le dédoublonnage par numéro vaut aussi pour ce format', () => {
    const r = analyserLignes([
      ENTETE_REELLE,
      ligneReelle({ id: '111', statut: 'En attente' }),
      ligneReelle({ id: '111', statut: 'Réglée' }),
      ligneReelle({ id: '222' }),
    ]);
    assert.equal(r.commandes.length, 2);
    assert.equal(r.doublonsDansLeFichier, 1);
    assert.equal(r.commandes.find((c) => c.id === '111').status, 'Réglée');
  });

  test('bout en bout, en point-virgule et avec BOM', () => {
    const enCsv = (champs) => champs.join(';');
    const texte = '﻿' + [enCsv(ENTETE_REELLE), enCsv(ligneReelle())].join('\r\n');
    const r = analyserCsv(texte);
    assert.equal(r.commandes.length, 1);
    assert.equal(r.ignorees, 0);
    assert.equal(r.commandes[0].price, 52.35);
  });
});

describe('detecterSeparateur', () => {
  test('reconnaît le point-virgule et la virgule', () => {
    assert.equal(detecterSeparateur('a;b;c;d'), ';');
    assert.equal(detecterSeparateur('a,b,c,d'), ',');
  });

  test('les séparateurs entre guillemets ne comptent pas', () => {
    // Un seul vrai point-virgule, mais trois virgules enfermées dans un libellé.
    assert.equal(detecterSeparateur('"Sérum, vitamine C, 30ml";"Prix"'), ';');
  });

  test('une ligne sans séparateur retombe sur la virgule', () => {
    assert.equal(detecterSeparateur('colonne unique'), ',');
  });
});
