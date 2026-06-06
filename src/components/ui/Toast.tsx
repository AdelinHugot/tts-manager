import { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info'

type ToastItem = {
  id: string
  message: string
  type: ToastType
}

type ToastContextType = {
  toast: (message: string, type?: ToastType) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextType>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }, [])

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 32, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 32, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="pointer-events-auto"
            >
              <ToastCard toast={t} onDismiss={() => dismiss(t.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

const CONFIG: Record<ToastType, { icon: string; dot: string }> = {
  success: { icon: '✓', dot: 'bg-emerald-400' },
  error:   { icon: '✕', dot: 'bg-red-400' },
  info:    { icon: 'i', dot: 'bg-brand' },
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const { icon, dot } = CONFIG[toast.type]
  return (
    <div className="flex items-center gap-3 pl-3.5 pr-3 py-3 bg-slate-900 text-white text-sm rounded-xl shadow-xl min-w-[220px] max-w-sm">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
      <span className="flex-1 font-medium leading-snug">{toast.message}</span>
      <button
        onClick={onDismiss}
        aria-label="Fermer"
        className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-white/30 hover:text-white transition-colors text-xs"
      >
        {icon === '✕' ? '✕' : '✕'}
      </button>
    </div>
  )
}
