import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#f8f5ee",
        surface: "#fffdf8",
        "surface-2": "#eee7da",
        ink: "#211b17",
        muted: "#756a5f",
        accent: {
          DEFAULT: "#1b5e20",
          hover: "#144c1a",
          soft: "rgba(27, 94, 32, 0.08)",
        },
        border: "rgba(33, 27, 23, 0.14)",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-plus-jakarta-sans)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
        md: "8px",
        lg: "8px",
      },
    },
  },
  plugins: [],
};
export default config;
