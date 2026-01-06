'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar } from 'lucide-react'
import CtaLink from '@/components/CtaLink'

type ActuCardProps = {
  href: string
  title: string
  cover?: string
  excerpt?: string
  body?: string
  date: string
}

export default function ActuCard({ 
  href, 
  title, 
  cover, 
  excerpt, 
  body,
  date 
}: ActuCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  
  // Créer un extrait depuis le body si excerpt n'existe pas
  const getExcerpt = () => {
    if (excerpt) return excerpt
    
    if (body) {
      // Enlever le markdown et les balises HTML
      const text = body
        .replace(/^#\s+.*$/gm, '') // Enlever les titres h1
        .replace(/##\s+/g, '') // Enlever les ##
        .replace(/[#*_`\[\]()]/g, '') // Enlever les caractères markdown
        .replace(/\n+/g, ' ') // Remplacer les sauts de ligne par des espaces
        .trim()
      
      // Limiter à 150 caractères
      if (text.length > 150) {
        return text.substring(0, 150).trim() + '...'
      }
      return text
    }
    
    return null
  }
  
  const displayExcerpt = getExcerpt()

  return (
    <Link 
      href={href} 
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-stretch">
        {/* Image à gauche - pleine hauteur */}
        {cover && (
          <div className="relative w-full md:w-48 lg:w-56 h-48 md:h-auto flex-shrink-0 overflow-hidden bg-gray-100">
            <Image 
              src={cover} 
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 224px"
            />
          </div>
        )}
        
        {/* Contenu à droite */}
        <div className="flex-1 flex flex-col justify-between min-w-0 md:min-h-[192px]">
          <div>
            {/* Titre - police réduite */}
            <h3 className="text-base font-bold text-black mb-3 line-clamp-2">
              {title}
            </h3>
            
            {/* Date */}
            <div className="flex items-center gap-2 text-xs text-black/60 mb-4">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            
            {/* Résumé - police réduite, espacement augmenté */}
            {displayExcerpt && (
              <p className="text-base text-black/70 leading-loose line-clamp-3 mb-4">
                {displayExcerpt}
              </p>
            )}
          </div>
          
          {/* Composant Lire avec trait et flèche - s'étend au survol du bloc */}
          <div className="mt-auto pt-2">
            <CtaLink
              label="Lire"
              tone="dark"
              as="span"
              isActive={isHovered}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
