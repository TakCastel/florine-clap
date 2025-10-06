import './globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { Oswald, Gabarito, Poiret_One, Montserrat_Alternates } from 'next/font/google'
import Layout from '@/components/Layout'

const oswald = Oswald({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-oswald',
  weight: ['300', '400', '500', '600', '700'],
})

const gabarito = Gabarito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-gabarito',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const poiretOne = Poiret_One({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poiret',
  weight: ['400'],
})

const montserratAlternates = Montserrat_Alternates({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat-alternates',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
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
      <body className={`min-h-screen bg-orange-100 text-neutral-800 antialiased ${oswald.variable} ${gabarito.variable} ${poiretOne.variable} ${montserratAlternates.variable}`}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  )
}


