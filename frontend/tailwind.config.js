/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {

        ink: {
          900: '#0a0a0a',
          800: '#1a1a1a',
          700: '#2a2a2a',
          600: '#4a4a4a',
          500: '#6a6a6a',
          400: '#8a8a8a',
          300: '#aaaaaa',
          200: '#cacaca',
          100: '#eaeaea',
        },
        paper: {
          DEFAULT: '#f9f8f6',
          100: '#fcfcfc',
        },
        blood: {
          900: '#5a0a0a',
          800: '#7a0d0d',
          700: '#9b1111',
          600: '#b81414',
          100: '#fce8e8',
          50: '#fdf4f4',
          accent: '#8f2020',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        editorial: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
