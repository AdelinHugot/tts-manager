import React from 'react';
import { createRoot } from 'react-dom/client';

import './styles.css';
import App from './App.jsx';
import LimiteErreur from './components/LimiteErreur.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Toute exception non rattrapée démonterait sinon l'arbre entier et
        laisserait un écran vide, sans message ni moyen d'en sortir. */}
    <LimiteErreur>
      <App />
    </LimiteErreur>
  </React.StrictMode>
);
