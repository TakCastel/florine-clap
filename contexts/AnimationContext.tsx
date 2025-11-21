'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface AnimationContextType {
  showAnimations: boolean
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined)

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [showAnimations, setShowAnimations] = useState(true)

  // Désactiver les animations après le premier chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimations(false)
    }, 2000) // 2 secondes après le chargement
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimationContext.Provider value={{
      showAnimations
    }}>
      {children}
    </AnimationContext.Provider>
  )
}

export function useAnimation() {
  const context = useContext(AnimationContext)
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider')
  }
  return context
}
