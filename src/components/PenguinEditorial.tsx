"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { soundManager } from "@/lib/audio";
import { writeups } from "@/lib/writeups";

export default function PenguinEditorial() {
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
        <div className="mb-14">
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

        {/* SELECTED WRITEUPS GRID */}
        <div>
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

      </div>

    </section>
  );
}
