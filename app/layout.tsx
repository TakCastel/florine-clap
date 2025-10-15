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