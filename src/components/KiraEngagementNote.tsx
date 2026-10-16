"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Skull,
  Mail,
  RefreshCw,
  Crosshair,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { soundManager } from "@/lib/audio";

const ATTACK_VECTORS = [
  "Active Directory Domain & Forest Infiltration (ESC1 / Kerberos)",
  "Web Application Vulnerability Assessment & Account Takeover",
  "Full-Scope Red Team Adversarial Simulation & Lateral Movement",
  "Cloud Infrastructure & Identity Privilege Escalation",
  "Stealth OSINT Reconnaissance & Social Engineering Audit",
];

export default function KiraEngagementNote() {
  const [targetName, setTargetName] = useState("");
  const [targetVector, setTargetVector] = useState(ATTACK_VECTORS[0]);
  const [clientContact, setClientContact] = useState("");
  const [specialDirectives, setSpecialDirectives] = useState("");

  // Inscription states: "form" | "writing" | "sealed"
  const [state, setState] = useState<"form" | "writing" | "sealed">("form");
  const [writtenTarget, setWrittenTarget] = useState("");
  const [writtenVector, setWrittenVector] = useState("");

  const writingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTarget = targetName.trim();
    if (!cleanTarget) return;

    soundManager.playTick();
    setState("writing");
    setWrittenTarget("");
    setWrittenVector("");

    let charIdx = 0;
    const textTarget = cleanTarget;
    const textVector = `Cause: ${targetVector}`;

    // Handwriting sequence with pen scratching audio
    writingIntervalRef.current = setInterval(() => {
      if (charIdx < textTarget.length) {
        charIdx++;
        setWrittenTarget(textTarget.substring(0, charIdx));
        soundManager.playPenScratch();
      } else {
        if (writingIntervalRef.current) clearInterval(writingIntervalRef.current);

        // Write vector
        setTimeout(() => {
          let vIdx = 0;
          const vInterval = setInterval(() => {
            if (vIdx < textVector.length) {
              vIdx++;
              setWrittenVector(textVector.substring(0, vIdx));
              soundManager.playPenScratch();
            } else {
              clearInterval(vInterval);
              // Seal the contract with heartbeat and chime
              setTimeout(() => {
                soundManager.playHeartbeat();
                soundManager.playChime();
                setState("sealed");
              }, 400);
            }
          }, 40);
        }, 300);
      }
    }, 70);
  };

  const handleReset = () => {
    soundManager.playTick();
    setTargetName("");
    setClientContact("");
    setSpecialDirectives("");
    setWrittenTarget("");
    setWrittenVector("");
    setState("form");
  };

  const mailtoUrl = `mailto:anlenjeban7@gmail.com?subject=${encodeURIComponent(
    `[Penetration Test Inquiry] Target: ${targetName}`
  )}&body=${encodeURIComponent(
    `Target / System to Audit: ${targetName}\nRequested Scope: ${targetVector}\nClient Contact: ${clientContact || "Anonymous"}\nDirectives: ${specialDirectives || "Standard Ethical Rules of Engagement"}\n\nInitiated via Cyber Dossier Inscriber.`
  )}`;

  return (
    <section className="py-24 px-4 bg-[#050507] border-t border-white/5 relative" id="inscribe">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff1a2e]/10 border border-[#ff1a2e]/30 text-xs font-mono text-[#ff1a2e] mb-3 uppercase tracking-widest">
            <Skull size={13} />
            <span>KIRA NOTEBOOK MECHANIC // ADVERSARIAL CODEX</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-deathnote tracking-wider text-white mb-3">
            INSCRIBE AUDIT TARGET
          </h2>

          <p className="font-mono text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            In Death Note, Kira inscribed names to pass judgment. In this codex, inscribe any target organization, host, or system to codify an adversarial penetration test.
          </p>
        </div>

        {/* The Authentic Death Note Parchment Container */}
        <div className="double-bezel relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
          <div className="double-bezel-inner p-6 sm:p-10 bg-[#09090d] relative overflow-hidden">
            
            {/* Notebook Margin Guidelines */}
            <div className="absolute top-0 bottom-0 left-8 sm:left-12 w-[1px] bg-[#ff1a2e]/20 pointer-events-none" />
            <div className="absolute top-0 bottom-0 left-10 sm:left-14 w-[1px] bg-[#ff1a2e]/10 pointer-events-none" />

            {/* Notebook Header Rule */}
            <div className="pl-8 sm:pl-12 pb-4 mb-8 border-b border-white/5 flex items-center justify-between text-xs font-mono text-gray-500">
              <span className="font-deathnote text-sm sm:text-base text-[#ff1a2e] tracking-widest flex items-center gap-2">
                <Crosshair size={15} />
                DEATH NOTE // ENGAGEMENT CONTRACT
              </span>
              <span className="text-[10px] uppercase text-gray-500 hidden sm:inline">
                OPERATOR: ANLEN JEBAN (AN1EN)
              </span>
            </div>

            {/* STATE 1: FORM ENTRY */}
            {state === "form" && (
              <form onSubmit={handleSubmit} className="pl-8 sm:pl-12 space-y-6">
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                    1. Target Entity / System / Domain to Audit
                  </label>
                  <input
                    type="text"
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    placeholder="e.g. corp.internal, dc01.telecom.local, or Organization Name"
                    maxLength={50}
                    required
                    className="w-full px-4 py-3 bg-black/60 border border-white/10 focus:border-[#ff1a2e] rounded-xl text-white font-mono text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#ff1a2e] transition-all"
                  />
                  <span className="text-[10px] font-mono text-gray-500 mt-1 block">
                    The entity whose security posture shall be audited without forensic attribution.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                    2. Designated Cause of Compromise (Attack Scope)
                  </label>
                  <select
                    value={targetVector}
                    onChange={(e) => setTargetVector(e.target.value)}
                    className="w-full px-4 py-3 bg-black/60 border border-white/10 focus:border-[#ff1a2e] rounded-xl text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#ff1a2e] transition-all cursor-pointer"
                  >
                    {ATTACK_VECTORS.map((v) => (
                      <option key={v} value={v} className="bg-[#09090d] text-gray-200">
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                      3. Inscriber Contact / Email (Optional)
                    </label>
                    <input
                      type="text"
                      value={clientContact}
                      onChange={(e) => setClientContact(e.target.value)}
                      placeholder="e.g. security-lead@company.com"
                      className="w-full px-4 py-2.5 bg-black/60 border border-white/10 focus:border-[#ff1a2e] rounded-xl text-white font-mono text-xs placeholder:text-gray-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase tracking-wider mb-2">
                      4. Special Directives / Rules
                    </label>
                    <input
                      type="text"
                      value={specialDirectives}
                      onChange={(e) => setSpecialDirectives(e.target.value)}
                      placeholder="e.g. Zero-knowledge, simulate external adversary"
                      className="w-full px-4 py-2.5 bg-black/60 border border-white/10 focus:border-[#ff1a2e] rounded-xl text-white font-mono text-xs placeholder:text-gray-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full group py-3 px-6 rounded-xl bg-[#ff1a2e] hover:bg-[#ff1a2e]/90 text-white font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,26,46,0.6)] flex items-center justify-center gap-3"
                  >
                    <Skull size={15} />
                    <span>INSCRIBE IN DEATH NOTE</span>
                    <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              </form>
            )}

            {/* STATE 2: WRITING ANIMATION (PEN SCRATCHING) */}
            {state === "writing" && (
              <div className="pl-8 sm:pl-12 py-16 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full border border-[#ff1a2e]/40 flex items-center justify-center mb-6 bg-[#ff1a2e]/10">
                  <Sparkles size={20} className="text-[#ff1a2e] animate-spin" />
                </div>

                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#ff1a2e] mb-3">
                  INSCRIBING IN NOTEBOOK...
                </span>

                <div className="text-3xl sm:text-4xl md:text-5xl font-deathnote text-white tracking-widest min-h-[60px] border-b border-[#ff1a2e]/50 px-6 py-2 mb-3">
                  {writtenTarget}
                  <span className="inline-block w-2.5 h-7 bg-[#ff1a2e] ml-1.5 animate-pulse" />
                </div>

                <p className="font-mono text-xs text-gray-400 min-h-[24px]">
                  {writtenVector}
                </p>
              </div>
            )}

            {/* STATE 3: SEALED DOSSIER VERDICT & REAL ENGAGEMENT DISPATCH */}
            {state === "sealed" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="pl-8 sm:pl-12 py-4"
              >
                <div className="rounded-xl border border-[#ff1a2e]/40 bg-[#ff1a2e]/5 p-6 sm:p-8 mb-6 relative overflow-hidden">
                  
                  {/* Crimson Seal Stamp */}
                  <div className="absolute right-4 top-4 rotate-12 border-2 border-[#ff1a2e] rounded-xl px-3 py-1 text-[#ff1a2e] font-deathnote text-xs tracking-wider opacity-80 select-none">
                    SEALED // 0xDEAD
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-[#ff1a2e] mb-4 uppercase tracking-widest">
                    <CheckCircle2 size={16} />
                    <span>TARGET INSCRIBED IN ADVERSARIAL CODEX</span>
                  </div>

                  <div className="space-y-4 font-mono text-xs">
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase">TARGET TO COMPROMISE</span>
                      <span className="text-2xl sm:text-3xl font-deathnote text-white tracking-wider">
                        {targetName}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-white/5">
                      <div>
                        <span className="text-gray-500 block text-[10px] uppercase">CAUSE / ATTACK VECTOR</span>
                        <span className="text-gray-200">{targetVector}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px] uppercase">STATUS</span>
                        <span className="text-[#ff1a2e] font-bold tracking-wider">
                          [ TARGET AUDIT QUEUED ]
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 grid sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-500 block text-[10px] uppercase">ASSIGNED RED TEAM SPECIALIST</span>
                        <span className="text-gray-200">Anlen Jeban (AN1EN) — AD-RTS</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px] uppercase">ENGAGEMENT TIMEFRAME</span>
                        <span className="text-gray-200">Within 40 seconds of handshake</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#ff1a2e]/20 text-center">
                    <span className="font-deathnote text-sm text-[#ff1a2e] tracking-wider deathnote-glow">
                      &ldquo;The rule has taken effect. Justice has been codified.&rdquo;
                    </span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <a
                    href={mailtoUrl}
                    onClick={() => soundManager.playTargetAcquired()}
                    className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-[#ff1a2e] hover:bg-[#ff1a2e]/90 text-white font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,26,46,0.6)] flex items-center justify-center gap-2"
                  >
                    <Mail size={15} />
                    <span>DISPATCH TO AN1EN (EMAIL AUDIT REQUEST)</span>
                  </a>

                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={14} />
                    <span>INSCRIBE ANOTHER TARGET</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Bottom Notebook Footer */}
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500 pl-8 sm:pl-12">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-[#ff1a2e]" />
                ETHICAL RED TEAM ENGAGEMENT PROTOCOL
              </span>
              <span>PAGE NO. 0x01</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
