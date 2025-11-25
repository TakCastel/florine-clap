'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import { AnimationProvider } from '@/contexts/AnimationContext'
import PageTransition from '@/components/PageTransition'
import ScrollToTop from '@/components/ScrollToTop'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const isUploadVideoPage = pathname === '/admin/upload-video'
  
  if (isUploadVideoPage) {
    return <>{children}</>
  }
  
  return (
    <AnimationProvider>
      <ScrollToTop />
      <Header />
      <main className={isHomePage ? '' : 'pt-16 md:pt-0'}>
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
      <BackToTop />
    </AnimationProvider>
  )
}


