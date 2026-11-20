import React, { useEffect, useRef } from 'react';

/**
 * PharmaMoleculesCanvas - Luminous Brand Hologram & 3D Biotech Canvas
 * High-performance HTML5 Canvas rendering:
 * 1. Floating Luminous Brand Hologram: Weightless zero-gravity capsule in the open upper horizon
 *    - Bold, crisp, high-contrast "NIYANSH PHARMA" typography (100% visible, 0% text collision)
 *    - Vector NP monogram + medical leaf logo + "CARE • QUALITY • TRUST" + "WHO-GMP" pill
 *    - Orbiting electron satellite nodes & bio-luminescent propulsion
 * 2. 3D Rotating DNA Double-Helix: Suspended on the far right with perspective depth
 * 3. Zero-Gravity Molecular Network: Floating benzene rings, bio-atoms, and micro-capsules with "NP" marks
 * 4. Inter-molecular chemical bonds with fluid mouse interaction
 *
 * - Auto-pauses offscreen via IntersectionObserver (0% CPU / battery waste)
 * - 60 FPS hardware-accelerated Canvas with retina DPR scaling
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
     *  2 = Micro Dual-Tone Bio-Capsule Pill with "NP" (15%)
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
          this.radius = Math.random() * 2.2 + 6.0;
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
        const currentAlpha = Math.max(0.14, this.alpha + Math.sin(this.pulse) * 0.14);

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
          ctx.strokeStyle = `rgba(52, 211, 153, ${currentAlpha * 0.85})`;
          ctx.lineWidth = 1.1;
          ctx.shadowColor = `rgba(52, 211, 153, ${currentAlpha * 0.6})`;
          ctx.shadowBlur = 5;
          ctx.stroke();

          // Inner chemical resonance circle
          ctx.beginPath();
          ctx.arc(0, 0, this.radius * 0.45, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(56, 189, 248, ${currentAlpha * 0.6})`;
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
          const capW = this.radius * 2.2;
          const capH = this.radius * 0.95;
          const r = capH / 2;

          ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
          ctx.shadowBlur = 6;

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

          // Center Seam
          ctx.beginPath();
          ctx.moveTo(0, -r);
          ctx.lineTo(0, r);
          ctx.strokeStyle = `rgba(255, 255, 255, ${currentAlpha * 0.9})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();

          // Micro Brand Monogram "NP" on larger capsules
          if (this.radius >= 6.8) {
            ctx.font = '800 5.5px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.95})`;
            ctx.fillText('NP', 0, 0);
          }
        } else {
          // Floating Bio-Atom Sphere
          ctx.beginPath();
          ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha})`;
          ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.7)`;
          ctx.shadowBlur = 6;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(-this.radius * 0.3, -this.radius * 0.3, this.radius * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.85})`;
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
     * 1. Floating Luminous Brand Hologram Capsule ("Hava ma tartu")
     * - Floats in the open upper sky horizon (y ≈ 42px on desktop, y ≈ 28px on mobile)
     * - Zero collision with headline text ("vache sulkam rye che" resolved)
     * - 100% visible, high-contrast, bold white & emerald typography: "NIYANSH PHARMA"
     * - Dynamic zero-gravity levitation physics (sine wave vertical hover, cosine drift, micro-tilt)
     * - Rotating orbital satellite energy nodes and bio-glow aura
     */
    const drawFloatingBrandHologram = () => {
      const isNarrow = width < 768;

      // Positioned in the open upper horizon:
      // Mobile: centered at x = 50%, y = 28px
      // Desktop: floating in the upper sky corridor at x = 52% (above content gap), y = 42px
      const baseX = isNarrow ? width * 0.50 : width * 0.52;
      const baseY = isNarrow ? 28 : 42;

      // Zero-gravity levitation physics
      const floatY = Math.sin(globalTime * 1.1) * (isNarrow ? 4 : 6);
      const driftX = Math.cos(globalTime * 0.7) * (isNarrow ? 6 : 10);
      const tilt = Math.sin(globalTime * 0.5) * 0.02; // ~1.1 degree gentle tilt
      const breathing = Math.sin(globalTime * 1.6) * 0.08;

      const posX = baseX + driftX;
      const posY = baseY + floatY;

      // Capsule dimensions
      const cardW = isNarrow ? 216 : 272;
      const cardH = isNarrow ? 38 : 46;
      const cardR = cardH / 2;

      // Mouse proximity interaction
      let mouseDist = 9999;
      if (interactive && mouse.x > 0) {
        const dx = mouse.x - posX;
        const dy = mouse.y - posY;
        mouseDist = Math.sqrt(dx * dx + dy * dy);
      }
      const isHovered = mouseDist < 140;
      const hoverBoost = isHovered ? (1 - mouseDist / 140) * 0.25 : 0;

      ctx.save();
      ctx.translate(posX, posY);
      ctx.rotate(tilt);

      // 1. Ambient Radial Glow Aura
      const aura = ctx.createRadialGradient(0, 0, 10, 0, 0, cardW * 0.65);
      aura.addColorStop(0, `rgba(52, 211, 153, ${0.35 + hoverBoost + breathing})`);
      aura.addColorStop(0.5, `rgba(56, 189, 248, ${0.18 + hoverBoost})`);
      aura.addColorStop(1, 'rgba(10, 48, 86, 0)');
      ctx.beginPath();
      ctx.ellipse(0, 0, cardW * 0.65, cardH * 1.3, 0, 0, Math.PI * 2);
      ctx.fillStyle = aura;
      ctx.fill();

      // 2. Rotating Orbital Satellite Ring
      ctx.save();
      ctx.rotate(globalTime * 0.45);
      ctx.beginPath();
      ctx.ellipse(0, 0, cardW * 0.56, cardH * 0.85, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.38 + hoverBoost})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Orbiting energy node 1 (Cyan)
      const nodeX1 = Math.cos(globalTime * 1.2) * (cardW * 0.56);
      const nodeY1 = Math.sin(globalTime * 1.2) * (cardH * 0.85);
      ctx.beginPath();
      ctx.arc(nodeX1, nodeY1, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.fill();

      // Orbiting energy node 2 (Emerald)
      const nodeX2 = -nodeX1;
      const nodeY2 = -nodeY1;
      ctx.beginPath();
      ctx.arc(nodeX2, nodeY2, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#34d399';
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 7;
      ctx.fill();
      ctx.restore();

      // Rounded Capsule Path Helper
      const traceCapsule = () => {
        const x = -cardW / 2;
        const y = -cardH / 2;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, cardW, cardH, cardR);
        } else {
          ctx.moveTo(x + cardR, y);
          ctx.lineTo(x + cardW - cardR, y);
          ctx.quadraticCurveTo(x + cardW, y, x + cardW, y + cardR);
          ctx.lineTo(x + cardW, y + cardH - cardR);
          ctx.quadraticCurveTo(x + cardW, y + cardH, x + cardW - cardR, y + cardH);
          ctx.lineTo(x + cardR, y + cardH);
          ctx.quadraticCurveTo(x, y + cardH, x, y + cardH - cardR);
          ctx.lineTo(x, y + cardR);
          ctx.quadraticCurveTo(x, y, x + cardR, y);
        }
        ctx.closePath();
      };

      // 3. Capsule Body (Frosted Deep Navy Fill with crisp contrast)
      traceCapsule();
      const bodyGrad = ctx.createLinearGradient(-cardW / 2, -cardH / 2, cardW / 2, cardH / 2);
      bodyGrad.addColorStop(0, 'rgba(11, 38, 72, 0.94)');
      bodyGrad.addColorStop(1, 'rgba(6, 24, 48, 0.90)');
      ctx.fillStyle = bodyGrad;
      ctx.shadowColor = `rgba(52, 211, 153, ${0.65 + hoverBoost})`;
      ctx.shadowBlur = 14;
      ctx.fill();

      // 4. Luminous Border Stroke (Glowing Emerald-Cyan Dual-Tone)
      traceCapsule();
      const borderGrad = ctx.createLinearGradient(-cardW / 2, 0, cardW / 2, 0);
      borderGrad.addColorStop(0, 'rgba(56, 189, 248, 0.95)');   // Cyan
      borderGrad.addColorStop(0.5, 'rgba(52, 211, 153, 0.98)'); // Emerald
      borderGrad.addColorStop(1, 'rgba(56, 189, 248, 0.85)');
      ctx.strokeStyle = borderGrad;
      ctx.lineWidth = 1.6;
      ctx.shadowColor = 'rgba(52, 211, 153, 0.85)';
      ctx.shadowBlur = 10;
      ctx.stroke();

      // 5. Left Monogram / Leaf Icon
      ctx.save();
      const logoCenterX = -cardW / 2 + (isNarrow ? 20 : 25);
      const logoCenterY = 0;
      ctx.translate(logoCenterX, logoCenterY);
      const iconScale = isNarrow ? 0.72 : 0.88;
      ctx.scale(iconScale, iconScale);

      // Leaf atop logo
      ctx.beginPath();
      ctx.moveTo(3, -12);
      ctx.bezierCurveTo(0, -20, 12, -22, 13, -16);
      ctx.closePath();
      ctx.fillStyle = '#4ade80';
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 6;
      ctx.fill();

      // Stylized N (Cyan)
      ctx.beginPath();
      ctx.moveTo(-11, 9);
      ctx.lineTo(-11, -9);
      ctx.quadraticCurveTo(-11, -14, -6, -14);
      ctx.lineTo(-2, -7);
      ctx.lineWidth = 2.8;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 6;
      ctx.stroke();

      // Stylized P (Emerald)
      ctx.beginPath();
      ctx.moveTo(3, 9);
      ctx.lineTo(3, -11);
      ctx.bezierCurveTo(12, -11, 14, -4, 9, 1);
      ctx.quadraticCurveTo(5, 3, 3, 3);
      ctx.lineWidth = 2.8;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#34d399';
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 6;
      ctx.stroke();

      // Center pill core
      ctx.save();
      ctx.translate(-2, -3);
      ctx.rotate(-Math.PI / 4);
      ctx.beginPath();
      ctx.arc(0, -3.5, 3, Math.PI, 0);
      ctx.lineTo(3, 0);
      ctx.lineTo(-3, 0);
      ctx.closePath();
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, 3.5, 3, 0, Math.PI);
      ctx.lineTo(-3, 0);
      ctx.lineTo(3, 0);
      ctx.closePath();
      ctx.fillStyle = '#34d399';
      ctx.fill();
      ctx.restore();

      ctx.restore(); // restore logo

      // 6. Typography: "NIYANSH PHARMA" (Bold White, 100% Legible & Striking!)
      const textStartX = -cardW / 2 + (isNarrow ? 40 : 54);

      // Primary Brand Heading
      const titleSize = isNarrow ? 12.5 : 15;
      ctx.font = `900 ${titleSize}px Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(52, 211, 153, 0.95)';
      ctx.shadowBlur = 8;
      ctx.fillText('NIYANSH PHARMA', textStartX, isNarrow ? -2 : -3);

      // Secondary Tagline
      const subSize = isNarrow ? 7 : 8.5;
      ctx.font = `700 ${subSize}px Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillStyle = '#86efac';
      ctx.shadowColor = 'rgba(74, 222, 128, 0.6)';
      ctx.shadowBlur = 4;
      ctx.fillText('CARE • QUALITY • TRUST', textStartX, isNarrow ? 9 : 12);

      // 7. Right Status Badge: "WHO-GMP"
      if (!isNarrow) {
        const badgeX = cardW / 2 - 38;
        const badgeY = 0;
        const badgeW = 54;
        const badgeH = 20;

        ctx.save();
        ctx.translate(badgeX, badgeY);

        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(-badgeW / 2, -badgeH / 2, badgeW, badgeH, 10);
        } else {
          ctx.rect(-badgeW / 2, -badgeH / 2, badgeW, badgeH);
        }
        ctx.fillStyle = 'rgba(34, 197, 94, 0.22)';
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.65)';
        ctx.lineWidth = 1;
        ctx.shadowColor = 'rgba(74, 222, 128, 0.5)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.stroke();

        // Pulsing Live Dot
        ctx.beginPath();
        ctx.arc(-16, 0, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#22c55e';
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 5;
        ctx.fill();

        ctx.font = '800 8px Outfit, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#bbf7d0';
        ctx.shadowBlur = 0;
        ctx.fillText('GMP', -8, 0.5);

        ctx.restore();
      }

      ctx.restore();
    };

    /**
     * 2. 3D Luminous DNA Double-Helix (Positioned on Far Right)
     */
    const draw3DDNAHelix = () => {
      const helixX = isMobile ? width * 0.92 : width * 0.88;
      const helixY = height * 0.10;
      const helixHeight = height * 0.80;
      const helixWidth = isMobile ? 26 : 48;
      const nodeCount = isMobile ? 14 : 20;
      const stepY = helixHeight / nodeCount;
      const rotationSpeed = globalTime * 0.75;

      ctx.save();
      ctx.translate(helixX, helixY);

      // Soft ambient column
      const colAura = ctx.createRadialGradient(0, helixHeight * 0.5, 10, 0, helixHeight * 0.5, helixWidth * 2.0);
      colAura.addColorStop(0, 'rgba(52, 211, 153, 0.12)');
      colAura.addColorStop(0.5, 'rgba(56, 189, 248, 0.07)');
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

      // 3. Draw Floating Luminous Brand Hologram Capsule in Open Upper Sky ("hava ma tartu")
      drawFloatingBrandHologram();

      // 4. Update & draw all floating molecules
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
