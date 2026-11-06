export class CheatsheetModal {
  private container: HTMLElement | null = null;

  public show() {
    if (this.container || typeof document === "undefined") {
      return;
    }

    const backdrop = document.createElement("div");
    backdrop.id = "spotlight-cheatsheet-modal";
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(6px);
      z-index: 1000000010;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 200ms ease;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    `;

    const dialog = document.createElement("div");
    dialog.style.cssText = `
      background: #1e293b;
      color: #f8fafc;
      border-radius: 14px;
      padding: 24px 28px;
      width: 380px;
      max-width: 90vw;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
    `;

    dialog.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <h3 style="margin: 0; font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
          <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #38bdf8;"></span>
          Spotlight.js Shortcuts
        </h3>
        <button id="spotlight-cheatsheet-close" style="background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer; padding: 4px;">&times;</button>
      </div>
      <div style="display: flex; flex-direction: column; gap: 10px; font-size: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #cbd5e1;">Next Step</span>
          <div>
            <kbd style="background: #334155; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-family: monospace;">→</kbd>
            <span style="color: #64748b; font-size: 11px;">or</span>
            <kbd style="background: #334155; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-family: monospace;">Space</kbd>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #cbd5e1;">Previous Step</span>
          <kbd style="background: #334155; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-family: monospace;">←</kbd>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #cbd5e1;">Close Tour</span>
          <kbd style="background: #334155; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-family: monospace;">Esc</kbd>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #cbd5e1;">Toggle Sound</span>
          <kbd style="background: #334155; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-family: monospace;">M</kbd>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #cbd5e1;">Shortcut Cheatsheet</span>
          <kbd style="background: #334155; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-family: monospace;">?</kbd>
        </div>
      </div>
      <div style="margin-top: 18px; text-align: center;">
        <span style="font-size: 11px; color: #64748b;">Press any key or click outside to dismiss</span>
      </div>
    `;

    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);
    this.container = backdrop;

    requestAnimationFrame(() => {
      backdrop.style.opacity = "1";
    });

    const close = () => this.hide();
    backdrop.addEventListener("click", e => {
      if (e.target === backdrop) close();
    });
    dialog.querySelector("#spotlight-cheatsheet-close")?.addEventListener("click", close);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "?") {
        close();
        window.removeEventListener("keydown", onKey);
      }
    };
    window.addEventListener("keydown", onKey);
  }

  public hide() {
    if (!this.container) return;
    this.container.style.opacity = "0";
    setTimeout(() => {
      this.container?.remove();
      this.container = null;
    }, 200);
  }

  public toggle() {
    if (this.container) {
      this.hide();
    } else {
      this.show();
    }
  }
}

export const defaultCheatsheet = new CheatsheetModal();
