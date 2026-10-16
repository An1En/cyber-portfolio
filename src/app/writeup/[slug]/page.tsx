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
} from "lucide-react";
import Link from "next/link";
import { getWriteupBySlug } from "@/lib/writeups";
import { soundManager } from "@/lib/audio";

export default function WriteupDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const writeup = getWriteupBySlug(slug);

  if (!writeup) {
    return (
      <div className="min-h-screen pt-28 px-4 pb-16 flex items-center justify-center bg-[#050507] text-[#f4f4f6]">
        <div className="text-center">
          <h1 className="text-3xl font-deathnote text-white mb-4">DOSSIER NOT FOUND</h1>
          <Link
            href="/writeup"
            onClick={() => soundManager.playTick()}
            className="hacker-btn text-xs inline-flex items-center gap-2"
          >
            ← Return to Case Archive
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
          className="mb-6"
        >
          <Link
            href="/writeup"
            onClick={() => soundManager.playTick()}
            className="text-gray-400 hover:text-[#ff1a2e] transition-colors font-mono text-xs flex items-center gap-2"
          >
            <ArrowLeft size={14} />
            <span>~/return_to_archive</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="double-bezel mb-8"
        >
          <div className="double-bezel-inner p-6 md:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#120508] border border-[#ff1a2e]/40 flex items-center justify-center text-[#ff1a2e] shrink-0">
                <Skull size={24} />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#ff1a2e] font-bold">
                  CASE DOSSIER // DECLASSIFIED REPORT
                </span>
                <h1 className="text-2xl md:text-4xl font-deathnote tracking-wider text-white mt-1">
                  {writeup.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#ff1a2e]" />
                    {writeup.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Tag size={13} className="text-[#ff1a2e]" />
                    {writeup.platform}
                  </span>
                </div>
              </div>
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
                  className="text-gray-400 hover:text-[#ff1a2e] transition-colors font-mono text-xs flex items-center gap-2"
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
              <span>~/dossiers/{writeup.slug}.md</span>
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
            <span>All Case Files</span>
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
