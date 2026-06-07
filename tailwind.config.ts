import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        aura: {
          cream: '#FDF8FB',
          white: '#FFFFFF',
          charcoal: '#1C1C1C',
          'rose-gold': '#C44B8A',
          blush: '#FCEEF5',
          'blush-dark': '#F4C5DC',
          stone: '#9B6B85',
          'border-soft': '#F0D5E5',
          dark: '#111111',
          'dark-footer': '#1A0A12',
          // Legacy aliases kept for backward compatibility
          red: '#C44B8A',
          navy: '#1C1C1C',
          beige: '#C44B8A',
          gray: '#FDF8FB',
          border: '#F0D5E5',
          dark2: '#1C1C1C',
        },
        'rose-light': '#F7C5D8',
        'rose-dark': '#9B2D6E',
        'peach': '#FFE4F0',
        'coral': '#E8698E',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
