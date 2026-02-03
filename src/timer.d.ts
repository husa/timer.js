declare namespace Timer {
  /** Timer state values. */
  type Status = "initialized" | "started" | "paused" | "stopped";

  /** Called when the timer starts. Receives remaining duration in ms. */
  type StartHandler = (durationMs: number) => void;
  /** Called on each tick. Receives remaining duration in ms. */
  type TickHandler = (remainingMs: number) => void;
  /** Called when the timer pauses. */
  type PauseHandler = () => void;
  /** Called when the timer stops. */
  type StopHandler = () => void;
  /** Called when the timer ends naturally. */
  type EndHandler = () => void;

  interface Options {
    /** Tick interval in seconds. */
    tick?: number;
    /** Start callback. */
    onstart?: StartHandler | null;
    /** Tick callback. */
    ontick?: TickHandler | null;
    /** Pause callback. */
    onpause?: PauseHandler | null;
    /** Stop callback. */
    onstop?: StopHandler | null;
    /** End callback. */
    onend?: EndHandler | null;
  }

  /** Event names without the "on" prefix. */
  type EventName = "start" | "tick" | "pause" | "stop" | "end";
  /** Event names with the "on" prefix. */
  type EventKey = "onstart" | "ontick" | "onpause" | "onstop" | "onend";
}

/** Lightweight countdown timer. */
interface Timer {
  /**
   * Start the timer.
   * @param durationSeconds Optional duration in seconds. If omitted, reuses the last duration.
   * @example
   * const timer = Timer();
   * timer.start(5);
   */
  start(durationSeconds?: number): this;
  /** Pause the timer, preserving remaining time. */
  pause(): this;
  /** Stop the timer and reset remaining time to 0. */
  stop(): this;
  /** Remaining time in milliseconds. */
  getDuration(): number;
  /** Current lifecycle status. */
  getStatus(): Timer.Status;

  /** Get or set options. */
  options(): this;
  /** Set options in bulk. */
  options(options: Timer.Options): this;
  /** Set a single option. */
  options<K extends keyof Timer.Options>(
    option: K,
    value: Timer.Options[K],
  ): this;
  /** Set a custom option by name. */
  options(option: string, value: unknown): this;

  /** Register a start handler. */
  on(event: "start" | "onstart", handler: Timer.StartHandler): this;
  /** Register a tick handler. */
  on(event: "tick" | "ontick", handler: Timer.TickHandler): this;
  /** Register a pause handler. */
  on(event: "pause" | "onpause", handler: Timer.PauseHandler): this;
  /** Register a stop handler. */
  on(event: "stop" | "onstop", handler: Timer.StopHandler): this;
  /** Register an end handler. */
  on(event: "end" | "onend", handler: Timer.EndHandler): this;
  /** Register a handler for a custom event key. */
  on(event: string, handler: (...args: unknown[]) => void): this;

  /** Remove all handlers. */
  off(): this;
  /** Remove handlers for a specific event. */
  off(event: "all" | Timer.EventName | Timer.EventKey): this;
  /** Remove handlers for a custom event key. */
  off(event: string): this;

  /** Start a measurement timer for the given label. */
  measureStart(label?: string): this;
  /** Stop a measurement timer and return elapsed ms. */
  measureStop(label?: string): number;
}

/** Timer constructor. */
declare const Timer: {
  /** Create a new timer instance. */
  new (options?: Timer.Options): Timer;
  /** Create a new timer instance without `new`. */
  (options?: Timer.Options): Timer;
  prototype: Timer;
};

export = Timer;
export as namespace Timer;
