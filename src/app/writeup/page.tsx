"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  ExternalLink,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { writeups } from "@/lib/writeups";

export default function WriteupPage() {
  return (
    <div className="min-h-screen pt-20 px-4 pb-8">
      <div className="max-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="text-[#00ff41]" size={28} />
            <div>
              <h1 className="text-2xl font-bold text-white">published_writeups</h1>
              <p className="text-sm text-gray-500 font-mono">
                Security research and CTF writeups — read directly on portfolio
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-600 font-mono mt-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
            STATUS: {writeups.length} ARTICLES PUBLISHED
          </div>
        </motion.div>

        {/* Writeup Cards */}
        <div className="space-y-6">
          {writeups.map((w, i) => {
            return (
              <motion.div
                key={w.slug}
                initial={{ opacity: 0, y: 20, clipPath: "inset(0 0 100% 0)" }}
                animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                transition={{ duration: 0.4, delay: i * 0.15, ease: [0.6, 0, 0.3, 1] }}
              >
                <Link
                  href={`/writeup/${w.slug}`}
                  className="block glass p-6 group relative overflow-hidden cursor-pointer"
                >
                  {/* Top scan line on hover */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ff41] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Glow effect */}
                  <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#00ff41]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="flex items-start justify-between gap-4 relative z-10">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 shrink-0 overflow-hidden border border-[#00ff41]/20 group-hover:border-[#00ff41]/50 transition-colors duration-300">
                        <img
                          src={w.thumbnail}
                          alt={w.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1">
                        {/* Platform & Date */}
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-mono text-[#00ffcc] bg-[#00ffcc]/10 px-2 py-0.5 border border-[#00ffcc]/20">
                            {w.platform}
                          </span>
                          <span className="text-[10px] font-mono text-gray-600">
                            {w.date}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-[#00ff41] mb-2 group-hover:text-white transition-colors duration-300">
                          <span className="text-gray-500">[</span> {w.title} <span className="text-gray-500">]</span>
                        </h3>

                        {/* Description */}
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                          {w.desc}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {w.tags.map((t) => (
                            <span key={t} className="skill-badge text-xs">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Read Arrow */}
                    <div className="text-gray-600 group-hover:text-[#00ff41] transition-colors duration-300 shrink-0 mt-1 font-mono text-xs flex items-center gap-1">
                      read
                      <ExternalLink size={14} />
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
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          <div className="glass p-4 text-center">
            <div className="text-2xl font-bold text-[#00ff41]">{writeups.length}</div>
            <div className="text-xs text-gray-500 font-mono mt-1">Articles</div>
          </div>
          <div className="glass p-4 text-center">
            <div className="text-2xl font-bold text-[#00ff41]">3</div>
            <div className="text-xs text-gray-500 font-mono mt-1">Platforms</div>
          </div>
          <div className="glass p-4 text-center">
            <div className="text-2xl font-bold text-[#00ffcc]">12+</div>
            <div className="text-xs text-gray-500 font-mono mt-1">Topics</div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <Link href="/#writeups" className="hacker-btn text-sm flex items-center gap-2">
            <Terminal size={16} />
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
