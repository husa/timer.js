declare namespace Timer {
  type Status = "initialized" | "started" | "paused" | "stopped";

  type StartHandler = (durationMs: number) => void;
  type TickHandler = (remainingMs: number) => void;
  type PauseHandler = () => void;
  type StopHandler = () => void;
  type EndHandler = () => void;

  interface Options {
    tick?: number;
    onstart?: StartHandler | null;
    ontick?: TickHandler | null;
    onpause?: PauseHandler | null;
    onstop?: StopHandler | null;
    onend?: EndHandler | null;
  }

  type EventName = "start" | "tick" | "pause" | "stop" | "end";
  type EventKey = "onstart" | "ontick" | "onpause" | "onstop" | "onend";
}

interface Timer {
  start(durationSeconds?: number): this;
  pause(): this;
  stop(): this;
  getDuration(): number;
  getStatus(): Timer.Status;

  options(): this;
  options(options: Timer.Options): this;
  options<K extends keyof Timer.Options>(
    option: K,
    value: Timer.Options[K],
  ): this;
  options(option: string, value: unknown): this;

  on(event: "start" | "onstart", handler: Timer.StartHandler): this;
  on(event: "tick" | "ontick", handler: Timer.TickHandler): this;
  on(event: "pause" | "onpause", handler: Timer.PauseHandler): this;
  on(event: "stop" | "onstop", handler: Timer.StopHandler): this;
  on(event: "end" | "onend", handler: Timer.EndHandler): this;
  on(event: string, handler: (...args: unknown[]) => void): this;

  off(): this;
  off(event: "all" | Timer.EventName | Timer.EventKey): this;
  off(event: string): this;

  measureStart(label?: string): this;
  measureStop(label?: string): number;
}

declare const Timer: {
  new (options?: Timer.Options): Timer;
  (options?: Timer.Options): Timer;
  prototype: Timer;
};

export = Timer;
export as namespace Timer;
