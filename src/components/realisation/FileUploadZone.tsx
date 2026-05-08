import { useRef, useState } from 'react'
import type { RushFile } from '../../types/realisation'

type Props = {
  rushes: RushFile[]
  onAdd: (files: RushFile[]) => void
  onRemove: (id: string) => void
}

function formatSize(bytes: number): string {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} Go`
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(0)} Mo`
  return `${(bytes / 1_000).toFixed(0)} Ko`
}

export default function FileUploadZone({ rushes, onAdd, onRemove }: Props) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(fileList: FileList) {
    const newRushes: RushFile[] = Array.from(fileList).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      url: URL.createObjectURL(f),
      size: f.size,
    }))
    onAdd(newRushes)
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
          dragging
            ? 'border-brand bg-brand/5'
            : 'border-slate-200 bg-slate-50 hover:border-slate-300'
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 text-xl shadow-sm">
          ↑
        </div>
        <p className="text-sm font-medium text-slate-600">
          Déposer les rushs ici
        </p>
        <p className="text-xs text-slate-400">ou cliquer pour parcourir</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="video/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {rushes.length > 0 && (
        <ul className="space-y-2">
          {rushes.map((rush) => (
            <li
              key={rush.id}
              className="flex items-center gap-3 px-3 py-2.5 bg-white border border-slate-100 rounded-lg"
            >
              <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 text-xs flex-shrink-0">
                ▶
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{rush.name}</p>
                <p className="text-xs text-slate-400">{formatSize(rush.size)}</p>
              </div>
              <button
                onClick={() => onRemove(rush.id)}
                className="text-slate-300 hover:text-red-400 transition-colors p-1 rounded"
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
