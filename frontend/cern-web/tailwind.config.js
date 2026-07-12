/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        bg2: 'rgb(var(--color-bg2) / <alpha-value>)',
        bg3: 'rgb(var(--color-bg3) / <alpha-value>)',
        bg4: 'rgb(var(--color-bg4) / <alpha-value>)',

        card: 'rgb(var(--color-card) / <alpha-value>)',
        card2: 'rgb(var(--color-card2) / <alpha-value>)',

        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        ink2: 'rgb(var(--color-ink2) / <alpha-value>)',
        ink3: 'rgb(var(--color-ink3) / <alpha-value>)',

        line: 'rgb(var(--color-line) / <alpha-value>)',
        line2: 'rgb(var(--color-line2) / <alpha-value>)',

    brand: {
    red: '#ff3b5c',
    red2: '#ff6b85',
    orange: '#ff7c35',
    amber: '#ffb83f',
    green: '#22e56b',
    blue: '#3d8bff',
    purple: '#9b6dff',
    pink: '#ff4f8b',
    teal: '#00cfc8',
  },
},
      boxShadow: {
        glow: '0 0 30px rgba(255,59,92,0.35)',
        card: '0 4px 24px rgba(0,0,0,0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
