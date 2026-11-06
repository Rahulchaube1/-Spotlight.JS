import type { DriveStep } from "./driver";

export class VisualTourBuilder {
  private active: boolean = false;
  private recordedSteps: DriveStep[] = [];
  private toolbar: HTMLElement | null = null;
  private hoverOverlay: HTMLElement | null = null;
  private currentHoverElement: Element | null = null;

  public start() {
    if (this.active || typeof document === "undefined") return;
    this.active = true;
    this.recordedSteps = [];
    this.createToolbar();
    this.createHoverOverlay();
    this.attachListeners();
  }

  public stop() {
    if (!this.active) return;
    this.active = false;
    this.toolbar?.remove();
    this.hoverOverlay?.remove();
    this.toolbar = null;
    this.hoverOverlay = null;
    this.currentHoverElement = null;
    this.detachListeners();
  }

  public getSteps(): DriveStep[] {
    return [...this.recordedSteps];
  }

  private createToolbar() {
    const bar = document.createElement("div");
    bar.id = "spotlight-builder-toolbar";
    bar.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #0f172a;
      color: #f8fafc;
      padding: 10px 20px;
      border-radius: 9999px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
      z-index: 1000000020;
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
    `;

    bar.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #22c55e; animation: pulse 1.5s infinite;"></span>
        <strong style="color: #38bdf8;">Spotlight Builder</strong>
        <span id="spotlight-builder-step-count" style="background: #334155; padding: 2px 8px; border-radius: 9999px; font-weight: 600;">0 steps</span>
      </div>
      <div style="height: 16px; width: 1px; background: #334155;"></div>
      <button id="spotlight-builder-copy" style="background: #2563eb; color: #fff; border: none; padding: 6px 14px; border-radius: 9999px; cursor: pointer; font-weight: 600;">Export Code</button>
      <button id="spotlight-builder-exit" style="background: #334155; color: #94a3b8; border: none; padding: 6px 14px; border-radius: 9999px; cursor: pointer; font-weight: 600;">Exit</button>
    `;

    document.body.appendChild(bar);
    this.toolbar = bar;

    bar.querySelector("#spotlight-builder-copy")?.addEventListener("click", () => {
      this.exportCode();
    });

    bar.querySelector("#spotlight-builder-exit")?.addEventListener("click", () => {
      this.stop();
    });
  }

  private createHoverOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "spotlight-builder-inspector";
    overlay.style.cssText = `
      position: fixed;
      pointer-events: none;
      border: 2px dashed #38bdf8;
      background: rgba(56, 189, 248, 0.15);
      border-radius: 4px;
      z-index: 1000000015;
      display: none;
      transition: all 60ms ease-out;
    `;
    document.body.appendChild(overlay);
    this.hoverOverlay = overlay;
  }

  private onMouseMove = (e: MouseEvent) => {
    if (!this.active || !this.hoverOverlay) return;
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (!target || target.closest("#spotlight-builder-toolbar") || target.closest(".spotlight-builder-modal")) {
      this.hoverOverlay.style.display = "none";
      this.currentHoverElement = null;
      return;
    }

    this.currentHoverElement = target;
    const rect = target.getBoundingClientRect();
    this.hoverOverlay.style.display = "block";
    this.hoverOverlay.style.top = `${rect.top}px`;
    this.hoverOverlay.style.left = `${rect.left}px`;
    this.hoverOverlay.style.width = `${rect.width}px`;
    this.hoverOverlay.style.height = `${rect.height}px`;
  };

  private onClick = (e: MouseEvent) => {
    if (!this.active || !this.currentHoverElement) return;
    if ((e.target as Element).closest("#spotlight-builder-toolbar") || (e.target as Element).closest(".spotlight-builder-modal")) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const el = this.currentHoverElement;
    const selector = this.computeSelector(el);
    this.promptStepDetails(selector);
  };

  private attachListeners() {
    window.addEventListener("mousemove", this.onMouseMove, true);
    window.addEventListener("click", this.onClick, true);
  }

  private detachListeners() {
    window.removeEventListener("mousemove", this.onMouseMove, true);
    window.removeEventListener("click", this.onClick, true);
  }

  private computeSelector(el: Element): string {
    if (el.id) return `#${el.id}`;
    if (el.getAttribute("data-spotlight")) return `[data-spotlight="${el.getAttribute("data-spotlight")}"]`;
    if (el.getAttribute("data-testid")) return `[data-testid="${el.getAttribute("data-testid")}"]`;
    if (el.className && typeof el.className === "string") {
      const firstClass = el.className.trim().split(/\s+/)[0];
      if (firstClass && !firstClass.startsWith("spotlight-")) return `.${firstClass}`;
    }
    return el.tagName.toLowerCase();
  }

  private promptStepDetails(selector: string) {
    const modal = document.createElement("div");
    modal.className = "spotlight-builder-modal";
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #1e293b;
      color: #f8fafc;
      padding: 24px;
      border-radius: 12px;
      width: 360px;
      max-width: 90vw;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 1000000030;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    modal.innerHTML = `
      <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700;">Add Spotlight Step</h3>
      <div style="font-size: 12px; color: #94a3b8; margin-bottom: 12px; word-break: break-all;">
        Target: <code style="color: #38bdf8;">${selector}</code>
      </div>
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
        <input id="builder-step-title" placeholder="Step Title" style="background: #334155; border: 1px solid #475569; color: #fff; padding: 8px 12px; border-radius: 6px; font-size: 13px; outline: none;" />
        <textarea id="builder-step-desc" placeholder="Step Description" rows="3" style="background: #334155; border: 1px solid #475569; color: #fff; padding: 8px 12px; border-radius: 6px; font-size: 13px; outline: none; resize: vertical;"></textarea>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 8px;">
        <button id="builder-step-cancel" style="background: #334155; color: #cbd5e1; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;">Cancel</button>
        <button id="builder-step-save" style="background: #2563eb; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: 600;">Add Step</button>
      </div>
    `;

    document.body.appendChild(modal);
    const titleInput = modal.querySelector("#builder-step-title") as HTMLInputElement;
    titleInput.focus();

    const close = () => modal.remove();
    modal.querySelector("#builder-step-cancel")?.addEventListener("click", close);
    modal.querySelector("#builder-step-save")?.addEventListener("click", () => {
      const title = titleInput.value.trim();
      const desc = (modal.querySelector("#builder-step-desc") as HTMLTextAreaElement).value.trim();
      this.recordedSteps.push({
        element: selector,
        popover: {
          title: title || undefined,
          description: desc || undefined,
        },
      });

      const countEl = this.toolbar?.querySelector("#spotlight-builder-step-count");
      if (countEl) {
        countEl.textContent = `${this.recordedSteps.length} step${this.recordedSteps.length === 1 ? "" : "s"}`;
      }
      close();
    });
  }

  private exportCode() {
    const code = `import { spotlight } from "spotlight.js";
import "spotlight.js/dist/spotlight.css";

const tour = spotlight({
  steps: ${JSON.stringify(this.recordedSteps, null, 2)}
});

tour.drive();`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        alert("Spotlight tour code copied to clipboard!");
      }).catch(() => {
        console.log("Spotlight Tour Code:\n", code);
        alert("Spotlight tour code output to Developer Console.");
      });
    } else {
      console.log("Spotlight Tour Code:\n", code);
      alert("Spotlight tour code output to Developer Console.");
    }
  }
}

export const defaultTourBuilder = new VisualTourBuilder();
