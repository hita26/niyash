import React, { useEffect, useRef } from 'react';

/**
 * PharmaMoleculesCanvas - 3D Luminous DNA Helix & Molecular Nebula
 * An ultra-modern, cinematic biotech background animation:
 * - 3D Rotating Luminous DNA Double-Helix suspended on the far right (never in the center!)
 * - Floating chemical benzene rings, bio-atom nodes, and zero-gravity tumbling micro-capsules
 * - Zero middle clutter: The hero headline text remains 100% crisp, unobstructed, and pristine
 * - 60 FPS hardware-accelerated Canvas with zero-CPU offscreen pausing via IntersectionObserver
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

        // Screen boundary smooth wrap
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

          // Inner clinical highlight
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
     * 3D Luminous DNA Double-Helix (Positioned on the FAR RIGHT, NEVER in the middle!)
     * Pure international biotechnology animation with 3D perspective depth
     */
    const draw3DDNAHelix = () => {
      // Positioned on the FAR RIGHT in the open space, far away from left headline text
      const helixX = isMobile ? width * 0.90 : width * 0.84;
      const helixY = height * 0.10;
      const helixHeight = height * 0.80;
      const helixWidth = isMobile ? 32 : 55;
      const nodeCount = isMobile ? 14 : 22;
      const stepY = helixHeight / nodeCount;
      const rotationSpeed = globalTime * 0.75;

      ctx.save();
      ctx.translate(helixX, helixY);

      // Ambient soft glow column behind the helix
      const colAura = ctx.createRadialGradient(0, helixHeight * 0.5, 10, 0, helixHeight * 0.5, helixWidth * 2.2);
      colAura.addColorStop(0, 'rgba(52, 211, 153, 0.12)');
      colAura.addColorStop(0.5, 'rgba(56, 189, 248, 0.08)');
      colAura.addColorStop(1, 'rgba(10, 48, 86, 0)');
      ctx.beginPath();
      ctx.ellipse(0, helixHeight * 0.5, helixWidth * 2, helixHeight * 0.52, 0, 0, Math.PI * 2);
      ctx.fillStyle = colAura;
      ctx.fill();

      // Subtle Floating NP Biotechnology Insignia hovering gracefully above the helix (FAR RIGHT, NO CLASH)
      ctx.save();
      const badgeY = -28;
      const breathing = Math.sin(globalTime * 1.5) * 0.06;
      ctx.translate(0, badgeY);
      ctx.scale(1 + breathing, 1 + breathing);

      // Stylized glowing 'NP' Monogram Mark (Pure Vector, No Text)
      ctx.shadowColor = 'rgba(52, 211, 153, 0.8)';
      ctx.shadowBlur = 10;

      // Small cyan 'N' loop
      ctx.beginPath();
      ctx.moveTo(-16, 8);
      ctx.lineTo(-16, -10);
      ctx.quadraticCurveTo(-16, -16, -10, -16);
      ctx.lineTo(-5, -8);
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.stroke();

      // Small emerald 'P' loop with leaf
      ctx.beginPath();
      ctx.moveTo(4, 8);
      ctx.lineTo(4, -12);
      ctx.bezierCurveTo(14, -12, 16, -4, 10, 2);
      ctx.quadraticCurveTo(6, 5, 4, 4);
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.50)';
      ctx.stroke();

      // Tiny green leaf
      ctx.beginPath();
      ctx.moveTo(4, -12);
      ctx.bezierCurveTo(2, -20, 12, -22, 14, -16);
      ctx.closePath();
      ctx.fillStyle = 'rgba(74, 222, 128, 0.65)';
      ctx.fill();

      ctx.restore();

      // Render 3D DNA Base Pairs and Strands
      for (let i = 0; i < nodeCount; i++) {
        const curY = i * stepY;
        const angle = i * 0.38 + rotationSpeed;

        // 3D perspective projection
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);

        const x1 = cosA * helixWidth;
        const z1 = sinA; // -1 (back) to +1 (front)

        const x2 = -x1;
        const z2 = -z1;

        // Depth perspective alpha & sizing
        const alpha1 = Math.max(0.15, (z1 + 1) * 0.35 + 0.15);
        const alpha2 = Math.max(0.15, (z2 + 1) * 0.35 + 0.15);
        const radius1 = Math.max(2.0, (z1 + 1) * 1.5 + 2.2);
        const radius2 = Math.max(2.0, (z2 + 1) * 1.5 + 2.2);

        // 1. Horizontal Base-Pair Rung connecting the two strands
        const bondAlpha = Math.max(0.1, (Math.min(alpha1, alpha2)) * 0.65);
        const grad = ctx.createLinearGradient(x1, curY, x2, curY);
        grad.addColorStop(0, `rgba(56, 189, 248, ${bondAlpha})`);
        grad.addColorStop(0.5, `rgba(255, 255, 255, ${bondAlpha * 1.2})`);
        grad.addColorStop(1, `rgba(52, 211, 153, ${bondAlpha})`);

        ctx.beginPath();
        ctx.moveTo(x1, curY);
        ctx.lineTo(x2, curY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // 2. Center nucleotide hydrogen bond dot
        ctx.beginPath();
        ctx.arc(0, curY, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${bondAlpha * 1.4})`;
        ctx.fill();

        // 3. Strand 1 Node (Cyan Sky Base)
        ctx.save();
        ctx.beginPath();
        ctx.arc(x1, curY, radius1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${alpha1})`;
        if (z1 > 0) {
          ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        ctx.restore();

        // 4. Strand 2 Node (Emerald Green Base)
        ctx.save();
        ctx.beginPath();
        ctx.arc(x2, curY, radius2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52, 211, 153, ${alpha2})`;
        if (z2 > 0) {
          ctx.shadowColor = 'rgba(52, 211, 153, 0.8)';
          ctx.shadowBlur = 8;
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

      // 2. Draw 3D Rotating Luminous DNA Double-Helix on the FAR RIGHT
      draw3DDNAHelix();

      // 3. Update & draw all floating molecules (Zero-gravity physics across the background)
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
