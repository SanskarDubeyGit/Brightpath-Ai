/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colours — edit in one place
        brand: {
          dark: '#04302B',      // Deep forest green
          darkHover: '#032623', // Slightly darker
          lime: '#B6F06B',      // Primary accent lime green
          limeDark: '#9FD95A',  // Lime hover state
          cream: '#F7F6EE',     // Light section background
          creamDark: '#ECEBDD', // Slightly darker cream
          forest: '#0B5B49',    // Mid forest green for borders/text
          forestLight: 'rgba(11, 91, 73, 0.1)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', boxShadow: '0 0 0 0 rgba(182, 240, 107, 0.4)' },
          '50%': { opacity: '1', boxShadow: '0 0 0 8px rgba(182, 240, 107, 0)' },
        },
      },
    },
  },
  plugins: [],
};