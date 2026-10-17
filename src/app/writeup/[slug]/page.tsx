"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Tag,
  Skull,
  Clock,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { getWriteupBySlug, RULE_ZERO_DISCLAIMER } from "@/lib/writeups";
import { soundManager } from "@/lib/audio";

export default function WriteupDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const writeup = getWriteupBySlug(slug);

  if (!writeup) {
    return (
      <div className="min-h-screen pt-28 px-4 pb-16 flex items-center justify-center bg-[#050507] text-[#f4f4f6]">
        <div className="text-center">
          <h1 className="text-3xl font-deathnote text-white mb-4">WRITEUP NOT FOUND</h1>
          <Link
            href="/writeup"
            onClick={() => soundManager.playTick()}
            className="hacker-btn text-xs inline-flex items-center gap-2"
          >
            ← Return to Writeups Archive
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 px-4 pb-16 bg-[#050507] text-[#f4f4f6]">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <Link
            href="/writeup"
            onClick={() => soundManager.playTick()}
            className="text-gray-400 hover:text-white transition-colors font-mono text-xs flex items-center gap-2"
          >
            <ArrowLeft size={14} />
            <span>← Return to Writeups</span>
          </Link>

          <span className="px-2.5 py-0.5 bg-black text-white border border-white/40 font-mono text-[11px] font-bold tracking-[0.2em] uppercase">
            {writeup.caseNumber}
          </span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="double-bezel mb-8"
        >
          <div className="double-bezel-inner p-6 md:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#120508] border border-white/20 flex items-center justify-center text-white shrink-0">
                <Skull size={24} className="text-[#ff1a2e]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-black text-white border border-white/40 font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
                    {writeup.caseNumber}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 font-bold">
                    CASE FILE // DECLASSIFIED REPORT
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                      writeup.threatLevel === "Critical"
                        ? "bg-[#ff1a2e]/20 border-[#ff1a2e]/60 text-[#ff1a2e]"
                        : writeup.threatLevel === "Elevated"
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                        : "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                    }`}
                  >
                    Threat: {writeup.threatLevel}
                  </span>
                  <span className="px-2 py-0.5 bg-black border border-white/30 text-white font-mono text-[9px] font-extrabold tracking-widest uppercase">
                    {writeup.stamp}
                  </span>
                </div>

                <h1 className="text-2xl md:text-4xl font-deathnote tracking-wider text-white mt-1">
                  {writeup.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-gray-400" />
                    {writeup.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Tag size={13} className="text-gray-400" />
                    {writeup.platform}
                  </span>
                  <span className="flex items-center gap-1.5 text-white">
                    <Clock size={13} className="text-gray-400" />
                    Time to root: <strong>{writeup.timeToRoot}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Kill Chain Box */}
            <div className="bg-black/70 border border-white/10 rounded-lg p-3 my-4">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                ATTACK KILL CHAIN SUMMARY
              </span>
              <p className="text-xs font-mono text-gray-200 break-words">
                {writeup.killChain}
              </p>
            </div>

            {/* Rule 0 Disclaimer */}
            <div className="p-3 bg-black/40 border border-white/10 rounded-lg flex items-center gap-2.5 text-xs font-mono text-gray-400">
              <ShieldAlert size={13} className="text-[#ff1a2e] shrink-0" />
              <span>{RULE_ZERO_DISCLAIMER}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
              {writeup.tags.map((t) => (
                <span key={t} className="skill-badge text-[11px]">
                  {t}
                </span>
              ))}
            </div>

            {/* External Article Link */}
            {writeup.mediumUrl && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <a
                  href={writeup.mediumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playTick()}
                  className="text-gray-400 hover:text-white transition-colors font-mono text-xs flex items-center gap-2"
                >
                  <ExternalLink size={14} className="text-[#ff1a2e]" />
                  <span>View Original Publication on Medium</span>
                </a>
              </div>
            )}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="double-bezel"
        >
          <div className="double-bezel-inner p-6 md:p-10">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 pb-4 mb-6 border-b border-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff1a2e]" />
              <span>~/cases/{writeup.caseNumber.toLowerCase()}_{writeup.slug}.md</span>
            </div>

            <div className="chat-markdown prose prose-invert max-w-none text-gray-300">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {writeup.content}
              </ReactMarkdown>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Link
            href="/writeup"
            onClick={() => soundManager.playTick()}
            className="hacker-btn text-xs flex items-center gap-2"
          >
            <ArrowLeft size={14} className="text-[#ff1a2e]" />
            <span>All Writeups</span>
          </Link>
          <a
            href={writeup.mediumUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playTick()}
            className="hacker-btn text-xs flex items-center gap-2"
          >
            <span>Read on Medium</span>
            <ExternalLink size={14} className="text-[#ff1a2e]" />
          </a>
        </div>
      </div>
    </div>
  );
}
