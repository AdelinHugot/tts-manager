import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

/**
 * Initialisation Firebase.
 *
 * ⚠️  Ces valeurs ne sont PAS des secrets. Une configuration web Firebase est
 * un identifiant public par conception : elle est nécessairement lisible dans
 * le bundle, et Google la documente comme telle. Ce qui protège réellement les
 * données, ce sont les règles de sécurité (`firestore.rules`, `storage.rules`)
 * et App Check — pas la confidentialité de cette clé.
 *
 * Le vrai secret du projet, `ANTHROPIC_API_KEY`, vit côté serveur dans
 * netlify/functions/claude.js et n'apparaît jamais ici.
 *
 * Les valeurs sont surchargeables par variables d'environnement pour pouvoir
 * pointer un projet de test sans toucher au code.
 *
 * Ce module ne charge que `firebase/app` et `firebase/auth` : Firestore et
 * Storage sont instanciés dans leurs propres modules, afin que leur code ne
 * parte pas dans le bundle initial servi à une personne non connectée.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyDKsTzVO-3EvrsOWwoqnH_-r71uYDw3Qs0',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'tts-manager-d4135.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'tts-manager-d4135',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'tts-manager-d4135.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID ?? '388609335716',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:388609335716:web:c022b563d4b55a51262131',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { firebaseConfig };
