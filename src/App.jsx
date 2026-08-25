import React, { Suspense, lazy, useEffect, useState } from 'react';

import Login from './components/Login.jsx';
import { appConfig } from './config/appConfig.js';
import { observeUser } from './lib/auth.js';

/**
 * L'application authentifiée est chargée à la demande : l'écran de connexion
 * n'a besoin ni de Firestore, ni de Storage, ni des ~1900 lignes de vue issues
 * du design. Sans ce découpage, une personne non connectée téléchargerait tout.
 */
const Logic = lazy(() =>
  import('./logic.js').then((module) => ({ default: module.Logic }))
);

/**
 * Point d'entrée de l'application.
 *
 * Deux responsabilités : porter la configuration issue du design, et servir de
 * porte d'authentification. Tant qu'aucun compte n'est connecté, aucun uid
 * n'existe — donc aucun chemin `users/{uid}/…` n'est adressable et rien n'est
 * lisible. L'écran de connexion n'est pas une formalité, c'est le préalable au
 * cloisonnement.
 *
 * `Logic` est la classe issue du design (état, calculs, `renderVals()`). Elle
 * reçoit l'utilisateur en prop et est remontée à chaque changement de compte,
 * grâce à la `key` : ainsi aucun état d'une session ne survit à la suivante.
 */
export default function App() {
  const [user, setUser] = useState(null);
  const [pret, setPret] = useState(false);

  useEffect(
    () =>
      observeUser((u) => {
        setUser(u);
        setPret(true);
      }),
    []
  );

  if (!pret) return <Chargement />;
  if (!user) return <Login />;

  return (
    <Suspense fallback={<Chargement />}>
      <Logic key={user.uid} {...appConfig} user={user} />
    </Suspense>
  );
}

/**
 * Écran d'attente.
 *
 * Au-delà d'un délai raisonnable, on cesse de faire tourner un indicateur dans
 * le vide : si le fragment de code ne répond jamais (plutôt que d'échouer
 * franchement, auquel cas la limite d'erreur prend le relais), l'attente
 * silencieuse est indiscernable d'une application cassée. On propose donc une
 * sortie.
 */
function Chargement() {
  const [longue, setLongue] = useState(false);

  useEffect(() => {
    const minuteur = setTimeout(() => setLongue(true), 10000);
    return () => clearTimeout(minuteur);
  }, []);

  return (
    <div style={stylesChargement.page}>
      <div style={stylesChargement.texte}>Chargement…</div>
      {longue ? (
        <>
          <div style={stylesChargement.aide}>
            Cela prend plus de temps que prévu. La connexion est peut-être
            interrompue.
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={stylesChargement.bouton}
          >
            Recharger
          </button>
        </>
      ) : null}
    </div>
  );
}

const stylesChargement = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '24px',
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  texte: { color: 'var(--text-3)', fontSize: '13px', fontWeight: 600 },
  aide: {
    color: 'var(--text-3)',
    fontSize: '12.5px',
    maxWidth: '280px',
    textAlign: 'center',
    lineHeight: 1.5,
  },
  bouton: {
    marginTop: '2px',
    padding: '9px 16px',
    border: '1px solid var(--border-2)',
    borderRadius: '11px',
    background: 'var(--card)',
    color: 'var(--text-2)',
    fontSize: '12.5px',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
};
