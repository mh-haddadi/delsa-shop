/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./public/**/*.html",
    "./src/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        delsa: { 900: '#6E0F19', 700: '#A51520', 500: '#E3202B', 400: '#FF2330' },
        sun: '#FFC93C',
        lilac: '#C9B8FF',
        mint: '#A6EBCB',
        blush: '#FFF1EE',
        ink: '#2B0A0F',
      },
      fontFamily: {
        display: ['Lalezar', 'Vazirmatn', 'sans-serif'],
        sans: ['Vazirmatn', 'Tahoma', 'sans-serif'],
      },
    },
  },
  plugins: [],
};