'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface HoverContextType {
  forceHoverIndex: number
  setForceHoverIndex: (index: number) => void
}

const HoverContext = createContext<HoverContextType | undefined>(undefined)

export function HoverProvider({ children }: { children: ReactNode }) {
  const [forceHoverIndex, setForceHoverIndex] = useState(-1)

  return (
    <HoverContext.Provider value={{ forceHoverIndex, setForceHoverIndex }}>
      {children}
    </HoverContext.Provider>
  )
}

export function useHover() {
  const context = useContext(HoverContext)
  if (context === undefined) {
    throw new Error('useHover must be used within a HoverProvider')
  }
  return context
}
