import MdxRenderer from '@/components/MdxRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import { allFilms } from '.contentlayer/generated'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { canonical } from '@/lib/seo'
import { buildMetadata } from '@/components/Seo'

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
    title: film.seo_title || film.title,
    description: film.seo_description || film.excerpt || film.synopsis,
    image: film.seo_image || film.cover,
    url: canonical(`/films/${film.slug}`),
    noindex: film.noindex
  })
}

export default function FilmPage({ params }: FilmPageProps) {
  const film = allFilms.find(f => f.slug === params.slug)
  
  if (!film) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Films', href: '/films' },
            { label: film.title }
          ]}
          variant="blue"
        />
        
        <article className="bg-orange-100 rounded-lg shadow-lg overflow-hidden">
          {/* En-tête du film */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8">
            <h1 className="text-4xl font-bold mb-2">{film.title}</h1>
            <div className="flex items-center space-x-4 text-lg">
              <span>{film.annee}</span>
              {film.duree && <span>•</span>}
              {film.duree && <span>{film.duree}</span>}
              {film.statut && <span>•</span>}
              {film.statut && <span className="bg-orange-100 bg-opacity-20 px-3 py-1 rounded-full text-sm">{film.statut}</span>}
            </div>
          </div>

          {/* Synopsis */}
          {film.synopsis && (
            <div className="p-8 border-b">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Synopsis</h2>
              <p className="text-gray-600 leading-relaxed">{film.synopsis}</p>
            </div>
          )}

          {/* Contenu principal */}
          <div className="p-8">
            <MdxRenderer code={film.body.code} />
          </div>

          {/* Crédits */}
          {film.credits && (
            <div className="p-8 bg-gray-50 border-t">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Crédits</h2>
              <div className="prose prose-gray max-w-none">
                <div dangerouslySetInnerHTML={{ __html: film.credits.replace(/\n/g, '<br>') }} />
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}