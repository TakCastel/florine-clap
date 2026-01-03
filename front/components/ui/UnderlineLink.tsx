'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface UnderlineLinkProps {
  href: string
  children: ReactNode
  /** Variante de couleur : 'light' pour page d'accueil (texte blanc), 'dark' pour autres pages (texte sombre) */
  variant?: 'light' | 'dark'
  className?: string
  onClick?: () => void
}

/**
 * Composant de lien avec animation de soulignement au survol
 * Utilisé pour le logo et les liens de navigation
 */
export const UnderlineLink = ({ 
  href, 
  children, 
  variant = 'dark',
  className = '',
  onClick
}: UnderlineLinkProps) => {
  const router = useRouter()
  
  // Classes de base pour l'animation de soulignement
  // Utilisation de pb-1 pour garantir un espacement uniforme entre le texte et le trait
  const baseClasses = `font-display font-normal uppercase cursor-pointer relative inline-block pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:transition-all after:duration-500 after:ease-out hover:after:w-full tracking-wide transition-colors duration-300 text-base leading-normal`
  
  // Classes de couleur selon la variante
  const colorClasses = variant === 'light'
    ? 'text-white/75 hover:text-white after:bg-white' 
    : 'text-black/80 hover:text-black after:bg-black'

  const combinedClasses = `${baseClasses} ${colorClasses} ${className}`.trim()

  // Si onClick est fourni, gérer le clic et la navigation
  if (onClick) {
    return (
      <Link 
        href={href}
        onClick={(e) => {
          onClick()
          // La navigation se fait automatiquement via le Link Next.js
        }}
        className={combinedClasses}
      >
        {children}
      </Link>
    )
  }

  // Sinon, utiliser le Link Next.js normal
  return (
    <Link 
      href={href}
      className={combinedClasses}
    >
      {children}
    </Link>
  )
}

