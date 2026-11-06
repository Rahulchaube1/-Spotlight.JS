export type SpotlightAnalyticsEventType =
  | "tour_start"
  | "step_view"
  | "step_complete"
  | "step_prev"
  | "tour_complete"
  | "tour_exit";

export type SpotlightAnalyticsEvent = {
  event: SpotlightAnalyticsEventType;
  stepIndex?: number;
  totalSteps?: number;
  stepElement?: string;
  stepTitle?: string;
  timeOnStepMs?: number;
  totalDurationMs?: number;
  exitReason?: string;
  timestamp: number;
};

export type AnalyticsHandler = (event: SpotlightAnalyticsEvent) => void;

export class SpotlightAnalyticsTracker {
  private handler?: AnalyticsHandler;
  private tourStartTime: number = 0;
  private stepStartTime: number = 0;
  private currentStepIndex: number = 0;
  private totalSteps: number = 0;

  constructor(handler?: AnalyticsHandler) {
    this.handler = handler;
  }

  public setHandler(handler?: AnalyticsHandler) {
    this.handler = handler;
  }

  public trackTourStart(totalSteps: number) {
    this.tourStartTime = Date.now();
    this.stepStartTime = this.tourStartTime;
    this.totalSteps = totalSteps;
    this.dispatch({
      event: "tour_start",
      totalSteps,
      timestamp: this.tourStartTime,
    });
  }

  public trackStepView(stepIndex: number, elementSelector?: string, title?: string) {
    const now = Date.now();
    this.currentStepIndex = stepIndex;
    this.stepStartTime = now;
    this.dispatch({
      event: "step_view",
      stepIndex,
      totalSteps: this.totalSteps,
      stepElement: elementSelector,
      stepTitle: title,
      totalDurationMs: now - this.tourStartTime,
      timestamp: now,
    });
  }

  public trackStepComplete(stepIndex: number) {
    const now = Date.now();
    const timeOnStep = now - this.stepStartTime;
    this.dispatch({
      event: "step_complete",
      stepIndex,
      totalSteps: this.totalSteps,
      timeOnStepMs: timeOnStep,
      totalDurationMs: now - this.tourStartTime,
      timestamp: now,
    });
  }

  public trackTourComplete() {
    const now = Date.now();
    this.dispatch({
      event: "tour_complete",
      totalSteps: this.totalSteps,
      totalDurationMs: now - this.tourStartTime,
      timestamp: now,
    });
  }

  public trackTourExit(reason?: string) {
    const now = Date.now();
    this.dispatch({
      event: "tour_exit",
      stepIndex: this.currentStepIndex,
      totalSteps: this.totalSteps,
      timeOnStepMs: now - this.stepStartTime,
      totalDurationMs: now - this.tourStartTime,
      exitReason: reason,
      timestamp: now,
    });
  }

  private dispatch(event: SpotlightAnalyticsEvent) {
    if (this.handler) {
      try {
        this.handler(event);
      } catch (err) {
        console.warn("[Spotlight.js] Analytics dispatch error:", err);
      }
    }
  }
}
