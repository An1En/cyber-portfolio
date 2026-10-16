"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Terminal,
  Mail,
  Globe,
  Code2,
  BookOpen,
  ChevronDown,
  Award,
  ShieldCheck,
  ScanLine,
  Bot,
  Radar,
  X,
  Download,
  Crosshair,
  Skull,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import {
  BootLines,
  GlitchIn,
  ScrollDivider,
  ScrollReadout,
  Typewriter,
  type BootLine,
} from "@/components/motion-effects";
import AsciiLAnimation from "@/components/AsciiLAnimation";
import { soundManager } from "@/lib/audio";

const projects = [
  {
    id: "PROJ-01",
    title: "Tmap — Network Recon Framework",
    desc: "Interactive network discovery framework with terminal UI, automated smart port parsing, and deep enumeration workflows across 1000+ ports.",
    tech: ["Python", "Nmap", "Linux", "Shell"],
    icon: ScanLine,
    media: "/tmap-demo.gif",
    github: "https://github.com/An1En",
  },
  {
    id: "PROJ-02",
    title: "Orbia RAG Chatbot",
    desc: "AI-powered company knowledge assistant using RAG pipeline. Scrapes 50+ documents, chunks into 146 searchable fragments, retrieves context via keyword search, and generates answers via OpenRouter LLM.",
    tech: ["Python", "FastAPI", "OpenRouter", "ChromaDB", "LangChain", "Vercel"],
    icon: Bot,
    media: "/orbia-demo.gif",
    github: "https://github.com/An1En/orbia-rag-chatbot",
    link: "https://orbia-rag-chatbot.vercel.app",
  },
  {
    id: "PROJ-03",
    title: "SHADOW AI — CYBERSECURITY PENTESTING ASSISTANT",
    desc: "AI-powered cybersecurity pentesting assistant with real-time LLM integration, automated writeup and professional report generation from session data, and intelligent vulnerability analysis and exploit guidance.",
    tech: ["Next.js", "TypeScript", "OpenRouter", "GPT-4o-mini", "Tailwind CSS", "Vercel"],
    icon: Radar,
    media: "/shadow-ai-demo.gif",
    link: "/chatbot",
  },
];

const deathNoteRules = [
  {
    roman: "I",
    title: "PERIMETER PENETRATION",
    rule: "The host whose hostname, IP address, or domain is inscribed within this dossier shall have its security architecture enumerated, mapped, and audited without leaving anomalous forensic attribution.",
  },
  {
    roman: "II",
    title: "PRIVILEGE ESCALATION",
    rule: "Attaining domain administrative or root authority takes effect within 40 seconds of memory harvesting, ticket forging, or token impersonation.",
  },
  {
    roman: "III",
    title: "LATERAL TRAVERSAL",
    rule: "Unless the specific vector of compromise is designated beforehand, the target machine shall succumb to automated lateral movement and kernel exploitation.",
  },
  {
    roman: "IV",
    title: "ETHICAL COVENANT",
    rule: "The offensive researcher possessing this dossier operates strictly under authorized rules of engagement, certified proving grounds, and responsible disclosure standards.",
  },
];

const archiveCases = [
  {
    caseId: "CASE-2026-08",
    target: "CloudSEK CTF 2026",
    category: "OSINT & WEB SECURITY",
    finding: "Host Header Injection & Password Reset Poisoning → Admin Account Takeover",
    outcome: "GLOBAL TOP 8 FINALIST",
    link: "/writeup/cloudsek-ctf-2026",
    external: false,
    severity: "CRITICAL",
  },
  {
    caseId: "CASE-2026-04",
    target: "Telecom Inc (AD-RTS)",
    category: "ACTIVE DIRECTORY EXPLOITATION",
    finding: "LDAP Recon → AS-REP Roasting → GodPotato Esc → ESC1 Certificate Abuse → ESXi Takeover",
    outcome: "FOREST ROOT COMPROMISE",
    link: "/writeup/ad-rts-telecom-inc",
    external: false,
    severity: "DOMAIN ADMIN",
  },
  {
    caseId: "CASE-2026-02",
    target: "Hack The Box — Oopsie",
    category: "LINUX PROVING GROUNDS",
    finding: "Insecure Direct Object Reference (IDOR) & SUID PATH Hijacking",
    outcome: "ROOT FLAG CAPTURED",
    link: "/writeup/hackthebox-oopsie",
    external: false,
    severity: "SYSTEM ROOT",
  },
  {
    caseId: "CASE-2025-11",
    target: "Tmap Recon Automation",
    category: "SECURITY TOOLING",
    finding: "Automated port service fingerprinting and CVE mapping engine",
    outcome: "DEPLOYED OPEN-SOURCE",
    link: "https://github.com/An1En",
    external: true,
    severity: "OPERATIONAL",
  },
];

const skills = [
  {
    category: "Red Team & Exploitation",
    items: ["Active Directory", "Kerberoasting", "ESC1 Certificate Abuse", "BloodHound", "Metasploit", "Mimikatz", "Burp Suite Pro"],
  },
  {
    category: "Reconnaissance & OSINT",
    items: ["Tmap", "Nmap", "Maltego", "Spiderfoot", "Recon-ng", "Shodan", "Wireshark"],
  },
  {
    category: "Systems & Security Engineering",
    items: ["Linux Administration", "Bash Scripting", "Python", "SELinux", "Docker", "FastAPI", "TypeScript", "Next.js"],
  },
  {
    category: "Cryptography & Theory",
    items: ["PKI & Encryption", "Quantum Safe Methods", "Symmetric/Asymmetric Ciphers", "Hashing", "MITRE ATT&CK"],
  },
];

const certifications = [
  {
    title: "Active Directory Red Team Specialist (AD-RTS)",
    issuer: "Cyberwarfare Labs",
    date: "2026",
    id: "6a89f33f65159096bad04283",
    skills: ["AD Exploitation", "Certificate Services", "Exchange Attacks", "Lateral Movement", "ESXi Red Ops", "Data Exfiltration"],
    link: "https://labs.cyberwarfare.live/credential/achievement/6a89f33f65159096bad04283",
    image: "/cert-ad-rts.png",
  },
  {
    title: "Certified Red Team Analyst (CRTA)",
    issuer: "Cyberwarfare Labs",
    date: "2026",
    id: "6a81ab8c0c2bad5922885a8e",
    skills: ["Red Teaming", "MITRE ATT&CK", "Active Directory", "Pentesting"],
    link: "https://labs.cyberwarfare.live/credential/achievement/6a81ab8c0c2bad5922885a8e",
    image: "/cert-crta.png",
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
    image: "/cert-ibm.png",
  },
  {
    title: "Python Programmer",
    issuer: "NICEDT",
    date: "2025",
    skills: ["Python", "Object-Oriented Programming", "Data Structures", "Scripting", "Automation"],
    image: "/cert-python.jpeg",
  },
];

const BOOT_LINES: BootLine[] = [
  { text: "$ ./deathnote_init.sh --investigator an1en", cmd: true },
  { text: "[ SHINIGAMI ] acquiring target eyesight coordinates ...." },
  { text: "[ FORENSIC ] loading kerberos & token modules ............" },
  { text: "[ STATUS ] target inscribed in dossier. execution imminent." },
];

const HANDSHAKE_LINES: BootLine[] = [
  { text: "$ ./handshake.sh --target an1en@deathnote", cmd: true },
  { text: "[ OK ] verifying 4096-bit PGP fingerprint ...." },
  { text: "[ OK ] tunnel established over port 443 ......." },
  { text: "[ OK ] encrypted session open ................" },
];

const ROLE_TEXT = "OFFENSIVE_SECURITY_RESEARCHER && RED_TEAM_SPECIALIST";

const statCards = [
  { label: "Proving Grounds", value: "HTB ID", link: "https://profile.hackthebox.com/profile/019cfb0e-4078-7246-87bb-feace4b36378" },
  { label: "CTFs Conquered", value: "55+", link: "https://learn.cylabacademy.org/users/An1En" },
  { label: "Active Directory RTS", value: "SPECIALIST", section: "certifications" },
  { label: "Case Dossiers", value: "3 PUBLISHED", section: "archive" },
];

const socials = [
  { label: "Email", href: "mailto:anlenjeban7@gmail.com", icon: Mail },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/an1en", icon: Globe },
  { label: "GitHub", href: "https://github.com/An1En", icon: Code2 },
  { label: "Medium", href: "https://medium.com/@anlenjeban7", icon: BookOpen },
  { label: "X", href: "https://x.com/4n1En", icon: X },
];

export default function Home() {
  const router = useRouter();
  const [booted, setBooted] = useState(false);
  const [handshakeDone, setHandshakeDone] = useState(false);
  const [countdown, setCountdown] = useState(40);
  const [activeTab, setActiveTab] = useState<string>("ALL");

  const rulesRef = useRef<HTMLElement | null>(null);
  const archiveRef = useRef<HTMLElement | null>(null);
  const projectsRef = useRef<HTMLElement | null>(null);
  const skillsRef = useRef<HTMLElement | null>(null);
  const certsRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);

  // Shinigami Eye 40-second countdown ticker simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 40));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const openProject = (url?: string) => {
    soundManager.playTick();
    if (!url) return;
    if (url.startsWith("/")) {
      router.push(url);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const openStat = (stat: (typeof statCards)[number]) => {
    soundManager.playTick();
    if (stat.link) {
      window.open(stat.link, "_blank", "noopener,noreferrer");
    } else if (stat.section) {
      document.getElementById(stat.section)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRowHover = () => {
    soundManager.playTick();
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#f4f4f6]">
      <ScrollReadout />

      {/* HERO: DEATH NOTE INVESTIGATOR DOSSIER */}
      <section className="min-h-[100dvh] flex flex-col justify-center px-4 pt-28 pb-16 relative overflow-hidden">
        <div className="max-w-5xl mx-auto w-full">
          
          {/* Eyebrow / Shinigami Telemetry Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#ff1a2e]/10 border border-[#ff1a2e]/30 text-xs font-mono text-[#ff1a2e]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff1a2e] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff1a2e]"></span>
              </span>
              <span className="tracking-widest uppercase font-semibold">Shinigami Eyes: Active</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-300">Target Time to Root: <span className="text-[#ff1a2e] font-bold">00:00:{countdown < 10 ? `0${countdown}` : countdown}</span></span>
            </div>

            <a
              href="https://profile.hackthebox.com/profile/019cfb0e-4078-7246-87bb-feace4b36378"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playTick()}
              className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-[#ff1a2e] transition-colors"
            >
              <Skull size={13} className="text-[#ff1a2e]" />
              <span>HTB ID: 019cfb0e-4078-7246-87bb</span>
              <ArrowUpRight size={13} />
            </a>
          </div>

          {/* Macro Hacking & Gothic Header + ASCII L Animation side by side */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[#ff1a2e] mb-2 uppercase tracking-[0.25em]">
                <span>[ 0xDEAD ]</span>
                <span>•</span>
                <span>OFFENSIVE CYBER WARFARE MANIFEST</span>
              </div>
              
              <h1 className="font-deathnote text-4xl sm:text-6xl md:text-7xl text-white tracking-wider deathnote-glow">
                CYBER DOSSIER
              </h1>
              
              <p className="font-mono text-xs md:text-sm text-gray-400 tracking-wider uppercase mt-2">
                <span className="text-[#ff1a2e]">{'//'}</span> THE ADVERSARIAL CODEX • INSCRIBE TARGET HOSTS • FORENSIC ROOT EXTRACTION
              </p>
            </div>

            {/* ASCII L Animation Widget in Hero */}
            <div className="shrink-0 self-center lg:self-auto">
              <AsciiLAnimation size="md" />
            </div>
          </div>

          {/* Main Doppelrand Double-Bezel Card */}
          <div className="double-bezel mb-8">
            <div className="double-bezel-inner p-6 md:p-8">
              <div className="flex items-center gap-2 text-[#ff1a2e] text-xs font-mono mb-5 pb-3 border-b border-white/5">
                <Terminal size={14} />
                <span>~/investigation/an1en_dossier.sh</span>
                <span className="ml-auto flex items-center gap-1.5 text-[10px] text-gray-400 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff1a2e] animate-pulse" />
                  CLASSIFIED // RED TEAM
                </span>
              </div>

              <BootLines
                lines={BOOT_LINES}
                clear
                clearDelay={150}
                speed={8}
                gap={110}
                className="font-mono text-xs md:text-sm text-[#ff1a2e]"
                onDone={() => setBooted(true)}
              />

              {booted && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 pt-4 border-t border-white/5"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-3">
                    <h1 className="text-3xl md:text-6xl font-extrabold text-white tracking-tight glitch" data-text="Anlen Jeban">
                      Anlen Jeban
                    </h1>
                    <span className="font-deathnote text-lg md:text-2xl text-[#ff1a2e] tracking-wider">
                      (AN1EN)
                    </span>
                  </div>

                  <div className="text-sm md:text-base text-gray-300 font-mono mb-5 h-7 flex items-center">
                    <span className="text-[#ff1a2e] mr-2">›</span>
                    <Typewriter text={ROLE_TEXT} speed={30} />
                    <span className="typing-cursor" />
                  </div>

                  <p className="text-gray-300 font-sans text-sm md:text-base max-w-3xl mb-8 leading-relaxed">
                    <span className="text-[#ff1a2e] font-mono font-bold font-deathnote text-lg mr-1">&ldquo;</span>
                    The system whose vulnerability is inscribed within this note shall fall. Specializing in Active Directory exploitation, stealth privilege escalation, and AI-engineered offensive intelligence. Red Hat Certified, CTF competitor, and published security researcher.
                    <span className="text-[#ff1a2e] font-mono font-bold font-deathnote text-lg ml-1">&rdquo;</span>
                  </p>

                  {/* Button-in-Button CTA Architecture (High-End Visual Design) */}
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href="/chatbot"
                      onClick={() => soundManager.playTargetAcquired()}
                      className="group relative rounded-full pl-6 pr-2 py-2 bg-[#ff1a2e] text-white font-mono text-xs font-semibold flex items-center gap-3 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,26,46,0.6)] hover:scale-[1.02]"
                    >
                      <span>INITIATE SHADOW INTEL</span>
                      <span className="w-8 h-8 rounded-full bg-black/25 flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        <ArrowUpRight size={14} />
                      </span>
                    </Link>

                    <Link
                      href="/writeup"
                      onClick={() => soundManager.playTick()}
                      className="group relative rounded-full pl-6 pr-2 py-2 bg-white/5 border border-white/10 hover:border-[#ff1a2e]/40 text-gray-200 font-mono text-xs flex items-center gap-3 transition-all duration-300 hover:bg-white/10"
                    >
                      <span>CASE ARCHIVE</span>
                      <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                        <BookOpen size={13} />
                      </span>
                    </Link>

                    <a
                      href="/anlen-jeban-resume.pdf"
                      download
                      onClick={() => soundManager.playTick()}
                      className="group relative rounded-full pl-6 pr-2 py-2 bg-white/5 border border-white/10 hover:border-[#ff1a2e]/40 text-gray-200 font-mono text-xs flex items-center gap-3 transition-all duration-300 hover:bg-white/10"
                    >
                      <span>DECRYPT RESUME (CV)</span>
                      <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                        <Download size={13} />
                      </span>
                    </a>
                  </div>

                  {/* Social Links Row */}
                  <div className="flex flex-wrap gap-2.5 mt-8 pt-6 border-t border-white/5">
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundManager.playTick()}
                        className="px-3.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 hover:border-[#ff1a2e]/40 text-xs font-mono text-gray-400 hover:text-white flex items-center gap-2 transition-all hover:scale-105"
                      >
                        <s.icon size={13} className="text-[#ff1a2e]" />
                        <span>{s.label}</span>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Stats Bar Bento */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={booted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.25, delay: booted ? i * 0.08 : 0 }}
                whileHover={{ scale: 1.03, y: -2 }}
                onClick={() => openStat(stat)}
                className={`double-bezel ${stat.link || stat.section ? "cursor-pointer" : ""}`}
              >
                <div className="double-bezel-inner p-4 text-center">
                  <div className="text-xl md:text-2xl font-extrabold text-[#ff1a2e] font-mono tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1 font-mono uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Scroll down indicator */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500 font-mono text-xs">
            <ChevronDown size={14} className="text-[#ff1a2e] animate-bounce" />
            <span>SCROLL TO CONSULT NOTE RULES</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW TO USE IT (DEATH NOTE RULES OF CYBERSECURITY) */}
      <section ref={rulesRef} className="py-24 px-4 relative border-t border-[#ff1a2e]/15 bg-[#07070b]" id="rules">
        <div className="max-w-5xl mx-auto">
          <ScrollDivider target={rulesRef} />
          
          <GlitchIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#ff1a2e] font-bold">
                  RULES OF ENGAGEMENT // NOTE MANUAL
                </span>
                <h2 className="text-4xl md:text-6xl font-deathnote tracking-wider text-white mt-1">
                  HOW TO USE IT
                </h2>
              </div>
              <p className="font-mono text-xs text-gray-400 max-w-md">
                Strict operational guidelines governing vulnerability discovery, exploitation mechanics, and ethical disclosures.
              </p>
            </div>
          </GlitchIn>

          {/* Death Note Rule Bento Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {deathNoteRules.map((r, i) => (
              <motion.div
                key={r.roman}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-10% 0px" }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                onMouseEnter={handleRowHover}
                className="deathnote-card rounded-xl p-6 md:p-8 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                    <span className="font-deathnote text-3xl md:text-4xl text-[#ff1a2e] font-bold deathnote-glow">
                      RULE {r.roman}
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
                      SEC_CLAUSE // 0x0{i + 1}
                    </span>
                  </div>

                  <h3 className="font-deathnote text-lg md:text-xl text-white tracking-wide mb-3 group-hover:text-[#ff1a2e] transition-colors">
                    {r.title}
                  </h3>

                  <p className="font-sans text-sm text-gray-300 leading-relaxed italic">
                    &ldquo;{r.rule}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500">
                  <span>STATUS: CODIFIED</span>
                  <Crosshair size={12} className="text-[#ff1a2e]/60 group-hover:text-[#ff1a2e] transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 3: CLASSIFIED CASE FILES & TARGET ARCHIVE (Quang Dinh / Luke Baffait Style) */}
      <section ref={archiveRef} className="py-24 px-4 bg-[#050507]" id="archive">
        <div className="max-w-5xl mx-auto">
          <ScrollDivider target={archiveRef} />

          <GlitchIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#ff1a2e] font-bold">
                  TARGET ARCHIVE // INVESTIGATION LOG
                </span>
                <h2 className="text-3xl md:text-5xl font-deathnote tracking-wider text-white mt-1">
                  CLASSIFIED CASE FILES
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {["ALL", "RED TEAM", "OSINT", "TOOLING"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      soundManager.playTick();
                      setActiveTab(tab);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                      activeTab === tab
                        ? "bg-[#ff1a2e] text-white font-bold"
                        : "bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </GlitchIn>

          {/* Interactive Case Table */}
          <div className="double-bezel overflow-hidden">
            <div className="double-bezel-inner divide-y divide-white/5">
              {archiveCases
                .filter((c) => {
                  if (activeTab === "ALL") return true;
                  if (activeTab === "RED TEAM") return c.category.includes("ACTIVE") || c.category.includes("LINUX");
                  if (activeTab === "OSINT") return c.category.includes("OSINT");
                  if (activeTab === "TOOLING") return c.category.includes("TOOLING");
                  return true;
                })
                .map((caseItem) => (
                  <div
                    key={caseItem.caseId}
                    onMouseEnter={handleRowHover}
                    onClick={() => {
                      soundManager.playTick();
                      if (caseItem.external) {
                        window.open(caseItem.link, "_blank", "noopener,noreferrer");
                      } else {
                        router.push(caseItem.link);
                      }
                    }}
                    className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors cursor-pointer group relative"
                  >
                    <div className="flex items-start md:items-center gap-4">
                      <span className="font-mono text-xs text-[#ff1a2e] font-bold shrink-0 pt-0.5 md:pt-0">
                        [{caseItem.caseId}]
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-deathnote text-lg md:text-xl text-white group-hover:text-[#ff1a2e] transition-colors tracking-wide">
                            {caseItem.target}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-gray-400">
                            {caseItem.category}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-gray-400 mt-1 max-w-xl">
                          {caseItem.finding}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t border-white/5 md:border-0">
                      <div className="text-right">
                        <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-full bg-[#ff1a2e]/10 border border-[#ff1a2e]/30 text-[#ff1a2e] font-semibold">
                          {caseItem.outcome}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-white/10 group-hover:border-[#ff1a2e] group-hover:bg-[#ff1a2e] flex items-center justify-center text-gray-400 group-hover:text-white transition-all">
                        <ArrowUpRight size={14} />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs font-mono text-gray-500 px-2">
            <span>INDEX: 4 DECLASSIFIED INCIDENTS</span>
            <Link
              href="/writeup"
              onClick={() => soundManager.playTick()}
              className="text-[#ff1a2e] hover:underline flex items-center gap-1"
            >
              <span>View Full Dossier Index</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION 4: OFFENSIVE ARSENAL (PROJECTS) */}
      <section ref={projectsRef} className="py-24 px-4 bg-[#07070b] border-t border-white/5" id="projects">
        <div className="max-w-5xl mx-auto">
          <ScrollDivider target={projectsRef} />
          
          <GlitchIn>
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#ff1a2e] font-bold">
                  ENGINEERED WEAPONRY // RECON TOOLING
                </span>
                <h2 className="text-3xl md:text-5xl font-deathnote tracking-wider text-white mt-1">
                  OFFENSIVE PROJECTS
                </h2>
              </div>
              <span className="text-xs font-mono text-gray-500 hidden sm:inline">
                RECON & NEURAL TOOLS
              </span>
            </div>
          </GlitchIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-10% 0px" }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                onMouseEnter={handleRowHover}
                className="double-bezel cursor-pointer group"
                onClick={() => openProject(project.link ?? project.github)}
              >
                <div className="double-bezel-inner p-6 flex flex-col h-full relative overflow-hidden">
                  
                  {/* Top Bar with Icon & Project ID */}
                  <div className="flex items-start justify-between mb-4 relative z-10 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-1">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#ff1a2e]/30 text-[#ff1a2e] bg-[#ff1a2e]/10 group-hover:bg-[#ff1a2e] group-hover:text-white transition-all shadow-[0_0_15px_rgba(255,26,46,0.15)]">
                      <project.icon size={18} />
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 tracking-widest">
                      {project.id}
                    </span>
                  </div>

                  {/* Media Hover Reveal */}
                  {project.media && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-black">
                      <img
                        src={project.media}
                        alt={`${project.title} demo`}
                        className="project-media w-full h-full object-contain"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                      <div className="project-scan absolute left-0 right-0 top-0 h-24">
                        <div className="project-scanline" />
                      </div>
                      <div className="project-live absolute top-3 left-3 flex items-center gap-1.5 bg-black/80 border border-[#ff1a2e]/40 px-2.5 py-1 rounded-full text-[10px] font-mono text-[#ff1a2e]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff1a2e] animate-pulse" />
                        LIVE PREVIEW
                      </div>
                    </div>
                  )}

                  {/* Content (Fades on hover reveal) */}
                  <h3 className="font-deathnote text-lg font-bold text-white mb-2 relative z-10 transition-all duration-300 group-hover:opacity-0">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-400 font-sans text-xs md:text-sm mb-6 leading-relaxed flex-1 relative z-10 transition-all duration-300 group-hover:opacity-0">
                    {project.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 relative z-10 transition-all duration-300 group-hover:opacity-0">
                    {project.tech.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-gray-300">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Bottom links on hover */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-400 relative z-10 group-hover:text-white transition-colors">
                    <span>DEPLOYED</span>
                    <ArrowUpRight size={14} className="text-[#ff1a2e]" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: HACK THE BOX & SKILL CAPABILITIES */}
      <section ref={skillsRef} className="py-24 px-4 bg-[#050507]" id="skills">
        <div className="max-w-5xl mx-auto">
          <ScrollDivider target={skillsRef} />

          <GlitchIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#ff1a2e] font-bold">
                  PROVING GROUND TELEMETRY // CAPABILITIES
                </span>
                <h2 className="text-3xl md:text-5xl font-deathnote tracking-wider text-white mt-1">
                  TACTICAL PROFICIENCIES
                </h2>
              </div>
              <a
                href="https://profile.hackthebox.com/profile/019cfb0e-4078-7246-87bb-feace4b36378"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playTick()}
                className="inline-flex items-center gap-2 text-xs font-mono text-[#ff1a2e] hover:underline"
              >
                <Skull size={14} />
                <span>Verify HTB Offense Radar</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </GlitchIn>

          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skill, si) => (
              <div key={skill.category} className="double-bezel">
                <div className="double-bezel-inner p-6">
                  <div className="flex items-center gap-2 text-sm font-mono text-white font-bold mb-4 pb-2 border-b border-white/5">
                    <span className="text-[#ff1a2e]">›</span>
                    <span>{skill.category}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item, j) => (
                      <motion.span
                        key={item}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ margin: "-10% 0px" }}
                        transition={{ duration: 0.15, delay: j * 0.04 + si * 0.06 }}
                        onMouseEnter={handleRowHover}
                        className="skill-badge"
                      >
                        <span className="text-[#ff1a2e] mr-1">†</span>
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 6: CERTIFICATIONS & CREDENTIALS */}
      <section ref={certsRef} className="py-24 px-4 bg-[#07070b] border-t border-white/5" id="certifications">
        <div className="max-w-5xl mx-auto">
          <ScrollDivider target={certsRef} />

          <GlitchIn>
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#ff1a2e] font-bold">
                  CREDENTIAL VERIFICATION // ATTESTATION
                </span>
                <h2 className="text-3xl md:text-5xl font-deathnote tracking-wider text-white mt-1">
                  OFFICIAL CERTIFICATIONS
                </h2>
              </div>
              <span className="text-xs font-mono text-gray-500 hidden sm:inline">
                {certifications.length} AUDITED CREDENTIALS
              </span>
            </div>
          </GlitchIn>

          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((cert, i) => (
              <GlitchIn key={cert.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -6 }}
                  onMouseEnter={handleRowHover}
                  className="double-bezel cursor-pointer group"
                  onClick={() => cert.link && window.open(cert.link, "_blank", "noopener,noreferrer")}
                >
                  <div className="double-bezel-inner p-6 flex flex-col h-full relative overflow-hidden">
                    
                    {/* Certificate Image Reveal on Hover */}
                    {cert.image && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-black flex items-center justify-center">
                        <img
                          src={cert.image}
                          alt={cert.title}
                          className="cert-media w-full h-full object-contain"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                        <div className="cert-scan absolute left-0 right-0 top-0 h-24">
                          <div className="cert-scanline" />
                        </div>
                        <div className="cert-badge absolute top-3 left-3 flex items-center gap-1.5 bg-black/80 border border-[#ff1a2e]/40 px-2.5 py-1 rounded-full text-[10px] font-mono text-[#ff1a2e]">
                          <CheckCircle2 size={12} className="text-[#ff1a2e]" />
                          CRYPTOGRAPHICALLY VERIFIED
                        </div>
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4 relative z-10 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-1">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#ff1a2e]/30 text-[#ff1a2e] bg-[#ff1a2e]/10 group-hover:bg-[#ff1a2e] group-hover:text-white transition-all shadow-[0_0_15px_rgba(255,26,46,0.15)]">
                        <Award size={18} />
                      </div>
                      {cert.link && (
                        <span className="text-gray-400 hover:text-white flex items-center gap-1 text-xs font-mono">
                          <ShieldCheck size={14} className="text-[#ff1a2e]" /> verify
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-deathnote text-lg font-bold text-white mb-2 relative z-10 transition-all duration-300 group-hover:opacity-0 tracking-wide">
                      {cert.title}
                    </h3>
                    
                    {/* Issuer */}
                    <p className="text-gray-400 font-mono text-xs mb-4 flex-1 relative z-10 transition-all duration-300 group-hover:opacity-0">
                      {cert.issuer} • {cert.date}
                      {cert.id && (
                        <span className="block text-gray-500 mt-0.5 truncate">
                          ID: {cert.id}
                        </span>
                      )}
                    </p>

                    {/* Skills pills */}
                    {cert.skills && (
                      <div className="flex flex-wrap gap-1.5 relative z-10 transition-all duration-300 group-hover:opacity-0">
                        {cert.skills.slice(0, 4).map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-gray-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </GlitchIn>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: CONTACT ENCRYPTED HANDSHAKE */}
      <section ref={contactRef} className="py-24 px-4 bg-[#050507]" id="contact">
        <div className="max-w-4xl mx-auto">
          <ScrollDivider target={contactRef} />

          <GlitchIn>
            <div className="flex items-center gap-3 mb-8">
              <Mail size={22} className="text-[#ff1a2e]" />
              <h2 className="text-3xl md:text-5xl font-deathnote tracking-wider text-white">
                ENCRYPTED HANDSHAKE
              </h2>
              <span className="ml-auto text-[10px] text-gray-500 font-mono hidden sm:inline">
                PORT: 443 // TLS 1.3
              </span>
            </div>
          </GlitchIn>

          <GlitchIn delay={0.05}>
            <div className="double-bezel">
              <div className="double-bezel-inner p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6 text-xs font-mono text-gray-400 pb-3 border-b border-white/5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff1a2e]" />
                  <span>~/contact.sh --pgp --interactive</span>
                </div>

                <BootLines
                  lines={HANDSHAKE_LINES}
                  speed={8}
                  gap={110}
                  clear
                  clearDelay={180}
                  startOnView
                  className="font-mono text-xs md:text-sm text-[#ff1a2e]"
                  onDone={() => setHandshakeDone(true)}
                />

                {handshakeDone && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="pt-6 border-t border-white/5 space-y-6"
                  >
                    <p className="font-sans text-sm text-gray-300 max-w-xl leading-relaxed">
                      Channel active. Available for adversarial simulations, red team assessments, and offensive security research collaborations.
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {socials.map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                          rel="noopener noreferrer"
                          onClick={() => soundManager.playTick()}
                          className="hacker-btn text-xs flex items-center gap-2"
                        >
                          <s.icon size={14} className="text-[#ff1a2e]" />
                          <span>{s.label}</span>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </GlitchIn>
        </div>
      </section>

      {/* COLOPHON / FOOTER */}
      <footer className="border-t border-[#ff1a2e]/20 py-12 px-4 bg-[#030305]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-gray-500">
          <div className="flex items-center gap-3">
            <span className="font-deathnote text-2xl text-[#ff1a2e]">L</span>
            <span>ANLEN JEBAN (AN1EN) // THE CYBER DEATH NOTE</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>HTB ID: 019cfb0e-4078</span>
            <span>•</span>
            <span>RHCSA CERTIFIED</span>
            <span>•</span>
            <span>© 2026 MIT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
