"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, Clock, ShieldAlert } from "lucide-react";
import { soundManager } from "@/lib/audio";
import { writeups, RULE_ZERO_DISCLAIMER } from "@/lib/writeups";

export default function PenguinEditorial() {
  return (
    <section className="py-24 px-4 bg-[#07070b] relative overflow-hidden" id="cases">
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* SECTION HEADER IN DEATH NOTE LANGUAGE */}
        <div className="mb-10">
          <div className="flex items-center gap-3 text-xs font-mono text-gray-400 mb-3 uppercase tracking-[0.25em]">
            <span className="font-bold text-white bg-black border border-white/30 px-2 py-0.5">CASE STUDIES</span>
            <span>•</span>
            <span>PENTEST AUDITS &amp; LAB WALKTHROUGHS</span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-deathnote tracking-tight text-white mb-4 leading-none">
            Root the host.
          </h2>

          <p className="font-mono text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            Hands-on penetration audits, Active Directory attack chains, and proving ground case studies. Every target in this index was compromised, dissected, and documented under rigorous ethical standards.
          </p>

          {/* Rule 0 Disclaimer Callout */}
          <div className="mt-5 p-3.5 bg-black/60 border border-white/10 rounded-lg flex flex-col sm:flex-row sm:items-center gap-3 text-xs font-mono text-gray-300 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black border border-white/40 text-white font-mono text-[10px] tracking-widest font-bold uppercase shrink-0">
              <ShieldAlert size={12} className="text-[#ff1a2e]" />
              RULE 0
            </span>
            <span className="text-gray-300">{RULE_ZERO_DISCLAIMER}</span>
          </div>
        </div>

        {/* OPEN CASES GRID */}
        <div>
          <div className="flex items-center justify-between pb-4 mb-8 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="font-deathnote text-2xl text-white tracking-wide">
                FEATURED CASE STUDIES
              </span>
              <span className="text-xs font-mono text-white bg-black border border-white/30 px-2 py-0.5 rounded">
                {writeups.length} AUDITED LABS
              </span>
            </div>
            
            <Link
              href="/writeup"
              onClick={() => soundManager.playTick()}
              className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors group"
            >
              <span>View All Writeups Archive</span>
              <ArrowUpRight size={13} className="text-gray-400 group-hover:text-white transition-colors" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {writeups.map((w) => {
              const isWindows = w.tags.includes("Active Directory") || w.platform.includes("Cyberwarfare");
              const isLinux = w.tags.includes("Linux") || w.tags.includes("IDOR") || w.slug.includes("oopsie");
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
                      {/* Top Bar: L's stark white-on-black typewriter case number & stamp */}
                      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/5">
                        <span className="px-2.5 py-0.5 bg-black text-white border border-white/40 font-mono text-[11px] font-bold tracking-[0.2em] shadow-[2px_2px_0px_rgba(255,255,255,0.15)] uppercase">
                          {w.caseNumber}
                        </span>

                        <span className="px-2 py-0.5 bg-black border border-white/30 text-white font-mono text-[9px] font-extrabold tracking-widest uppercase">
                          {w.stamp}
                        </span>
                      </div>

                      {/* Thumbnail Preview */}
                      <div className="aspect-[16/10] w-full rounded-lg overflow-hidden mb-4 bg-black/60 border border-white/5 relative group-hover:border-white/30 transition-colors">
                        <img
                          src={w.thumbnail}
                          alt={w.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                        
                        {/* OS & Threat Level Badges on Top */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/90 border border-white/20 text-white backdrop-blur-sm">
                            {osLabel}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold backdrop-blur-sm border ${
                              w.threatLevel === "Critical"
                                ? "bg-[#ff1a2e]/20 border-[#ff1a2e]/60 text-[#ff1a2e]"
                                : w.threatLevel === "Elevated"
                                ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                                : "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                            }`}
                          >
                            Threat: {w.threatLevel}
                          </span>
                        </div>
                      </div>

                      {/* Case File Identifier */}
                      <div className="text-[11px] font-mono text-gray-400 mb-1 tracking-wide">
                        {w.caseCode}
                      </div>

                      {/* Title */}
                      <h3 className="font-deathnote text-lg text-white mb-2 group-hover:text-[#ff1a2e] transition-colors tracking-wide line-clamp-2">
                        {w.title}
                      </h3>

                      {/* Time to Root */}
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400 mb-3">
                        <Clock size={12} className="text-gray-400" />
                        <span>Time to root: <strong className="text-white font-semibold">{w.timeToRoot}</strong></span>
                      </div>

                      {/* Kill Chain Summary */}
                      <div className="bg-black/75 border border-white/10 rounded p-2.5 mb-3">
                        <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1 flex items-center justify-between">
                          <span>Kill Chain</span>
                          <span className="text-[8px] text-gray-600 font-mono">TRACE</span>
                        </div>
                        <p className="text-[10px] font-mono text-gray-300 leading-tight break-words">
                          {w.killChain}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-gray-400 font-sans text-xs mb-4 line-clamp-2 leading-relaxed">
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
                        <div className="flex items-center gap-1 text-white group-hover:translate-x-1 transition-transform">
                          <span>Case File</span>
                          <ChevronRight size={13} className="text-[#ff1a2e]" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
