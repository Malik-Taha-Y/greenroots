import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canopy: {
          950: "#0E1F16",
          900: "#153826",
          800: "#1F4D33",
          700: "#2C6642",
          600: "#3D7F51",
          500: "#579763",
          400: "#7FB287",
        },
        soil: {
          800: "#4A3722",
          700: "#6B4F30",
          600: "#8B6339",
          500: "#A9793F",
          300: "#D8B888",
        },
        sand: {
          100: "#F4F1E6",
          200: "#ECE6D3",
          50: "#FAF8F1",
        },
        clay: {
          500: "#B85C38",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "root-lines": "url('/roots.svg')",
      },
    },
  },
  plugins: [],
};
export default config;
