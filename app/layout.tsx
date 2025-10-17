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
    <html lang="fr">
      <head>
        {/* Préchargement de la police Solway pour de meilleures performances */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Google Fonts - JetBrains Mono et Solway */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&family=Solway:wght@300;400;500;700;800&display=swap" rel="stylesheet" />
        
        {/* Favicons - adaptés selon le thème système */}
        <link rel="icon" type="image/png" href="/images/logos/logo-white.png" media="(prefers-color-scheme: dark)" />
        <link rel="icon" type="image/png" href="/images/logos/logo-black.png" media="(prefers-color-scheme: light)" />
        <link rel="icon" type="image/png" href="/images/logos/logo-black.png" />
        <link rel="apple-touch-icon" href="/images/logos/logo-white.png" />
      </head>
      <body className="bg-gray-100">
        <AnimationProvider>
          <Header />
          <main className={isHomePage ? '' : 'pt-20'}>
            {children}
          </main>
          <Footer />
        </AnimationProvider>
      </body>
    </html>
  )
}