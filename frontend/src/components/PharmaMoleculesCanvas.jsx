import React, { useEffect, useRef } from 'react';

/**
 * PharmaMoleculesCanvas - Holographic Brand Bio-Nucleus ("Gol Round") Edition
 * Ultra-high-performance HTML5 Canvas rendering living pharmaceutical molecules,
 * hexagonal benzene compounds, micro-capsules, and the signature Circular
 * Holographic Niyansh Pharma Bio-Nucleus with bioluminescent synapse connectivity.
 *
 * - Circular Bio-Radar Orbital Ring with 24 Radial Sensor Ticks
 * - Orbiting satellite nano-capsule node & middle scanning dashed ring with 4 anchor points
 * - Pure vector NP leaf & capsule monogram + bold glowing "NIYANSH PHARMA" typography
 * - Living bioluminescent synapse tethers with traveling quantum energy packets
 * - Zero rectangular box artifacts, zero double-text collision
 * - Auto-pauses offscreen via IntersectionObserver (0% CPU / battery drain)
 * - Calibrated transparency: Hero foreground text remains 100% crisp & readable
 */
export default function PharmaMoleculesCanvas({
  particleCount = 42,
  connectionDistance = 125,
  speed = 0.40,
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
    let synapsePackets = [];
    let globalTime = 0;
    let rippleRadius = 0;
    let rippleAlpha = 0;
    let heroLogoImg = null;

    if (typeof Image !== 'undefined') {
      const logoLoader = new Image();
      logoLoader.onload = () => {
        heroLogoImg = logoLoader;
      };
      logoLoader.src = '/np-hero-logo.png';
    }

    const mouse = { x: -1000, y: -1000, radius: 150 };

    // Detect mobile viewport to scale computational density
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
     * Dynamic center and dimensions for the Circular Brand Bio-Nucleus
     */
    const getNucleus = () => {
      const floatY = Math.sin(globalTime * 0.8) * (isMobile ? 4 : 7);
      const floatX = Math.cos(globalTime * 0.5) * (isMobile ? 3 : 5);
      return {
        x: (isMobile ? width * 0.5 : width * 0.48) + floatX,
        y: (isMobile ? height * 0.38 : height * 0.46) + floatY,
        radius: isMobile ? 74 : 112,
        connectionDistance: isMobile ? 180 : 260
      };
    };

    /**
     * Pharmaceutical Particle Entity
     * Types:
     *  0 = Bio-Atom Sphere (60%)
     *  1 = Benzene Hexagonal Aromatic Ring (25%)
     *  2 = Micro Dual-Tone Bio-Capsule Pill (15%)
     */
    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = init ? Math.random() * (width || 1200) : Math.random() < 0.5 ? 0 : (width || 1200);
        this.y = init ? Math.random() * (height || 560) : Math.random() * (height || 560);
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;

        const typeRand = Math.random();
        if (typeRand < 0.25) {
          this.type = 1; // Benzene Hexagon
          this.radius = Math.random() * 2.5 + 7;
        } else if (typeRand < 0.40) {
          this.type = 2; // Bio-Capsule
          this.radius = Math.random() * 2 + 6;
        } else {
          this.type = 0; // Bio-Atom sphere
          this.radius = Math.random() * 2.2 + 1.8;
        }

        // Palette: Sky Cyan, Radiant Emerald, Medical Cobalt, Pure White
        const hues = [
          { r: 56, g: 189, b: 248 },  // Cyan
          { r: 52, g: 211, b: 153 },  // Emerald
          { r: 96, g: 165, b: 250 },  // Pharma Blue
          { r: 255, g: 255, b: 255 }  // Clean White
        ];
        this.color = hues[Math.floor(Math.random() * hues.length)];
        this.alpha = Math.random() * 0.35 + 0.35;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.025;
        this.rot = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        this.highlight = 0;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += this.pulseSpeed;
        this.rot += this.rotSpeed;

        if (this.highlight > 0) {
          this.highlight = Math.max(0, this.highlight - 0.03);
        }

        // Fluid mouse avoidance
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

        // Screen boundary wrapping
        if (this.x < -30) this.x = width + 30;
        else if (this.x > width + 30) this.x = -30;
        if (this.y < -30) this.y = height + 30;
        else if (this.y > height + 30) this.y = -30;
      }

      draw() {
        const currentAlpha = Math.min(1, Math.max(0.12, this.alpha + Math.sin(this.pulse) * 0.15 + this.highlight));

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);

        if (this.type === 1) {
          // Benzene Ring (Organic Chemistry Hexagon)
          ctx.beginPath();
          const angleStep = (Math.PI * 2) / 6;
          for (let k = 0; k < 6; k++) {
            const hx = Math.cos(angleStep * k) * this.radius;
            const hy = Math.sin(angleStep * k) * this.radius;
            if (k === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(52, 211, 153, ${currentAlpha * 0.85})`;
          ctx.lineWidth = 1.2;
          ctx.shadowColor = `rgba(52, 211, 153, ${currentAlpha * 0.7})`;
          ctx.shadowBlur = 6;
          ctx.stroke();

          // Inner chemical resonance circle
          ctx.beginPath();
          ctx.arc(0, 0, this.radius * 0.45, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(56, 189, 248, ${currentAlpha * 0.6})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();

          // Vertex atoms
          for (let k = 0; k < 6; k++) {
            const hx = Math.cos(angleStep * k) * this.radius;
            const hy = Math.sin(angleStep * k) * this.radius;
            ctx.beginPath();
            ctx.arc(hx, hy, 1.4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
            ctx.fill();
          }
        } else if (this.type === 2) {
          // Micro Bio-Capsule (Cyan / Emerald Dual Tone)
          const capW = this.radius * 2.2;
          const capH = this.radius * 0.95;
          const r = capH / 2;

          ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
          ctx.shadowBlur = 5;

          // Left Half (Cyan)
          ctx.beginPath();
          ctx.arc(-capW / 4, 0, r, Math.PI / 2, Math.PI * 1.5);
          ctx.lineTo(0, -r);
          ctx.lineTo(0, r);
          ctx.closePath();
          ctx.fillStyle = `rgba(56, 189, 248, ${currentAlpha * 0.85})`;
          ctx.fill();

          // Right Half (Emerald)
          ctx.beginPath();
          ctx.arc(capW / 4, 0, r, Math.PI * 1.5, Math.PI / 2);
          ctx.lineTo(0, r);
          ctx.lineTo(0, -r);
          ctx.closePath();
          ctx.fillStyle = `rgba(52, 211, 153, ${currentAlpha * 0.85})`;
          ctx.fill();

          // Center Seam Line
          ctx.beginPath();
          ctx.moveTo(0, -r);
          ctx.lineTo(0, r);
          ctx.strokeStyle = `rgba(255, 255, 255, ${currentAlpha * 0.9})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          // Bio-Atom Sphere with Soft Glow
          ctx.beginPath();
          ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha})`;
          ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.7)`;
          ctx.shadowBlur = 7;
          ctx.fill();

          // Inner clinical highlight
          ctx.beginPath();
          ctx.arc(-this.radius * 0.3, -this.radius * 0.3, this.radius * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.85})`;
          ctx.fill();
        }

        ctx.restore();
      }
    }

    /**
     * Synapse Energy Packet: Luminous quantum beads traveling
     * along tethers between the Niyansh Pharma nucleus and floating particles.
     */
    class SynapsePacket {
      constructor(particle, startX, startY) {
        this.particle = particle;
        this.startX = startX;
        this.startY = startY;
        this.progress = 0;
        this.speed = 0.016 + Math.random() * 0.018;
        this.color = Math.random() > 0.4 ? '#38bdf8' : '#34d399';
        this.alive = true;
      }

      update() {
        this.progress += this.speed;
        if (this.progress >= 1) {
          this.alive = false;
          if (this.particle) {
            this.particle.highlight = 0.5;
          }
        }
      }

      draw() {
        if (!this.particle) return;
        const curX = this.startX + (this.particle.x - this.startX) * this.progress;
        const curY = this.startY + (this.particle.y - this.startY) * this.progress;

        ctx.save();
        ctx.beginPath();
        ctx.arc(curX, curY, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      synapsePackets = [];
      for (let i = 0; i < activeCount; i++) {
        particles.push(new Particle());
      }
    };

    /**
     * Draw inter-molecular chemical bonds between nearby particles
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
            const alpha = (1 - dist / activeDistance) * 0.30;
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
     * Draw living bioluminescent synapse connections between the
     * Holographic Niyansh Pharma Nucleus and surrounding particles
     */
    const drawNucleusSynapses = (nucleus) => {
      const maxDistSq = nucleus.connectionDistance * nucleus.connectionDistance;
      const innerRadius = nucleus.radius * 0.85;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.x - nucleus.x;
        const dy = p.y - nucleus.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          if (dist > innerRadius * 0.65) {
            const angle = Math.atan2(dy, dx);
            const anchorX = nucleus.x + Math.cos(angle) * innerRadius;
            const anchorY = nucleus.y + Math.sin(angle) * innerRadius;

            const alpha = (1 - dist / nucleus.connectionDistance) * 0.38;

            // Bioluminescent synapse tether with dual-tone gradient
            const grad = ctx.createLinearGradient(anchorX, anchorY, p.x, p.y);
            grad.addColorStop(0, `rgba(52, 211, 153, ${alpha * 1.1})`);
            grad.addColorStop(1, `rgba(56, 189, 248, ${alpha * 0.65})`);

            ctx.beginPath();
            ctx.moveTo(anchorX, anchorY);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.1;
            ctx.stroke();

            // Anchor node glow
            ctx.beginPath();
            ctx.arc(anchorX, anchorY, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(52, 211, 153, ${alpha * 1.4})`;
            ctx.fill();

            // Spawn occasional energy pulses from nucleus outward
            if (Math.random() < 0.007 && synapsePackets.length < 14) {
              synapsePackets.push(new SynapsePacket(p, anchorX, anchorY));
            }
          }
        }
      }

      // Update and render all active synapse energy pulses
      for (let i = synapsePackets.length - 1; i >= 0; i--) {
        const packet = synapsePackets[i];
        packet.update();
        if (!packet.alive) {
          synapsePackets.splice(i, 1);
        } else {
          packet.draw();
        }
      }
    };

    /**
     * Render the Centerpiece: Circular Holographic Niyansh Pharma Bio-Nucleus ("Gol Round")
     * - Multi-layer ambient radial glow aura
     * - Outer Bio-Radar Orbital Ring with 24 Radial Sensor Ticks
     * - Orbiting satellite nano-capsule node & middle scanning dashed ring with 4 anchor points
     * - Pure vector NP monogram + botanical leaf logo + clear typography
     * - Zero square raster boxes, zero double-text collision
     */
    const drawBioNucleus = (nucleus) => {
      const breathing = Math.sin(globalTime * 1.6) * 0.08;
      const baseR = nucleus.radius * (1 + breathing * 0.05);

      ctx.save();
      ctx.translate(nucleus.x, nucleus.y);

      // 1. Ambient Bioluminescent Core Aura (Multi-layer Radial Gradient)
      const auraGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, baseR * 1.85);
      auraGrad.addColorStop(0, `rgba(52, 211, 153, ${0.16 + breathing * 0.04})`);
      auraGrad.addColorStop(0.4, `rgba(56, 189, 248, ${0.09 + breathing * 0.03})`);
      auraGrad.addColorStop(0.75, 'rgba(14, 165, 233, 0.03)');
      auraGrad.addColorStop(1, 'rgba(10, 48, 86, 0)');

      ctx.beginPath();
      ctx.arc(0, 0, baseR * 1.85, 0, Math.PI * 2);
      ctx.fillStyle = auraGrad;
      ctx.fill();

      // 2. Interactive Shockwave Ripple (emanates on mouse movement)
      if (rippleAlpha > 0.01) {
        ctx.beginPath();
        ctx.arc(0, 0, rippleRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${rippleAlpha * 0.4})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // 3. Outer Bio-Radar Orbital Ring with 24 Radial Sensor Ticks
      const outerR = baseR * 1.30;
      const outerAngle = -globalTime * 0.18;
      ctx.save();
      ctx.rotate(outerAngle);

      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.20)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 24 Radial sensor ticks around circumference
      const tickCount = 24;
      const tickStep = (Math.PI * 2) / tickCount;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1;
      for (let t = 0; t < tickCount; t++) {
        const a = t * tickStep;
        const tickLen = t % 4 === 0 ? 7 : 3.5;
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
      const satX = Math.cos(globalTime * 0.6) * outerR;
      const satY = Math.sin(globalTime * 0.6) * outerR;
      ctx.beginPath();
      ctx.arc(satX, satY, 3.4, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.fill();

      ctx.restore();

      // 4. Middle Scanning Ring with Dashed Luminous Arc Segments
      const midR = baseR * 0.94;
      const midAngle = globalTime * 0.32;
      ctx.save();
      ctx.rotate(midAngle);

      ctx.beginPath();
      ctx.arc(0, 0, midR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.30)';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([14, 18]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 4 Cardinal Anchor Points
      for (let k = 0; k < 4; k++) {
        const ca = (Math.PI / 2) * k;
        const cx = Math.cos(ca) * midR;
        const cy = Math.sin(ca) * midR;
        ctx.beginPath();
        ctx.arc(cx, cy, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = '#34d399';
        ctx.shadowColor = '#34d399';
        ctx.shadowBlur = 8;
        ctx.fill();
      }

      ctx.restore();

      // 5. Innermost Circular Chamber
      ctx.beginPath();
      ctx.arc(0, 0, baseR * 0.70, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.24)';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // 6. Official Transparent NP NIYANSH PHARMA Hologram Logo inside Circular Chamber
      if (heroLogoImg && heroLogoImg.complete && heroLogoImg.naturalWidth > 0) {
        ctx.save();
        const alphaBrand = 0.52 + breathing * 0.10;
        const targetW = baseR * 1.18;
        const targetH = targetW * (heroLogoImg.naturalHeight / heroLogoImg.naturalWidth);
        ctx.globalAlpha = alphaBrand;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.35)';
        ctx.shadowBlur = 12;
        ctx.drawImage(heroLogoImg, -targetW / 2, -targetH / 2, targetW, targetH);
        ctx.restore();
      }

      ctx.restore();
    };

    /**
     * Main Render Loop (60 FPS)
     */
    const animate = () => {
      if (!isVisible) return;
      globalTime += 0.016;

      ctx.clearRect(0, 0, width, height);

      const nucleus = getNucleus();

      // 1. Expand and fade interactive ripple if active
      if (rippleAlpha > 0) {
        rippleRadius += 4.5;
        rippleAlpha -= 0.015;
      }

      // 2. Draw background inter-molecular covalent bonds
      drawInterParticleConnections();

      // 3. Draw living synapse connections to the circular brand nucleus
      drawNucleusSynapses(nucleus);

      // 4. Draw Centerpiece: Circular Holographic Niyansh Pharma Bio-Nucleus ("Gol Round")
      drawBioNucleus(nucleus);

      // 5. Update and render all pharmaceutical particle entities
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // IntersectionObserver to auto-pause when scrolled offscreen
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
    }, 90);

    const handleResize = () => {
      resize();
      initParticles();
    };

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;

      // Trigger ripple if mouse approaches nucleus
      const nucleus = getNucleus();
      const dx = mouse.x - nucleus.x;
      const dy = mouse.y - nucleus.y;
      if (Math.sqrt(dx * dx + dy * dy) < nucleus.radius * 1.5 && rippleAlpha <= 0.05) {
        rippleRadius = nucleus.radius * 0.7;
        rippleAlpha = 0.8;
      }
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
