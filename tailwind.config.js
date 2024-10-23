/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // modod oscuro
  content: [
    "./src/**/*.{html,ts}", // Añadir los archivos de Angular
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', '"Helvetica Neue"', 'sans-serif'], // Configura tus fuentes personalizadas
        gsans : ['Google Sans', 'sans-serif']
      },
      spacing: {
        'auto': 'auto', // lo uso para w-auto... supogo que se podrá usar para algo más
      },
    },
  },
  plugins: [],
}



