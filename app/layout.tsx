'use client'

import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { usePathname } from 'next/navigation'
import { AnimationProvider } from '@/contexts/AnimationContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  
  return (
    <html lang="fr" className={isHomePage ? 'overflow-hidden' : ''}>
      <head>
        {/* Préchargement de la police Andale Mono pour de meilleures performances */}
        <link rel="preload" href="/andalemono.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        {/* Google Fonts - Source Sans Pro */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap" rel="stylesheet" />
      </head>
      <body className={`bg-gray-100 ${isHomePage ? 'scrollbar-hide' : ''}`}>
        <AnimationProvider>
          <Header />
          <main className={isHomePage ? 'overflow-hidden max-h-screen pt-20' : 'pt-20'}>
            {children}
          </main>
          {!isHomePage && <Footer />}
        </AnimationProvider>
      </body>
    </html>
  )
}