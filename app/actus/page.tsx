import ProjectCard from '@/components/ProjectCard'
import { allActus } from '.contentlayer/generated'

export const dynamic = 'error'

export default function ActusPage() {
  const items = [...allActus].sort((a, b) => (a.date < b.date ? 1 : -1))
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Actualités</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map((it) => (
          <ProjectCard key={it._id} href={`/actus/${it.slug}`} title={it.title} subtitle={new Date(it.date).toLocaleDateString('fr-FR')} cover={it.cover} excerpt={it.excerpt} />
        ))}
      </div>
    </div>
  )
}


