import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { Oswald } from 'next/font/google'
import Layout from '@/components/Layout'

const oswald = Oswald({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-oswald',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Florine Clap',
    template: '%s | Florine Clap',
  },
  description: 'Site de Florine Clap – réalisatrice, films et ateliers vidéo.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`min-h-screen bg-neutral-50 text-neutral-800 antialiased ${oswald.variable}`}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  )
}


