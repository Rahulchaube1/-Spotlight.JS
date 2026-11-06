/**
 * Spotlight.js Lite (Ultra-Super-Light Edition)
 * Zero-dependency, under 3.5 kB gzipped tour and spotlight engine.
 */

export type LiteStep = {
  element?: string | Element;
  title?: string;
  description?: string;
  nextText?: string;
  prevText?: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
};

export type LiteConfig = {
  steps?: LiteStep[];
  storageKey?: string;
  autoResume?: boolean;
  animate?: boolean;
  stagePadding?: number;
  stageRadius?: number;
  overlayColor?: string;
  overlayOpacity?: number;
  onDone?: () => void;
  onExit?: () => void;
};

export function spotlightLite(config: LiteConfig = {}) {
  let activeIndex = -1;

  const steps = config.steps || [];
  const padding = config.stagePadding ?? 10;
  const radius = config.stageRadius ?? 6;
  const overlayColor = config.overlayColor ?? "rgba(0,0,0,0.7)";

  function getStored(): number {
    if (!config.storageKey) return 0;
    try {
      const v = localStorage.getItem(`spotlight_${config.storageKey}`);
      return v ? parseInt(v, 10) : 0;
    } catch {
      return 0;
    }
  }

  function setStored(index: number, done = false) {
    if (!config.storageKey) return;
    try {
      if (done) localStorage.setItem(`spotlight_${config.storageKey}_done`, "1");
      localStorage.setItem(`spotlight_${config.storageKey}`, String(index));
    } catch {}
  }

  function isDone(): boolean {
    if (!config.storageKey) return false;
    try {
      return !!localStorage.getItem(`spotlight_${config.storageKey}_done`);
    } catch {
      return false;
    }
  }

  function resolveElement(el?: string | Element): Element | null {
    if (!el) return null;
    return typeof el === "string" ? document.querySelector(el) : el;
  }

  function createOverlay(): SVGSVGElement {
    let svg = document.getElementById("spotlight-lite-overlay") as unknown as SVGSVGElement;
    if (svg) return svg;

    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "spotlight-lite-overlay";
    svg.setAttribute("style", `position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:999999998;pointer-events:none;transition:opacity 0.25s ease;`);
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.id = "spotlight-lite-path";
    path.setAttribute("fill", overlayColor);
    path.setAttribute("fill-rule", "evenodd");
    svg.appendChild(path);

    document.body.appendChild(svg);
    return svg;
  }

  function updateOverlay(rect?: DOMRect) {
    const svg = createOverlay();
    const path = svg.querySelector("#spotlight-lite-path");
    if (!path) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    if (!rect) {
      path.setAttribute("d", `M0,0 H${w} V${h} H0 Z`);
      return;
    }

    const x = Math.max(0, rect.left - padding);
    const y = Math.max(0, rect.top - padding);
    const rw = rect.width + padding * 2;
    const rh = rect.height + padding * 2;
    const r = radius;

    // Compound path with rounded cutout
    path.setAttribute(
      "d",
      `M0,0 H${w} V${h} H0 Z ` +
      `M${x + r},${y} ` +
      `H${x + rw - r} ` +
      `A${r},${r} 0 0,1 ${x + rw},${y + r} ` +
      `V${y + rh - r} ` +
      `A${r},${r} 0 0,1 ${x + rw - r},${y + rh} ` +
      `H${x + r} ` +
      `A${r},${r} 0 0,1 ${x},${y + rh - r} ` +
      `V${y + r} ` +
      `A${r},${r} 0 0,1 ${x + r},${y} Z`
    );
  }

  function createPopover(): HTMLElement {
    let pop = document.getElementById("spotlight-lite-popover");
    if (pop) return pop;

    pop = document.createElement("div");
    pop.id = "spotlight-lite-popover";
    pop.setAttribute(
      "style",
      `position:fixed;z-index:999999999;background:#fff;color:#1e293b;border-radius:12px;padding:16px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 8px 10px -6px rgba(0,0,0,0.1);max-width:320px;font-family:Inter,system-ui,sans-serif;transition:all 0.2s ease;border:1px solid #e2e8f0;`
    );
    document.body.appendChild(pop);
    return pop;
  }

  function positionPopover(pop: HTMLElement, rect?: DOMRect) {
    if (!rect) {
      pop.style.top = `${window.innerHeight / 2 - pop.offsetHeight / 2}px`;
      pop.style.left = `${window.innerWidth / 2 - pop.offsetWidth / 2}px`;
      return;
    }

    const popW = pop.offsetWidth || 280;
    const popH = pop.offsetHeight || 120;

    let top = rect.bottom + padding + 10;
    let left = rect.left;

    // Viewport bounds detection
    if (top + popH > window.innerHeight) {
      top = Math.max(10, rect.top - padding - popH - 10);
    }
    if (left + popW > window.innerWidth) {
      left = Math.max(10, window.innerWidth - popW - 10);
    }

    pop.style.top = `${top}px`;
    pop.style.left = `${left}px`;
  }

  function renderStep(idx: number) {
    if (idx < 0 || idx >= steps.length) {
      destroy();
      return;
    }

    activeIndex = idx;
    setStored(idx);

    const step = steps[idx];
    const el = resolveElement(step.element);
    const rect = el ? el.getBoundingClientRect() : undefined;

    if (el) {
      el.scrollIntoView({ behavior: config.animate !== false ? "smooth" : "auto", block: "center" });
    }

    updateOverlay(rect);

    const pop = createPopover();
    const isLast = idx === steps.length - 1;
    const isFirst = idx === 0;

    pop.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
        <h4 style="margin:0;font-size:16px;font-weight:700;color:#0f172a;">${step.title || ""}</h4>
        <button id="spotlight-lite-close" style="background:none;border:none;font-size:18px;cursor:pointer;color:#94a3b8;padding:0 4px;">&times;</button>
      </div>
      <p style="margin:0 0 14px;font-size:13px;line-height:1.5;color:#64748b;">${step.description || ""}</p>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
        <span style="font-size:11px;font-weight:600;color:#94a3b8;">${idx + 1} of ${steps.length}</span>
        <div style="display:flex;gap:6px;">
          ${!isFirst ? `<button id="spotlight-lite-prev" style="background:#f1f5f9;color:#334155;border:1px solid #cbd5e1;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">${step.prevText || "Prev"}</button>` : ""}
          <button id="spotlight-lite-next" style="background:#0284c7;color:#fff;border:none;padding:6px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">${isLast ? "Done" : (step.nextText || "Next")}</button>
        </div>
      </div>
    `;

    positionPopover(pop, rect);

    // Event listeners
    pop.querySelector("#spotlight-lite-close")?.addEventListener("click", destroy);
    pop.querySelector("#spotlight-lite-prev")?.addEventListener("click", () => renderStep(activeIndex - 1));
    pop.querySelector("#spotlight-lite-next")?.addEventListener("click", () => {
      if (isLast) {
        setStored(idx, true);
        destroy();
        config.onDone?.();
      } else {
        renderStep(activeIndex + 1);
      }
    });
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === "Escape") destroy();
    if (e.key === "ArrowRight") renderStep(activeIndex + 1);
    if (e.key === "ArrowLeft") renderStep(activeIndex - 1);
  }

  function start(startIdx?: number) {
    let idx = startIdx ?? 0;
    if (config.autoResume && !isDone()) {
      idx = getStored();
    }
    window.addEventListener("keydown", handleKey);
    window.addEventListener("resize", () => {
      if (activeIndex >= 0 && activeIndex < steps.length) {
        const el = resolveElement(steps[activeIndex].element);
        const rect = el?.getBoundingClientRect();
        updateOverlay(rect);
        const pop = document.getElementById("spotlight-lite-popover");
        if (pop) positionPopover(pop, rect);
      }
    });
    renderStep(idx);
  }

  function destroy() {
    window.removeEventListener("keydown", handleKey);
    const svg = document.getElementById("spotlight-lite-overlay");
    svg?.remove();
    const pop = document.getElementById("spotlight-lite-popover");
    pop?.remove();
    activeIndex = -1;
    config.onExit?.();
  }

  return {
    start,
    drive: start,
    destroy,
    next: () => renderStep(activeIndex + 1),
    previous: () => renderStep(activeIndex - 1),
    isCompleted: isDone,
    reset: () => {
      if (config.storageKey) {
        localStorage.removeItem(`spotlight_${config.storageKey}`);
        localStorage.removeItem(`spotlight_${config.storageKey}_done`);
      }
    }
  };
}

export default spotlightLite;
