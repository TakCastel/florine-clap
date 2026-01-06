'use client'

import { useState, useEffect } from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import StackScroll from '@/components/StackScroll'
import PageHeader from '@/components/PageHeader'

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
  description: string
  breadcrumbLabel: string
  seoTitle: string
  seoDescription: string
}

export default function ContentListPage({
  items,
  basePath,
  title,
  description,
  breadcrumbLabel,
  seoTitle,
  seoDescription
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

  return (
    <main id="main-content" className="min-h-screen bg-theme-white text-black relative">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: breadcrumbLabel }
        ]}
        variant="default"
      />
      
      <div className="max-w-4xl mx-auto px-6 md:px-10 lg:px-16 pt-12 md:pt-20 pb-0">
        {/* En-tête de page avec animation */}
        <PageHeader title={title} description={description} />
      </div>
      
      {/* Section avec effet de pile progressive */}
      <StackScroll items={sortedItems} basePath={basePath} />
      
      {/* Contenu SEO */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-20">
        <div className="pt-12 border-t border-black/10">
          <div className="w-full">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-black mb-6">
              {seoTitle}
            </h2>
            <p className="text-base leading-relaxed font-normal text-black/80">
              {seoDescription}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

