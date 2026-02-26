/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans JP"', '"Yu Gothic UI"', '"Yu Gothic"', '"Meiryo"', "sans-serif"],
        heading: ['"Noto Serif JP"', '"Hiragino Mincho ProN"', '"Yu Mincho"', "serif"],
        accent: ['"Barlow Condensed"', '"Noto Sans JP"', "sans-serif"],
      },
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        secondary: {
          100: "#e0f2f1",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
        },
        accent: {
          500: "#f97316",
          600: "#ea580c",
        },
      },
      boxShadow: {
        card: "0 10px 30px rgba(2, 132, 199, 0.08)",
      },
    },
  },
  plugins: [],
};
