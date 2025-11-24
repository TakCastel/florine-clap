import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import { AnimationProvider } from '@/contexts/AnimationContext'
import LayoutWrapper from './LayoutWrapper'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* Préchargement de la police Andale Mono pour de meilleures performances */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Google Fonts - JetBrains Mono et Andale Mono */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
        {/* Andale Mono via police système */}
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
        
        {/* Favicon Florine Clap */}
        <link rel="icon" type="image/png" href="/images/florine-clap-favicon.png" />
        <link rel="apple-touch-icon" href="/images/florine-clap-favicon.png" />
      </head>
      <body className="bg-gray-100">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}