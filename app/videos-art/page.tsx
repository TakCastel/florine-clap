'use client'

import { useState, useEffect } from 'react'
import VideoArtCard from '@/components/VideoArtCard'
import Breadcrumb from '@/components/Breadcrumb'
import ScrollRevealCard from '@/components/ScrollRevealCard'
import { allVideoArts } from '.contentlayer/generated'

export const dynamic = 'force-dynamic'

export default function VideosArtPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Déclencher l'animation immédiatement sans délai
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])
  
  // Trier toutes les vidéos-art par date (plus récent en premier)
  const sortedVideoArts = [...allVideoArts].sort((a, b) => new Date(b.annee || '2020').getTime() - new Date(a.annee || '2020').getTime())

  return (
    <div className="min-h-screen bg-theme-cream text-theme-dark relative overflow-hidden">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Vidéos/art' }
        ]}
        variant="default"
      />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-12 md:py-20">
        {/* Titre de la page avec animation */}
        <div className="mb-16 md:mb-24">
          <div 
            className="overflow-hidden mb-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s',
            }}
          >
            <h1 
              className="heading-display text-theme-videos-art"
            >
              Vidéos/art
            </h1>
          </div>
          
          {/* Ligne décorative animée */}
          <div className="h-[2px] bg-theme-dark/10 w-full max-w-md overflow-hidden">
            <div 
              className="h-full bg-theme-videos-art transition-all duration-500 ease-out"
              style={{
                width: isVisible ? '100%' : '0%',
                transitionDelay: '0.1s',
              }}
            ></div>
          </div>

          <p 
            className="body-text text-theme-videos-art/80 mt-6 max-w-2xl"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease-out 0.15s, transform 0.4s ease-out 0.15s',
            }}
          >
            Découvrez mes créations vidéo artistiques et mes projets expérimentaux
          </p>
        </div>
        
        {/* Liste de toutes les vidéos-art en grandes cards */}
        <div className="space-y-12 md:space-y-16">
          {sortedVideoArts.map((videoArt, index) => (
            <ScrollRevealCard key={videoArt._id} delay={index * 0.05}>
              <VideoArtCard
                href={`/videos-art/${videoArt.slug}`}
                title={videoArt.title}
                cover={videoArt.image}
                synopsis={videoArt.shortSynopsis}
                duree={videoArt.duree}
                annee={videoArt.annee}
                vimeoId={videoArt.vimeoId}
                isHero={true}
              />
            </ScrollRevealCard>
          ))}
        </div>

        {/* Contenu SEO */}
        <div className="mt-24 pt-12 border-t border-theme-dark/10">
          <div className="max-w-4xl">
            <h2 className="heading-section text-black mb-6">
              Mes créations vidéo artistiques
            </h2>
            <p className="body-text text-theme-videos-art/80">
              Découvrez mes vidéos artistiques qui explorent les frontières entre le cinéma et l'art contemporain. 
              Chaque création est une invitation à expérimenter de nouvelles formes narratives et visuelles.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}



