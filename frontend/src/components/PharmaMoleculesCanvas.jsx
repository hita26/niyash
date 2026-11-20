import React, { useEffect, useRef } from 'react';

/**
 * PharmaMoleculesCanvas
 * Ultra-lightweight HTML5 Canvas rendering floating biological molecules and chemical bonds.
 * Inspired by top biotech & pharma platforms (Polpharma Biologics, Moderna, Pfizer).
 * - 0 external dependencies
 * - Auto-pauses offscreen via IntersectionObserver (0% CPU/battery waste)
 * - Hardware accelerated 60fps on mobile and desktop
 */
export default function PharmaMoleculesCanvas({
  particleCount = 38,
  connectionDistance = 120,
  speed = 0.45,
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
    const mouse = { x: -1000, y: -1000, radius: 140 };

    // Detect mobile to optimize particle count
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const activeCount = isMobile ? Math.min(particleCount, 20) : particleCount;
    const activeDistance = isMobile ? connectionDistance * 0.8 : connectionDistance;

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width || canvas.parentElement?.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1200);
      height = rect.height || canvas.parentElement?.clientHeight || 500;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = init ? Math.random() * (width || 1200) : Math.random() < 0.5 ? 0 : (width || 1200);
        this.y = init ? Math.random() * (height || 500) : Math.random() * (height || 500);
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        // Molecular node sizes (simulating atoms / compounds)
        this.radius = Math.random() * 2.8 + 1.6;
        // Soft pharma glowing palette: cyan, emerald green, luminous light blue, pure white
        const hues = [
          { r: 56, g: 189, b: 248 },  // Sky cyan
          { r: 52, g: 211, b: 153 },  // Radiant emerald green
          { r: 96, g: 165, b: 250 },  // Pharma electric blue
          { r: 255, g: 255, b: 255 }  // Clean pure white
        ];
        this.color = hues[Math.floor(Math.random() * hues.length)];
        this.alpha = Math.random() * 0.4 + 0.45;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.025 + Math.random() * 0.025;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += this.pulseSpeed;

        // Mouse avoidance/attraction micro-interaction
        if (interactive && mouse.x > 0) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }

        // Screen boundary wrap
        if (this.x < -20) this.x = width + 20;
        else if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        else if (this.y > height + 20) this.y = -20;
      }

      draw() {
        const currentAlpha = Math.max(0.1, this.alpha + Math.sin(this.pulse) * 0.15);
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha})`;
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.6)`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < activeCount; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
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
            const alpha = (1 - dist / activeDistance) * 0.38;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      drawConnections();

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // IntersectionObserver to pause rendering when scrolled past Hero
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

    // Event listeners
    resize();
    initParticles();
    animationFrameId = requestAnimationFrame(animate);

    // Re-verify bounds after layout settle
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
