import React, { useEffect, useRef } from "react";

interface MatrixRainProps {
  className?: string;
}

const MatrixRain: React.FC<MatrixRainProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Matrix characters - mix of binary and Japanese characters
    const chars =
      "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    // Different speeds for each column
    const speeds: number[] = Array(columns)
      .fill(0)
      .map(() => Math.random() * 0.5 + 0.5);

    // Character change probability for each column
    const changeProb: number[] = Array(columns)
      .fill(0)
      .map(() => Math.random() * 0.1 + 0.02);

    // Animation function
    const animate = () => {
      // Create fade effect
      ctx.fillStyle = "rgba(10, 10, 10, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties
      ctx.fillStyle = "#00ff41";
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;

      // Draw characters for each column
      for (let i = 0; i < drops.length; i++) {
        // Randomly select character
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Add slight opacity variation
        const opacity = Math.random() * 0.5 + 0.5;
        ctx.fillStyle = `rgba(0, 255, 65, ${opacity})`;

        ctx.fillText(char, x, y);

        // Reset drop conditions
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] += speeds[i];
        }

        // Randomly change character
        if (Math.random() < changeProb[i]) {
          drops[i] += 0.1;
        }
      }
    };

    const intervalId = setInterval(animate, 50);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none opacity-10 z-0 ${className}`}
      style={{ mixBlendMode: "screen" }}
      aria-hidden="true"
    />
  );
};

export default MatrixRain;
