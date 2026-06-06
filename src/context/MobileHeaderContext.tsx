import { createContext, useContext, useState, type ReactNode } from 'react'

type MobileHeaderContextType = {
  actions: ReactNode
  setActions: (a: ReactNode) => void
}

const MobileHeaderContext = createContext<MobileHeaderContextType>({
  actions: null,
  setActions: () => {},
})

export function MobileHeaderProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<ReactNode>(null)
  return (
    <MobileHeaderContext.Provider value={{ actions, setActions }}>
      {children}
    </MobileHeaderContext.Provider>
  )
}

export function useMobileHeaderActions() {
  return useContext(MobileHeaderContext)
}
