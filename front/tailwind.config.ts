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
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
}

export default config


