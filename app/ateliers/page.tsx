import ProjectCard from '@/components/ProjectCard'
import { allAteliers } from '.contentlayer/generated'

export const dynamic = 'error'

export default function AteliersPage() {
  const items = [...allAteliers].sort((a, b) => (a.date < b.date ? 1 : -1))
  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-montserrat font-bold tracking-wide mb-6 text-white">Médiations</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((it) => (
            <ProjectCard key={it._id} href={`/ateliers/${it.slug}`} title={it.title} subtitle={new Date(it.date).toLocaleDateString('fr-FR')} cover={it.gallery?.[0]} excerpt={it.excerpt} variant="ateliers" />
          ))}
        </div>
      </div>
    </div>
  )
}


