"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const GAP = 22; // px between dots
const SPEED = 260; // ring growth, px/s
const LIFE = 2.8; // s a ring lasts
const BAND = 16; // ring thickness, px

type Ping = { x: number; y: number; t0: number; accent: boolean };

/**
 * Hero background: a dot grid where servers "ping". Rings spread from random
 * points and light the dots they pass (now and then in the accent color), and
 * dots near the pointer brighten. One canvas, paused while offscreen; a still
 * grid with reduced motion.
 */
export function HeroField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let ink = "#000";
    let accent = "#6366f1";
    let pointer: { x: number; y: number } | null = null;
    const pings: Ping[] = [];
    let raf = 0;
    let visible = false;
    let nextPing = 0;

    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      ink = s.getPropertyValue("--color-ink").trim() || ink;
      accent = s.getPropertyValue("--color-accent").trim() || accent;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced || !visible) draw(performance.now());
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      const t = now / 1000;
      for (let i = pings.length - 1; i >= 0; i--) if (t - pings[i].t0 > LIFE) pings.splice(i, 1);
      const ox = (w % GAP) / 2;
      const oy = (h % GAP) / 2;
      for (let y = oy; y < h; y += GAP) {
        for (let x = ox; x < w; x += GAP) {
          let boost = 0;
          let tint = false;
          for (const p of pings) {
            const age = t - p.t0;
            const d = Math.hypot(x - p.x, y - p.y) - age * SPEED;
            const b = Math.exp(-(d * d) / (2 * BAND * BAND)) * (1 - age / LIFE);
            if (b > boost) {
              boost = b;
              tint = p.accent;
            }
          }
          if (pointer) {
            const d = Math.hypot(x - pointer.x, y - pointer.y);
            if (d < 140) boost = Math.max(boost, (1 - d / 140) * 0.7);
          }
          ctx.globalAlpha = 0.09 + boost * 0.6;
          ctx.fillStyle = tint && boost > 0.08 ? accent : ink;
          const s = 1.5 + boost * 1.2;
          ctx.fillRect(x - s / 2, y - s / 2, s, s);
        }
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      if (now > nextPing) {
        pings.push({ x: Math.random() * w, y: Math.random() * h, t0: now / 1000, accent: Math.random() < 0.4 });
        nextPing = now + 900 + Math.random() * 900;
      }
      draw(now);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (reduced || raf) return;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    readColors();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    // The theme toggle flips data-theme on <html>.
    const mo = new MutationObserver(() => {
      readColors();
      if (reduced) draw(performance.now());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      pointer = x >= 0 && y >= 0 && x <= r.width && y <= r.height ? { x, y } : null;
    };
    if (!reduced) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}
