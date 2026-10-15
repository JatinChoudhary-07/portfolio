import {
  useEffect,
  useRef,
  type CSSProperties,
} from "react";

export type NeuformMode = "dark" | "light";
export type NeuformModePreference = NeuformMode | "auto";

export type ParticleDriftProps = {
  mode?: NeuformModePreference;
  speed?: number;
  size?: number;
  gap?: number;
  length?: number;
  density?: number;
  strokeWidth?: number;
  opacity?: number;
  hue?: number;
  saturation?: number;
  brightness?: number;
  className?: string;
  style?: CSSProperties;
};

const PARTICLE_DRIFT_DEFAULTS = {
  mode: "dark" as NeuformMode,
  speed: 1,
  size: 1,
  gap: 2,
  length: 1,
  density: 1,
  strokeWidth: 1,
  opacity: 1,
  hue: 0,
  saturation: 1,
  brightness: 1,
} as const;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export default function ParticleDrift({
  mode = "dark",
  speed = PARTICLE_DRIFT_DEFAULTS.speed,
  size = PARTICLE_DRIFT_DEFAULTS.size,
  gap = PARTICLE_DRIFT_DEFAULTS.gap,
  length = PARTICLE_DRIFT_DEFAULTS.length,
  density = PARTICLE_DRIFT_DEFAULTS.density,
  strokeWidth = PARTICLE_DRIFT_DEFAULTS.strokeWidth,
  opacity = PARTICLE_DRIFT_DEFAULTS.opacity,
  hue = PARTICLE_DRIFT_DEFAULTS.hue,
  saturation = PARTICLE_DRIFT_DEFAULTS.saturation,
  brightness = PARTICLE_DRIFT_DEFAULTS.brightness,
  className = "",
  style,
}: ParticleDriftProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const safeSpeed = clamp(speed, 0, 3);
  const safeSize = clamp(size, 0.05, 200);
  const safeLength = clamp(length, 0.35, 2.5);
  const safeDensity = clamp(density, 0.25, 2.5);
  const safeStrokeWidth = clamp(strokeWidth, 0.25, 8);
  const safeOpacity = clamp(opacity, 0.05, 1);
  const safeHue = clamp(hue, -180, 180);
  const safeSaturation = clamp(saturation, 0, 2);
  const safeBrightness = clamp(brightness, 0.35, 1.65);

  const isLight = mode === "light";
  const bgColor = isLight ? "#eef1f6" : "#030509";
  const primaryColor = isLight ? "rgba(37, 99, 235," : "rgba(96, 165, 250,";
  const nodeColor = isLight ? "rgba(36, 48, 68, 0.55)" : "rgba(156, 163, 175, 0.4)";
  const activeCharColor = isLight ? "#2563EB" : "#60A5FA";
  const linkAlphaBase = isLight ? 0.22 : 0.15;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*()".split("");
    const mouse = { x: -1000, y: -1000 };

    type Node = {
      x: number;
      y: number;
      vy: number;
      char: string;
    };

    type Beam = {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
    };

    let nodes: Node[] = [];
    let beams: Beam[] = [];

    const nodeCount = Math.max(12, Math.round(90 * safeDensity));
    const beamCount = Math.max(4, Math.round(25 * safeDensity));
    const proximityDistance = Math.round(120 * safeLength);

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initParticles() {
      nodes = Array.from({ length: nodeCount }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: (Math.random() * 0.4 + 0.1) * safeSpeed,
        char: chars[Math.floor(Math.random() * chars.length)],
      }));

      beams = Array.from({ length: beamCount }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        length: (Math.random() * 100 + 50) * safeLength,
        speed: (Math.random() * 6 + 3) * safeSpeed,
        opacity: Math.random() * 0.5 + 0.3,
      }));
    }

    const handleResize = () => {
      resize();
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    resize();
    initParticles();

    function draw() {
      if (!ctx || width === 0 || height === 0) {
        animId = requestAnimationFrame(draw);
        return;
      }

      // Background fill
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // 1. Upward Beams (Fast)
      beams.forEach((b) => {
        b.y -= b.speed;
        if (b.y + b.length < 0) {
          b.y = height + 100;
          b.x = Math.random() * width;
        }
        const g = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.length);
        g.addColorStop(0, `${primaryColor} ${b.opacity * safeOpacity})`);
        g.addColorStop(1, "transparent");
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.5 * safeStrokeWidth;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x, b.y + b.length);
        ctx.stroke();
      });

      // 2. Interactive Nodes (ASCII)
      const fontSize = Math.round(12 * safeSize);
      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Proximity Lines between nodes
      ctx.lineWidth = 0.5 * safeStrokeWidth;
      const len = nodes.length;
      for (let i = 0; i < len; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < len; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const d = Math.hypot(dx, dy);
          if (d < proximityDistance) {
            const alpha = linkAlphaBase * (1 - d / proximityDistance) * safeOpacity;
            ctx.strokeStyle = isLight
              ? `rgba(36, 48, 68, ${alpha})`
              : `rgba(156, 163, 175, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // Nodes drift & mouse reaction
      nodes.forEach((n) => {
        n.y += n.vy; // Slow drift
        if (n.y > height + 20) {
          n.y = -20;
          n.x = Math.random() * width;
        }

        const dist = Math.hypot(mouse.x - n.x, mouse.y - n.y);

        // Dynamic Character Swap
        if (dist < 180 || Math.random() > 0.98) {
          n.char = chars[Math.floor(Math.random() * chars.length)];
        }

        // Mouse Connection Line
        if (dist < 180) {
          ctx.strokeStyle = `${primaryColor} ${(0.5 * (1 - dist / 180) * safeOpacity).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        // Draw character
        ctx.fillStyle = dist < 180 ? activeCharColor : nodeColor;
        ctx.fillText(n.char, n.x, n.y);
      });

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [
    activeCharColor,
    bgColor,
    isLight,
    linkAlphaBase,
    nodeColor,
    primaryColor,
    safeDensity,
    safeLength,
    safeOpacity,
    safeSize,
    safeSpeed,
    safeStrokeWidth,
  ]);

  const filter =
    safeHue === 0 && safeSaturation === 1 && safeBrightness === 1
      ? undefined
      : `hue-rotate(${safeHue}deg) saturate(${safeSaturation}) brightness(${safeBrightness})`;

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{
        backgroundColor: bgColor,
        filter,
        ...style,
      }}
    >
      {/* Matte Noise Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none z-10"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 block"
      />
    </div>
  );
}
