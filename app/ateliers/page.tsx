import ProjectCard from '@/components/ProjectCard'
import { allAteliers } from '.contentlayer/generated'

export const dynamic = 'error'

export default function AteliersPage() {
  const items = [...allAteliers].sort((a, b) => (a.date < b.date ? 1 : -1))
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Ateliers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map((it) => (
          <ProjectCard key={it._id} href={`/ateliers/${it.slug}`} title={it.title} subtitle={new Date(it.date).toLocaleDateString('fr-FR')} cover={it.gallery?.[0]} excerpt={it.excerpt} />
        ))}
      </div>
    </div>
  )
}


