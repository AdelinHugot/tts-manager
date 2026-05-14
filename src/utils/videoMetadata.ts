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

export function extractVideoMetadata(
  file: File
): Promise<{ duration: number; thumbnailUrl: string }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const video = document.createElement('video')

    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    video.addEventListener('loadedmetadata', () => {
      video.currentTime = 0
    })

    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth || 320
      canvas.height = video.videoHeight || 180
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(video as unknown as CanvasImageSource, 0, 0, canvas.width, canvas.height)
      const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8)
      URL.revokeObjectURL(objectUrl)
      resolve({ duration: video.duration, thumbnailUrl })
    })

    video.addEventListener('error', () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error(`Failed to load video: ${file.name}`))
    })

    video.src = objectUrl
  })
}
