"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Terminal,
  Skull,
} from "lucide-react";
import Link from "next/link";
import { writeups } from "@/lib/writeups";
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
              <div className="w-12 h-12 rounded-xl bg-[#120508] border border-[#ff1a2e]/40 flex items-center justify-center text-[#ff1a2e]">
                <Skull size={24} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#ff1a2e] font-bold">
                  CLASSIFIED RECON // DECLASSIFIED FILES
                </span>
                <h1 className="text-3xl md:text-5xl font-deathnote tracking-wider text-white">
                  CASE DOSSIERS
                </h1>
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-400 font-mono mt-2">
              In-depth technical forensics, offensive attack chains, and proving ground machine post-mortems.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono mt-4 pt-3 border-t border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff1a2e] animate-pulse" />
              STATUS: {writeups.length} DECLASSIFIED ARTIFACTS AVAILABLE
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
                      <div className="w-full md:w-40 h-40 shrink-0 overflow-hidden rounded-lg border border-[#ff1a2e]/20 group-hover:border-[#ff1a2e]/60 transition-colors duration-300 bg-black/60 flex items-center justify-center">
                        <img
                          src={w.thumbnail}
                          alt={w.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        {/* Platform & Date */}
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-mono text-[#ff1a2e] bg-[#ff1a2e]/10 px-2 py-0.5 rounded border border-[#ff1a2e]/25 font-bold">
                            {w.platform}
                          </span>
                          <span className="text-[10px] font-mono text-gray-500">
                            {w.date}
                          </span>
                        </div>

                        {/* Title in Death Note font */}
                        <h2 className="text-xl md:text-2xl font-deathnote tracking-wide text-white mb-2 group-hover:text-[#ff1a2e] transition-colors duration-300">
                          {w.title}
                        </h2>

                        {/* Description */}
                        <p className="text-gray-400 font-sans text-xs md:text-sm mb-4 leading-relaxed">
                          {w.desc}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {w.tags.map((t) => (
                            <span key={t} className="skill-badge text-[11px]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Read Arrow */}
                      <div className="self-end md:self-center shrink-0 w-10 h-10 rounded-full border border-white/10 group-hover:border-[#ff1a2e] group-hover:bg-[#ff1a2e] flex items-center justify-center text-gray-400 group-hover:text-white transition-all">
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
              <div className="text-2xl font-bold text-[#ff1a2e] font-mono">{writeups.length}</div>
              <div className="text-xs text-gray-500 font-mono mt-1">Dossiers</div>
            </div>
          </div>
          <div className="double-bezel">
            <div className="double-bezel-inner p-4 text-center">
              <div className="text-2xl font-bold text-white font-mono">3</div>
              <div className="text-xs text-gray-500 font-mono mt-1">Proving Platforms</div>
            </div>
          </div>
          <div className="double-bezel">
            <div className="double-bezel-inner p-4 text-center">
              <div className="text-2xl font-bold text-[#ff1a2e] font-mono">100%</div>
              <div className="text-xs text-gray-500 font-mono mt-1">Proof of Concept</div>
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
            <span>← Return to Cyber Death Note</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
