import { useRef, useState } from 'react'
import type { Rush } from '../../types/rush'
import { extractVideoMetadata, formatSize, generateId } from '../../utils/videoMetadata'

type Props = {
  rushIds: string[]
  allRushes: Rush[]
  onAdd: (rushes: Rush[]) => void
  onUnlink: (rushId: string) => void
  onLinkExisting?: (rushId: string) => void
}

export default function FileUploadZone({ rushIds, allRushes, onAdd, onUnlink, onLinkExisting }: Props) {
  const [dragging, setDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const linkedRushes = rushIds
    .map((id) => allRushes.find((r) => r.id === id))
    .filter((r): r is Rush => r !== undefined)

  async function handleFiles(fileList: FileList) {
    if (!fileList.length) return
    setProcessing(true)
    const files = Array.from(fileList)
    try {
      const newRushes: Rush[] = await Promise.all(
        files.map(async (f) => {
          const url = URL.createObjectURL(f)
          const { duration, thumbnailUrl } = await extractVideoMetadata(f, url)
          return { id: generateId(), name: f.name, url, size: f.size, duration, thumbnailUrl }
        })
      )
      onAdd(newRushes)
    } catch (err) {
      console.error('[FileUploadZone]', err)
    } finally {
      setProcessing(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)

    const rushId = e.dataTransfer.getData('text/rush-id')
    if (rushId && onLinkExisting) {
      onLinkExisting(rushId)
      return
    }

    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
          dragging
            ? 'border-brand bg-brand/5'
            : 'border-slate-200 bg-slate-50 hover:border-slate-300'
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 text-xl shadow-sm">
          {processing ? (
            <svg className="animate-spin w-5 h-5 text-brand" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          ) : '↑'}
        </div>
        <p className="text-sm font-medium text-slate-600">
          {processing ? 'Traitement en cours…' : 'Déposer les rushs ici'}
        </p>
        {!processing && <p className="text-xs text-slate-400">ou cliquer pour parcourir</p>}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="video/mp4,video/quicktime,video/x-m4v,video/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {linkedRushes.length > 0 && (
        <ul className="space-y-2">
          {linkedRushes.map((rush) => (
            <li
              key={rush.id}
              className="flex items-center gap-3 px-3 py-2.5 bg-white border border-slate-100 rounded-lg"
            >
              {rush.thumbnailUrl ? (
                <img
                  src={rush.thumbnailUrl}
                  alt={rush.name}
                  className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 text-xs flex-shrink-0">
                  ▶
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{rush.name}</p>
                <p className="text-xs text-slate-400">{formatSize(rush.size)}</p>
              </div>
              <button
                onClick={() => onUnlink(rush.id)}
                className="text-slate-300 hover:text-red-400 transition-colors p-1 rounded"
                title="Retirer de cette réalisation"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
