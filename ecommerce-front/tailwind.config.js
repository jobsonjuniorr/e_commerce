/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",  // Referência para onde o Tailwind deve procurar por classes usadas
      "./src/**/*.{js,ts,jsx,tsx}",  // Diretórios onde você está usando Tailwind
    ],
    theme: {
      extend: {
        colors: {
          primary: '#FF5733', 
        },
      },
    },
    plugins: [],
  }
  