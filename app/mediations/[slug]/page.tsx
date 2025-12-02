'use client'

import MdxRenderer from '@/components/MdxRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import VimeoPlayer from '@/components/VimeoPlayer'
import { allMediations } from '.contentlayer/generated'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type MediationPageProps = {
  params: { slug: string }
}

// Metadata generation removed for client component

export default function MediationPage({ params }: MediationPageProps) {
  const mediation = allMediations.find(m => m.slug === params.slug)
  
  if (!mediation) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-theme-white text-black">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Médiations', href: '/mediations' },
          { label: mediation.title }
        ]}
        variant="default"
      />

      {/* Hero Section avec image de fond */}
      <section className="relative h-[30vh] min-h-[200px] overflow-hidden">
        {mediation.cover ? (
          <div 
            className="absolute inset-0 bg-cover bg-top bg-no-repeat blur-[2px] grayscale" 
            style={{ backgroundImage: `url(${mediation.cover})` }}
          ></div>
        ) : (
          <div className="absolute inset-0 bg-black/5"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-theme-white via-theme-white/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-theme-white/80 via-theme-white/40 to-transparent"></div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 w-full">
            <div className="text-center max-w-4xl mx-auto">
              <h1 
                className="heading-page text-black"
              >
                {mediation.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <div className="relative z-30 max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 -mt-10 md:-mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* Image dans l'article */}
            {mediation.cover ? (
              <div className="relative w-full aspect-video overflow-hidden mb-8">
                <img
                  src={mediation.cover}
                  alt={mediation.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="relative w-full aspect-video bg-black/5 flex items-center justify-center mb-8">
                <div className="text-center text-black/30">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm uppercase tracking-[0.2em]">Image non disponible</p>
                </div>
              </div>
            )}
            
            {/* Contenu MDX */}
            <div className="prose prose-lg max-w-none text-black mb-12 [&_p]:text-justify [&_li]:text-justify">
              <MdxRenderer code={mediation.body.code} />
            </div>

            {/* Player Vimeo en fin d'article */}
            {(mediation as any).vimeoId ? (
              <div className="relative w-full aspect-video overflow-hidden">
                <VimeoPlayer
                  videoId={(mediation as any).vimeoId}
                  className="w-full h-full"
                  autoplay={false}
                  muted={false}
                  loop={false}
                  controls={true}
                />
              </div>
            ) : (mediation as any).videoUrl ? (
              <div className="relative w-full aspect-video overflow-hidden">
                <video
                  src={(mediation as any).videoUrl}
                  controls
                  className="w-full h-full object-contain"
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>
            ) : (
              <div className="relative w-full aspect-video bg-black/5 flex items-center justify-center">
                <div className="text-center text-black/30">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm uppercase tracking-[0.2em]">Vidéo non disponible</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar avec métadonnées organisées */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Informations */}
              <div className="border-t border-black/10 pt-8 mb-8">
                <h3 className="heading-subtitle text-black mb-6">
                  Informations
                </h3>
                
                <div className="space-y-6">
                  {/* Date */}
                  <div>
                    <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Date</p>
                    <p className="text-black font-display font-medium">
                      {new Date(mediation.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* Lieu */}
                  {mediation.lieu && (
                    <div>
                      <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Lieu</p>
                      <p className="text-black font-display font-medium">{mediation.lieu}</p>
                    </div>
                  )}

                  {/* Durée */}
                  {mediation.duree && (
                    <div>
                      <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Durée</p>
                      <p className="text-black font-display font-medium">{mediation.duree}</p>
                    </div>
                  )}

                  {/* Tags */}
                  {mediation.tags && mediation.tags.length > 0 && (
                    <div>
                      <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-3 font-light">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {mediation.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1.5 bg-black/5 border border-black/10 text-black text-sm rounded-full font-display font-light"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Retour aux médiations */}
              <div className="border-t border-black/10 pt-8">
                <a 
                  href="/mediations"
                  className="inline-flex items-center gap-2 text-black/70 hover:text-black transition-colors font-display font-light text-sm uppercase tracking-[0.1em]"
                >
                  ← Retour aux médiations
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}