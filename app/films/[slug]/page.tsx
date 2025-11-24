'use client'

import MdxRenderer from '@/components/MdxRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import VimeoPlayer from '@/components/VimeoPlayer'
import { allFilms } from '.contentlayer/generated'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type FilmPageProps = {
  params: { slug: string }
}

// Metadata generation removed for client component

export default function FilmPage({ params }: FilmPageProps) {
  const film = allFilms.find(f => f.slug === params.slug)
  
  if (!film) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-theme-cream text-theme-dark">
      {/* Hero Section avec image de fond */}
      <section className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-top bg-no-repeat blur-[2px] filter-[sepia(20%)_saturate(150%)_hue-rotate(340deg)_brightness(0.9)]" 
          style={{ backgroundImage: `url(${film.image})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-theme-cream via-theme-cream/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-theme-cream/80 via-theme-cream/40 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 z-30">
          <Breadcrumb 
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Films', href: '/films' },
              { label: film.title }
            ]}
            variant="default"
          />
        </div>
        
        <div className="relative z-10 h-full flex items-end pt-24 md:pt-28">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pb-16 w-full">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-6 text-theme-dark/60 text-sm uppercase tracking-[0.2em] mb-4 font-light">
                {film.duree && (
                  <span>{film.duree}</span>
                )}
                {film.annee && (
                  <span>{film.annee}</span>
                )}
              </div>
              <h1 
                className="heading-page text-theme-dark"
              >
                {film.title}
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
            {/* Player Vimeo */}
            {film.vimeoId ? (
              <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
                <VimeoPlayer
                  videoId={film.vimeoId}
                  className="w-full h-full"
                  autoplay={false}
                  muted={false}
                  loop={false}
                  controls={true}
                />
              </div>
            ) : film.videoUrl ? (
              /* Player vidéo directe (URL) */
              <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
                <video
                  src={film.videoUrl}
                  controls
                  className="w-full h-full object-contain"
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>
            ) : (
              /* Placeholder vidéo non disponible */
              <div className="relative aspect-video overflow-hidden mb-8 bg-theme-dark/5 border border-theme-dark/10 flex items-center justify-center">
                <div className="text-center px-6">
                  <svg 
                    className="w-16 h-16 mx-auto mb-4 text-theme-dark/30" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.41.41v11.18a.75.75 0 01-1.41.41l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <p className="text-theme-dark/50 font-display font-light text-sm uppercase tracking-[0.1em]">
                    Vidéo non disponible
                  </p>
                </div>
              </div>
            )}
            
            {/* Contenu MDX */}
            <div className="prose prose-lg max-w-none text-theme-dark [&_p]:text-justify [&_li]:text-justify">
              <MdxRenderer code={film.body.code} />
            </div>
          </div>

          {/* Sidebar avec métadonnées organisées */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Fiche technique */}
              <div className="border-t border-theme-dark/10 pt-8 mb-8">
                <h3 className="heading-subtitle text-theme-dark mb-6">
                  Fiche technique
                </h3>
                
                <div className="space-y-6">
                  {film.realisation && (
                    <div>
                      <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-2 font-light">Réalisation</p>
                      <p className="text-theme-dark font-display font-medium">{film.realisation}</p>
                    </div>
                  )}

                  {film.montage && (
                    <div>
                      <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-2 font-light">Montage</p>
                      <p className="text-theme-dark font-display font-medium">{film.montage}</p>
                    </div>
                  )}

                  {film.son && (
                    <div>
                      <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-2 font-light">Son</p>
                      <p className="text-theme-dark font-display font-medium">{film.son}</p>
                    </div>
                  )}

                  {film.mixage && (
                    <div>
                      <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-2 font-light">Mixage</p>
                      <p className="text-theme-dark font-display font-medium">{film.mixage}</p>
                    </div>
                  )}

                  {film.musique && (
                    <div>
                      <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-2 font-light">Musique</p>
                      <p className="text-theme-dark font-display font-medium">{film.musique}</p>
                    </div>
                  )}

                  {film.texte && (
                    <div>
                      <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-2 font-light">Texte</p>
                      <p className="text-theme-dark font-display font-medium">{film.texte}</p>
                    </div>
                  )}

                  {film.avec && (
                    <div>
                      <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-2 font-light">Avec</p>
                      <p className="text-theme-dark font-display font-medium">{film.avec}</p>
                    </div>
                  )}

                  {film.production && (
                    <div>
                      <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-2 font-light">Production</p>
                      <p className="text-theme-dark font-display font-medium">{film.production}</p>
                    </div>
                  )}

                  {(film.duree || film.annee) && (
                    <div className="pt-6 border-t border-theme-dark/10">
                      <div className="grid grid-cols-2 gap-4">
                        {film.duree && (
                          <div>
                            <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-2 font-light">Durée</p>
                            <p className="text-theme-dark font-display font-medium">{film.duree}</p>
                          </div>
                        )}
                        {film.annee && (
                          <div>
                            <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-2 font-light">Année</p>
                            <p className="text-theme-dark font-display font-medium">{film.annee}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Diffusion/Sélection */}
              {(film.diffusion && film.diffusion.length > 0) || (film.selection && film.selection.length > 0) ? (
                <div className="border-t border-theme-dark/10 pt-8 mb-8">
                  <h3 className="heading-subtitle text-theme-dark mb-6">
                    Diffusion / Sélection
                  </h3>
                  
                  <div className="space-y-4">
                    {film.diffusion && film.diffusion.length > 0 && (
                      <div>
                        <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-3 font-light">Diffusion</p>
                        <ul className="space-y-2">
                          {film.diffusion.map((item, index) => (
                            <li key={index} className="text-theme-dark font-display font-medium text-sm">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {film.selection && film.selection.length > 0 && (
                      <div>
                        <p className="text-xs text-theme-dark/50 uppercase tracking-[0.2em] mb-3 font-light">Sélection</p>
                        <ul className="space-y-2">
                          {film.selection.map((item, index) => (
                            <li key={index} className="text-theme-dark font-display font-medium text-sm">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Voir le film */}
              {film.lienFilm && (
                <div className="border-t border-theme-dark/10 pt-8 mb-8">
                  <h3 className="heading-subtitle text-theme-dark mb-6">
                    Voir le film
                  </h3>
                  
                  <a 
                    href={film.lienFilm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-theme-dark/70 hover:text-theme-dark transition-colors font-display font-light text-sm uppercase tracking-[0.1em]"
                  >
                    Voir le film →
                  </a>
                </div>
              )}

              {/* Remerciements */}
              {film.remerciements && (
                <div className="border-t border-theme-dark/10 pt-8">
                  <h3 className="heading-subtitle text-theme-dark mb-6">
                    Remerciements
                  </h3>
                  
                  <p className="body-text-sm text-theme-dark font-display font-medium">
                    {film.remerciements}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}