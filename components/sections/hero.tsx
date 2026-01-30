"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useLang } from "@/components/providers/lang-provider";
import { getT } from "@/lib/i18n";

interface Particle {
  x: number;
  y: number;
  z: number;
  angle: number;
  radius: number;
  speed: number;
  size: number;
  spiralIndex: number;
  vx: number;
  vy: number;
  offsetAngle: number;
  layer: "spiral" | "dust" | "code";
}

interface CodeFragment {
  x: number;
  y: number;
  z: number;
  text: string;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  angle: number;
  rotateSpeed: number;
}

interface GeometricElement {
  x: number;
  y: number;
  z: number;
  type: "point" | "line" | "triangle" | "square" | "circle";
  size: number;
  angle: number;
  rotateSpeed: number;
  alpha: number;
  vx: number;
  vy: number;
  points?: { x: number; y: number }[];
}

const CODE_FRAGMENTS = ["0", "1"];

function SpiralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false, clicking: false });
  const mouseTargetRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const codeFragmentsRef = useRef<CodeFragment[]>([]);
  const dustRef = useRef<Particle[]>([]);
  const geometricElementsRef = useRef<GeometricElement[]>([]);
  const titleBoundsRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const mouseTrailRef = useRef<Array<{ x: number; y: number; time: number; intensity: number; vx: number; vy: number }>>([]);
  const scrollYRef = useRef(0);
  const timeRef = useRef(0);
  const parallaxRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    const dust: Particle[] = [];
    const codeFragments: CodeFragment[] = [];
    const centerX = w / 2;
    const centerY = h / 2;

    // Layer 1: Main spiral particles (大幅增加数量和分散范围)
    const spiralCount = 8; // 从6增加到8
    const particlesPerSpiral = 280; // 从180增加到280
    
    for (let spiral = 0; spiral < spiralCount; spiral++) {
      const spiralOffset = (spiral / spiralCount) * Math.PI * 2;
      
      for (let i = 0; i < particlesPerSpiral; i++) {
        const t = i / particlesPerSpiral;
        const baseAngle = t * Math.PI * 12 + spiralOffset; // 增加螺旋圈数
        const irregularity = (Math.random() - 0.5) * 1.8; // 增加不规则性
        const radiusVariation = 1 + (Math.random() - 0.5) * 0.6; // 增加半径变化
        const baseRadius = (20 + t * Math.min(w, h) * 0.55) * radiusVariation; // 扩大分布范围
        const z = 0.15 + t * 0.85 + (Math.random() - 0.5) * 0.3; // 扩大深度范围
        const size = 0.7 + Math.random() * 1.6; // 0.7-2.3px，稍微增大

        particles.push({
          x: centerX + (Math.random() - 0.5) * w * 0.1, // 增加初始分散
          y: centerY + (Math.random() - 0.5) * h * 0.1,
          z: Math.max(0.1, Math.min(1, z)),
          angle: baseAngle,
          radius: baseRadius,
          speed: 0.001 + Math.random() * 0.002, // 稍微加快速度
          size,
          spiralIndex: spiral,
          vx: (Math.random() - 0.5) * 0.1, // 增加初始速度
          vy: (Math.random() - 0.5) * 0.1,
          offsetAngle: irregularity,
          layer: "spiral",
        });
      }
    }

    // Layer 2: Random floating dust particles (大幅增加数量和分散范围)
    for (let i = 0; i < 800; i++) { // 从450增加到800
      const angle = Math.random() * Math.PI * 2;
      const radius = 15 + Math.random() * Math.min(w, h) * 0.7; // 扩大分布范围
      const z = Math.random();
      
      dust.push({
        x: centerX + (Math.random() - 0.5) * w * 1.2, // 从0.9增加到1.2，更分散
        y: centerY + (Math.random() - 0.5) * h * 1.1, // 从0.85增加到1.1
        z: 0.08 + z * 0.7, // 扩大深度范围
        angle,
        radius,
        speed: 0.0003 + Math.random() * 0.001, // 稍微加快
        size: 0.6 + Math.random() * 1.0, // 0.6-1.6px，稍微增大
        spiralIndex: -1,
        vx: (Math.random() - 0.5) * 0.4, // 增加速度变化
        vy: (Math.random() - 0.5) * 0.3 - 0.15, // 增加向上漂移
        offsetAngle: Math.random() * Math.PI * 2,
        layer: "dust",
      });
    }

    // Layer 3: Code fragments and symbols (大幅增加数量和分散范围)
    for (let i = 0; i < 120; i++) { // 从70增加到120
      const angle = Math.random() * Math.PI * 2;
      const radius = 60 + Math.random() * Math.min(w, h) * 0.65; // 扩大分布范围
      const z = 0.15 + Math.random() * 0.7; // 扩大深度范围
      
      codeFragments.push({
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * w * 0.3, // 增加分散
        y: centerY + Math.sin(angle) * radius * 0.6 + (Math.random() - 0.5) * h * 0.3,
        z,
        text: CODE_FRAGMENTS[Math.floor(Math.random() * CODE_FRAGMENTS.length)],
        vx: (Math.random() - 0.5) * 0.3, // 增加速度
        vy: -0.1 - Math.random() * 0.25, // 增强向上漂移
        alpha: 0.1 + z * 0.16, // 稍微增加可见度
        size: 11 + z * 10, // 稍微增大
        angle: (Math.random() - 0.5) * 0.5, // 增加旋转角度
        rotateSpeed: (Math.random() - 0.5) * 0.003, // 增加旋转速度
      });
    }

    // Layer 4: Geometric elements (points, lines, shapes) - 大幅增加数量
    const geometricElements: GeometricElement[] = [];
    
    // Points (small dots) - 大幅增加
    for (let i = 0; i < 180; i++) { // 从110增加到180
      const angle = Math.random() * Math.PI * 2;
      const radius = 40 + Math.random() * Math.min(w, h) * 0.65; // 扩大分布范围
      const z = 0.1 + Math.random() * 0.8; // 扩大深度范围
      
      geometricElements.push({
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * w * 0.4, // 增加分散
        y: centerY + Math.sin(angle) * radius * 0.7 + (Math.random() - 0.5) * h * 0.4,
        z,
        type: "point",
        size: 1.2 + Math.random() * 2.5, // 稍微增大
        angle: 0,
        rotateSpeed: 0,
        alpha: 0.1 + z * 0.18, // 增加可见度
        vx: (Math.random() - 0.5) * 0.15, // 增加速度
        vy: (Math.random() - 0.5) * 0.12,
      });
    }
    
    // Lines (connecting lines) - 大幅增加
    for (let i = 0; i < 100; i++) { // 从60增加到100
      const angle = Math.random() * Math.PI * 2;
      const radius = 80 + Math.random() * Math.min(w, h) * 0.55; // 扩大分布范围
      const z = 0.15 + Math.random() * 0.7; // 扩大深度范围
      const length = 25 + Math.random() * 50; // 增加长度变化
      
      geometricElements.push({
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * w * 0.3,
        y: centerY + Math.sin(angle) * radius * 0.6 + (Math.random() - 0.5) * h * 0.3,
        z,
        type: "line",
        size: length,
        angle: angle + (Math.random() - 0.5) * 0.7, // 增加角度变化
        rotateSpeed: (Math.random() - 0.5) * 0.003, // 增加旋转速度
        alpha: 0.06 + z * 0.12, // 增加可见度
        vx: (Math.random() - 0.5) * 0.12, // 增加速度
        vy: (Math.random() - 0.5) * 0.1,
      });
    }
    
    // Triangles - 大幅增加
    for (let i = 0; i < 60; i++) { // 从35增加到60
      const angle = Math.random() * Math.PI * 2;
      const radius = 100 + Math.random() * Math.min(w, h) * 0.5; // 扩大分布范围
      const z = 0.2 + Math.random() * 0.6;
      
      geometricElements.push({
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * w * 0.25, // 增加分散
        y: centerY + Math.sin(angle) * radius * 0.6 + (Math.random() - 0.5) * h * 0.25,
        z,
        type: "triangle",
        size: 9 + Math.random() * 15, // 稍微增大
        angle: Math.random() * Math.PI * 2,
        rotateSpeed: (Math.random() - 0.5) * 0.004, // 增加旋转速度
        alpha: 0.06 + z * 0.12, // 增加可见度
        vx: (Math.random() - 0.5) * 0.1, // 增加速度
        vy: (Math.random() - 0.5) * 0.08,
      });
    }
    
    // Squares - 大幅增加
    for (let i = 0; i < 40; i++) { // 从20增加到40
      const angle = Math.random() * Math.PI * 2;
      const radius = 120 + Math.random() * Math.min(w, h) * 0.45; // 扩大分布范围
      const z = 0.25 + Math.random() * 0.6; // 扩大深度范围
      
      geometricElements.push({
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * w * 0.3, // 增加分散
        y: centerY + Math.sin(angle) * radius * 0.6 + (Math.random() - 0.5) * h * 0.3,
        z,
        type: "square",
        size: 7 + Math.random() * 12, // 稍微增大
        angle: Math.random() * Math.PI * 2,
        rotateSpeed: (Math.random() - 0.5) * 0.003, // 增加旋转速度
        alpha: 0.05 + z * 0.1, // 增加可见度
        vx: (Math.random() - 0.5) * 0.08, // 增加速度
        vy: (Math.random() - 0.5) * 0.06,
      });
    }
    
    // Circles - 大幅增加
    for (let i = 0; i < 75; i++) { // 从45增加到75
      const angle = Math.random() * Math.PI * 2;
      const radius = 70 + Math.random() * Math.min(w, h) * 0.55; // 扩大分布范围
      const z = 0.15 + Math.random() * 0.7; // 扩大深度范围
      
      geometricElements.push({
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * w * 0.35, // 增加分散
        y: centerY + Math.sin(angle) * radius * 0.65 + (Math.random() - 0.5) * h * 0.35,
        z,
        type: "circle",
        size: 3.5 + Math.random() * 10, // 稍微增大
        angle: 0,
        rotateSpeed: 0,
        alpha: 0.08 + z * 0.15, // 增加可见度
        vx: (Math.random() - 0.5) * 0.12, // 增加速度
        vy: (Math.random() - 0.5) * 0.1,
      });
    }

    particlesRef.current = particles;
    dustRef.current = dust;
    codeFragmentsRef.current = codeFragments;
    geometricElementsRef.current = geometricElements;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      initParticles(rect.width, rect.height);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // 立即更新鼠标位置，无延迟
      mouseTargetRef.current.x = mouseX;
      mouseTargetRef.current.y = mouseY;
      mouseRef.current.x = mouseX;
      mouseRef.current.y = mouseY;
      mouseRef.current.active = true;
      
      // Calculate velocity for smooth trail
      const dx = mouseTargetRef.current.x - mouseRef.current.x;
      const dy = mouseTargetRef.current.y - mouseRef.current.y;
      const velocity = Math.sqrt(dx * dx + dy * dy);
      
      // 立即更新视差目标，无延迟
      const w = rect.width;
      const h = rect.height;
      const targetX = ((mouseX - w / 2) / (w / 2)) * 30;
      const targetY = ((mouseY - h / 2) / (h / 2)) * 30;
      parallaxRef.current.targetX = targetX;
      parallaxRef.current.targetY = targetY;
      parallaxRef.current.x = targetX;
      parallaxRef.current.y = targetY;
      
      // Add to trail for subtle residual effect with velocity
      const now = Date.now();
      mouseTrailRef.current.push({
        x: mouseTargetRef.current.x,
        y: mouseTargetRef.current.y,
        time: now,
        intensity: Math.min(0.6, (mouseRef.current.clicking ? 0.8 : 0.5) + velocity * 0.005), // Reduced intensity
        vx: dx * 0.08,
        vy: dy * 0.08
      });
      
      // Keep fewer trail points for more subtle effect (last 15 points)
      if (mouseTrailRef.current.length > 15) {
        mouseTrailRef.current.shift();
      }
    };
    
    const onScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const onMouseDown = () => {
      mouseRef.current.clicking = true;
    };

    const onMouseUp = () => {
      mouseRef.current.clicking = false;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    
    // Initialize scroll position
    scrollYRef.current = window.scrollY;

    const draw = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);
      timeRef.current += 0.006;
      const time = timeRef.current;
      
      // 立即反馈，无延迟
      mouseRef.current.x = mouseTargetRef.current.x;
      mouseRef.current.y = mouseTargetRef.current.y;
      
      // 立即反馈视差效果
      parallaxRef.current.x = parallaxRef.current.targetX;
      parallaxRef.current.y = parallaxRef.current.targetY;
      
      // Parallax scroll effect - adjust particle positions based on scroll
      // Use scroll position for parallax (more direct calculation)
      const parallaxOffsetY = scrollYRef.current * 0.3; // Scroll-based parallax
      
      // Mouse-based parallax offset (space depth effect)
      const mouseParallaxX = parallaxRef.current.x;
      const mouseParallaxY = parallaxRef.current.y;

      // Very subtle background gradient centered (grayscale)
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.6);
      bgGrad.addColorStop(0, "rgba(255, 255, 255, 0.02)");
      bgGrad.addColorStop(0.4, "rgba(180, 180, 180, 0.012)");
      bgGrad.addColorStop(1, "transparent");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);


      // Draw code fragments (background layer) - parallax effect with mouse depth
      codeFragmentsRef.current.forEach((frag) => {
        // Slow drift with parallax and mouse depth effect
        // Background elements move more (further from viewer)
        const depthMultiplier = (1 - frag.z) * 1.5;
        frag.x += frag.vx + mouseParallaxX * depthMultiplier * 0.15;
        frag.y += frag.vy + parallaxOffsetY * (1 - frag.z) * 0.5 + mouseParallaxY * depthMultiplier * 0.15;
        frag.angle += frag.rotateSpeed;

        // Wrap around
        if (frag.y < -50) {
          frag.y = h + 50;
          frag.x = cx + (Math.random() - 0.5) * w * 0.8;
        }
        if (frag.x < -100) frag.x = w + 100;
        if (frag.x > w + 100) frag.x = -100;

        // Title interaction - code fragments flow around title
        const titleX = cx;
        const titleY = cy - 60;
        const titleW = w * 0.6;
        const titleH = h * 0.25;
        const titleDx = frag.x - titleX;
        const titleDy = frag.y - titleY;
        const titleDistX = Math.abs(titleDx);
        const titleDistY = Math.abs(titleDy);
        
        if (titleDistX < titleW / 2 && titleDistY < titleH / 2) {
          const pushRadius = Math.max(titleW / 2, titleH / 2);
          const distFromTitle = Math.sqrt(titleDx * titleDx + titleDy * titleDy);
          
          if (distFromTitle < pushRadius && distFromTitle > 0) {
            const pushForce = Math.pow((pushRadius - distFromTitle) / pushRadius, 1.5);
            frag.vx += (titleDx / distFromTitle) * pushForce * 1.5;
            frag.vy += (titleDy / distFromTitle) * pushForce * 1.5;
          }
        }

        // Mouse interaction - push code fragments away (enhanced)
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - frag.x;
          const dy = mouseRef.current.y - frag.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const repelRadius = mouseRef.current.clicking ? 350 : 220;
          if (dist < repelRadius && dist > 0) {
            const force = Math.pow((repelRadius - dist) / repelRadius, 1.8);
            const strength = mouseRef.current.clicking ? 5 : 2;
            frag.vx -= (dx / dist) * force * strength;
            frag.vy -= (dy / dist) * force * strength;
          }
        }

        // Damping (smoother recovery)
        frag.vx *= 0.992;
        frag.vy *= 0.992;
        frag.vy = Math.max(frag.vy, -0.3);

        // Depth-based blur effect via alpha
        const depthAlpha = frag.alpha * (0.5 + frag.z * 0.5);
        
        ctx.save();
        ctx.translate(frag.x, frag.y);
        ctx.rotate(frag.angle);
        ctx.font = `${frag.size}px "JetBrains Mono", monospace`;
        const fragGray = Math.round(80 + frag.z * 140);
        ctx.fillStyle = `rgba(${fragGray}, ${fragGray}, ${fragGray}, ${depthAlpha})`;
        ctx.textAlign = "center";
        ctx.fillText(frag.text, 0, 0);
        ctx.restore();
      });

      // Draw dust particles (middle layer - 1px random floating) - parallax effect with mouse depth
      dustRef.current.forEach((p) => {
        // Random drift with parallax and mouse depth effect
        const depthMultiplier = (1 - p.z) * 1.2;
        const baseNoiseX = Math.sin(time * 2 + p.offsetAngle) * 0.1;
        const baseNoiseY = Math.cos(time * 1.5 + p.offsetAngle) * 0.05;
        p.x += p.vx + baseNoiseX + mouseParallaxX * depthMultiplier * 0.2;
        p.y += p.vy + baseNoiseY + parallaxOffsetY * (1 - p.z) * 0.8 + mouseParallaxY * depthMultiplier * 0.2;

        // Wrap around
        if (p.y < -20) {
          p.y = h + 20;
          p.x = Math.random() * w;
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        // Title interaction - dust particles flow around title
        const titleX = cx;
        const titleY = cy - 60;
        const titleW = w * 0.6;
        const titleH = h * 0.25;
        const titleDx = p.x - titleX;
        const titleDy = p.y - titleY;
        const titleDistX = Math.abs(titleDx);
        const titleDistY = Math.abs(titleDy);
        
        if (titleDistX < titleW / 2 && titleDistY < titleH / 2) {
          const pushRadius = Math.max(titleW / 2, titleH / 2);
          const distFromTitle = Math.sqrt(titleDx * titleDx + titleDy * titleDy);
          
          if (distFromTitle < pushRadius && distFromTitle > 0) {
            const pushForce = Math.pow((pushRadius - distFromTitle) / pushRadius, 1.3);
            p.vx += (titleDx / distFromTitle) * pushForce * 2;
            p.vy += (titleDy / distFromTitle) * pushForce * 2;
          }
        }

        // Mouse interaction - enhanced for dust (stronger repulsion)
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const repelRadius = mouseRef.current.clicking ? 320 : 200;
          if (dist < repelRadius && dist > 0) {
            const force = Math.pow((repelRadius - dist) / repelRadius, 2);
            const strength = mouseRef.current.clicking ? 12 : 6;
            p.vx -= (dx / dist) * force * strength;
            p.vy -= (dy / dist) * force * strength;
          }
        }

        // Damping (smoother recovery for dust particles)
        p.vx *= 0.97;
        p.vy *= 0.97;

        // Depth-based rendering (grayscale)
        const alpha = 0.1 + p.z * 0.25;
        const blur = (1 - p.z) * 1.5;
        const gray = Math.round(60 + p.z * 160);
        const color: [number, number, number] = [gray, gray, gray];

        if (blur > 0.8) {
          // Blurry far dust
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
          grad.addColorStop(0, `rgba(${color.join(",")}, ${alpha * 0.5})`);
          grad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        } else {
          // Sharp dust
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color.join(",")}, ${alpha})`;
          ctx.fill();
        }
      });


      // Draw main spiral particles (foreground layer) with brightness overlay
      const sortedParticles = [...particlesRef.current].sort((a, b) => a.z - b.z);

      // First, update all particle positions
      sortedParticles.forEach((p) => {
        p.angle += p.speed;
        
        const spiralT = (p.angle / (Math.PI * 10)) % 1;
        const radiusJitter = Math.sin(time * 0.3 + p.offsetAngle) * 0.03;
        const currentRadius = p.radius * (1 + radiusJitter);
        const verticalOffset = spiralT * 220;
        
        // Elliptical spiral centered on screen with parallax and mouse depth
        // Foreground particles move less (closer to viewer)
        const foregroundDepthMultiplier = p.z * 0.3;
        let targetX = cx + Math.cos(p.angle + p.offsetAngle) * currentRadius + mouseParallaxX * foregroundDepthMultiplier;
        let targetY = cy + Math.sin(p.angle + p.offsetAngle) * currentRadius * 0.35 - verticalOffset + 80 + parallaxOffsetY * p.z * 1.2 + mouseParallaxY * foregroundDepthMultiplier;

        // Title interaction - particles flow around title text area
        const titleX = cx;
        const titleY = cy - 60;
        const titleW = w * 0.6;
        const titleH = h * 0.25;
        const titleDx = targetX - titleX;
        const titleDy = targetY - titleY;
        const titleDistX = Math.abs(titleDx);
        const titleDistY = Math.abs(titleDy);
        
        if (titleDistX < titleW / 2 && titleDistY < titleH / 2) {
          // Push particles away from title area, creating flow around text
          const pushRadius = Math.max(titleW / 2, titleH / 2);
          const distFromTitle = Math.sqrt(titleDx * titleDx + titleDy * titleDy);
          
          if (distFromTitle < pushRadius && distFromTitle > 0) {
            const pushForce = Math.pow((pushRadius - distFromTitle) / pushRadius, 1.2);
            const strength = 80;
            p.vx += (titleDx / distFromTitle) * pushForce * strength * 0.08;
            p.vy += (titleDy / distFromTitle) * pushForce * strength * 0.08;
          }
        }

        // Mouse interaction - strong repulsion field (enhanced)
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - targetX;
          const dy = mouseRef.current.y - targetY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const repelRadius = mouseRef.current.clicking ? 420 : 280;

          if (dist < repelRadius && dist > 0) {
            const force = Math.pow((repelRadius - dist) / repelRadius, 1.5);
            const strength = mouseRef.current.clicking ? 450 : 180;
            p.vx -= (dx / dist) * force * strength * 0.1;
            p.vy -= (dy / dist) * force * strength * 0.1;
          }
        }

        p.vx *= 0.88;
        p.vy *= 0.88;
        targetX += p.vx;
        targetY += p.vy;

        p.x = targetX;
        p.y = targetY;
      });
      
      // Calculate particle brightness based on density (overlay effect) - after positions are updated
      const particleBrightness = new Map<Particle, number>();
      sortedParticles.forEach((p) => {
        let brightnessMultiplier = 1;
        
        // Check nearby particles for overlay effect
        sortedParticles.forEach((other) => {
          if (p === other) return;
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 15 && dist > 0) { // Very close particles
            const proximity = 1 - (dist / 15);
            brightnessMultiplier += proximity * 0.5; // Brighten when close
          }
        });
        
        particleBrightness.set(p, Math.min(brightnessMultiplier, 2.5)); // Cap at 2.5x
      });

      // Now render particles with brightness overlay (grayscale)
      sortedParticles.forEach((p) => {
        const depth = p.z;
        const blur = (1 - depth) * 2.5;
        const baseAlpha = 0.12 + depth * 0.45;
        const brightnessMult = particleBrightness.get(p) || 1;
        const alpha = Math.min(baseAlpha * brightnessMult, 0.85);
        const displaySize = p.size * (0.4 + depth * 0.6);

        let gray = Math.round(70 + depth * 150);
        if (brightnessMult > 1.2) {
          gray = Math.min(255, gray + Math.round((brightnessMult - 1) * 50));
        }
        const baseColor: [number, number, number] = [gray, gray, gray];

        if (blur > 1) {
          // Far particles - blurry, out of focus
          const glowSize = displaySize * (1.5 + blur * 0.5);
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
          grad.addColorStop(0, `rgba(${baseColor.join(",")}, ${alpha * 0.35})`);
          grad.addColorStop(0.6, `rgba(${baseColor.join(",")}, ${alpha * 0.1})`);
          grad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        } else {
          // Close particles - sharp, in focus
          // Subtle glow
          const glowSize = displaySize * 2.5;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
          grad.addColorStop(0, `rgba(${baseColor.join(",")}, ${alpha * 0.15})`);
          grad.addColorStop(0.4, `rgba(${baseColor.join(",")}, ${alpha * 0.05})`);
          grad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          // Solid core 1-2px
          ctx.beginPath();
          ctx.arc(p.x, p.y, displaySize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${baseColor[0] + 30}, ${baseColor[1] + 30}, ${baseColor[2] + 30}, ${alpha * 0.9})`;
          ctx.fill();
        }
      });

      // Draw geometric elements (points, lines, shapes) - parallax effect with mouse depth
      geometricElementsRef.current.forEach((elem) => {
        const depthMultiplier = (1 - elem.z) * 1.3;
        elem.x += elem.vx + mouseParallaxX * depthMultiplier * 0.18;
        elem.y += elem.vy + parallaxOffsetY * (1 - elem.z) * 0.7 + mouseParallaxY * depthMultiplier * 0.18;
        elem.angle += elem.rotateSpeed;
        
        // Wrap around
        if (elem.y < -50) {
          elem.y = h + 50;
          elem.x = cx + (Math.random() - 0.5) * w * 0.8;
        }
        if (elem.x < -50) elem.x = w + 50;
        if (elem.x > w + 50) elem.x = -50;
        if (elem.y > h + 50) elem.y = -50;
        
        // Mouse interaction
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - elem.x;
          const dy = mouseRef.current.y - elem.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const repelRadius = mouseRef.current.clicking ? 280 : 180;
          if (dist < repelRadius && dist > 0) {
            const force = Math.pow((repelRadius - dist) / repelRadius, 1.5);
            const strength = mouseRef.current.clicking ? 4 : 2;
            elem.vx -= (dx / dist) * force * strength;
            elem.vy -= (dy / dist) * force * strength;
          }
        }
        
        // Damping
        elem.vx *= 0.99;
        elem.vy *= 0.99;
        
        // Title interaction - particles flow around title area
        const titleX = cx;
        const titleY = cy - 60;
        const titleW = w * 0.6;
        const titleH = h * 0.25;
        const dx = elem.x - titleX;
        const dy = elem.y - titleY;
        const distX = Math.abs(dx);
        const distY = Math.abs(dy);
        
        if (distX < titleW / 2 && distY < titleH / 2) {
          // Push away from title area
          const pushForce = 0.3;
          if (Math.abs(dx) > Math.abs(dy)) {
            elem.vx += (dx > 0 ? 1 : -1) * pushForce;
          } else {
            elem.vy += (dy > 0 ? 1 : -1) * pushForce;
          }
        }
        
        const depthAlpha = elem.alpha * (0.6 + elem.z * 0.4);
        const elemGray = Math.round(70 + elem.z * 150);
        const color: [number, number, number] = [elemGray, elemGray, elemGray];
        
        ctx.save();
        ctx.translate(elem.x, elem.y);
        ctx.rotate(elem.angle);
        ctx.globalAlpha = depthAlpha;
        
        switch (elem.type) {
          case "point":
            ctx.beginPath();
            ctx.arc(0, 0, elem.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color.join(",")}, ${depthAlpha})`;
            ctx.fill();
            break;
            
          case "line":
            ctx.beginPath();
            ctx.moveTo(-elem.size / 2, 0);
            ctx.lineTo(elem.size / 2, 0);
            ctx.strokeStyle = `rgba(${color.join(",")}, ${depthAlpha * 0.8})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            break;
            
          case "triangle":
            ctx.beginPath();
            const triSize = elem.size;
            ctx.moveTo(0, -triSize);
            ctx.lineTo(-triSize * 0.866, triSize * 0.5);
            ctx.lineTo(triSize * 0.866, triSize * 0.5);
            ctx.closePath();
            ctx.strokeStyle = `rgba(${color.join(",")}, ${depthAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            break;
            
          case "square":
            ctx.beginPath();
            const sqSize = elem.size;
            ctx.rect(-sqSize / 2, -sqSize / 2, sqSize, sqSize);
            ctx.strokeStyle = `rgba(${color.join(",")}, ${depthAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
            break;
            
          case "circle":
            ctx.beginPath();
            ctx.arc(0, 0, elem.size, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${color.join(",")}, ${depthAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
            break;
        }
        
        ctx.restore();
      });


      // Mouse trail - subtle gray flowing trail (refined and natural)
      const now = Date.now();
      const fadeTime = 0.8; // Shorter fade for more subtle effect
      
      if (mouseTrailRef.current.length > 1) {
        // Subtle flowing trail with smooth gradient
        for (let i = 0; i < mouseTrailRef.current.length - 1; i++) {
          const current = mouseTrailRef.current[i];
          const next = mouseTrailRef.current[i + 1];
          const age = (now - current.time) / 1000; // seconds
          
          if (age < fadeTime) {
            // Very subtle alpha, reduced intensity
            const velocityIntensity = Math.sqrt(current.vx * current.vx + current.vy * current.vy) * 0.5;
            const alpha = (1 - age / fadeTime) * current.intensity * 0.08; // Much more subtle
            const trailWidth = (1 - age / fadeTime) * (1.5 + velocityIntensity * 0.5); // Thinner trail
            
            // Gray gradient trail (no color variation)
            const grayValue = 200; // Light gray
            const gradient = ctx.createLinearGradient(current.x, current.y, next.x, next.y);
            gradient.addColorStop(0, `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${alpha * 0.6})`);
            gradient.addColorStop(1, `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${alpha * 0.2})`);
            
            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = trailWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.moveTo(current.x, current.y);
            ctx.lineTo(next.x, next.y);
            ctx.stroke();
            
            // Very subtle glow effect
            const glowSize = trailWidth * 3;
            const glowGrad = ctx.createRadialGradient(current.x, current.y, 0, current.x, current.y, glowSize);
            glowGrad.addColorStop(0, `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${alpha * 0.15})`);
            glowGrad.addColorStop(0.5, `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${alpha * 0.05})`);
            glowGrad.addColorStop(1, "transparent");
            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(current.x, current.y, glowSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        
        // Remove old trail points
        mouseTrailRef.current = mouseTrailRef.current.filter(point => (now - point.time) / 1000 < fadeTime);
      }

      // Mouse glow - subtle gray flowing light (refined and natural)
      if (mouseRef.current.active) {
        // Smaller, more subtle glow sizes
        const glowSize = mouseRef.current.clicking ? 200 : 140;
        const innerGlow = mouseRef.current.clicking ? 50 : 35;
        const midGlow = mouseRef.current.clicking ? 100 : 70;
        
        // Gray color (no color variation)
        const grayValue = 220; // Light gray
        
        // Outer subtle glow - very low opacity
        const outerGlow = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          glowSize
        );
        outerGlow.addColorStop(0, `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${mouseRef.current.clicking ? 0.02 : 0.01})`);
        outerGlow.addColorStop(0.3, `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${mouseRef.current.clicking ? 0.01 : 0.005})`);
        outerGlow.addColorStop(0.6, `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${mouseRef.current.clicking ? 0.005 : 0.002})`);
        outerGlow.addColorStop(1, "transparent");
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Mid-range subtle glow
        const midGlowGrad = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          innerGlow,
          mouseRef.current.x,
          mouseRef.current.y,
          midGlow
        );
        midGlowGrad.addColorStop(0, `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${mouseRef.current.clicking ? 0.015 : 0.008})`);
        midGlowGrad.addColorStop(0.5, `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${mouseRef.current.clicking ? 0.008 : 0.004})`);
        midGlowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = midGlowGrad;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, midGlow, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner subtle core
        const innerGlowGrad = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          innerGlow
        );
        innerGlowGrad.addColorStop(0, `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${mouseRef.current.clicking ? 0.025 : 0.012})`);
        innerGlowGrad.addColorStop(0.4, `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${mouseRef.current.clicking ? 0.012 : 0.006})`);
        innerGlowGrad.addColorStop(0.8, `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${mouseRef.current.clicking ? 0.005 : 0.002})`);
        innerGlowGrad.addColorStop(1, "transparent");
        ctx.fillStyle = innerGlowGrad;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, innerGlow, 0, Math.PI * 2);
        ctx.fill();
        
        // Very subtle rings (only when clicking, very faint)
        if (mouseRef.current.clicking) {
          // Outer ring
          ctx.beginPath();
          ctx.arc(mouseRef.current.x, mouseRef.current.y, 200, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${grayValue}, ${grayValue}, ${grayValue}, 0.015)`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          
          // Inner ring
          ctx.beginPath();
          ctx.arc(mouseRef.current.x, mouseRef.current.y, 180, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${grayValue}, ${grayValue}, ${grayValue}, 0.01)`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(animId);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full cursor-crosshair z-0"
      style={{ touchAction: "none", pointerEvents: "auto" }}
    />
  );
}

export function Hero() {
  const { lang } = useLang();
  const heroT = getT(lang).hero;
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const smoothPosRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    setMounted(true);
    
    // Track mouse position for 3D perspective effect with smooth interpolation
    const handleMouseMove = (e: MouseEvent) => {
      const targetX = e.clientX / window.innerWidth;
      const targetY = e.clientY / window.innerHeight;
      
      // Smooth interpolation
      const updatePos = () => {
        smoothPosRef.current.x += (targetX - smoothPosRef.current.x) * 0.1;
        smoothPosRef.current.y += (targetY - smoothPosRef.current.y) * 0.1;
        setMousePos({ ...smoothPosRef.current });
        
        if (Math.abs(targetX - smoothPosRef.current.x) > 0.001 || 
            Math.abs(targetY - smoothPosRef.current.y) > 0.001) {
          requestAnimationFrame(updatePos);
        }
      };
      updatePos();
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="relative h-screen flex flex-col overflow-hidden bg-background">
      {/* Spiral canvas - centered, covering 2/3 of the area */}
      <div className="absolute inset-0 z-0">
        <SpiralCanvas />
      </div>

      {/* Gradient overlays - subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pointer-events-none">
        {/* Main headline with 3D perspective effect */}
        <div 
          className={`text-center transition-all duration-1000 delay-300 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
        >
          <h1 
            className="relative"
            style={{
              transform: `
                perspective(1000px)
                rotateX(${(mousePos.y - 0.5) * 8}deg)
                rotateY(${(mousePos.x - 0.5) * -8}deg)
                translateZ(${(mousePos.x - 0.5) * 20 + (mousePos.y - 0.5) * 20}px)
              `,
              transition: 'transform 0.05s ease-out',
            }}
          >
            {/* Ghost text behind */}
            <div className="absolute inset-0 text-[clamp(2.5rem,12vw,10rem)] font-thin tracking-[-0.03em] leading-[0.9] text-foreground/[0.02] blur-[2px] select-none pointer-events-none">
              <div>SPIRAL</div>
              <div>VISION</div>
            </div>
            
            {/* Main text */}
            <div className="text-[clamp(2.5rem,12vw,10rem)] font-thin tracking-[-0.03em] leading-[0.9]">
              <div className="overflow-hidden">
                <span 
                  className={`inline-block transition-all duration-1000 delay-500 ${mounted ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
                >
                  <span className="text-foreground/90 px-5 font-light font-mono">{"Make"}</span>
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-mono font-light">Visual</span>
                </span>
              </div>
              <div className="overflow-hidden">
                <span 
                  className={`inline-block transition-all duration-1000 delay-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
                >
                  <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent font-mono font-light">{"< POWER >"}</span>
                  <span className="text-foreground/90">{""}</span>
                </span>
              </div>
            </div>
            
          </h1>
        </div>

        {/* Tagline */}
        <div className={`mt-8 md:mt-10 text-center transition-all duration-1000 delay-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <p className="text-base md:text-xl lg:text-2xl xl:text-3xl font-light text-foreground/70 tracking-wide">
            {heroT.tagline}<span className="text-primary font-medium">{heroT.taglineHighlight}</span>
          </p>
          <p className="mt-3 font-mono tracking-[0.2em] md:text-xs lg:text-sm text-zinc-700">
            VISUALIZATION × STRATEGY × INNOVATION
          </p>
        </div>

        {/* Interactive hint */}
        <div className={`mt-10 transition-all duration-1000 delay-[1200ms] ${mounted ? "opacity-100" : "opacity-0"}`}>
          <div className="flex items-center gap-3 text-[9px] font-mono text-muted-foreground/25 tracking-[0.25em]">
            <div className="w-8 h-px bg-primary/20" />
            <span className="">LOOPART</span>
            <div className="w-8 h-px bg-accent/20" />
          </div>
        </div>
      </div>

      {/* Bottom info bar */}
      <div className={`relative z-10 px-2 md:px-4 lg:px-8 xl:px-32 pb-8 transition-all duration-1000 delay-[1400ms] ${mounted ? "opacity-100" : "opacity-0"}`}>
        <div className="flex justify-between items-end">
          {/* Left - Studio info */}
          <div className="text-[10px] font-mono text-muted-foreground/35 tracking-[0.12em]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-primary/60">◈</span>
              <span>LOOPART STUDIO</span>
            </div>
            <div className="text-muted-foreground/20">BEIJING / EST.2022</div>
          </div>

          {/* Center - Scroll indicator */}
          <div className="hidden md:flex flex-col items-center gap-2">
            <span className="text-[12px] font-mono text-muted-foreground/25 tracking-[0.25em]">{heroT.scroll}</span>
            <div className="w-px h-10 bg-gradient-to-b from-primary/30 to-transparent relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-b from-primary/60 to-transparent animate-scroll-line" />
            </div>
          </div>

          {/* Right - Stats */}
          <div className="text-right text-[10px] font-mono text-muted-foreground/35 tracking-[0.1em]">
            <div className="flex items-center justify-end gap-4">
              <div>
                <span className="text-primary/70 text-sm font-light">60+</span>
                <span className="ml-1 text-muted-foreground">{heroT.enterprises}</span>
              </div>
              <div className="w-px h-3 bg-muted-foreground/15" />
              <div>
                <span className="text-accent/70 text-sm font-light">8亿+</span>
                <span className="ml-1 text-muted-foreground">{heroT.funding}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-20 left-6 lg:left-12 pointer-events-none">
        <div className="w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-primary/25 to-transparent" />
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-primary/25 to-transparent" />
        </div>
      </div>
      <div className="absolute top-20 right-6 lg:right-12 pointer-events-none">
        <div className="w-12 h-12">
          <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-accent/25 to-transparent" />
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-accent/25 to-transparent" />
        </div>
      </div>
    </section>
  );
}
