import { useEffect, useRef, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from './lib/firebase'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/Login'
import { ToastProvider } from './components/ui/Toast'
import { Skeleton } from './components/ui/Skeleton'
import { useTikTokAuth } from './hooks/useTikTokAuth'
import './index.css'

// Handles the TikTok OAuth redirect (?code=...&state=...) after login is confirmed
function AppWithTikTokCallback({ user }: { user: User }) {
  const { handleCallback } = useTikTokAuth()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')
    if (code && state) {
      handled.current = true
      // Clean the URL so it doesn't re-trigger on re-render
      window.history.replaceState({}, '', window.location.pathname)
      handleCallback(code, state)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return <AppLayout />
}

export default function App() {
  const [user, setUser]       = useState<User | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setChecking(false)
    })
    return unsub
  }, [])

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4F6FA]">
        <Skeleton className="w-7 h-7 rounded-full" />
      </div>
    )
  }

  return (
    <ToastProvider>
      {user ? <AppWithTikTokCallback user={user} /> : <Login />}
    </ToastProvider>
  )
}
