import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#f8fafc",
        surface: "#ffffff",
        "surface-2": "#f1f5f9",
        ink: "#0f172a",
        muted: "#64748b",
        accent: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
          soft: "rgba(37, 99, 235, 0.08)",
        },
        border: "rgba(15, 23, 42, 0.10)",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-plus-jakarta-sans)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "10px",
        md: "10px",
        lg: "10px",
      },
    },
  },
  plugins: [],
};
export default config;
