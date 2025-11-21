'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const router = useRouter()

  const navigateWithTransition = (path: string) => {
    setIsTransitioning(true)
    
    // Navigation immédiate avec transition fluide
    router.push(path)
    
    // Reset de la transition après un court délai
    setTimeout(() => {
      setIsTransitioning(false)
    }, 150)
  }

  return {
    isTransitioning,
    navigateWithTransition
  }
}
