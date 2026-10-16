"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Download,
  X,
  Terminal,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
  Key,
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
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"kali" | "devglan" | "verify">("kali");
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

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    soundManager.playTick();
    setTimeout(() => setCopiedCode(null), 2000);
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

  const pythonOneLiner = `python3 -c "from PIL import Image; img=Image.open('findme.png'); p=img.load(); b=[c&1 for y in range(img.size[1]) for x in range(img.size[0]) for c in p[x,y][:3]]; d=bytes([sum(b[i+j]<<(7-j) for j in range(8)) for i in range(0,35000,8)]); print(d[12:12+int.from_bytes(d[8:12],'big')].decode('utf-8','ignore'))"`;

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

                {/* Artifact Transmission Status */}
                <div className="text-xs font-mono bg-black/70 p-3.5 rounded-xl border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="flex items-center gap-2 text-white font-semibold">
                      <Cpu size={14} className="text-[#ff1a2e]" />
                      <span>findme.png downloaded</span>
                    </span>
                    <span className="text-[11px] text-[#ff1a2e] bg-[#ff1a2e]/10 px-2 py-0.5 rounded border border-[#ff1a2e]/30">
                      FLAG: FLAG&#123;...&#125;
                    </span>
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    A secret CTF flag has been injected into <code className="text-[#ff1a2e]">findme.png</code>. Use common Kali Linux forensics tools or the DevGlan decoder to extract it, then submit it below to unlock direct communication!
                  </p>
                </div>

                {/* Navigation Tabs */}
                <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      setActiveTab("kali");
                    }}
                    className={`py-2 px-2 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === "kali"
                        ? "bg-[#ff1a2e] text-white font-bold shadow-md shadow-[#ff1a2e]/30"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Terminal size={12} />
                    <span>Kali Tools</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      setActiveTab("devglan");
                    }}
                    className={`py-2 px-2 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === "devglan"
                        ? "bg-[#ff1a2e] text-white font-bold shadow-md shadow-[#ff1a2e]/30"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <ExternalLink size={12} />
                    <span>DevGlan Web</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      setActiveTab("verify");
                    }}
                    className={`py-2 px-2 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === "verify"
                        ? "bg-[#ff1a2e] text-white font-bold shadow-md shadow-[#ff1a2e]/30"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <ShieldCheck size={12} />
                    <span>Verify Flag</span>
                  </button>
                </div>

                {/* Tab 1: Kali Linux Forensic Tools */}
                {activeTab === "kali" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="p-4 rounded-xl bg-black/80 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono text-gray-300">
                        <span className="flex items-center gap-2 font-bold text-white">
                          <Terminal size={14} className="text-[#ff1a2e]" />
                          <span>Common Kali Linux Commands</span>
                        </span>
                        <span className="text-[10px] text-green-400 border border-green-500/30 px-2 py-0.5 rounded bg-green-500/10">
                          EASY TO CRACK
                        </span>
                      </div>

                      <p className="text-[11px] font-mono text-gray-400 leading-relaxed">
                        Open your terminal in the directory where you downloaded <code className="text-white">findme.png</code> and run any of these standard commands:
                      </p>

                      {/* Tool 1: strings */}
                      <div className="p-2.5 bg-[#050508] rounded-lg border border-white/5 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                          <span>Method 1: String Inspection</span>
                          <button
                            type="button"
                            onClick={() => copyText("strings findme.png | grep FLAG", "strings")}
                            className="text-[#ff1a2e] hover:text-white flex items-center gap-1 text-[10px] cursor-pointer"
                          >
                            {copiedCode === "strings" ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                            <span>{copiedCode === "strings" ? "COPIED" : "COPY"}</span>
                          </button>
                        </div>
                        <code className="text-xs font-mono text-green-400 block select-all">
                          strings findme.png | grep FLAG
                        </code>
                      </div>

                      {/* Tool 2: exiftool */}
                      <div className="p-2.5 bg-[#050508] rounded-lg border border-white/5 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                          <span>Method 2: Metadata Analysis</span>
                          <button
                            type="button"
                            onClick={() => copyText("exiftool findme.png", "exiftool")}
                            className="text-[#ff1a2e] hover:text-white flex items-center gap-1 text-[10px] cursor-pointer"
                          >
                            {copiedCode === "exiftool" ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                            <span>{copiedCode === "exiftool" ? "COPIED" : "COPY"}</span>
                          </button>
                        </div>
                        <code className="text-xs font-mono text-green-400 block select-all">
                          exiftool findme.png | grep -E &quot;Flag|Comment&quot;
                        </code>
                      </div>

                      {/* Tool 3: Python one liner */}
                      <div className="p-2.5 bg-[#050508] rounded-lg border border-white/5 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                          <span>Method 3: Raw LSB Pixel Unpacker</span>
                          <button
                            type="button"
                            onClick={() => copyText(pythonOneLiner, "python")}
                            className="text-[#ff1a2e] hover:text-white flex items-center gap-1 text-[10px] cursor-pointer"
                          >
                            {copiedCode === "python" ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                            <span>{copiedCode === "python" ? "COPIED" : "COPY"}</span>
                          </button>
                        </div>
                        <code className="text-[10px] font-mono text-green-400 block truncate">
                          python3 -c &quot;from PIL import Image...&quot;
                        </code>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab 2: DevGlan Online Decoder Hint & Station */}
                {activeTab === "devglan" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="p-4 rounded-xl bg-gradient-to-br from-[#ff1a2e]/10 to-transparent border border-[#ff1a2e]/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Key size={15} className="text-[#ff1a2e]" />
                          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                            Online Web Decoder
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#ff1a2e] uppercase border border-[#ff1a2e]/40 px-2 py-0.5 rounded-full bg-black/40">
                          No Install Needed
                        </span>
                      </div>

                      <p className="text-xs font-mono text-gray-300 leading-relaxed">
                        Don&apos;t have Kali Linux handy? Extract the flag directly in your browser using the online DevGlan Steganography tool:
                      </p>

                      <div className="space-y-2 text-[11px] font-mono text-gray-300 bg-black/60 p-3 rounded-lg border border-white/5">
                        <div className="flex items-start gap-2">
                          <span className="text-[#ff1a2e] font-bold">1.</span>
                          <span>Click the link below to open <strong>DevGlan Steganography</strong>.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-[#ff1a2e] font-bold">2.</span>
                          <span>Select the <strong>&quot;Decode / Extract&quot;</strong> section &amp; upload <code className="text-[#ff1a2e]">findme.png</code>.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-[#ff1a2e] font-bold">3.</span>
                          <span><strong>Leave passphrase blank</strong> &amp; click <strong>&quot;Extract Message&quot;</strong> to reveal the flag!</span>
                        </div>
                      </div>

                      {/* Launch Button */}
                      <a
                        href="https://www.devglan.com/online-tools/image-steganography-online"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundManager.playTick()}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#ff1a2e] hover:bg-[#ff1a2e]/90 text-white font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,26,46,0.35)] group"
                      >
                        <span>OPEN DEVGLAN DECODER STATION</span>
                        <ExternalLink size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  </motion.div>
                )}

                {/* Tab 3: Verify Extracted Flag */}
                {activeTab === "verify" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    {!isVerified ? (
                      <form onSubmit={handleVerify} className="p-4 rounded-xl bg-black/80 border border-white/10 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
                          <Unlock size={14} className="text-[#ff1a2e]" />
                          <span>Submit CTF Flag to Verify</span>
                        </div>

                        <p className="text-[11px] font-mono text-gray-400 leading-relaxed">
                          Enter the flag you extracted from <code className="text-white">findme.png</code> to confirm your solve and unlock operator communication:
                        </p>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={verificationInput}
                            onChange={(e) => setVerificationInput(e.target.value)}
                            placeholder="FLAG{...}"
                            className="flex-1 bg-white/5 border border-white/15 focus:border-[#ff1a2e] rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-gray-600 focus:outline-none uppercase"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#ff1a2e] hover:bg-[#ff1a2e]/90 text-white font-mono text-xs font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(255,26,46,0.3)] cursor-pointer"
                          >
                            VERIFY
                          </button>
                        </div>

                        {verifyError && (
                          <p className="text-[11px] font-mono text-red-400 flex items-center gap-1.5 animate-pulse">
                            <X size={12} />
                            <span>Incorrect flag. Inspect findme.png with strings, exiftool, or DevGlan!</span>
                          </p>
                        )}
                      </form>
                    ) : (
                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 space-y-3 animate-fadeIn">
                        <div className="flex items-center justify-between text-green-400 text-xs font-mono font-bold">
                          <span className="flex items-center gap-2">
                            <ShieldCheck size={16} />
                            <span>CLEARANCE GRANTED // 100% SOLVED</span>
                          </span>
                          <span className="text-[10px] bg-green-500/20 px-2 py-0.5 rounded border border-green-500/40">
                            FLAG VERIFIED
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
                  </motion.div>
                )}

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
