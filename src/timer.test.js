const assert = require("node:assert/strict");
const { describe, it, beforeEach, afterEach, mock } = require("node:test");
const Timer = require("./timer");

describe("Timer", () => {
  let timer;
  let start;
  let stop;
  let pause;
  let end;
  let tick;

  beforeEach(() => {
    timer = new Timer();
    start = mock.fn();
    pause = mock.fn();
    stop = mock.fn();
    tick = mock.fn();
    end = mock.fn();

    mock.timers.enable({
      apis: ["setTimeout", "setInterval", "Date"],
    });
    mock.timers.setTime(0);
  });

  afterEach(() => {
    mock.timers.reset();
  });

  it("should be available as global", () => {
    assert.ok(Timer);
  });

  describe("#constructor", () => {
    it('should self invoke without "new" keyword', () => {
      const timer = new Timer();
      const timer2 = Timer();

      assert.ok(timer instanceof Timer);
      assert.ok(timer2 instanceof Timer);
    });

    it("should accept object as arguments", () => {
      timer = new Timer({
        onstart: start,
        onpause: pause,
        onstop: stop,
      });

      timer.start();
      assert.equal(start.mock.callCount(), 0);
      timer.start(10);
      assert.equal(start.mock.callCount(), 1);
      timer.pause();
      assert.equal(pause.mock.callCount(), 1);
      timer.stop();
      assert.equal(stop.mock.callCount(), 1);
    });
  });

  describe("#getStatus", () => {
    it("should always be string", () => {
      assert.equal(typeof timer.getStatus(), "string");
    });

    it("should be valid status", () => {
      const match = /^(initialized|started|paused|stopped|finished)$/;
      assert.match(timer.getStatus(), match);
    });
  });

  describe("#getDuration", () => {
    it("should return 0 if timer isn't started or paused", () => {
      assert.equal(timer.getDuration(), 0);
      timer.start(10);
      assert.equal(timer.getDuration(), 10000);
      timer.pause();
      assert.equal(timer.getDuration(), 10000);
      timer.stop();
      assert.equal(timer.getDuration(), 0);
    });

    it("should return actual value", () => {
      timer.start(10);
      mock.timers.tick(100);
      assert.equal(timer.getDuration(), 9900);
      mock.timers.tick(1100);
      assert.equal(timer.getDuration(), 8800);
      timer.pause();
      mock.timers.tick(100);
      assert.equal(timer.getDuration(), 8800);
      timer.start();
      mock.timers.tick(100);
      assert.equal(timer.getDuration(), 8700);
    });
  });

  describe("#start", () => {
    it("should not change status if no arguments", () => {
      timer.start();
      assert.equal(timer.getStatus(), "initialized");
      timer.start(10);
      assert.equal(timer.getStatus(), "started");
      timer.start();
      assert.equal(timer.getStatus(), "started");
    });

    it("should ignore zero duration when no previous duration", () => {
      timer.on("start", start);
      timer.on("end", end);
      timer.start(0);
      assert.equal(timer.getStatus(), "initialized");
      assert.equal(start.mock.callCount(), 0);
      mock.timers.tick(1000);
      assert.equal(end.mock.callCount(), 0);
    });

    it("should treat negative duration the same as zero", () => {
      timer.on("start", start);
      timer.on("end", end);
      timer.start(-5);
      assert.equal(timer.getStatus(), "initialized");
      assert.equal(start.mock.callCount(), 0);
      mock.timers.tick(1000);
      assert.equal(end.mock.callCount(), 0);
    });

    it('should change status to "started" if valid arguments', () => {
      assert.equal(timer.getStatus(), "initialized");
      timer.start(10);
      assert.equal(timer.getStatus(), "started");
    });

    it('should trigger "onstart" callback', () => {
      timer.on("start", start);
      timer.start(1);
      assert.equal(start.mock.callCount(), 1);
      assert.deepEqual(start.mock.calls[0].arguments, [1000]);
    });

    it("should resume timer after pause", () => {
      timer.on("end", end);
      timer.start(5);
      mock.timers.tick(1000);
      timer.pause();
      assert.equal(timer.getStatus(), "paused");
      timer.start();
      assert.equal(timer.getStatus(), "started");
      mock.timers.tick(3900);
      assert.equal(timer.getDuration(), 100);
      assert.equal(timer.getStatus(), "started");
      mock.timers.tick(101);
      assert.equal(timer.getStatus(), "stopped");
      assert.equal(end.mock.callCount(), 1);
    });

    it("should restart timer if argument provided after pause", () => {
      timer.on("end", end);
      timer.start(5);
      mock.timers.tick(1000);
      timer.pause();
      assert.equal(timer.getStatus(), "paused");
      timer.start(10);
      assert.equal(timer.getDuration(), 10000);
      mock.timers.tick(4001);
      assert.equal(end.mock.callCount(), 0);
      assert.equal(timer.getDuration(), 5999);
      mock.timers.tick(6000);
      assert.equal(end.mock.callCount(), 1);
    });

    it('should ignore start calls if already "started"', () => {
      timer.on("start", start);
      timer.start(5);
      assert.equal(timer.getDuration(), 5000);
      assert.equal(start.mock.callCount(), 1);
      // any new .start calls are ignored
      timer.start(10);
      assert.equal(start.mock.callCount(), 1);
      assert.equal(timer.getDuration(), 5000);
      timer.start([{ what: "ever" }]);
      assert.equal(start.mock.callCount(), 1);
      assert.equal(timer.getDuration(), 5000);
    });
  });

  describe("#pause", () => {
    it("should return if timer hasn't started", () => {
      timer.on("pause", pause);
      timer.pause();
      assert.equal(timer.getStatus(), "initialized");
      assert.equal(pause.mock.callCount(), 0);
    });

    it('should change status to "paused"', () => {
      timer.start(1);
      timer.pause();
      assert.equal(timer.getStatus(), "paused");
    });

    it('should trigger "onpause" callback', () => {
      timer.on("pause", pause);
      timer.start(1);
      timer.pause();
      assert.equal(pause.mock.callCount(), 1);
      timer.pause();
      assert.equal(pause.mock.callCount(), 1);
    });
  });

  describe("#stop", () => {
    it("should return if timer hasn't started", () => {
      timer.on("stop", stop);
      timer.stop();
      assert.equal(timer.getStatus(), "initialized");
      assert.equal(stop.mock.callCount(), 0);
    });

    it('should change status to "stopped" after start', () => {
      timer.on("stop", stop);
      timer.start(1);
      timer.stop();
      assert.equal(timer.getStatus(), "stopped");
      assert.equal(stop.mock.callCount(), 1);
    });

    it('should change status to "stopped" after pause', () => {
      timer.on("stop", stop);
      timer.start(1);
      timer.pause();
      timer.stop();
      assert.equal(timer.getStatus(), "stopped");
      assert.equal(stop.mock.callCount(), 1);
    });

    it('should trigger "onstop" callback', () => {
      timer.on("stop", stop);
      timer.start(1);
      timer.stop();
      assert.equal(stop.mock.callCount(), 1);
      timer.stop();
      assert.equal(stop.mock.callCount(), 1);
    });
  });

  describe("#on", () => {
    it("should attach start callback", () => {
      timer.on("start", start);
      timer.start(1);
      assert.equal(start.mock.callCount(), 1);
    });

    it("should attach pause callback", () => {
      timer.on("pause", pause);
      timer.start(1);
      timer.pause();
      assert.equal(pause.mock.callCount(), 1);
    });

    it("should attach stop callback", () => {
      timer.on("stop", stop);
      timer.start(1);
      timer.stop();
      assert.equal(stop.mock.callCount(), 1);
    });

    it("should attach end callback", () => {
      timer.on("end", end);
      timer.start(1);
      mock.timers.tick(1001);
      assert.equal(end.mock.callCount(), 1);
    });

    it("should attach tick callback", () => {
      timer.on("tick", tick);
      timer.start(2);
      mock.timers.tick(1001);
      assert.equal(tick.mock.callCount(), 1);
    });

    it('should accept options with/without "on"', () => {
      timer.on("tick", tick);
      timer.on("onstart", start);
      timer.on("onstop", stop);
      timer.start(2);
      mock.timers.tick(1001);
      timer.stop();
      assert.equal(start.mock.callCount(), 1);
      assert.equal(tick.mock.callCount(), 1);
      assert.equal(stop.mock.callCount(), 1);
    });
  });

  describe("#off", () => {
    beforeEach(() => {
      timer.on("tick", tick);
      timer.on("onstart", start);
      timer.on("stop", stop);
    });

    it("should remove callbacks", () => {
      timer.off("tick");
      timer.off("onstart");
      timer.off("stop");
      timer.start(2);
      mock.timers.tick(1900);
      timer.stop();
      assert.equal(start.mock.callCount(), 0);
      assert.equal(tick.mock.callCount(), 0);
      assert.equal(stop.mock.callCount(), 0);
    });

    it('should remove all callbacks if "all" passed', () => {
      timer.off("all");
      timer.start(2);
      mock.timers.tick(1900);
      timer.stop();
      assert.equal(start.mock.callCount(), 0);
      assert.equal(tick.mock.callCount(), 0);
      assert.equal(stop.mock.callCount(), 0);
    });
  });

  describe("#callbacks execution", () => {
    beforeEach(() => {
      timer.options({
        onstart: start,
        ontick: tick,
        onpause: pause,
        onend: end,
        onstop: stop,
      });
    });

    it('should trigger "tick" every second', () => {
      timer.start(3);
      mock.timers.tick(1001);
      assert.equal(tick.mock.callCount(), 1);
      mock.timers.tick(1000);
      assert.equal(tick.mock.callCount(), 2);
      mock.timers.tick(1000);
      assert.equal(tick.mock.callCount(), 2);
    });

    it('should trigger "end"', () => {
      timer.start(2);
      mock.timers.tick(2001);
      assert.equal(end.mock.callCount(), 1);
    });

    it('should not trigger "end" if stopped', () => {
      timer.start(2);
      mock.timers.tick(1900);
      timer.stop();
      mock.timers.tick(1000);
      assert.equal(end.mock.callCount(), 0);
      assert.equal(stop.mock.callCount(), 1);
    });
  });

  describe("#chaining", () => {
    it("should chain any way", () => {
      assert.doesNotThrow(() => {
        timer
          .pause()
          .stop()
          .start()
          .start(20)
          .stop()
          .pause()
          .start()
          .on()
          .off()
          .options()
          .stop();
      });
    });
  });
});
