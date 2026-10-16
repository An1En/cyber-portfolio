"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { soundManager } from "@/lib/audio";
import { RotateCcw, Eye, Sparkles } from "lucide-react";

interface ThreeDeathNoteModelProps {
  className?: string;
  height?: string;
  interactive?: boolean;
}

export default function ThreeDeathNoteModel({
  className = "",
  height = "420px",
  interactive = true,
}: ThreeDeathNoteModelProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isWireframe, setIsWireframe] = useState(false);

  // References to keep across renders
  const stateRef = useRef({
    isOpen: false,
    isWireframe: false,
    targetCoverAngle: 0,
    currentCoverAngle: 0,
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
    isDragging: false,
    prevMousePos: { x: 0, y: 0 },
    rotation: { x: 0.25, y: -0.5 },
    autoRotate: true,
  });

  useEffect(() => {
    stateRef.current.isOpen = isOpen;
    stateRef.current.targetCoverAngle = isOpen ? -Math.PI * 0.78 : 0;
  }, [isOpen]);

  useEffect(() => {
    stateRef.current.isWireframe = isWireframe;
  }, [isWireframe]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const heightNum = container.clientHeight || 420;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.04);

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / heightNum, 0.1, 100);
    camera.position.set(0, 0.5, 4.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightNum);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // Group for entire book
    const bookGroup = new THREE.Group();
    scene.add(bookGroup);

    // Dimensions
    const bookW = 1.9;
    const bookH = 2.6;
    const bookT = 0.32; // Thickness

    // --- PROCEDURAL TEXTURES ---
    // 1. Cover texture with "DEATH NOTE" gothic typography
    const coverCanvas = document.createElement("canvas");
    coverCanvas.width = 1024;
    coverCanvas.height = 1400;
    const ctx = coverCanvas.getContext("2d");
    if (ctx) {
      // Dark leather background with fine grain
      ctx.fillStyle = "#0a0a0d";
      ctx.fillRect(0, 0, coverCanvas.width, coverCanvas.height);

      // Fine leather grain noise
      for (let i = 0; i < 40000; i++) {
        const x = Math.random() * coverCanvas.width;
        const y = Math.random() * coverCanvas.height;
        const alpha = Math.random() * 0.05;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillRect(x, y, 1.5, 1.5);
      }

      // Ornate silver-crimson border
      ctx.strokeStyle = "rgba(255, 26, 46, 0.4)";
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, coverCanvas.width - 80, coverCanvas.height - 80);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(55, 55, coverCanvas.width - 110, coverCanvas.height - 110);

      // Corner ornaments
      const corners = [
        [55, 55],
        [coverCanvas.width - 55, 55],
        [55, coverCanvas.height - 55],
        [coverCanvas.width - 55, coverCanvas.height - 55],
      ];
      ctx.fillStyle = "#ff1a2e";
      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Main Inscription: "DEATH NOTE"
      ctx.save();
      ctx.shadowColor = "#ff1a2e";
      ctx.shadowBlur = 18;
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 64px 'Cinzel', 'DeathNote', Georgia, serif";
      ctx.textAlign = "center";
      ctx.letterSpacing = "10px";
      ctx.fillText("DEATH NOTE", coverCanvas.width / 2, 440);
      ctx.restore();

      // Sub-inscription: "CYBER DOSSIER // AN1EN"
      ctx.fillStyle = "#ff1a2e";
      ctx.font = "500 22px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.letterSpacing = "6px";
      ctx.fillText("OFFENSIVE RED TEAM CODEX", coverCanvas.width / 2, 510);

      // Japanese subtitle: デスノート (Death Note)
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.font = "300 24px sans-serif";
      ctx.letterSpacing = "8px";
      ctx.fillText("デスノート • サイバー・ドシエ", coverCanvas.width / 2, 570);

      // Shinigami Sigil / Cross at bottom center
      ctx.strokeStyle = "rgba(255, 26, 46, 0.6)";
      ctx.lineWidth = 2;
      const cy = 960;
      const cx = coverCanvas.width / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 60);
      ctx.lineTo(cx, cy + 60);
      ctx.moveTo(cx - 40, cy - 20);
      ctx.lineTo(cx + 40, cy - 20);
      ctx.stroke();

      // Tech Attestation
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "16px monospace";
      ctx.fillText("ANLEN JEBAN • HTB ID: 019cfb0e", coverCanvas.width / 2, 1260);
    }
    const coverTexture = new THREE.CanvasTexture(coverCanvas);
    coverTexture.anisotropy = 8;

    // 2. Open Page texture with glowing cyber rules & victim targets
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = 1024;
    pageCanvas.height = 1400;
    const pageCtx = pageCanvas.getContext("2d");
    if (pageCtx) {
      // Aged parchment
      pageCtx.fillStyle = "#0c0d12";
      pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

      // Faint grid lines
      pageCtx.strokeStyle = "rgba(255, 26, 46, 0.08)";
      pageCtx.lineWidth = 1;
      for (let y = 80; y < pageCanvas.height - 80; y += 45) {
        pageCtx.beginPath();
        pageCtx.moveTo(70, y);
        pageCtx.lineTo(pageCanvas.width - 70, y);
        pageCtx.stroke();
      }

      // Header rule
      pageCtx.fillStyle = "#ff1a2e";
      pageCtx.font = "bold 32px 'JetBrains Mono', monospace";
      pageCtx.fillText("HOW TO USE IT : 0x01", 80, 140);

      pageCtx.fillStyle = "#e2e8f0";
      pageCtx.font = "20px 'JetBrains Mono', monospace";
      pageCtx.fillText("The human or system whose host", 80, 200);
      pageCtx.fillText("is written in this note shall fall.", 80, 240);
      pageCtx.fillText("Domain Admin attained in 40s.", 80, 280);

      // Inscribed victims log
      pageCtx.fillStyle = "rgba(255, 26, 46, 0.9)";
      pageCtx.font = "bold 26px 'DeathNote', 'Cinzel', serif";
      pageCtx.fillText("TARGET INVENTORY // ROOTED", 80, 390);

      const targets = [
        "1. dc.telecom.local [AD-RTS ESC1]",
        "2. oopsie.htb [HTB SUID HIJACK]",
        "3. strikevigil.portal [CLOUDSEK CTF]",
        "4. Tmap Engine [PORT AUTOMATION]",
      ];

      pageCtx.fillStyle = "#cbd5e1";
      pageCtx.font = "20px monospace";
      targets.forEach((tgt, idx) => {
        pageCtx.fillText(tgt, 85, 450 + idx * 55);
      });

      // Bottom warning
      pageCtx.fillStyle = "#ff1a2e";
      pageCtx.font = "italic 18px monospace";
      pageCtx.fillText("Every root leaves a stain.", 80, 800);
      pageCtx.fillText("彼岸花 — RED SPIDER LILY", 80, 835);
    }
    const pageTexture = new THREE.CanvasTexture(pageCanvas);

    // --- MATERIALS ---
    const coverMaterial = new THREE.MeshStandardMaterial({
      map: coverTexture,
      roughness: 0.45,
      metalness: 0.15,
      color: 0xffffff,
    });

    const leatherBackMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a0e,
      roughness: 0.6,
      metalness: 0.1,
    });

    const pageBlockMaterial = new THREE.MeshStandardMaterial({
      color: 0x14141c,
      roughness: 0.9,
      metalness: 0.05,
    });

    const openPageMaterial = new THREE.MeshStandardMaterial({
      map: pageTexture,
      roughness: 0.55,
      metalness: 0.05,
    });

    // 1. Book Pages Block (Body)
    const pageBlockGeo = new THREE.BoxGeometry(bookW - 0.06, bookH - 0.06, bookT - 0.04);
    const pageBlock = new THREE.Mesh(pageBlockGeo, [
      pageBlockMaterial, // Right edge
      pageBlockMaterial, // Left edge (spine side)
      pageBlockMaterial, // Top edge
      pageBlockMaterial, // Bottom edge
      openPageMaterial,  // Front face (visible when open)
      leatherBackMaterial, // Back face
    ]);
    pageBlock.position.set(0, 0, 0);
    pageBlock.castShadow = true;
    pageBlock.receiveShadow = true;
    bookGroup.add(pageBlock);

    // 2. Back Cover
    const backCoverGeo = new THREE.BoxGeometry(bookW, bookH, 0.025);
    const backCover = new THREE.Mesh(backCoverGeo, leatherBackMaterial);
    backCover.position.set(0, 0, -bookT / 2 - 0.0125);
    bookGroup.add(backCover);

    // 3. Spine
    const spineGeo = new THREE.CylinderGeometry(bookT / 2 + 0.015, bookT / 2 + 0.015, bookH, 16, 1, false, Math.PI * 0.5, Math.PI);
    const spine = new THREE.Mesh(spineGeo, leatherBackMaterial);
    spine.rotation.y = Math.PI * 0.5;
    spine.position.set(-bookW / 2, 0, 0);
    bookGroup.add(spine);

    // 4. Front Cover Pivot Group (Hinged on the spine at x = -bookW/2)
    const coverPivot = new THREE.Group();
    coverPivot.position.set(-bookW / 2, 0, bookT / 2);
    bookGroup.add(coverPivot);

    const frontCoverGeo = new THREE.BoxGeometry(bookW, bookH, 0.025);
    // Align front cover so its left edge is on the pivot origin
    const frontCoverMesh = new THREE.Mesh(frontCoverGeo, [
      leatherBackMaterial,
      leatherBackMaterial,
      leatherBackMaterial,
      leatherBackMaterial,
      coverMaterial, // Front face with "DEATH NOTE"
      openPageMaterial, // Inside front cover
    ]);
    frontCoverMesh.position.set(bookW / 2, 0, 0.0125);
    frontCoverMesh.castShadow = true;
    coverPivot.add(frontCoverMesh);

    // Silver Corner Protectors
    const cornerGeo = new THREE.BoxGeometry(0.12, 0.12, 0.04);
    const cornerMat = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      metalness: 0.85,
      roughness: 0.2,
    });

    const addCorner = (parent: THREE.Object3D, x: number, y: number, z: number) => {
      const c = new THREE.Mesh(cornerGeo, cornerMat);
      c.position.set(x, y, z);
      parent.add(c);
    };

    addCorner(frontCoverMesh, bookW / 2 - 0.06, bookH / 2 - 0.06, 0.02);
    addCorner(frontCoverMesh, bookW / 2 - 0.06, -bookH / 2 + 0.06, 0.02);

    // --- FLOATING PARTICLES (SHINIGAMI CRIMSON EMBERS) ---
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const scaleArray = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 6;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 5;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 4;
      scaleArray[i] = Math.random() * 0.06 + 0.02;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

    // Particle Canvas for smooth circular ember
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext("2d");
    if (pCtx) {
      const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255, 26, 46, 1)");
      grad.addColorStop(0.4, "rgba(255, 60, 80, 0.6)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 64, 64);
    }
    const particleTex = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      map: particleTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Dramatic Crimson Key Light
    const keyLight = new THREE.DirectionalLight(0xff1a2e, 2.4);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Cool rim light (Cyber aesthetic)
    const rimLight = new THREE.DirectionalLight(0x7dd3fc, 1.2);
    rimLight.position.set(-4, -2, -2);
    scene.add(rimLight);

    // Soft top fill
    const topLight = new THREE.PointLight(0xffffff, 1.5, 8);
    topLight.position.set(0, 3, 2);
    scene.add(topLight);

    // --- MOUSE & TOUCH EVENT HANDLERS ---
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      stateRef.current.mouse.targetX = normX;
      stateRef.current.mouse.targetY = normY;

      if (stateRef.current.isDragging) {
        const deltaX = e.clientX - stateRef.current.prevMousePos.x;
        const deltaY = e.clientY - stateRef.current.prevMousePos.y;
        stateRef.current.rotation.y += deltaX * 0.01;
        stateRef.current.rotation.x += deltaY * 0.01;
        stateRef.current.prevMousePos = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.autoRotate = false;
      stateRef.current.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      stateRef.current.isDragging = false;
    };

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // --- ANIMATION LOOP ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth cover opening/closing animation
      const diff = stateRef.current.targetCoverAngle - stateRef.current.currentCoverAngle;
      stateRef.current.currentCoverAngle += diff * 0.08;
      coverPivot.rotation.y = stateRef.current.currentCoverAngle;

      // Mouse Parallax & Auto-bobbing
      stateRef.current.mouse.x += (stateRef.current.mouse.targetX - stateRef.current.mouse.x) * 0.06;
      stateRef.current.mouse.y += (stateRef.current.mouse.targetY - stateRef.current.mouse.y) * 0.06;

      if (stateRef.current.autoRotate) {
        // Slow ambient hover
        bookGroup.position.y = Math.sin(elapsed * 1.5) * 0.08;
        bookGroup.rotation.y = stateRef.current.rotation.y + stateRef.current.mouse.x * 0.4 + Math.sin(elapsed * 0.6) * 0.12;
        bookGroup.rotation.x = stateRef.current.rotation.x - stateRef.current.mouse.y * 0.3;
      } else {
        bookGroup.rotation.x = stateRef.current.rotation.x;
        bookGroup.rotation.y = stateRef.current.rotation.y;
      }

      // Swirling particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += 0.008; // Float up
        if (positions[i * 3 + 1] > 2.5) {
          positions[i * 3 + 1] = -2.5;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;
      particles.rotation.y = elapsed * 0.05;

      // Wireframe mode handling
      const wire = stateRef.current.isWireframe;
      coverMaterial.wireframe = wire;
      leatherBackMaterial.wireframe = wire;
      pageBlockMaterial.wireframe = wire;
      openPageMaterial.wireframe = wire;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);

      renderer.dispose();
      coverTexture.dispose();
      pageTexture.dispose();
      particleTex.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleToggleOpen = () => {
    soundManager.playTick();
    if (!isOpen) {
      soundManager.playChime();
    }
    setIsOpen((prev) => !prev);
  };

  const handleReset = () => {
    soundManager.playTick();
    stateRef.current.rotation = { x: 0.25, y: -0.5 };
    stateRef.current.autoRotate = true;
  };

  const handleToggleWireframe = () => {
    soundManager.playTick();
    setIsWireframe((prev) => !prev);
  };

  return (
    <div className={`relative double-bezel overflow-hidden ${className}`}>
      <div className="double-bezel-inner relative overflow-hidden flex flex-col" style={{ height }}>
        
        {/* Top bar controls */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/75 border border-[#ff1a2e]/30 text-[10px] font-mono text-[#ff1a2e] backdrop-blur-md pointer-events-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1a2e] animate-pulse" />
            <span>3D CYBER TOME // WEBGL</span>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={handleToggleWireframe}
              title={isWireframe ? "Render Solid Mode" : "Render Cyber Wireframe"}
              className={`p-1.5 rounded-lg border text-xs font-mono transition-all ${
                isWireframe
                  ? "bg-[#ff1a2e] text-white border-[#ff1a2e]"
                  : "bg-black/60 border-white/10 text-gray-300 hover:text-white hover:border-[#ff1a2e]/40"
              }`}
            >
              <Eye size={13} />
            </button>

            <button
              onClick={handleReset}
              title="Reset View"
              className="p-1.5 rounded-lg bg-black/60 border border-white/10 hover:border-[#ff1a2e]/40 text-gray-300 hover:text-white transition-all text-xs font-mono"
            >
              <RotateCcw size={13} />
            </button>

            <button
              onClick={handleToggleOpen}
              className="px-3 py-1 rounded-lg bg-[#ff1a2e]/20 border border-[#ff1a2e]/50 hover:bg-[#ff1a2e] text-white transition-all text-xs font-mono flex items-center gap-1.5 font-semibold shadow-[0_0_15px_rgba(255,26,46,0.3)]"
            >
              <Sparkles size={12} />
              <span>{isOpen ? "CLOSE NOTE" : "OPEN NOTE"}</span>
            </button>
          </div>
        </div>

        {/* 3D Canvas Mount */}
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing relative"
          onClick={interactive ? handleToggleOpen : undefined}
        />

        {/* Bottom instructions bar */}
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between text-[10px] font-mono text-gray-400 pointer-events-none">
          <span className="bg-black/70 px-2.5 py-0.5 rounded border border-white/5">
            [ DRAG TO ROTATE 360° • CLICK TO {isOpen ? "CLOSE" : "OPEN"} ]
          </span>
          <span className="hidden sm:inline text-[#ff1a2e]">
            {isOpen ? "STATUS: DOSSIER DECLASSIFIED" : "STATUS: SEALED BY SHINIGAMI"}
          </span>
        </div>

      </div>
    </div>
  );
}
