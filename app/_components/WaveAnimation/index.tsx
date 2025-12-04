'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';

type WaveAnimationProps = {
  colors?: string[];
  speed?: number;
  height?: number;
  className?: string;
};

type WaveLayer = {
  color: string;
  alpha: number;
  zoom: number;
  delay: number;
};

type AnimationState = {
  seconds: number;
  t: number;
  isRunning: boolean;
  animationFrameId?: number;
};

const CONSTANTS = {
  WAVE: {
    UNIT: 80,
    SPEED: 0.005,
    HEIGHT: 100,
    STEP: 10,
    EXTRA_WIDTH: 10,
  },
  DEBOUNCE_MS: 16, // ~60fps
} as const;

export default function WaveAnimation({ colors = ['#f36b0a', '#f36b0a', '#f36b0a'], speed = CONSTANTS.WAVE.SPEED, height = CONSTANTS.WAVE.HEIGHT, className = '' }: WaveAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationStateRef = useRef<AnimationState>({
    seconds: 0,
    t: 0,
    isRunning: false,
  });
  const resizeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Wave layers configuration - memoized for performance
  const waveLayers = useMemo<WaveLayer[]>(
    () => [
      { color: colors[0], alpha: 1, zoom: 3, delay: 0 },
      { color: colors[1], alpha: 0.6, zoom: 2, delay: 250 },
      { color: colors[2], alpha: 0.3, zoom: 1.6, delay: 100 },
    ],
    [colors]
  );

  // Device pixel ratio handling with memoization
  const devicePixelRatio = useMemo(() => {
    return typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  }, []);

  /**
   * Adjusts canvas for high DPI displays
   */
  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement): CanvasRenderingContext2D | null => {
      const context = canvas.getContext('2d');
      if (!context) return null;

      const rect = canvas.getBoundingClientRect();
      const dpr = devicePixelRatio;

      // Set actual size in memory (scaled for DPI)
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Set display size (CSS pixels)
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      // Scale the context to ensure correct drawing operations
      context.scale(dpr, dpr);

      // Store context reference
      contextRef.current = context;

      return context;
    },
    [devicePixelRatio]
  );

  /**
   * Draws a sine wave path
   */
  const createSinePath = useCallback((canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, t: number, zoom: number, delay: number) => {
    const rect = canvas.getBoundingClientRect();
    const centerY = rect.height / 2;

    context.beginPath();

    // Starting point
    let x = t;
    let y = Math.sin(x) / zoom;
    context.moveTo(0, CONSTANTS.WAVE.UNIT * y + centerY);

    // Draw the wave
    for (let i = 0; i <= rect.width + CONSTANTS.WAVE.EXTRA_WIDTH; i += CONSTANTS.WAVE.STEP) {
      x = t + i / CONSTANTS.WAVE.UNIT / zoom;
      y = Math.sin(x - delay) / 3;
      context.lineTo(i, CONSTANTS.WAVE.UNIT * y + centerY);
    }

    // Complete the shape
    context.lineTo(rect.width + CONSTANTS.WAVE.EXTRA_WIDTH, rect.height);
    context.lineTo(0, rect.height);
    context.closePath();
  }, []);

  /**
   * Renders a single wave layer
   */
  const renderWaveLayer = useCallback(
    (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, layer: WaveLayer, t: number) => {
      context.save();
      context.fillStyle = layer.color;
      context.globalAlpha = layer.alpha;

      createSinePath(canvas, context, t / 0.5, layer.zoom, layer.delay);
      context.fill();

      context.restore();
    },
    [createSinePath]
  );

  /**
   * Main drawing function
   */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const context = contextRef.current;

    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    context.clearRect(0, 0, canvas.width, canvas.height);

    const currentT = animationStateRef.current.t;

    // Render all wave layers
    waveLayers.forEach((layer) => {
      renderWaveLayer(canvas, context, layer, currentT);
    });
  }, [waveLayers, renderWaveLayer]);

  /**
   * Animation loop
   */
  const animate = useCallback(() => {
    const state = animationStateRef.current;

    if (!state.isRunning) return;

    draw();

    // Update animation state
    state.seconds += speed;
    state.t = state.seconds * Math.PI;

    // Schedule next frame
    state.animationFrameId = requestAnimationFrame(animate);
  }, [draw, speed]);

  /**
   * Starts the animation
   */
  const startAnimation = useCallback(() => {
    const state = animationStateRef.current;

    if (state.isRunning) return;

    state.isRunning = true;
    animate();
  }, [animate]);

  /**
   * Stops the animation
   */
  const stopAnimation = useCallback(() => {
    const state = animationStateRef.current;

    state.isRunning = false;
    if (state.animationFrameId) {
      cancelAnimationFrame(state.animationFrameId);
      state.animationFrameId = undefined;
    }
  }, []);

  /**
   * Handles canvas resize with debouncing
   */
  const handleResize = useCallback(() => {
    // Clear existing timeout
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    // Debounce resize handling
    resizeTimeoutRef.current = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      stopAnimation();

      // Reset canvas and context
      const newContext = setupCanvas(canvas);
      if (newContext) {
        // Reset animation state
        animationStateRef.current.seconds = 0;
        animationStateRef.current.t = 0;

        startAnimation();
      }
    }, CONSTANTS.DEBOUNCE_MS);
  }, [setupCanvas, startAnimation, stopAnimation]);

  /**
   * Initialize and cleanup
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initial setup
    const context = setupCanvas(canvas);
    if (!context) return;

    startAnimation();

    // Setup resize observer
    let resizeObserver: ResizeObserver | undefined;

    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(canvas);
    } else if (typeof window !== 'undefined') {
      (window as Window).addEventListener('resize', handleResize);
    }

    // Cleanup function
    return () => {
      stopAnimation();

      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
      } else if (typeof window !== 'undefined') {
        (window as Window).removeEventListener('resize', handleResize);
      }
    };
  }, [setupCanvas, startAnimation, stopAnimation, handleResize]);

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
      aria-label="Wave animation background"
    />
  );
}
