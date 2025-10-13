import ProjectCard from '@/components/ProjectCard'
import Breadcrumb from '@/components/Breadcrumb'
import { allMediations } from '.contentlayer/generated'

export const dynamic = 'error'

export default function MediationsPage() {
  const items = [...allMediations].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Breadcrumb 
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Médiations' }
          ]}
          variant="default"
        />
        
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-andale-mono font-bold tracking-wide mb-12 text-theme-green">Médiations</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {items.map((mediation, index) => (
            <ProjectCard 
              key={mediation._id} 
              href={`/mediations/${mediation.slug}`} 
              title={mediation.title} 
              subtitle={new Date(mediation.date).toLocaleDateString('fr-FR')} 
              excerpt={mediation.excerpt}
              placeholderImage={`https://picsum.photos/600/400?random=${index + 1}`}
              variant="mediations" 
            />
          ))}
        </div>

        {/* Contenu SEO */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="prose prose-lg max-w-none text-theme-dark">
            <h2 className="text-2xl font-bold text-theme-dark mb-4">Formation et médiation</h2>
            <p className="text-gray-600 leading-relaxed">
              Découvrez mes médiations de formation et de médiation autour du cinéma documentaire. 
              Des sessions adaptées à tous les niveaux pour apprendre les techniques de réalisation et développer votre regard critique.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}