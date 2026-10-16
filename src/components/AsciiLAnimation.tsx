"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { soundManager } from "@/lib/audio";

export const L_BRAILLE_ART = `⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠛⠋⠉⠉⣨⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠋⠀⠀⠀⠀⠀⠀⠰⠟⠻⠛⠛⠛⠻⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠛⠛⠋⠉⠉⠉⠙⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⠻⢿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⠟⣋⣀⣤⣤⡤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣩⣼⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢤⣤⣶⣾⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣃⡔⠀⠀⠀⠀⠀⡰⠊⠡⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿
⣿⣿⣿⣿⣿⣿⡿⠀⠀⠀⠀⠠⡐⠁⠀⢀⠡⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿
⣿⣿⣿⣿⣿⡟⠁⠀⠀⠀⣠⢷⠀⢿⣟⣿⡇⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿
⣿⣿⣿⠿⠋⠀⠀⠀⠀⣼⣻⣎⣧⡬⢭⣞⣬⡀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿
⣿⣿⣤⣤⣤⣤⡄⠀⠀⣿⣳⡿⠃⣽⣟⣾⣳⠇⠀⠀⠆⠣⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿
⣿⣿⣿⣿⣿⣿⣷⠀⠀⢹⣯⢿⣷⣻⣞⡷⣿⢷⢠⠃⠀⠀⣀⠠⣟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⣀⡀⠀⠙
⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀⢿⣇⣈⣷⣿⣻⣽⣯⢷⠈⢟⣿⣻⠶⠈⠖⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⠏⣰⠀⠀⠈⣿⢿⣹⣾⡿⣷⣏⡿⣆⠀⠈⠁⣀⠾⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿
⣿⣿⣿⣿⠟⣡⣾⣷⠀⡀⢳⣌⠛⢫⣿⡽⣟⣾⡽⣾⡽⣶⣻⡜⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿
⣿⣿⡿⠃⣼⣟⡷⣷⣾⣷⠘⣾⣿⣦⡈⠙⠛⠷⠿⢳⡿⠷⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣄⠀⠀⠀⣿⣿⣿⣿⣿
⣿⣿⢁⣾⣻⢾⡽⣯⣿⣽⡆⣿⡿⠿⢏⣷⡠⡂⠄⡄⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣷⣤⣀⣘⣿⣿⣿⣿
⣿⠁⣾⣷⠯⠿⠽⠿⠟⠋⢑⡵⣮⢟⡾⣶⠝⠆⠀⠀⠠⣾⣹⡟⣿⣳⣄⠀⠀⠀⠀⢠⣶⡀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠇⢸⢆⣠⣴⣶⣶⣶⡞⢡⡾⠉⠈⠉⠉⠁⠀⠀⠈⠀⠀⠀⠉⠛⠓⠓⢋⡀⠀⠀⢠⣿⣿⣷⣦⣀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⣴⣿⣟⣯⢿⣞⣿⠀⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠄⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿
⡄⠻⣿⣟⡾⣯⢿⠟⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠠⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟
⣿⣦⠉⣉⠹⠩⠥⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢲⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⠀⢸⡭⡻⠇⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⠀⣮⣞⡍⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⠀⢸⣿⣼⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣧⠘⢿⣽⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣷⣄⡈⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢺⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣷⣶⣤⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⡀⢀⡀⠀⠀⣀⣀⣀⣤⣶⢰⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡐⠳⣶⠲⣖⡶⢲⣇⢻⡇⣤⡙⠿⡋⣷⡉⡷⠙⢂⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣤⢁⣙⠙⠐⣚⣈⣴⣿⣿⣶⣦⣤⣥⣴⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿`;

interface AsciiLProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showControls?: boolean;
}

export default function AsciiLAnimation({
  size = "md",
  className = "",
  showControls = true,
}: AsciiLProps) {
  const [colorMode, setColorMode] = useState<"crimson" | "white" | "stealth">("crimson");
  const [isGlitching, setIsGlitching] = useState(false);

  // Occasional random glitch pulse
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.65) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 140);
      }
    }, 3200);
    return () => clearInterval(glitchInterval);
  }, []);

  const toggleColor = () => {
    soundManager.playTick();
    setColorMode((prev) =>
      prev === "crimson" ? "white" : prev === "white" ? "stealth" : "crimson"
    );
  };

  const colorStyles = {
    crimson: "text-[#ff1a2e] drop-shadow-[0_0_12px_rgba(255,26,46,0.65)]",
    white: "text-[#f4f4f6] drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]",
    stealth: "text-gray-400 drop-shadow-[0_0_8px_rgba(156,163,175,0.25)]",
  };

  // Highly tuned font size and line height so Braille characters form a seamless high-density portrait
  const sizeClasses = {
    sm: "text-[5px] leading-[5px] sm:text-[6px] sm:leading-[6px]",
    md: "text-[6px] leading-[6px] sm:text-[7.5px] sm:leading-[7.5px] md:text-[8.5px] md:leading-[8.5px]",
    lg: "text-[7.5px] leading-[7.5px] sm:text-[9px] sm:leading-[9px] md:text-[10px] md:leading-[10px]",
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Container with Doppelrand double-bezel framing */}
      <div
        onClick={toggleColor}
        title="Click to toggle L color telemetry (Crimson / Bone / Stealth)"
        className="relative group cursor-pointer select-none rounded-2xl bg-[#07070b]/90 border border-[#ff1a2e]/30 hover:border-[#ff1a2e] transition-all p-3 sm:p-4 shadow-[0_15px_35px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(255,26,46,0.06)] overflow-hidden"
      >
        {/* Header HUD */}
        <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 mb-2.5 pb-2 border-b border-white/5">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff1a2e] animate-ping" />
            <span className="text-[#ff1a2e] font-bold tracking-wider">
              L LAWLIET // INVESTIGATOR CODEX
            </span>
          </span>
          <span className="text-gray-500 font-mono hidden sm:inline">
            BRAILLE MATRIX: 48×33
          </span>
        </div>

        {/* Braille ASCII Portrait of L */}
        <div className="overflow-x-auto scrollbar-none flex justify-center py-1">
          <pre
            className={`font-mono transition-colors tracking-tight whitespace-pre select-all ${
              sizeClasses[size]
            } ${colorStyles[colorMode]} ${
              isGlitching ? "glitch opacity-80 translate-x-[1px]" : "opacity-95"
            }`}
            style={{
              fontFamily: "'Courier New', Courier, monospace",
            }}
          >
            {L_BRAILLE_ART}
          </pre>
        </div>

        {/* Scanline Sweep Laser */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <motion.div
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
            className="w-full h-12 bg-gradient-to-b from-transparent via-[#ff1a2e]/40 to-transparent"
          />
        </div>

        {/* Footer HUD info */}
        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-gray-500 group-hover:text-gray-300 transition-colors">
          <span>THEME: {colorMode.toUpperCase()}</span>
          <span className="text-[#ff1a2e] group-hover:underline">TOGGLE PALETTE ›</span>
        </div>
      </div>

      {showControls && (
        <div className="flex items-center gap-1.5 mt-2">
          {(["crimson", "white", "stealth"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                soundManager.playTick();
                setColorMode(mode);
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider transition-colors ${
                colorMode === mode
                  ? "bg-[#ff1a2e] text-white font-bold"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
