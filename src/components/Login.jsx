import React, { useState } from 'react';

import { connexion, messageErreur } from '../lib/auth.js';

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

  return (
    <div style={styles.page}>
      <div style={styles.colonne}>
        <div style={styles.enTete}>
          <div style={styles.logo}>T</div>
          <div>
            <div style={styles.titre}>TTS Manager</div>
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
    background: 'linear-gradient(135deg,var(--primary),var(--primary-2))',
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
