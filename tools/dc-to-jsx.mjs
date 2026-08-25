#!/usr/bin/env node
/**
 * dc-to-jsx — transpile le template Claude Design (`design/TTS Manager.dc.html`)
 * en JSX React réel.
 *
 * Le fichier source utilise un mini-langage de template (`{{ path }}`, <sc-for>,
 * <sc-if>, `style-hover="…"`) interprété à l'exécution par `design/support.js`.
 * Ce script reproduit **exactement** la sémantique de ce runtime, mais à la
 * compilation, de façon à produire du JSX statique et lisible :
 *
 *   {{ a.b }}                      -> V.a.b            (ou `item.b` dans un sc-for)
 *   <sc-for list="{{ xs }}" as="x"> -> {(V.xs || []).map((x, i) => (...))}
 *   <sc-if value="{{ c }}">         -> {V.c ? (<>…</>) : null}
 *   style="a:b;c:{{ d }}"           -> style={css(`a:b;c:${V.d}`)}
 *   style-hover="…"                 -> className={sp('hover', '…')}
 *
 * Le résultat est écrit dans src/view.jsx. Ne pas éditer ce fichier à la main :
 * relancer `npm run gen:view` après toute modification du design.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'design', 'TTS Manager.dc.html');
const OUT_VIEW = path.join(ROOT, 'src', 'view.jsx');
const OUT_CSS = path.join(ROOT, 'src', 'styles.css');
const OUT_LOGIC = path.join(ROOT, 'src', 'logic.js');

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const RAW_TEXT = new Set(['style', 'script', 'textarea']);
const DROP_ATTRS = new Set(['hint-placeholder-val', 'hint-placeholder-count', 'hint-size', 'sc-name', 'data-dc-tpl']);

/* ------------------------------------------------------------------ parsing */

function parse(html) {
  const root = { tag: '#root', attrs: {}, children: [] };
  const stack = [root];
  let i = 0;
  const push = (node) => stack[stack.length - 1].children.push(node);

  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt < 0) {
      pushText(html.slice(i));
      break;
    }
    if (lt > i) pushText(html.slice(i, lt));

    if (html.startsWith('<!--', lt)) {
      i = html.indexOf('-->', lt) + 3;
      continue;
    }
    if (html[lt + 1] === '/') {
      const gt = html.indexOf('>', lt);
      const tag = html.slice(lt + 2, gt).trim().toLowerCase();
      for (let k = stack.length - 1; k > 0; k--) {
        if (stack[k].tag === tag) {
          stack.length = k;
          break;
        }
      }
      i = gt + 1;
      continue;
    }

    const m = /^<([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s=/>]+(?:\s*=\s*"[^"]*")?)*)\s*(\/?)>/.exec(html.slice(lt));
    if (!m) {
      pushText(html.slice(lt, lt + 1));
      i = lt + 1;
      continue;
    }
    const tag = m[1].toLowerCase();
    const node = { tag, attrs: parseAttrs(m[2]), children: [] };
    push(node);
    i = lt + m[0].length;

    if (m[3] || VOID.has(tag)) continue;

    if (RAW_TEXT.has(tag)) {
      const close = html.toLowerCase().indexOf(`</${tag}`, i);
      const body = html.slice(i, close < 0 ? html.length : close);
      if (body) node.children.push({ tag: '#text', text: body });
      i = close < 0 ? html.length : html.indexOf('>', close) + 1;
      continue;
    }
    stack.push(node);
  }
  return root;

  function pushText(t) {
    if (t) push({ tag: '#text', text: t });
  }
}

function parseAttrs(str) {
  const attrs = {};
  const re = /([^\s=/>]+)(?:\s*=\s*"([^"]*)")?/g;
  let m;
  while ((m = re.exec(str))) {
    if (!m[1]) continue;
    attrs[m[1]] = m[2] === undefined ? '' : m[2];
  }
  return attrs;
}

/* ------------------------------------------------- expression transpilation */

/**
 * Reproduit `resolve()` de support.js : littéraux, `!expr`, comparaisons, et
 * chemins pointés. Le préfixe `V.` n'est ajouté qu'aux identifiants qui ne sont
 * pas liés par un <sc-for> englobant.
 */
function expr(raw, scope) {
  const e = String(raw).trim();
  if (!e) return 'undefined';
  if (e[0] === '(' && e[e.length - 1] === ')') return `(${expr(e.slice(1, -1), scope)})`;
  const cmp = /^([\s\S]+?)\s*(===|!==|==|!=)\s*([\s\S]+)$/.exec(e);
  if (cmp) return `${expr(cmp[1], scope)} ${cmp[2]} ${expr(cmp[3], scope)}`;
  if (e[0] === '!') return `!${expr(e.slice(1), scope)}`;
  if (e === 'true' || e === 'false' || e === 'null' || e === 'undefined') return e;
  if (/^-?\d+(\.\d+)?$/.test(e)) return e;
  if (/^(['"]).*\1$/.test(e)) return JSON.stringify(e.slice(1, -1));
  const head = /^[A-Za-z_$][A-Za-z0-9_$]*/.exec(e);
  if (!head) return 'undefined';
  return scope.has(head[0]) ? e : `V.${e}`;
}

const HOLE_RE = /\{\{([\s\S]+?)\}\}/;
const HOLE_G = /\{\{([\s\S]+?)\}\}/g;

/** Valeur d'attribut -> expression JS (chaîne interpolée ou valeur brute). */
function attrValue(raw, scope) {
  const whole = /^\s*\{\{([\s\S]+?)\}\}\s*$/.exec(raw);
  if (whole) return { dynamic: true, code: expr(whole[1], scope) };
  if (!HOLE_RE.test(raw)) return { dynamic: false, code: JSON.stringify(raw) };
  const parts = raw.split(HOLE_G);
  const tpl = parts
    .map((p, k) => (k & 1 ? '${' + expr(p, scope) + ' ?? ""}' : p.replace(/[\\`$]/g, (c) => '\\' + c)))
    .join('');
  return { dynamic: true, code: '`' + tpl + '`' };
}

/* --------------------------------------------------------------- CSS helper */

function kebabToCamel(s) {
  return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function cssToObj(css) {
  const o = {};
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    o[prop.startsWith('--') ? prop : kebabToCamel(prop)] = decl.slice(i + 1).trim();
  }
  return o;
}

/* ---------------------------------------------------------- JSX code emitter */

const staticStyles = new Map(); // json -> const name

function styleConst(css) {
  const obj = cssToObj(css);
  const json = JSON.stringify(obj);
  if (!staticStyles.has(json)) staticStyles.set(json, `st${staticStyles.size}`);
  return staticStyles.get(json);
}

const EVENT_ATTRS = /^on[A-Z]/;

function emit(node, scope, depth) {
  const pad = '  '.repeat(depth);

  if (node.tag === '#text') {
    return emitText(node.text, scope, pad);
  }
  if (node.tag === 'sc-for') return emitFor(node, scope, depth);
  if (node.tag === 'sc-if') return emitIf(node, scope, depth);

  const { attrs } = node;
  const props = [];
  const classes = [];

  for (const [name, raw] of Object.entries(attrs)) {
    if (DROP_ATTRS.has(name)) continue;

    if (name.startsWith('style-')) {
      classes.push(`sp(${JSON.stringify(name.slice(6))}, ${JSON.stringify(raw)})`);
      continue;
    }
    if (name === 'style') {
      const v = attrValue(raw, scope);
      props.push(v.dynamic ? `style={css(${v.code})}` : `style={${styleConst(raw)}}`);
      continue;
    }
    let key = name;
    if (key === 'class') key = 'className';
    else if (key === 'for') key = 'htmlFor';
    else if (key === 'crossorigin') key = 'crossOrigin';
    else if (/^on[a-z]/.test(key)) key = 'on' + key[2].toUpperCase() + key.slice(3);

    const v = attrValue(raw, scope);
    if (!v.dynamic && !EVENT_ATTRS.test(key)) {
      props.push(`${key}=${v.code}`);
      continue;
    }
    // Le runtime remplace `value`/`checked` non résolus par '' / false pour
    // conserver des champs contrôlés côté React. On garde ce filet de sécurité.
    if (key === 'value') props.push(`value={${v.code} ?? ""}`);
    else if (key === 'checked') props.push(`checked={${v.code} ?? false}`);
    else props.push(`${key}={${v.code}}`);
  }

  if (classes.length) {
    const cls = classes.length === 1 ? classes[0] : `[${classes.join(', ')}].join(" ")`;
    props.push(`className={${cls}}`);
  }

  const head = props.length ? `<${node.tag} ${props.join(' ')}` : `<${node.tag}`;
  const kids = emitChildren(node.children, scope, depth + 1);

  if (!kids.length) return VOID.has(node.tag) ? `${pad}${head} />` : `${pad}${head}></${node.tag}>`;
  return `${pad}${head}>\n${kids.join('\n')}\n${pad}</${node.tag}>`;
}

/**
 * Émission d'un nœud texte.
 *
 * Le runtime rend les nœuds texte tels quels (y compris les nœuds purement
 * blancs, que le navigateur réduit ensuite à une espace). JSX, lui, supprime
 * les blancs contenant un saut de ligne — d'où l'émission explicite de `{" "}`
 * pour ne pas coller deux éléments inline qui étaient séparés dans le design.
 */
const INLINE_TAGS = new Set(['span', 'a', 'strong', 'b', 'em', 'i', 'small', 'label', 'code', 'sc-if']);

/**
 * Émet les enfants d'un élément.
 *
 * Les nœuds purement blancs du HTML source ne sont conservés que lorsqu'ils
 * séparent deux éléments inline : c'est le seul cas où le navigateur les rend
 * comme une espace. Partout ailleurs (enfants de blocs ou de conteneurs flex)
 * ils sont ignorés au rendu, et JSX les supprimerait de toute façon.
 */
function emitChildren(children, scope, depth) {
  const out = [];
  for (let k = 0; k < children.length; k++) {
    const child = children[k];
    if (child.tag === '#text' && !child.text.trim()) {
      const prev = children[k - 1];
      const next = children[k + 1];
      const inline = (n) => n && n.tag !== '#text' && INLINE_TAGS.has(n.tag);
      if (child.text.includes(' ') && inline(prev) && inline(next)) {
        out.push('  '.repeat(depth) + '{" "}');
      }
      continue;
    }
    const code = emit(child, scope, depth);
    if (code) out.push(code);
  }
  return out;
}

function emitText(text, scope, pad) {
  if (!HOLE_RE.test(text)) {
    if (!text.trim()) return '';
    return pad + jsxStr(text);
  }
  const parts = text.split(HOLE_G);
  const out = parts
    .map((p, k) => (k & 1 ? `{${expr(p, scope)}}` : jsxStr(p)))
    .filter(Boolean)
    .join('');
  return out ? pad + out : '';
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', hellip: '\u2026' };

function decodeEntities(t) {
  return t.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, ref) => {
    if (ref[0] === '#') {
      const code = ref[1] === 'x' || ref[1] === 'X' ? parseInt(ref.slice(2), 16) : parseInt(ref.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }
    return ENTITIES[ref] ?? whole;
  });
}

/**
 * Texte littéral -> expression JSX. Les blancs consécutifs sont réduits à une
 * espace (ce que fait de toute façon le rendu CSS), et les entités HTML sont
 * décodées puisqu'on n'écrit plus du HTML mais une chaîne JavaScript.
 */
function jsxStr(t) {
  if (!t) return '';
  const collapsed = decodeEntities(t).replace(/\s+/g, ' ');
  if (!collapsed.trim()) return collapsed ? '{" "}' : '';
  return `{${JSON.stringify(collapsed)}}`;
}

function emitFor(node, scope, depth) {
  const pad = '  '.repeat(depth);
  const as = node.attrs.as || 'item';
  const listRaw = node.attrs.list || '';
  const whole = /^\s*\{\{([\s\S]+?)\}\}\s*$/.exec(listRaw);
  const list = whole ? expr(whole[1], scope) : attrValue(listRaw, scope).code;
  const inner = new Set(scope);
  inner.add(as);
  const idx = `_i${depth}`;
  const kids = emitChildren(node.children, inner, depth + 2);
  return (
    `${pad}{(${list} || []).map((${as}, ${idx}) => (\n` +
    `${pad}  <React.Fragment key={${idx}}>\n` +
    kids.join('\n') +
    `\n${pad}  </React.Fragment>\n` +
    `${pad}))}`
  );
}

function emitIf(node, scope, depth) {
  const pad = '  '.repeat(depth);
  const raw = node.attrs.value || '';
  const whole = /^\s*\{\{([\s\S]+?)\}\}\s*$/.exec(raw);
  const cond = whole ? expr(whole[1], scope) : attrValue(raw, scope).code;
  const kids = emitChildren(node.children, scope, depth + 2);
  return (
    `${pad}{${cond} ? (\n` +
    `${pad}  <React.Fragment>\n` +
    kids.join('\n') +
    `\n${pad}  </React.Fragment>\n` +
    `${pad}) : null}`
  );
}

/* --------------------------------------------------------------------- main */

const html = fs.readFileSync(SRC, 'utf8');

// 1. <helmet> : la balise <style> devient la feuille de styles globale.
const helmet = /<helmet>([\s\S]*?)<\/helmet>/i.exec(html);
if (!helmet) throw new Error('bloc <helmet> introuvable');
const helmetStyle = /<style>([\s\S]*?)<\/style>/i.exec(helmet[1]);
fs.writeFileSync(
  OUT_CSS,
  '/* Généré depuis le bloc <helmet><style> du fichier design.\n' +
    '   Ne pas éditer à la main : voir tools/dc-to-jsx.mjs. */\n' +
    helmetStyle[1].trim() +
    '\n'
);

// 2. Le corps du template (tout ce qui suit </helmet> dans <x-dc>).
const body = html.slice(html.indexOf('</helmet>') + '</helmet>'.length, html.indexOf('</x-dc>'));
const tree = parse(body);
const roots = tree.children.filter((c) => c.tag !== '#text' || c.text.trim());
if (roots.length !== 1) throw new Error(`racine unique attendue, ${roots.length} trouvées`);

const jsx = emit(roots[0], new Set(), 2);

const styleDecls = [...staticStyles.entries()]
  .map(([json, name]) => `const ${name} = ${json};`)
  .join('\n');

fs.writeFileSync(
  OUT_VIEW,
  `// ⚠️  FICHIER GÉNÉRÉ — ne pas éditer à la main.
// Source : design/TTS Manager.dc.html  ·  Générateur : tools/dc-to-jsx.mjs
// Régénérer avec : npm run gen:view
import React from 'react';
import { css, sp } from './lib/style.js';

${styleDecls}

/**
 * Rend le template du design à partir de \`V\`, l'objet plat produit par
 * \`{ ...props, ...logic.renderVals() }\` — exactement comme le runtime d'origine.
 */
export default function View(V) {
  return (
${jsx}
  );
}
`
);

// 3. La classe de logique : extraite telle quelle, en module ES.
const script = /<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/i.exec(html);
if (!script) throw new Error('bloc <script data-dc-script> introuvable');
const logic = script[1].trim().replace(/^class Component extends DCLogic\s*\{/, 'export class Logic extends DCLogic {');
fs.writeFileSync(
  OUT_LOGIC,
  `/* eslint-disable */
// ⚠️  FICHIER GÉNÉRÉ — ne pas éditer à la main.
// Source : design/TTS Manager.dc.html (bloc <script data-dc-script>)
// Générateur : tools/dc-to-jsx.mjs · Régénérer avec : npm run gen:view
import React from 'react';
import { DCLogic } from './lib/dc.js';
import { complete } from './lib/claude.js';

const window_claude = { complete };

${logic.replace(/window\.claude\.complete\(/g, 'window_claude.complete(')}
`
);

console.log(
  `✓ src/view.jsx (${jsx.split('\n').length} lignes JSX, ${staticStyles.size} styles statiques hissés)\n` +
    `✓ src/logic.js\n✓ src/styles.css`
);
