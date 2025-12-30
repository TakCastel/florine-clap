import MdxRenderer from '@/components/MdxRenderer'
import Breadcrumb from '@/components/Breadcrumb'
import dynamicImport from 'next/dynamic'
import { bioPhoto } from '@/lib/images'

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
    <div className="min-h-screen bg-theme-white text-theme-dark">
      {/* Hero Section avec image de fond - même style que les pages films */}
      <section className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-top bg-no-repeat blur-[2px] filter-[sepia(20%)_saturate(150%)_hue-rotate(340deg)_brightness(0.9)]" 
          style={{ backgroundImage: `url(${bioPhoto})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-theme-white via-theme-white/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-theme-white/80 via-theme-white/40 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 z-30">
          <Breadcrumb 
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Bio' }
            ]}
            variant="default"
          />
        </div>
        
        <div className="relative z-10 h-full flex items-end pt-24 md:pt-28">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pb-16 w-full">
            <div className="text-center max-w-4xl mx-auto">
              <h1 
                className="heading-page text-theme-dark"
              >
                {page.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu MDX principal */}
      <section className="relative z-30 py-16 md:py-24 bg-theme-white -mt-10 md:-mt-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          <div className="prose prose-lg max-w-none text-theme-dark [&_p]:text-justify [&_li]:text-justify">
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