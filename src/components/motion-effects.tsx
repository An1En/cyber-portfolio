"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#$@%&";

/**
 * Types text character-by-character. Starts on mount unless `start` is false.
 * Respects prefers-reduced-motion (renders full text instantly).
 */
export function Typewriter({
  text,
  speed = 24,
  start = true,
  className = "",
  onDone,
}: {
  text: string;
  speed?: number;
  start?: boolean;
  className?: string;
  onDone?: () => void;
}) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(reduced ? text.length : 0);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (reduced) {
      setCount(text.length);
      return;
    }
    if (!start) {
      setCount(0);
      doneRef.current = false;
      return;
    }
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setCount(i);
      if (i >= text.length) {
        clearInterval(iv);
        if (!doneRef.current) {
          doneRef.current = true;
          onDoneRef.current?.();
        }
      }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed, start, reduced]);

  return <span className={className}>{text.slice(0, count)}</span>;
}

/**
 * Brute-force decrypt reveal: scrambled cipher glyphs resolve into the real
 * text left-to-right when scrolled into view.
 */
export function ScrambleText({
  text,
  className = "",
  duration = 600,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [out, setOut] = useState(() =>
    reduced ? text : text.replace(/[^ ]/g, "#")
  );

  useEffect(() => {
    if (reduced) {
      setOut(text);
      return;
    }
    if (!inView) {
      setOut(text.replace(/[^ ]/g, "#"));
      return;
    }
    let frame = 0;
    const total = Math.max(1, Math.round(duration / 16));
    const iv = setInterval(() => {
      frame++;
      const locked = Math.floor((frame / total) * (text.length + 4));
      setOut(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < locked) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );
      if (frame >= total) {
        clearInterval(iv);
        setOut(text);
      }
    }, 16);
    return () => clearInterval(iv);
  }, [inView, text, duration, reduced]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {out}
    </span>
  );
}

/**
 * Redacted text: a striped blackout bar wipes away (declassifies) when the
 * content scrolls into view.
 */
export function RedactReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { margin: "-8% 0px" });
  const reduced = useReducedMotion();

  return (
    <span
      ref={ref}
      className={className}
      style={{ position: "relative", display: "inline-block" }}
    >
      {children}
      {!reduced && (
        <motion.span
          aria-hidden
          className="redact-bar"
          initial={{ clipPath: "inset(0 0 0 0)" }}
          animate={
            inView
              ? { clipPath: "inset(0 100% 0 0)" }
              : { clipPath: "inset(0 0 0 0)" }
          }
          transition={{ duration: 0.25, delay, ease: [0.4, 0, 0.2, 1] }}
        />
      )}
    </span>
  );
}

export type BootLine = {
  text: string;
  /** render the line as a user command (cyan) */
  cmd?: boolean;
  /** append " [ok]" once the line completes */
  ok?: boolean;
};

/**
 * Terminal boot sequence: lines type in one after another, then `onDone`.
 * Command lines are cyan; `ok` lines get a green "[ok]" appended.
 * With `clear`, all lines fade out after the sequence finishes — like a
 * terminal dropping back to an empty prompt.
 */
export function BootLines({
  lines,
  speed = 14,
  gap = 200,
  clear = false,
  clearDelay = 400,
  startOnView = false,
  className = "",
  onDone,
}: {
  lines: BootLine[];
  speed?: number;
  gap?: number;
  clear?: boolean;
  clearDelay?: number;
  startOnView?: boolean;
  className?: string;
  onDone?: () => void;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -15% 0px" });
  const started = reduced || !startOnView || inView;
  const [shown, setShown] = useState(reduced ? lines.length : 0);
  const [phase, setPhase] = useState<"typing" | "done">(
    reduced ? "done" : "typing"
  );
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!reduced) return;
    setShown(lines.length);
    setPhase("done");
    if (!doneRef.current) {
      doneRef.current = true;
      onDoneRef.current?.();
    }
  }, [reduced, lines.length]);

  const handleDone = (i: number) => {
    const last = i === lines.length - 1;
    setTimeout(() => {
      setShown((s) => Math.max(s, i + 1));
      if (last) {
        setPhase("done");
        setTimeout(() => {
          if (!doneRef.current) {
            doneRef.current = true;
            onDoneRef.current?.();
          }
        }, clearDelay);
      }
    }, gap);
  };

  return (
    <div ref={ref} className={className} aria-label="terminal boot">
      {lines.map((line, i) => {
        const typing = started && i === shown && phase === "typing" && !reduced;
        const visible = (i < shown || typing) && (!clear || phase === "typing");
        return (
          <div
            key={i}
            className={phase === "typing" ? "min-h-[1.5em]" : undefined}
          >
            <AnimatePresence>
              {visible && (
                <motion.div
                  className=""
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                >
                  {typing ? (
                    <Typewriter
                      text={line.text}
                      speed={speed}
                      className={line.cmd ? "text-[#00ffcc]" : undefined}
                      onDone={() => handleDone(i)}
                    />
                  ) : (
                    <span>
                      <span className={line.cmd ? "text-[#00ffcc]" : undefined}>
                        {line.text}
                      </span>
                      {line.ok && <span className="text-[#00ff41]"> [ok]</span>}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/**
 * A `$ command` line that types itself when scrolled into view.
 */
export function CmdLine({
  command,
  className = "",
  speed = 22,
}: {
  command: string;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className={className}>
      <span className="text-[#00ff41]">$ </span>
      <Typewriter
        text={command}
        speed={speed}
        start={reduced || inView}
        className="text-[#00ffcc]"
      />
      {!reduced && inView && <span className="typing-cursor" />}
    </div>
  );
}

/**
 * File content "streaming" in line-by-line (cat output).
 */
export function StreamLines({
  lines,
  className = "",
  lineClass = "",
}: {
  lines: ReactNode[];
  className?: string;
  lineClass?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduced = useReducedMotion();

  return (
    <div ref={ref} className={className}>
      {lines.map((ln, i) => (
        <motion.div
          key={i}
          initial={reduced ? false : { opacity: 0, x: -22, filter: "blur(3px)" }}
          animate={
            inView
              ? { opacity: 1, x: 0, filter: "blur(0px)" }
              : reduced
              ? { opacity: 1, x: 0, filter: "blur(0px)" }
              : { opacity: 0, x: -22, filter: "blur(3px)" }
          }
          transition={{ duration: 0.2, delay: reduced ? 0 : i * 0.15 }}
          className={lineClass}
        >
          {ln}
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Fast glitch-cut entrance (clip wipe + snap), not a slow fade.
 */
export function GlitchIn({
  children,
  className = "",
  delay = 0,
  duration = 0.22,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={
        reduced ? false : { opacity: 0, clipPath: "inset(0 0 100% 0)", y: 8 }
      }
      whileInView={
        reduced
          ? undefined
          : { opacity: 1, clipPath: "inset(0 0 0% 0)", y: 0 }
      }
      viewport={{ margin: "-10% 0px" }}
      transition={{ duration, delay, ease: [0.6, 0, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Fixed scroll progress: a top scanline that fills with scroll + a mono readout.
 */
export function ScrollReadout() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [pct, setPct] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setPct(Math.round(v * 100)));

  if (reduced) return null;

  return (
    <>
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[70] bg-[#00ff41] shadow-[0_0_12px_rgba(0,255,65,0.8)]"
      />
      <div className="fixed bottom-3 right-3 z-[70] font-mono text-[10px] text-gray-600 pointer-events-none select-none">
        [scroll {String(pct).padStart(3, "0")}%]
      </div>
    </>
  );
}

/**
 * Section divider: an always-visible green line with a bright fill segment
 * that tracks scroll progress through the section.
 */
export function ScrollDivider({
  target,
}: {
  target: RefObject<HTMLElement | null>;
}) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start 95%", "end 30%"],
  });

  return (
    <div className="section-divider relative">
      <motion.div
        style={reduced ? undefined : { scaleX: scrollYProgress }}
        className="absolute inset-0 origin-left bg-gradient-to-r from-transparent via-[#00ff41] to-transparent opacity-70"
      />
    </div>
  );
}

/**
 * Blinking block cursor for terminal boxes — kept for reuse.
 */
