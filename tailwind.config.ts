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
        // Couleurs du thème uniquement
        'theme-light': '#E8E8E8',
        'theme-beige': '#F0E1D1', 
        'theme-orange': '#E9B26E',
        'theme-navy': '#26436C',
        'theme-dark': '#0E1A27',
        // Nouvelles couleurs de la palette
        'theme-blue': '#26436C',
        'theme-grey': '#D9D5CC',
        'theme-yellow': '#E8B95C',
      },
      fontFamily: {
        sans: ['Funnel Display', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['PT Mono', 'monospace'],
        'pt-mono': ['PT Mono', 'monospace'],
        gabarito: ['var(--font-gabarito)', 'sans-serif'],
        title: ['var(--font-title)', 'sans-serif'],
        montserrat: ['var(--font-montserrat-alternates)', 'sans-serif'],
        funnel: ['Funnel Display', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
}

export default config


