"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BookOpen,
  ArrowLeft,
  ExternalLink,
  Calendar,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { getWriteupBySlug } from "@/lib/writeups";

export default function WriteupDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const writeup = getWriteupBySlug(slug);

  if (!writeup) {
    return (
      <div className="min-h-screen pt-20 px-4 pb-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Writeup Not Found</h1>
          <Link href="/writeup" className="hacker-btn text-sm">
            ← Back to Writeups
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-8">
      <div className="max-4xl mx-auto">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            href="/writeup"
            className="text-gray-500 hover:text-[#00ff41] transition-colors font-mono text-sm flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            ~/writeups
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="text-[#00ff41]" size={28} />
            <div>
              <h1 className="text-2xl font-bold text-white">{writeup.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {writeup.date}
                </span>
                <span className="flex items-center gap-1">
                  <Tag size={14} />
                  {writeup.platform}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {writeup.tags.map((t) => (
              <span key={t} className="skill-badge text-xs">
                {t}
              </span>
            ))}
          </div>

          {/* Medium Link */}
          <div className="mt-4 pt-4 border-t border-[#00ff41]/20">
            <a
              href={writeup.mediumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#00ff41] transition-colors font-mono text-sm flex items-center gap-2"
            >
              <ExternalLink size={14} />
              View on Medium
            </a>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="terminal-box p-6 md:p-8"
        >
          <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-500 border-b border-[#00ff41]/20 -mx-6 md:-mx-8 -mt-6 md:-mt-8 mb-6">
            <span className="w-3 h-3 rounded-full bg-[#ff0033]" />
            <span className="w-3 h-3 rounded-full bg-[#ffcc00]" />
            <span className="w-3 h-3 rounded-full bg-[#00ff41]" />
            <span className="ml-2">~/writeups/{writeup.slug}.md</span>
          </div>

          <div className="chat-markdown prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {writeup.content}
            </ReactMarkdown>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Link href="/writeup" className="hacker-btn text-sm flex items-center gap-2">
            <ArrowLeft size={16} />
            All Writeups
          </Link>
          <a
            href={writeup.mediumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hacker-btn text-sm flex items-center gap-2"
          >
            View on Medium
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
