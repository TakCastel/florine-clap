import ProjectCard from '@/components/ProjectCard'
import Breadcrumb from '@/components/Breadcrumb'
import { allActus } from '.contentlayer/generated'

export const dynamic = 'error'

export default function ActusPage() {
  const items = [...allActus].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Breadcrumb 
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Actualites' }
          ]}
          variant="default"
        />
        
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-andale-mono font-bold tracking-wide mb-12 text-theme-orange">Actualites</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {items.map((actu, index) => (
            <ProjectCard 
              key={actu._id} 
              href={`/actus/${actu.slug}`} 
              title={actu.title} 
              subtitle={new Date(actu.date).toLocaleDateString('fr-FR')} 
              cover={undefined} 
              excerpt={actu.excerpt}
              placeholderImage={`https://picsum.photos/600/400?random=${index + 1}`}
              variant="actus" 
            />
          ))}
        </div>

        {/* Contenu SEO */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="prose prose-lg max-w-none text-theme-dark">
            <h2 className="text-2xl font-bold text-theme-dark mb-4">Mes dernieres actualites</h2>
            <p className="text-gray-600 leading-relaxed">
              Suivez mes dernieres actualites, selections en festival, nouvelles creations et projets en cours. 
              Restez informe de mon actualite cinematographique et de mes prochains mediations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}