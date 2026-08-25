/**
 * Props de l'application.
 *
 * Elles correspondent une à une aux `data-props` déclarées dans le fichier de
 * design d'origine (panneau de réglages de l'éditeur). Les valeurs par défaut
 * sont celles du design ; elles peuvent être surchargées au déploiement via des
 * variables d'environnement Vite.
 *
 * ⚠️  Rappel : tout ce qui est préfixé `VITE_` est inclus en clair dans le
 * bundle public. N'y placer que de la configuration non sensible.
 */

const PALETTES = ['Lavande', 'Menthe', 'Indigo'];
const ASSISTANT_MODES = ['Rapide', 'Approfondi'];

const pick = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback);

export const appConfig = {
  /** Thème de couleurs : 'Lavande' | 'Menthe' | 'Indigo'. */
  palette: pick(import.meta.env.VITE_PALETTE, PALETTES, 'Lavande'),

  /** Affiche les métriques liées au compte TikTok connecté. */
  tiktokConnected: import.meta.env.VITE_TIKTOK_CONNECTED !== 'false',

  /** Profondeur de réponse de l'assistant : 'Rapide' | 'Approfondi'. */
  assistantModel: pick(import.meta.env.VITE_ASSISTANT_MODE, ASSISTANT_MODES, 'Rapide'),
};

export default appConfig;
