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
        this.visual = {message: "Ready", active: [], reference: [], range: null, complete: []};
    }

    cancel() {
        this.cancelled = true;
        for (const waiter of [...this.pendingWaits]) waiter.finish(false);
    }

    wait(ms) {
        if (this.cancelled) return Promise.resolve(false);
        return new Promise(resolve => {
            const waiter = {
                ready: false,
                timer: null,
                finish: active => {
                    if (!this.pendingWaits.has(waiter)) return;
                    clearTimeout(waiter.timer);
                    this.pendingWaits.delete(waiter);
                    resolve(active);
                }
            };
            this.pendingWaits.add(waiter);
            waiter.timer = setTimeout(() => {
                waiter.ready = true;
                if (!this.paused) waiter.finish(!this.cancelled);
            }, ms);
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

    showStep(message, {active = [], reference = [], range = null, complete = []} = {}) {
        this.visual = {message, active, reference, range, complete};
        this.draw();
    }

    draw() {
        if (this.cancelled) return;
        const canvas = document.querySelector(`#${this.type}-canvas`);
        const ctx = canvas.getContext('2d');
        const width = canvas.width / this.arr.length;
        const height = canvas.height / this.arr.length;

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for(let i = 0; i < this.arr.length; i++) {
            if (this.visual.complete.includes(i)) ctx.fillStyle = "#72d6a1";
            else if (this.visual.active.includes(i)) ctx.fillStyle = "#ff6673";
            else if (this.visual.reference.includes(i)) ctx.fillStyle = "#ffd166";
            else if (this.visual.range && i >= this.visual.range[0] && i <= this.visual.range[1]) ctx.fillStyle = "#83bfff";
            else ctx.fillStyle = "white";
            ctx.fillRect(i * width, canvas.height - this.arr[i] * height, width, this.arr[i] * height);
        }

        const status = document.querySelector(`#${this.type}-status`) ?? document.querySelector("#single-status");
        if (status) status.textContent = this.visual.message;
    }

    setTimeText() {
        if (this.cancelled) return;
        const pausedTime = this.pausedDuration + (this.paused ? this.end_time - this.pauseStartedAt : 0);
        let time = Math.max(0, this.end_time - this.start_time - pausedTime) / 1000;
        let time_text = document.querySelector(`#${this.type}-time`) ?? document.querySelector("#single-time");
        if (time_text) time_text.innerText = `${time} s`;
        this.visual = {
            message: "Sorted",
            active: [],
            reference: [],
            range: null,
            complete: Array.from({length: this.arr.length}, (_, index) => index)
        };
        this.finished = true;
        if (this.onComplete) this.onComplete();
    }
}
