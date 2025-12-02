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
    <div className="min-h-screen bg-theme-white text-black">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Films', href: '/films' },
          { label: film.title }
        ]}
        variant="default"
      />

      {/* Hero Section avec image de fond */}
      <section className="relative h-[30vh] min-h-[200px] overflow-hidden">
        {film.image ? (
          <div 
            className="absolute inset-0 bg-cover bg-top bg-no-repeat blur-[2px] grayscale" 
            style={{ backgroundImage: `url(${film.image})` }}
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
            {/* Image dans l'article */}
            {film.image ? (
              <div className="relative w-full aspect-video overflow-hidden mb-8">
                <img
                  src={film.image}
                  alt={film.title}
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
              <MdxRenderer code={film.body.code} />
            </div>

            {/* Player Vimeo en fin d'article */}
            {film.vimeoId ? (
              <div className="relative w-full aspect-video overflow-hidden">
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
              <div className="relative w-full aspect-video overflow-hidden">
                <video
                  src={film.videoUrl}
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
              {/* Fiche technique */}
              <div className="border-t border-black/10 pt-8 mb-8">
                <h3 className="heading-subtitle text-black mb-6">
                  Fiche technique
                </h3>
                
                <div className="space-y-6">
                  {film.realisation && (
                    <div>
                      <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Réalisation</p>
                      <p className="text-black font-display font-medium">{film.realisation}</p>
                    </div>
                  )}

                  {film.montage && (
                    <div>
                      <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Montage</p>
                      <p className="text-black font-display font-medium">{film.montage}</p>
                    </div>
                  )}

                  {film.son && (
                    <div>
                      <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Son</p>
                      <p className="text-black font-display font-medium">{film.son}</p>
                    </div>
                  )}

                  {film.mixage && (
                    <div>
                      <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Mixage</p>
                      <p className="text-black font-display font-medium">{film.mixage}</p>
                    </div>
                  )}

                  {film.musique && (
                    <div>
                      <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Musique</p>
                      <p className="text-black font-display font-medium">{film.musique}</p>
                    </div>
                  )}

                  {film.texte && (
                    <div>
                      <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Texte</p>
                      <p className="text-black font-display font-medium">{film.texte}</p>
                    </div>
                  )}

                  {film.avec && (
                    <div>
                      <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Avec</p>
                      <p className="text-black font-display font-medium">{film.avec}</p>
                    </div>
                  )}

                  {film.production && (
                    <div>
                      <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Production</p>
                      <p className="text-black font-display font-medium">{film.production}</p>
                    </div>
                  )}

                  {(film.duree || film.annee) && (
                    <div className="pt-6 border-t border-black/10">
                      <div className="grid grid-cols-2 gap-4">
                        {film.duree && (
                          <div>
                            <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Durée</p>
                            <p className="text-black font-display font-medium">{film.duree}</p>
                          </div>
                        )}
                        {film.annee && (
                          <div>
                            <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-2 font-light">Année</p>
                            <p className="text-black font-display font-medium">{film.annee}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Diffusion/Sélection */}
              {(film.diffusion && film.diffusion.length > 0) || (film.selection && film.selection.length > 0) ? (
                <div className="border-t border-black/10 pt-8 mb-8">
                  <h3 className="heading-subtitle text-black mb-6">
                    Diffusion / Sélection
                  </h3>
                  
                  <div className="space-y-4">
                    {film.diffusion && film.diffusion.length > 0 && (
                      <div>
                        <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-3 font-light">Diffusion</p>
                        <ul className="space-y-2">
                          {film.diffusion.map((item, index) => (
                            <li key={index} className="text-black font-display font-medium text-sm">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {film.selection && film.selection.length > 0 && (
                      <div>
                        <p className="text-xs text-black/50 uppercase tracking-[0.2em] mb-3 font-light">Sélection</p>
                        <ul className="space-y-2">
                          {film.selection.map((item, index) => (
                            <li key={index} className="text-black font-display font-medium text-sm">
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
                <div className="border-t border-black/10 pt-8 mb-8">
                  <h3 className="heading-subtitle text-black mb-6">
                    Voir le film
                  </h3>
                  
                  <a 
                    href={film.lienFilm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-black/70 hover:text-black transition-colors font-display font-light text-sm uppercase tracking-[0.1em]"
                  >
                    Voir le film →
                  </a>
                </div>
              )}

              {/* Remerciements */}
              {film.remerciements && (
                <div className="border-t border-black/10 pt-8">
                  <h3 className="heading-subtitle text-black mb-6">
                    Remerciements
                  </h3>
                  
                  <p className="body-text-sm text-black font-display font-medium">
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