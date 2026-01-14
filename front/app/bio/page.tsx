import MarkdownRenderer from '@/components/MarkdownRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import PartnersSection from '@/components/home/PartnersSection'
import { getPageBySlug, Page, getImageUrl } from '@/lib/directus'
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
          <h1 className="text-xl font-bold mb-4">Page non trouvée</h1>
          <p className="text-gray-600">La page bio n&apos;a pas pu être chargée depuis Directus.</p>
        </div>
      </div>
    )
  }

  // Récupérer les URLs des images depuis Directus (même logique pour les deux)
  const heroImageUrl = page.hero_image ? getImageUrl(page.hero_image) : null
  const bottomImageUrl = page.bottom_image ? getImageUrl(page.bottom_image) : null
  const canonicalUrl = canonical('/bio')

  const jsonLd = generateJsonLd({
    type: 'Person',
    title: page.title === "A propos" ? "Bio" : page.title,
    description: 'Découvrez le parcours de Florine Clap, réalisatrice et formatrice en médiations vidéo',
    image: heroImageUrl || '/images/FLORINE_DEF.avif' || undefined,
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
        
        {/* Breadcrumb - juste après le header */}
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-4">
          <Breadcrumb 
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Bio' }
            ]}
            variant="default"
          />
        </div>

        {/* Hero Image - dans le container */}
        {heroImageUrl && (
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
            <div className="w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImageUrl}
                alt={page.title === "A propos" ? "Bio" : page.title}
                className="w-full h-auto object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
        )}

        {/* Contenu Markdown principal - après l'image */}
        <section className="py-16 md:py-24 bg-theme-white">
          <div className="max-w-4xl mx-auto px-6 md:px-10 lg:px-16">
            {page.body && (
              <div className="prose max-w-none text-base text-theme-dark [&_p]:text-justify [&_li]:text-justify">
                <MarkdownRenderer content={page.body} />
              </div>
            )}
          </div>
        </section>

        {/* Bottom Image - juste après le contenu (dans le container) */}
        {page.bottom_image && (() => {
          const bottomImageUrl = getImageUrl(page.bottom_image)
          if (!bottomImageUrl) {
            console.log('⚠️ bottom_image URL est null pour la page bio:', page.bottom_image)
            return null
          }
          return (
            <div className="max-w-4xl mx-auto px-6 md:px-10 lg:px-16 mt-16 md:mt-24">
              <div className="w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bottomImageUrl}
                  alt={page.title === "A propos" ? "Bio" : page.title}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          )
        })()}

        {/* Section Partenaires */}
        <PartnersSection />
      </main>
    </>
  )
}