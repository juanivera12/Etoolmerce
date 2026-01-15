/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc', // Slate 50
        surface: '#ffffff',    // White
        'surface-highlight': '#f1f5f9', // Slate 100
        border: '#e2e8f0',     // Slate 200
        primary: '#4f46e5',    // Indigo 600
        'primary-hover': '#4338ca', // Indigo 700
        text: '#0f172a',       // Slate 900
        'text-muted': '#64748b', // Slate 500
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
