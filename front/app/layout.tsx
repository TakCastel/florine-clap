import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import { AnimationProvider } from '@/contexts/AnimationContext'
import LayoutWrapper from './LayoutWrapper'
import SmoothScroll from '@/components/SmoothScroll'
import { JetBrains_Mono } from 'next/font/google'
import type { Metadata } from 'next'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const siteUrl = process.env.SITE_URL || 'https://florineclap.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Florine Clap - Réalisatrice et Artiste',
    template: '%s | Florine Clap'
  },
  description: 'Réalisatrice et artiste, je crée des films documentaires et des médiations artistiques qui explorent la relation entre l\'homme et son environnement.',
  keywords: ['Florine Clap', 'réalisatrice', 'documentaire', 'cinéma', 'art', 'médiation artistique', 'films', 'vidéos art'],
  authors: [{ name: 'Florine Clap' }],
  creator: 'Florine Clap',
  publisher: 'Florine Clap',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: 'Florine Clap',
    title: 'Florine Clap - Réalisatrice et Artiste',
    description: 'Réalisatrice et artiste, je crée des films documentaires et des médiations artistiques qui explorent la relation entre l\'homme et son environnement.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Florine Clap - Réalisatrice et Artiste',
    description: 'Réalisatrice et artiste, je crée des films documentaires et des médiations artistiques qui explorent la relation entre l\'homme et son environnement.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${jetbrainsMono.variable}`}>
      <head>
        {/* Andale Mono via police système ou locale injectée */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'Andale Mono';
              src: local('Andale Mono'), local('AndaleMono'), local('AndaleMono-Regular');
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
          `
        }} />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-theme-white font-sans">
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded focus:no-underline"
        >
          Aller au contenu principal
        </a>
        <SmoothScroll>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </SmoothScroll>
      </body>
    </html>
  )
}
