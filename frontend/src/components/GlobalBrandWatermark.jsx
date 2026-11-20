import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

/**
 * GlobalBrandWatermark - Site-Wide Holographic Brand Bio-Nucleus Watermark
 * Renders the signature Niyansh Pharma circular holographic brand bio-nucleus
 * with orbital radar rings, 24 sensor ticks, scanning dashed ring, pure vector
 * NP monogram + botanical leaf logo + bold brand typography across the entire website.
 *
 * - Theme-Aware: Elegantly balances contrast for both Light Mode & Dark Mode.
 * - Route-Aware: Harmonizes with hero banners on Home/About so it never clashes.
 * - High-Efficiency: Auto-pauses on background tabs (0% idle CPU drain).
 * - 100% Non-Intrusive: pointer-events: none guarantees zero click/scroll interference.
 */
export default function GlobalBrandWatermark() {
  const canvasRef = useRef(null);
  const location = useLocation();
  const { theme, isDark } = useTheme();
  const [scrollY, setScrollY] = useState(0);

  // Track window scroll position to fade smoothly when home/about hero banner is in view
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY || document.documentElement.scrollTop || 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine if the current view has an active hero canvas in view
  const isHome = location.pathname === '/';
  const isAbout = location.pathname === '/about' || location.pathname === '/about-us';
  const inHeroBanner = (isHome && scrollY < 240) || (isAbout && scrollY < 180);
  const opacity = inHeroBanner ? 0 : 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let particles = [];
    let globalTime = 0;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
    const particleCount = isMobile ? 12 : 22;
    const connectionDistance = isMobile ? 90 : 130;

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth || document.documentElement.clientWidth || 1200;
      height = window.innerHeight || document.documentElement.clientHeight || 800;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const getNucleus = () => {
      const floatY = Math.sin(globalTime * 0.7) * (isMobile ? 3 : 5);
      const floatX = Math.cos(globalTime * 0.45) * (isMobile ? 2 : 4);
      return {
        x: width * 0.5 + floatX,
        y: height * 0.48 + floatY,
        radius: isMobile ? 78 : isTablet ? 96 : 116,
        connectionDistance: isMobile ? 160 : 220
      };
    };

    /**
     * Pharmaceutical Particle Entity
     * Types: 0 = Bio-Atom, 1 = Benzene Hexagon, 2 = Micro Capsule
     */
    class WatermarkParticle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = init ? Math.random() * (width || 1200) : Math.random() < 0.5 ? 0 : (width || 1200);
        this.y = init ? Math.random() * (height || 800) : Math.random() * (height || 800);
        this.vx = (Math.random() - 0.5) * 0.28;
        this.vy = (Math.random() - 0.5) * 0.28;

        const typeRand = Math.random();
        if (typeRand < 0.25) {
          this.type = 1; // Benzene Hexagon
          this.radius = Math.random() * 2 + 6.5;
        } else if (typeRand < 0.40) {
          this.type = 2; // Micro Bio-Capsule
          this.radius = Math.random() * 1.8 + 5.5;
        } else {
          this.type = 0; // Bio-Atom sphere
          this.radius = Math.random() * 2 + 1.8;
        }

        this.alpha = Math.random() * 0.25 + 0.20;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.015 + Math.random() * 0.02;
        this.rot = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.015;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += this.pulseSpeed;
        this.rot += this.rotSpeed;

        if (this.x < -40) this.x = width + 40;
        else if (this.x > width + 40) this.x = -40;
        if (this.y < -40) this.y = height + 40;
        else if (this.y > height + 40) this.y = -40;
      }

      draw() {
        const curAlpha = Math.min(1, Math.max(0.08, this.alpha + Math.sin(this.pulse) * 0.1));

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);

        const strokeAlpha = isDark ? curAlpha * 0.45 : curAlpha * 0.22;
        const fillAlpha = isDark ? curAlpha * 0.40 : curAlpha * 0.20;

        if (this.type === 1) {
          // Benzene Hexagon Ring
          ctx.beginPath();
          const angleStep = (Math.PI * 2) / 6;
          for (let k = 0; k < 6; k++) {
            const hx = Math.cos(angleStep * k) * this.radius;
            const hy = Math.sin(angleStep * k) * this.radius;
            if (k === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.strokeStyle = isDark ? `rgba(52, 211, 153, ${strokeAlpha})` : `rgba(12, 61, 108, ${strokeAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Vertex dots
          for (let k = 0; k < 6; k++) {
            const hx = Math.cos(angleStep * k) * this.radius;
            const hy = Math.sin(angleStep * k) * this.radius;
            ctx.beginPath();
            ctx.arc(hx, hy, 1.1, 0, Math.PI * 2);
            ctx.fillStyle = isDark ? `rgba(56, 189, 248, ${fillAlpha})` : `rgba(12, 61, 108, ${fillAlpha})`;
            ctx.fill();
          }
        } else if (this.type === 2) {
          // Micro Bio-Capsule Pill
          const capW = this.radius * 2.1;
          const capH = this.radius * 0.9;
          const r = capH / 2;

          // Left Half
          ctx.beginPath();
          ctx.arc(-capW / 4, 0, r, Math.PI / 2, Math.PI * 1.5);
          ctx.lineTo(0, -r);
          ctx.lineTo(0, r);
          ctx.closePath();
          ctx.fillStyle = isDark ? `rgba(56, 189, 248, ${fillAlpha})` : `rgba(12, 61, 108, ${fillAlpha})`;
          ctx.fill();

          // Right Half
          ctx.beginPath();
          ctx.arc(capW / 4, 0, r, Math.PI * 1.5, Math.PI / 2);
          ctx.lineTo(0, r);
          ctx.lineTo(0, -r);
          ctx.closePath();
          ctx.fillStyle = isDark ? `rgba(52, 211, 153, ${fillAlpha})` : `rgba(34, 197, 94, ${fillAlpha})`;
          ctx.fill();
        } else {
          // Bio-Atom Sphere
          ctx.beginPath();
          ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? `rgba(56, 189, 248, ${fillAlpha})` : `rgba(12, 61, 108, ${fillAlpha})`;
          ctx.fill();
        }

        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new WatermarkParticle());
      }
    };

    /**
     * Inter-particle connections
     */
    const drawConnections = () => {
      const maxDistSq = connectionDistance * connectionDistance;
      const baseLineAlpha = isDark ? 0.16 : 0.08;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const a = (1 - dist / connectionDistance) * baseLineAlpha;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark ? `rgba(56, 189, 248, ${a})` : `rgba(12, 61, 108, ${a})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    };

    /**
     * Draw Centerpiece: Circular Holographic Niyansh Pharma Bio-Nucleus Watermark
     */
    const drawWatermarkNucleus = (nucleus) => {
      const breathing = Math.sin(globalTime * 1.5) * 0.06;
      const baseR = nucleus.radius * (1 + breathing * 0.04);

      ctx.save();
      ctx.translate(nucleus.x, nucleus.y);

      // Calibrated theme styling
      const ringCyan = isDark ? 'rgba(56, 189, 248, 0.18)' : 'rgba(12, 61, 108, 0.09)';
      const ringTick = isDark ? 'rgba(56, 189, 248, 0.28)' : 'rgba(12, 61, 108, 0.13)';
      const ringEmerald = isDark ? 'rgba(52, 211, 153, 0.22)' : 'rgba(34, 197, 94, 0.12)';
      const brandCyan = isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(12, 61, 108, 0.22)';
      const brandEmerald = isDark ? 'rgba(52, 211, 153, 0.38)' : 'rgba(34, 197, 94, 0.24)';
      const textPrimary = isDark ? 'rgba(255, 255, 255, 0.32)' : 'rgba(12, 61, 108, 0.26)';
      const textSubtitle = isDark ? 'rgba(134, 239, 172, 0.30)' : 'rgba(21, 128, 61, 0.24)';

      // 1. Ambient Radial Glow Aura
      const auraGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, baseR * 1.7);
      if (isDark) {
        auraGrad.addColorStop(0, 'rgba(52, 211, 153, 0.08)');
        auraGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.04)');
        auraGrad.addColorStop(1, 'rgba(10, 48, 86, 0)');
      } else {
        auraGrad.addColorStop(0, 'rgba(12, 61, 108, 0.04)');
        auraGrad.addColorStop(0.5, 'rgba(34, 197, 94, 0.02)');
        auraGrad.addColorStop(1, 'rgba(248, 250, 252, 0)');
      }
      ctx.beginPath();
      ctx.arc(0, 0, baseR * 1.7, 0, Math.PI * 2);
      ctx.fillStyle = auraGrad;
      ctx.fill();

      // 2. Outer Bio-Radar Orbital Ring with 24 Radial Sensor Ticks
      const outerR = baseR * 1.28;
      const outerAngle = -globalTime * 0.14;
      ctx.save();
      ctx.rotate(outerAngle);

      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, Math.PI * 2);
      ctx.strokeStyle = ringCyan;
      ctx.lineWidth = 1.1;
      ctx.stroke();

      // 24 Radial sensor ticks
      const tickCount = 24;
      const tickStep = (Math.PI * 2) / tickCount;
      ctx.strokeStyle = ringTick;
      ctx.lineWidth = 1;
      for (let t = 0; t < tickCount; t++) {
        const a = t * tickStep;
        const tickLen = t % 4 === 0 ? 6.5 : 3.2;
        const x1 = Math.cos(a) * (outerR - tickLen);
        const y1 = Math.sin(a) * (outerR - tickLen);
        const x2 = Math.cos(a) * outerR;
        const y2 = Math.sin(a) * outerR;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Orbiting satellite nano-capsule node on outer ring
      const satX = Math.cos(globalTime * 0.5) * outerR;
      const satY = Math.sin(globalTime * 0.5) * outerR;
      ctx.beginPath();
      ctx.arc(satX, satY, 3, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#38bdf8' : '#0c3d6c';
      if (isDark) {
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
      }
      ctx.fill();

      ctx.restore();

      // 3. Middle Scanning Ring with Dashed Luminous Arc Segments
      const midR = baseR * 0.94;
      const midAngle = globalTime * 0.25;
      ctx.save();
      ctx.rotate(midAngle);

      ctx.beginPath();
      ctx.arc(0, 0, midR, 0, Math.PI * 2);
      ctx.strokeStyle = ringEmerald;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([12, 16]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 4 Cardinal Anchor Points
      for (let k = 0; k < 4; k++) {
        const ca = (Math.PI / 2) * k;
        const cx = Math.cos(ca) * midR;
        const cy = Math.sin(ca) * midR;
        ctx.beginPath();
        ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#34d399' : '#16a34a';
        ctx.fill();
      }

      ctx.restore();

      // 4. Innermost Circular Chamber
      ctx.beginPath();
      ctx.arc(0, 0, baseR * 0.70, 0, Math.PI * 2);
      ctx.strokeStyle = ringCyan;
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // 5. Vector Holographic NP Insignia & Brand Typography
      ctx.save();

      // Sprouting Botanical Leaf atop logo
      ctx.beginPath();
      ctx.moveTo(3, isMobile ? -28 : -38);
      ctx.bezierCurveTo(
        -2, isMobile ? -38 : -50,
        13, isMobile ? -40 : -54,
        14, isMobile ? -32 : -44
      );
      ctx.closePath();
      ctx.fillStyle = brandEmerald;
      ctx.fill();

      // Stylized 'N'
      ctx.beginPath();
      const nScale = isMobile ? 0.70 : 0.92;
      ctx.moveTo(-16 * nScale, (isMobile ? -8 : -10));
      ctx.lineTo(-16 * nScale, (isMobile ? -30 : -40));
      ctx.quadraticCurveTo(-16 * nScale, (isMobile ? -36 : -48), -8 * nScale, (isMobile ? -36 : -48));
      ctx.lineTo(-2 * nScale, (isMobile ? -26 : -35));
      ctx.lineWidth = 3.2 * nScale;
      ctx.lineCap = 'round';
      ctx.strokeStyle = brandCyan;
      ctx.stroke();

      // Stylized 'P'
      ctx.beginPath();
      ctx.moveTo(4 * nScale, (isMobile ? -8 : -10));
      ctx.lineTo(4 * nScale, (isMobile ? -32 : -42));
      ctx.bezierCurveTo(
        17 * nScale, (isMobile ? -32 : -42),
        19 * nScale, (isMobile ? -22 : -29),
        12 * nScale, (isMobile ? -16 : -21)
      );
      ctx.quadraticCurveTo(7 * nScale, (isMobile ? -13 : -17), 4 * nScale, (isMobile ? -13 : -17));
      ctx.lineWidth = 3.2 * nScale;
      ctx.lineCap = 'round';
      ctx.strokeStyle = brandEmerald;
      ctx.stroke();

      // Center Pharmaceutical Capsule Pill
      const pillW = isMobile ? 22 : 28;
      const pillH = isMobile ? 11 : 14;
      const pillR = pillH / 2;
      const pillY = isMobile ? -18 : -25;

      ctx.save();
      ctx.translate(-2, pillY);
      ctx.rotate(-Math.PI / 4);

      // Capsule left half
      ctx.beginPath();
      ctx.arc(-pillW / 4, 0, pillR, Math.PI / 2, Math.PI * 1.5);
      ctx.lineTo(0, -pillR);
      ctx.lineTo(0, pillR);
      ctx.closePath();
      ctx.fillStyle = brandCyan;
      ctx.fill();

      // Capsule right half
      ctx.beginPath();
      ctx.arc(pillW / 4, 0, pillR, Math.PI * 1.5, Math.PI / 2);
      ctx.lineTo(0, pillR);
      ctx.lineTo(0, -pillR);
      ctx.closePath();
      ctx.fillStyle = brandEmerald;
      ctx.fill();

      // Center divider
      ctx.beginPath();
      ctx.moveTo(0, -pillR);
      ctx.lineTo(0, pillR);
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Typography: NIYANSH PHARMA
      const fontSize = isMobile ? 11.5 : isTablet ? 13.5 : 15;
      ctx.font = `900 ${fontSize}px Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = textPrimary;
      ctx.fillText('NIYANSH PHARMA', 0, isMobile ? 6 : 8);

      // Subtitle: CARE • QUALITY • TRUST
      const subSize = isMobile ? 6.5 : isTablet ? 7.5 : 8.5;
      ctx.font = `700 ${subSize}px Outfit, -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.fillStyle = textSubtitle;
      ctx.fillText('CARE • QUALITY • TRUST', 0, isMobile ? 19 : 25);

      ctx.restore();
      ctx.restore();
    };

    /**
     * Animation Loop
     */
    const animate = () => {
      if (!isVisible) return;
      globalTime += 0.016;

      ctx.clearRect(0, 0, width, height);

      const nucleus = getNucleus();

      // 1. Draw subtle inter-particle bonds
      drawConnections();

      // 2. Draw signature holographic brand watermark centerpiece
      drawWatermarkNucleus(nucleus);

      // 3. Draw ambient pharmaceutical molecules
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Auto-pause when page/tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisible = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!isVisible) {
          isVisible = true;
          animationFrameId = requestAnimationFrame(animate);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    resize();
    initParticles();
    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      resize();
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, isDark]);

  return (
    <div
      className="global-brand-watermark-wrapper"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 2,
        opacity,
        transition: 'opacity 0.4s ease-in-out',
        overflow: 'hidden'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
