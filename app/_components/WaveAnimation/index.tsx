'use client';

import { useEffect, useRef, useCallback } from 'react';

type WaveAnimationProps = {
  colors?: string[];
  speed?: number;
  height?: number;
  className?: string;
};

const CONSTANTS = {
  WAVE: {
    UNIT: 80,
    SPEED: 0.005,
    HEIGHT: 100,
  },
};

export default function WaveAnimation({ colors = ['#f36b0a', '#f36b0a', '#f36b0a'], speed = CONSTANTS.WAVE.SPEED, height = CONSTANTS.WAVE.HEIGHT, className = '' }: WaveAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const infoRef = useRef({ seconds: 0, t: 0 });
  const isRunningRef = useRef(false);

  const adjustCanvasForHiDPI = useCallback((canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');
    if (!context) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    context.scale(dpr, dpr);
  }, []);

  const drawSine = useCallback((canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, t: number, zoom: number, delay: number) => {
    const xAxis = Math.floor(canvas.height / 2);
    let x = t;
    let y = Math.sin(x) / zoom;

    context.moveTo(0, CONSTANTS.WAVE.UNIT * y + xAxis);

    for (let i = 0; i <= canvas.width + 10; i += 10) {
      x = t + (i - 0) / CONSTANTS.WAVE.UNIT / zoom;
      y = Math.sin(x - delay) / 3;
      context.lineTo(i, CONSTANTS.WAVE.UNIT * y + xAxis);
    }
  }, []);

  const drawWave = useCallback(
    (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, color: string, alpha: number, zoom: number, delay: number) => {
      context.fillStyle = color;
      context.globalAlpha = alpha;
      context.beginPath();

      drawSine(canvas, context, infoRef.current.t / 0.5, zoom, delay);

      context.lineTo(canvas.width + 10, canvas.height);
      context.lineTo(0, canvas.height);
      context.closePath();
      context.fill();
    },
    [drawSine]
  );

  const draw = useCallback(
    (canvas: HTMLCanvasElement, colors: string[]) => {
      const context = canvas.getContext('2d');
      if (!context) return;

      context.clearRect(0, 0, canvas.width, canvas.height);

      drawWave(canvas, context, colors[0], 1, 3, 0);
      drawWave(canvas, context, colors[1], 0.6, 2, 250);
      drawWave(canvas, context, colors[2], 0.3, 1.6, 100);
    },
    [drawWave]
  );

  const update = useCallback(() => {
    if (!isRunningRef.current || !canvasRef.current) return;

    draw(canvasRef.current, colors);

    infoRef.current.seconds += speed;
    infoRef.current.t = infoRef.current.seconds * Math.PI;

    animationFrameRef.current = requestAnimationFrame(update);
  }, [draw, colors, speed]);

  const start = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    update();
  }, [update]);

  const stop = useCallback(() => {
    isRunningRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const handleResize = useCallback(() => {
    if (!canvasRef.current) return;

    stop();
    adjustCanvasForHiDPI(canvasRef.current);
    infoRef.current.seconds = 0;
    start();
  }, [adjustCanvasForHiDPI, start, stop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    adjustCanvasForHiDPI(canvas);
    start();

    // ResizeObserver でリサイズを監視
    let resizeObserver: ResizeObserver;

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      stop();
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [adjustCanvasForHiDPI, start, stop, handleResize]);

  return (
    <canvas
      ref={canvasRef}
      id="waveCanvas"
      className={className}
      style={{
        width: '100%',
        height: `${height}px`,
        display: 'block',
      }}
    />
  );
}
