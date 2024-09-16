/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        customBackground: 'linear-gradient(rgb(8, 46, 183), rgb(26, 26, 26))',
      },
    },
  },
  plugins: [],
}

