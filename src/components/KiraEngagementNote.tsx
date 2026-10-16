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

export interface InscribedRecord {
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
  "ProxyShell SSRF & PowerShell Remoting Administrative Hijack",
  "AS-REP Roasting & Kerberos Offline Hashcat 18200 Crack",
  "DCSync Directory Replication & Golden Ticket Generation",
  "Cross-Forest Trust Compromise & ESXi Infrastructure Wipe",
];

export const INITIAL_INSCRIBED_ARCHIVE: InscribedRecord[] = [
  { id: "REC-01", name: "Light Yagami (Kira)", time: "2026-10-16 12:44:10 UTC", timestamp: 1792149850000, cause: "Heart Attack // Shinigami Eyes Divine Retribution" },
  { id: "REC-02", name: "L Lawliet", time: "2026-10-16 11:20:00 UTC", timestamp: 1792144800000, cause: "Memory Dump & Keystroke Attribution Discovery" },
  { id: "REC-03", name: "Lind L. Tailor", time: "2026-10-16 09:15:32 UTC", timestamp: 1792137332000, cause: "Broadcast Transmission Interception & Instant Heart Attack" },
  { id: "REC-04", name: "Raye Penber", time: "2026-10-15 18:40:11 UTC", timestamp: 1792084811000, cause: "Ticket Forgery & Subway Terminal Compromise" },
  { id: "REC-05", name: "Naomi Misora", time: "2026-10-15 14:12:05 UTC", timestamp: 1792068725000, cause: "Zero-Trace Suicide Simulation Execution" },
  { id: "REC-06", name: "Kyosuke Higuchi", time: "2026-10-15 08:33:40 UTC", timestamp: 1792048420000, cause: "Yotsuba Executive Insider Privilege Escalation" },
  { id: "REC-07", name: "Teru Mikami", time: "2026-10-14 22:50:18 UTC", timestamp: 1792013418000, cause: "Active Directory Fake Notebook Replaced by Gevanni" },
  { id: "REC-08", name: "Misa Amane", time: "2026-10-14 16:15:22 UTC", timestamp: 1791989722000, cause: "Second Kira Shinigami Eye Proxy Delegation" },
  { id: "REC-09", name: "Watari (Quillsh Wammy)", time: "2026-10-14 11:05:49 UTC", timestamp: 1791971149000, cause: "Mainframe Wipe & Server Zeroization" },
  { id: "REC-10", name: "Anthony Rester", time: "2026-10-13 20:30:11 UTC", timestamp: 1791918611000, cause: "SPK Federal Task Force Kerberos Hijack" },
  { id: "REC-11", name: "Halle Lidner", time: "2026-10-13 15:45:00 UTC", timestamp: 1791901500000, cause: "Secret Service Channel Man-in-the-Middle" },
  { id: "REC-12", name: "Stephen Gevanni", time: "2026-10-13 10:18:24 UTC", timestamp: 1791881904000, cause: "Physical Copy of Inscribed Notebook Substitution" },
  { id: "REC-13", name: "Mail Jeevas (Matt)", time: "2026-10-12 23:04:19 UTC", timestamp: 1791841459000, cause: "Flashbang Distraction & Police Radio Interception" },
  { id: "REC-14", name: "Mello (Mihael Keehl)", time: "2026-10-12 17:22:50 UTC", timestamp: 1791820970000, cause: "SPK Kidnapping & Missile Silo Extortion" },
  { id: "REC-15", name: "Near (Nate River)", time: "2026-10-12 12:00:00 UTC", timestamp: 1791801600000, cause: "Final Warehouse Deduction & Finger Puppet Analysis" },
  { id: "REC-16", name: "Soichiro Yagami", time: "2026-10-11 19:14:33 UTC", timestamp: 1791741273000, cause: "Shinigami Eyes Sacrifice & Mafia Compound Raid" },
  { id: "REC-17", name: "Aiber (Tierry Morrello)", time: "2026-10-11 14:02:10 UTC", timestamp: 1791722530000, cause: "Social Engineering Infiltration & Con Artistry" },
  { id: "REC-18", name: "Wedy (Merrie Kenwood)", time: "2026-10-11 09:45:12 UTC", timestamp: 1791707112000, cause: "Surveillance Camera Wiretapping & Lockpicking" },
  { id: "REC-19", name: "Rod Ross", time: "2026-10-10 21:18:05 UTC", timestamp: 1791662285000, cause: "Los Angeles Syndicate LDAP Shadow Domain Pwn" },
  { id: "REC-20", name: "Jack Neylon (Kal Snydar)", time: "2026-10-10 16:30:40 UTC", timestamp: 1791645040000, cause: "Host Header Injection & Hostage Extraction" },
  { id: "REC-21", name: "dc01.corp.internal", time: "2026-10-10 11:22:15 UTC", timestamp: 1791626535000, cause: "ESC1 Active Directory Certificate Abuse → Forest Root" },
  { id: "REC-22", name: "Root Domain Administrator", time: "2026-10-09 23:45:00 UTC", timestamp: 1791584700000, cause: "DSRM Password Sync & DCSync Replication" },
  { id: "REC-23", name: "Exchange Server 2022", time: "2026-10-09 18:12:30 UTC", timestamp: 1791564750000, cause: "ProxyShell Server-Side Request Forgery & RCE" },
  { id: "REC-24", name: "KDC Kerberos Controller", time: "2026-10-09 13:05:19 UTC", timestamp: 1791546319000, cause: "AS-REP Roasting & Golden Ticket Generation" },
  { id: "REC-25", name: "Telecom Forest Root", time: "2026-10-08 22:40:02 UTC", timestamp: 1791494402000, cause: "Cross-Forest Trust Impersonation & ESXi Wipe" },
  { id: "REC-26", name: "ESXi Hypervisor 7.0", time: "2026-10-08 17:15:45 UTC", timestamp: 1791474945000, cause: "Python CLI Heap Overflow & Virtual Machine Takeover" },
  { id: "REC-27", name: "AD CS Certificate Authority", time: "2026-10-08 12:00:10 UTC", timestamp: 1791456010000, cause: "Subject Alternative Name (SAN) Forgery" },
  { id: "REC-28", name: "LDAP Central Directory", time: "2026-10-07 20:34:22 UTC", timestamp: 1791400462000, cause: "Resource-Based Constrained Delegation (RBCD)" },
  { id: "REC-29", name: "SQL-DB01.telecom.local", time: "2026-10-07 15:10:00 UTC", timestamp: 1791381000000, cause: "xp_cmdshell Code Execution & Token Impersonation" },
  { id: "REC-30", name: "Shadow AI Neural Gateway", time: "2026-10-07 10:25:18 UTC", timestamp: 1791363918000, cause: "Prompt Injection & Vector Database Extraction" },
  { id: "REC-31", name: "Insecure Direct Object Target", time: "2026-10-06 22:50:40 UTC", timestamp: 1791322240000, cause: "Admin Cookie Alteration & Session SUID Hijack" },
  { id: "REC-32", name: "SUID /bin/cat Root Daemon", time: "2026-10-06 17:18:02 UTC", timestamp: 1791302282000, cause: "Relative PATH Variable Injection & Code Execution" },
  { id: "REC-33", name: "FreeBSD Gateway Router", time: "2026-10-06 12:04:15 UTC", timestamp: 1791283455000, cause: "BGP Route Poisoning & Traffic Redirection" },
  { id: "REC-34", name: "Cloudflare Edge Worker", time: "2026-10-05 21:30:00 UTC", timestamp: 1791231000000, cause: "Request Smuggling & Cache Poisoning" },
  { id: "REC-35", name: "Kubernetes Master Node", time: "2026-10-05 16:45:20 UTC", timestamp: 1791213920000, cause: "Kubelet API Unauthenticated Pod Creation" },
  { id: "REC-36", name: "Docker Daemon Socket", time: "2026-10-05 11:12:44 UTC", timestamp: 1791193964000, cause: "Container Breakout via /var/run/docker.sock" },
  { id: "REC-37", name: "AWS Identity IAM Root", time: "2026-10-04 23:20:10 UTC", timestamp: 1791151210000, cause: "Metadata IMDSv1 Credential Exfiltration" },
  { id: "REC-38", name: "Azure AD Connect Sync", time: "2026-10-04 18:05:00 UTC", timestamp: 1791132300000, cause: "Cloud Administrator Seamless SSO Compromise" },
  { id: "REC-39", name: "Okta Identity Provider", time: "2026-10-04 13:40:19 UTC", timestamp: 1791116419000, cause: "Session Hijacking & MFA Bypass" },
  { id: "REC-40", name: "GitHub Enterprise Runner", time: "2026-10-03 22:15:33 UTC", timestamp: 1791060933000, cause: "Action CI/CD Workflow Privilege Escalation" },
  { id: "REC-41", name: "GitLab Self-Hosted 16.0", time: "2026-10-03 17:30:12 UTC", timestamp: 1791043812000, cause: "Arbitrary File Read & Admin Token Hijack" },
  { id: "REC-42", name: "Jira Data Center Host", time: "2026-10-03 12:10:05 UTC", timestamp: 1791024605000, cause: "OGNL Expression Injection & Shell Access" },
  { id: "REC-43", name: "Fortinet SSL-VPN Gateway", time: "2026-10-02 21:45:00 UTC", timestamp: 1790972700000, cause: "Buffer Overflow in SSL-VPN Daemon (CVE-2023-27997)" },
  { id: "REC-44", name: "Palo Alto GlobalProtect", time: "2026-10-02 16:20:18 UTC", timestamp: 1790953218000, cause: "Command Injection via Zero-Touch Provisioning" },
  { id: "REC-45", name: "SonicWall SMA 1000", time: "2026-10-02 11:05:40 UTC", timestamp: 1790934340000, cause: "Pre-Auth Access Control Bypass" },
  { id: "REC-46", name: "Citrix NetScaler Gateway", time: "2026-10-01 22:30:15 UTC", timestamp: 1790889015000, cause: "Citrix Bleed Session Token Leak (CVE-2023-4966)" },
  { id: "REC-47", name: "F5 BIG-IP TMOS Host", time: "2026-10-01 17:10:02 UTC", timestamp: 1790869802000, cause: "iControl REST Authentication Bypass" },
  { id: "REC-48", name: "Zero-Day Exploit Broker", time: "2026-10-01 12:45:30 UTC", timestamp: 1790853930000, cause: "Forensic Disappearance & Anti-Forensic Scrubbing" },
  { id: "REC-49", name: "Rival Red Team Operator", time: "2026-09-30 20:15:00 UTC", timestamp: 1790794500000, cause: "Cobalt Strike Beacon Configuration Decoding" },
  { id: "REC-50", name: "Target Entity 0x5342", time: "2026-09-30 15:00:00 UTC", timestamp: 1790775600000, cause: "Finalized Proof-of-Concept & Ethical Report Dispatched" },
];

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

  // Load session records on mount & merge with 50 default records
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("kira_inscribed_records");
      if (stored) {
        const customRecords: InscribedRecord[] = JSON.parse(stored);
        // Deduplicate and place user's recent inscriptions at top
        const merged = [
          ...customRecords,
          ...INITIAL_INSCRIBED_ARCHIVE.filter(
            (def) => !customRecords.some((c) => c.name.toLowerCase() === def.name.toLowerCase())
          ),
        ];
        setRecords(merged);
      } else {
        setRecords(INITIAL_INSCRIBED_ARCHIVE);
      }
    } catch {
      setRecords(INITIAL_INSCRIBED_ARCHIVE);
    }
    setSoundEnabled(soundManager.isEnabled());
  }, []);

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

  const triggerCinematicTransition = (rec: InscribedRecord) => {
    soundManager.playHeartbeat();
    setPhase("cinematic");
    setShowPlayOverlay(false);

    setTimeout(() => {
      const video = videoRef.current;
      if (video) {
        // Enforce iOS WebKit inline playback attributes
        video.setAttribute("playsinline", "true");
        video.setAttribute("webkit-playsinline", "true");
        video.setAttribute("x5-playsinline", "true");

        video.currentTime = 0;
        // Start with audio preference, but prepare for mobile fallback
        video.muted = !soundEnabled;
        setVideoMuted(!soundEnabled);

        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setShowPlayOverlay(false);
            })
            .catch(() => {
              // Unmuted autoplay blocked by mobile browser: immediately mute and retry
              if (videoRef.current) {
                videoRef.current.muted = true;
                setVideoMuted(true);
                videoRef.current
                  .play()
                  .then(() => {
                    setShowPlayOverlay(false);
                  })
                  .catch(() => {
                    // Mobile Low Power Mode or user gesture strictly required:
                    // Show a dramatic tap-to-play overlay so user tap initiates it
                    setShowPlayOverlay(true);
                  });
              }
            });
        }
      }
    }, 80);

    // Watchdog fallback (allow 22s buffer so video is never cut off prematurely)
    setTimeout(() => {
      setPhase((currentPhase) => {
        if (currentPhase === "cinematic" && (!videoRef.current || videoRef.current.paused || videoRef.current.ended)) {
          finishToVerdict(rec);
        }
        return currentPhase;
      });
    }, 22000);
  };

  const handleManualPlay = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !soundEnabled;
      setVideoMuted(!soundEnabled);
      video
        .play()
        .then(() => {
          setShowPlayOverlay(false);
        })
        .catch(() => {
          video.muted = true;
          setVideoMuted(true);
          video.play().then(() => {
            setShowPlayOverlay(false);
          });
        });
    }
  };

  const toggleVideoMute = () => {
    const video = videoRef.current;
    if (video) {
      const next = !video.muted;
      video.muted = next;
      setVideoMuted(next);
      soundManager.playTick();
    }
  };

  const finishToVerdict = (rec: InscribedRecord) => {
    soundManager.playChime();
    setPhase("verdict");
    setSecondsRemaining(40);

    // Prepend user's new record to top of records
    const updated = [rec, ...records.filter((r) => r.name.toLowerCase() !== rec.name.toLowerCase())];
    setRecords(updated);
    try {
      const customOnly = updated.filter((r) => !INITIAL_INSCRIBED_ARCHIVE.some((init) => init.id === r.id));
      sessionStorage.setItem("kira_inscribed_records", JSON.stringify(customOnly));
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

  const handleSelectFromArchive = (rec: InscribedRecord) => {
    setTargetName(rec.name);
    setIsArchiveModalOpen(false);
    soundManager.playTick();
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
                PHASE 3: CINEMATIC VIDEO (16s FULL CUT // FULLSCREEN)
               -------------------------------------------------------- */}
            {phase === "cinematic" && (
              <div className="fixed inset-0 z-[120] bg-black flex items-center justify-center overflow-hidden">
                <video
                  ref={videoRef}
                  src="/images/kira/kill2.mp4"
                  playsInline
                  autoPlay
                  muted={videoMuted}
                  controls={false}
                  preload="auto"
                  className="w-full h-full object-contain sm:object-cover select-none bg-black"
                  onPlay={() => {
                    setShowPlayOverlay(false);
                  }}
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

                {/* Mobile Tap-to-Play Overlay if browser blocked initial autoplay */}
                {showPlayOverlay && (
                  <div
                    onClick={handleManualPlay}
                    className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-4 cursor-pointer p-6 text-center select-none"
                  >
                    <div className="w-20 h-20 rounded-full bg-[#ff1a2e] text-white flex items-center justify-center shadow-[0_0_40px_rgba(255,26,46,0.85)] animate-pulse">
                      <Play size={36} className="ml-1" />
                    </div>
                    <div>
                      <h3 className="font-deathnote text-2xl sm:text-3xl text-white tracking-widest deathnote-glow">
                        START EXECUTION CINEMATIC
                      </h3>
                      <p className="text-xs font-mono text-gray-300 mt-1 uppercase tracking-wider">
                        Tap anywhere on screen to play
                      </p>
                    </div>
                  </div>
                )}

                {/* Sound Toggle (Top Left) */}
                <button
                  type="button"
                  onClick={toggleVideoMute}
                  className="absolute top-6 left-6 z-50 px-3.5 py-2 rounded-full bg-black/80 hover:bg-[#ff1a2e] border border-white/20 hover:border-[#ff1a2e] text-white font-mono text-xs tracking-wider uppercase transition-all backdrop-blur-md flex items-center gap-2 shadow-[0_4px_25px_rgba(0,0,0,0.8)] cursor-pointer"
                  title={videoMuted ? "Unmute Video" : "Mute Video"}
                >
                  {videoMuted ? (
                    <>
                      <VolumeX size={14} className="text-[#ff1a2e]" />
                      <span className="text-[11px]">MUTED (TAP FOR SOUND)</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={14} className="text-green-400" />
                      <span className="text-[11px]">AUDIO ON</span>
                    </>
                  )}
                </button>

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
                  <div className="font-deathnote text-sm sm:text-base text-white/90 tracking-[0.25em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] uppercase text-center">
                    KIRA EXECUTION PROTOCOL IN EFFECT
                  </div>
                  {currentRecord && (
                    <div className="text-xs font-mono text-[#ff1a2e] tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(255,26,46,0.6)] text-center">
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
                    onClick={() => currentRecord && triggerCinematicTransition(currentRecord)}
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
            <span className="text-gray-400 flex items-center gap-2">
              <Terminal size={13} className="text-[#ff1a2e]" />
              DEATH NOTE ARCHIVE RECORD LEDGER
            </span>
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

      {/* Hidden preloader so mobile devices buffer the video in background */}
      <video
        src="/images/kira/kill2.mp4"
        preload="auto"
        muted
        playsInline
        className="hidden"
        aria-hidden="true"
      />
    </section>
  );
}
