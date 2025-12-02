'use client'

import { useState, useEffect } from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import StackScroll from '@/components/StackScroll'

type ContentItem = {
  _id: string
  slug: string
  title: string
  image?: string
  cover?: string
  shortSynopsis?: string
  excerpt?: string
  duree?: string
  annee?: string
  date?: string | Date
  vimeoId?: string
  order?: number
  [key: string]: any // Permet d'accepter d'autres propriétés
}

type ContentListPageProps = {
  items: ContentItem[]
  basePath: string // '/films' ou '/mediations'
  title: string
  description: string
  breadcrumbLabel: string
  seoTitle: string
  seoDescription: string
  sortFunction?: (a: any, b: any) => number
}

export default function ContentListPage({
  items,
  basePath,
  title,
  description,
  breadcrumbLabel,
  seoTitle,
  seoDescription,
  sortFunction
}: ContentListPageProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Déclencher l'animation immédiatement sans délai
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])
  
  // Trier les items
  const sortedItems = sortFunction 
    ? [...items].sort(sortFunction)
    : [...items].sort((a, b) => {
        // Tri par défaut : par ordre si disponible, sinon par date
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order
        }
        if (a.order !== undefined) return -1
        if (b.order !== undefined) return 1
        
        // Sinon par date
        const dateA = a.date || a.annee || '2020'
        const dateB = b.date || b.annee || '2020'
        return new Date(dateB).getTime() - new Date(dateA).getTime()
      })

  return (
    <div className="min-h-screen bg-theme-white text-black relative">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: breadcrumbLabel }
        ]}
        variant="default"
      />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pt-12 md:pt-20 pb-0">
        {/* Titre de la page avec animation */}
        <div className="mb-8 md:mb-12">
          <div 
            className="overflow-hidden mb-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s',
            }}
          >
            <h1 
              className="heading-display text-black"
            >
              {title}
            </h1>
          </div>
          
          {/* Ligne décorative animée */}
          <div className="h-[2px] bg-black/10 w-full max-w-md overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-500 ease-out"
              style={{
                width: isVisible ? '100%' : '0%',
                transitionDelay: '0.1s',
              }}
            ></div>
          </div>

          <p 
            className="body-text text-black/80 mt-6 max-w-2xl"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease-out 0.15s, transform 0.4s ease-out 0.15s',
            }}
          >
            {description}
          </p>
        </div>
      </div>
      
      {/* Section avec effet de pile progressive */}
      <StackScroll items={sortedItems} basePath={basePath} />
      
      {/* Contenu SEO */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-20">
        <div className="pt-12 border-t border-black/10">
          <div className="max-w-4xl">
            <h2 className="heading-section text-black mb-6">
              {seoTitle}
            </h2>
            <p className="body-text text-black/80">
              {seoDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

