import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset").default],
  theme: {
    extend: {
      fontFamily: {
        bankgothic: ["BankGothic"],
        bankgothicbold: ["BankGothicBold"],
        bankgothicmedium: ["BankGothicMedium"],
      },
    },
  },
  plugins: [],
};

export default config;
