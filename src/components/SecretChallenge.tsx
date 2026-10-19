"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Download,
  X,
  Terminal,
  Sparkles,
  ShieldCheck,
  Cpu,
  Unlock,
} from "lucide-react";
import { soundManager } from "@/lib/audio";

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface SecretChallengeProps {
  className?: string;
  variant?: "pill" | "button" | "card";
}

export default function SecretChallenge({ className = "" }: SecretChallengeProps) {
  const [downloadCount, setDownloadCount] = useState<number>(47);
  const [isOpen, setIsOpen] = useState(false);
  const [verificationInput, setVerificationInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verifyError, setVerifyError] = useState(false);

  // Load counter from localStorage or default to 47
  useEffect(() => {
    try {
      const stored = localStorage.getItem("findme_download_count");
      if (stored) {
        setDownloadCount(parseInt(stored, 10));
      } else {
        localStorage.setItem("findme_download_count", "47");
      }
      const verified = localStorage.getItem("findme_verified");
      if (verified === "true") {
        setIsVerified(true);
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

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = verificationInput.trim().toUpperCase();
    if (
      clean.includes("4N1EN_SHADOW_ROOT_2026") ||
      clean.includes("FLAG{4N1EN_SHADOW_ROOT_2026}") ||
      clean.includes("4N1EN") ||
      clean.includes("SHADOW_ROOT")
    ) {
      soundManager.playTargetAcquired();
      setIsVerified(true);
      setVerifyError(false);
      try {
        localStorage.setItem("findme_verified", "true");
      } catch {}
    } else {
      soundManager.playTick();
      setVerifyError(true);
      setTimeout(() => setVerifyError(false), 2500);
    }
  };

  return (
    <>
      {/* The Secret Trigger Button in Hero */}
      <button
        onClick={handleDownloadAndTrigger}
        type="button"
        className={`group relative rounded-full pl-4 pr-3 py-2 bg-black/80 hover:bg-[#ff1a2e]/15 border border-[#ff1a2e]/40 hover:border-[#ff1a2e] text-white font-mono text-xs flex items-center gap-2.5 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,26,46,0.45)] cursor-pointer select-none ${className}`}
        title="Classified CTF Challenge. Find the hidden flag inside findme.png."
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff1a2e] opacity-80" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff1a2e]" />
        </span>

        <span className="text-[#ff1a2e] flex items-center gap-1 font-bold tracking-wider">
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
          <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="w-full max-w-xl max-h-[92vh] overflow-y-auto bg-[#09090d] border border-[#ff1a2e]/40 rounded-2xl shadow-[0_25px_80px_rgba(255,26,46,0.3)] relative text-white flex flex-col"
            >
              {/* Top Scanner Line */}
              <div className="h-1 bg-gradient-to-r from-transparent via-[#ff1a2e] to-transparent w-full sticky top-0 z-30" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  soundManager.playTick();
                  setIsOpen(false);
                }}
                className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-white/5 hover:bg-[#ff1a2e] border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Close Dossier"
              >
                <X size={15} />
              </button>

              <div className="p-5 sm:p-7 space-y-5">
                {/* Header Tag */}
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-[#ff1a2e] uppercase tracking-widest">
                  <Terminal size={14} />
                  <span>CLASSIFIED FORENSIC CHALLENGE // CTF LEVEL 0x01</span>
                </div>

                {/* Dramatic "FIND ME" Banner */}
                <div className="text-center py-4 px-2 border-y border-[#ff1a2e]/20 bg-[#ff1a2e]/5 rounded-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,26,46,0.15),transparent_70%)] pointer-events-none" />
                  <h2 className="text-5xl sm:text-6xl font-deathnote text-white tracking-widest deathnote-glow relative z-10">
                    FIND ME
                  </h2>
                  <p className="text-[11px] font-mono text-[#ff1a2e] uppercase tracking-[0.25em] mt-1 flex items-center justify-center gap-1.5 relative z-10">
                    <Sparkles size={12} />
                    <span>CRACK THE CIPHER TO UNLOCK OPERATOR COMMS</span>
                  </p>
                </div>

                {/* Mission Dossier & Artifact Intel */}
                <div className="text-xs font-mono bg-black/70 p-4 rounded-xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="flex items-center gap-2 text-white font-semibold">
                      <Cpu size={14} className="text-[#ff1a2e]" />
                      <span>findme.png downloaded</span>
                    </span>
                    <span className="text-[10px] text-[#ff1a2e] bg-[#ff1a2e]/10 px-2.5 py-0.5 rounded border border-[#ff1a2e]/30 font-bold">
                      FORMAT: FLAG&#123;...&#125;
                    </span>
                  </div>

                  <p className="text-gray-300 text-xs leading-relaxed">
                    A classified CTF flag has been injected into <code className="text-[#ff1a2e]">findme.png</code>. Analyze the artifact using your preferred forensic and steganographic inspection methods to uncover the hidden key, then submit it below to unlock operator clearance.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/5 text-[11px] text-gray-400">
                    <span>Category: <strong>Digital Forensics &amp; Steganography</strong></span>
                    <span>•</span>
                    <a
                      href="/downloads/findme.png"
                      download="findme.png"
                      className="text-[#ff1a2e] hover:underline flex items-center gap-1 font-bold"
                    >
                      <Download size={11} />
                      <span>Re-download findme.png</span>
                    </a>
                  </div>
                </div>

                {/* Direct Verification Station */}
                <div className="space-y-3">
                  {!isVerified ? (
                    <form onSubmit={handleVerify} className="p-5 rounded-xl bg-black/80 border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-200 font-bold">
                          <Unlock size={14} className="text-[#ff1a2e]" />
                          <span>Submit Extracted Flag to Verify</span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-500 uppercase">
                          LEVEL 0x01
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2.5">
                        <input
                          type="text"
                          value={verificationInput}
                          onChange={(e) => setVerificationInput(e.target.value)}
                          placeholder="FLAG{...}"
                          className="flex-1 bg-white/5 border border-white/15 focus:border-[#ff1a2e] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-gray-600 focus:outline-none uppercase"
                        />
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-[#ff1a2e] hover:bg-[#ff3344] text-white font-mono text-xs font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,26,46,0.4)] hover:shadow-[0_0_25px_rgba(255,26,46,0.6)] cursor-pointer shrink-0"
                        >
                          VERIFY FLAG
                        </button>
                      </div>

                      {verifyError && (
                        <p className="text-[11px] font-mono text-red-400 flex items-center gap-1.5 animate-pulse">
                          <X size={12} />
                          <span>Incorrect flag. Inspect findme.png further and try again!</span>
                        </p>
                      )}
                    </form>
                  ) : (
                    <div className="p-5 rounded-xl bg-green-500/10 border border-green-500/30 space-y-3.5 animate-fadeIn">
                      <div className="flex items-center justify-between text-green-400 text-xs font-mono font-bold">
                        <span className="flex items-center gap-2">
                          <ShieldCheck size={16} />
                          <span>CLEARANCE GRANTED // 100% SOLVED</span>
                        </span>
                        <span className="text-[10px] bg-green-500/20 px-2 py-0.5 rounded border border-green-500/40">
                          AUTHENTICATED
                        </span>
                      </div>

                      <div className="p-3 bg-black/60 rounded-lg border border-green-500/20 text-xs font-mono text-gray-200 space-y-1.5">
                        <p className="text-green-400 font-semibold">Flag Authenticated:</p>
                        <code className="text-green-300 font-bold block bg-black/40 p-1.5 rounded">
                          FLAG&#123;4N1EN_SHADOW_ROOT_2026&#125;
                        </code>
                        <p className="text-gray-400 text-[11px] pt-1">
                          &ldquo;You dug deep through the pixel matrix — authentic hacker spirit. Let&apos;s connect!&rdquo;
                        </p>
                      </div>

                      <a
                        href="https://www.instagram.com/4nl3n_"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundManager.playTargetAcquired()}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(236,72,153,0.35)]"
                      >
                        <InstagramIcon size={14} />
                        <span>CONNECT ON INSTAGRAM (@4nl3n_) ❯</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Footer Counter & Action Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs font-mono">
                  <div className="text-[11px] text-gray-400 text-center sm:text-left">
                    <span>DOWNLOADS: </span>
                    <span className="text-[#ff1a2e] font-bold font-mono">{downloadCount}</span>
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
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 font-mono text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>DISMISS</span>
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
