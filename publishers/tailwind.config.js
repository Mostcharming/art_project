/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: "#D8522E",
                dark: "#000000",
                "dark-secondary": "#333333",
                "dark-tertiary": "#666666",
                "text-primary": "#FFFFFF",
                "text-secondary": "#CCCCCC",
                "text-tertiary": "#999999",
                error: "#FF4444",
                "error-dark": "#8B3D1F",
                "error-light": "#A67C52",
            },
            fontFamily: {
                "bank-gothic-bold": ["BankGothicBold"],
                "bank-gothic-medium": ["BankGothicMediumBT"],
                "bank-gothic-light": ["BankGothicLightRegular"],
            },
        },
    },
    plugins: [],
};
