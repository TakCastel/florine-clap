'use client'

import { useState, useEffect, useMemo } from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import StackScroll from '@/components/StackScroll'
import PageHeader from '@/components/PageHeader'
import ArticleHeroImage from '@/components/ArticleHeroImage'
import { getImageUrl } from '@/lib/directus'

type ContentItem = {
  id?: string
  _id?: string // Support pour l'ancien format
  slug: string
  title: string
  image?: string | { id: string; filename_download: string } // Support Directus file objects
  cover?: string | { id: string; filename_download: string } // Support Directus file objects
  shortSynopsis?: string
  short_synopsis?: string
  excerpt?: string
  duree?: string
  annee?: string
  date?: string | Date
  vimeoId?: string
  vimeo_id?: string
  order?: number
  [key: string]: any // Permet d'accepter d'autres propriétés
}

type ContentListPageProps = {
  items: ContentItem[]
  basePath: string // '/films' ou '/mediations'
  title: string
  description?: string
  breadcrumbLabel: string
  seoTitle: string
  seoDescription: string
  heroImageUrl?: string | null | { id: string; filename_download: string }
}

export default function ContentListPage({
  items,
  basePath,
  title,
  description,
  breadcrumbLabel,
  seoTitle,
  seoDescription,
  heroImageUrl
}: ContentListPageProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Déclencher l'animation immédiatement sans délai
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])
  
  // Les items sont déjà triés côté serveur, on les utilise directement
  const sortedItems = items

  // Convertir l'image hero en URL si c'est un objet Directus
  const heroImageUrlString = useMemo(() => {
    if (!heroImageUrl) return null
    if (typeof heroImageUrl === 'string') {
      // Si c'est déjà une URL complète, on la retourne
      if (heroImageUrl.startsWith('http')) return heroImageUrl
      // Sinon, on utilise getImageUrl pour convertir l'UUID en URL
      return getImageUrl(heroImageUrl)
    }
    // Si c'est un objet Directus, utiliser getImageUrl
    return getImageUrl(heroImageUrl)
  }, [heroImageUrl])

  return (
    <main id="main-content" className="min-h-screen bg-theme-white text-black relative">
      <div className="relative">
        {/* Image hero en haut */}
        {heroImageUrlString && (
          <ArticleHeroImage 
            imageUrl={heroImageUrlString} 
            alt={`Image de fond pour ${title}`}
          />
        )}
        
        {/* Breadcrumb positionné au-dessus de l'image hero */}
        <div className="relative z-10">
          <div className="max-w-container-small mx-auto px-4 md:px-6 lg:px-10 xl:px-16 pt-20 md:pt-28">
            <Breadcrumb 
              items={[
                { label: 'Accueil', href: '/' },
                { label: breadcrumbLabel }
              ]}
              variant="default"
            />
          </div>
        </div>
      </div>
      
      {/* Conteneur unifié pour en-tête, cards et texte SEO */}
      <div className={`max-w-container-small mx-auto px-4 md:px-6 lg:px-10 xl:px-16 ${heroImageUrlString ? 'relative z-10' : ''}`} style={heroImageUrlString ? { marginTop: '-66vh' } : {}}>
        {/* En-tête de page avec animation */}
        <div className={`${heroImageUrlString ? 'pt-6' : 'pt-12 md:pt-20'} pb-3 md:pb-4 lg:pb-6`}>
          <PageHeader title={title} description={description} />
        </div>
        
        {/* Section avec effet de pile progressive */}
        <StackScroll items={sortedItems} basePath={basePath} />
        
        {/* Contenu SEO */}
        <div className="pt-8 md:pt-12 pb-8 md:pb-12">
          <div className="pt-8 border-t border-black/10">
            <div className="w-full">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-black mb-4">
                {seoTitle}
              </h2>
              <p className="text-base leading-relaxed font-normal text-black/80">
                {seoDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

