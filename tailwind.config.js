/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'accent-orange': '#FF4F00',
        'accent-pink': '#FF007F',
        surface: '#F5F5F5',
        border: '#E0E0E0',
        muted: '#9E9E9E',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.06)',
        elevated: '0 8px 24px rgba(0,0,0,0.12), 0 16px 48px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
