import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette "blue + yellow" - Such a Nice Person
        'theme-light': '#D9D5CC',        // Gris chaud de la palette
        'theme-beige': '#D9D5CC',        // Gris chaud de la palette
        'theme-orange': '#E8B95C',       // Jaune moutarde de la palette
        'theme-navy': '#000000',         // Noir
        'theme-dark': '#000000',         // Noir
        // Couleurs principales de la palette
        'theme-blue': '#000000',         // Noir
        'theme-film': '#9B1A33',         // Rouge pourpre cerise sombre pour les films
        'theme-mediation': '#000000',     // Noir
        'theme-grey': '#D9D5CC',         // Gris chaud de la palette
        'theme-yellow': '#B8860B',       // Jaune moutarde sombre
        'theme-sage': '#8B9A8B',         // Vert sauge
        'theme-burgundy': '#6B2C3E',     // Bordeau profond
        'theme-slate': '#4A5568',        // Ardoise froide
        'theme-cream': '#F5F3F0',        // Beige cassé pour fond (déprécié)
        'theme-white': '#FFFFFF',        // Blanc pur pour fond
        // Classes globales par thème
        'theme-films': {
          DEFAULT: '#9B1A33',             // Rouge pourpre cerise sombre principal
          light: '#B91C3A',               // Rouge pourpre plus clair
          dark: '#7A1529',                // Rouge pourpre très sombre
          text: '#FFFFFF',                // Texte blanc
          border: '#FFFFFF',              // Bordure blanche
        },
        'theme-mediations': {
          DEFAULT: '#000000',            // Noir principal
          light: '#1a1a1a',              // Noir plus clair
          dark: '#000000',               // Noir plus sombre
          text: '#FFFFFF',               // Texte blanc
          border: '#FFFFFF',             // Bordure blanche
        },
        'theme-actus': {
          DEFAULT: '#B8860B',            // Jaune moutarde sombre principal
          light: '#D4AF37',              // Jaune moutarde plus clair
          dark: '#8B6914',               // Jaune moutarde plus sombre
          text: '#FFFFFF',               // Texte blanc
          border: '#000000',            // Bordure noire
        },
        'theme-videos-art': {
          DEFAULT: '#000000',            // Noir principal
          light: '#1a1a1a',              // Noir plus clair
          dark: '#000000',               // Noir très sombre
          text: '#FFFFFF',               // Texte blanc
          border: '#FFFFFF',             // Bordure blanche
        },
      },
      fontFamily: {
        // Andale Mono pour les paragraphes et texte courant
        sans: ['Andale Mono', 'Monaco', 'Menlo', 'monospace'],
        // Andale Mono pour les titres et éléments spéciaux
        'display': ['Andale Mono', 'Monaco', 'Menlo', 'monospace'],
        // Configuration par défaut
        serif: ['Andale Mono', 'Monaco', 'Menlo', 'monospace'],
        mono: ['Andale Mono', 'Monaco', 'Menlo', 'monospace'],
      },
      height: {
        '0.75': '0.1875rem', // 3px
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
        'sm': ['0.8125rem', { lineHeight: '1.25rem' }], // 13px
        'base': ['0.875rem', { lineHeight: '1.5rem' }], // 14px (au lieu de 16px)
        'lg': ['1rem', { lineHeight: '1.75rem' }],      // 16px (au lieu de 18px)
        'xl': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px (au lieu de 20px)
        '2xl': ['1.25rem', { lineHeight: '1.75rem' }],  // 20px (au lieu de 24px)
        '3xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px (au lieu de 30px)
        'heading-main': 'clamp(1.125rem, 2.2vw, 2rem)',
        'heading-display': 'clamp(1.5rem, 3vw, 2.25rem)',
        'heading-page': 'clamp(1.25rem, 2.5vw, 2rem)',
        'heading-section': 'clamp(1.5rem, 2.5vw, 2.5rem)',
        'heading-subtitle': 'clamp(1.25rem, 2.5vw, 2rem)',
        'body-large': 'clamp(0.9rem, 1.4vw, 1.05rem)',
        'body-base': 'clamp(0.8rem, 1vw, 0.95rem)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-delay': 'fadeInDelay 0.8s ease-out 0.3s forwards',
        'fade-in-delay-2': 'fadeInDelay2 0.8s ease-out 0.6s forwards',
        'marquee': 'marquee 30s linear infinite',
        'clap-top': 'clap-top 0.7s forwards',
        'clap-bottom': 'clap-bottom 0.7s forwards',
        'clap-top-reverse': 'clap-top-reverse 0.3s cubic-bezier(0.4, 0.0, 0.6, 1) forwards',
        'clap-bottom-reverse': 'clap-bottom-reverse 0.3s cubic-bezier(0.4, 0.0, 0.6, 1) forwards',
        'float': 'float 3s ease-in-out infinite',
        'slide-in-left': 'slideInFromLeft 0.8s ease-out forwards',
        'slide-in-right': 'slideInFromRight 0.8s ease-out forwards',
        'fade-in-slow': 'fadeInSlow 1.5s ease-out 0.5s forwards',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
}

export default config


