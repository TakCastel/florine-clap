'use client'

import { ReactNode } from 'react'

interface StickySidebarProps {
  children: ReactNode
  top?: number // Distance from top in pixels
  className?: string
  disableOnMobile?: boolean // Désactiver le sticky sur mobile
}

export default function StickySidebar({ 
  children, 
  top = 32, // Default 2rem (32px)
  className = '',
  disableOnMobile = false
}: StickySidebarProps) {
  // Ce composant ne fait que retourner les children
  // Le sticky est appliqué directement sur l'aside via CSS
  return <>{children}</>
}

