/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#acbc04", // Custom primary color
        primaryDark: "#9aab03", // Darker version for hover
        primaryLight: "#c5d506", // Lighter version for focus or active
        redeemInStore: "#ecbb19", // New color for Redeem In Store button
      },
    },
  },
  plugins: [],
};
