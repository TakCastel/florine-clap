import { notFound } from 'next/navigation'
import { allFilms, allAteliers, allActus } from 'contentlayer/generated'
import Layout from '@/components/Layout'
import MdxRenderer from '@/components/MdxRenderer'

interface PreviewPageProps {
  params: {
    slug: string[]
  }
  searchParams: {
    collection?: string
    slug?: string
  }
}

export default function PreviewPage({ params, searchParams }: PreviewPageProps) {
  const { collection, slug } = searchParams
  
  if (!collection || !slug) {
    notFound()
  }

  let content = null
  let title = ''

  switch (collection) {
    case 'films':
      content = allFilms.find(film => film.slug === slug)
      title = content?.title || 'Film'
      break
    case 'ateliers':
      content = allAteliers.find(atelier => atelier.slug === slug)
      title = content?.title || 'Atelier'
      break
    case 'actus':
      content = allActus.find(actu => actu.slug === slug)
      title = content?.title || 'Actualité'
      break
    default:
      notFound()
  }

  if (!content) {
    notFound()
  }

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* En-tête de prévisualisation */}
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Mode prévisualisation</strong> - {collection === 'films' ? 'Film' : collection === 'ateliers' ? 'Médiation' : 'Actualité'} : {title}
                </p>
              </div>
            </div>
          </div>

          {/* Contenu stylé selon le type */}
          {collection === 'films' && (
            <article className="bg-orange-100 rounded-lg shadow-lg overflow-hidden">
              {/* En-tête du film */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8">
                <h1 className="text-4xl font-bold mb-2">{content.title}</h1>
                <div className="flex items-center space-x-4 text-lg">
                  <span>{content.annee}</span>
                  {content.duree && <span>•</span>}
                  {content.duree && <span>{content.duree}</span>}
                  {content.statut && <span>•</span>}
                  {content.statut && <span className="bg-orange-100 bg-opacity-20 px-3 py-1 rounded-full text-sm">{content.statut}</span>}
                </div>
              </div>

              {/* Synopsis */}
              {content.synopsis && (
                <div className="p-8 border-b">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">Synopsis</h2>
                  <p className="text-gray-600 leading-relaxed">{content.synopsis}</p>
                </div>
              )}

              {/* Contenu principal */}
              <div className="p-8">
                <MdxRenderer code={content.body.code} />
              </div>

              {/* Crédits */}
              {content.credits && (
                <div className="p-8 bg-gray-50 border-t">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">Crédits</h2>
                  <div className="prose prose-gray max-w-none">
                    <MdxRenderer code={content.credits} />
                  </div>
                </div>
              )}
            </article>
          )}

          {collection === 'ateliers' && (
            <article className="bg-orange-100 rounded-lg shadow-lg overflow-hidden">
              {/* En-tête de l'atelier */}
              <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-8">
                <h1 className="text-4xl font-bold mb-2">{content.title}</h1>
                <div className="flex items-center space-x-4 text-lg">
                  <span>{new Date(content.date).toLocaleDateString('fr-FR')}</span>
                  {content.lieu && <span>•</span>}
                  {content.lieu && <span>{content.lieu}</span>}
                  {content.duree && <span>•</span>}
                  {content.duree && <span>{content.duree}</span>}
                </div>
              </div>

              {/* Contenu principal */}
              <div className="p-8">
                <MdxRenderer code={content.body.code} />
              </div>

              {/* Modalités */}
              {content.modalites && (
                <div className="p-8 bg-gray-50 border-t">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">Modalités</h2>
                  <div className="prose prose-gray max-w-none">
                    <MdxRenderer code={content.modalites} />
                  </div>
                </div>
              )}
            </article>
          )}

          {collection === 'actus' && (
            <article className="bg-orange-100 rounded-lg shadow-lg overflow-hidden">
              {/* En-tête de l'actualité */}
              <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-8">
                <h1 className="text-4xl font-bold mb-2">{content.title}</h1>
                <div className="text-lg">
                  <span>{new Date(content.date).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Extrait */}
              {content.excerpt && (
                <div className="p-8 border-b">
                  <p className="text-xl text-gray-600 leading-relaxed italic">{content.excerpt}</p>
                </div>
              )}

              {/* Contenu principal */}
              <div className="p-8">
                <MdxRenderer code={content.body.code} />
              </div>
            </article>
          )}
        </div>
      </div>
    </Layout>
  )
}