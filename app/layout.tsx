import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import { AnimationProvider } from '@/contexts/AnimationContext'
import LayoutWrapper from './LayoutWrapper'
import SmoothScroll from '@/components/SmoothScroll'
import { JetBrains_Mono } from 'next/font/google'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

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
        
        <link rel="icon" type="image/png" href="/images/florine-clap-favicon.png" />
        <link rel="apple-touch-icon" href="/images/florine-clap-favicon.png" />
      </head>
      <body className="bg-theme-white font-sans">
        <SmoothScroll>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </SmoothScroll>
      </body>
    </html>
  )
}
