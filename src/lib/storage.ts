import { ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'

/**
 * Upload une image produit dans Firebase Storage et retourne son URL publique.
 * Chemin : products/{productId}/{timestamp}.{ext}
 */
export async function uploadProductImage(productId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `products/${productId}/${Date.now()}.${ext}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

/**
 * Upload un avatar utilisateur dans Firebase Storage et retourne son URL publique.
 * Chemin : avatars/{userId}/avatar.{ext}  (écrase la version précédente)
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `avatars/${userId}/avatar.${ext}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

/**
 * Upload une vidéo rush dans Firebase Storage et retourne son URL permanente.
 * Chemin : rushes/{rushId}.{ext}
 * onProgress(0–100) est appelé à chaque chunk si fourni.
 */
export async function uploadRushVideo(
  rushId: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'mp4'
  const path = `rushes/${rushId}.${ext}`
  const storageRef = ref(storage, path)

  if (onProgress) {
    return new Promise((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, file)
      task.on(
        'state_changed',
        (snap) => onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
        reject,
        async () => resolve(await getDownloadURL(task.snapshot.ref)),
      )
    })
  }

  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

/**
 * Supprime une vidéo rush depuis Firebase Storage.
 * Ignore silencieusement les blob URLs et data URLs (anciens rushes pré-Storage).
 */
export async function deleteRushVideo(url: string): Promise<void> {
  if (!url || url.startsWith('blob:') || url.startsWith('data:')) return
  try {
    const storageRef = ref(storage, url)
    await deleteObject(storageRef)
  } catch {
    // Ignore — fichier peut-être déjà supprimé
  }
}

/**
 * Upload la vidéo finale montée d'une réalisation dans Firebase Storage.
 * Chemin : realisations/{realisationId}.{ext}
 * onProgress(0–100) est appelé à chaque chunk si fourni.
 */
export async function uploadFinalVideo(
  realisationId: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'mp4'
  const path = `realisations/${realisationId}.${ext}`
  const storageRef = ref(storage, path)

  if (onProgress) {
    return new Promise((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, file)
      task.on(
        'state_changed',
        (snap) => onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
        reject,
        async () => resolve(await getDownloadURL(task.snapshot.ref)),
      )
    })
  }

  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

/**
 * Supprime la vidéo finale depuis Firebase Storage.
 */
export async function deleteFinalVideo(url: string): Promise<void> {
  if (!url || url.startsWith('blob:') || url.startsWith('data:')) return
  try {
    const storageRef = ref(storage, url)
    await deleteObject(storageRef)
  } catch {
    // Ignore — fichier peut-être déjà supprimé
  }
}
