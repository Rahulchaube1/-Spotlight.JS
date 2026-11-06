export type ConfettiOptions = {
  particleCount?: number;
  spread?: number;
  colors?: string[];
  duration?: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
};

const DEFAULT_COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ec4899", // pink
  "#8b5cf6", // purple
  "#06b6d4", // cyan
  "#f43f5e", // rose
];

export function launchConfetti(options: ConfettiOptions = {}) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const particleCount = options.particleCount ?? 80;
  const spread = options.spread ?? 70;
  const colors = options.colors ?? DEFAULT_COLORS;
  const totalDuration = options.duration ?? 2200;

  const canvas = document.createElement("canvas");
  canvas.id = "spotlight-confetti-canvas";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "1000000005";

  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();

  const originX = canvas.width / 2;
  const originY = canvas.height * 0.45;

  const particles: Particle[] = [];
  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI / 180) * (270 + (Math.random() - 0.5) * spread * 2);
    const speed = Math.random() * 12 + 6;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
    });
  }

  const startTime = Date.now();
  let animationFrameId: number;

  function render() {
    const elapsed = Date.now() - startTime;
    const progress = elapsed / totalDuration;

    if (progress >= 1) {
      window.cancelAnimationFrame(animationFrameId);
      canvas.remove();
      return;
    }

    ctx!.clearRect(0, 0, canvas.width, canvas.height);

    const gravity = 0.35;
    const drag = 0.985;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += gravity;
      p.vx *= drag;
      p.vy *= drag;
      p.rotation += p.rotationSpeed;
      p.opacity = Math.max(0, 1 - Math.pow(progress, 1.8));

      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate((p.rotation * Math.PI) / 180);
      ctx!.globalAlpha = p.opacity;
      ctx!.fillStyle = p.color;
      ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx!.restore();
    }

    animationFrameId = window.requestAnimationFrame(render);
  }

  animationFrameId = window.requestAnimationFrame(render);
}
