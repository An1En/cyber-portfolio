"use client";

import { useEffect, useRef } from "react";

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    // Death Note / Cyber characters: Gothic, Katakana, Hex, and Symbols
    const chars = "†‡☠ψΩλ0123456789ABCDEFアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops: number[] = Array(columns).fill(1);

    const onResize = () => {
      resize();
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1);
    };

    window.addEventListener("resize", onResize);

    let lastTime = 0;
    const interval = 45; // ms between frames

    function render(time: number) {
      animationFrameId = requestAnimationFrame(render);
      if (time - lastTime < interval) return;
      lastTime = time;

      if (!ctx || !canvas) return;
      // Deep obsidian trail fade
      ctx.fillStyle = "rgba(5, 5, 7, 0.07)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const rand = Math.random();

        // Shinigami Eye Crimson & Bone highlights
        if (rand > 0.985) {
          ctx.fillStyle = "#ffffff"; // Rare bright flash
        } else if (rand > 0.94) {
          ctx.fillStyle = "#ff6b7e"; // Coral/crimson ember
        } else {
          ctx.fillStyle = "#ff1a2e"; // Deep Shinigami crimson
        }

        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="matrix-canvas"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.16,
      }}
    />
  );
}
