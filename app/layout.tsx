'use client'

import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  
  return (
    <html lang="fr" className={isHomePage ? 'overflow-hidden' : ''}>
      <head>
        {/* Préchargement de la police Andale Mono pour de meilleures performances */}
        <link rel="preload" href="/andalemono.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body className={`bg-gray-100 ${isHomePage ? 'scrollbar-hide' : ''}`}>
        <Header />
        <main className={isHomePage ? 'overflow-hidden max-h-screen pt-20' : 'pt-20'}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}