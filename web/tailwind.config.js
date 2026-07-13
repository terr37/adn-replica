/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'ui-serif', 'Georgia', 'serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#B8902F', // Gold button
          dark: '#9A7826',
        },
        navy: {
          DEFAULT: '#051429', // Dark navy text
          light: '#0a2347',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          hover: '#F9FAFB',
        },
        background: '#F9FAFC',
        adn: {
          blue: '#00AEEF',
          yellow: '#FFD500',
          orange: '#F7941E',
          magenta: '#EC008C',
          green: '#00A651',
        },
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 30px rgba(0, 0, 0, 0.08)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-down': 'fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'marquee': 'marquee 35s linear infinite',
      }
    },
  },
  plugins: [],
}
