"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Terminal,
  Mail,
  Globe,
  Shield,
  Code2,
  BookOpen,
  ExternalLink,
  ChevronDown,
  FileText,
} from "lucide-react";

const projects = [
  {
    title: "Tmap — Network Recon Framework",
    desc: "Interactive network discovery framework with terminal UI, automated smart port parsing, and deep enumeration workflows across 1000+ ports.",
    tech: ["Python", "Nmap", "Linux", "Shell"],
    github: "https://github.com/An1En",
  },
  {
    title: "Orbia RAG Chatbot",
    desc: "AI-powered company knowledge assistant using RAG pipeline. Scrapes 50+ documents, chunks into 146 searchable fragments, retrieves context via keyword search, and generates answers via OpenRouter LLM.",
    tech: ["Python", "FastAPI", "OpenRouter", "ChromaDB", "LangChain", "Vercel"],
    link: "https://orbia-rag.vercel.app",
  },
  {
    title: "SHADOW AI Assistant",
    desc: "AI-powered cybersecurity pentesting assistant with real-time LLM integration, automated writeup and professional report generation from session data, and intelligent vulnerability analysis and exploit guidance.",
    tech: ["Next.js", "TypeScript", "OpenRouter", "GPT-4o-mini", "Tailwind CSS", "Vercel"],
    link: "/chatbot",
  },
];

const skills = [
  {
    category: "Languages",
    items: ["Python", "Java", "SQL", "TypeScript", "Bash"],
  },
  {
    category: "Security Tools",
    items: ["Nmap", "Burp Suite", "Metasploit", "Maltego", "Recon-ng"],
  },
  {
    category: "Web & Frameworks",
    items: ["Next.js", "FastAPI", "Tailwind CSS", "Prisma"],
  },
  {
    category: "Infrastructure",
    items: ["Linux", "PostgreSQL", "Redis", "Docker", "Vercel"],
  },
];

const certifications = [
  {
    title: "Red Hat Certified System Administrator",
    issuer: "Red Hat — Virtual Instructor-Led Training",
    date: "2025",
  },
  {
    title: "Fundamentals of Encryption & Quantum Safe Techniques",
    issuer: "IBM",
    date: "2025",
  },
  {
    title: "Python Programmer",
    issuer: "NICEDT",
    date: "2025",
  },
  {
    title: "Claude 101 Certificate",
    issuer: "Anthropic",
    date: "2026",
  },
];

const writeups = [
  {
    title: "HackTheBox — Oopsie Walkthrough",
    desc: "Detailed analysis of IDOR, Unrestricted File Upload, and SUID PATH Hijacking vulnerabilities with full exploitation chain and remediation strategies.",
    link: "https://medium.com/@anlenjeban7/hackthebox-oopsie-walkthrough-489bc2208d96",
    tags: ["IDOR", "Reverse Shell", "PATH Hijacking", "OWASP Top 10"],
  },
];

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const fullText = "cybersecurity_researcher && pentester";
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 50);
    const cursorInterval = setInterval(() => {
      setShowCursor((p) => !p);
    }, 500);
    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass p-6 md:p-8 mb-8">
              <div className="flex items-center gap-2 text-[#00ff41]/60 text-sm mb-6">
                <Terminal size={14} />
                <span>~/init.sh --profile an1en</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-2 glitch" data-text="Anlen Jeban">
                <span className="text-[#00ff41]">$ </span>
                <span className="text-white">Anlen Jeban</span>
              </h1>

              <div className="text-lg md:text-xl text-[#00ffcc] mb-4 h-8">
                <span>{typedText}</span>
                <span className={showCursor ? "opacity-100" : "opacity-0"}>_</span>
              </div>

              <p className="text-gray-400 font-mono text-sm md:text-base max-w-2xl mb-6 leading-relaxed">
                <span className="text-[#00ff41]">{'//'}</span> Computer Science student specializing in web penetration testing,
                network analysis, and AI-powered security tooling. CTF player, open-source contributor, and
                published cybersecurity writer.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/chatbot" className="hacker-btn text-sm flex items-center gap-2">
                  <Terminal size={16} />
                  Launch AI Assistant
                </Link>
                <a href="https://github.com/An1En" target="_blank" className="hacker-btn text-sm flex items-center gap-2">
                  <Code2 size={16} />
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/an1en" target="_blank" className="hacker-btn text-sm flex items-center gap-2">
                  <Globe size={16} />
                  LinkedIn
                </a>
                <a href="https://medium.com/@anlenjeban7" target="_blank" className="hacker-btn text-sm flex items-center gap-2">
                  <BookOpen size={16} />
                  Medium
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "CTFs Played", value: "55+" },
                { label: "Tools Built", value: "3" },
                { label: "Writeups Published", value: "2+" },
                { label: "Certifications", value: "4" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="glass p-4 text-center"
                >
                  <div className="text-2xl font-bold text-[#00ff41]">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1 font-mono">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="text-[#00ff41]/50 animate-bounce" size={24} />
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4" id="about">
        <div className="max-w-4xl mx-auto">
          <div className="section-divider" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Terminal size={20} className="text-[#00ff41]" />
              <h2 className="text-2xl font-bold text-white">about_me</h2>
            </div>

            <div className="terminal-box p-6">
              <div className="flex items-center gap-2 mb-6 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-full bg-[#ff0033]" />
                <span className="w-3 h-3 rounded-full bg-[#ffcc00]" />
                <span className="w-3 h-3 rounded-full bg-[#00ff41]" />
                <span className="ml-2">~/about_me.sh</span>
              </div>

              <div className="space-y-4 font-mono text-sm">
                <p>
                  <span className="text-[#00ff41]">$</span>{" "}
                  <span className="text-[#00ffcc]">cat</span> about_an1en.txt
                </p>
                <div className="border-l-2 border-[#00ff41]/30 pl-4 space-y-3 text-gray-400">
                  <p>
                    <span className="text-[#00ff41]">[+]</span> B.E. Computer Science & Engineering —{" "}
                    <span className="text-white">Sathyabama Institute (2022–2026)</span>
                  </p>
                  <p>
                    <span className="text-[#00ff41]">[+]</span> Passionate about offensive security, network
                    reconnaissance, and building tools that make pentesting faster.
                  </p>
                  <p>
                    <span className="text-[#00ff41]">[+]</span> Built <span className="text-[#00ffcc]">Tmap</span> — a
                    network recon framework that cuts scanning time by 30%.
                  </p>
                  <p>
                    <span className="text-[#00ff41]">[+]</span> Published{" "}
                    <span className="text-[#00ffcc]">HackTheBox walkthroughs</span> on Medium analyzing
                    real-world exploitation chains.
                  </p>
                  <p>
                    <span className="text-[#00ff41]">[+]</span> Experienced in{" "}
                    <span className="text-white">OWASP Top 10</span>, Linux privilege escalation, Active
                    Directory, and AI/LLM integration for security automation.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-4" id="projects">
        <div className="max-w-4xl mx-auto">
          <div className="section-divider" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Code2 size={20} className="text-[#00ff41]" />
              <h2 className="text-2xl font-bold text-white">projects</h2>
            </div>

            <div className="space-y-6">
              {projects.map((project, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass p-6 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-[#00ff41]">
                      <span className="text-gray-500">[</span>{" "}
                      {project.title}{" "}
                      <span className="text-gray-500">]</span>
                    </h3>
                    <div className="flex gap-2">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          className="text-gray-500 hover:text-[#00ff41] transition-colors"
                        >
                          <Code2 size={16} />
                        </a>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          className="text-gray-500 hover:text-[#00ff41] transition-colors"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{project.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span key={t} className="skill-badge text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4" id="skills">
        <div className="max-w-4xl mx-auto">
          <div className="section-divider" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Shield size={20} className="text-[#00ff41]" />
              <h2 className="text-2xl font-bold text-white">skills</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {skills.map((skill) => (
                <div key={skill.category} className="terminal-box p-5">
                  <div className="text-[#00ffcc] text-sm font-bold mb-3">
                    $ cat /skills/{skill.category.toLowerCase()}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item) => (
                      <span key={item} className="skill-badge">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 px-4" id="certifications">
        <div className="max-w-4xl mx-auto">
          <div className="section-divider" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <FileText size={20} className="text-[#00ff41]" />
              <h2 className="text-2xl font-bold text-white">certifications</h2>
            </div>

            <div className="space-y-4">
              {certifications.map((cert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass p-4 flex items-start gap-4"
                >
                  <div className="w-2 h-2 rounded-full bg-[#00ff41] mt-2 shrink-0" />
                  <div>
                    <h3 className="text-white font-bold text-sm">{cert.title}</h3>
                    <p className="text-gray-500 text-xs mt-1">
                      {cert.issuer} • {cert.date}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Writeups Section */}
      <section className="py-20 px-4" id="writeups">
        <div className="max-w-4xl mx-auto">
          <div className="section-divider" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <BookOpen size={20} className="text-[#00ff41]" />
              <h2 className="text-2xl font-bold text-white">published_writeups</h2>
            </div>

            {writeups.map((w, i) => (
              <div key={i} className="glass p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-[#00ff41]">{w.title}</h3>
                  <a href={w.link} target="_blank" className="text-gray-500 hover:text-[#00ff41]">
                    <ExternalLink size={16} />
                  </a>
                </div>
                <p className="text-gray-400 text-sm mb-4">{w.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {w.tags.map((t) => (
                    <span key={t} className="skill-badge text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4" id="contact">
        <div className="max-w-4xl mx-auto">
          <div className="section-divider" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Mail size={20} className="text-[#00ff41]" />
              <h2 className="text-2xl font-bold text-white">contact</h2>
            </div>

            <div className="glass p-6">
              <div className="text-sm text-gray-400 mb-4 font-mono">
                <span className="text-[#00ff41]">$</span> Send me a message or find me on:
              </div>
              <div className="flex flex-wrap gap-4">
                <a href="https://github.com/An1En" target="_blank" className="hacker-btn text-sm flex items-center gap-2">
                  <Code2 size={16} /> GitHub
                </a>
                <a href="https://www.linkedin.com/in/an1en" target="_blank" className="hacker-btn text-sm flex items-center gap-2">
                  <Globe size={16} /> LinkedIn
                </a>
                <a href="https://medium.com/@anlenjeban7" target="_blank" className="hacker-btn text-sm flex items-center gap-2">
                  <BookOpen size={16} /> Medium
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#00ff41]/10 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center text-gray-600 text-xs font-mono">
          <p>
            <span className="text-[#00ff41]">[an1en@portfolio]$</span> echo &quot;Built with Next.js, Tailwind CSS, and lots of coffee&quot;
          </p>
          <p className="mt-1">© 2026 Anlen Jeban • Licensed under MIT</p>
        </div>
      </footer>
    </div>
  );
}
