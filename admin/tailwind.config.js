/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                "bank-gothic-bold": ["BankGothicBold"],
                "bank-gothic-medium": ["BankGothicMediumBT"],
                "bank-gothic-light": ["BankGothicLightRegular"],
            },
        },
    },
    plugins: [],
};
