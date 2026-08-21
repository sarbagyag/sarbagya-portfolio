"use client";

import React, { useEffect, useRef } from "react";

interface BinaryRainProps {
  opacity?: number;
}

const MOBILE_BREAKPOINT = 768; // matches Tailwind's `md`

const BinaryRain: React.FC<BinaryRainProps> = ({ opacity = 0.03 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Purely decorative — skip it entirely on mobile. Two reasons: it's not
    // essential, and mobile browsers fire `resize` constantly as the address
    // bar collapses/expands during scroll, which was clearing/restarting the
    // canvas on every scroll tick and reading as visible flicker.
    if (window.innerWidth < MOBILE_BREAKPOINT) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size — only reacts to width changes. Height-only changes
    // (mobile address bar, if this ever runs near the breakpoint on a
    // resizable window) shouldn't clear and restart the whole effect.
    let lastWidth = window.innerWidth;
    const resizeCanvas = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener("resize", resizeCanvas);

    // Binary rain configuration
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    // Animation function
    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = `rgba(255, 255, 255, 0.05)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties
      ctx.fillStyle = `rgba(14, 165, 233, ${opacity * 3})`; // Primary blue color
      ctx.font = `${fontSize}px monospace`;

      // Draw binary characters
      for (let i = 0; i < drops.length; i++) {
        const text = Math.random() > 0.5 ? "1" : "0";
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        // Reset drop randomly
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    // Animation loop
    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 hidden md:block"
      style={{ opacity }}
    />
  );
};

export default BinaryRain;
