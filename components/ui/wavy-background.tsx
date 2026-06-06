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
  const safariBlurOverscan = Math.ceil(blur * 3);
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

    const isSafari =
      navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome");
    const safariCanvasOffset = isSafari ? `-${safariBlurOverscan}px` : "";

    canvas.style.filter = isSafari ? `blur(${blur}px)` : "";
    canvas.style.top = safariCanvasOffset;
    canvas.style.right = safariCanvasOffset;
    canvas.style.bottom = safariCanvasOffset;
    canvas.style.left = safariCanvasOffset;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return () => {
        canvas.style.filter = "";
        canvas.style.top = "";
        canvas.style.right = "";
        canvas.style.bottom = "";
        canvas.style.left = "";
      };
    }

    const noise = createNoise3D();
    let width = 0;
    let height = 0;
    let noiseTime = 0;
    let animationId: number;

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth + (isSafari ? safariBlurOverscan * 2 : 0);
      height = canvas.height = window.innerHeight + (isSafari ? safariBlurOverscan * 2 : 0);
      ctx.filter = `blur(${blur}px)`;
    };

    const drawWave = (count: number) => {
      noiseTime += animationSpeed;

      for (let i = 0; i < count; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth || 50;
        ctx.strokeStyle = waveColors[i % waveColors.length];

        for (let x = 0; x < width; x += 5) {
          const y = noise(x / 800, 0.3 * i, noiseTime) * 100;
          ctx.lineTo(x, y + height * 0.5);
        }

        ctx.stroke();
        ctx.closePath();
      }
    };

    const render = () => {
      ctx.fillStyle = backgroundFill || "black";
      ctx.globalAlpha = waveOpacity || 0.5;
      ctx.fillRect(0, 0, width, height);
      drawWave(5);
      animationId = requestAnimationFrame(render);
    };

    resizeCanvas();
    render();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
      canvas.style.filter = "";
      canvas.style.top = "";
      canvas.style.right = "";
      canvas.style.bottom = "";
      canvas.style.left = "";
    };
  }, [animationSpeed, backgroundFill, blur, safariBlurOverscan, waveColors, waveOpacity, waveWidth]);

  return (
    <div
      className={cn(
        "relative h-screen w-full overflow-hidden flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
