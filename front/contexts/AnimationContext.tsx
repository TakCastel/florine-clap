'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface AnimationContextType {
  showAnimations: boolean
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined)

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  // Always true for a living site
  const [showAnimations, setShowAnimations] = useState(true)

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
