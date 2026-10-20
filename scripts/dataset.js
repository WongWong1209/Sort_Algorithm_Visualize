class Dataset {
  constructor(type) {
    this.type = type;
    this.arr = [];
    this.cur = -1;
    this.start_time;
    this.end_time;
    this.cancelled = false;
    this.paused = false;
    this.finished = false;
    this.pauseStartedAt = null;
    this.pausedDuration = 0;
    this.pendingWaits = new Set();
    this.visual = {
      message: "Ready",
      active: [],
      reference: [],
      range: null,
      complete: [],
    };
    this.stats = { comparisons: 0, writes: 0 };
  }

  cancel() {
    this.cancelled = true;
    for (const waiter of [...this.pendingWaits]) waiter.finish(false);
  }

  wait(ms) {
    if (this.cancelled) return Promise.resolve(false);
    return new Promise((resolve) => {
      const waiter = {
        ready: false,
        timer: null,
        finish: (active) => {
          if (!this.pendingWaits.has(waiter)) return;
          clearTimeout(waiter.timer);
          this.pendingWaits.delete(waiter);
          resolve(active);
        },
      };
      this.pendingWaits.add(waiter);
      const delay = typeof ms === "function" ? ms() : ms;
      waiter.timer = setTimeout(() => {
        waiter.ready = true;
        if (!this.paused) waiter.finish(!this.cancelled);
      }, delay);
    });
  }

  pause() {
    if (this.cancelled || this.finished || this.paused) return;
    this.paused = true;
    this.pauseStartedAt = Date.now();
  }

  resume() {
    if (this.cancelled || this.finished || !this.paused) return;
    this.pausedDuration += Date.now() - this.pauseStartedAt;
    this.pauseStartedAt = null;
    this.paused = false;
    for (const waiter of [...this.pendingWaits]) {
      if (waiter.ready) waiter.finish(true);
    }
  }

  step() {
    if (this.cancelled || this.finished) return;
    this.pause();
    const waiter = this.pendingWaits.values().next().value;
    if (waiter) waiter.finish(true);
  }

  showStep(
    message,
    { active = [], reference = [], range = null, complete = [] } = {},
  ) {
    this.visual = { message, active, reference, range, complete };
    this.draw();
  }

  recordComparison(count = 1) {
    this.stats.comparisons += count;
  }

  recordWrite(count = 1) {
    this.stats.writes += count;
  }

  draw() {
    if (this.cancelled) return;
    const canvas = document.querySelector(`#${this.type}-canvas`);
    const ctx = canvas.getContext("2d");
    const width = canvas.width / this.arr.length;
    const height = canvas.height / this.arr.length;

    ctx.fillStyle = "#111310";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#30352e";
    for (let tick = 1; tick < 4; tick++) {
      ctx.fillRect(0, Math.round((canvas.height * tick) / 4), canvas.width, 1);
    }

    for (let i = 0; i < this.arr.length; i++) {
      if (this.visual.complete.includes(i)) ctx.fillStyle = "#9db89a";
      else if (this.visual.active.includes(i)) ctx.fillStyle = "#76cfdd";
      else if (this.visual.reference.includes(i)) ctx.fillStyle = "#e2bc74";
      else if (
        this.visual.range &&
        i >= this.visual.range[0] &&
        i <= this.visual.range[1]
      )
        ctx.fillStyle = "#83979d";
      else ctx.fillStyle = "#e7e9e1";
      const gap = this.arr.length <= 20 ? 2 : this.arr.length <= 50 ? 1 : 0;
      ctx.fillRect(
        i * width,
        canvas.height - this.arr[i] * height,
        Math.max(1, width - gap),
        this.arr[i] * height,
      );
    }

    const status =
      document.querySelector(`#${this.type}-status`) ??
      document.querySelector("#single-status");
    if (status) status.textContent = this.visual.message;
    const comparisons =
      document.querySelector(`#${this.type}-comparisons`) ??
      document.querySelector("#single-comparisons");
    const writes =
      document.querySelector(`#${this.type}-writes`) ??
      document.querySelector("#single-writes");
    if (comparisons)
      comparisons.textContent = this.stats.comparisons.toLocaleString();
    if (writes) writes.textContent = this.stats.writes.toLocaleString();
    if (this.onDraw) this.onDraw(this);
  }

  setTimeText() {
    if (this.cancelled) return;
    const pausedTime =
      this.pausedDuration +
      (this.paused ? this.end_time - this.pauseStartedAt : 0);
    let time = Math.max(0, this.end_time - this.start_time - pausedTime) / 1000;
    let time_text =
      document.querySelector(`#${this.type}-time`) ??
      document.querySelector("#single-time");
    if (time_text) time_text.innerText = `${time} s`;
    this.visual = {
      message: "Sorted",
      active: [],
      reference: [],
      range: null,
      complete: Array.from({ length: this.arr.length }, (_, index) => index),
    };
    this.finished = true;
    this.draw();
    if (this.onComplete) this.onComplete();
  }
}
