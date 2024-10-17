/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Añadir los archivos de Angular
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', '"Helvetica Neue"', 'sans-serif'], // Configura tus fuentes personalizadas
        gsans : ['Google Sans', 'sans-serif']
      },
    },
  },
  plugins: [],
}

