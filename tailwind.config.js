/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          950: '#0b0c10',
          900: '#13151b',
          850: '#181b22',
          800: '#1f232d',
          750: '#252a36',
          700: '#2c3240',
          600: '#3f475a',
          500: '#5c6780',
          accent: '#e5a93c',
          gold: '#f3c766',
          amber: '#d97706',
          blood: '#dc2626',
          detective: '#c084fc',
          paper: '#f4ede4',
          typewriter: '#2d2d2d'
        }
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Merriweather"', 'Georgia', 'Cambria', 'serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
        typewriter: ['"Courier Prime"', 'Courier', 'monospace'],
        cinzel: ['"Merriweather"', 'serif']
      }
    },
  },
  plugins: [],
}
