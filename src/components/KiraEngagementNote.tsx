"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Skull,
  RotateCcw,
  Send,
  Download,
  Mail,
  Volume2,
  VolumeX,
  Clock,
  Terminal,
  FastForward,
  Play,
} from "lucide-react";
import { soundManager } from "@/lib/audio";

interface InscribedRecord {
  id: string;
  name: string;
  time: string;
  timestamp: number;
  cause: string;
}

const DEFAULT_CAUSES = [
  "ESC1 Active Directory Certificate Abuse → Forest Root Takeover",
  "Zero-Click Kerberos TGT Impersonation → Domain Admin",
  "Dynamic Linker Hijack & SUID /bin/cat Abuse → System Root",
  "Heart Attack // Catastrophic Kerberoasting Total Collapse",
];

export default function KiraEngagementNote() {
  const [targetName, setTargetName] = useState("");
  const [phase, setPhase] = useState<"input" | "writing" | "cinematic" | "verdict">("input");
  
  // Writing animation state
  const [displayText, setDisplayText] = useState("");
  const [currentRecord, setCurrentRecord] = useState<InscribedRecord | null>(null);
  const [records, setRecords] = useState<InscribedRecord[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState(40);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [videoProgress, setVideoProgress] = useState({ current: 0, total: 16 });

  // References
  const textRef = useRef<HTMLHeadingElement | null>(null);
  const paperRef = useRef<HTMLDivElement | null>(null);
  const pencilRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const writingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load session records on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("kira_inscribed_records");
      if (stored) {
        setRecords(JSON.parse(stored));
      }
    } catch {}
    setSoundEnabled(soundManager.isEnabled());
  }, []);

  // Update pencil position dynamically to match text end
  const updatePencilPosition = () => {
    if (!textRef.current || !pencilRef.current || !paperRef.current) return;
    const textRect = textRef.current.getBoundingClientRect();
    const paperRect = paperRef.current.getBoundingClientRect();

    // Calculate relative coordinates inside the paper container
    const relativeX = textRect.right - paperRect.left;
    const relativeY = textRect.top - paperRect.top + textRect.height * 0.2;

    pencilRef.current.style.left = `${relativeX - 15}px`;
    pencilRef.current.style.top = `${relativeY - 70}px`;
  };

  const handleStartWriting = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = targetName.trim();
    if (!clean) return;

    soundManager.playTick();
    setPhase("writing");
    setDisplayText("");

    const chosenCause = DEFAULT_CAUSES[Math.floor(Math.random() * DEFAULT_CAUSES.length)];
    const newRecord: InscribedRecord = {
      id: `KIRA-${Date.now().toString().slice(-4)}`,
      name: clean,
      time: new Date().toLocaleTimeString(),
      timestamp: Date.now(),
      cause: chosenCause,
    };
    setCurrentRecord(newRecord);

    // Initial delay before pen touches the parchment
    setTimeout(() => {
      let charIndex = 0;
      if (pencilRef.current) {
        pencilRef.current.style.opacity = "1";
      }

      writingTimerRef.current = setInterval(() => {
        if (charIndex < clean.length) {
          charIndex++;
          setDisplayText(clean.substring(0, charIndex));
          soundManager.playPenScratch();
          setTimeout(updatePencilPosition, 10);
        } else {
          if (writingTimerRef.current) clearInterval(writingTimerRef.current);
          
          // Complete writing sequence: trigger cinematic flash
          setTimeout(() => {
            if (pencilRef.current) {
              pencilRef.current.style.opacity = "0";
            }
            triggerCinematicTransition(newRecord);
          }, 1000);
        }
      }, 85);
    }, 600);
  };

  const triggerCinematicTransition = (rec: InscribedRecord) => {
    soundManager.playHeartbeat();
    setPhase("cinematic");

    // Attempt full video playback with audio
    setTimeout(() => {
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.volume = soundEnabled ? 0.85 : 0;
        video.muted = !soundEnabled;

        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // If browser policy blocks unmuted autoplay, retry muted
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {
                // If completely blocked, advance safely
                setTimeout(() => finishToVerdict(rec), 3000);
              });
            }
          });
        }
      }
    }, 60);

    // Watchdog fallback: Allow full 16.0s video plus buffer before safety auto-advance
    setTimeout(() => {
      setPhase((currentPhase) => {
        if (currentPhase === "cinematic") {
          finishToVerdict(rec);
        }
        return currentPhase;
      });
    }, 18000);
  };

  const finishToVerdict = (rec: InscribedRecord) => {
    soundManager.playChime();
    setPhase("verdict");
    setSecondsRemaining(40);

    // Persist into session records
    const updated = [rec, ...records.filter((r) => r.name !== rec.name)].slice(0, 8);
    setRecords(updated);
    try {
      sessionStorage.setItem("kira_inscribed_records", JSON.stringify(updated));
    } catch {}

    // 40-second countdown (Death Note rule)
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    countdownTimerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRewrite = () => {
    if (writingTimerRef.current) clearInterval(writingTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    soundManager.playTick();
    setTargetName("");
    setDisplayText("");
    setPhase("input");
  };

  const toggleSound = () => {
    const val = soundManager.toggle();
    setSoundEnabled(val);
  };

  const handleDownloadDossier = () => {
    if (!currentRecord) return;
    const content = `=====================================================
DEATH NOTE // FORENSIC TARGET AUDIT DOSSIER
OPERATOR: ANLEN JEBAN (AN1EN) // AD-RTS / CRTA
=====================================================

TARGET IDENTIFIER    : ${currentRecord.name}
AUDIT TIMESTAMP      : ${new Date(currentRecord.timestamp).toISOString()}
ATTACK VECTOR        : ${currentRecord.cause}
RULE OF EXECUTION    : 40-SECOND POSTURE COLLAPSE
STATUS               : COMPROMISED // ROOT PRIVILEGE ACQUIRED
VERDICT              : Justice has been served. All credentials harvested.

DISPATCH POINT       : anlenjeban7@gmail.com
SECURITY DISCLOSURE  : Non-destructive ethical simulation completed.
=====================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deathnote-target-${currentRecord.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="py-24 px-4 bg-[#050507] border-t border-white/5 relative overflow-hidden" id="inscribe">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,26,46,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Floating Sound Toggle */}
      <div className="max-w-4xl mx-auto flex justify-end mb-4">
        <button
          onClick={toggleSound}
          type="button"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[11px] font-mono text-gray-400 hover:text-[#ff1a2e] hover:border-[#ff1a2e]/40 transition-all"
          title="Toggle synthesized pen sound"
        >
          {soundEnabled ? <Volume2 size={13} className="text-[#ff1a2e]" /> : <VolumeX size={13} />}
          <span>{soundEnabled ? "AUDIO ON" : "AUDIO MUTED"}</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff1a2e]/10 border border-[#ff1a2e]/30 text-xs font-mono text-[#ff1a2e] mb-3 uppercase tracking-widest">
            <Skull size={13} />
            <span>KIRA NOTEBOOK // TARGET EXECUTION ENGINE</span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-deathnote tracking-wider text-white mb-3">
            DEATH NOTE
          </h2>

          <p className="font-mono text-xs sm:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
            The human or system whose name is written in this note shall be rooted. Enter the name of the target you wish to destroy.
          </p>
        </div>

        {/* ========================================================
            MAIN INTERACTIVE WORKSPACE
           ======================================================== */}
        <div className="double-bezel relative overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
          <div className="double-bezel-inner bg-[#0a0a0f] relative overflow-hidden min-h-[460px] flex flex-col justify-center">

            {/* Subtle red margin line resembling notebook page */}
            <div className="absolute top-0 bottom-0 left-6 sm:left-12 w-[1px] bg-[#ff1a2e]/25 pointer-events-none" />
            <div className="absolute top-0 bottom-0 left-7 sm:left-14 w-[1px] bg-[#ff1a2e]/10 pointer-events-none" />

            {/* --------------------------------------------------------
                PHASE 1: ENTER TARGET NAME (Clean, direct & ominous)
               -------------------------------------------------------- */}
            {phase === "input" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-8 sm:p-14 pl-12 sm:pl-24"
              >
                <div className="mb-8">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500 block mb-2">
                    RULE I // EXECUTION PROTOCOL
                  </span>
                  <h3 className="text-xl sm:text-2xl font-deathnote text-gray-200 tracking-wide">
                    HOW TO USE: TYPE TARGET NAME
                  </h3>
                  <p className="text-xs font-mono text-gray-400 mt-1">
                    Once inscribed, the penetration testing sequence begins in 40 seconds.
                  </p>
                </div>

                <form onSubmit={handleStartWriting} className="space-y-6 max-w-xl">
                  <div className="relative">
                    <input
                      type="text"
                      value={targetName}
                      onChange={(e) => setTargetName(e.target.value)}
                      placeholder="NAME OF THE TARGET TO DESTROY..."
                      maxLength={32}
                      autoFocus
                      required
                      className="w-full bg-transparent border-b-2 border-white/20 focus:border-[#ff1a2e] pb-3 text-lg sm:text-2xl font-mono text-white placeholder:text-gray-600 focus:outline-none transition-all tracking-wider"
                    />
                    <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-gray-500">
                      <span>Max 32 characters • Real-time ink animation</span>
                      <span>{targetName.length}/32</span>
                    </div>
                  </div>

                  {/* Preset Suggestions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-[10px] font-mono text-gray-500 mr-1">QUICK INSCRIBE:</span>
                    {["Domain Controller", "dc01.corp.local", "Exchange Server", "Rival Operator"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setTargetName(preset)}
                        className="text-[11px] font-mono px-2.5 py-1 rounded bg-white/5 hover:bg-[#ff1a2e]/20 text-gray-400 hover:text-white border border-white/5 transition-all"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      disabled={!targetName.trim()}
                      className="flex-1 group py-4 px-8 rounded-xl bg-[#ff1a2e] hover:bg-[#ff1a2e]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(255,26,46,0.4)] hover:shadow-[0_0_35px_rgba(255,26,46,0.7)] flex items-center justify-center gap-3 cursor-pointer"
                    >
                      <Skull size={16} />
                      <span>INSCRIBE IN DEATH NOTE</span>
                      <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* --------------------------------------------------------
                PHASE 2: REAL-TIME NOTEBOOK WRITING ANIMATION
               -------------------------------------------------------- */}
            {phase === "writing" && (
              <div
                ref={paperRef}
                className="relative w-full h-[480px] bg-[#fbf9f4] text-black overflow-hidden flex flex-col items-center justify-center select-none"
                style={{
                  backgroundImage: "url('/images/kira/paper1.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Horizontal lined rules */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: "linear-gradient(rgba(0,0,0,0.12) 1px, transparent 1px)",
                    backgroundSize: "100% 38px",
                  }}
                />

                {/* Left Margin Line */}
                <div className="absolute top-0 bottom-0 left-12 sm:left-20 w-[2px] bg-red-400/40 pointer-events-none" />

                {/* Status Ticker at Top Right */}
                <div className="absolute top-4 right-6 font-mono text-[11px] text-gray-700 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span>WRITING IN PROGRESS...</span>
                </div>

                {/* Center Writing Area */}
                <div className="relative px-8 sm:px-16 text-center max-w-3xl z-10">
                  <h1
                    ref={textRef}
                    className="font-cursive text-5xl sm:text-7xl md:text-8xl text-neutral-900 tracking-wide font-normal leading-tight inline-block"
                    style={{
                      textShadow: "1px 1px 1px rgba(0,0,0,0.15)",
                    }}
                  >
                    {displayText}
                  </h1>
                </div>

                {/* Floating Pencil Moving in Real-Time */}
                <img
                  ref={pencilRef}
                  src="/images/kira/pencil.png"
                  alt="Writing Pencil"
                  className="absolute pointer-events-none transition-all duration-75 z-20"
                  style={{
                    width: "clamp(120px, 16vw, 220px)",
                    height: "auto",
                    opacity: 0,
                    filter: "drop-shadow(4px 10px 8px rgba(0,0,0,0.3))",
                    transform: "rotate(-10deg)",
                  }}
                />

                {/* Scratch Audio Status */}
                <div className="absolute bottom-4 left-6 sm:left-14 font-mono text-[10px] text-gray-500 uppercase">
                  <span>AUDIO SYNTHESIS: WEBAUDIO SCRATCH ACTIVE</span>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------
                PHASE 3: CINEMATIC RED STRIKE / VIDEO FLASH
               -------------------------------------------------------- */}
            {/* --------------------------------------------------------
                PHASE 3: CINEMATIC VIDEO (16s FULL CUT // FULLSCREEN)
               -------------------------------------------------------- */}
            {phase === "cinematic" && (
              <div className="fixed inset-0 z-[120] bg-black flex items-center justify-center overflow-hidden">
                <video
                  ref={videoRef}
                  src="/images/kira/kill2.mp4"
                  playsInline
                  autoPlay
                  preload="auto"
                  className="w-full h-full object-cover select-none"
                  onTimeUpdate={(e) => {
                    const video = e.currentTarget;
                    setVideoProgress({
                      current: video.currentTime,
                      total: video.duration || 16,
                    });
                  }}
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget;
                    setVideoProgress((prev) => ({
                      ...prev,
                      total: video.duration || 16,
                    }));
                  }}
                  onEnded={() => currentRecord && finishToVerdict(currentRecord)}
                />

                {/* Top Right Skip Button */}
                <button
                  type="button"
                  onClick={() => currentRecord && finishToVerdict(currentRecord)}
                  className="absolute top-6 right-6 z-50 px-4 py-2 rounded-full bg-black/80 hover:bg-[#ff1a2e] border border-white/20 hover:border-[#ff1a2e] text-white font-mono text-xs tracking-wider uppercase transition-all backdrop-blur-md flex items-center gap-2 shadow-[0_4px_25px_rgba(0,0,0,0.8)] cursor-pointer"
                >
                  <FastForward size={14} />
                  <span>SKIP CINEMATIC</span>
                </button>

                {/* Bottom Timeline & Subtitle */}
                <div className="absolute bottom-6 left-6 right-6 z-40 max-w-xl mx-auto flex flex-col items-center gap-2">
                  <div className="font-deathnote text-sm sm:text-base text-white/90 tracking-[0.25em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] uppercase">
                    KIRA EXECUTION PROTOCOL IN EFFECT
                  </div>
                  {currentRecord && (
                    <div className="text-xs font-mono text-[#ff1a2e] tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(255,26,46,0.6)]">
                      TARGET: {currentRecord.name}
                    </div>
                  )}

                  {/* Progress timeline bar */}
                  <div className="w-full flex items-center gap-3 font-mono text-[11px] text-gray-400 mt-1">
                    <span className="w-8 text-right">{Math.floor(videoProgress.current)}s</span>
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#ff1a2e] transition-all duration-100"
                        style={{
                          width: `${(videoProgress.current / (videoProgress.total || 16)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-8">{Math.floor(videoProgress.total || 16)}s</span>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------
                PHASE 4: TARGET VERDICT & ENGAGEMENT DOSSIER
               -------------------------------------------------------- */}
            {phase === "verdict" && currentRecord && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 sm:p-12 pl-12 sm:pl-24"
              >
                {/* Header Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-white/10 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff1a2e] animate-ping" />
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#ff1a2e]">
                      EXECUTION VERDICT SEALED // {currentRecord.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                    <Clock size={13} className="text-[#ff1a2e]" />
                    <span>TIME TO ROOT: </span>
                    <span className="text-white font-bold font-mono">
                      {secondsRemaining > 0 ? `${secondsRemaining} SECONDS` : "EXPIRED // ROOTED"}
                    </span>
                  </div>
                </div>

                {/* Target Name Presentation */}
                <div className="mb-6">
                  <span className="text-[11px] font-mono text-gray-500 uppercase tracking-widest block mb-1">
                    TARGET INSCRIBED:
                  </span>
                  <div className="text-3xl sm:text-5xl font-deathnote text-white tracking-wider deathnote-glow">
                    {currentRecord.name}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-black/50 border border-white/5">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">
                      CAUSE OF DESTRUCTION:
                    </span>
                    <span className="text-xs font-mono text-gray-200 block leading-relaxed">
                      {currentRecord.cause}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-black/50 border border-white/5">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">
                      CURRENT AUDIT STATUS:
                    </span>
                    <span className="text-xs font-mono text-[#ff1a2e] font-bold tracking-wider flex items-center gap-2">
                      <Skull size={13} />
                      <span>COMPROMISED // TARGET ROOTED</span>
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 mt-1 block">
                      Forensic stamp: {currentRecord.time} UTC
                    </span>
                  </div>
                </div>

                {/* Justice Line */}
                <div className="p-4 rounded-xl bg-[#ff1a2e]/10 border border-[#ff1a2e]/30 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs font-mono text-gray-300">
                    <span className="text-[#ff1a2e] font-deathnote text-base mr-2">JUSTICE:</span>
                    Justice has been served. All credentials harvested under ethical adversary rules.
                  </div>
                  <div className="font-deathnote text-sm text-[#ff1a2e] tracking-widest whitespace-nowrap">
                    AN1EN // 0xDEAD
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleRewrite}
                    type="button"
                    className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-semibold tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    <span>REWRITE ANOTHER TARGET</span>
                  </button>

                  <button
                    onClick={() => currentRecord && triggerCinematicTransition(currentRecord)}
                    type="button"
                    className="py-3 px-4 rounded-xl bg-white/10 hover:bg-[#ff1a2e]/30 border border-white/10 text-white font-mono text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Play size={13} className="text-[#ff1a2e]" />
                    <span>REPLAY CINEMATIC (16s)</span>
                  </button>

                  <a
                    href={`mailto:anlenjeban7@gmail.com?subject=${encodeURIComponent(
                      `[Target Audit Engagement] ${currentRecord.name}`
                    )}&body=${encodeURIComponent(
                      `Target: ${currentRecord.name}\nVector: ${currentRecord.cause}\nTimestamp: ${currentRecord.time}\n\nPlease proceed with ethical penetration testing scoping.`
                    )}`}
                    className="py-3 px-5 rounded-xl bg-[#ff1a2e] hover:bg-[#ff1a2e]/90 text-white font-mono text-xs font-bold tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,26,46,0.4)]"
                  >
                    <Mail size={14} />
                    <span>DISPATCH TO ANLEN (AN1EN)</span>
                  </a>

                  <button
                    onClick={handleDownloadDossier}
                    type="button"
                    className="py-3 px-4 rounded-xl bg-black/60 hover:bg-white/5 border border-white/10 text-gray-300 hover:text-white font-mono text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Download size={13} />
                    <span>SAVE DOSSIER</span>
                  </button>
                </div>
              </motion.div>
            )}

          </div>
        </div>

        {/* ========================================================
            PREVIOUSLY INSCRIBED ARCHIVE LEDGER
           ======================================================== */}
        {records.length > 0 && (
          <div className="mt-8 p-6 rounded-2xl bg-black/40 border border-white/5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5 text-xs font-mono">
              <span className="text-gray-400 flex items-center gap-2">
                <Terminal size={13} className="text-[#ff1a2e]" />
                SESSION INSCRIBED ARCHIVE
              </span>
              <span className="text-[#ff1a2e] font-mono">
                TOTAL TARGETS RECORDED: {records.length}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {records.map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#ff1a2e]/30 transition-all text-xs font-mono"
                >
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                    <span>{r.id}</span>
                    <span>{r.time}</span>
                  </div>
                  <div className="text-sm font-deathnote text-white truncate mb-1">
                    {r.name}
                  </div>
                  <div className="text-[10px] text-[#ff1a2e] truncate">
                    {r.cause}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
