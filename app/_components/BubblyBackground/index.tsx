'use client';

import { useEffect, useRef } from 'react';

export default function BubblyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // キャンバスサイズを設定
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // バブルの設定
    const bubbleCount = Math.floor((canvas.width + canvas.height) * 0.015);
    const bubbles: Array<{
      x: number;
      y: number;
      r: number;
      a: number;
      v: number;
      fill: string;
    }> = [];

    // バブルを生成
    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 3 + Math.random() * 15,
        a: Math.random() * Math.PI * 2,
        v: 0.1 + Math.random() * 0.3,
        fill: `hsla(25, 95%, 40%, ${0.75 + Math.random() * 0.2})`,
      });
    }

    // アニメーション
    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';

      bubbles.forEach((bubble) => {
        // 位置を更新
        bubble.x += Math.cos(bubble.a) * bubble.v;
        bubble.y += Math.sin(bubble.a) * bubble.v;

        // 画面外に出たら反対側から出現
        if (bubble.x < -bubble.r) bubble.x = canvas.width + bubble.r;
        if (bubble.x > canvas.width + bubble.r) bubble.x = -bubble.r;
        if (bubble.y < -bubble.r) bubble.y = canvas.height + bubble.r;
        if (bubble.y > canvas.height + bubble.r) bubble.y = -bubble.r;

        // バブルを描画
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
        ctx.fillStyle = bubble.fill;
        ctx.fill();

        // ほんのり光る効果
        const gradient = ctx.createRadialGradient(bubble.x, bubble.y, 0, bubble.x, bubble.y, bubble.r);
        gradient.addColorStop(0, `hsla(25, 100%, 55%, ${0.5 + Math.random() * 0.15})`);
        gradient.addColorStop(0.5, `hsla(25, 100%, 45%, ${0.3 + Math.random() * 0.1})`);
        gradient.addColorStop(1, 'hsla(25, 100%, 35%, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // クリーンアップ
    return () => {
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
