"use client";

import { useEffect, useRef, type ReactNode } from "react";

type DiamondBackgroundProps = {
  tileSize?: number;
  strokeOpacity?: number;
  waveSpeed?: number;
  color?: string;
  children?: ReactNode;
};

type DrawArgs = {
  ctx: CanvasRenderingContext2D;
  W: number;
  H: number;
  t: number;
  hw: number;
  hh: number;
  rgb: string;
  maxAlpha: number;
};

function hexToRgbTriplet(hex: string): string {
  const cleaned = hex.replace("#", "");
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

// Connected diamond grid.
//
// Every row is `hh` apart vertically. Odd rows are shifted +hw on x. That
// makes each diamond's bottom corner (cx, cy + hh) coincide with the top
// corner of the diamond below it (which sits at center (cx + hw, cy + hh)
// when going from even→odd, or (cx - hw, cy + hh) when going odd→even —
// both land at the same junction point). Likewise the right corner of
// (col, row) shares the left corner of (col + 1, row). No gaps, ever.
function drawFrame({ ctx, W, H, t, hw, hh, rgb, maxAlpha }: DrawArgs) {
  ctx.clearRect(0, 0, W, H);
  ctx.lineWidth = 0.75;

  const baseAlpha = 0.06;
  const span = maxAlpha - baseAlpha;

  const halfW = W * 0.5;
  const halfH = H * 0.5;
  const radius = Math.hypot(halfW, halfH) || 1;

  const cols = Math.ceil(W / (2 * hw)) + 2;
  const rows = Math.ceil(H / hh) + 2;

  for (let row = -1; row < rows; row++) {
    const odd = (row & 1) !== 0;
    const offsetX = odd ? hw : 0;
    const cy = row * hh;
    for (let col = -1; col < cols; col++) {
      const cx = col * 2 * hw + offsetX;

      const wave = Math.sin(t - (cx / W) * 4 - (cy / H) * 3);
      const n = (wave + 1) * 0.5;
      const shimmer = n * n * (3 - 2 * n);

      const dx = (cx - halfW) / radius;
      const dy = (cy - halfH) / radius;
      const dist = Math.min(1, Math.hypot(dx, dy));
      const edgeFade = 0.4 + 0.6 * dist;

      const strokeAlpha = (baseAlpha + span * shimmer) * edgeFade;
      ctx.strokeStyle = `rgba(${rgb}, ${strokeAlpha})`;
      ctx.beginPath();
      ctx.moveTo(cx, cy - hh);
      ctx.lineTo(cx + hw, cy);
      ctx.lineTo(cx, cy + hh);
      ctx.lineTo(cx - hw, cy);
      ctx.closePath();
      ctx.stroke();

      if (shimmer > 0.72) {
        const dotAlpha = ((shimmer - 0.72) / 0.28) * 0.55 * edgeFade;
        ctx.fillStyle = `rgba(${rgb}, ${dotAlpha})`;
        ctx.beginPath();
        ctx.moveTo(cx + 1.2, cy - hh);
        ctx.arc(cx, cy - hh, 1.2, 0, Math.PI * 2);
        ctx.moveTo(cx + hw + 1.2, cy);
        ctx.arc(cx + hw, cy, 1.2, 0, Math.PI * 2);
        ctx.moveTo(cx + 1.2, cy + hh);
        ctx.arc(cx, cy + hh, 1.2, 0, Math.PI * 2);
        ctx.moveTo(cx - hw + 1.2, cy);
        ctx.arc(cx - hw, cy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

export function DiamondBackground({
  tileSize = 36,
  strokeOpacity = 0.28,
  waveSpeed = 0.0006,
  color = "#D4A24C",
  children,
}: DiamondBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rgb = hexToRgbTriplet(color);
    const hw = tileSize;
    const hh = tileSize * 0.6;

    let W = 0;
    let H = 0;
    let rafId = 0;

    const sizeToParent = () => {
      const rect = wrap.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motionQuery.matches;

    const renderStatic = () => {
      drawFrame({ ctx, W, H, t: 0, hw, hh, rgb, maxAlpha: strokeOpacity });
    };

    const tick = (now: number) => {
      const t = now * waveSpeed;
      drawFrame({ ctx, W, H, t, hw, hh, rgb, maxAlpha: strokeOpacity });
      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(rafId);
      if (reduced) {
        renderStatic();
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    sizeToParent();
    start();

    const ro = new ResizeObserver(() => {
      sizeToParent();
      if (reduced) renderStatic();
    });
    ro.observe(wrap);

    const onMotionChange = (e: MediaQueryListEvent) => {
      reduced = e.matches;
      start();
    };
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, [tileSize, strokeOpacity, waveSpeed, color]);

  return (
    <div
      ref={wrapRef}
      style={{ position: "relative", width: "100%", minHeight: "100%" }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          width: "100%",
          height: "100%",
          willChange: "transform",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

export default DiamondBackground;
