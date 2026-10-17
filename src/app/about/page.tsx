"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Terminal,
  BookOpen,
  Mail,
  Download,
  Globe,
  Code2,
  ExternalLink,
  Target,
} from "lucide-react";
import { soundManager } from "@/lib/audio";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28 px-4 pb-20 bg-[#050507] text-[#f4f4f6]">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Main Editorial Bio Card */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="double-bezel"
        >
          <div className="double-bezel-inner p-8 md:p-12 relative overflow-hidden">
            
            {/* Header */}
            <div className="pb-8 border-b border-white/5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#ff1a2e] mb-3">
                <span>[ OPERATOR PROFILE ]</span>
                <span>•</span>
                <span>AN1EN</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Anlen Jeban
              </h1>
              <p className="text-xs md:text-sm font-mono text-gray-400 mt-2 uppercase tracking-wider">
                Offensive Security Researcher • Active Directory Red Team Specialist • Tool Builder
              </p>
            </div>

            {/* Humanized Narrative in Sentence Form */}
            <div className="mt-8 space-y-6 text-sm md:text-base text-gray-300 font-sans leading-relaxed">
              <p>
                Hey, I’m <strong className="text-white font-semibold">Anlen Jeban</strong>, known across the offensive security community as <strong className="text-white font-semibold">AN1EN</strong>. I am a Computer Science engineer and security practitioner focused on adversarial attack simulations, Active Directory red teaming, and building tools that make complex security operations intuitive.
              </p>

              <p>
                My primary operational ground is <strong className="text-white font-semibold">Active Directory and enterprise infrastructure compromise</strong>. I spend my time auditing and dismantling Windows domain architectures—hunting for misconfigurations in Active Directory Certificate Services (AD CS ESC1–ESC8), forging Kerberos tickets through AS-REP and Kerberoasting attacks, synchronizing credentials via DCSync, orchestrating stealth lateral movement, and escalating across trust boundaries all the way to hypervisor takeovers on VMware ESXi.
              </p>

              {/* Current Objective // CPTS Preparation */}
              <div className="p-4 rounded-xl bg-black/60 border border-[#ff1a2e]/30 flex items-start gap-3.5 my-6">
                <Target size={20} className="text-[#ff1a2e] shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm">
                  <span className="font-mono text-white font-bold block mb-1">
                    Current Objective // Hack The Box CPTS Preparation
                  </span>
                  <p className="text-gray-300 leading-relaxed font-sans">
                    I am currently deep in active preparation for the <strong className="text-white font-semibold">Certified Penetration Testing Specialist (HTB CPTS)</strong>. My daily work is concentrated on full-scope network penetration testing, multi-tier pivoting and tunneling with Ligolo-ng and Chisel, web application exploit chains, and writing commercial engagement-grade security assessment reports.
                  </p>
                </div>
              </div>

              <p>
                Beyond security assessments, I have a deep passion for software engineering and offensive automation. When I noticed recurring bottlenecks during network discovery, I engineered <strong className="text-white font-semibold">Tmap</strong>—a fast, zero-dependency network discovery and port enumeration framework equipped with an interactive terminal interface. To streamline engagement reporting, I developed <strong className="text-white font-semibold">SHADOW AI</strong>, an LLM-assisted penetration testing copilot that tracks session context and synthesizes structured audit reports automatically.
              </p>

              <p>
                I hold credentials as an <strong className="text-white font-semibold">Active Directory Red Team Specialist (AD-RTS)</strong> and <strong className="text-white font-semibold">Certified Red Team Analyst (CRTA)</strong> through Cyberwarfare Labs, alongside IBM quantum-safe encryption fundamentals. In competitive CTFs, I have tackled over 55 laboratory machines on CyLab Security Academy and ranked 8th globally in the CloudSEK Hiring CTF.
              </p>

              <p>
                Everything I publish adheres to responsible disclosure and rigorous ethical guidelines: only authorized and retired proving ground targets are documented. I regularly post technical post-mortems and full attack chains on Medium to give defenders and developers the visibility needed to remediate critical vectors before genuine threat actors discover them.
              </p>
            </div>

            {/* Verified Connect Links */}
            <div className="mt-10 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
                <a
                  href="mailto:anlenjeban7@gmail.com"
                  className="px-3.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 hover:border-[#ff1a2e]/60 text-gray-300 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Mail size={13} className="text-[#ff1a2e]" />
                  <span>anlenjeban7@gmail.com</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/an1en/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 hover:border-[#ff1a2e]/60 text-gray-300 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Globe size={13} className="text-[#ff1a2e]" />
                  <span>LinkedIn</span>
                  <ExternalLink size={10} className="text-gray-500" />
                </a>
                <a
                  href="https://github.com/An1En"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 hover:border-[#ff1a2e]/60 text-gray-300 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Code2 size={13} className="text-[#ff1a2e]" />
                  <span>GitHub</span>
                  <ExternalLink size={10} className="text-gray-500" />
                </a>
                <a
                  href="https://medium.com/@anlenjeban7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 hover:border-[#ff1a2e]/60 text-gray-300 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <BookOpen size={13} className="text-[#ff1a2e]" />
                  <span>Medium</span>
                  <ExternalLink size={10} className="text-gray-500" />
                </a>
              </div>

              <a
                href="/anlen-jeban-resume.pdf"
                download
                onClick={() => soundManager.playTick()}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#ff1a2e]/10 border border-[#ff1a2e]/40 hover:bg-[#ff1a2e]/20 text-[#ff1a2e] text-xs font-mono transition-colors"
              >
                <Download size={12} />
                <span>Download CV</span>
              </a>
            </div>

          </div>
        </motion.div>

        {/* Back navigation */}
        <div className="flex items-center justify-between text-xs font-mono text-gray-500 pt-2 px-2">
          <Link
            href="/"
            onClick={() => soundManager.playTick()}
            className="hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <Terminal size={13} className="text-[#ff1a2e]" />
            <span>← Return to Home Overview</span>
          </Link>

          <Link
            href="/#cases"
            onClick={() => soundManager.playTick()}
            className="hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <span>Explore Case Studies →</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
