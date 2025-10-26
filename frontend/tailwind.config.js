/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#20C2C2',
        secondary: '#4169E1',
        background: '#FDFBF6',
        glass: 'rgba(255, 255, 255, 0.25)',
      },
    },
  },
  plugins: [],
}
