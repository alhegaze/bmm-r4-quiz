/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF3FA',
          100: '#D5E3F5',
          200: '#ABC7EB',
          300: '#7FA9E0',
          400: '#5B8FD6',
          500: '#1B3A6B',
          600: '#163056',
          700: '#112642',
          800: '#0C1C2E',
          900: '#07121A',
        },
        accent: {
          50: '#FEF6E4',
          100: '#FCEDC9',
          200: '#F9DB93',
          300: '#F5C95D',
          400: '#E8A020',
          500: '#D18E1A',
          600: '#A56F14',
          700: '#79510F',
          800: '#4D330A',
          900: '#211405',
        },
      },
    },
  },
  plugins: [],
}
