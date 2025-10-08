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
            { label: 'Actualités' }
          ]}
          variant="yellow"
        />
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-montserrat font-bold tracking-wide mb-6 text-theme-yellow">Actualités</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((it) => (
            <ProjectCard key={it._id} href={`/actus/${it.slug}`} title={it.title} subtitle={new Date(it.date).toLocaleDateString('fr-FR')} cover={it.cover} excerpt={it.excerpt} variant="actus" />
          ))}
        </div>
      </div>
    </div>
  )
}


