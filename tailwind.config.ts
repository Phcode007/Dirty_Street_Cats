import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // ← IMPORTANTE: Ativa dark mode com classe CSS
  theme: {
    extend: {
      colors: {
        // Nossas cores personalizadas
        primary: "#000000",
        secondary: "#1A1A1A",
        tertiary: "#333333",
        highlight: {
          1: "#666666",
          2: "#999999",
        },
        light: {
          bg: "#FFFFFF",
          alt: "#F5F5F5",
        },
        accent: "#C0C0C0",
      },
      fontFamily: {
        heading: ["var(--font-cinzel)", "serif"],
        body: ["var(--font-crimson)", "serif"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.8s ease forwards",
      },
      keyframes: {
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
