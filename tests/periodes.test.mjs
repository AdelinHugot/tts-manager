/**
 * Tests du calcul des périodes du tableau de bord.
 *
 * Les fins de mois, les trimestres et les passages d'année sont des nids à
 * erreurs : un décalage d'un jour y est invisible à la relecture mais fausse
 * tous les totaux affichés. La date de référence est injectée, jamais lue sur
 * l'horloge, pour que ces cas soient reproductibles.
 */
import test, { describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  bornesPeriode, bornesPersonnalisees, intervalles, jour, PERIODES_CONNUES,
} from '../src/lib/periodes.js';

/** 6 octobre 2026, en heure locale. */
const LE_6_OCTOBRE = new Date(2026, 9, 6);

describe('bornesPeriode', () => {
  test('le mois en cours va du 1er au dernier jour', () => {
    const p = bornesPeriode('mois', LE_6_OCTOBRE);
    assert.equal(p.from, '2026-10-01');
    assert.equal(p.to, '2026-10-31');
    assert.equal(p.gran, 'day');
  });

  test('la comparaison du mois est le mois d’avant', () => {
    const p = bornesPeriode('mois', LE_6_OCTOBRE);
    assert.deepEqual(p.precedent, { from: '2026-09-01', to: '2026-09-30' });
  });

  test('« mois précédent » décale tout d’un cran', () => {
    const p = bornesPeriode('moisprec', LE_6_OCTOBRE);
    assert.equal(p.from, '2026-09-01');
    assert.equal(p.to, '2026-09-30');
    assert.deepEqual(p.precedent, { from: '2026-08-01', to: '2026-08-31' });
  });

  test('le trimestre suit le découpage civil', () => {
    const p = bornesPeriode('trim', LE_6_OCTOBRE);
    assert.equal(p.from, '2026-10-01');
    assert.equal(p.to, '2026-12-31');
    assert.deepEqual(p.precedent, { from: '2026-07-01', to: '2026-09-30' });
  });

  test('un trimestre est le même quel que soit le jour qu’on y prend', () => {
    for (const jourDuTrim of [new Date(2026, 6, 1), new Date(2026, 7, 15), new Date(2026, 8, 30)]) {
      const p = bornesPeriode('trim', jourDuTrim);
      assert.equal(p.from, '2026-07-01');
      assert.equal(p.to, '2026-09-30');
    }
  });

  test('l’année est l’année civile', () => {
    const p = bornesPeriode('annee', LE_6_OCTOBRE);
    assert.equal(p.from, '2026-01-01');
    assert.equal(p.to, '2026-12-31');
    assert.deepEqual(p.precedent, { from: '2025-01-01', to: '2025-12-31' });
  });

  test('« année dernière » et sa comparaison', () => {
    const p = bornesPeriode('anneeprec', LE_6_OCTOBRE);
    assert.equal(p.from, '2025-01-01');
    assert.equal(p.to, '2025-12-31');
    assert.deepEqual(p.precedent, { from: '2024-01-01', to: '2024-12-31' });
  });

  test('janvier recule sur décembre de l’année précédente', () => {
    const p = bornesPeriode('mois', new Date(2026, 0, 15));
    assert.equal(p.from, '2026-01-01');
    assert.deepEqual(p.precedent, { from: '2025-12-01', to: '2025-12-31' });
  });

  test('le premier trimestre recule sur le quatrième de l’an passé', () => {
    const p = bornesPeriode('trim', new Date(2026, 1, 10));
    assert.equal(p.from, '2026-01-01');
    assert.deepEqual(p.precedent, { from: '2025-10-01', to: '2025-12-31' });
  });

  test('février 2024, bissextile, finit le 29', () => {
    assert.equal(bornesPeriode('mois', new Date(2024, 1, 10)).to, '2024-02-29');
  });

  test('février 2026, non bissextile, finit le 28', () => {
    assert.equal(bornesPeriode('mois', new Date(2026, 1, 10)).to, '2026-02-28');
  });

  test('toutes les périodes de l’interface sont calculables', () => {
    for (const id of PERIODES_CONNUES) {
      const p = bornesPeriode(id, LE_6_OCTOBRE);
      assert.ok(p.from <= p.to, `${id} : bornes inversées`);
      assert.ok(p.precedent.to < p.from, `${id} : la comparaison déborde sur la période`);
    }
  });

  test('une période inconnue lève plutôt que de renvoyer n’importe quoi', () => {
    assert.throws(() => bornesPeriode('semaine', LE_6_OCTOBRE), /Période inconnue/);
  });
});

describe('intervalles', () => {
  test('un mois se découpe en autant de jours qu’il en compte', () => {
    const p = bornesPeriode('mois', LE_6_OCTOBRE);
    const pts = intervalles(p);
    assert.equal(pts.length, 31);
    assert.equal(pts[0].from, '2026-10-01');
    assert.equal(pts[30].to, '2026-10-31');
    assert.equal(pts[0].label, '1');
  });

  test('une année se découpe en douze mois étiquetés', () => {
    const pts = intervalles(bornesPeriode('annee', LE_6_OCTOBRE));
    assert.equal(pts.length, 12);
    assert.equal(pts[0].label, 'Jan');
    assert.equal(pts[11].label, 'Déc');
    assert.equal(pts[11].to, '2026-12-31');
  });

  test('un trimestre se découpe en semaines sans déborder', () => {
    const p = bornesPeriode('trim', LE_6_OCTOBRE);
    const pts = intervalles(p);
    assert.ok(pts.length >= 13 && pts.length <= 14);
    assert.equal(pts[0].from, p.from);
    assert.equal(pts[pts.length - 1].to, p.to, 'la dernière semaine doit s’arrêter à la fin du trimestre');
  });

  test('les intervalles se suivent sans trou ni recouvrement', () => {
    for (const id of PERIODES_CONNUES) {
      const pts = intervalles(bornesPeriode(id, LE_6_OCTOBRE));
      for (let i = 1; i < pts.length; i++) {
        const veille = new Date(`${pts[i].from}T00:00:00`);
        veille.setDate(veille.getDate() - 1);
        assert.equal(jour(veille), pts[i - 1].to, `${id} : rupture entre ${pts[i - 1].to} et ${pts[i].from}`);
      }
    }
  });
});

describe('bornesPersonnalisees', () => {
  test('conserve l’intervalle choisi', () => {
    const p = bornesPersonnalisees('2026-07-01', '2026-07-31');
    assert.equal(p.from, '2026-07-01');
    assert.equal(p.to, '2026-07-31');
  });

  test('la comparaison est la même durée, juste avant', () => {
    // 31 jours du 1er au 31 juillet : les 31 jours precedents s'arretent la veille.
    const p = bornesPersonnalisees('2026-07-01', '2026-07-31');
    assert.deepEqual(p.precedent, { from: '2026-05-31', to: '2026-06-30' });
  });

  test('une seule journée se compare à la veille', () => {
    const p = bornesPersonnalisees('2026-07-15', '2026-07-15');
    assert.deepEqual(p.precedent, { from: '2026-07-14', to: '2026-07-14' });
  });

  test('un intervalle saisi à l’envers est redressé', () => {
    const a = bornesPersonnalisees('2026-07-31', '2026-07-01');
    const b = bornesPersonnalisees('2026-07-01', '2026-07-31');
    assert.deepEqual(a, b);
  });

  test('la granularité suit l’étendue', () => {
    assert.equal(bornesPersonnalisees('2026-07-06', '2026-07-12').gran, 'day');
    assert.equal(bornesPersonnalisees('2026-01-01', '2026-12-31').gran, 'week');
    assert.equal(bornesPersonnalisees('2024-01-01', '2026-12-31').gran, 'month');
  });

  test('le graphique reste lisible quelle que soit l’étendue', () => {
    for (const [a, b] of [
      ['2026-07-01', '2026-07-31'],
      ['2026-01-01', '2026-12-31'],
      ['2023-01-01', '2026-12-31'],
    ]) {
      const points = intervalles(bornesPersonnalisees(a, b)).length;
      assert.ok(points <= 60, `${a} → ${b} produit ${points} points`);
    }
  });

  test('les intervalles se suivent sans trou', () => {
    const pts = intervalles(bornesPersonnalisees('2026-07-01', '2026-07-31'));
    for (let i = 1; i < pts.length; i++) {
      const veille = new Date(`${pts[i].from}T00:00:00`);
      veille.setDate(veille.getDate() - 1);
      assert.equal(jour(veille), pts[i - 1].to);
    }
  });

  test('une date illisible lève plutôt que de produire un intervalle absurde', () => {
    assert.throws(() => bornesPersonnalisees('pas-une-date', '2026-07-31'), /Intervalle invalide/);
  });
});
