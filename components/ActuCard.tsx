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
  date: string
}

export default function ActuCard({ 
  href, 
  title, 
  cover, 
  excerpt, 
  date 
}: ActuCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <Link 
      href={href} 
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Image à gauche */}
        {cover && (
          <div className="relative w-full md:w-48 lg:w-56 h-48 md:h-40 flex-shrink-0 overflow-hidden bg-gray-100">
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
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Titre */}
            <h3 className="text-xl md:text-2xl font-bold text-black mb-3 line-clamp-2">
              {title}
            </h3>
            
            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-black/60 mb-4">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            
            {/* Résumé - 2 ou 3 lignes avec ... si trop long */}
            {excerpt && (
              <p className="text-base text-black/70 leading-relaxed line-clamp-3 mb-4">
                {excerpt}
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
