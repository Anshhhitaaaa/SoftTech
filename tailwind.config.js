/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          800: '#0a2540',
          900: '#072B54',
          950: '#041d3a',
        },
        brand: {
          blue: '#1b5bb8',
          hover: '#144896',
          light: '#eef4ff',
          border: '#d0dbe8',
        }
      }
    },
  },
  plugins: [],
}
