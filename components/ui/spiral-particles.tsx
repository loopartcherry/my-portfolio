"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  angle: number;
  radius: number;
  speed: number;
  size: number;
  opacity: number;
  type: "particle" | "code" | "symbol";
  char?: string;
}

interface FloatingElement {
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  opacity: number;
  size: number;
  life: number;
  maxLife: number;
  color: "orange" | "purple";
}

// Code-like characters and mathematical symbols
const codeChars = [
  "0", "1", "{", "}", "<", ">", "/", "=", ";", ":", 
  "fn", "let", "→", "=>", "++", "[]", "()", "&&", "||",
  "∞", "Σ", "Δ", "π", "λ", "Ω", "∂", "∫", "√", "∀",
  "//", "/*", "*/", "!=", "==", "::", ">>", "<<"
];

const geometricSymbols = ["◯", "◇", "△", "▽", "⬡", "⬢", "◈", "◎", "⊕", "⊗", "○", "□", "◻", "◊"];

// 主色: #FC6D60 -> rgb(252, 109, 96)
// Accent: #9666FF -> rgb(150, 102, 255)

export function SpiralParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const floatingRef = useRef<FloatingElement[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0, active: false, velocity: 0 });
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 12;
      const radius = 20 + (i / particleCount) * 300;
      const rand = Math.random();
      
      let type: "particle" | "code" | "symbol" = "particle";
      let char: string | undefined;
      
      if (rand > 0.88) {
        type = "code";
        char = codeChars[Math.floor(Math.random() * codeChars.length)];
      } else if (rand > 0.78) {
        type = "symbol";
        char = geometricSymbols[Math.floor(Math.random() * geometricSymbols.length)];
      }

      particles.push({
        x: width / 2,
        y: height / 2,
        z: Math.random() * 400 - 200,
        angle: angle,
        radius: radius,
        speed: 0.0008 + Math.random() * 0.0015,
        size: type === "particle" ? 1 + Math.random() * 2.5 : 8 + Math.random() * 6,
        opacity: 0.15 + Math.random() * 0.4,
        type,
        char,
      });
    }

    particlesRef.current = particles;
  }, []);

  const spawnFloatingElement = useCallback((x: number, y: number, velocity: number) => {
    if (floatingRef.current.length > 50) return;
    
    const isCode = Math.random() > 0.4;
    const text = isCode 
      ? codeChars[Math.floor(Math.random() * codeChars.length)]
      : geometricSymbols[Math.floor(Math.random() * geometricSymbols.length)];
    
    const angle = Math.random() * Math.PI * 2;
    const speed = (0.3 + Math.random() * 1.2) * Math.min(velocity * 0.1, 2);
    
    floatingRef.current.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.5,
      text,
      opacity: 0.7 + Math.random() * 0.3,
      size: 10 + Math.random() * 10,
      life: 0,
      maxLife: 80 + Math.random() * 80,
      color: Math.random() > 0.5 ? "orange" : "purple",
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      initParticles(rect.width, rect.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;
      
      const dx = newX - mouseRef.current.prevX;
      const dy = newY - mouseRef.current.prevY;
      const velocity = Math.sqrt(dx * dx + dy * dy);
      
      // Spawn floating elements based on mouse speed
      if (velocity > 5 && Math.random() > 0.6) {
        spawnFloatingElement(newX, newY, velocity);
      }
      
      mouseRef.current = {
        x: newX,
        y: newY,
        prevX: newX,
        prevY: newY,
        active: true,
        velocity,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      timeRef.current += 0.016;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const time = timeRef.current;

      // Background fractal grid - very subtle
      ctx.globalAlpha = 0.025;
      ctx.strokeStyle = "#9666FF";
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < 5; i++) {
        const gridSize = 60 + i * 30;
        const offset = (time * 8 + i * 15) % gridSize;
        
        ctx.beginPath();
        for (let x = offset; x < rect.width; x += gridSize) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, rect.height);
        }
        for (let y = offset; y < rect.height; y += gridSize) {
          ctx.moveTo(0, y);
          ctx.lineTo(rect.width, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Draw subtle radial gradient from center
      const centerGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, Math.max(rect.width, rect.height) * 0.6
      );
      centerGradient.addColorStop(0, "rgba(252, 109, 96, 0.03)");
      centerGradient.addColorStop(0.5, "rgba(150, 102, 255, 0.02)");
      centerGradient.addColorStop(1, "transparent");
      ctx.fillStyle = centerGradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Mouse influence area visualization
      if (mouseRef.current.active) {
        const mouseGradient = ctx.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 0,
          mouseRef.current.x, mouseRef.current.y, 180
        );
        mouseGradient.addColorStop(0, "rgba(252, 109, 96, 0.05)");
        mouseGradient.addColorStop(0.5, "rgba(150, 102, 255, 0.03)");
        mouseGradient.addColorStop(1, "transparent");
        ctx.fillStyle = mouseGradient;
        ctx.fillRect(0, 0, rect.width, rect.height);
      }

      // Draw connections between nearby particles
      particlesRef.current.forEach((particle, i) => {
        particle.angle += particle.speed;
        particle.z = ((particle.z + 0.15 + 400) % 400) - 200;
        
        const spiralX = Math.cos(particle.angle) * particle.radius;
        const spiralY = Math.sin(particle.angle) * particle.radius * 0.35;
        
        const perspective = 600 / (600 + particle.z);
        const baseX = centerX + spiralX * perspective;
        const baseY = centerY + spiralY * perspective - particle.z * 0.25;

        // Mouse repulsion with smooth falloff
        let finalX = baseX;
        let finalY = baseY;
        
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - baseX;
          const dy = mouseRef.current.y - baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 200) {
            const force = Math.pow((200 - dist) / 200, 2);
            finalX = baseX - dx * force * 0.15;
            finalY = baseY - dy * force * 0.15;
            particle.opacity = Math.min(particle.opacity + 0.01, 0.8);
          } else {
            particle.opacity = Math.max(particle.opacity - 0.005, 0.15);
          }
        }
        
        particle.x = finalX;
        particle.y = finalY;

        // Draw connections - 使用新的主色
        for (let j = i + 1; j < Math.min(i + 6, particlesRef.current.length); j++) {
          const other = particlesRef.current[j];
          const connDist = Math.sqrt(
            Math.pow(particle.x - other.x, 2) + Math.pow(particle.y - other.y, 2)
          );
          if (connDist < 100) {
            const alpha = (1 - connDist / 100) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(252, 109, 96, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });

      // Draw particles
      particlesRef.current.forEach((particle) => {
        const pulse = Math.sin(time * 2 + particle.angle) * 0.3 + 0.7;
        
        if (particle.type === "particle") {
          const glowSize = particle.size * 4 * pulse;
          
          // Glow - alternating orange and purple
          const isOrange = particle.angle % 2 < 1;
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, glowSize
          );
          
          if (isOrange) {
            gradient.addColorStop(0, `rgba(252, 109, 96, ${particle.opacity * 0.9})`);
            gradient.addColorStop(0.3, `rgba(252, 109, 96, ${particle.opacity * 0.4})`);
            gradient.addColorStop(1, "transparent");
          } else {
            gradient.addColorStop(0, `rgba(150, 102, 255, ${particle.opacity * 0.9})`);
            gradient.addColorStop(0.3, `rgba(150, 102, 255, ${particle.opacity * 0.4})`);
            gradient.addColorStop(1, "transparent");
          }

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Core - bright
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = isOrange 
            ? `rgba(255, 220, 200, ${particle.opacity})`
            : `rgba(220, 200, 255, ${particle.opacity})`;
          ctx.fill();
        } else {
          // Code/Symbol text
          ctx.font = `${particle.size}px "JetBrains Mono", monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          const color = particle.type === "code" 
            ? `rgba(150, 102, 255, ${particle.opacity * pulse * 0.5})`
            : `rgba(252, 109, 96, ${particle.opacity * pulse * 0.4})`;
          
          ctx.fillStyle = color;
          ctx.fillText(particle.char || "", particle.x, particle.y);
        }
      });

      // Draw and update floating elements from mouse interaction
      floatingRef.current = floatingRef.current.filter((elem) => {
        elem.x += elem.vx;
        elem.y += elem.vy;
        elem.vy += 0.015; // subtle gravity
        elem.vx *= 0.99; // friction
        elem.life++;
        
        const lifeRatio = elem.life / elem.maxLife;
        elem.opacity = (1 - lifeRatio) * 0.8;
        
        if (elem.life >= elem.maxLife) return false;
        
        ctx.font = `${elem.size}px "JetBrains Mono", monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        const color = elem.color === "orange"
          ? `rgba(100, 120, 160, ${elem.opacity})`
          : `rgba(90, 110, 150, ${elem.opacity})`;
        
        ctx.fillStyle = color;
        ctx.fillText(elem.text, elem.x, elem.y);
        
        return true;
      });

      // Central spiral rings - 使用主色 #FC6D60 和辅助色 #9666FF
      for (let r = 0; r < 5; r++) {
        const ringRadius = 50 + r * 45;
        const ringOpacity = 0.06 - r * 0.01;
        
        ctx.beginPath();
        const isOrange = r % 2 === 0;
        ctx.strokeStyle = isOrange 
          ? `rgba(252, 109, 96, ${ringOpacity})`
          : `rgba(150, 102, 255, ${ringOpacity})`;
        ctx.lineWidth = 1;
        
        for (let a = 0; a < Math.PI * 2; a += 0.012) {
          const wave = Math.sin(a * 5 + time * 1.5 + r * 0.5) * 0.12;
          const breathe = Math.sin(time * 0.5 + r) * 0.08;
          const x = centerX + Math.cos(a + time * 0.2 + r * 0.2) * ringRadius * (1 + wave + breathe);
          const y = centerY + Math.sin(a + time * 0.2 + r * 0.2) * ringRadius * 0.3 * (1 + wave + breathe);
          
          if (a === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.closePath();
        ctx.stroke();
      }

      // Geometric shapes - hexagons and triangles
      ctx.globalAlpha = 0.03;
      
      // Rotating hexagon
      ctx.strokeStyle = "#9666FF";
      ctx.lineWidth = 1;
      const hexSize = 180;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + time * 0.15;
        const x = centerX + Math.cos(angle) * hexSize;
        const y = centerY + Math.sin(angle) * hexSize * 0.4;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      
      // Counter-rotating triangle
      ctx.strokeStyle = "#FC6D60";
      const triSize = 220;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2 - time * 0.1;
        const x = centerX + Math.cos(angle) * triSize;
        const y = centerY + Math.sin(angle) * triSize * 0.35;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      
      ctx.globalAlpha = 1;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles, spawnFloatingElement]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.85 }}
    />
  );
}
