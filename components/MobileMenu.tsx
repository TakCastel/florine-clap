'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const MENU_ITEMS = [
  { href: '/films', label: 'Films' },
  { href: '/mediations', label: 'Mediations' },
  { href: '/actus', label: 'Actualites' },
  { href: '/bio', label: 'Bio' }
]

// Icône burger simple
const BurgerIcon = ({ isOpen }: { isOpen: boolean }) => (
  <div className="relative w-6 h-6 flex flex-col justify-center items-center">
    <span 
      className={`absolute w-full h-0.5 bg-orange-100 transition-all duration-300 ease-in-out ${
        isOpen ? 'rotate-45' : '-translate-y-1.5'
      }`} 
    />
    <span 
      className={`absolute w-full h-0.5 bg-orange-100 transition-all duration-200 ease-in-out ${
        isOpen ? 'opacity-0' : 'opacity-100'
      }`} 
    />
    <span 
      className={`absolute w-full h-0.5 bg-orange-100 transition-all duration-300 ease-in-out ${
        isOpen ? '-rotate-45' : 'translate-y-1.5'
      }`} 
    />
  </div>
)

// Bouton burger
const BurgerButton = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`md:hidden flex items-center justify-center w-8 h-8 hover:opacity-70 transition-all duration-200 ${
      isOpen ? 'relative z-[70]' : ''
    }`}
    aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
  >
    <BurgerIcon isOpen={isOpen} />
  </button>
)

// Menu mobile overlay
const MobileMenuOverlay = ({ isOpen, onClose }: MobileMenuProps) => {
  const [showLinks, setShowLinks] = useState(false)

  // Empecher le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Delai pour permettre au panel de s'ouvrir avant de montrer les liens
      setTimeout(() => setShowLinks(true), 300)
    } else {
      document.body.style.overflow = 'unset'
      setShowLinks(false)
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

  if (!isOpen) return null

  return (
    <div className="md:hidden fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Menu panel */}
      <div className={`absolute inset-0 bg-black transition-transform duration-700 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Navigation */}
        <nav className="flex items-center justify-center h-full">
          <div className="space-y-8">
            {MENU_ITEMS.map((item, index) => (
              <div
                key={item.href}
                className={`transition-all duration-500 ease-out ${
                  showLinks 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: showLinks ? `${index * 100}ms` : '0ms'
                }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block text-2xl font-light text-white hover:text-orange-100 transition-colors duration-300"
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}

// Composant principal
export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <BurgerButton isOpen={isOpen} onClick={handleToggle} />
      <MobileMenuOverlay isOpen={isOpen} onClose={handleClose} />
    </>
  )
}