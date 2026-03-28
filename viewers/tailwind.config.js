/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './index.web.js',
        './App.tsx',
        './screens/**/*.{js,jsx,ts,tsx}',
        './navigation/**/*.{js,jsx,ts,tsx}',
        './**/*.{js,jsx,ts,tsx}',
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {},
    },
};
