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
        cyber: {
          black: "#000000",
          dark: "#0a0a0a",
          deeper: "#050505",
          green: "#00ff41",
          "green-dim": "#00cc33",
          "green-dark": "#003b00",
          cyan: "#00ffcc",
          red: "#ff0033",
          purple: "#9b59b6",
          gray: "#1a1a2e",
          light: "#cccccc",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "Courier New", "monospace"],
      },
      animation: {
        flicker: "flicker 0.15s infinite",
        scan: "scan 2s linear infinite",
        typewriter: "typewriter 2s steps(40) forwards",
        blink: "blink 1s step-end infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "matrix-rain": "matrix-rain 10s linear infinite",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        scan: {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
        typewriter: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        glow: {
          from: { textShadow: "0 0 5px #00ff41, 0 0 10px #00ff41" },
          to: { textShadow: "0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 40px #00ff41" },
        },
        "matrix-rain": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      backgroundImage: {
        "cyber-grid": "linear-gradient(rgba(0, 255, 65, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "50px 50px",
      },
    },
  },
  plugins: [],
};
export default config;
