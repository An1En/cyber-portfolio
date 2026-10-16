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
          black: "#050507",
          dark: "#0a0a0e",
          deeper: "#07070a",
          obsidian: "#0f0f14",
          crimson: "#ff1a2e",
          "crimson-dim": "#b91c1c",
          "crimson-dark": "#450a0a",
          blood: "#e11d48",
          bone: "#f4f4f6",
          parchment: "#e5e7eb",
          slate: "#9ca3af",
          muted: "#4b5563",
          amber: "#ffb000",
          gray: "#111116",
        },
      },
      fontFamily: {
        deathnote: ["DeathNote", "Cinzel", "serif"],
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
          from: { textShadow: "0 0 5px #ffb000, 0 0 10px #ffb000" },
          to: { textShadow: "0 0 10px #ffb000, 0 0 20px #ffb000, 0 0 40px #ffb000" },
        },
        "matrix-rain": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      backgroundImage: {
        "cyber-grid": "linear-gradient(rgba(255, 176, 0, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 176, 0, 0.035) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "50px 50px",
      },
    },
  },
  plugins: [],
};
export default config;
