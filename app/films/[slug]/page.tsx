import MdxRenderer from '@/components/MdxRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import VimeoPlayer from '@/components/VimeoPlayer'
import { allFilms } from '.contentlayer/generated'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { canonical } from '@/lib/seo'
import { buildMetadata } from '@/components/Seo'
import { Clock, Calendar, User, Mic, FileText, Building } from 'lucide-react'

export const dynamic = 'error'

type FilmPageProps = {
  params: { slug: string }
}

export async function generateMetadata({ params }: FilmPageProps): Promise<Metadata> {
  const film = allFilms.find(f => f.slug === params.slug)
  
  if (!film) {
    return {}
  }

  return buildMetadata({
    title: film.title,
    description: film.shortSynopsis || 'Découvrez ce film de Florine Clap'
  })
}

export default function FilmPage({ params }: FilmPageProps) {
  const film = allFilms.find(f => f.slug === params.slug)
  
  if (!film) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Films', href: '/films' },
          { label: film.title }
        ]}
        variant="white"
      />

      {/* Section vidéo Vimeo */}
      {film.vimeoId && (
        <section className="relative w-full h-[70vh] bg-theme-dark">
          <VimeoPlayer
            videoId={film.vimeoId}
            className="w-full h-full"
            autoplay={true}
            muted={true}
            loop={false}
            controls={true}
          />
        </section>
      )}

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Informations principales */}
          <div className="lg:col-span-2">
            <div className="bg-white">
              {/* En-tête du film */}
              <div className="bg-theme-blue text-white p-8">
                <h1 className="text-4xl font-bold mb-4">{film.title}</h1>
                <div className="flex items-center space-x-6 text-lg">
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {film.duree}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {film.annee}
                  </span>
                </div>
              </div>

              {/* Synopsis */}
              {film.shortSynopsis && (
                <div className="p-8 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-theme-blue mb-4">Synopsis</h2>
                  <p className="text-gray-700 leading-relaxed">{film.shortSynopsis}</p>
                </div>
              )}

              {/* Contenu MDX */}
              <div className="p-8">
                <MdxRenderer code={film.body.code} />
              </div>
            </div>
          </div>

          {/* Sidebar avec informations techniques */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 sticky top-8">
              <h3 className="text-2xl font-bold text-theme-blue mb-6">Fiche technique</h3>
              
              <div className="space-y-6">
                {/* Réalisation */}
                {film.realisation && (
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Réalisation</p>
                    <p className="text-theme-blue font-semibold">{film.realisation}</p>
                  </div>
                )}

                {/* Mixage */}
                {film.mixage && (
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Mixage</p>
                    <p className="text-theme-blue font-semibold">{film.mixage}</p>
                  </div>
                )}

                {/* Texte */}
                {film.texte && (
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Texte</p>
                    <p className="text-theme-blue font-semibold">{film.texte}</p>
                  </div>
                )}

                {/* Production */}
                {film.production && (
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Production</p>
                    <p className="text-theme-blue font-semibold">{film.production}</p>
                  </div>
                )}

                {/* Durée et année */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Durée</p>
                      <p className="text-theme-blue font-semibold">{film.duree}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Année</p>
                      <p className="text-theme-blue font-semibold">{film.annee}</p>
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