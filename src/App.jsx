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

/** Écran d'attente le temps que Firebase restaure la session. */
function Chargement() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-3)',
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: '13px',
        fontWeight: 600,
      }}
    >
      Chargement…
    </div>
  );
}
