"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Terminal,
  Skull,
  Clock,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { writeups, RULE_ZERO_DISCLAIMER } from "@/lib/writeups";
import { soundManager } from "@/lib/audio";

export default function WriteupPage() {
  return (
    <div className="min-h-screen pt-28 px-4 pb-16 bg-[#050507] text-[#f4f4f6]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="double-bezel mb-8"
        >
          <div className="double-bezel-inner p-6 md:p-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-[#120508] border border-white/20 flex items-center justify-center text-white">
                <Skull size={24} className="text-[#ff1a2e]" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#ff1a2e] font-bold">
                  TECHNICAL ARCHIVE // DECLASSIFIED SECURITY AUDITS
                </span>
                <h1 className="text-3xl md:text-5xl font-deathnote tracking-wider text-white">
                  SECURITY WRITEUPS
                </h1>
              </div>
            </div>
            
            <p className="text-xs md:text-sm text-gray-300 font-mono mt-2">
              In-depth technical penetration testing walkthroughs, Active Directory attack chains, and proving ground machine post-mortems.
            </p>

            {/* Rule 0 Disclaimer Callout */}
            <div className="mt-4 p-3 bg-black/60 border border-white/10 rounded-lg flex flex-col sm:flex-row sm:items-center gap-2.5 text-xs font-mono text-gray-300">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-black border border-white/40 text-white font-mono text-[10px] tracking-widest font-bold uppercase shrink-0">
                <ShieldAlert size={12} className="text-[#ff1a2e]" />
                RULE 0
              </span>
              <span>{RULE_ZERO_DISCLAIMER}</span>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono mt-4 pt-3 border-t border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              STATUS: {writeups.length} TECHNICAL WRITEUPS AVAILABLE
            </div>
          </div>
        </motion.div>

        {/* Writeup Cards */}
        <div className="space-y-6">
          {writeups.map((w, i) => {
            return (
              <motion.div
                key={w.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.12 }}
              >
                <Link
                  href={`/writeup/${w.slug}`}
                  onClick={() => soundManager.playTick()}
                  className="block double-bezel group cursor-pointer"
                >
                  <div className="double-bezel-inner p-6 relative overflow-hidden">
                    {/* Top scanline highlight */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff1a2e] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="flex flex-col md:flex-row items-stretch gap-6 relative z-10">
                      {/* Thumbnail */}
                      <div className="w-full md:w-44 h-44 shrink-0 overflow-hidden rounded-lg border border-white/10 group-hover:border-white/40 transition-colors duration-300 bg-black/60 flex items-center justify-center">
                        <img
                          src={w.thumbnail}
                          alt={w.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          {/* Case Number & Stamp in Stark Typewriter font */}
                          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 bg-black text-white border border-white/40 font-mono text-[11px] font-bold tracking-[0.2em] shadow-[2px_2px_0px_rgba(255,255,255,0.15)] uppercase">
                                {w.caseNumber}
                              </span>
                              <span className="text-[10px] font-mono text-gray-400">
                                {w.platform} • {w.date}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                                  w.threatLevel === "Critical"
                                    ? "bg-[#ff1a2e]/20 border-[#ff1a2e]/60 text-[#ff1a2e]"
                                    : w.threatLevel === "Elevated"
                                    ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                                    : "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                                }`}
                              >
                                Threat: {w.threatLevel}
                              </span>
                              <span className="px-2 py-0.5 bg-black border border-white/30 text-white font-mono text-[9px] font-extrabold tracking-widest uppercase">
                                {w.stamp}
                              </span>
                            </div>
                          </div>

                          {/* Case Code */}
                          <div className="text-[11px] font-mono text-gray-400 mb-1">
                            {w.caseCode}
                          </div>

                          {/* Title */}
                          <h2 className="text-xl md:text-2xl font-deathnote tracking-wide text-white mb-2 group-hover:text-[#ff1a2e] transition-colors duration-300">
                            {w.title}
                          </h2>

                          {/* Time to Root */}
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400 mb-2.5">
                            <Clock size={12} className="text-gray-400" />
                            <span>Time to root: <strong className="text-white font-semibold">{w.timeToRoot}</strong></span>
                          </div>

                          {/* Kill chain */}
                          <div className="bg-black/70 border border-white/10 rounded p-2 mb-3">
                            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-0.5">
                              Kill Chain
                            </span>
                            <span className="text-[10px] font-mono text-gray-300 block break-words">
                              {w.killChain}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-gray-400 font-sans text-xs md:text-sm mb-4 leading-relaxed line-clamp-2">
                            {w.desc}
                          </p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                          {w.tags.map((t) => (
                            <span key={t} className="skill-badge text-[11px]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Read Arrow */}
                      <div className="self-end md:self-center shrink-0 w-10 h-10 rounded-full border border-white/20 group-hover:border-white group-hover:bg-white group-hover:text-black flex items-center justify-center text-gray-400 transition-all">
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          <div className="double-bezel">
            <div className="double-bezel-inner p-4 text-center">
              <div className="text-2xl font-bold text-white font-mono">{writeups.length}</div>
              <div className="text-xs text-gray-400 font-mono mt-1">Case Files</div>
            </div>
          </div>
          <div className="double-bezel">
            <div className="double-bezel-inner p-4 text-center">
              <div className="text-2xl font-bold text-white font-mono">3</div>
              <div className="text-xs text-gray-400 font-mono mt-1">Proving Platforms</div>
            </div>
          </div>
          <div className="double-bezel">
            <div className="double-bezel-inner p-4 text-center">
              <div className="text-2xl font-bold text-[#ff1a2e] font-mono">100%</div>
              <div className="text-xs text-gray-400 font-mono mt-1">Proof of Concept</div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            onClick={() => soundManager.playTick()}
            className="hacker-btn text-xs flex items-center gap-2"
          >
            <Terminal size={14} className="text-[#ff1a2e]" />
            <span>← Return to Dossier</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
