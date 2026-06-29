/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: '#0a0c10',
        bg2: '#131720',
        bg3: '#1a2030',
        bg4: '#222840',
        card: '#161c2a',
        card2: '#1e2638',
        ink: '#eef0f6',
        ink2: '#9aa0b8',
        ink3: '#5a6080',
        line: 'rgba(255,255,255,0.07)',
        line2: 'rgba(255,255,255,0.12)',
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
