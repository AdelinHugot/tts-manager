import { useState } from 'react'
import Sidebar from './Sidebar'
import Dashboard from '../../pages/Dashboard'
import Analytics from '../../pages/Analytics'
import Realisation from '../../pages/Realisation'
import Produits from '../../pages/Produits'
import Parametres from '../../pages/Parametres'

const PAGE_COMPONENTS: Record<string, React.ComponentType> = {
  dashboard: Dashboard,
  analytics: Analytics,
  realisation: Realisation,
  produits: Produits,
  parametres: Parametres,
}

export default function AppLayout() {
  const [activePage, setActivePage] = useState('realisation')
  const PageComponent = PAGE_COMPONENTS[activePage]

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 overflow-auto">
        <PageComponent />
      </main>
    </div>
  )
}
