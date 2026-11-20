import React, { useEffect, useRef } from 'react';

/**
 * PharmaMoleculesCanvas - Floating Air Brand Hologram Edition
 * Renders an ethereal, weightless Niyansh Pharma brand entity floating in the background air,
 * surrounded by zero-gravity biological molecules, rotating benzene rings, and dual-tone micro-capsules.
 *
 * - True "Hava Ma Tartu" (Floating in Air) continuous 3D bobbing & swaying physics
 * - Pure vector rendering: 0 black boxes, 0 rectangular artifacts, 0 double text
 * - Calibrated ambient transparency: Headline text remains 100% crystal clear & readable
 * - 60 FPS hardware-accelerated Canvas with zero-CPU offscreen pausing via IntersectionObserver
 */
export default function PharmaMoleculesCanvas({
  particleCount = 36,
  connectionDistance = 120,
  speed = 0.38,
  interactive = true,
  className = '',
  style = {}
}) {
  const canvasRef = useRef(null);

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
    let mousePushX = 0;
    let mousePushY = 0;

    const mouse = { x: -1000, y: -1000, radius: 150 };

    // Detect mobile viewport
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const activeCount = isMobile ? Math.min(particleCount, 20) : particleCount;
    const activeDistance = isMobile ? connectionDistance * 0.8 : connectionDistance;

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width || canvas.parentElement?.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1200);
      height = rect.height || canvas.parentElement?.clientHeight || 560;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /**
     * Floating Molecule Entity (Atoms, Benzene Hexagons, Micro-Capsules)
     */
    class FloatingMolecule {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = init ? Math.random() * (width || 1200) : Math.random() < 0.5 ? -20 : (width || 1200) + 20;
        this.y = init ? Math.random() * (height || 560) : Math.random() * (height || 560);
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;

        const typeRand = Math.random();
        if (typeRand < 0.25) {
          this.type = 1; // Benzene Hexagon Ring
          this.radius = Math.random() * 2.5 + 7;
        } else if (typeRand < 0.40) {
          this.type = 2; // Micro Bio-Capsule Pill
          this.radius = Math.random() * 2 + 5.5;
        } else {
          this.type = 0; // Bio-Atom sphere
          this.radius = Math.random() * 2 + 1.6;
        }

        const hues = [
          { r: 56, g: 189, b: 248 },  // Sky Cyan
          { r: 52, g: 211, b: 153 },  // Radiant Emerald
          { r: 96, g: 165, b: 250 },  // Pharma Blue
          { r: 255, g: 255, b: 255 }  // Clean White
        ];
        this.color = hues[Math.floor(Math.random() * hues.length)];
        this.alpha = Math.random() * 0.35 + 0.3;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.018 + Math.random() * 0.02;
        this.rot = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.015;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += this.pulseSpeed;
        this.rot += this.rotSpeed;

        // Fluid mouse repulsion
        if (interactive && mouse.x > 0) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.8;
            this.y -= (dy / dist) * force * 1.8;
          }
        }

        if (this.x < -30) this.x = width + 30;
        else if (this.x > width + 30) this.x = -30;
        if (this.y < -30) this.y = height + 30;
        else if (this.y > height + 30) this.y = -30;
      }

      draw() {
        const currentAlpha = Math.max(0.12, this.alpha + Math.sin(this.pulse) * 0.14);

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);

        if (this.type === 1) {
          // Benzene Ring (6-sided organic chemistry hexagon)
          ctx.beginPath();
          const angleStep = (Math.PI * 2) / 6;
          for (let k = 0; k < 6; k++) {
            const hx = Math.cos(angleStep * k) * this.radius;
            const hy = Math.sin(angleStep * k) * this.radius;
            if (k === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(52, 211, 153, ${currentAlpha * 0.8})`;
          ctx.lineWidth = 1.1;
          ctx.shadowColor = `rgba(52, 211, 153, ${currentAlpha * 0.6})`;
          ctx.shadowBlur = 5;
          ctx.stroke();

          // Inner chemical resonance circle
          ctx.beginPath();
          ctx.arc(0, 0, this.radius * 0.45, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(56, 189, 248, ${currentAlpha * 0.55})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Vertex atoms
          for (let k = 0; k < 6; k++) {
            const hx = Math.cos(angleStep * k) * this.radius;
            const hy = Math.sin(angleStep * k) * this.radius;
            ctx.beginPath();
            ctx.arc(hx, hy, 1.3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.9})`;
            ctx.fill();
          }
        } else if (this.type === 2) {
          // Floating Bio-Capsule Pill (Cyan / Emerald Dual Tone)
          const capW = this.radius * 2.1;
          const capH = this.radius * 0.9;
          const r = capH / 2;

          ctx.shadowColor = 'rgba(56, 189, 248, 0.55)';
          ctx.shadowBlur = 5;

          // Left Half (Cyan)
          ctx.beginPath();
          ctx.arc(-capW / 4, 0, r, Math.PI / 2, Math.PI * 1.5);
          ctx.lineTo(0, -r);
          ctx.lineTo(0, r);
          ctx.closePath();
          ctx.fillStyle = `rgba(56, 189, 248, ${currentAlpha * 0.8})`;
          ctx.fill();

          // Right Half (Emerald)
          ctx.beginPath();
          ctx.arc(capW / 4, 0, r, Math.PI * 1.5, Math.PI / 2);
          ctx.lineTo(0, r);
          ctx.lineTo(0, -r);
          ctx.closePath();
          ctx.fillStyle = `rgba(52, 211, 153, ${currentAlpha * 0.8})`;
          ctx.fill();

          // Center Seam
          ctx.beginPath();
          ctx.moveTo(0, -r);
          ctx.lineTo(0, r);
          ctx.strokeStyle = `rgba(255, 255, 255, ${currentAlpha * 0.85})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        } else {
          // Bio-Atom Sphere with soft core highlight
          ctx.beginPath();
          ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha})`;
          ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.65)`;
          ctx.shadowBlur = 6;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(-this.radius * 0.3, -this.radius * 0.3, this.radius * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.8})`;
          ctx.fill();
        }

        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < activeCount; i++) {
        particles.push(new FloatingMolecule());
      }
    };

    /**
     * Draw inter-molecular chemical bonds between nearby floating particles
     */
    const drawInterParticleConnections = () => {
      const maxDistSq = activeDistance * activeDistance;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / activeDistance) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
        }
      }
    };

    /**
     * Render the Niyansh Pharma Brand Floating Weightlessly in the Background Air
     * Continuous 3D floating & swaying motion with pure vector glowing graphics (0 black boxes)
     */
    const drawFloatingAirBrand = () => {
      // Base anchor in the open atmospheric space (away from left text)
      const baseX = isMobile ? width * 0.5 : width * 0.52;
      const baseY = isMobile ? height * 0.32 : height * 0.44;

      // Sinuous weightless floating in air (Levitation Physics)
      const floatX = Math.cos(globalTime * 0.4) * 20;
      const floatY = Math.sin(globalTime * 0.75) * 16;
      const floatRot = Math.sin(globalTime * 0.5) * 0.035;
      const breathing = Math.sin(globalTime * 1.5) * 0.08;

      // Mouse interactive fluid drift
      if (interactive && mouse.x > 0) {
        const dx = mouse.x - (baseX + floatX);
        const dy = mouse.y - (baseY + floatY);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220) {
          const push = (220 - dist) / 220;
          mousePushX += (-dx / dist * push * 25 - mousePushX) * 0.05;
          mousePushY += (-dy / dist * push * 25 - mousePushY) * 0.05;
        } else {
          mousePushX += (0 - mousePushX) * 0.04;
          mousePushY += (0 - mousePushY) * 0.04;
        }
      } else {
        mousePushX += (0 - mousePushX) * 0.04;
        mousePushY += (0 - mousePushY) * 0.04;
      }

      const curX = baseX + floatX + mousePushX;
      const curY = baseY + floatY + mousePushY;
      const scale = (isMobile ? 0.78 : 1.15) * (1 + breathing * 0.04);
      const alpha = 0.22 + breathing * 0.05;

      ctx.save();
      ctx.translate(curX, curY);
      ctx.rotate(floatRot);
      ctx.scale(scale, scale);

      // 1. Ambient Bioluminescent Air Aura (Gentle Glowing Cloud)
      const aura = ctx.createRadialGradient(0, 0, 10, 0, 0, 140);
      aura.addColorStop(0, `rgba(52, 211, 153, ${alpha * 0.7})`);
      aura.addColorStop(0.4, `rgba(56, 189, 248, ${alpha * 0.45})`);
      aura.addColorStop(0.8, `rgba(14, 165, 233, ${alpha * 0.15})`);
      aura.addColorStop(1, 'rgba(10, 48, 86, 0)');

      ctx.beginPath();
      ctx.arc(0, 0, 140, 0, Math.PI * 2);
      ctx.fillStyle = aura;
      ctx.fill();

      // 2. Pure Vector Niyansh Pharma Pharmaceutical Emblem (NP + Capsule + Leaf)
      ctx.shadowColor = 'rgba(52, 211, 153, 0.75)';
      ctx.shadowBlur = 16;

      // Stylized 'N' (Royal Blue / Cyan Arch with Left Pillar)
      ctx.beginPath();
      ctx.moveTo(-32, 14);
      ctx.lineTo(-32, -22);
      ctx.quadraticCurveTo(-32, -32, -20, -32);
      ctx.lineTo(-12, -18);
      ctx.lineWidth = 5.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 1.3})`;
      ctx.stroke();

      // Stylized 'P' (Emerald Green Arch with Right Loop)
      ctx.beginPath();
      ctx.moveTo(8, 14);
      ctx.lineTo(8, -26);
      ctx.bezierCurveTo(28, -26, 32, -12, 20, 0);
      ctx.quadraticCurveTo(12, 6, 8, 4);
      ctx.lineWidth = 5.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = `rgba(52, 211, 153, ${alpha * 1.35})`;
      ctx.stroke();

      // Center Pharmaceutical Capsule Pill
      ctx.save();
      ctx.translate(-2, -8);
      ctx.rotate(-Math.PI / 4);

      // Upper Capsule Half (Cyan)
      ctx.beginPath();
      ctx.arc(0, -7, 6, Math.PI, 0);
      ctx.lineTo(6, 0);
      ctx.lineTo(-6, 0);
      ctx.closePath();
      ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 1.4})`;
      ctx.fill();

      // Lower Capsule Half (Emerald)
      ctx.beginPath();
      ctx.arc(0, 7, 6, 0, Math.PI);
      ctx.lineTo(-6, 0);
      ctx.lineTo(6, 0);
      ctx.closePath();
      ctx.fillStyle = `rgba(52, 211, 153, ${alpha * 1.4})`;
      ctx.fill();

      // Pill Center White Dividing Seam
      ctx.beginPath();
      ctx.moveTo(-6, 0);
      ctx.lineTo(6, 0);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 1.8})`;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();

      // Green Organic Healthcare Leaf (Sprouting above the 'P')
      ctx.beginPath();
      ctx.moveTo(8, -26);
      ctx.bezierCurveTo(4, -40, 22, -44, 26, -34);
      ctx.bezierCurveTo(24, -26, 14, -24, 8, -26);
      ctx.fillStyle = `rgba(74, 222, 128, ${alpha * 1.5})`;
      ctx.shadowColor = 'rgba(74, 222, 128, 0.8)';
      ctx.shadowBlur = 14;
      ctx.fill();

      // Leaf Center Vein
      ctx.beginPath();
      ctx.moveTo(8, -26);
      ctx.quadraticCurveTo(14, -34, 22, -38);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 1.4})`;
      ctx.lineWidth = 1.1;
      ctx.stroke();

      // 3. Clean Holographic Typography Floating Underneath (Single, Crisp, Never Duplicated)
      ctx.font = '800 13px Outfit, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(134, 239, 172, ${alpha * 1.25})`;
      ctx.shadowColor = 'rgba(134, 239, 172, 0.7)';
      ctx.shadowBlur = 10;
      ctx.fillText('NIYANSH PHARMA', 0, 32);

      // Subtitle: CARE • QUALITY • TRUST
      ctx.font = '700 8px Outfit, sans-serif';
      ctx.fillStyle = `rgba(186, 230, 253, ${alpha * 0.95})`;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
      ctx.shadowBlur = 6;
      ctx.fillText('CARE • QUALITY • TRUST', 0, 46);

      ctx.restore();

      // 4. Connect nearby floating molecules to the floating brand entity in air
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.x - curX;
        const dy = p.y - curY;
        const distSq = dx * dx + dy * dy;

        if (distSq < 210 * 210 && distSq > 40 * 40) {
          const dist = Math.sqrt(distSq);
          const tetherAlpha = (1 - dist / 210) * 0.32;
          ctx.beginPath();
          ctx.moveTo(curX, curY);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(52, 211, 153, ${tetherAlpha})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      }
    };

    /**
     * Main 60 FPS Render Loop
     */
    const animate = () => {
      if (!isVisible) return;
      globalTime += 0.016;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw floating inter-molecular chemical bonds
      drawInterParticleConnections();

      // 2. Draw the weightless Niyansh Pharma brand floating in the air
      drawFloatingAirBrand();

      // 3. Update & draw all floating molecules
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // IntersectionObserver to auto-pause offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isVisible) {
              isVisible = true;
              animationFrameId = requestAnimationFrame(animate);
            }
          } else {
            isVisible = false;
            cancelAnimationFrame(animationFrameId);
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);

    // Initial setup
    resize();
    initParticles();
    animationFrameId = requestAnimationFrame(animate);

    const settleTimer = setTimeout(() => {
      resize();
      initParticles();
    }, 80);

    const handleResize = () => {
      resize();
      initParticles();
    };

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleTouchMove = (e) => {
      if (!interactive || !e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      clearTimeout(settleTimer);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (canvas) canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [particleCount, connectionDistance, speed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`pharma-molecules-canvas ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        ...style
      }}
      aria-hidden="true"
    />
  );
}
