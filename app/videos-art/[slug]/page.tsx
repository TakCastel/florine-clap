'use client'

import MdxRenderer from '@/components/MdxRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import VimeoPlayer from '@/components/VimeoPlayer'
import { allVideoArts } from '.contentlayer/generated'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type VideoArtPageProps = {
  params: { slug: string }
}

// Metadata generation removed for client component

export default function VideoArtPage({ params }: VideoArtPageProps) {
  const videoArt = allVideoArts.find(v => v.slug === params.slug)
  
  if (!videoArt) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-theme-cream text-theme-dark">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Vidéos/art', href: '/videos-art' },
          { label: videoArt.title }
        ]}
        variant="default"
      />

      {/* Hero Section avec image de fond */}
      <section className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm" 
          style={{ backgroundImage: `url(${videoArt.image})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-theme-cream via-theme-cream/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-theme-cream/80 via-theme-cream/40 to-transparent"></div>
        
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pb-16 w-full">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-6 text-theme-dark/60 text-sm uppercase tracking-[0.2em] mb-4 font-light">
                {videoArt.duree && (
                  <span>{videoArt.duree}</span>
                )}
                {videoArt.annee && (
                  <span>{videoArt.annee}</span>
                )}
              </div>
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-theme-dark"
                style={{
                  fontFamily: 'var(--font-andalemo), sans-serif',
                  letterSpacing: '-0.03em',
                }}
              >
                {videoArt.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* Player Vimeo */}
            {videoArt.vimeoId && (
              <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
                <VimeoPlayer
                  videoId={videoArt.vimeoId}
                  className="w-full h-full"
                  autoplay={false}
                  muted={false}
                  loop={false}
                  controls={true}
                />
              </div>
            )}
            
            {/* Contenu MDX */}
            <div className="prose prose-lg max-w-none text-theme-dark">
              <MdxRenderer code={videoArt.body.code} />
            </div>
          </div>

          {/* Sidebar avec informations techniques */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="border-t border-theme-dark/10 pt-8">
                <h3 className="text-xl font-display font-bold text-theme-dark mb-6" style={{
                  fontFamily: 'var(--font-andalemo), sans-serif',
                  letterSpacing: '-0.02em',
                }}>
                  Fiche technique
                </h3>
                
                <div className="space-y-6">
                  {/* Réalisation */}
                  {videoArt.realisation && (
                    <div>
                      <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-2 font-light">Réalisation</p>
                      <p className="text-theme-dark font-display font-medium">{videoArt.realisation}</p>
                    </div>
                  )}

                  {/* Mixage */}
                  {videoArt.mixage && (
                    <div>
                      <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-2 font-light">Mixage</p>
                      <p className="text-theme-dark font-display font-medium">{videoArt.mixage}</p>
                    </div>
                  )}

                  {/* Texte */}
                  {videoArt.texte && (
                    <div>
                      <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-2 font-light">Texte</p>
                      <p className="text-theme-dark font-display font-medium">{videoArt.texte}</p>
                    </div>
                  )}

                  {/* Production */}
                  {videoArt.production && (
                    <div>
                      <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-2 font-light">Production</p>
                      <p className="text-theme-dark font-display font-medium">{videoArt.production}</p>
                    </div>
                  )}

                  {/* Durée et année */}
                  {(videoArt.duree || videoArt.annee) && (
                    <div className="pt-6 border-t border-theme-dark/10">
                      <div className="grid grid-cols-2 gap-4">
                        {videoArt.duree && (
                          <div>
                            <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-2 font-light">Durée</p>
                            <p className="text-theme-dark font-display font-medium">{videoArt.duree}</p>
                          </div>
                        )}
                        {videoArt.annee && (
                          <div>
                            <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-2 font-light">Année</p>
                            <p className="text-theme-dark font-display font-medium">{videoArt.annee}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

