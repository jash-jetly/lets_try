/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFBF5',
          100: '#FEF7ED',
          200: '#FEF0D9',
          300: '#FDE4B8',
          400: '#FCD485',
          500: '#FAC151',
        },
        mint: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
        },
        lavender: {
          50: '#F8FAFC',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
        },
        peach: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
        }
      },
      fontFamily: {
        'sans': ['Inter-Regular'],
        'medium': ['Inter-Medium'],
        'bold': ['Inter-Bold'],
      }
    },
  },
  plugins: [],
}