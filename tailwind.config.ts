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
        // Palette dynamique jaune/cyan + orange pour Florine Clap
        primary: {
          50: '#fefce8',   // Jaune très clair
          100: '#fef3c7',  // Jaune clair
          200: '#fde68a',   // Jaune doux
          300: '#fcd34d',   // Jaune
          400: '#fbbf24',   // Jaune vif
          500: '#f59e0b',   // Orange-jaune
          600: '#d97706',   // Orange
          700: '#b45309',   // Orange profond
          800: '#92400e',   // Orange sombre
          900: '#78350f',   // Orange très sombre
        },
        // Couleurs cyan pour contraste
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Couleurs neutres pour la sobriété
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Couleurs d'accent flash
        accent: {
          yellow: '#fbbf24',
          orange: '#f97316',
          cyan: '#06b6d4',
          lime: '#84cc16',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
}

export default config


