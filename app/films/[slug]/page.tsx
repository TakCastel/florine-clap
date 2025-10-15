'use client'

import MdxRenderer from '@/components/MdxRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import VimeoPlayer from '@/components/VimeoPlayer'
import { allFilms } from '.contentlayer/generated'
import { notFound } from 'next/navigation'
import { Clock, Calendar, User, Mic, FileText, Building } from 'lucide-react'

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
    <div className="min-h-screen bg-white text-theme-dark">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Films', href: '/films' },
          { label: film.title }
        ]}
        variant="default"
      />

      {/* Hero Section avec image de fond */}
      <section className="relative h-[60vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-md scale-110" 
          style={{ backgroundImage: `url(${film.image})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent"></div>
        
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-6xl mx-auto px-4 pb-16 w-full">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
                {film.title}
              </h1>
              <div className="flex items-center gap-6 text-lg mb-4">
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {film.duree}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {film.annee}
                </span>
              </div>
              {film.shortSynopsis && (
                <p className="text-theme-dark/90 text-lg leading-relaxed max-w-2xl">
                  {film.shortSynopsis}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section vidéo Vimeo - Mise en valeur */}
      {film.vimeoId && (
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-theme-dark mb-4">Vidéo</h2>
              <p className="text-theme-dark/70">Découvrez {film.title}</p>
            </div>
            
            <div className="relative bg-gray-100 rounded-lg overflow-hidden shadow-2xl">
              <div className="aspect-video">
                <VimeoPlayer
                  videoId={film.vimeoId}
                  className="w-full h-full"
                  autoplay={false}
                  muted={false}
                  loop={false}
                  controls={true}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Informations principales */}
          <div className="lg:col-span-2">
            {/* Synopsis */}
            {film.shortSynopsis && (
              <div className="mb-12">
                <h2 className="text-2xl font-display font-bold text-theme-dark mb-4">Synopsis</h2>
                <p className="text-theme-dark leading-relaxed text-lg">{film.shortSynopsis}</p>
              </div>
            )}

            {/* Contenu MDX */}
            <div className="prose prose-lg max-w-none text-theme-dark">
              <MdxRenderer code={film.body.code} />
            </div>
          </div>

          {/* Sidebar avec informations techniques */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-2xl font-display font-bold text-theme-dark mb-6">Fiche technique</h3>
              
              <div className="space-y-6">
                {/* Réalisation */}
                {film.realisation && (
                  <div>
                    <p className="text-sm text-white font-medium mb-1">Réalisation</p>
                    <p className="text-white font-semibold">{film.realisation}</p>
                  </div>
                )}

                {/* Mixage */}
                {film.mixage && (
                  <div>
                    <p className="text-sm text-white font-medium mb-1">Mixage</p>
                    <p className="text-white font-semibold">{film.mixage}</p>
                  </div>
                )}

                {/* Texte */}
                {film.texte && (
                  <div>
                    <p className="text-sm text-white font-medium mb-1">Texte</p>
                    <p className="text-white font-semibold">{film.texte}</p>
                  </div>
                )}

                {/* Production */}
                {film.production && (
                  <div>
                    <p className="text-sm text-white font-medium mb-1">Production</p>
                    <p className="text-white font-semibold">{film.production}</p>
                  </div>
                )}

                {/* Durée et année */}
                <div className="pt-4 border-t border-white/30">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-white font-medium mb-1">Durée</p>
                      <p className="text-white font-semibold">{film.duree}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium mb-1">Année</p>
                      <p className="text-white font-semibold">{film.annee}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}