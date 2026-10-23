"use client";

import { cn } from "@/utils/cn";
import React, { useEffect, useMemo, useRef } from "react";
import { createNoise3D } from "simplex-noise";

const defaultWaveColors = [
  "#909CC2",
  "#084887",
  "#F58A07",
  "#F9AB55",
  "#F7F5FB",
];

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveColors = useMemo(() => colors ?? defaultWaveColors, [colors]);
  const animationSpeed = useMemo(() => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const noise = createNoise3D();
    let width = 0;
    let height = 0;
    let noiseTime = 0;
    let animationId = 0;
    let lastFrameTime: number | undefined;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resizeCanvas = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;

      if (width === nextWidth && height === nextHeight) return;

      width = canvas.width = nextWidth;
      height = canvas.height = nextHeight;
      drawFrame();
    };

    const drawWave = (count: number) => {
      for (let i = 0; i < count; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth ?? 50;
        ctx.strokeStyle = waveColors[i % waveColors.length];

        for (let x = 0; x < width; x += 5) {
          const y = noise(x / 800, 0.3 * i, noiseTime) * 100;
          ctx.lineTo(x, y + height * 0.5);
        }

        ctx.stroke();
        ctx.closePath();
      }
    };

    const drawFrame = () => {
      ctx.fillStyle = backgroundFill ?? "black";
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = waveOpacity ?? 0.5;
      drawWave(5);
    };

    const render = (timestamp: number) => {
      // Keep motion consistent across refresh rates and avoid jumps after a pause.
      const elapsed = lastFrameTime === undefined ? 0 : Math.min(timestamp - lastFrameTime, 50);
      lastFrameTime = timestamp;
      noiseTime += animationSpeed * elapsed / (1000 / 60);
      drawFrame();
      animationId = requestAnimationFrame(render);
    };

    const updateAnimation = () => {
      cancelAnimationFrame(animationId);
      lastFrameTime = undefined;
      if (!motionPreference.matches && !document.hidden) {
        animationId = requestAnimationFrame(render);
      } else {
        drawFrame();
      }
    };

    resizeCanvas();
    updateAnimation();
    motionPreference.addEventListener("change", updateAnimation);
    document.addEventListener("visibilitychange", updateAnimation);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
      motionPreference.removeEventListener("change", updateAnimation);
      document.removeEventListener("visibilitychange", updateAnimation);
    };
  }, [animationSpeed, backgroundFill, waveColors, waveOpacity, waveWidth]);

  return (
    <div
      className={cn(
        "relative h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-black",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        style={{ filter: `blur(${blur}px)` }}
        aria-hidden="true"
        ref={canvasRef}
        id="canvas"
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
