import ProjectCard from '@/components/ProjectCard'
import Pagination from '@/components/Pagination'
import Breadcrumb from '@/components/Breadcrumb'
import { allFilms } from '.contentlayer/generated'

export const dynamic = 'force-dynamic'

type FilmsPageProps = {
  searchParams: { page?: string }
}

export default function FilmsPage({ searchParams }: FilmsPageProps) {
  // Ordre personnalisé des films selon la liste fournie
  const customOrder = [
    "Père Chave, ma vie au Festival d'Avignon",
    "Quand je vous caresse", 
    "1,2,3 Soleil !",
    "PLAY",
    "Violoncelles, vibrez !",
    "Sous le pont d'Avignon",
    "Le Bus, le tram, la Baladine et moi",
    "De l'influence des éléments",
    "Et après ?",
    "La première",
    "I T"
  ]
  
  const items = [...allFilms].sort((a, b) => {
    const indexA = customOrder.indexOf(a.title)
    const indexB = customOrder.indexOf(b.title)
    return indexA - indexB
  })
  
  // Configuration de la pagination
  const itemsPerPage = 6
  const currentPage = parseInt(searchParams.page || '1')
  const totalPages = Math.ceil(items.length / itemsPerPage)
  
  // Calcul des items à afficher pour la page actuelle
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = items.slice(startIndex, endIndex)

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
          {currentItems.map((it, index) => (
            <ProjectCard 
              key={it._id} 
              href={`/films/${it.slug}`} 
              title={it.title} 
              subtitle={`${it.annee}`} 
              cover={it.cover} 
              excerpt={it.excerpt}
              duree={it.duree}
              statut={it.statut}
              synopsis={it.synopsis}
              category={it.category}
              role={it.role}
              placeholderImage={`https://picsum.photos/600/400?random=${startIndex + index + 1}`}
              variant="films" 
            />
          ))}
        </div>

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/films"
        />

        {/* Contenu SEO */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="prose prose-lg max-w-none text-theme-dark">
            <h2 className="text-2xl font-bold text-theme-dark mb-4">Lorem ipsum dolor sit amet</h2>
            <p className="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


