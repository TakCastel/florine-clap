'use client'

import './globals.css'
import Header from '@/components/Header'
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  
  return (
    <html lang="fr" className={isHomePage ? 'overflow-hidden' : ''}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Mono&display=swap" rel="stylesheet" />
      </head>
      <body className={`bg-gray-100 font-pt-mono ${isHomePage ? 'scrollbar-hide' : ''}`}>
        <Header />
        <main className={isHomePage ? 'overflow-hidden max-h-screen pt-20' : 'pt-20'}>
          {children}
        </main>
      </body>
    </html>
  )
}