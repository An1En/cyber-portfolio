"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AsciiLAnimation from "./AsciiLAnimation";
import { soundManager } from "@/lib/audio";

const BOOT_LOGS = [
  "INITIALIZING OFFENSIVE KERNEL & CIPHERS...",
  "ACQUIRING SHINIGAMI TARGET SIGHT // 40s TO ROOT...",
  "CONNECTING HTB PROVING GROUNDS [ID: 019cfb0e]...",
  "INSCRIBING TARGET HOSTS INTO DOSSIER...",
  "SYSTEM INITIALIZED // ACCESS GRANTED.",
];

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    // Check if user already saw the preloader in this tab session
    try {
      const hasSeen = sessionStorage.getItem("cyber_portfolio_loaded");
      if (hasSeen === "true") {
        setLoading(false);
        return;
      }
    } catch {}

    // Fast, crisp loading sequence (1.1s total)
    const duration = 1100;
    const steps = 50;
    const intervalTime = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += 2;
      if (current > 100) current = 100;
      setProgress(current);

      const newLog = Math.min(
        Math.floor((current / 100) * BOOT_LOGS.length),
        BOOT_LOGS.length - 1
      );
      setLogIndex(newLog);

      if (current >= 100) {
        clearInterval(timer);
        try {
          soundManager.playTargetAcquired();
          sessionStorage.setItem("cyber_portfolio_loaded", "true");
        } catch {}
        setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    }, intervalTime);

    // Guaranteed fallback: never stay open longer than 1.6 seconds
    const fallbackTimeout = setTimeout(() => {
      setLoading(false);
    }, 1600);

    return () => {
      clearInterval(timer);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem("cyber_portfolio_loaded", "true");
    } catch {}
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[100] bg-[#050507] flex flex-col items-center justify-center p-4 cursor-pointer select-none"
        >
          {/* Top Bar */}
          <div className="absolute top-6 left-0 right-0 px-6 flex items-center justify-between text-[10px] font-mono text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff1a2e] animate-ping" />
              <span className="text-[#ff1a2e] font-bold">SYSTEM_LOAD // 0xDEAD</span>
            </span>
            <span className="text-gray-400 hover:text-white transition-colors border border-white/10 px-2 py-0.5 rounded">
              CLICK ANYWHERE TO ENTER ›
            </span>
          </div>

          <div className="max-w-md w-full flex flex-col items-center">
            {/* Visible ASCII Character L Lawliet */}
            <div className="mb-4 scale-95 md:scale-100">
              <AsciiLAnimation size="sm" showControls={false} />
            </div>

            {/* Title / Subtitle */}
            <div className="text-center mb-4">
              <div className="font-deathnote text-2xl md:text-3xl text-white tracking-widest deathnote-glow">
                CYBER DOSSIER
              </div>
              <p className="font-mono text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">
                INVESTIGATOR: ANLEN JEBAN (AN1EN) // L LAWLIET
              </p>
            </div>

            {/* Hairline Progress Bar */}
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden border border-white/10 p-[1px] relative mb-2.5">
              <motion.div
                className="h-full bg-gradient-to-r from-[#991b1b] via-[#dc2626] to-[#ff1a2e] rounded-full shadow-[0_0_12px_#ff1a2e]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Status readouts */}
            <div className="w-full flex items-center justify-between text-[11px] font-mono text-gray-400">
              <span className="truncate max-w-[280px]">
                › {BOOT_LOGS[logIndex]}
              </span>
              <span className="text-[#ff1a2e] font-bold text-xs ml-2">
                {progress}%
              </span>
            </div>
          </div>

          {/* Bottom attribution */}
          <div className="absolute bottom-6 left-0 right-0 text-center text-[10px] font-mono text-gray-500">
            [ INITIALIZING RED TEAM INTERFACE ]
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
