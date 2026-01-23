/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#121212', // Deep Charcoal / Matte Black
        surface: '#1E1E1E',    // Dark Gray Panels
        'surface-highlight': '#2A2A2A', // Slightly lighter for hover
        border: '#333333',     // Dark Border
        primary: '#FFD700',    // Banana Yellow
        'primary-hover': '#FFE135', // Lighter Yellow for hover
        text: '#FFFFFF',       // White
        'text-muted': '#9CA3AF', // Gray-400
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },
  plugins: [],
}
