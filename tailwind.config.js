/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3d6b4f',
          light: '#4a8a63',
          dark: '#2d4f3c',
        },
        secondary: {
          DEFAULT: '#d4a373',
          light: '#e0b896',
          dark: '#b8875a',
        },
        accent: {
          DEFAULT: '#e9edc9',
          dark: '#ccd4a3',
        },
        background: {
          light: '#faf8f5',
          dark: '#1a1a1a',
        },
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
