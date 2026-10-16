"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { soundManager } from "@/lib/audio";

// Authentic visible character L (Lawliet from Death Note) crouching on his chair
const L_CROUCHING_FRAMES = [
`               /\\   /\\   /\\   /\\
          /\\  /  \\_/  \\_/  \\_/  \\  /\\
         /  \\/                   \\/  \\
        /    /  __           __   \\   \\
       |    /  /  \\         /  \\   \\   |
       |   |  | (◉)|       | (◉)|   |  |   [ L : LAWLIET ]
       |   |   \\__/         \\__/    |  |   [ DEDUCTION: 99.8% ]
       |    \\         /\\           /   |
        \\    \\       (..)         /   /
         \\    \`------\`--\`--------\`   /
        .-/                         \\-.
       /  |     .-.         .-.      | \\
      /   |    /   \\   _   /   \\     |  \\
     /    |   |     | ( ) |     |    |   \\
    |     |   |     |/   \\|     |    |    |
    |     |   |     |     |     |    |    |
     \\    \\    \\   / \\___/ \\   /    /    /
      \`---'     \`-"         \`-"     \`---'`,
`               /\\   /\\   /\\   /\\
          /\\  /  \\_/  \\_/  \\_/  \\  /\\
         /  \\/                   \\/  \\
        /    /  __           __   \\   \\
       |    /  /  \\         /  \\   \\   |
       |   |  | (•)|       | (•)|   |  |   [ L : SCANNING ]
       |   |   \\__/         \\__/    |  |   [ TARGET LOCKED ]
       |    \\         /\\           /   |
        \\    \\       (..)         /   /
         \\    \`------\`--\`--------\`   /
        .-/                         \\-.
       /  |     .-.         .-.      | \\
      /   |    /   \\   _   /   \\     |  \\
     /    |   |     | ( ) |     |    |   \\
    |     |   |     |/   \\|     |    |    |
    |     |   |     |     |     |    |    |
     \\    \\    \\   / \\___/ \\   /    /    /
      \`---'     \`-"         \`-"     \`---'`,
`               /\\   /\\   /\\   /\\
          /\\  /  \\_/  \\_/  \\_/  \\  /\\
         /  \\/                   \\/  \\
        /    /  __           __   \\   \\
       |    /  /  \\         /  \\   \\   |
       |   |  | (◉)|   †   | (◉)|   |  |   [ L : ADVERSARY ]
       |   |   \\__/         \\__/    |  |   [ ROOT IMMINENT ]
       |    \\         /\\           /   |
        \\    \\       (..)         /   /
         \\    \`------\`--\`--------\`   /
        .-/                         \\-.
       /  |     .-.         .-.      | \\
      /   |    /   \\   _   /   \\     |  \\
     /    |   |     | ( ) |     |    |   \\
    |     |   |     |/   \\|     |    |    |
    |     |   |     |     |     |    |    |
     \\    \\    \\   / \\___/ \\   /    /    /
      \`---'     \`-"         \`-"     \`---'`,
];

// Visible character L close-up portrait with his intense gaze
const L_PORTRAIT_FRAMES = [
`           /\\   /\\  _/\\_  /\\   /\\
          /  \\_/  \\/    \\/  \\_/  \\
         /   /                  \\  \\
        |   /   /--\\      /--\\   \\  |
        |  |   | (◉)|    | (◉)|   | |    [ L : LAWLIET ]
        |  |    \\__/      \\__/    | |    [ SHINIGAMI EYE RETICLE ]
        |   \\        ____        /  |    [ LATENCY: 0.04ms ]
         \\   \\      /    \\      /  /
          \\   '----' (..) '----'  /
           \\         \\__/        /
            '-------------------'`,
`           /\\   /\\  _/\\_  /\\   /\\
          /  \\_/  \\/    \\/  \\_/  \\
         /   /                  \\  \\
        |   /   /--\\      /--\\   \\  |
        |  |   | (•)|    | (•)|   | |    [ L : EYE BLINK ]
        |  |    \\__/      \\__/    | |    [ SCANNING TARGET ]
        |   \\        ____        /  |    [ LATENCY: 0.02ms ]
         \\   \\      /    \\      /  /
          \\   '----' (..) '----'  /
           \\         \\__/        /
            '-------------------'`,
`           /\\   /\\  _/\\_  /\\   /\\
          /  \\_/  \\/    \\/  \\_/  \\
         /   /                  \\  \\
        |   /   /--\\  †   /--\\   \\  |
        |  |   | (◉)|    | (◉)|   | |    [ L : ROOT DEDUCTION ]
        |  |    \\__/      \\__/    | |    [ PROVING GROUNDS: HTB ]
        |   \\        ____        /  |    [ LATENCY: 0.01ms ]
         \\   \\      /    \\      /  /
          \\   '----' (..) '----'  /
           \\         \\__/        /
            '-------------------'`,
];

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
  const [pose, setPose] = useState<"crouching" | "portrait">("crouching");
  const [frameIndex, setFrameIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 3);
    }, 450);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 120);
      }
    }, 3000);
    return () => clearInterval(glitchInterval);
  }, []);

  const currentFrames = pose === "crouching" ? L_CROUCHING_FRAMES : L_PORTRAIT_FRAMES;
  const rawArt = currentFrames[frameIndex];

  const togglePose = () => {
    soundManager.playTick();
    setPose((prev) => (prev === "crouching" ? "portrait" : "crouching"));
  };

  const sizeClasses = {
    sm: "text-[8px] leading-[9px] md:text-[9px] md:leading-[10px]",
    md: "text-[9px] leading-[10px] sm:text-[10px] sm:leading-[11px] md:text-[11px] md:leading-[12px]",
    lg: "text-[10px] leading-[11px] sm:text-xs sm:leading-[13px] md:text-sm md:leading-[15px]",
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* ASCII Character Container */}
      <div
        onClick={togglePose}
        title="Click to toggle L character pose (Crouch / Close-up)"
        className="relative group cursor-pointer select-none rounded-2xl bg-[#08080d] border border-[#ff1a2e]/30 hover:border-[#ff1a2e] transition-all p-3.5 md:p-5 shadow-[0_0_30px_rgba(0,0,0,0.85),inset_0_0_20px_rgba(255,26,46,0.06)] overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 mb-2.5 pb-2 border-b border-white/5">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff1a2e] animate-ping" />
            <span className="text-[#ff1a2e] font-bold">
              {pose === "crouching" ? "L LAWLIET // CROUCH POSE" : "L LAWLIET // INVESTIGATOR STARE"}
            </span>
          </span>
          <span className="text-gray-500 font-mono">FRAME: {frameIndex + 1}/3</span>
        </div>

        {/* ASCII Character Art Display */}
        <pre
          className={`font-mono text-[#ff1a2e] transition-all whitespace-pre text-left ${
            sizeClasses[size]
          } ${isGlitching ? "glitch opacity-80 translate-x-[1px]" : "opacity-95"}`}
          style={{ textShadow: "0 0 10px rgba(255, 26, 46, 0.5)" }}
        >
          {rawArt}
        </pre>

        {/* Scanline Sweep Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
          <motion.div
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
            className="w-full h-10 bg-gradient-to-b from-transparent via-[#ff1a2e]/40 to-transparent"
          />
        </div>

        {/* Bottom Interactive Prompt */}
        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-gray-500 group-hover:text-gray-300 transition-colors">
          <span>CHARACTER: L (DEATH NOTE)</span>
          <span className="text-[#ff1a2e] group-hover:underline">TOGGLE POSE ›</span>
        </div>
      </div>

      {showControls && (
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => {
              soundManager.playTick();
              setPose("crouching");
            }}
            className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors ${
              pose === "crouching"
                ? "bg-[#ff1a2e] text-white font-bold"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            L Crouch Pose
          </button>
          <button
            onClick={() => {
              soundManager.playTick();
              setPose("portrait");
            }}
            className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors ${
              pose === "portrait"
                ? "bg-[#ff1a2e] text-white font-bold"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            L Close-Up Stare
          </button>
        </div>
      )}
    </div>
  );
}
