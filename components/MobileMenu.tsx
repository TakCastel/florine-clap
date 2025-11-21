'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  isHomePage?: boolean
}

const MENU_ITEMS = [
  { href: '/films', label: 'FILMS' },
  { href: '/mediations', label: 'MÉDIATIONS' },
  { href: '/videos-art', label: 'VIDÉOS/ART' },
  { href: '/actus', label: 'ACTUALITÉS' },
  { href: '/bio', label: 'BIO' }
]

// Icône burger simple
const BurgerIcon = ({ isOpen, color = 'black' }: { isOpen: boolean; color?: 'black' | 'white' }) => {
  const barColor = color === 'white' ? 'bg-white' : 'bg-theme-dark'
  
  return (
    <div className="relative w-6 h-6 flex flex-col justify-center items-center">
      <span 
        className={`absolute w-full h-[2px] ${barColor} transition-all duration-300 ease-in-out origin-center ${
          isOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
        }`} 
      />
      <span 
        className={`absolute w-full h-[2px] ${barColor} transition-all duration-200 ease-in-out ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`} 
      />
      <span 
        className={`absolute w-full h-[2px] ${barColor} transition-all duration-300 ease-in-out origin-center ${
          isOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
        }`} 
      />
    </div>
  )
}

// Bouton burger
const BurgerButton = ({ 
  isOpen, 
  onClick, 
  isHomePage = false 
}: { 
  isOpen: boolean
  onClick: () => void
  isHomePage?: boolean
}) => {
  const iconColor = isHomePage ? 'white' : 'black'
  
  return (
    <button
      onClick={onClick}
      className="md:hidden flex items-center justify-center w-8 h-8 hover:opacity-70 transition-opacity duration-200 z-[110] relative"
      aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
    >
      <BurgerIcon isOpen={isOpen} color={iconColor} />
    </button>
  )
}

// Menu mobile overlay - simple et épuré avec animation
const MobileMenuOverlay = ({ isOpen, onClose, isHomePage = false }: MobileMenuProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [showContent, setShowContent] = useState(false)

  // Gérer les animations et le scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setIsVisible(true)
      // Petit délai pour permettre au DOM de se mettre à jour avant l'animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShowContent(true)
        })
      })
    } else {
      setShowContent(false)
      // Attendre la fin de l'animation avant de cacher complètement
      const timer = setTimeout(() => {
        setIsVisible(false)
        document.body.style.overflow = 'unset'
      }, 300)
      return () => clearTimeout(timer)
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Fermer le menu avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isVisible) return null

  return (
    <div 
      className={`md:hidden fixed inset-0 z-[100] ${
        showContent ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{ 
        width: '100%',
        height: '100%'
      }}
      onClick={(e) => {
        // Fermer si on clique en dehors de la navigation
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      {/* Espace pour le header fixe */}
      <div className="h-16"></div>
      
      {/* Navigation centrée verticalement avec animation et fond */}
      <nav className={`flex items-center justify-center h-[calc(100vh-4rem)] px-6 transition-all duration-300 ease-out bg-theme-cream ${
        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ backgroundColor: '#F5F3F0' }}>
        <div className="space-y-8 w-full">
          {MENU_ITEMS.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`block text-3xl font-display font-normal uppercase text-theme-dark hover:text-theme-dark/60 transition-all duration-300 tracking-wide text-center py-3 ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: showContent ? `${index * 50}ms` : '0ms'
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}

// Composant principal
export default function MobileMenu({ isHomePage = false }: { isHomePage?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <BurgerButton isOpen={isOpen} onClick={handleToggle} isHomePage={isHomePage} />
      <MobileMenuOverlay isOpen={isOpen} onClose={handleClose} isHomePage={isHomePage} />
    </>
  )
}
