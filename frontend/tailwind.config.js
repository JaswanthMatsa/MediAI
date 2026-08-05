/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tealPrimary: {
          DEFAULT: '#0F766E',
          hover: '#115E59',
          light: '#F0FDFA',
        },
        tealSecondary: {
          DEFAULT: '#14B8A6',
          light: '#CCFBF1',
        },
        blueAccent: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
        },
        redEmergency: {
          DEFAULT: '#DC2626',
          hover: '#B91C1C',
        },
        medBg: '#F8FAFC',
        medText: '#0F172A',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
