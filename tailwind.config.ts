import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#005DE9F2",
        danger: "#C20000F2",
        primaryText: "#000F23",
        secondaryText: "#233041",
        background: "#005DE905",
        green1: "#4BC500",
        gray1: "#000F230D",
        gray2: "#000F230A",
      },
      fontSize: {
        xxs: "0.635rem",
      },
    },
  },
  plugins: [],
};
export default config;
