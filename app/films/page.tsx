import ProjectCard from '@/components/ProjectCard'
import Pagination from '@/components/Pagination'
import Breadcrumb from '@/components/Breadcrumb'
import { allFilms, allMediations, allActus, allPages } from '.contentlayer/generated'

export const dynamic = 'force-dynamic'

type FilmsPageProps = {
  searchParams: { page?: string }
}

export default function FilmsPage({ searchParams }: FilmsPageProps) {
  const currentPage = parseInt(searchParams.page || '1')
  const itemsPerPage = 6
  const totalItems = allFilms.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const filmsData = allFilms.slice(startIndex, endIndex)

  // Debug: log des données
  console.log('allFilms:', allFilms)
  console.log('filmsData:', filmsData)
  console.log('totalItems:', totalItems)
  console.log('allFilms type:', typeof allFilms)
  console.log('allFilms is array:', Array.isArray(allFilms))
  
  // Debug: vérifier les autres collections
  console.log('allMediations length:', allMediations.length)
  console.log('allActus length:', allActus.length)
  console.log('allPages length:', allPages.length)

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Breadcrumb 
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Films' }
          ]}
          variant="blue"
        />
        
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-montserrat font-bold tracking-wide mb-12 text-theme-blue">Films</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filmsData.length > 0 ? (
            filmsData.map((film, index) => (
              <ProjectCard 
                key={film._id} 
                href={`/films/${film.slug}`} 
                title={film.title} 
                subtitle={`${film.annee}`} 
                cover={film.cover} 
                excerpt={film.excerpt}
                duree={film.duree}
                statut={film.statut}
                synopsis={film.synopsis}
                category={film.category}
                role={film.role}
                placeholderImage={`https://picsum.photos/600/400?random=${startIndex + index + 1}`}
                variant="films" 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">Aucun film trouvé.</p>
              <p className="text-gray-400 text-sm mt-2">Debug: allFilms.length = {allFilms.length}</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/films"
          />
        )}

        {/* Contenu SEO */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="prose prose-lg max-w-none text-theme-dark">
            <h2 className="text-2xl font-bold text-theme-dark mb-4">Mes créations cinématographiques</h2>
            <p className="text-gray-600 leading-relaxed">
              Découvrez mes courts métrages documentaires qui explorent la relation entre l'homme et son environnement. 
              Chaque film est une invitation à regarder le monde différemment, à travers un prisme poétique et humaniste.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}