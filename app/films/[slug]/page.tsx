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
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Films', href: '/films' },
          { label: film.title }
        ]}
        variant="default"
      />

      {/* Hero Section avec image de fond */}
      <section className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm filter-[sepia(20%)_saturate(150%)_hue-rotate(340deg)_brightness(0.9)]" 
          style={{ backgroundImage: `url(${film.image})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-theme-cream via-theme-cream/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-theme-cream/80 via-theme-cream/40 to-transparent"></div>
        
        <div className="relative z-10 h-full flex items-end">
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
                className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-theme-dark"
                style={{
                  fontFamily: 'var(--font-andalemo), sans-serif',
                  letterSpacing: '-0.03em',
                }}
              >
                {film.title}
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
            {film.vimeoId && (
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
            )}
            
            {/* Player vidéo directe (URL) */}
            {film.videoUrl && !film.vimeoId && (
              <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
                <video
                  src={film.videoUrl}
                  controls
                  className="w-full h-full object-contain"
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>
            )}
            
            {/* Contenu MDX */}
            <div className="prose prose-lg max-w-none text-theme-dark">
              <MdxRenderer code={film.body.code} />
            </div>
          </div>

          {/* Sidebar avec métadonnées organisées */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Fiche technique */}
              <div className="border-t border-theme-dark/10 pt-8 mb-8">
                <h3 className="text-xl font-display font-bold text-theme-dark mb-6" style={{
                  fontFamily: 'var(--font-andalemo), sans-serif',
                  letterSpacing: '-0.02em',
                }}>
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
                  <h3 className="text-xl font-display font-bold text-theme-dark mb-6" style={{
                    fontFamily: 'var(--font-andalemo), sans-serif',
                    letterSpacing: '-0.02em',
                  }}>
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
                  <h3 className="text-xl font-display font-bold text-theme-dark mb-6" style={{
                    fontFamily: 'var(--font-andalemo), sans-serif',
                    letterSpacing: '-0.02em',
                  }}>
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
                  <h3 className="text-xl font-display font-bold text-theme-dark mb-6" style={{
                    fontFamily: 'var(--font-andalemo), sans-serif',
                    letterSpacing: '-0.02em',
                  }}>
                    Remerciements
                  </h3>
                  
                  <p className="text-theme-dark font-display font-medium text-sm leading-relaxed">
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