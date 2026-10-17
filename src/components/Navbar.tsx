"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, FileText, Skull, BookOpen, Code2, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { soundManager } from "@/lib/audio";

const navItems = [
  { label: "HOME", sub: "Dossier & Overview", href: "/", icon: Skull },
  { label: "CASE STUDIES", sub: "Pentests & Audits", href: "/#cases", icon: BookOpen },
  { label: "PROJECTS", sub: "Security Tools & AI", href: "/#projects", icon: Code2 },
  { label: "WRITEUPS", sub: "Reports Archive", href: "/writeup", icon: FileText },
  { label: "ABOUT", sub: "Bio & Experience", href: "/about", icon: User },
  { label: "CONTACT", sub: "Get In Touch", href: "/#contact", icon: Mail },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setSoundEnabled(soundManager.isEnabled());
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSound = () => {
    const next = soundManager.toggle();
    setSoundEnabled(next);
  };

  const handleNavClick = () => {
    soundManager.playTick();
  };

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4 transition-all duration-300">
      <div
        className={cn(
          "max-w-5xl mx-auto rounded-full px-5 py-2.5 flex items-center justify-between transition-all duration-300",
          "border border-[#ff1a2e]/25 bg-[#07070b]/85 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.85)]",
          scrolled ? "border-[#ff1a2e]/40 shadow-[0_12px_40px_rgba(255,26,46,0.15)]" : ""
        )}
      >
        {/* Brand / Monogram */}
        <Link
          href="/"
          onClick={handleNavClick}
          className="flex items-center gap-3 group select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-full bg-[#120508] border border-[#ff1a2e]/40 flex items-center justify-center transition-transform group-hover:scale-105 group-hover:border-[#ff1a2e]">
            <span className="font-deathnote text-2xl text-[#ff1a2e] leading-none select-none deathnote-glow">
              L
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-xs text-white tracking-wide group-hover:text-[#ff1a2e] transition-colors">
                ANLEN JEBAN
              </span>
              <span className="text-[10px] font-mono text-[#ff1a2e] font-semibold">
                (AN1EN)
              </span>
            </div>
            <span className="text-[9px] font-mono text-gray-400 tracking-wider -mt-0.5">
              OFFENSIVE SECURITY // RED TEAM
            </span>
          </div>
        </Link>

        {/* Live Availability Status Pill */}
        <div
          title="Status: Online & Available for Offensive Security Engagements"
          className="hidden lg:flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 select-none shadow-[0_0_15px_rgba(16,185,129,0.15)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="tracking-wider uppercase font-semibold">AVAILABLE FOR HIRE</span>
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 relative group flex items-center gap-1.5",
                  isActive
                    ? "text-white bg-[#ff1a2e]/15 border border-[#ff1a2e]/40 font-semibold"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={13} className={isActive ? "text-[#ff1a2e]" : "text-gray-400 group-hover:text-gray-200"} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="pill-active"
                    className="absolute inset-0 rounded-full border border-[#ff1a2e]/60 -z-10 shadow-[0_0_12px_rgba(255,26,46,0.3)]"
                  />
                )}
              </Link>
            );
          })}

          {/* Audio toggle button */}
          <button
            onClick={toggleSound}
            aria-label="Toggle haptic audio"
            title={soundEnabled ? "Audio FX: Enabled" : "Audio FX: Muted"}
            className="ml-2 w-8 h-8 rounded-full border border-white/10 hover:border-[#ff1a2e]/40 bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#ff1a2e] transition-colors"
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleSound}
            aria-label="Toggle haptic audio"
            className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-gray-400"
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>
          <button
            onClick={() => {
              handleNavClick();
              setMenuOpen(!menuOpen);
            }}
            aria-label="Open menu"
            className="w-9 h-9 rounded-full border border-[#ff1a2e]/30 bg-[#ff1a2e]/10 text-[#ff1a2e] flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden max-w-5xl mx-auto mt-2 rounded-2xl border border-[#ff1a2e]/30 bg-[#07070b]/95 backdrop-blur-2xl p-4 shadow-2xl"
          >
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      handleNavClick();
                      setMenuOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl font-mono text-sm transition-colors",
                      isActive
                        ? "bg-[#ff1a2e]/15 border border-[#ff1a2e]/40 text-white font-bold"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className={isActive ? "text-[#ff1a2e]" : "text-gray-400"} />
                      <span>{item.label}</span>
                    </div>
                    {item.sub && (
                      <span className="text-[11px] text-gray-500 font-mono">
                        {item.sub}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                AVAILABLE FOR HIRE
              </span>
              <span className="text-gray-500">ANLEN JEBAN // RED TEAM</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
