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
          cream: '#FAFAF7',
          white: '#FFFFFF',
          charcoal: '#1C1C1C',
          'rose-gold': '#C4A882',
          blush: '#F5E6DF',
          'blush-dark': '#E8D0C6',
          stone: '#8C7B6B',
          'border-soft': '#EDE8E3',
          dark: '#111111',
          'dark-footer': '#0F0F0F',
          // Legacy aliases kept for backward compatibility
          red: '#C4A882',
          navy: '#1C1C1C',
          beige: '#C4A882',
          gray: '#FAFAF7',
          border: '#EDE8E3',
          dark2: '#1C1C1C',
        },
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
