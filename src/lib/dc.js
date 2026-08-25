import React from 'react';
import View from '../view.jsx';

/**
 * Classe de base des composants issus du design.
 *
 * Dans le fichier `.dc.html` d'origine, la logique héritait de `DCLogic`, une
 * classe « nue » pilotée par un composant hôte du runtime. Ici, `DCLogic` **est**
 * un vrai `React.Component` : `setState`, les refs et les méthodes de cycle de
 * vie sont ceux de React, sans couche intermédiaire.
 *
 * Le rendu reproduit le contrat du runtime : le template est évalué contre
 * l'objet plat `{ ...props, ...renderVals() }`.
 */
export class DCLogic extends React.Component {
  /** Objet plat contre lequel le template est rendu. Surchargé par la logique. */
  renderVals() {
    return {};
  }

  render() {
    return View({ ...this.props, ...(this.renderVals() || {}) });
  }
}
