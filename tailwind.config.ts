import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Identite "registre paroissial numerise" : papier chaud, encre nuit,
        // un seul accent laiton ceremoniel reserve aux actions principales.
        papier: {
          DEFAULT: '#F6F4ED',
          doux: '#EFEBDF',
        },
        encre: {
          DEFAULT: '#1E2A44',
          douce: '#4B5468',
          pale: '#7C8494',
        },
        laiton: {
          DEFAULT: '#AD7C35',
          fonce: '#8E642A',
          clair: '#E7D9BC',
        },
        filet: '#DED5C0',
        succes: '#3F6B52',
        alerte: '#A6473F',
        // Conserves pour compatibilite avec le code existant (BarreNavigationBasse, etc.)
        epbomi: {
          fonce: '#1E2A44',
          principal: '#AD7C35',
        },
      },
      fontFamily: {
        serif: ['var(--police-serif)'],
        sans: ['var(--police-sans)'],
      },
      keyframes: {
        'entree-etape': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'remplir-ligne': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'entree-etape': 'entree-etape 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
        'remplir-ligne': 'remplir-ligne 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
