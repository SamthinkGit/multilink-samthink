"use client";

import { useEffect, useRef } from "react";

/*
  Full-screen field of drifting alphanumeric glyphs. A slow simplex-noise
  "weather" decides which regions of the grid are lit; every pointer press
  sends a blue shockwave through the grid that scrambles and tints the glyphs
  it passes. Rendered on a single canvas from pre-baked glyph atlases so a
  1080p screen (~15k cells) stays cheap.
*/

const CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// Atlas tints: resting gray glyphs, the signal blue, and the hot wavefront.
const TINTS = ["#c9ced6", "#4c8bff", "#a9c8ff"] as const;

const FRAME_MS = 1000 / 40;
const RIPPLE_SPEED = 380; // px/s
const RIPPLE_LIFE = 3.2; // s
const RIPPLE_WIDTH = 54; // px, wavefront thickness
const IDLE_RIPPLE_EVERY = 6.5; // s without interaction before an ambient pulse

type Ripple = {
  x: number;
  y: number;
  t0: number;
  strength: number;
  /** Per-wave noise offset so no two waves deform alike. */
  seed: number;
  /** Elliptical skew: the wave spreads faster along one random axis. */
  cos: number;
  sin: number;
  squash: number;
};

function makeRipple(x: number, y: number, t0: number, strength: number) {
  const a = Math.random() * Math.PI;
  return {
    x,
    y,
    t0,
    strength,
    seed: Math.random() * 100,
    cos: Math.cos(a),
    sin: Math.sin(a),
    squash: 0.62 + Math.random() * 0.28,
  };
}

/* ---------- 2D simplex noise (Gustavson), seeded ---------- */

function makeNoise(seed: number) {
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  let s = seed >>> 0;
  for (let i = 255; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const grad = [
    [1, 1], [-1, 1], [1, -1], [-1, -1],
    [1, 0], [-1, 0], [0, 1], [0, -1],
  ];
  const F2 = 0.5 * (Math.sqrt(3) - 1);
  const G2 = (3 - Math.sqrt(3)) / 6;

  return (xin: number, yin: number) => {
    const s2 = (xin + yin) * F2;
    const i = Math.floor(xin + s2);
    const j = Math.floor(yin + s2);
    const t = (i + j) * G2;
    const x0 = xin - (i - t);
    const y0 = yin - (j - t);
    const i1 = x0 > y0 ? 1 : 0;
    const j1 = x0 > y0 ? 0 : 1;
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;
    const ii = i & 255;
    const jj = j & 255;

    let n = 0;
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 > 0) {
      const g = grad[perm[ii + perm[jj]] & 7];
      t0 *= t0;
      n += t0 * t0 * (g[0] * x0 + g[1] * y0);
    }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 > 0) {
      const g = grad[perm[ii + i1 + perm[jj + j1]] & 7];
      t1 *= t1;
      n += t1 * t1 * (g[0] * x1 + g[1] * y1);
    }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 > 0) {
      const g = grad[perm[ii + 1 + perm[jj + 1]] & 7];
      t2 *= t2;
      n += t2 * t2 * (g[0] * x2 + g[1] * y2);
    }
    return 70 * n; // ~[-1, 1]
  };
}

/* ---------- glyph atlases ---------- */

function buildAtlas(
  color: string,
  font: string,
  cw: number,
  ch: number,
  dpr: number,
) {
  const atlas = document.createElement("canvas");
  atlas.width = Math.ceil(CHARSET.length * cw * dpr);
  atlas.height = Math.ceil(ch * dpr);
  const ctx = atlas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  for (let i = 0; i < CHARSET.length; i++) {
    ctx.fillText(CHARSET[i], i * cw + cw / 2, ch / 2 + 0.5);
  }
  return atlas;
}

export function AsciiField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const noise = makeNoise((Math.random() * 2 ** 32) >>> 0);
    // next/font hashes the family name; read the real one from its variable.
    const monoFamily =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-label")
        .trim() || "ui-monospace, Menlo, monospace";
    const N = CHARSET.length;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let cw = 7.2;
    let ch = 14;
    let cols = 0;
    let rows = 0;
    let glyphs = new Uint8Array(0);
    let atlases: HTMLCanvasElement[] = [];

    const ripples: Ripple[] = [];
    const pointer = { x: -1e4, y: -1e4, glow: 0, target: 0 };
    let lastInteraction = performance.now() / 1000;
    let nextIdle = IDLE_RIPPLE_EVERY;

    let raf = 0;
    let lastFrame = 0;
    const start = performance.now();

    function setup() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;

      const fontSize = W < 640 ? 10 : 11;
      cw = fontSize * 0.62;
      ch = fontSize * 1.32;
      const font = `500 ${fontSize}px ${monoFamily}`;
      atlases = TINTS.map((c) => buildAtlas(c, font, cw, ch, dpr));

      cols = Math.ceil(W / cw) + 1;
      rows = Math.ceil(H / ch) + 1;
      glyphs = new Uint8Array(cols * rows);
      for (let i = 0; i < glyphs.length; i++) {
        glyphs[i] = (Math.random() * N) | 0;
      }
    }

    function draw(now: number) {
      const t = (now - start) / 1000;
      const sec = now / 1000;

      // Ambient pulse so first-time visitors discover the interaction.
      if (!reduceMotion && sec - lastInteraction > nextIdle) {
        ripples.push(
          makeRipple(
            W * (0.15 + Math.random() * 0.7),
            H * (0.15 + Math.random() * 0.7),
            sec,
            0.55,
          ),
        );
        lastInteraction = sec;
        nextIdle = IDLE_RIPPLE_EVERY + Math.random() * 4;
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (sec - ripples[i].t0 > RIPPLE_LIFE) ripples.splice(i, 1);
      }

      pointer.glow += (pointer.target - pointer.glow) * 0.08;

      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.fillStyle = "#050505";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      const sw = cw * dpr;
      const sh = ch * dpr;
      const scale = 0.0021;
      const drift = t * 0.035;
      const rCount = ripples.length;
      const glowR2 = 160 * 160;

      for (let r = 0; r < rows; r++) {
        const y = r * ch + ch / 2;
        // Rows are grouped into horizontal "bands" like the reference: a
        // second, stretched noise layer breaks the clouds into streaks.
        const bandBase = y * scale * 2.4;
        for (let c = 0; c < cols; c++) {
          const x = c * cw + cw / 2;
          const idx = r * cols + c;

          // Weather: two drifting octaves, the second stretched horizontally.
          let n =
            noise(x * scale + drift, y * scale - drift * 0.6) * 0.65 +
            noise(x * scale * 0.55 - drift * 0.8, bandBase + drift * 0.4) *
              0.35;
          n = (n + 1) * 0.5; // 0..1
          // Only the crests of the weather light up, and only faintly.
          let base = n > 0.56 ? (n - 0.56) / 0.44 : 0;
          base = base * base * 0.34;

          // Cursor lamp: a faint lift of nearby glyphs.
          if (pointer.glow > 0.01) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < glowR2) {
              base += (1 - d2 / glowR2) * 0.16 * pointer.glow;
            }
          }

          // Shockwaves. A coarse grain mask breaks the wake into patches
          // instead of a solid disc.
          let blue = 0;
          let hot = 0;
          const grain =
            rCount > 0
              ? (noise(x * 0.011 - drift, y * 0.026 + drift) + 1) * 0.5
              : 0;
          for (let k = 0; k < rCount; k++) {
            const rp = ripples[k];
            const age = sec - rp.t0;
            const p = age / RIPPLE_LIFE;
            // Eases out: the wave bursts, then loses momentum.
            const front = RIPPLE_SPEED * age * (1 - 0.3 * p);
            // Distance measured in the wave's own skewed frame.
            const dx0 = x - rp.x;
            const dy0 = y - rp.y;
            const dx = dx0 * rp.cos + dy0 * rp.sin;
            const dy = (dy0 * rp.cos - dx0 * rp.sin) / rp.squash;
            const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
            // Deformation grows as it travels: round at birth, a soft blob later.
            const amp = 0.06 + 0.26 * Math.min(1, age / 1.4);
            if (dist > front * (1 + amp * 1.3) + RIPPLE_WIDTH * 2) continue;

            // Radius depends on direction: one very low-frequency noise read
            // around a small circle gives one or two broad, smooth bulges
            // (higher frequencies turn it into a flower). It drifts slowly
            // so the outline keeps breathing as it grows.
            const ux = dx / dist;
            const uy = dy / dist;
            const bulge = noise(ux * 0.55 + rp.seed, uy * 0.55 + age * 0.25);
            const off = dist - front * (1 + amp * bulge);
            const life = 1 - p;
            const fade = Math.pow(life, 1.4) * rp.strength;
            if (off > RIPPLE_WIDTH * 2) continue;

            // Slight, broad wobble so the edge reads organic, not stamped.
            const wobble = noise(x * 0.008 + rp.t0, y * 0.008) * 9;
            const o = (off + wobble) / RIPPLE_WIDTH;
            const ring = Math.exp(-o * o) * (0.5 + 0.5 * grain);
            const tail =
              off < 0 ? Math.exp(off / 220) * 0.75 * grain * grain : 0;
            const v = (ring + tail) * fade;
            if (v > blue) blue = v;
            if (ring * fade > hot) hot = ring * fade;
          }

          if (blue > 0.08 && Math.random() < blue * 0.5) {
            glyphs[idx] = (Math.random() * N) | 0;
          } else if (Math.random() < 0.0035) {
            glyphs[idx] = (Math.random() * N) | 0;
          }

          let atlas = 0;
          let alpha = base;
          if (blue > 0.06) {
            atlas = hot > 0.7 ? 2 : 1;
            alpha = Math.max(base, Math.min(1, blue * 0.95));
          }
          if (alpha < 0.03) continue;

          ctx!.globalAlpha = alpha > 1 ? 1 : alpha;
          ctx!.drawImage(
            atlases[atlas],
            glyphs[idx] * sw,
            0,
            sw,
            sh,
            c * sw,
            r * sh,
            sw,
            sh,
          );
        }
      }
      ctx!.globalAlpha = 1;
    }

    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      if (now - lastFrame < FRAME_MS) return;
      lastFrame = now;
      draw(now);
    }

    function onPointerDown(e: PointerEvent) {
      if (reduceMotion) return;
      const sec = performance.now() / 1000;
      ripples.push(makeRipple(e.clientX, e.clientY, sec, 1));
      if (ripples.length > 8) ripples.shift();
      lastInteraction = sec;
    }
    function onPointerMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.target = 1;
      lastInteraction = performance.now() / 1000;
    }
    function onPointerLeave() {
      pointer.target = 0;
    }

    let resizeTimer = 0;
    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setup();
        if (reduceMotion) draw(performance.now());
      }, 120);
    }

    function onVisibility() {
      if (reduceMotion) return;
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(loop);
    }

    const begin = () => {
      setup();
      if (reduceMotion) draw(performance.now());
      else raf = requestAnimationFrame(loop);
    };
    // Bake the atlases with the real webfont, not the fallback.
    document.fonts
      .load(`500 12px ${monoFamily}`)
      .catch(() => undefined)
      .then(begin);

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 block"
    />
  );
}
