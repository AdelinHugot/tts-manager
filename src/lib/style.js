/**
 * Convertit une déclaration CSS en objet de style React.
 * Port direct de `cssToObj()` du runtime d'origine : les custom properties
 * (`--x`) gardent leur nom, le reste passe en camelCase.
 */
export function css(decl) {
  const out = {};
  if (!decl) return out;
  for (const part of String(decl).split(';')) {
    const i = part.indexOf(':');
    if (i < 0) continue;
    const prop = part.slice(0, i).trim();
    if (!prop) continue;
    out[prop.startsWith('--') ? prop : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = part
      .slice(i + 1)
      .trim();
  }
  return out;
}

/**
 * Équivalent de l'attribut `style-hover="…"` du design : les pseudo-classes ne
 * pouvant pas s'exprimer en styles inline, chaque déclaration unique est
 * mémoïsée dans une feuille de styles injectée, et l'appel renvoie la classe
 * correspondante. Port direct de `createPseudoSheet()`.
 */
const pseudoCache = new Map();
let pseudoSheet = null;

export function sp(pseudo, decl) {
  const key = pseudo + '|' + decl;
  const hit = pseudoCache.get(key);
  if (hit) return hit;

  const cls = 'scp' + pseudoCache.size.toString(36);
  pseudoCache.set(key, cls);

  if (typeof document !== 'undefined') {
    if (!pseudoSheet) {
      pseudoSheet = document.createElement('style');
      pseudoSheet.setAttribute('data-dc-pseudo', '');
      document.head.appendChild(pseudoSheet);
    }
    const sel =
      pseudo === 'before' || pseudo === 'after' ? `.${cls}::${pseudo}` : `.${cls}:${pseudo}`;
    try {
      pseudoSheet.sheet.insertRule(`${sel}{${decl}}`, pseudoSheet.sheet.cssRules.length);
    } catch {
      /* déclaration non supportée par le navigateur : on l'ignore, comme le runtime */
    }
  }
  return cls;
}
