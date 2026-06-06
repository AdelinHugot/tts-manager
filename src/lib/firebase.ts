import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDKsTzVO-3EvrsOWwoqnH_-r71uYDw3Qs0',
  authDomain: 'tts-manager-d4135.firebaseapp.com',
  projectId: 'tts-manager-d4135',
  storageBucket: 'tts-manager-d4135.firebasestorage.app',
  messagingSenderId: '388609335716',
  appId: '1:388609335716:web:c022b563d4b55a51262131',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)
