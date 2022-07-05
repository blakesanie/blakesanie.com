class Pauseable {
  constructor(func, interval, options = {}) {
    this.func = func;
    this.interval = interval;
    this.paused = false;
    this.verbose = options.verbose || false;
    this.name = options.name || "PauseableInterval";
    this.immediate = options.immediate || false;
    this.pauseableType = options.pauseableType;
    this.startInterval();
  }

  setNextIteration() {
    const now = new Date();
    now.setMilliseconds(now.getMilliseconds() + this.interval);
    this.nextIteration = now;
  }

  async startInterval() {
    if (this.verbose) console.log(this.name, "- start loop");
    const loopFunc = async () => {
      if (this.verbose) console.log(this.name, "- loop iteration");
      if (this.func[Symbol.toStringTag] === "AsyncFunction") {
        await this.func();
      } else {
        this.func();
      }
      this.setNextIteration();
    };
    if (this.immediate) await loopFunc();
    this.setNextIteration();
    if (this.pauseableType == "interval") {
      this.loop = setInterval(loopFunc, this.interval);
    } else if (this.pauseableType == "timeout") {
      this.loop = setTimeout(loopFunc, this.interval);
    } else {
      throw Error('pauseableType must be "interval" or "timeout"');
    }
  }

  pause() {
    if (!this.paused) {
      clearInterval(this.loop);
      this.loop = undefined;
      const now = new Date();
      this.resumeWaitTime = this.nextIteration - now;
      this.paused = true;
      if (this.verbose)
        console.log(this.name, "- pause,", this.resumeWaitTime, "ms remaining");
    } else if (this.resumeRequestStart) {
      clearInterval(this.resumeRequest);
      this.resumeRequest = undefined;
      this.resumeRequestStart = undefined;
      const elapsedSinceResumeRequest = new Date() - this.resumeRequestStart;
      this.resumeWaitTime -= elapsedSinceResumeRequest;
      if (this.verbose)
        console.log(
          this.name,
          "- paused again,",
          this.resumeWaitTime,
          "ms remaining now"
        );
    }
  }

  resume() {
    if (this.paused) {
      if (this.verbose)
        console.log(this.name, "- queue resume in", this.resumeWaitTime, "ms");
      this.resumeRequestStart = new Date();
      this.resumeRequest = setTimeout(() => {
        if (this.verbose) console.log(this.name, "- resuming now");
        this.resumeRequest = undefined;
        this.resumeRequestStart = undefined;
        this.startInterval();
        this.paused = false;
      }, this.resumeWaitTime);
    }
  }

  stop() {
    clearInterval(this.loop);
    if (this.verbose) console.log(this.name, "- stop loop");
  }

  changeInterval(interval) {
    if (this.verbose) console.log(this.name, "- change interval");
    this.pause();
    this.stop();
    const timeElapsed = this.interval - this.resumeWaitTime;
    if (this.verbose)
      console.log(
        this.name,
        "- been",
        timeElapsed,
        "unpaused ms since last iteration"
      );
    this.resumeWaitTime = Math.max(0, interval - timeElapsed);
    this.interval = interval;
    this.resume();
  }
}

function ensureTypeInArgs(args, type) {
  if (!args.length) throw Error("make sure to pass arguments");
  if (typeof args[args.length - 1] === "object") {
    args[args.length - 1].pauseableType = type;
  } else {
    args.push({
      pauseableType: type,
    });
  }
}

exports.IntervalPlus = class IntervalPlus extends Pauseable {
  constructor(...args) {
    ensureTypeInArgs(args, "interval");
    super(...args);
  }
};

exports.TimeoutPlus = class TimeoutPlus extends Pauseable {
  constructor(...args) {
    ensureTypeInArgs(args, "timeout");
    super(...args);
  }
};
