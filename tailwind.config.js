/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'asu-maroon': '#8C1D40',
        'asu-gold': '#FFC627',
        'asu-blue': '#4B9CD3',
        'asu-orange': '#FF7F32',
        'asu-cream': '#FAF7F2',
        'asu-gray': '#333333',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s infinite',
      },
    },
  },
  plugins: [],
} 