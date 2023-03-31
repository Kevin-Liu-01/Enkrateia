/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        hanken: ["Hanken Grotesk", "Inter"],
        general: ["General Sans", "Inter"],
      },
      colors: {
        gpt: "#63b55a",
        gptLight: "#80dc75",
        gptDark: "#509648",
      },
    },
  },
  plugins: [require("tailwindcss-bg-patterns")],
};

module.exports = config;
