/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}", // include pages if used
  ],
  theme: {
    extend: {
      colors: {
        background: "#f9fafb",
        foreground: "#111827",
        card: "#ffffff",
        accent: "#3b82f6",
        "accent-foreground": "#ffffff",
        "muted-foreground": "#6b7280",
        meyerLemon: "#EFD780",
        squeezeLime: "#C8CE72",
        coralReef: "#F38081",
        babySky: "#a9def9",
        cloudWhite: "#f1fafe",
        softBabyBlue: "#BDD8F1",
        delicateBlue: "#d0e9fc",
        darkBlue: "#0F4C81",
        textGrey: "#4b4b4b",
        textBlueHover: "#77c1e6",
        btnBlue: "#77c1e6",
        btnBlueHover: "#4b4b4b",
      },
      fontFamily: {
        kids: ["var(--font-kids)", "cursive"], // uses Baloo 2
      },
    },
  },
  plugins: [],
};
