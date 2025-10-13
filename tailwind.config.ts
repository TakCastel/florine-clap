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
        'theme-yellow': '#E8B95C',       // Jaune moutarde de la palette
        'theme-sage': '#8B9A8B',         // Vert sauge
        'theme-burgundy': '#6B2C3E',     // Bordeau profond
        'theme-slate': '#4A5568',        // Ardoise froide
      },
      fontFamily: {
        // Configuration simplifiée avec Andale Mono comme unique typographie
        sans: ['Andale Mono', 'monospace'],
        serif: ['Andale Mono', 'monospace'],
        mono: ['Andale Mono', 'monospace'],
        'andale-mono': ['Andale Mono', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
}

export default config


