"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Download, X, Terminal, Sparkles, CheckCircle2 } from "lucide-react";
import { soundManager } from "@/lib/audio";

interface SecretChallengeProps {
  className?: string;
  variant?: "pill" | "button" | "card";
}

export default function SecretChallenge({ className = "" }: SecretChallengeProps) {
  const [downloadCount, setDownloadCount] = useState<number>(47);
  const [isOpen, setIsOpen] = useState(false);

  // Load counter from localStorage or default to 47
  useEffect(() => {
    try {
      const stored = localStorage.getItem("findme_download_count");
      if (stored) {
        setDownloadCount(parseInt(stored, 10));
      } else {
        localStorage.setItem("findme_download_count", "47");
      }
    } catch {}
  }, []);

  const handleDownloadAndTrigger = () => {
    soundManager.playTargetAcquired();
    
    // Increment download count
    const nextCount = downloadCount + 1;
    setDownloadCount(nextCount);
    try {
      localStorage.setItem("findme_download_count", String(nextCount));
    } catch {}

    // Trigger browser download for findme.png
    const link = document.createElement("a");
    link.href = "/downloads/findme.png";
    link.download = "findme.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Open the dramatic "FIND ME" modal
    setIsOpen(true);
  };

  return (
    <>
      {/* The Secret Trigger Button */}
      <button
        onClick={handleDownloadAndTrigger}
        type="button"
        className={`group relative rounded-full pl-4 pr-3 py-2 bg-black/70 hover:bg-[#ff1a2e]/15 border border-[#ff1a2e]/40 hover:border-[#ff1a2e] text-white font-mono text-xs flex items-center gap-2.5 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,26,46,0.4)] cursor-pointer select-none ${className}`}
        title="Classified steganography artifact. Hidden message inside pixels."
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff1a2e] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff1a2e]" />
        </span>

        <span className="text-[#ff1a2e] flex items-center gap-1 font-bold">
          <Eye size={13} className="group-hover:scale-110 transition-transform" />
          <span>FIND ME</span>
        </span>

        <span className="text-gray-400 group-hover:text-gray-200 text-[11px] border-l border-white/10 pl-2">
          {downloadCount} DLs
        </span>

        <span className="w-6 h-6 rounded-full bg-[#ff1a2e]/20 group-hover:bg-[#ff1a2e] flex items-center justify-center text-[#ff1a2e] group-hover:text-white transition-colors ml-0.5">
          <Download size={11} />
        </span>
      </button>

      {/* The "FIND ME" Pop-up Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="w-full max-w-lg bg-[#0a0a0f] border border-[#ff1a2e]/40 rounded-2xl shadow-[0_25px_80px_rgba(255,26,46,0.25)] overflow-hidden relative"
            >
              {/* Ominous Top Scanline & Accent */}
              <div className="h-1 bg-gradient-to-r from-transparent via-[#ff1a2e] to-transparent w-full" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  setIsOpen(false);
                }}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/5 hover:bg-[#ff1a2e] border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X size={15} />
              </button>

              <div className="p-6 sm:p-8">
                
                {/* Header Tag */}
                <div className="flex items-center gap-2 text-xs font-mono text-[#ff1a2e] uppercase tracking-widest mb-3">
                  <Terminal size={14} />
                  <span>STEGANOGRAPHY CHALLENGE // ARTIFACT ACQUIRED</span>
                </div>

                {/* Big Dramatic "FIND ME" Banner */}
                <div className="text-center py-4 my-2 border-y border-[#ff1a2e]/20 bg-[#ff1a2e]/5 rounded-xl">
                  <h2 className="text-5xl sm:text-6xl font-deathnote text-white tracking-widest deathnote-glow">
                    FIND ME
                  </h2>
                  <p className="text-[11px] font-mono text-[#ff1a2e] uppercase tracking-[0.2em] mt-1 flex items-center justify-center gap-1.5">
                    <Sparkles size={12} />
                    <span>HIDDEN CIPHER CONCEALED INSIDE PIXELS</span>
                  </p>
                </div>

                {/* Engaging Message from the Creator */}
                <div className="my-5 text-xs font-mono text-gray-300 leading-relaxed bg-black/60 p-4 rounded-xl border border-white/5">
                  <p className="text-white font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#ff1a2e]" />
                    <span>Payload Dispatched: /downloads/findme.png</span>
                  </p>
                  <p className="text-gray-400">
                    A classified forensic message is concealed inside this image. Can you analyze the bit planes, metadata, or strings to uncover what lies beneath?
                  </p>
                </div>

                {/* Tool Hints Box */}
                <div className="mb-6">
                  <span className="text-[10px] font-mono uppercase text-gray-500 tracking-wider block mb-2">
                    RECOMMENDED FORENSIC TOOLKIT:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded bg-white/[0.03] border border-white/5 text-gray-400">
                      <span className="text-[#ff1a2e] mr-1">$</span> strings findme.png
                    </div>
                    <div className="p-2 rounded bg-white/[0.03] border border-white/5 text-gray-400">
                      <span className="text-[#ff1a2e] mr-1">$</span> binwalk -e findme.png
                    </div>
                    <div className="p-2 rounded bg-white/[0.03] border border-white/5 text-gray-400">
                      <span className="text-[#ff1a2e] mr-1">$</span> zsteg -a findme.png
                    </div>
                    <div className="p-2 rounded bg-white/[0.03] border border-white/5 text-gray-400">
                      <span className="text-[#ff1a2e] mr-1">$</span> steghide extract
                    </div>
                  </div>
                </div>

                {/* Counter & Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
                  <div className="text-[11px] font-mono text-gray-400 text-center sm:text-left">
                    <span>DOWNLOADS: </span>
                    <span className="text-[#ff1a2e] font-bold font-mono text-xs">{downloadCount}</span>
                    <span className="text-gray-500 ml-1">ANALYSTS ENGAGED</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleDownloadAndTrigger}
                      className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download size={12} />
                      <span>DOWNLOAD AGAIN</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playTick();
                        setIsOpen(false);
                      }}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#ff1a2e] hover:bg-[#ff1a2e]/90 text-white font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-[0_0_20px_rgba(255,26,46,0.4)] cursor-pointer"
                    >
                      <span>I WILL FIND IT ❯</span>
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
