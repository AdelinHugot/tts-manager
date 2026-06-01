import { useState } from 'react'
import { MOCK_REALISATIONS, MOCK_PRODUCTS, MOCK_RUSHES } from '../data/mock'
import { MOCK_ORDERS } from '../data/mockAnalytics'
import { fsAddRealisation, fsAddRush, fsSetProduct, fsAddOrder } from '../lib/firestore'

type SeedStatus = 'idle' | 'running' | 'done' | 'error'

export default function Parametres() {
  const [status, setStatus] = useState<SeedStatus>('idle')
  const [progress, setProgress] = useState('')

  async function handleSeed() {
    setStatus('running')
    try {
      setProgress('Import des produits…')
      await Promise.all(MOCK_PRODUCTS.map((p) => fsSetProduct(p)))

      setProgress('Import des rushs…')
      await Promise.all(MOCK_RUSHES.map((r) => fsAddRush(r)))

      setProgress('Import des réalisations…')
      for (const r of MOCK_REALISATIONS) {
        const { id: _id, ...data } = r
        await fsAddRealisation(data)
      }

      setProgress('Import des commandes…')
      let i = 0
      for (const o of MOCK_ORDERS) {
        await fsAddOrder(o)
        i++
        if (i % 20 === 0) setProgress(`Import des commandes… ${i}/${MOCK_ORDERS.length}`)
      }

      setProgress('')
      setStatus('done')
    } catch (err) {
      console.error(err)
      setProgress(String(err))
      setStatus('error')
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Paramètres</h1>
      <p className="text-sm text-slate-400 mb-10">Configuration et gestion de la base de données.</p>

      {/* Seed section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 mb-1">Initialiser la base de données</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Importe les données mock (produits, rushs, réalisations, commandes) dans Firestore.
              À utiliser une seule fois pour démarrer, ou pour réinitialiser avec des données de test.
            </p>
            {status === 'done' && (
              <p className="text-xs text-emerald-600 font-medium mt-2">✓ Import terminé avec succès</p>
            )}
            {status === 'error' && (
              <p className="text-xs text-red-500 font-medium mt-2">Erreur : {progress}</p>
            )}
            {status === 'running' && progress && (
              <p className="text-xs text-brand font-medium mt-2">{progress}</p>
            )}
          </div>
          <button
            onClick={handleSeed}
            disabled={status === 'running' || status === 'done'}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {status === 'running' ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                En cours…
              </>
            ) : status === 'done' ? (
              '✓ Fait'
            ) : (
              'Importer les données'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
