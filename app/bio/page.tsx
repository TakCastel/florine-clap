import MdxRenderer from '@/components/MdxRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import dynamicImport from 'next/dynamic'

const LogoMarquee = dynamicImport(() => import('@/components/LogoMarquee'), {
  ssr: false,
  loading: () => <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
})
import { allPages } from '.contentlayer/generated'
import { buildMetadata } from '@/components/Seo'
import { Metadata } from 'next'
import { canonical } from '@/lib/seo'

export const dynamic = 'error'

export async function generateMetadata(): Promise<Metadata> {
  const page = allPages.find(p => p.slug === 'bio')
  
  if (!page) {
    return {}
  }

  return buildMetadata({
    title: page.title,
    description: 'Découvrez le parcours de Florine Clap, réalisatrice et formatrice en médiations vidéo'
  })
}

export default function BioPage() {
  const page = allPages.find(p => p.slug === 'bio')
  
  if (!page) {
    return <div>Page non trouvee</div>
  }

  return (
    <div className="min-h-screen bg-theme-cream text-theme-dark">
      <Breadcrumb 
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'A propos' }
        ]}
        variant="default"
      />

      {/* Hero Section avec image de fond - même style que les pages films */}
      <section className="relative h-[45vh] min-h-[300px] overflow-hidden">
        {page.portrait ? (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm" 
              style={{ backgroundImage: `url(${page.portrait})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-theme-cream via-theme-cream/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-theme-cream/80 via-theme-cream/40 to-transparent"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-theme-cream"></div>
        )}
        
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pb-16 w-full">
            <div className="text-center max-w-4xl mx-auto">
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-theme-dark"
                style={{
                  fontFamily: 'var(--font-andalemo), sans-serif',
                  letterSpacing: '-0.03em',
                }}
              >
                {page.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu MDX principal */}
      <section className="py-16 md:py-24 bg-theme-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          <div className="prose prose-lg max-w-none text-theme-dark">
            <MdxRenderer code={page.body.code} />
          </div>
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
            <h2 
              className="text-theme-dark font-bold text-4xl md:text-5xl lg:text-6xl leading-none tracking-tight"
              style={{
                fontFamily: 'var(--font-andalemo), sans-serif',
                letterSpacing: '-0.03em',
              }}
            >
              Ils me font confiance
            </h2>
            
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