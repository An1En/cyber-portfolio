"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Search,
  X,
  BookOpen,
} from "lucide-react";
import { soundManager } from "@/lib/audio";
import {
  InscribedRecord,
  DEFAULT_CAUSES,
  INITIAL_INSCRIBED_ARCHIVE,
} from "@/lib/deathnote";

export type { InscribedRecord };
export { DEFAULT_CAUSES, INITIAL_INSCRIBED_ARCHIVE };

export default function KiraEngagementNote() {
  const [targetName, setTargetName] = useState("");
  const [phase, setPhase] = useState<"input" | "writing" | "cinematic" | "verdict">("input");
  
  // Writing animation state
  const [displayText, setDisplayText] = useState("");
  const [currentRecord, setCurrentRecord] = useState<InscribedRecord | null>(null);
  const [records, setRecords] = useState<InscribedRecord[]>(INITIAL_INSCRIBED_ARCHIVE);
  const [secondsRemaining, setSecondsRemaining] = useState(40);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [videoProgress, setVideoProgress] = useState({ current: 0, total: 16 });
  const [videoMuted, setVideoMuted] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Archive Modal State
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [archiveSearch, setArchiveSearch] = useState("");

  // References
  const textRef = useRef<HTMLHeadingElement | null>(null);
  const paperRef = useRef<HTMLDivElement | null>(null);
  const pencilRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const writingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const watchdogTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch records from server API & sync with local storage
  const syncRecordsFromServer = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch("/api/deathnote", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.records) && data.records.length > 0) {
          setRecords(data.records);
          try {
            localStorage.setItem("kira_inscribed_records", JSON.stringify(data.records));
          } catch {}
        }
      }
    } catch (err) {
      console.warn("Could not sync with /api/deathnote:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Mount: Load localStorage immediately, then fetch from server, and setup auto-update polling
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kira_inscribed_records");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecords(parsed);
        }
      }
    } catch {}

    // Fetch latest records on load
    syncRecordsFromServer();

    // Auto-update itself every 7 seconds so newly inscribed names appear in real time
    const pollTimer = setInterval(() => {
      syncRecordsFromServer();
    }, 7000);

    setSoundEnabled(soundManager.isEnabled());

    return () => {
      clearInterval(pollTimer);
    };
  }, []);

  // Re-sync when modal opens
  useEffect(() => {
    if (isArchiveModalOpen) {
      syncRecordsFromServer();
    }
  }, [isArchiveModalOpen]);

  // Filtered records for the ledger modal
  const filteredRecords = useMemo(() => {
    const q = archiveSearch.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.cause.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
    );
  }, [records, archiveSearch]);

  // Update pencil position dynamically to match text end
  const updatePencilPosition = () => {
    if (!textRef.current || !pencilRef.current || !paperRef.current) return;
    const textRect = textRef.current.getBoundingClientRect();
    const paperRect = paperRef.current.getBoundingClientRect();

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

    // Prime video inside user gesture
    const video = videoRef.current;
    if (video) {
      try {
        video.playsInline = true;
        video.muted = true;
        video.defaultMuted = true;
        video.currentTime = 0;
        video.load();
      } catch (err) {
        console.warn("Video priming deferred:", err);
      }
    }

    setPhase("writing");
    setDisplayText("");

    const chosenCause = DEFAULT_CAUSES[Math.floor(Math.random() * DEFAULT_CAUSES.length)];
    const newRecord: InscribedRecord = {
      id: `KIRA-${Date.now().toString().slice(-4)}`,
      name: clean,
      time: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
      timestamp: Date.now(),
      cause: chosenCause,
    };
    setCurrentRecord(newRecord);

    // 1. Instantly save and update local UI (optimistic update)
    const updated = [newRecord, ...records.filter((r) => r.name.toLowerCase() !== clean.toLowerCase())];
    setRecords(updated);
    try {
      localStorage.setItem("kira_inscribed_records", JSON.stringify(updated));
    } catch {}

    // 2. Persist to server backend API so it is saved permanently & updates itself across users
    fetch("/api/deathnote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: clean, cause: chosenCause }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.records) && data.records.length > 0) {
          setRecords(data.records);
          try {
            localStorage.setItem("kira_inscribed_records", JSON.stringify(data.records));
          } catch {}
          if (data.record) {
            setCurrentRecord(data.record);
          }
        }
      })
      .catch((err) => {
        console.warn("Backend save deferred, local save active:", err);
      });

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

  const triggerCinematicTransition = (rec: InscribedRecord, isDirectUserGesture = false) => {
    soundManager.playHeartbeat();
    setPhase("cinematic");
    setShowPlayOverlay(false);

    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current);
    }

    // Watchdog fallback (allow 22s buffer so video is never cut off prematurely)
    watchdogTimerRef.current = setTimeout(() => {
      setPhase((currentPhase) => {
        if (currentPhase === "cinematic" && (!videoRef.current || videoRef.current.paused || videoRef.current.ended)) {
          finishToVerdict(rec);
        }
        return currentPhase;
      });
    }, 22000);

    setTimeout(() => {
      const video = videoRef.current;
      if (!video) return;

      // Enforce iOS WebKit inline playback attributes
      video.playsInline = true;
      video.setAttribute("playsinline", "true");
      video.setAttribute("webkit-playsinline", "true");
      video.setAttribute("x5-playsinline", "true");
      video.currentTime = 0;

      // 1. Direct user tap playback (e.g. Replay button): user activation is fresh
      if (soundEnabled && isDirectUserGesture) {
        video.muted = false;
        video.defaultMuted = false;
        setVideoMuted(false);
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setShowPlayOverlay(false))
            .catch(() => {
              video.muted = true;
              video.defaultMuted = true;
              setVideoMuted(true);
              video
                .play()
                .then(() => setShowPlayOverlay(false))
                .catch(() => setShowPlayOverlay(true));
            });
        }
        return;
      }

      // 2. Normal execution flow (writing finished after ~2.6s):
      // On laptop, unmuted play() will succeed.
      // On phone, mobile browser policy rejects unmuted autoplay without recent gesture.
      // Therefore, if unmuted is rejected, IMMEDIATELY play muted without hesitation!
      if (soundEnabled) {
        video.muted = false;
        video.defaultMuted = false;
        setVideoMuted(false);

        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Successfully playing unmuted (laptop/desktop)
              setShowPlayOverlay(false);
            })
            .catch(() => {
              // Mobile browser policy blocked audio autoplay:
              // Immediately switch to muted autoplay so playback begins instantly without freezing!
              if (videoRef.current) {
                videoRef.current.muted = true;
                videoRef.current.defaultMuted = true;
                setVideoMuted(true);
                videoRef.current
                  .play()
                  .then(() => {
                    setShowPlayOverlay(false);
                  })
                  .catch((err) => {
                    console.warn("Muted play blocked:", err);
                    setShowPlayOverlay(true);
                  });
              }
            });
        }
      } else {
        video.muted = true;
        video.defaultMuted = true;
        setVideoMuted(true);
        video
          .play()
          .then(() => {
            setShowPlayOverlay(false);
          })
          .catch(() => {
            setShowPlayOverlay(true);
          });
      }
    }, 60);
  };

  // Tap anywhere on video to toggle sound / unmute instantly
  const handleScreenTap = (e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;

    const video = videoRef.current;
    if (!video) return;

    if (video.muted) {
      video.muted = false;
      video.defaultMuted = false;
      setVideoMuted(false);
      soundManager.playTick();
    } else {
      video.muted = true;
      video.defaultMuted = true;
      setVideoMuted(true);
      soundManager.playTick();
    }
  };

  const handleManualPlay = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const video = videoRef.current;
    if (video) {
      video.muted = !soundEnabled;
      video.defaultMuted = !soundEnabled;
      setVideoMuted(!soundEnabled);
      video
        .play()
        .then(() => {
          setShowPlayOverlay(false);
        })
        .catch(() => {
          video.muted = true;
          video.defaultMuted = true;
          setVideoMuted(true);
          video.play().then(() => {
            setShowPlayOverlay(false);
          });
        });
    }
  };

  const toggleVideoMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (video) {
      const next = !video.muted;
      video.muted = next;
      video.defaultMuted = next;
      setVideoMuted(next);
      soundManager.playTick();
    }
  };

  const finishToVerdict = (rec: InscribedRecord) => {
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
    soundManager.playChime();
    setPhase("verdict");
    setSecondsRemaining(40);

    // Ensure state and storage include the record
    const updated = [rec, ...records.filter((r) => r.name.toLowerCase() !== rec.name.toLowerCase())];
    setRecords(updated);
    try {
      localStorage.setItem("kira_inscribed_records", JSON.stringify(updated));
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
    if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    soundManager.playTick();
    setTargetName("");
    setDisplayText("");
    setPhase("input");
  };

  const toggleSound = () => {
    const val = soundManager.toggle();
    setSoundEnabled(val);
  };

  const handleSelectFromArchive = (rec: InscribedRecord) => {
    setTargetName(rec.name);
    setIsArchiveModalOpen(false);
    soundManager.playTick();

    // Prime video on archive click
    const video = videoRef.current;
    if (video) {
      try {
        video.muted = true;
        video.defaultMuted = true;
        video.currentTime = 0;
        video.load();
      } catch {}
    }
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

      {/* Floating Controls Bar */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-4 gap-3">
        <button
          onClick={() => {
            soundManager.playTick();
            setIsArchiveModalOpen(true);
          }}
          type="button"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff1a2e]/10 hover:bg-[#ff1a2e]/20 border border-[#ff1a2e]/30 text-xs font-mono text-[#ff1a2e] transition-all hover:scale-105 cursor-pointer shadow-[0_0_15px_rgba(255,26,46,0.15)]"
        >
          <BookOpen size={13} />
          <span>VIEW ALL INSCRIBED TARGETS ({records.length})</span>
        </button>

        <button
          onClick={toggleSound}
          type="button"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 text-[11px] font-mono text-gray-400 hover:text-[#ff1a2e] hover:border-[#ff1a2e]/40 transition-all cursor-pointer"
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
                        className="text-[11px] font-mono px-2.5 py-1 rounded bg-white/5 hover:bg-[#ff1a2e]/20 text-gray-400 hover:text-white border border-white/5 transition-all cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={!targetName.trim()}
                      className="flex-1 group py-4 px-8 rounded-xl bg-[#ff1a2e] hover:bg-[#ff1a2e]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(255,26,46,0.4)] hover:shadow-[0_0_35px_rgba(255,26,46,0.7)] flex items-center justify-center gap-3 cursor-pointer"
                    >
                      <Skull size={16} />
                      <span>INSCRIBE IN DEATH NOTE</span>
                      <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playTick();
                        setIsArchiveModalOpen(true);
                      }}
                      className="py-4 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <BookOpen size={14} className="text-[#ff1a2e]" />
                      <span>ALL INSCRIBED ({records.length})</span>
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
                PHASE 3: CINEMATIC EXECUTION (IN-PLACE NOTEBOOK // 16s)
               -------------------------------------------------------- */}
            {phase === "cinematic" && (
              <div
                className="relative w-full h-[480px] bg-black flex items-center justify-center overflow-hidden select-none"
                onClick={handleScreenTap}
                onTouchEnd={handleScreenTap}
              >
                <video
                  ref={videoRef}
                  src="/images/kira/kill2.mp4"
                  playsInline
                  {...{
                    "webkit-playsinline": "true",
                    "x5-playsinline": "true",
                    "x5-video-player-type": "h5",
                    "x5-video-player-fullscreen": "false",
                  }}
                  autoPlay
                  muted={videoMuted}
                  controls={false}
                  preload="auto"
                  className="w-full h-full object-contain sm:object-cover select-none bg-black pointer-events-none"
                  onPlay={() => {
                    setShowPlayOverlay(false);
                  }}
                  onTimeUpdate={(e) => {
                    const video = e.currentTarget;
                    setVideoProgress({
                      current: video.currentTime,
                      total: video.duration || 16,
                    });
                    if (video.duration && video.currentTime >= video.duration - 0.25) {
                      if (currentRecord) finishToVerdict(currentRecord);
                    }
                  }}
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget;
                    setVideoProgress((prev) => ({
                      ...prev,
                      total: video.duration || 16,
                    }));
                  }}
                  onEnded={() => currentRecord && finishToVerdict(currentRecord)}
                  onError={(e) => {
                    console.warn("Video playback fallback:", e);
                    if (currentRecord) finishToVerdict(currentRecord);
                  }}
                />

                {/* Top Controls: Sound Toggle & Skip Button */}
                <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
                  {/* Sound Toggle */}
                  <button
                    type="button"
                    onClick={toggleVideoMute}
                    className="pointer-events-auto px-3 py-1.5 rounded-full bg-black/80 hover:bg-[#ff1a2e] border border-white/20 hover:border-[#ff1a2e] text-white font-mono text-[10px] sm:text-xs tracking-wider uppercase transition-all backdrop-blur-md flex items-center gap-1.5 shadow-[0_4px_25px_rgba(0,0,0,0.8)] cursor-pointer"
                    title={videoMuted ? "Unmute Video" : "Mute Video"}
                  >
                    {videoMuted ? (
                      <>
                        <VolumeX size={13} className="text-[#ff1a2e]" />
                        <span>MUTED (TAP FOR AUDIO)</span>
                      </>
                    ) : (
                      <>
                        <Volume2 size={13} className="text-green-400" />
                        <span>AUDIO ON</span>
                      </>
                    )}
                  </button>

                  {/* Skip Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (currentRecord) finishToVerdict(currentRecord);
                    }}
                    className="pointer-events-auto px-3 py-1.5 rounded-full bg-black/80 hover:bg-[#ff1a2e] border border-white/20 hover:border-[#ff1a2e] text-white font-mono text-[10px] sm:text-xs tracking-wider uppercase transition-all backdrop-blur-md flex items-center gap-1.5 shadow-[0_4px_25px_rgba(0,0,0,0.8)] cursor-pointer"
                  >
                    <FastForward size={13} />
                    <span>SKIP</span>
                  </button>
                </div>

                {/* Center Floating Unmute Prompt if muted on mobile */}
                {videoMuted && !showPlayOverlay && (
                  <div
                    onClick={toggleVideoMute}
                    className="absolute top-14 z-40 cursor-pointer pointer-events-auto px-3.5 py-1.5 rounded-full bg-[#ff1a2e]/90 hover:bg-[#ff1a2e] text-white font-mono text-[11px] tracking-wider uppercase backdrop-blur-md flex items-center gap-1.5 shadow-[0_0_25px_rgba(255,26,46,0.8)] animate-pulse border border-white/30"
                  >
                    <VolumeX size={14} />
                    <span>TAP FOR AUDIO</span>
                  </div>
                )}

                {/* Mobile Tap-to-Play Overlay (Only if browser strictly blocked even muted autoplay, e.g. iOS Low Power Mode) */}
                {showPlayOverlay && (
                  <button
                    type="button"
                    onClick={handleManualPlay}
                    onTouchEnd={handleManualPlay}
                    className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center gap-4 cursor-pointer p-6 text-center select-none w-full border-0"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#ff1a2e] text-white flex items-center justify-center shadow-[0_0_30px_rgba(255,26,46,0.85)] animate-pulse">
                      <Play size={30} className="ml-1" />
                    </div>
                    <div>
                      <h3 className="font-deathnote text-xl sm:text-2xl text-white tracking-widest deathnote-glow">
                        START EXECUTION CINEMATIC
                      </h3>
                      <p className="text-xs font-mono text-gray-300 mt-1 uppercase tracking-wider">
                        Tap anywhere on video to play
                      </p>
                    </div>
                  </button>
                )}

                {/* Bottom Timeline & Subtitle */}
                <div className="absolute bottom-4 left-4 right-4 z-40 max-w-lg mx-auto flex flex-col items-center gap-1.5 pointer-events-none">
                  <div className="font-deathnote text-xs sm:text-sm text-white/90 tracking-[0.2em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] uppercase text-center truncate max-w-full">
                    KIRA EXECUTION PROTOCOL IN EFFECT
                  </div>
                  {currentRecord && (
                    <div className="text-[10px] sm:text-xs font-mono text-[#ff1a2e] tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(255,26,46,0.6)] text-center truncate max-w-full">
                      TARGET: {currentRecord.name}
                    </div>
                  )}

                  {/* Progress timeline bar */}
                  <div className="w-full flex items-center gap-2 font-mono text-[10px] text-gray-400 mt-0.5">
                    <span className="w-7 text-right">{Math.floor(videoProgress.current)}s</span>
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#ff1a2e] transition-all duration-100"
                        style={{
                          width: `${(videoProgress.current / (videoProgress.total || 16)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-7">{Math.floor(videoProgress.total || 16)}s</span>
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
                      Forensic stamp: {currentRecord.time}
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
                    onClick={() => currentRecord && triggerCinematicTransition(currentRecord, true)}
                    type="button"
                    className="py-3 px-4 rounded-xl bg-white/10 hover:bg-[#ff1a2e]/30 border border-white/10 text-white font-mono text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Play size={13} className="text-[#ff1a2e]" />
                    <span>REPLAY CINEMATIC (16s)</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playTick();
                      setIsArchiveModalOpen(true);
                    }}
                    type="button"
                    className="py-3 px-4 rounded-xl bg-[#ff1a2e]/10 hover:bg-[#ff1a2e]/20 border border-[#ff1a2e]/30 text-[#ff1a2e] font-mono text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <BookOpen size={13} />
                    <span>ALL WRITTEN NAMES ({records.length})</span>
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
                    <span>DISPATCH TO ANLEN</span>
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
            PREVIEW RECORD LEDGER BAR & TRIGGER
           ======================================================== */}
        <div className="mt-8 p-6 rounded-2xl bg-black/40 border border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-white/5 text-xs font-mono gap-3">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 flex items-center gap-2">
                <Terminal size={13} className="text-[#ff1a2e]" />
                DEATH NOTE ARCHIVE RECORD LEDGER
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono">
                <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${isSyncing ? "animate-spin" : "animate-pulse"}`} />
                LIVE SYNC
              </span>
            </div>
            <button
              onClick={() => {
                soundManager.playTick();
                setIsArchiveModalOpen(true);
              }}
              type="button"
              className="text-[#ff1a2e] hover:underline flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <span>OPEN FULL ARCHIVE LEDGER ({records.length} TOTAL TARGETS)</span>
              <span>❯</span>
            </button>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {records.slice(0, 6).map((r) => (
              <div
                key={r.id}
                onClick={() => handleSelectFromArchive(r)}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#ff1a2e]/40 transition-all text-xs font-mono cursor-pointer hover:bg-[#ff1a2e]/5 group"
                title="Click to inscribe again"
              >
                <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                  <span className="group-hover:text-[#ff1a2e] transition-colors">{r.id}</span>
                  <span className="truncate ml-2">{r.time.split(" ")[0]}</span>
                </div>
                <div className="text-sm font-deathnote text-white truncate mb-1 group-hover:text-[#ff1a2e] transition-colors">
                  {r.name}
                </div>
                <div className="text-[10px] text-gray-400 truncate">
                  {r.cause}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================
          FULL ARCHIVE RECORD LEDGER MODAL (50+ NAMES & SEARCH)
         ======================================================== */}
      <AnimatePresence>
        {isArchiveModalOpen && (
          <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-4xl max-h-[90vh] bg-[#0a0a0f] border border-[#ff1a2e]/30 rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between gap-4 bg-[#0e0e14]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#ff1a2e] uppercase tracking-widest mb-1">
                    <Skull size={14} />
                    <span>DEATH NOTE // SYSTEM RECORD ARCHIVE</span>
                    <span className="text-gray-600">•</span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                      <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${isSyncing ? "animate-spin" : "animate-pulse"}`} />
                      LIVE SYNC ACTIVE
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-deathnote text-white tracking-wider">
                    ALL INSCRIBED TARGETS ({records.length})
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.playTick();
                    setIsArchiveModalOpen(false);
                  }}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#ff1a2e] border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                  title="Close archive modal"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-4 px-6 border-b border-white/5 bg-black/40">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={archiveSearch}
                    onChange={(e) => setArchiveSearch(e.target.value)}
                    placeholder="Search inscribed target, attack vector, or record ID..."
                    className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 focus:border-[#ff1a2e] rounded-xl text-white font-mono text-xs placeholder:text-gray-600 focus:outline-none transition-all"
                  />
                  {archiveSearch && (
                    <button
                      type="button"
                      onClick={() => setArchiveSearch("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-mono cursor-pointer"
                    >
                      CLEAR
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable Records Grid */}
              <div className="p-6 overflow-y-auto flex-1 space-y-3 max-h-[60vh] divide-y divide-white/5">
                {filteredRecords.length === 0 ? (
                  <div className="text-center py-16 text-gray-500 font-mono text-xs">
                    No inscribed target found matching &ldquo;{archiveSearch}&rdquo;.
                  </div>
                ) : (
                  filteredRecords.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => handleSelectFromArchive(r)}
                      className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-xs text-[#ff1a2e] font-bold shrink-0 pt-0.5">
                          [{r.id}]
                        </span>
                        <div>
                          <div className="text-base font-deathnote text-white group-hover:text-[#ff1a2e] transition-colors tracking-wide">
                            {r.name}
                          </div>
                          <div className="text-xs font-mono text-gray-400 mt-0.5">
                            {r.cause}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 text-right">
                        <span className="text-[10px] font-mono text-gray-500">
                          {r.time}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#ff1a2e]/10 border border-[#ff1a2e]/30 text-[#ff1a2e] font-semibold whitespace-nowrap">
                          ROOTED
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 px-6 border-t border-white/10 bg-[#0e0e14] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-gray-500 gap-2">
                <span>
                  SHOWING {filteredRecords.length} OF {records.length} INSCRIBED ENTITIES
                </span>
                <span className="text-[11px] text-gray-400">
                  Click any entry to load into Death Note
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
