"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { soundManager } from "@/lib/audio";

// Frame 1: The Iconic Gothic Calligraphic "L" Emblem
const GOTHIC_L_FRAMES = [
`   .▄▄▄▄▄▄▄▄▄▄▄.  
  ▐█████████████▌ 
  ▐███▀      ▀███ 
  ▐███            
  ▐███   ▄▄▄▄     
  ▐███  ▐████▌    
  ▐███   ▀▀▀▀     
  ▐███            
  ▐███            
  ▐███▄▄▄▄▄▄▄▄▄▄▄ 
 ▄███████████████▌
 ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀`,
`   .▄▄▄▄▄▄▄▄▄▄▄.  
  ▐█████████████▌ 
  ▐███▀  ░░  ▀███ 
  ▐███    ░       
  ▐███   ▄▄▄▄     
  ▐███  ▐████▌    
  ▐███   ▀▀▀▀     
  ▐███   ░        
  ▐███   ░░       
  ▐███▄▄▄▄▄▄▄▄▄▄▄ 
 ▄███████████████▌
 ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀`,
`   .▄▄▄▄▄▄▄▄▄▄▄.  
  ▐█████████████▌ 
  ▐███▀  ▓▓  ▀███ 
  ▐███    ▓       
  ▐███   ▄▄▄▄     
  ▐███  ▐████▌    
  ▐███   ▀▀▀▀     
  ▐███    ▓       
  ▐███            
  ▐███▄▄▄▄▄▄▄▄▄▄▄ 
 ▄███████████████▌
 ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀`,
];

// Frame 2: The Iconic Crouching Detective "L" (Lawliet) Silhouette
const DETECTIVE_L_FRAMES = [
`           .---.           
          /     \\    [◉ ◉] 
         | () () |  < EYE  
        / \\  -  / \\        
       /   '---'   \\       
      /  /|     |\\  \\      
     |  | |  L  | |  |     
     |  | \\     / |  |     
      \\  \\ '---' /  /      
       \\  '-----'  /       
        '---------'        `,
`           .---.           
          /     \\    [• •] 
         |  - -  |  < EYE  
        / \\  =  / \\        
       /   '---'   \\       
      /  /|     |\\  \\      
     |  | |  L  | |  |     
     |  | \\     / |  |     
      \\  \\ '---' /  /      
       \\  '-----'  /       
        '---------'        `,
`           .---.           
          /     \\    [◉ ◉] 
         | (o)(o)|  < LOCK 
        / \\  -  / \\        
       /   '---'   \\       
      /  /|  †  |\\  \\      
     |  | |  L  | |  |     
     |  | \\  †  / |  |     
      \\  \\ '---' /  /      
       \\  '-----'  /       
        '---------'        `,
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
  const [mode, setMode] = useState<"gothic" | "detective">("gothic");
  const [frameIndex, setFrameIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  // Cycle animation frames smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 3);
    }, 450);
    return () => clearInterval(interval);
  }, []);

  // Occasional random glitch pulse
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 120);
      }
    }, 2800);
    return () => clearInterval(glitchInterval);
  }, []);

  const currentFrames = mode === "gothic" ? GOTHIC_L_FRAMES : DETECTIVE_L_FRAMES;
  const rawArt = currentFrames[frameIndex];

  const toggleMode = () => {
    soundManager.playTick();
    setMode((prev) => (prev === "gothic" ? "detective" : "gothic"));
  };

  const sizeClasses = {
    sm: "text-[9px] leading-[10px]",
    md: "text-[11px] leading-[12px] md:text-xs md:leading-[13px]",
    lg: "text-xs leading-[13px] md:text-sm md:leading-[15px]",
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* ASCII Canvas Box */}
      <div
        onClick={toggleMode}
        title="Click to toggle L ASCII mode (Sigil / Detective)"
        className="relative group cursor-pointer select-none rounded-xl bg-[#09090e] border border-[#ff1a2e]/30 hover:border-[#ff1a2e] transition-all p-3 md:p-4 shadow-[0_0_20px_rgba(0,0,0,0.8),inset_0_0_15px_rgba(255,26,46,0.05)] overflow-hidden"
      >
        {/* Top telemetry line */}
        <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 mb-2 pb-1.5 border-b border-white/5">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1a2e] animate-ping" />
            <span className="text-[#ff1a2e] font-bold">
              {mode === "gothic" ? "SIGIL // 0x4C" : "INVESTIGATOR // LAWLIET"}
            </span>
          </span>
          <span className="text-gray-400">FRAME: {frameIndex + 1}/3</span>
        </div>

        {/* ASCII Art Content */}
        <pre
          className={`font-mono text-[#ff1a2e] transition-all whitespace-pre text-center ${
            sizeClasses[size]
          } ${isGlitching ? "glitch opacity-80 translate-x-[1px]" : "opacity-95"}`}
          style={{ textShadow: "0 0 10px rgba(255, 26, 46, 0.45)" }}
        >
          {rawArt}
        </pre>

        {/* Scanning beam line */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <motion.div
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
            className="w-full h-8 bg-gradient-to-b from-transparent via-[#ff1a2e]/30 to-transparent"
          />
        </div>

        {/* Bottom hover prompt */}
        <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-gray-500 group-hover:text-gray-300 transition-colors">
          <span>MODE: {mode.toUpperCase()}</span>
          <span className="text-[#ff1a2e] group-hover:underline">TOGGLE ›</span>
        </div>
      </div>

      {showControls && (
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => {
              soundManager.playTick();
              setMode("gothic");
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              mode === "gothic"
                ? "bg-[#ff1a2e] text-white font-bold"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            Sigil
          </button>
          <button
            onClick={() => {
              soundManager.playTick();
              setMode("detective");
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              mode === "detective"
                ? "bg-[#ff1a2e] text-white font-bold"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            Detective
          </button>
        </div>
      )}
    </div>
  );
}
