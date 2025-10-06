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
          50: '#fff7ed',   // Orange très clair
          100: '#ffedd5',  // Orange clair
          200: '#fed7aa',   // Orange doux
          300: '#fdba74',   // Orange
          400: '#fb923c',   // Orange vif
          500: '#f97316',   // Orange principal
          600: '#ea580c',   // Orange foncé
          700: '#c2410c',   // Orange profond
          800: '#9a3412',   // Orange sombre
          900: '#7c2d12',   // Orange très sombre
        },
        // Couleurs cyan pour contraste
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#8ECAE6',   // Light Blue
          400: '#219EBC',   // Medium Blue
          500: '#126782',   // Teal Blue
          600: '#0e7490',
          700: '#155e75',
          800: '#023047',   // Dark Blue
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
          yellow: '#FFB703',   // Golden Yellow
          orange: '#FD9E02',   // Bright Orange
          cyan: '#219EBC',     // Medium Blue
          lime: '#FB8500',     // Vibrant Orange
        },
      },
      fontFamily: {
        sans: ['Funnel Display', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
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


