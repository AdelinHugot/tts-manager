import React from 'react';
import { createRoot } from 'react-dom/client';

import { registerSW } from 'virtual:pwa-register';

import './styles.css';
import App from './App.jsx';
import LimiteErreur from './components/LimiteErreur.jsx';

/**
 * Enregistrement du service worker.
 *
 * Fait ici plutôt que par une balise injectée : la CSP interdit les scripts
 * inline, et un module passe par `script-src 'self'`.
 *
 * `immediate` prend la main dès le premier chargement, sans attendre que tous
 * les onglets soient fermés — sinon un correctif pourrait rester invisible
 * pendant des jours sur un téléphone où l'application n'est jamais quittée.
 */
registerSW({ immediate: true });

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Toute exception non rattrapée démonterait sinon l'arbre entier et
        laisserait un écran vide, sans message ni moyen d'en sortir. */}
    <LimiteErreur>
      <App />
    </LimiteErreur>
  </React.StrictMode>
);
