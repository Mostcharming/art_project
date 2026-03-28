/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './App.tsx',
        './**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [require('nativewind/tailwind/css')],
};
