import MarkdownRenderer from '@/components/MarkdownRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import PartnersSection from '@/components/home/PartnersSection'
import ArticleHeroImage from '@/components/ArticleHeroImage'
import { getPageBySlug, Page, getImageUrl, getHomeSettings } from '@/lib/directus'
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

  // Récupérer l'image hero depuis homeSettings pour l'effet flou en fond
  const homeSettings = await getHomeSettings()
  const heroImageUrl = homeSettings?.bio_image || null
  
  // Récupérer l'image principale de la page bio (à afficher en haut)
  const mainImageUrl = page.hero_image ? getImageUrl(page.hero_image) : null
  
  // Récupérer les URLs des autres images depuis Directus
  const bottomImageUrl = page.bottom_image ? getImageUrl(page.bottom_image) : null
  const canonicalUrl = canonical('/bio')

  // Convertir l'image hero en URL si c'est un objet Directus
  const heroImageUrlString = heroImageUrl 
    ? (typeof heroImageUrl === 'string' 
      ? heroImageUrl 
      : getImageUrl(heroImageUrl))
    : null

  const jsonLd = generateJsonLd({
    type: 'Person',
    title: page.title === "A propos" ? "Bio" : page.title,
    description: 'Découvrez le parcours de Florine Clap, réalisatrice et formatrice en médiations vidéo',
    image: heroImageUrlString || '/images/FLORINE_DEF.avif' || undefined,
    url: canonicalUrl,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main-content" className="min-h-screen bg-theme-white text-theme-dark relative">
        {/* H1 caché pour le SEO */}
        <h1 className="sr-only">
          {page.title === "A propos" ? "Bio" : page.title}
        </h1>
        
        <div className="relative">
          {/* Image hero avec effet flou en fond */}
          {heroImageUrlString && (
            <ArticleHeroImage 
              imageUrl={heroImageUrlString} 
              alt={page.title === "A propos" ? "Bio" : page.title}
            />
          )}
          
          {/* Breadcrumb positionné au-dessus de l'image hero */}
          <div className="relative z-10">
            <div className="max-w-container-small mx-auto px-4 md:px-6 lg:px-10 xl:px-16 pt-20 md:pt-28">
              <Breadcrumb 
                items={[
                  { label: 'Accueil', href: '/' },
                  { label: 'Bio' }
                ]}
                variant="default"
              />
            </div>
          </div>
        </div>

        {/* Conteneur unifié pour image principale, contenu et autres éléments */}
        <div className={`max-w-container-small mx-auto px-4 md:px-6 lg:px-10 xl:px-16 ${heroImageUrlString ? 'relative z-10' : ''}`} style={heroImageUrlString ? { marginTop: '-66vh' } : {}}>
          {/* Image principale de la page bio - en haut avec image floue en fond */}
          {mainImageUrl && (
            <div className={`${heroImageUrlString ? 'pt-6' : 'pt-12 md:pt-20'} pb-8 md:pb-12`}>
              <div className="relative w-full">
                {/* Image principale */}
                <div className="relative w-full" style={{ zIndex: 1 }}>
                  {/* Image floue en arrière-plan - exactement derrière l'image principale */}
                  {heroImageUrlString && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={heroImageUrlString}
                        alt=""
                        className="w-full h-full object-cover"
                        style={{ 
                          objectPosition: 'center 30%',
                          filter: 'blur(15px) brightness(1.15) grayscale(0.3)',
                          transform: 'scale(1.1)',
                        }}
                      />
                      {/* Overlay blanc pour la lisibilité */}
                      <div 
                        className="absolute inset-0 pointer-events-none" 
                        style={{
                          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.8) 100%)'
                        }}
                      />
                      <div 
                        className="absolute inset-0 pointer-events-none" 
                        style={{
                          background: 'rgba(255, 255, 255, 0.28)'
                        }}
                      />
                    </div>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mainImageUrl}
                    alt={page.title === "A propos" ? "Bio" : page.title}
                    className="w-full h-auto object-cover relative"
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contenu Markdown principal - après l'image */}
          <section className={`${!mainImageUrl && heroImageUrlString ? 'pt-6' : ''} ${!mainImageUrl && !heroImageUrlString ? 'pt-12 md:pt-20' : ''} py-16 md:py-24`}>
            {page.body && (
              <div className="prose max-w-none text-base text-theme-dark [&_p]:text-justify [&_li]:text-justify">
                <MarkdownRenderer content={page.body} />
              </div>
            )}
          </section>

          {/* Bottom Image - juste après le contenu (dans le container) */}
          {page.bottom_image && (() => {
            const bottomImageUrl = getImageUrl(page.bottom_image)
            if (!bottomImageUrl) {
              console.log('⚠️ bottom_image URL est null pour la page bio:', page.bottom_image)
              return null
            }
            return (
              <div className="mt-16 md:mt-24">
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
        </div>

        {/* Section Partenaires */}
        <PartnersSection />
      </main>
    </>
  )
}