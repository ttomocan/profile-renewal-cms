'use client';

import { useEffect, useRef } from 'react';

type Bubble = {
  x: number;
  y: number;
  r: number;
  a: number;
  v: number;
  fill: string;
  glowAlpha: number;
};

export default function BubblyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isVisibleRef = { current: true };
    let bubbles: Bubble[] = [];

    const createBubbles = () => {
      const bubbleCount = Math.floor((canvas.width + canvas.height) * 0.009);
      bubbles = Array.from({ length: bubbleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 3 + Math.random() * 15,
        a: Math.random() * Math.PI * 2,
        v: 0.08 + Math.random() * 0.2,
        fill: `hsla(25, 95%, 40%, ${0.72 + Math.random() * 0.16})`,
        glowAlpha: 0.45 + Math.random() * 0.15,
      }));
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      createBubbles();
    };

    resizeCanvas();

    const onVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('resize', resizeCanvas);

    let animationFrameId = 0;

    const animate = () => {
      if (!isVisibleRef.current) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const bubble of bubbles) {
        bubble.x += Math.cos(bubble.a) * bubble.v;
        bubble.y += Math.sin(bubble.a) * bubble.v;

        if (bubble.x < -bubble.r) bubble.x = canvas.width + bubble.r;
        if (bubble.x > canvas.width + bubble.r) bubble.x = -bubble.r;
        if (bubble.y < -bubble.r) bubble.y = canvas.height + bubble.r;
        if (bubble.y > canvas.height + bubble.r) bubble.y = -bubble.r;

        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
        ctx.fillStyle = bubble.fill;
        ctx.fill();

        const gradient = ctx.createRadialGradient(bubble.x, bubble.y, 0, bubble.x, bubble.y, bubble.r);
        gradient.addColorStop(0, `hsla(25, 100%, 55%, ${bubble.glowAlpha})`);
        gradient.addColorStop(0.5, 'hsla(25, 100%, 45%, 0.28)');
        gradient.addColorStop(1, 'hsla(25, 100%, 35%, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="p-top-hero__bubbly"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  );
}
