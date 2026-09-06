import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
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
        border: "var(--border)",
        brand: {
          DEFAULT: "var(--brand-primary)",
          hover: "var(--brand-hover)",
          light: "var(--brand-light)",
          foreground: "var(--brand-foreground)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          secondary: "var(--surface-secondary)",
          border: "var(--surface-border)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
      },
      fontFamily: {
        sans: ["'Poppins'", "'Noto Sans Thai'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        heading: ["'Poppins'", "'Noto Sans Thai'", "sans-serif"],
        body: ["'Poppins'", "'Noto Sans Thai'", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        hover: "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)",
      },
    },
  },
  plugins: [],
};

export default config;
