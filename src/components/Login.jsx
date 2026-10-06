import React, { useState } from 'react';

import { connexion, messageErreur, reinitialiserMotDePasse } from '../lib/auth.js';

/**
 * Écran de connexion.
 *
 * Le prototype de design n'en comportait pas — il supposait une seule
 * utilisatrice, toujours présente. Le cloisonnement par compte le rend
 * indispensable : sans uid, aucune donnée n'est lisible.
 *
 * Écrit à la main, mais avec les mêmes jetons de style que le reste de
 * l'application (variables CSS de src/styles.css), pour rester dans la même
 * langue visuelle que les écrans générés.
 */
export default function Login() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState(null);
  const [enCours, setEnCours] = useState(false);
  const [envoiLien, setEnvoiLien] = useState(false);
  const [lienEnvoye, setLienEnvoye] = useState(false);

  async function envoyer(e) {
    e.preventDefault();
    if (enCours) return;
    setErreur(null);
    setEnCours(true);
    try {
      await connexion(email, motDePasse);
      // Le changement d'état est capté par App.jsx : rien à faire ici.
    } catch (err) {
      setErreur(messageErreur(err));
      setEnCours(false);
    }
  }

  /**
   * Demande un lien de réinitialisation.
   *
   * Le message de confirmation est le même que l'adresse existe ou non : dire
   * « compte inconnu » permettrait de découvrir qui possède un compte ici, une
   * adresse à la fois.
   */
  async function motDePasseOublie() {
    if (envoiLien) return;
    const adresse = email.trim();
    if (!adresse) {
      setErreur('Renseigne ton adresse e-mail, puis redemande le lien.');
      return;
    }
    setErreur(null);
    setEnvoiLien(true);
    try {
      await reinitialiserMotDePasse(adresse);
      setLienEnvoye(true);
    } catch (err) {
      setErreur(messageErreur(err));
    }
    setEnvoiLien(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.colonne}>
        <div style={styles.enTete}>
          <div style={styles.logo}>
            {/* Le signe occupe 96 % de la pastille — la proportion arrêtée sur la planche. */}
            <svg width="36" height="36" viewBox="0 0 64 64" aria-hidden="true">
              <path
                d="M11 47 A 28 28 0 0 1 53 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="6.5"
                strokeLinecap="round"
              />
              <circle cx="47" cy="46" r="5.5" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div style={styles.titre}>Rekolt</div>
            <div style={styles.sousTitre}>Creator Revenue Studio</div>
          </div>
        </div>

        <form onSubmit={envoyer} style={styles.carte} noValidate>
          <div style={styles.champ}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="camille@ttsmanager.fr"
              autoComplete="username"
              required
              autoFocus
              style={styles.input}
            />
          </div>

          <div style={styles.champ}>
            <label htmlFor="motdepasse" style={styles.label}>
              Mot de passe
            </label>
            <input
              id="motdepasse"
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              style={styles.input}
            />
          </div>

          {erreur ? (
            <div role="alert" style={styles.erreur}>
              {erreur}
            </div>
          ) : null}

          {lienEnvoye ? (
            <div role="status" style={styles.confirmation}>
              Si un compte existe pour cette adresse, un lien de réinitialisation vient d’y être
              envoyé. Pense à regarder les indésirables.
            </div>
          ) : null}

          <button
            type="button"
            onClick={motDePasseOublie}
            disabled={envoiLien}
            style={styles.lien}
          >
            {envoiLien ? 'Envoi du lien…' : 'Mot de passe oublié ?'}
          </button>

          <button type="submit" disabled={enCours} style={styles.bouton(enCours)}>
            {enCours ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p style={styles.pied}>
          Chaque compte ne voit que ses propres rushs, vidéos et idées.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    color: 'var(--text)',
    fontFamily: "'Inter', system-ui, sans-serif",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  colonne: {
    width: '100%',
    maxWidth: '360px',
    display: 'flex',
    flexDirection: 'column',
    gap: '22px',
  },
  enTete: {
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
    justifyContent: 'center',
  },
  logo: {
    width: '38px',
    height: '38px',
    borderRadius: '12px',
    background: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 800,
    fontSize: '17px',
    boxShadow: '0 4px 12px rgba(124,111,247,0.32)',
  },
  titre: { fontWeight: 700, fontSize: '16px', letterSpacing: '-0.02em' },
  sousTitre: { fontSize: '11.5px', color: 'var(--text-3)', fontWeight: 500, marginTop: '1px' },
  carte: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: '18px',
    padding: '22px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    boxShadow: '0 8px 30px rgba(40,28,90,0.07)',
  },
  champ: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: {
    fontSize: '10.5px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--text-3)',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--border-2)',
    borderRadius: '11px',
    background: 'var(--card)',
    color: 'var(--text)',
    fontSize: '13.5px',
    fontWeight: 500,
    fontFamily: 'inherit',
    outline: 'none',
  },
  erreur: {
    background: 'var(--neg-soft)',
    color: 'var(--neg)',
    borderRadius: '10px',
    padding: '9px 11px',
    fontSize: '12.5px',
    fontWeight: 600,
  },
  confirmation: {
    background: 'var(--secondary-soft)',
    color: 'var(--secondary)',
    borderRadius: '10px',
    padding: '9px 11px',
    fontSize: '12.5px',
    fontWeight: 600,
    lineHeight: 1.45,
  },
  // Un vrai <button> plutôt qu'un lien stylé : il n'y a pas de page à ouvrir,
  // et le clavier doit l'atteindre comme n'importe quelle action.
  lien: {
    alignSelf: 'flex-start',
    padding: '4px 0',
    border: 'none',
    background: 'transparent',
    color: 'var(--primary-2)',
    fontSize: '12.5px',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  bouton: (enCours) => ({
    marginTop: '2px',
    padding: '11px 16px',
    border: 'none',
    borderRadius: '12px',
    background: 'var(--primary)',
    color: '#fff',
    fontSize: '13.5px',
    fontWeight: 700,
    fontFamily: 'inherit',
    cursor: enCours ? 'default' : 'pointer',
    opacity: enCours ? 0.6 : 1,
  }),
  pied: {
    margin: 0,
    textAlign: 'center',
    fontSize: '11.5px',
    color: 'var(--text-3)',
    lineHeight: 1.5,
  },
};
