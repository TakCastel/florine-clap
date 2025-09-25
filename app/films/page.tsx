import ProjectCard from '@/components/ProjectCard'
import { allFilms } from '.contentlayer/generated'

export const dynamic = 'error'

export default function FilmsPage() {
  const items = [...allFilms].sort((a, b) => (a.annee < b.annee ? 1 : -1))
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-semibold mb-6">Films</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items.map((it) => (
          <ProjectCard key={it._id} href={`/films/${it.slug}`} title={it.title} subtitle={`${it.annee}`} cover={it.cover} excerpt={it.excerpt} />
        ))}
      </div>
    </div>
  )
}


