import React from 'react';

import { Logic } from './logic.js';
import { appConfig } from './config/appConfig.js';

/**
 * Point d'entrée de l'application.
 *
 * `Logic` est la classe issue du design (état, calculs, `renderVals()`) ; elle
 * étend `DCLogic`, qui est un vrai `React.Component` rendant `src/view.jsx`.
 * Cette enveloppe se contente de lui fournir sa configuration.
 */
export default function App() {
  return <Logic {...appConfig} />;
}
