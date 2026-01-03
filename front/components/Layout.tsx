'use client'

import Header from './Header'
import Footer from './Footer'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header fixe */}
      <Header />
      
      {/* Main content avec espacement pour le header */}
      <main className="flex-1 pt-20">
        {children}
      </main>
      
      {/* Footer */}
      <div className="relative z-30">
        <Footer />
      </div>
    </div>
  )
}
