"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Terminal,
  Mail,
  Globe,
  Shield,
  Code2,
  BookOpen,
  ExternalLink,
  ChevronDown,
  BadgeCheck,
  Award,
  KeyRound,
  ShieldCheck,
  ScanLine,
  Bot,
  Radar,
  X,
} from "lucide-react";
import {
  BootLines,
  CmdLine,
  GlitchIn,
  RedactReveal,
  ScrambleText,
  ScrollDivider,
  ScrollReadout,
  StreamLines,
  Typewriter,
  type BootLine,
} from "@/components/motion-effects";

const projects = [
  {
    title: "Tmap — Network Recon Framework",
    desc: "Interactive network discovery framework with terminal UI, automated smart port parsing, and deep enumeration workflows across 1000+ ports.",
    tech: ["Python", "Nmap", "Linux", "Shell"],
    icon: ScanLine,
    media: "/tmap-demo.gif",
    github: "https://github.com/An1En",
  },
  {
    title: "Orbia RAG Chatbot",
    desc: "AI-powered company knowledge assistant using RAG pipeline. Scrapes 50+ documents, chunks into 146 searchable fragments, retrieves context via keyword search, and generates answers via OpenRouter LLM.",
    tech: ["Python", "FastAPI", "OpenRouter", "ChromaDB", "LangChain", "Vercel"],
    icon: Bot,
    media: "/orbia-demo.gif",
    github: "https://github.com/An1En/orbia-rag-chatbot",
    link: "https://orbia-rag-chatbot.vercel.app",
  },
  {
    title: "SHADOW AI — CYBERSECURITY PENTESTING ASSISTANT",
    desc: "AI-powered cybersecurity pentesting assistant with real-time LLM integration, automated writeup and professional report generation from session data, and intelligent vulnerability analysis and exploit guidance.",
    tech: ["Next.js", "TypeScript", "OpenRouter", "GPT-4o-mini", "Tailwind CSS", "Vercel"],
    icon: Radar,
    media: "/shadow-ai-demo.gif",
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
    title: "Certified Red Team Analyst (CRTA)",
    issuer: "Cyberwarfare Labs",
    date: "2026",
    id: "6a81ab8c0c2bad5922885a8e",
    skills: ["Red Teaming", "MITRE ATT&CK", "Active Directory", "Pentesting"],
    link: "https://labs.cyberwarfare.live/credential/achievement/6a81ab8c0c2bad5922885a8e",
  },
  {
    title: "Active Directory Red Team Specialist (AD-RTS)",
    issuer: "Cyberwarfare Labs",
    date: "2026",
    id: "6a89f33f65159096bad04283",
    skills: ["AD Exploitation", "Certificate Services", "Exchange Attacks", "Lateral Movement", "ESXi Red Ops", "Data Exfiltration"],
    link: "https://labs.cyberwarfare.live/credential/achievement/6a89f33f65159096bad04283",
  },
  {
    title: "Red Hat Certified System Administrator",
    issuer: "Red Hat — Virtual Instructor-Led Training",
    date: "2025",
    skills: [
      "Linux Administration",
      "Shell Scripting",
      "User & Group Management",
      "SELinux",
      "Storage Management",
      "Networking",
      "Systemd",
      "Package Management",
    ],
  },
  {
    title: "Fundamentals of Encryption & Quantum Safe Techniques",
    issuer: "IBM — Cognitive Class",
    date: "2025",
    link: "https://courses.cognitiveclass.ai/certificates/ea5a46db8b7c4eda9cd2d6c900882c84",
    skills: [
      "Cryptography",
      "Encryption",
      "Data Security",
      "Symmetric/Asymmetric Encryption",
      "Hashing",
      "Public Key Infrastructure (PKI)",
      "Information Security",
    ],
  },
  {
    title: "Python Programmer",
    issuer: "NICEDT",
    date: "2025",
    skills: ["Python", "Object-Oriented Programming", "Data Structures", "Scripting", "Automation"],
  },
];

const writeups = [
  {
    title: "CloudSEK CTF 2026 — OSINT & Web Security Writeup",
    desc: "Comprehensive writeup covering OSINT reconnaissance through username enumeration and GitHub API exploitation, plus web security attacks including Host header injection and password reset poisoning for full admin account takeover.",
    link: "https://medium.com/@anlenjeban7/cloud-sek-ctf-2026-56a8e24508eb",
    tags: ["OSINT", "Web Security", "CTF", "Host Header Injection", "Password Reset Poisoning", "CloudSEK"],
  },
  {
    title: "AD RTS — TELECOM INC: A Full Attack Chain Walkthrough",
    desc: "Complete attack chain against an Active Directory environment — from anonymous LDAP enumeration and AS-REP Roasting through Exchange impersonation, GodPotato privilege escalation, ESC1 certificate abuse, to VMware ESXi hypervisor compromise.",
    link: "https://medium.com/@anlenjeban7/ad-rts-telecom-inc-a-full-attack-chain-walkthrough-81d3a15fadfb",
    tags: ["Active Directory", "Red Team", "Lateral Movement", "ESC1", "Privilege Escalation"],
  },
  {
    title: "HackTheBox — Oopsie Walkthrough",
    desc: "Detailed analysis of IDOR, Unrestricted File Upload, and SUID PATH Hijacking vulnerabilities with full exploitation chain and remediation strategies.",
    link: "https://medium.com/@anlenjeban7/hackthebox-oopsie-walkthrough-489bc2208d96",
    tags: ["IDOR", "Reverse Shell", "PATH Hijacking", "OWASP Top 10"],
  },
];

const BOOT_LINES: BootLine[] = [
  { text: "$ ./init.sh --profile an1en", cmd: true },
  { text: "[ OK ] loading kernel modules ......" },
  { text: "[ OK ] verifying credentials ......." },
  { text: "[ OK ] session established .........." },
];

const HANDSHAKE_LINES: BootLine[] = [
  { text: "$ ./contact.sh --target an1en@dev", cmd: true },
  { text: "[ OK ] opening port 443 ..........." },
  { text: "[ OK ] verifying handshake ........" },
  { text: "[ OK ] channel established ........" },
];

const ROLE_TEXT = "cybersecurity_researcher && pentester";

const statCards = [
  { label: "CTFs Played", value: "55+", link: "https://learn.cylabacademy.org/users/An1En" },
  { label: "Tools Built", value: "3", section: "projects" },
  { label: "Writeups Published", value: "3", section: "writeups" },
  { label: "Certifications", value: "5", section: "certifications" },
];

const socials = [
  { label: "GitHub", href: "https://github.com/An1En", icon: Code2 },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/an1en", icon: Globe },
  { label: "Medium", href: "https://medium.com/@anlenjeban7", icon: BookOpen },
  { label: "X", href: "https://x.com/4n1En", icon: X },
];

export default function Home() {
  const router = useRouter();
  const [booted, setBooted] = useState(false);
  const [handshakeDone, setHandshakeDone] = useState(false);
  const [certsOpen, setCertsOpen] = useState(false);

  const aboutRef = useRef<HTMLElement | null>(null);
  const projectsRef = useRef<HTMLElement | null>(null);
  const skillsRef = useRef<HTMLElement | null>(null);
  const certsRef = useRef<HTMLElement | null>(null);
  const writeupsRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);

  const openProject = (url?: string) => {
    if (!url) return;
    if (url.startsWith("/")) {
      router.push(url);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const openStat = (stat: (typeof statCards)[number]) => {
    if (stat.link) {
      window.open(stat.link, "_blank", "noopener,noreferrer");
    } else if (stat.section) {
      document.getElementById(stat.section)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      <ScrollReadout />

      {/* Hero: terminal boot sequence */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="max-w-4xl w-full">
          <div className="glass p-6 md:p-8 mb-8">
            <div className="flex items-center gap-2 text-[#00ff41]/60 text-sm mb-5">
              <Terminal size={14} />
              <span>~/init.sh --profile an1en</span>
              <span className="ml-auto flex items-center gap-1.5 text-[10px] text-[#00ff41]/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
                BOOT
              </span>
            </div>

            <BootLines
              lines={BOOT_LINES}
              clear
              clearDelay={200}
              speed={8}
              gap={120}
              className="font-mono text-xs md:text-sm text-[#00ff41]/90"
              onDone={() => setBooted(true)}
            />

            {booted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                <h1 className="text-3xl md:text-5xl font-bold mb-2 glitch" data-text="Anlen Jeban">
                  <span className="text-[#00ff41]">$ </span>
                  <span className="text-white">Anlen Jeban</span>
                </h1>

                <div className="text-lg md:text-xl text-[#00ffcc] mb-4 h-8">
                  <Typewriter text={ROLE_TEXT} speed={45} />
                  <span className="typing-cursor" />
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
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      className="hacker-btn text-sm flex items-center gap-2"
                    >
                      <s.icon size={16} />
                      {s.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={booted ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.2, delay: booted ? i * 0.08 : 0 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => openStat(stat)}
                className={`glass p-4 text-center ${stat.link || stat.section ? "cursor-pointer" : ""}`}
              >
                <div className="text-2xl font-bold text-[#00ff41]">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1 font-mono">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={booted ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex items-center gap-2 text-gray-600 font-mono text-xs">
            <ChevronDown size={14} className="text-[#00ff41]/30" />
            <span>scroll to scan</span>
          </div>
        </motion.div>
      </section>

      {/* About: `cat` streaming file content */}
      <section ref={aboutRef} className="py-20 px-4" id="about">
        <div className="max-w-4xl mx-auto">
          <ScrollDivider target={aboutRef} />
          <GlitchIn>
            <div className="flex items-center gap-3 mb-8">
              <Terminal size={20} className="text-[#00ff41]" />
              <h2 className="text-2xl font-bold text-white">about_me</h2>
              <span className="ml-auto text-[10px] text-gray-600 font-mono hidden sm:inline">
                FILE: about_an1en.txt
              </span>
            </div>
          </GlitchIn>

          <GlitchIn delay={0.05}>
            <div className="terminal-box p-6 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-full bg-[#ff0033]" />
                <span className="w-3 h-3 rounded-full bg-[#ffcc00]" />
                <span className="w-3 h-3 rounded-full bg-[#00ff41]" />
                <span className="ml-2">~/about_me.sh</span>
              </div>

              <div className="space-y-4 font-mono text-sm">
                <CmdLine command="cat about_an1en.txt" />
                <StreamLines
                  className="border-l-2 border-[#00ff41]/30 pl-4 space-y-3 text-gray-400"
                  lineClass=""
                  lines={[
                    <p key="1">
                      <span className="text-[#00ff41]">[+]</span> B.E. Computer Science & Engineering —{" "}
                      <span className="text-white">Sathyabama Institute (2022–2026)</span>
                    </p>,
                    <p key="2">
                      <span className="text-[#00ff41]">[+]</span> Passionate about offensive security, network
                      reconnaissance, and building tools that make pentesting faster.
                    </p>,
                    <p key="3">
                      <span className="text-[#00ff41]">[+]</span> Built <span className="text-[#00ffcc]">Tmap</span> — a
                      network recon framework that cuts scanning time by 30%.
                    </p>,
                    <p key="4">
                      <span className="text-[#00ff41]">[+]</span> Published{" "}
                      <span className="text-[#00ffcc]">HackTheBox walkthroughs</span> on Medium analyzing
                      real-world exploitation chains.
                    </p>,
                    <p key="5">
                      <span className="text-[#00ff41]">[+]</span> Experienced in{" "}
                      <span className="text-white">OWASP Top 10</span>, Linux privilege escalation, Active
                      Directory, and AI/LLM integration for security automation.
                    </p>,
                  ]}
                />
              </div>
            </div>
          </GlitchIn>
        </div>
      </section>

      {/* Projects: cards load like live processes */}
      <section ref={projectsRef} className="py-20 px-4" id="projects">
        <div className="max-w-4xl mx-auto">
          <ScrollDivider target={projectsRef} />
          <GlitchIn>
            <div className="flex items-center gap-3 mb-8">
              <Code2 size={20} className="text-[#00ff41]" />
              <h2 className="text-2xl font-bold text-white">projects</h2>
              <span className="ml-auto text-[10px] text-gray-600 font-mono hidden sm:inline">
                PROC: 3 ACTIVE
              </span>
            </div>
          </GlitchIn>

          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 16, clipPath: "inset(0 0 100% 0)" }}
                whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                viewport={{ margin: "-10% 0px" }}
                transition={{ duration: 0.25, delay: i * 0.12, ease: [0.6, 0, 0.3, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass p-6 flex flex-col group relative overflow-hidden cursor-pointer"
                onClick={() => openProject(project.link ?? project.github)}
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ margin: "-10% 0px" }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute top-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-transparent via-[#00ff41] to-transparent"
                />
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#00ff41]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex items-start justify-between mb-4 relative z-10 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-1">
                  <div className="w-11 h-11 flex items-center justify-center border border-[#00ff41]/30 text-[#00ff41] group-hover:bg-[#00ff41] group-hover:text-black transition-all duration-300 shadow-[0_0_12px_rgba(0,255,65,0.1)] group-hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]">
                    <project.icon size={20} />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-1 group-hover:translate-x-0">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} — GitHub`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-500 hover:text-[#00ff41] transition-colors hover:scale-110"
                      >
                        <Code2 size={16} />
                      </a>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target={project.link.startsWith("/") ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        aria-label={`${project.title} — Live`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-500 hover:text-[#00ff41] transition-colors hover:scale-110"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>

                {project.media && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none bg-black">
                    <img
                      src={project.media}
                      alt={`${project.title} live demo`}
                      className="project-media w-full h-full object-contain"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="project-scan absolute left-0 right-0 top-0 h-24">
                      <div className="project-scanline" />
                    </div>
                    <div className="project-live absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 border border-[#00ff41]/30 px-2 py-0.5 text-[10px] font-mono text-[#00ff41]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
                      LIVE
                    </div>
                  </div>
                )}

                <h3 className="text-lg font-bold text-[#00ff41] mb-2 relative z-10 transition-all duration-300 delay-75 group-hover:opacity-0">
                  <span className="text-gray-500">[</span> {project.title}{" "}
                  <span className="text-gray-500">]</span>
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed flex-1 relative z-10 transition-all duration-300 delay-150 group-hover:opacity-0">{project.desc}</p>
                <div className="flex flex-wrap gap-2 relative z-10 transition-all duration-300 delay-225 group-hover:opacity-0">
                  {project.tech.map((t) => (
                    <span key={t} className="skill-badge text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills: scanline sweep + compile-in tags */}
      <section ref={skillsRef} className="py-20 px-4" id="skills">
        <div className="max-w-4xl mx-auto">
          <ScrollDivider target={skillsRef} />
          <GlitchIn>
            <div className="flex items-center gap-3 mb-8">
              <Shield size={20} className="text-[#00ff41]" />
              <h2 className="text-2xl font-bold text-white">skills</h2>
              <span className="ml-auto text-[10px] text-gray-600 font-mono hidden sm:inline">
                SCAN: READY
              </span>
            </div>
          </GlitchIn>

          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skill, si) => (
              <div key={skill.category} className="terminal-box p-5 relative overflow-hidden">
                <CmdLine
                  command={`cat /skills/${skill.category.toLowerCase()}`}
                  className="text-[#00ffcc] text-sm font-bold mb-3"
                />
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item, j) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0, x: -14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ margin: "-10% 0px" }}
                      transition={{ duration: 0.15, delay: j * 0.06 + si * 0.08 }}
                      className="skill-badge"
                    >
                      <span className="text-[#00ff41] mr-1">+</span>
                      {item}
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications: brute-force decrypt reveal */}
      <section ref={certsRef} className="py-20 px-4" id="certifications">
        <div className="max-w-4xl mx-auto">
          <ScrollDivider target={certsRef} />
          <GlitchIn>
            <div className="flex items-center gap-3 mb-8">
              <BadgeCheck size={20} className="text-[#00ff41]" />
              <h2 className="text-2xl font-bold text-white">certifications</h2>
              <span className="ml-auto text-[10px] text-gray-600 font-mono hidden sm:inline">
                CIPHER: AES-256
              </span>
            </div>
          </GlitchIn>

          <GlitchIn delay={0.05}>
            <div className="terminal-box p-5 mb-6">
              <div className="flex items-center gap-2 mb-6 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-full bg-[#ff0033]" />
                <span className="w-3 h-3 rounded-full bg-[#ffcc00]" />
                <span className="w-3 h-3 rounded-full bg-[#00ff41]" />
                <span className="ml-2">~/certs.sh --decrypt</span>
              </div>
              <div className="font-mono text-sm text-gray-400 mb-4">
                <span className="text-[#00ff41]">$</span>{" "}
                <span className="text-[#00ffcc]">./certs.sh</span> --verify --show-badges
                <span className="text-gray-600"> {"//"} click to decrypt &amp; reveal credentials</span>
              </div>
              <button
                onClick={() => setCertsOpen(!certsOpen)}
                className="hacker-btn text-sm flex items-center gap-2"
                aria-expanded={certsOpen}
              >
                {certsOpen ? <ShieldCheck size={16} /> : <KeyRound size={16} />}
                {certsOpen ? "encrypt & hide" : `decrypt & reveal [${certifications.length}]`}
              </button>
            </div>
          </GlitchIn>

          <AnimatePresence>
            {certsOpen && (
              <motion.div
                key="cert-cards"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {certifications.map((cert, i) => (
                    <motion.div
                      key={cert.title}
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                      whileHover={{ scale: 1.03 }}
                      onClick={() =>
                        cert.link && window.open(cert.link, "_blank", "noopener,noreferrer")
                      }
                      className={`glass p-5 group relative overflow-hidden ${cert.link ? "cursor-pointer" : ""}`}
                    >
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ff41] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="w-10 h-10 flex items-center justify-center border border-[#00ff41]/30 text-[#00ff41] group-hover:bg-[#00ff41] group-hover:text-black transition-all duration-300">
                          <Award size={18} />
                        </div>
                        {cert.link && (
                          <a
                            href={cert.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Verify ${cert.title}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-gray-500 hover:text-[#00ff41] transition-colors flex items-center gap-1 text-xs font-mono"
                          >
                            <ShieldCheck size={14} /> verify
                          </a>
                        )}
                      </div>

                      <div className="text-[10px] font-mono mb-2">
                        <span className="text-[#ffcc00]">[+] decrypting credential_{String(i + 1).padStart(2, "0")}.enc ... [ok]</span>
                      </div>

                      <h3 className="text-white font-bold text-sm mb-1">
                        <span className="text-[#00ff41]">[+]</span>{" "}
                        <ScrambleText text={cert.title} duration={420 + i * 90} />
                      </h3>
                      <p className="text-gray-500 text-xs mb-3">
                        {cert.issuer} • {cert.date}
                        {cert.id && (
                          <>
                            <span className="mx-1 text-gray-600">|</span>
                            ID: {cert.id}
                          </>
                        )}
                      </p>

                      {cert.skills && (
                        <div className="flex flex-wrap gap-1.5">
                          {cert.skills.map((s) => (
                            <span key={s} className="skill-badge text-[10px]">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Writeups: redacted docs declassify on scroll */}
      <section ref={writeupsRef} className="py-20 px-4" id="writeups">
        <div className="max-w-4xl mx-auto">
          <ScrollDivider target={writeupsRef} />
          <GlitchIn>
            <div className="flex items-center gap-3 mb-8">
              <BookOpen size={20} className="text-[#00ff41]" />
              <h2 className="text-2xl font-bold text-white">published_writeups</h2>
              <span className="ml-auto text-[10px] text-gray-600 font-mono hidden sm:inline">
                STATUS: [ DECLASSIFIED ]
              </span>
            </div>
          </GlitchIn>

          {writeups.map((w, i) => (
            <GlitchIn key={i} delay={0.05}>
              <div className="glass p-6 relative overflow-hidden">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-[#00ff41]">
                    <RedactReveal delay={i * 0.2 + 0.05}>{w.title}</RedactReveal>
                  </h3>
                  <a href={w.link} target="_blank" className="text-gray-500 hover:text-[#00ff41] shrink-0 ml-3">
                    <ExternalLink size={16} />
                  </a>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  <RedactReveal delay={i * 0.2 + 0.25}>{w.desc}</RedactReveal>
                </p>
                <div className="flex flex-wrap gap-2">
                  {w.tags.map((t, j) => (
                    <span key={t} className="skill-badge text-xs">
                      <RedactReveal delay={i * 0.2 + 0.45 + j * 0.1}>{t}</RedactReveal>
                    </span>
                  ))}
                </div>
              </div>
            </GlitchIn>
          ))}
        </div>
      </section>

      {/* Contact: TCP handshake before links */}
      <section ref={contactRef} className="py-20 px-4" id="contact">
        <div className="max-w-4xl mx-auto">
          <ScrollDivider target={contactRef} />
          <GlitchIn>
            <div className="flex items-center gap-3 mb-8">
              <Mail size={20} className="text-[#00ff41]" />
              <h2 className="text-2xl font-bold text-white">contact</h2>
              <span className="ml-auto text-[10px] text-gray-600 font-mono hidden sm:inline">
                PORT: 443
              </span>
            </div>
          </GlitchIn>

          <GlitchIn delay={0.05}>
            <div className="terminal-box p-6 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-full bg-[#ff0033]" />
                <span className="w-3 h-3 rounded-full bg-[#ffcc00]" />
                <span className="w-3 h-3 rounded-full bg-[#00ff41]" />
                <span className="ml-2">~/contact.sh --tcp</span>
              </div>

              <BootLines
                lines={HANDSHAKE_LINES}
                speed={8}
                gap={120}
                clear
                clearDelay={200}
                startOnView
                className="font-mono text-sm text-[#00ff41]/90"
                onDone={() => setHandshakeDone(true)}
              />

              {handshakeDone && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-wrap gap-4 pt-4 border-t border-[#00ff41]/20"
                >
                  {socials.map((s, i) => (
                    <motion.a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                      className="hacker-btn text-sm flex items-center gap-2"
                    >
                      <s.icon size={16} />
                      {s.label}
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </div>
          </GlitchIn>
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
