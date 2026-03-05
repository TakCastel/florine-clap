'use client'

import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { AnimationProvider } from '@/contexts/AnimationContext'
import ScrollToTop from '@/components/ScrollToTop'

// Chargement différé : le bouton "retour en haut" n'est pas critique au premier rendu (améliore LCP / TBT)
const BackToTop = dynamic(() => import('@/components/BackToTop'), { ssr: false })

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const isBioPage = pathname === '/bio'
  // Détecter les pages articles (avec slug)
  const isArticlePage = /^\/(films|mediations|videos-art|actus)\/[^/]+$/.test(pathname)
  // Détecter les pages de liste
  const isListPage = ['/films', '/mediations', '/videos-art', '/actus'].includes(pathname)
  
  return (
    <AnimationProvider>
      <ScrollToTop />
      <Header />
      <main className={isHomePage || isArticlePage || isListPage || isBioPage ? '' : 'pt-16 md:pt-0'} style={{ position: 'relative' }}>
        {children}
      </main>
      <Footer />
      <BackToTop />
    </AnimationProvider>
  )
}


