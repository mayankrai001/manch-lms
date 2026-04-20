/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#60a5fa', // blue-400
          DEFAULT: '#3b82f6', // blue-500
          dark: '#1d4ed8', // blue-700
        },
        secondary: {
          light: '#fcd34d', // amber-300
          DEFAULT: '#f59e0b', // amber-500
          dark: '#d97706', // amber-600
        }
      }
    },
  },
  plugins: [],
}
