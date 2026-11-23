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
  MOTION_BUDGET_MS: 4500,
  MIN_VISIBLE_RATIO: 0.01,
} as const;

export default function WaveAnimation({ colors = ['#f36b0a', '#f36b0a', '#f36b0a'], speed = CONSTANTS.WAVE.SPEED, height = CONSTANTS.WAVE.HEIGHT, className = '' }: WaveAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationStateRef = useRef<AnimationState>({
    seconds: 0,
    t: 0,
    isRunning: false,
  });
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Decorative movement is capped across pauses, resize and re-render.
  const remainingMotionRef = useRef<number>(CONSTANTS.MOTION_BUDGET_MS);

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
  const animate = useCallback(function animateFrame() {
    const state = animationStateRef.current;

    if (!state.isRunning) return;

    draw();

    // Update animation state
    state.seconds += speed;
    state.t = state.seconds * Math.PI;

    // Schedule next frame
    state.animationFrameId = requestAnimationFrame(animateFrame);
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

      // Preserve both the drawn phase and the remaining animation budget.
      if (setupCanvas(canvas)) draw();
    }, CONSTANTS.DEBOUNCE_MS);
  }, [setupCanvas, draw]);

  /**
   * Initialize and cleanup
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initial setup
    const context = setupCanvas(canvas);
    if (!context) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isInView = false;
    let startedAt: number | undefined;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;

    const pause = () => {
      if (startedAt !== undefined) {
        remainingMotionRef.current = Math.max(0, remainingMotionRef.current - (performance.now() - startedAt));
        startedAt = undefined;
      }
      if (finishTimer !== undefined) {
        clearTimeout(finishTimer);
        finishTimer = undefined;
      }
      stopAnimation();
    };

    const syncMotion = () => {
      if (!isInView || document.visibilityState !== 'visible' || motionQuery.matches || remainingMotionRef.current <= 0) {
        pause();
        return;
      }
      if (startedAt !== undefined) return;

      startedAt = performance.now();
      startAnimation();
      finishTimer = setTimeout(() => {
        pause();
        remainingMotionRef.current = 0;
        draw();
      }, remainingMotionRef.current);
    };

    // Keep a static wave visible before scrolling in, after the cap, and in reduced motion.
    draw();
    motionQuery.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncMotion);

    const checkViewport = () => {
      const rect = canvas.getBoundingClientRect();
      isInView = rect.width > 0 && rect.height > 0 &&
        rect.top < window.innerHeight && rect.bottom > 0 &&
        rect.left < window.innerWidth && rect.right > 0;
      syncMotion();
    };
    let intersectionObserver: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(entries => {
        const entry = entries.find(item => item.target === canvas);
        if (!entry) return;
        isInView = entry.isIntersecting && entry.intersectionRatio >= CONSTANTS.MIN_VISIBLE_RATIO;
        syncMotion();
      }, { threshold: CONSTANTS.MIN_VISIBLE_RATIO });
      intersectionObserver.observe(canvas);
    } else {
      window.addEventListener('scroll', checkViewport, { passive: true });
      window.addEventListener('resize', checkViewport);
      checkViewport();
    }

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
      pause();
      motionQuery.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncMotion);
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      } else {
        window.removeEventListener('scroll', checkViewport);
        window.removeEventListener('resize', checkViewport);
      }

      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
      } else if (typeof window !== 'undefined') {
        (window as Window).removeEventListener('resize', handleResize);
      }
    };
  }, [setupCanvas, startAnimation, stopAnimation, handleResize, draw]);

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
      aria-hidden="true"
    />
  );
}
