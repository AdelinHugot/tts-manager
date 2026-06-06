/** Friendly filename — iOS donne parfois un UUID brut */
export function friendlyName(name: string): string {
  const uuidLike = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/i
  if (uuidLike.test(name)) return 'Vidéo sans titre'
  return name.replace(/\.[^.]+$/, '') // retire l'extension
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatSize(bytes: number): string {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} Go`
  if (bytes >= 1_000_000) return `${Math.floor(bytes / 1_000_000)} Mo`
  return `${bytes} Ko`
}

/**
 * Génère un UUID compatible avec tous les environnements (y compris iOS < 15.4).
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

/**
 * Détecte iOS/iPadOS (y compris iPadOS 13+ qui se présente comme macOS).
 */
function isIOSDevice(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
  )
}

/**
 * Extrait durée + thumbnail depuis un fichier vidéo.
 *
 * Si `existingUrl` est fourni, l'utilise sans en créer un nouveau et sans le révoquer
 * (le cycle de vie appartient à l'appelant). Sinon, crée et révoque un URL interne.
 *
 * Résout TOUJOURS — timeout de sécurité à 4 s pour les cas où iOS bloque.
 */
export function extractVideoMetadata(
  file: File,
  existingUrl?: string
): Promise<{ duration: number; thumbnailUrl: string }> {
  return new Promise((resolve) => {
    const ownsUrl = !existingUrl
    const objectUrl = existingUrl ?? URL.createObjectURL(file)

    let settled = false
    const done = (result: { duration: number; thumbnailUrl: string }) => {
      if (settled) return
      settled = true
      if (ownsUrl) URL.revokeObjectURL(objectUrl)
      resolve(result)
    }

    // Timeout de sécurité — iOS peut ne jamais déclencher loadedmetadata
    const timer = setTimeout(() => done({ duration: 0, thumbnailUrl: '' }), 4000)

    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    video.addEventListener('loadedmetadata', () => {
      const duration = video.duration || 0

      // Sur iOS/iPadOS : ne pas tenter seek/canvas (bloqué ou inaccessible)
      if (isIOSDevice()) {
        clearTimeout(timer)
        done({ duration, thumbnailUrl: '' })
        return
      }

      // Desktop/Android : chercher à capturer une frame
      video.currentTime = 0
    })

    video.addEventListener('seeked', () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth || 320
        canvas.height = video.videoHeight || 180
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video as unknown as CanvasImageSource, 0, 0, canvas.width, canvas.height)
          clearTimeout(timer)
          done({ duration: video.duration || 0, thumbnailUrl: canvas.toDataURL('image/jpeg', 0.7) })
        } else {
          clearTimeout(timer)
          done({ duration: video.duration || 0, thumbnailUrl: '' })
        }
      } catch {
        clearTimeout(timer)
        done({ duration: video.duration || 0, thumbnailUrl: '' })
      }
    })

    video.addEventListener('error', () => {
      clearTimeout(timer)
      done({ duration: 0, thumbnailUrl: '' })
    })

    video.src = objectUrl
  })
}
