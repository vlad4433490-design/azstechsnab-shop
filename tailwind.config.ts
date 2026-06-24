import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1d4ed8",
          blueDark: "#0f3fb8",
          ink: "#060b1e",
          muted: "#52627a",
          line: "#dbe3ee",
          surface: "#f4f7fb"
        }
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
