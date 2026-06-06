import { useEffect, useRef, useState } from 'react'
import {
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'
import { auth } from '../lib/firebase'
import { uploadAvatar } from '../lib/storage'
import { useToast } from '../components/ui/Toast'
import { useTikTokAuth } from '../hooks/useTikTokAuth'
import { TIKTOK_CLIENT_KEY } from '../lib/tiktok'

// ─── Section card ─────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-800 mb-5">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}

function Spinner() {
  return <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
}

const INPUT = "w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 placeholder-slate-300 transition-colors"

function TikTokConnectSection() {
  const { status, error, connect, disconnect } = useTikTokAuth()

  if (status === 'not_configured') {
    return (
      <div className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-xl text-sm">
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="text-amber-500 flex-shrink-0 mt-0.5">
          <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M9 5.5v4M9 12v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <div>
          <p className="font-semibold text-amber-800 mb-0.5">Variable d'environnement manquante</p>
          <p className="text-amber-700 text-xs">Crée un fichier <code className="bg-amber-100 px-1 rounded">.env.local</code> avec <code className="bg-amber-100 px-1 rounded">VITE_TIKTOK_CLIENT_KEY=ton_client_key</code></p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* TikTok icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${status === 'connected' ? 'bg-slate-900' : 'bg-slate-100'}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={status === 'connected' ? 'white' : '#94a3b8'}>
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.5a8.27 8.27 0 004.84 1.55V6.6a4.85 4.85 0 01-1.07.09z"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">TikTok</p>
          {status === 'loading' && <p className="text-xs text-slate-400">Chargement…</p>}
          {status === 'connected' && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Connecté — vues synchronisées
            </span>
          )}
          {status === 'disconnected' && <p className="text-xs text-slate-400">Non connecté</p>}
          {status === 'error' && <p className="text-xs text-red-500">{error ?? 'Erreur'}</p>}
        </div>
      </div>
      {status === 'connected' ? (
        <button
          onClick={disconnect}
          className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg border border-slate-200 hover:border-red-200"
        >
          Déconnecter
        </button>
      ) : status === 'disconnected' || status === 'error' ? (
        <button
          onClick={connect}
          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-700 transition-colors px-3 py-1.5 rounded-lg"
        >
          <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
            <path d="M9 2v7m0 0l-3-3m3 3l3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 13v1a2 2 0 002 2h8a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Connecter
        </button>
      ) : null}
    </div>
  )
}

export default function Parametres() {
  const user = auth.currentUser
  const { toast } = useToast()

  // ── Avatar ───────────────────────────────────────────────────────────────────
  const [photoURL, setPhotoURL]             = useState(user?.photoURL ?? '')
  const [avatarUploading, setAvatarUploading] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  async function handleAvatarFile(file: File) {
    if (!user) return
    setAvatarUploading(true)
    try {
      const url = await uploadAvatar(user.uid, file)
      await updateProfile(user, { photoURL: url })
      setPhotoURL(url)
      toast('Photo de profil mise à jour')
    } catch {
      toast('Erreur lors de l\'upload', 'error')
    } finally {
      setAvatarUploading(false)
    }
  }

  // ── Profil ──────────────────────────────────────────────────────────────────
  const [displayName, setDisplayName] = useState(user?.displayName ?? '')
  const [email, setEmail]             = useState(user?.email ?? '')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileError, setProfileError]   = useState('')

  useEffect(() => {
    setDisplayName(user?.displayName ?? '')
    setEmail(user?.email ?? '')
    setPhotoURL(user?.photoURL ?? '')
  }, [user])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setProfileSaving(true)
    setProfileError('')
    try {
      if (user) {
        if (displayName !== user.displayName) await updateProfile(user, { displayName })
        if (email !== user.email) await updateEmail(user, email)
      }
      toast('Profil enregistré')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('requires-recent-login')) {
        setProfileError('Veuillez vous reconnecter avant de changer l\'email.')
      } else {
        setProfileError('Une erreur est survenue.')
      }
      toast('Erreur lors de la sauvegarde', 'error')
    } finally {
      setProfileSaving(false)
    }
  }

  // ── Mot de passe ─────────────────────────────────────────────────────────────
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd]         = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdSaving, setPwdSaving]   = useState(false)
  const [pwdError, setPwdError]     = useState('')

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwdError('')
    if (newPwd.length < 6) { setPwdError('Le mot de passe doit contenir au moins 6 caractères.'); return }
    if (newPwd !== confirmPwd) { setPwdError('Les mots de passe ne correspondent pas.'); return }
    setPwdSaving(true)
    try {
      if (user && user.email) {
        const cred = EmailAuthProvider.credential(user.email, currentPwd)
        await reauthenticateWithCredential(user, cred)
        await updatePassword(user, newPwd)
      }
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('')
      toast('Mot de passe modifié')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setPwdError('Mot de passe actuel incorrect.')
      } else {
        setPwdError('Une erreur est survenue.')
      }
      toast('Erreur lors du changement de mot de passe', 'error')
    } finally {
      setPwdSaving(false)
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-5">
      <div className="mb-8 hidden md:block">
        <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
        <p className="text-sm text-slate-400 mt-0.5">Gérez votre compte et la configuration de l'app.</p>
      </div>

      {/* ── Intégrations ── */}
      <Section title="Intégrations">
        <div className="space-y-4">
          <TikTokConnectSection />
          {TIKTOK_CLIENT_KEY && (
            <p className="text-xs text-slate-400 leading-relaxed">
              La connexion TikTok permet de récupérer les <span className="font-medium text-slate-500">vues, likes et partages</span> de tes vidéos
              directement dans l'onglet Analytics → Vidéos. Les données sont mises en cache 6h.
            </p>
          )}
        </div>
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">

        {/* ── Profil ── */}
        <Section title="Profil">
          <form onSubmit={handleSaveProfile} className="space-y-4">

            {/* Photo */}
            <div className="flex items-center gap-4 pb-2">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-brand to-indigo-400 flex items-center justify-center text-white text-lg font-bold shadow-sm">
                  {photoURL
                    ? <img src={photoURL} alt="" className="w-full h-full object-cover" />
                    : (displayName || user?.email || '?').slice(0, 2).toUpperCase()
                  }
                </div>
                {avatarUploading && (
                  <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAvatarFile(f) }}
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="text-xs font-semibold text-brand hover:text-brand/80 transition-colors disabled:opacity-50"
                >
                  {avatarUploading ? 'Upload en cours…' : 'Changer la photo'}
                </button>
                {photoURL && !avatarUploading && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!user) return
                      await updateProfile(user, { photoURL: null })
                      setPhotoURL('')
                      toast('Photo supprimée', 'info')
                    }}
                    className="block text-xs text-slate-400 hover:text-red-400 transition-colors mt-0.5"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>

            <Field label="Nom affiché">
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Adelin Hugot" className={INPUT} />
            </Field>
            <Field label="Adresse email">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@email.com" className={INPUT} />
            </Field>
            {profileError && <p className="text-xs text-red-500 font-medium">{profileError}</p>}
            <div className="flex justify-end pt-1">
              <button type="submit" disabled={profileSaving}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-brand text-white hover:bg-brand/90 transition-colors shadow-sm disabled:opacity-60">
                {profileSaving ? <><Spinner /> Enregistrement…</> : 'Enregistrer'}
              </button>
            </div>
          </form>
        </Section>

        {/* ── Mot de passe ── */}
        <Section title="Changer le mot de passe">
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Field label="Mot de passe actuel">
              <input type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)}
                placeholder="••••••••" required className={INPUT} />
            </Field>
            <Field label="Nouveau mot de passe">
              <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)}
                placeholder="••••••••" required className={INPUT} />
            </Field>
            <Field label="Confirmer le nouveau mot de passe">
              <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="••••••••" required className={INPUT} />
            </Field>
            {pwdError && <p className="text-xs text-red-500 font-medium">{pwdError}</p>}
            <div className="flex justify-end pt-1">
              <button type="submit" disabled={pwdSaving}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-brand text-white hover:bg-brand/90 transition-colors shadow-sm disabled:opacity-60">
                {pwdSaving ? <><Spinner /> Enregistrement…</> : 'Enregistrer'}
              </button>
            </div>
          </form>
        </Section>

      </div>
    </div>
  )
}
