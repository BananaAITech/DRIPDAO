/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  variants: {
    extend: {
      ringColor: ['focus', 'focus-visible'],
      ringOpacity: ['focus', 'focus-visible'],
    },
  },
}