import MarkdownRenderer from '@/components/MarkdownRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import ArticleHeroImage from '@/components/ArticleHeroImage'
import { getActuBySlug, getImageUrl, Actu } from '@/lib/directus'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 60

type ActuPageProps = {
  params: Promise<{ slug: string }> | { slug: string }
}

export default async function ActuPage({ params }: ActuPageProps) {
  // Gérer les params synchrones et asynchrones (Next.js 14+)
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams.slug
  
  if (!slug) {
    notFound()
  }
  
  const actu = await getActuBySlug(slug)
  
  if (!actu) {
    console.error(`Actu not found for slug: ${slug}`)
    notFound()
  }
  
  const coverUrl = getImageUrl(actu.cover)

  return (
    <div className="min-h-screen bg-theme-white text-black">
      {/* Image hero avec dégradés pour le header */}
      <ArticleHeroImage imageUrl={coverUrl} alt={actu.title} />
      
      {/* Breadcrumb positionné sur l'image */}
      <div className="absolute top-20 left-0 right-0 z-50">
        <Breadcrumb 
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Actualités', href: '/actus' },
            { label: actu.title }
          ]}
          variant="default"
        />
      </div>

      {/* Contenu principal */}
      <div className="relative z-30 max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 -mt-10 md:-mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {/* Contenu Markdown - on ignore le premier h1 pour éviter le doublon avec le titre du hero */}
            {actu.body && (
              <div className="prose prose-lg max-w-none text-black mb-12 [&_p]:text-justify [&_li]:text-justify">
                <MarkdownRenderer content={actu.body} skipFirstHeading={true} />
              </div>
            )}
          </div>

          {/* Sidebar avec informations */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="border-t border-black/10 pt-8">
                <h3 className="heading-subtitle text-black mb-6">
                  Informations
                </h3>
                
                <div className="space-y-6">
                  {/* Tags */}
                  {actu.tags && actu.tags.length > 0 && (
                    <div>
                      <p className="text-sm text-black font-display font-medium uppercase tracking-[0.05em] mb-3">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {actu.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-4 py-2 bg-black text-white text-sm font-display font-medium uppercase tracking-[0.05em]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Retour aux actualités */}
                  <div className="pt-6 border-t border-black/10">
                    <a 
                      href="/actus"
                      className="inline-flex items-center gap-2 text-black/70 hover:text-black transition-colors font-display font-light text-sm uppercase tracking-[0.1em]"
                    >
                      ← Retour aux actualités
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
