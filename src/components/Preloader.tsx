"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AsciiLAnimation from "./AsciiLAnimation";
import { soundManager } from "@/lib/audio";

const BOOT_LOGS = [
  "INITIALIZING OFFENSIVE KERNEL & GOTHIC CIPHERS...",
  "ACQUIRING SHINIGAMI TARGET RETICLE // 40s TO ROOT...",
  "CONNECTING HTB PROVING GROUNDS [ID: 019cfb0e]...",
  "INSCRIBING TARGET HOSTS INTO CLASSIFIED DOSSIER...",
  "SYSTEM DECLASSIFIED // ACCESS GRANTED.",
];

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    // Check if user already saw the preloader in this session
    const hasSeen = sessionStorage.getItem("cyber_portfolio_loaded");
    if (hasSeen === "true") {
      setLoading(false);
      return;
    }

    const duration = 1800; // ms total
    const steps = 100;
    const intervalTime = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      setProgress(current);

      // Advance log message every 25%
      const newLog = Math.min(
        Math.floor((current / 100) * BOOT_LOGS.length),
        BOOT_LOGS.length - 1
      );
      setLogIndex(newLog);

      if (current % 20 === 0) {
        soundManager.playTick();
      }

      if (current >= 100) {
        clearInterval(timer);
        soundManager.playTargetAcquired();
        setTimeout(() => {
          sessionStorage.setItem("cyber_portfolio_loaded", "true");
          setLoading(false);
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const handleSkip = () => {
    sessionStorage.setItem("cyber_portfolio_loaded", "true");
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-[#050507] flex flex-col items-center justify-center p-6 select-none"
        >
          {/* Top Classification Stamp */}
          <div className="absolute top-8 left-0 right-0 px-6 flex items-center justify-between text-[10px] font-mono text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff1a2e] animate-ping" />
              <span className="text-[#ff1a2e] font-bold">SYSTEM_INITIALIZATION // 0xDEAD</span>
            </span>
            <span className="hidden sm:inline">CLEARANCE: LEVEL 5 // RED TEAM OPS</span>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-[#ff1a2e] transition-colors border border-white/10 px-2.5 py-1 rounded hover:border-[#ff1a2e]"
            >
              [ SKIP › ]
            </button>
          </div>

          <div className="max-w-md w-full flex flex-col items-center">
            {/* Center ASCII L Character Animation */}
            <div className="mb-6 scale-110">
              <AsciiLAnimation size="md" showControls={false} />
            </div>

            {/* Title / Emblem */}
            <div className="text-center mb-6">
              <div className="font-deathnote text-2xl md:text-3xl text-white tracking-widest deathnote-glow">
                CYBER DOSSIER
              </div>
              <p className="font-mono text-[11px] text-gray-400 mt-1 uppercase tracking-wider">
                INVESTIGATOR: ANLEN JEBAN (AN1EN)
              </p>
            </div>

            {/* Hairline Progress Bar */}
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden border border-white/10 p-[1px] relative mb-3">
              <motion.div
                className="h-full bg-gradient-to-r from-[#991b1b] via-[#dc2626] to-[#ff1a2e] rounded-full shadow-[0_0_12px_#ff1a2e]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Status readouts */}
            <div className="w-full flex items-center justify-between text-xs font-mono mb-4 text-gray-400">
              <span className="text-[11px] text-gray-400 truncate max-w-[280px]">
                › {BOOT_LOGS[logIndex]}
              </span>
              <span className="text-[#ff1a2e] font-bold text-sm ml-2">
                {progress}%
              </span>
            </div>

            {/* Hex / Coordinates ticker */}
            <div className="flex items-center gap-4 text-[10px] font-mono text-gray-600">
              <span>LAT: 40s</span>
              <span>•</span>
              <span>HOST: 019cfb0e-4078</span>
              <span>•</span>
              <span>STATUS: ARMED</span>
            </div>
          </div>

          {/* Bottom attribution */}
          <div className="absolute bottom-8 left-0 right-0 text-center text-[10px] font-mono text-gray-600">
            &ldquo;THE SYSTEM WHOSE VULNERABILITY IS WRITTEN SHALL BE COMPROMISED.&rdquo;
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
