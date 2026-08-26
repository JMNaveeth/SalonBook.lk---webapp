/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4f0',
          100: '#fbe0d3',
          500: '#e8631a', // Warm saffron-orange
          600: '#d4551a',
          700: '#b84610',
          900: '#7c2d08',
        },
        secondary: {
          50: '#f0faf7',
          500: '#1a9e74', // Deep teal-green
          700: '#0f7a58',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          800: '#1f1f1f',
          900: '#111111',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
