/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf5f3',
          100: '#fcece9',
          200: '#f7d4ce',
          300: '#f2b3a8',
          400: '#ec8675',
          500: '#e6573d',
          600: '#d6452b',
          700: '#b33a24',
          800: '#933120',
          900: '#7a2c1e',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}