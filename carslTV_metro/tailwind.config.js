/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './index.js'],
  theme: {
    extend: {
      colors: {
        cyan: {
          bright: '#00d9ff',
        },
      },
    },
  },
  plugins: [],
};
