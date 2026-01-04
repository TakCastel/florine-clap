import MarkdownRenderer from '@/components/MarkdownRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import ArticleHeroImage from '@/components/ArticleHeroImage'
import PartnersSection from '@/components/home/PartnersSection'
import { getPageBySlug, Page } from '@/lib/directus'
import { buildMetadata, generateJsonLd } from '@/components/Seo'
import { canonical } from '@/lib/seo'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const canonicalUrl = canonical('/bio')
  try {
    const page = await getPageBySlug('bio')
    
    if (!page) {
      return buildMetadata({
        title: 'Bio',
        description: 'Découvrez le parcours de Florine Clap, réalisatrice et formatrice en médiations vidéo',
        canonical: canonicalUrl,
      })
    }

    return buildMetadata({
      title: page.title === "A propos" ? "Bio" : page.title,
      description: 'Découvrez le parcours de Florine Clap, réalisatrice et formatrice en médiations vidéo',
      image: '/images/FLORINE_DEF.avif',
      canonical: canonicalUrl,
    })
  } catch (error) {
    return buildMetadata({
      title: 'Bio',
      description: 'Découvrez le parcours de Florine Clap, réalisatrice et formatrice en médiations vidéo',
      canonical: canonicalUrl,
    })
  }
}

export default async function BioPage() {
  let page: Page | null = null
  try {
    page = await getPageBySlug('bio')
  } catch (error) {
    console.error('Erreur lors de la récupération de la page bio:', error)
  }
  
  if (!page) {
    return (
      <div className="min-h-screen bg-theme-white text-theme-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page non trouvée</h1>
          <p className="text-gray-600">La page bio n&apos;a pas pu être chargée depuis Directus.</p>
        </div>
      </div>
    )
  }

  // Utiliser toujours l'image FLORINE_DEF.avif depuis public
  const imageUrl = '/images/FLORINE_DEF.avif'
  const canonicalUrl = canonical('/bio')

  const jsonLd = generateJsonLd({
    type: 'Person',
    title: page.title === "A propos" ? "Bio" : page.title,
    description: 'Découvrez le parcours de Florine Clap, réalisatrice et formatrice en médiations vidéo',
    image: imageUrl || undefined,
    url: canonicalUrl,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main-content" className="min-h-screen bg-theme-white text-theme-dark">
        {/* H1 caché pour le SEO */}
        <h1 className="sr-only">
          {page.title === "A propos" ? "Bio" : page.title}
        </h1>
        
        {/* Image hero avec dégradés pour le header */}
        <ArticleHeroImage imageUrl={imageUrl} alt="Portrait de Florine Clap" />
      
      {/* Breadcrumb positionné sur l'image */}
      <div className="absolute top-20 left-0 right-0 z-50">
        <Breadcrumb 
          items={[
            { label: 'Accueil', href: '/' },
            { label: 'Bio' }
          ]}
          variant="default"
        />
      </div>

      {/* Contenu Markdown principal */}
      <section className="relative z-30 py-16 md:py-24 bg-theme-white -mt-10 md:-mt-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          {page.body && (
            <div className="prose prose-lg max-w-none text-theme-dark [&_p]:text-justify [&_li]:text-justify">
              <MarkdownRenderer content={page.body} />
            </div>
          )}
        </div>
      </section>

        {/* Section Partenaires */}
        <PartnersSection />
      </main>
    </>
  )
}