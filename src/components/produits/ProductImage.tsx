import { useState } from 'react'

type Props = {
  imageUrl: string
  name: string
  className?: string
}

/** Génère une couleur HSL douce et cohérente à partir du nom du produit. */
function nameToHsl(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 45%, 88%)`
}

/** Couleur de texte assortie (plus sombre). */
function nameToTextHsl(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 40%, 35%)`
}

/** Extrait les initiales : jusqu'à 2 mots significatifs. */
function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter((w) => w.length > 1)
  if (words.length === 0) return name.slice(0, 2).toUpperCase()
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

export default function ProductImage({ imageUrl, name, className = '' }: Props) {
  const [errored, setErrored] = useState(false)

  if (imageUrl && !errored) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`w-full h-full object-cover ${className}`}
        onError={() => setErrored(true)}
      />
    )
  }

  // Placeholder : fond coloré + initiales
  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
      style={{ backgroundColor: nameToHsl(name) }}
    >
      <span
        className="text-2xl font-bold tracking-tight select-none"
        style={{ color: nameToTextHsl(name) }}
      >
        {initials(name)}
      </span>
    </div>
  )
}
