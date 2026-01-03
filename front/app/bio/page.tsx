import MarkdownRenderer from '@/components/MarkdownRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import ArticleHeroImage from '@/components/ArticleHeroImage'
import dynamicImport from 'next/dynamic'
import { getPageBySlug, getImageUrl, Page } from '@/lib/directus'
import { buildMetadata } from '@/components/Seo'
import { Metadata } from 'next'

const LogoMarquee = dynamicImport(() => import('@/components/LogoMarquee'), {
  ssr: false,
  loading: () => <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
})

export const dynamic = 'force-dynamic'
export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getPageBySlug('bio')
    
    if (!page) {
      return buildMetadata({
        title: 'Bio',
        description: 'Découvrez le parcours de Florine Clap, réalisatrice et formatrice en médiations vidéo'
      })
    }

    return buildMetadata({
      title: page.title,
      description: 'Découvrez le parcours de Florine Clap, réalisatrice et formatrice en médiations vidéo'
    })
  } catch (error) {
    return buildMetadata({
      title: 'Bio',
      description: 'Découvrez le parcours de Florine Clap, réalisatrice et formatrice en médiations vidéo'
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

  // Déterminer l'URL de l'image : portrait ou fallback vers FLORINE_DEF.avif
  const imageUrl = page.portrait ? getImageUrl(page.portrait) : '/images/FLORINE_DEF.avif'

  return (
    <div className="min-h-screen bg-theme-white text-theme-dark">
      {/* Image hero avec dégradés pour le header */}
      <ArticleHeroImage imageUrl={imageUrl} alt="Bio" />
      
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
      
      {/* Titre positionné sur l'image */}
      <div className="absolute bottom-16 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="heading-page text-theme-dark">
              {page.title === "A propos" ? "Bio" : page.title}
            </h1>
          </div>
        </div>
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          {/* Titre avec le même style que la page d'accueil */}
          <div className="text-center mb-16">
            <div className="text-theme-dark/40 text-sm uppercase tracking-[0.3em] mb-4 font-medium">
              Partenaires
            </div>
            
            {/* Ligne décorative */}
            <div className="h-[2px] bg-theme-dark/20 w-32 mx-auto mt-6">
              <div className="h-full bg-theme-dark"></div>
            </div>
          </div>
          
          <LogoMarquee pauseOnHover={false} />
        </div>
      </section>
    </div>
  )
}