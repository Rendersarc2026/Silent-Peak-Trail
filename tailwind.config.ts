import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "#cddaee",
        navy: "#052060",
        gold: {
          light: "#f5d080",
          DEFAULT: "#e8a830",
        },
        blue: {
          light: "#e8f0ff",
          DEFAULT: "#1a6bc8",
          mid: "#155fbb",
          dark: "#0d4a9e",
          deep: "#083a82",
        },
      },
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
