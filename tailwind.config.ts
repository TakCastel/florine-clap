import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette "blue + yellow" - Such a Nice Person
        'theme-light': '#D9D5CC',        // Gris chaud de la palette
        'theme-beige': '#D9D5CC',        // Gris chaud de la palette
        'theme-orange': '#E8B95C',       // Jaune moutarde de la palette
        'theme-navy': '#26436C',         // Bleu sombre de la palette
        'theme-dark': '#0B1426',         // Bleu nuit profond
        // Couleurs principales de la palette
        'theme-blue': '#26436C',         // Bleu principal de la palette
        'theme-grey': '#D9D5CC',         // Gris chaud de la palette
        'theme-yellow': '#FFD700',       // Jaune pop art vibrant
        'theme-sage': '#8B9A8B',         // Vert sauge
        'theme-burgundy': '#6B2C3E',     // Bordeau profond
        'theme-slate': '#4A5568',        // Ardoise froide
        'theme-cream': '#F5F3F0',        // Beige cassé pour fond
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


