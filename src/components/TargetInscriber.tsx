"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Skull,
  Terminal,
  Crosshair,
  CheckCircle2,
  RefreshCw,
  Search,
  Flame,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { soundManager } from "@/lib/audio";

export interface InscribedTarget {
  id: string;
  target: string;
  vector: string;
  timestamp: string;
  status: "ROOTED" | "COMPROMISED" | "EXPLOITED" | "PWNED";
  severity: "CRITICAL" | "DOMAIN ADMIN" | "SYSTEM ROOT";
  operator: string;
}

const DEFAULT_TARGETS: InscribedTarget[] = [
  {
    id: "REC-0982",
    target: "dc01.telecom.local",
    vector: "ESC1 AD CS Certificate Abuse → Domain Admin Kerberos Ticket",
    timestamp: "2026-07-14 14:22:09 UTC",
    status: "ROOTED",
    severity: "DOMAIN ADMIN",
    operator: "AN1EN (AD-RTS)",
  },
  {
    id: "REC-0981",
    target: "oopsie.htb (10.129.42.124)",
    vector: "IDOR Admin Cookie Manipulation → SUID /bin/cat PATH Hijacking",
    timestamp: "2026-06-20 09:15:43 UTC",
    status: "PWNED",
    severity: "SYSTEM ROOT",
    operator: "AN1EN",
  },
  {
    id: "REC-0980",
    target: "internal-service.local",
    vector: "Host Header Injection → Password Reset Poisoning → Admin Takeover",
    timestamp: "2026-08-31 16:48:30 UTC",
    status: "COMPROMISED",
    severity: "CRITICAL",
    operator: "AN1EN (Top 8 Finalist)",
  },
  {
    id: "REC-0979",
    target: "darkzero.htb",
    vector: "Resource-Based Constrained Delegation (RBCD) via LDAP Machine Account",
    timestamp: "2026-05-12 11:03:19 UTC",
    status: "ROOTED",
    severity: "DOMAIN ADMIN",
    operator: "AN1EN",
  },
];

const ATTACK_VECTORS = [
  "ESC1 Active Directory Certificate Abuse → Forest Root",
  "Kerberos AS-REP Roasting & Ticket Pre-Auth Bypass",
  "GodPotato / SeImpersonatePrivilege Elevation → SYSTEM",
  "Host Header Injection & Password Reset Link Poisoning",
  "Insecure Direct Object Reference (IDOR) & Session Hijack",
  "SUID Binary Execution & PATH Variable Hijack",
  "VMware ESXi Hypervisor Memory Dump & Shadow Hash Extraction",
  "Zero-Click Remote Code Execution via Deserialization",
];

export default function TargetInscriber() {
  const [targetName, setTargetName] = useState("");
  const [selectedVector, setSelectedVector] = useState(ATTACK_VECTORS[0]);
  const [records, setRecords] = useState<InscribedTarget[]>(DEFAULT_TARGETS);
  const [searchTerm, setSearchTerm] = useState("");

  // Inscription cinematic states: "idle" | "writing" | "countdown" | "verdict"
  const [inscribeState, setInscribeState] = useState<"idle" | "writing" | "countdown" | "verdict">("idle");
  const [writtenChars, setWrittenChars] = useState("");
  const [countdown, setCountdown] = useState(4);
  const [activeVerdict, setActiveVerdict] = useState<InscribedTarget | null>(null);

  const writingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved records from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("deathnote_inscribed_records");
      if (saved) {
        setRecords(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const saveRecords = (newRecords: InscribedTarget[]) => {
    setRecords(newRecords);
    try {
      localStorage.setItem("deathnote_inscribed_records", JSON.stringify(newRecords));
    } catch {}
  };

  const handleInscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTarget = targetName.trim();
    if (!cleanTarget) return;

    soundManager.playTick();
    setInscribeState("writing");
    setWrittenChars("");

    // Cinematic typewriter handwriting with sound
    let charIndex = 0;
    const textToType = cleanTarget;

    writingIntervalRef.current = setInterval(() => {
      if (charIndex < textToType.length) {
        charIndex++;
        setWrittenChars(textToType.substring(0, charIndex));
        soundManager.playPenScratch();
      } else {
        if (writingIntervalRef.current) clearInterval(writingIntervalRef.current);
        
        // Advance to heart attack / countdown
        setTimeout(() => {
          soundManager.playHeartbeat();
          setInscribeState("countdown");
          setCountdown(3);

          const cTimer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(cTimer);
                // Verdict!
                soundManager.playChime();
                soundManager.playTargetAcquired();

                const now = new Date();
                const timestampStr = now.toISOString().replace("T", " ").substring(0, 19) + " UTC";
                
                const newRecord: InscribedTarget = {
                  id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
                  target: cleanTarget,
                  vector: selectedVector,
                  timestamp: timestampStr,
                  status: "ROOTED",
                  severity: selectedVector.includes("Forest") || selectedVector.includes("Domain") ? "DOMAIN ADMIN" : "SYSTEM ROOT",
                  operator: "AN1EN // OPERATOR",
                };

                setActiveVerdict(newRecord);
                saveRecords([newRecord, ...records]);
                setInscribeState("verdict");
                return 0;
              }
              soundManager.playHeartbeat();
              return prev - 1;
            });
          }, 1000);
        }, 600);
      }
    }, 90);
  };

  const handleResetWorkspace = () => {
    soundManager.playTick();
    setTargetName("");
    setInscribeState("idle");
    setActiveVerdict(null);
  };

  const handleClearHistory = () => {
    soundManager.playTick();
    saveRecords(DEFAULT_TARGETS);
  };

  const filteredRecords = records.filter(
    (r) =>
      r.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-20 px-4 bg-[#050507] border-t border-[#ff1a2e]/20" id="inscriber">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ff1a2e] mb-1 uppercase tracking-[0.25em]">
              <Flame size={14} className="animate-pulse" />
              <span>INTERACTIVE HOST INSCRIPTION // NOTEBOOK TERMINAL</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-deathnote tracking-wider text-white">
              INSCRIBE TARGET
            </h2>
          </div>
          <p className="font-mono text-xs text-gray-400 max-w-md">
            Directly modeled from Kira&apos;s death codex. Inscribe any hostname or IP address to simulate attack vector attribution and archive the compromise.
          </p>
        </div>

        {/* WORKSPACE & WRITING DESK */}
        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          
          {/* Left Column: The Notebook Inscription Form */}
          <div className="lg:col-span-7">
            <div className="double-bezel h-full">
              <div className="double-bezel-inner p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden bg-[#09090e]">
                
                {/* Paper texture and subtle margin line like an authentic notebook */}
                <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-[#ff1a2e]/20 pointer-events-none" />
                <div className="absolute top-0 bottom-0 left-14 w-[1px] bg-[#ff1a2e]/10 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between pb-3 mb-6 border-b border-white/5 pl-8">
                    <span className="font-deathnote text-sm text-[#ff1a2e] tracking-widest flex items-center gap-2">
                      <Skull size={15} />
                      THE DEATH DOSSIER // PAGE 0x01
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 uppercase">
                      SEC_ID: AN1EN-KIRA
                    </span>
                  </div>

                  {inscribeState === "idle" && (
                    <form onSubmit={handleInscribe} className="space-y-5 pl-8">
                      <div>
                        <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                          1. Target Hostname / IP Address
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={targetName}
                            onChange={(e) => setTargetName(e.target.value)}
                            placeholder="e.g. dc01.telecom.local or 10.10.11.231"
                            maxLength={36}
                            className="w-full px-4 py-3 bg-black/60 border border-white/10 focus:border-[#ff1a2e] rounded-xl text-white font-mono text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#ff1a2e] transition-all"
                            required
                          />
                          <Crosshair size={16} className="absolute right-3.5 top-3.5 text-gray-500" />
                        </div>
                        <span className="text-[10px] font-mono text-gray-500 mt-1 block">
                          Maximum 36 alphanumeric characters. Real-time forensic attribution applied.
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                          2. Designation of Compromise (Attack Vector)
                        </label>
                        <select
                          value={selectedVector}
                          onChange={(e) => setSelectedVector(e.target.value)}
                          className="w-full px-4 py-3 bg-black/60 border border-white/10 focus:border-[#ff1a2e] rounded-xl text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#ff1a2e] transition-all cursor-pointer"
                        >
                          {ATTACK_VECTORS.map((v) => (
                            <option key={v} value={v} className="bg-[#09090d] text-gray-200">
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full group py-3 px-6 rounded-xl bg-[#ff1a2e] hover:bg-[#ff1a2e]/90 text-white font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,26,46,0.5)] flex items-center justify-center gap-3"
                        >
                          <Skull size={15} />
                          <span>INSCRIBE HOST IN DOSSIER</span>
                          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Writing Animation State */}
                  {inscribeState === "writing" && (
                    <div className="py-12 pl-8 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full border border-[#ff1a2e]/40 flex items-center justify-center mb-4 bg-[#ff1a2e]/10">
                        <Sparkles size={20} className="text-[#ff1a2e] animate-spin" />
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#ff1a2e] mb-2">
                        INSCRIBING IN PARCHMENT...
                      </span>
                      <div className="text-2xl sm:text-3xl font-deathnote text-white tracking-widest min-h-[48px] border-b border-[#ff1a2e]/50 px-6 py-2">
                        {writtenChars}
                        <span className="inline-block w-2.5 h-6 bg-[#ff1a2e] ml-1 animate-pulse" />
                      </div>
                      <span className="text-[11px] font-mono text-gray-500 mt-4">
                        Pen scratching audio active. Forensic imprint binding to kernel.
                      </span>
                    </div>
                  )}

                  {/* Countdown State (40s shortened to 3s for snappy UX) */}
                  {inscribeState === "countdown" && (
                    <div className="py-12 pl-8 flex flex-col items-center justify-center text-center">
                      <div className="relative mb-4">
                        <div className="w-20 h-20 rounded-full border-2 border-[#ff1a2e] flex items-center justify-center text-3xl font-deathnote text-white shadow-[0_0_25px_rgba(255,26,46,0.6)] animate-pulse">
                          {countdown}
                        </div>
                      </div>
                      <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#ff1a2e] font-bold">
                        PRIVILEGE ESCALATION IN PROGRESS
                      </span>
                      <p className="text-xs font-mono text-gray-400 mt-2 max-w-sm">
                        Waiting for memory ticket harvest and token impersonation to crystallize...
                      </p>
                    </div>
                  )}

                  {/* Verdict Card State */}
                  {inscribeState === "verdict" && activeVerdict && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-4 pl-8"
                    >
                      <div className="rounded-xl border border-[#ff1a2e]/40 bg-[#ff1a2e]/5 p-6 mb-6">
                        <div className="flex items-center gap-2 text-xs font-mono text-[#ff1a2e] mb-3 uppercase tracking-widest">
                          <CheckCircle2 size={15} />
                          <span>HOST COMPROMISED // PRIVILEGE ELEVATED</span>
                        </div>

                        <div className="space-y-3 font-mono text-xs">
                          <div>
                            <span className="text-gray-500 block text-[10px] uppercase">TARGET HOST</span>
                            <span className="text-xl font-deathnote text-white tracking-wider">
                              {activeVerdict.target}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                            <div>
                              <span className="text-gray-500 block text-[10px] uppercase">COMPROMISE TIME</span>
                              <span className="text-gray-300">{activeVerdict.timestamp}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-[10px] uppercase">STATUS</span>
                              <span className="text-[#ff1a2e] font-bold tracking-wider">
                                [ {activeVerdict.status} ]
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-white/5">
                            <span className="text-gray-500 block text-[10px] uppercase">CAUSE / ATTACK VECTOR</span>
                            <span className="text-gray-200">{activeVerdict.vector}</span>
                          </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-[#ff1a2e]/20 text-center">
                          <span className="font-deathnote text-sm text-[#ff1a2e] tracking-wider deathnote-glow">
                            &ldquo;Justice has been served. Every root leaves a stain.&rdquo;
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleResetWorkspace}
                        className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <RefreshCw size={13} />
                        <span>INSCRIBE ANOTHER HOST</span>
                      </button>
                    </motion.div>
                  )}

                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500 pl-8">
                  <span>NOTE CODEX // VER 2.0</span>
                  <span className="text-[#ff1a2e]">SHINIGAMI EYE SYNC: 100%</span>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Mini Death Note Rules & Quick Target Presets */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Rule Summary */}
            <div className="double-bezel">
              <div className="double-bezel-inner p-6">
                <span className="text-[10px] font-mono tracking-widest text-[#ff1a2e] uppercase block mb-1">
                  RULE OF THE CODEX
                </span>
                <h3 className="font-deathnote text-lg text-white mb-2">
                  THE SYSTEM INSCRIBED SHALL FALL
                </h3>
                <p className="font-sans text-xs text-gray-400 leading-relaxed italic">
                  &ldquo;The machine whose IP or FQDN is entered here shall be audited under ethical engagement rules. If the cause of compromise is designated within the note, it shall take effect immediately.&rdquo;
                </p>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-[10px] font-mono text-gray-500">
                  <ShieldAlert size={12} className="text-[#ff1a2e]" />
                  <span>RESPONSIBLE DISCLOSURE CERTIFIED</span>
                </div>
              </div>
            </div>

            {/* Quick Test Presets */}
            <div className="double-bezel">
              <div className="double-bezel-inner p-6">
                <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block mb-2">
                  RAPID INSCRIBE PRESETS (CLICK TO LOAD)
                </span>
                <div className="space-y-2">
                  {[
                    { name: "esxi01.telecom.local", vector: "VMware ESXi Hypervisor Memory Dump" },
                    { name: "strikevigil.corp.in", vector: "Host Header Injection & Password Reset Poisoning" },
                    { name: "forest-root.telecom.local", vector: "ESC1 Active Directory Certificate Abuse" },
                  ].map((p) => (
                    <button
                      key={p.name}
                      onClick={() => {
                        soundManager.playTick();
                        setTargetName(p.name);
                        setSelectedVector(p.vector);
                      }}
                      className="w-full text-left p-2.5 rounded-lg bg-black/40 hover:bg-white/5 border border-white/5 hover:border-[#ff1a2e]/40 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <span className="text-xs font-mono text-white block group-hover:text-[#ff1a2e] transition-colors">
                          {p.name}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500 block truncate max-w-xs">
                          {p.vector}
                        </span>
                      </div>
                      <ArrowRight size={12} className="text-gray-600 group-hover:text-[#ff1a2e] transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* SYSTEM HISTORY LEDGER (ARCHIVE RECORDS) */}
        <div className="double-bezel">
          <div className="double-bezel-inner p-6 sm:p-8">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/5">
              <div>
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-[#ff1a2e]" />
                  <h3 className="font-deathnote text-2xl text-white tracking-wide">
                    ARCHIVE RECORDS // COMPROMISE LEDGER
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-gray-400 mt-1 block">
                  Synchronized forensic registry of audited targets and conquered proving grounds.
                </span>
              </div>

              {/* Search & Clear */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search ledger..."
                    className="w-48 sm:w-56 px-3 py-1.5 pl-8 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ff1a2e]"
                  />
                  <Search size={13} className="absolute left-2.5 top-2 text-gray-500" />
                </div>

                <button
                  onClick={handleClearHistory}
                  title="Reset to default targets"
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#ff1a2e]/40 text-gray-400 hover:text-white transition-colors text-xs font-mono"
                >
                  <RefreshCw size={13} />
                </button>
              </div>
            </div>

            {/* Records List Table */}
            <div className="divide-y divide-white/5">
              {filteredRecords.length === 0 ? (
                <div className="py-8 text-center text-xs font-mono text-gray-500">
                  No records matching &ldquo;{searchTerm}&rdquo;
                </div>
              ) : (
                filteredRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/[0.02] px-2 rounded-lg transition-colors group"
                  >
                    <div className="flex items-start md:items-center gap-3">
                      <span className="text-[10px] font-mono text-[#ff1a2e] font-bold shrink-0 pt-0.5 md:pt-0">
                        [{rec.id}]
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-deathnote text-base text-white group-hover:text-[#ff1a2e] transition-colors tracking-wide">
                            {rec.target}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff1a2e]/10 border border-[#ff1a2e]/30 text-[#ff1a2e] font-semibold">
                            {rec.status}
                          </span>
                          <span className="text-[10px] font-mono text-gray-500">
                            {rec.severity}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-gray-400 mt-0.5">
                          {rec.vector}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 text-[10px] font-mono text-gray-500 shrink-0">
                      <span>{rec.timestamp}</span>
                      <span className="text-gray-400">• {rec.operator}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total Records Counter */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-400">
              <span>TOTAL DEFEATED TARGETS: <strong className="text-[#ff1a2e] font-deathnote text-sm">{records.length}</strong></span>
              <span className="text-[10px] text-gray-500">AUTONOMOUS AUDIT PROTOCOL // ACTIVE</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
