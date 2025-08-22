/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#B01831',
        accent: '#f7f7f7'
      },
      borderRadius: {
        xlcard: '1rem'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        orelega: ['"Orelega One"', 'cursive']
      }
    }
  },
  plugins: [],
};