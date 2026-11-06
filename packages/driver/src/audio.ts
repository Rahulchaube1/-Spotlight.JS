export type SoundType = "chime" | "click" | "pop" | "success" | "warning";

export type AudioConfig = {
  enabled?: boolean;
  volume?: number;
};

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.12;

  constructor(config?: AudioConfig) {
    if (config) {
      if (typeof config.enabled === "boolean") this.enabled = config.enabled;
      if (typeof config.volume === "number") this.volume = Math.max(0, Math.min(1, config.volume));
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public play(type: SoundType) {
    if (!this.enabled) {
      return;
    }

    const ctx = this.getAudioContext();
    if (!ctx) {
      return;
    }

    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume, now);
      masterGain.connect(ctx.destination);

      if (type === "chime") {
        // Melodic upward chime (D5 -> A5)
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

        masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "click") {
        // Subtle soft navigation tick
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, now);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === "pop") {
        // Soft bubble pop
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.13);
      } else if (type === "success") {
        // Harmonic victory arpeggio: C5 -> E5 -> G5 -> C6
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          const noteTime = now + idx * 0.07;
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, noteTime);
          noteGain.gain.setValueAtTime(this.volume * 0.6, noteTime);
          noteGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);
          osc.connect(noteGain);
          noteGain.connect(ctx.destination);
          osc.start(noteTime);
          osc.stop(noteTime + 0.38);
        });
      } else if (type === "warning") {
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, now);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.16);
      }
    } catch {
      // Audio playback silently falls back without interrupting tour
    }
  }
}

export const defaultSynthesizer = new SoundSynthesizer();
export { SoundSynthesizer };
