import React, { useEffect, useRef } from 'react';

/**
 * PharmaMoleculesCanvas - Luminous Brand Nebula & 3D DNA Helix Edition
 * High-performance HTML5 Canvas rendering:
 * 1. Ambient Kinetic Typography: Majestic glowing "NIYANSH PHARMA" architectural watermark spanning the background
 * 2. Floating Luminous NP Bio-Emblem: Weightless capsule & leaf emblem in the open upper horizon
 * 3. 3D Rotating DNA Double-Helix: Suspended on the far right with perspective depth
 * 4. Zero-Gravity Molecular Network: Floating benzene rings, bio-atoms, and tumbling micro-capsules
 *
 * - Calibrated transparency: Foreground hero headline text remains 100% crisp & readable
 * - Zero double-text collision, zero rectangular artifacts
 * - Auto-pauses offscreen via IntersectionObserver (0% CPU / battery waste)
 * - 60 FPS hardware-accelerated Canvas with fluid mouse interaction
 */
export default function PharmaMoleculesCanvas({
  particleCount = 38,
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

    const mouse = { x: -1000, y: -1000, radius: 140 };

    // Detect mobile viewport
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const activeCount = isMobile ? Math.min(particleCount, 22) : particleCount;
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
     * Floating Pharmaceutical Particle Entity
     * Types:
     *  0 = Bio-Atom Sphere (60%)
     *  1 = Benzene Hexagonal Aromatic Ring (25%)
     *  2 = Micro Dual-Tone Bio-Capsule Pill (15%)
     */
    class FloatingParticle {
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
          this.radius = Math.random() * 2.5 + 6.5;
        } else if (typeRand < 0.40) {
          this.type = 2; // Micro Bio-Capsule Pill
          this.radius = Math.random() * 2 + 5.5;
        } else {
          this.type = 0; // Bio-Atom sphere
          this.radius = Math.random() * 2 + 1.5;
        }

        const hues = [
          { r: 56, g: 189, b: 248 },  // Sky Cyan
          { r: 52, g: 211, b: 153 },  // Radiant Emerald
          { r: 96, g: 165, b: 250 },  // Pharma Blue
          { r: 255, g: 255, b: 255 }  // Clean White
        ];
        this.color = hues[Math.floor(Math.random() * hues.length)];
        this.alpha = Math.random() * 0.32 + 0.30;
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

        // Fluid zero-gravity mouse repulsion
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
          // Floating Benzene Ring (Organic Chemistry Hexagon)
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
          // Floating Bio-Atom Sphere
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
        particles.push(new FloatingParticle());
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
            const alpha = (1 - dist / activeDistance) * 0.26;
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
     * 1. Majestic Ambient Kinetic Watermark: "NIYANSH PHARMA"
     * Spans gracefully across the background canvas in elegant, glowing outline typography.
     * Architectural, non-intrusive, and 100% visible across the whole hero section.
     */
    const drawKineticBrandWatermark = () => {
      ctx.save();
      const breathing = Math.sin(globalTime * 1.2) * 0.04;
      const waveY = Math.sin(globalTime * 0.6) * 8;

      const fontSize = isMobile ? Math.max(26, width * 0.075) : Math.min(84, width * 0.058);
      ctx.font = `900 ${fontSize}px Outfit, -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const posX = width * 0.50;
      const posY = (height * 0.52) + waveY;

      // Soft glow aura behind watermark
      ctx.shadowColor = 'rgba(52, 211, 153, 0.45)';
      ctx.shadowBlur = 18;

      // Luminous cyan outline stroke
      const alphaStroke = 0.12 + breathing;
      ctx.strokeStyle = `rgba(56, 189, 248, ${alphaStroke})`;
      ctx.lineWidth = isMobile ? 1.4 : 2.0;
      ctx.strokeText('NIYANSH  PHARMA', posX, posY);

      // Faint emerald inner luminescence
      ctx.fillStyle = `rgba(52, 211, 153, ${alphaStroke * 0.35})`;
      ctx.fillText('NIYANSH  PHARMA', posX, posY);

      ctx.restore();
    };

    /**
     * 2. Floating Luminous NP Bio-Emblem (In Open Upper Horizon, AWAY from text!)
     * Positioned in the open space where it never collides with headline text.
     */
    const drawFloatingBioEmblem = () => {
      // Placed in the open space above the cards / between columns (x = 65%, y = 65px)
      const emblemX = isMobile ? width * 0.72 : width * 0.66;
      const emblemY = isMobile ? 48 : 68;

      const floatY = Math.sin(globalTime * 0.8) * 8;
      const floatRot = Math.sin(globalTime * 0.5) * 0.03;
      const breathing = Math.sin(globalTime * 1.5) * 0.06;
      const scale = (isMobile ? 0.72 : 1.0) * (1 + breathing * 0.04);
      const alpha = 0.38 + breathing * 0.08;

      ctx.save();
      ctx.translate(emblemX, emblemY + floatY);
      ctx.rotate(floatRot);
      ctx.scale(scale, scale);

      // Ambient radial glow
      const aura = ctx.createRadialGradient(0, 0, 5, 0, 0, 50);
      aura.addColorStop(0, `rgba(52, 211, 153, ${alpha * 0.5})`);
      aura.addColorStop(0.6, `rgba(56, 189, 248, ${alpha * 0.25})`);
      aura.addColorStop(1, 'rgba(10, 48, 86, 0)');
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, Math.PI * 2);
      ctx.fillStyle = aura;
      ctx.fill();

      // Rotating fine orbital ring
      ctx.save();
      ctx.rotate(globalTime * 0.4);
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.45})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Small orbital satellite node
      ctx.beginPath();
      ctx.arc(32, 0, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();

      // Stylized glowing 'N'
      ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(-18, 10);
      ctx.lineTo(-18, -14);
      ctx.quadraticCurveTo(-18, -20, -11, -20);
      ctx.lineTo(-5, -11);
      ctx.lineWidth = 3.8;
      ctx.lineCap = 'round';
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 1.2})`;
      ctx.stroke();

      // Stylized glowing 'P'
      ctx.shadowColor = 'rgba(52, 211, 153, 0.8)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(5, 10);
      ctx.lineTo(5, -16);
      ctx.bezierCurveTo(18, -16, 20, -7, 13, 0);
      ctx.quadraticCurveTo(8, 4, 5, 3);
      ctx.lineWidth = 3.8;
      ctx.lineCap = 'round';
      ctx.strokeStyle = `rgba(52, 211, 153, ${alpha * 1.25})`;
      ctx.stroke();

      // Center capsule pill
      ctx.save();
      ctx.translate(-2, -4);
      ctx.rotate(-Math.PI / 4);
      ctx.beginPath();
      ctx.arc(0, -5, 4.5, Math.PI, 0);
      ctx.lineTo(4.5, 0);
      ctx.lineTo(-4.5, 0);
      ctx.closePath();
      ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 1.3})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 5, 4.5, 0, Math.PI);
      ctx.lineTo(-4.5, 0);
      ctx.lineTo(4.5, 0);
      ctx.closePath();
      ctx.fillStyle = `rgba(52, 211, 153, ${alpha * 1.3})`;
      ctx.fill();
      ctx.restore();

      // Sprouting Green Leaf
      ctx.beginPath();
      ctx.moveTo(5, -16);
      ctx.bezierCurveTo(2, -26, 15, -28, 17, -21);
      ctx.closePath();
      ctx.fillStyle = `rgba(74, 222, 128, ${alpha * 1.4})`;
      ctx.shadowColor = 'rgba(74, 222, 128, 0.9)';
      ctx.shadowBlur = 8;
      ctx.fill();

      // Subtle brand label underneath emblem
      ctx.font = '700 8px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(186, 230, 253, ${alpha * 0.9})`;
      ctx.shadowBlur = 4;
      ctx.fillText('NIYANSH PHARMA', 0, 24);

      ctx.restore();
    };

    /**
     * 3. 3D Luminous DNA Double-Helix (Positioned on Far Right)
     */
    const draw3DDNAHelix = () => {
      const helixX = isMobile ? width * 0.91 : width * 0.85;
      const helixY = height * 0.12;
      const helixHeight = height * 0.76;
      const helixWidth = isMobile ? 28 : 50;
      const nodeCount = isMobile ? 14 : 20;
      const stepY = helixHeight / nodeCount;
      const rotationSpeed = globalTime * 0.75;

      ctx.save();
      ctx.translate(helixX, helixY);

      // Soft ambient column
      const colAura = ctx.createRadialGradient(0, helixHeight * 0.5, 10, 0, helixHeight * 0.5, helixWidth * 2.0);
      colAura.addColorStop(0, 'rgba(52, 211, 153, 0.10)');
      colAura.addColorStop(0.5, 'rgba(56, 189, 248, 0.06)');
      colAura.addColorStop(1, 'rgba(10, 48, 86, 0)');
      ctx.beginPath();
      ctx.ellipse(0, helixHeight * 0.5, helixWidth * 1.8, helixHeight * 0.50, 0, 0, Math.PI * 2);
      ctx.fillStyle = colAura;
      ctx.fill();

      // Render 3D DNA Base Pairs and Strands
      for (let i = 0; i < nodeCount; i++) {
        const curY = i * stepY;
        const angle = i * 0.38 + rotationSpeed;

        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        const x1 = cosA * helixWidth;
        const z1 = sinA;

        const x2 = -x1;
        const z2 = -z1;

        const alpha1 = Math.max(0.14, (z1 + 1) * 0.32 + 0.14);
        const alpha2 = Math.max(0.14, (z2 + 1) * 0.32 + 0.14);
        const radius1 = Math.max(1.8, (z1 + 1) * 1.4 + 2.0);
        const radius2 = Math.max(1.8, (z2 + 1) * 1.4 + 2.0);

        // Base-Pair Rung
        const bondAlpha = Math.max(0.08, Math.min(alpha1, alpha2) * 0.60);
        const grad = ctx.createLinearGradient(x1, curY, x2, curY);
        grad.addColorStop(0, `rgba(56, 189, 248, ${bondAlpha})`);
        grad.addColorStop(0.5, `rgba(255, 255, 255, ${bondAlpha * 1.2})`);
        grad.addColorStop(1, `rgba(52, 211, 153, ${bondAlpha})`);

        ctx.beginPath();
        ctx.moveTo(x1, curY);
        ctx.lineTo(x2, curY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // Strand 1 (Cyan)
        ctx.save();
        ctx.beginPath();
        ctx.arc(x1, curY, radius1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${alpha1})`;
        if (z1 > 0) {
          ctx.shadowColor = 'rgba(56, 189, 248, 0.75)';
          ctx.shadowBlur = 7;
        }
        ctx.fill();
        ctx.restore();

        // Strand 2 (Emerald)
        ctx.save();
        ctx.beginPath();
        ctx.arc(x2, curY, radius2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52, 211, 153, ${alpha2})`;
        if (z2 > 0) {
          ctx.shadowColor = 'rgba(52, 211, 153, 0.75)';
          ctx.shadowBlur = 7;
        }
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    };

    /**
     * Main 60 FPS Render Loop
     */
    const animate = () => {
      if (!isVisible) return;
      globalTime += 0.016;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw connecting chemical bonds between floating particles
      drawInterParticleConnections();

      // 2. Draw 3D Rotating DNA Double-Helix on Far Right
      draw3DDNAHelix();

      // 3. Draw Majestic Kinetic Brand Watermark across the Background
      drawKineticBrandWatermark();

      // 4. Draw Floating Luminous NP Bio-Emblem in Open Upper Space (NEVER behind text!)
      drawFloatingBioEmblem();

      // 5. Update & draw all floating molecules
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
