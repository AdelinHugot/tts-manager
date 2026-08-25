import React from 'react';

import { deconnexion } from '../lib/auth.js';

/**
 * Limite d'erreur.
 *
 * Sans elle, la moindre exception dans l'arbre React démonte tout et laisse un
 * écran vide : l'utilisatrice est bloquée et ne peut rien rapporter d'utile.
 * C'est exactement ce qui s'est produit après la mise en place de
 * l'authentification.
 *
 * Elle attrape aussi les échecs de `React.lazy` : si le fragment de code de
 * l'application n'arrive pas — réseau coupé, fichier absent après un
 * redéploiement, en-tête bloquant — l'erreur remonte ici plutôt que de laisser
 * un « Chargement… » perpétuel.
 *
 * Deux sorties sont toujours proposées : recharger, et se déconnecter. La
 * seconde compte : elle vide la session, ce qui permet de repartir d'un état
 * propre quand c'est la session elle-même qui pose problème.
 */
export default class LimiteErreur extends React.Component {
  constructor(props) {
    super(props);
    this.state = { erreur: null, details: null };
  }

  static getDerivedStateFromError(erreur) {
    return { erreur };
  }

  componentDidCatch(erreur, infos) {
    // Journalisé pour être visible dans la console du navigateur, où l'on peut
    // demander à quelqu'un de le copier.
    console.error('Erreur non rattrapée', erreur, infos);
    this.setState({ details: infos?.componentStack ?? null });
  }

  render() {
    const { erreur, details } = this.state;
    if (!erreur) return this.props.children;

    const estChargement = /Loading chunk|dynamically imported module|Failed to fetch/i.test(
      erreur.message ?? ''
    );

    return (
      <div style={styles.page}>
        <div style={styles.carte}>
          <div style={styles.pastille}>!</div>

          <h1 style={styles.titre}>
            {estChargement ? 'Application non chargée' : 'Quelque chose a cassé'}
          </h1>

          <p style={styles.texte}>
            {estChargement
              ? "Une partie de l'application n'a pas pu être téléchargée. C'est souvent passager — un rechargement suffit généralement. Si le problème persiste après un nouveau déploiement, vide le cache du navigateur."
              : "L'application s'est arrêtée sur une erreur. Rien n'est perdu côté serveur."}
          </p>

          <pre style={styles.message}>{String(erreur.message || erreur)}</pre>

          <div style={styles.actions}>
            <button type="button" onClick={() => window.location.reload()} style={styles.principal}>
              Recharger
            </button>
            <button
              type="button"
              onClick={() => deconnexion().finally(() => window.location.reload())}
              style={styles.secondaire}
            >
              Se déconnecter
            </button>
          </div>

          {details ? (
            <details style={styles.details}>
              <summary style={styles.summary}>Détail technique</summary>
              <pre style={styles.pile}>{details}</pre>
            </details>
          ) : null}
        </div>
      </div>
    );
  }
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg, #F6F4FD)',
    color: 'var(--text, #211E33)',
    fontFamily: "'Inter', system-ui, sans-serif",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  carte: {
    width: '100%',
    maxWidth: '460px',
    background: 'var(--card, #fff)',
    border: '1px solid var(--border, #EFECF9)',
    borderRadius: '18px',
    padding: '26px',
    display: 'flex',
    flexDirection: 'column',
    gap: '13px',
    boxShadow: '0 8px 30px rgba(40,28,90,0.08)',
  },
  pastille: {
    width: '34px',
    height: '34px',
    borderRadius: '11px',
    background: 'var(--neg-soft, #FBEAEA)',
    color: 'var(--neg, #D96A6A)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '17px',
  },
  titre: { margin: 0, fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' },
  texte: { margin: 0, fontSize: '13.5px', lineHeight: 1.55, color: 'var(--text-2, #5E5A72)' },
  message: {
    margin: 0,
    background: 'var(--primary-softer, #F6F4FE)',
    border: '1px solid var(--border, #EFECF9)',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '12px',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    color: 'var(--text-2, #5E5A72)',
  },
  actions: { display: 'flex', gap: '9px', marginTop: '3px' },
  principal: {
    flex: 1,
    padding: '10px 16px',
    border: 'none',
    borderRadius: '11px',
    background: 'var(--primary, #7C6FF7)',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 700,
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  secondaire: {
    padding: '10px 16px',
    border: '1px solid var(--border-2, #E5E1F3)',
    borderRadius: '11px',
    background: 'var(--card, #fff)',
    color: 'var(--text-2, #5E5A72)',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  details: { fontSize: '12px', color: 'var(--text-3, #9A96AC)' },
  summary: { cursor: 'pointer', fontWeight: 600 },
  pile: {
    marginTop: '8px',
    maxHeight: '190px',
    overflow: 'auto',
    fontSize: '11px',
    lineHeight: 1.45,
    whiteSpace: 'pre-wrap',
  },
};
