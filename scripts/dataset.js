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

    draw() {
        if (this.cancelled) return;
        const canvas = document.querySelector(`#${this.type}-canvas`);
        const ctx = canvas.getContext('2d');
        const unit = 8;

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for(let i = 0; i < 100; i++) {
            if(i == this.cur) ctx.fillStyle = "red";
            else if(i + 1 == this.arr[i]) ctx.fillStyle = "lightgreen";
            else ctx.fillStyle = "white";
            ctx.fillRect(i * unit, (100 - this.arr[i]) * unit, unit, this.arr[i] * unit);
        }
    }

    setTimeText() {
        if (this.cancelled) return;
        const pausedTime = this.pausedDuration + (this.paused ? this.end_time - this.pauseStartedAt : 0);
        let time = Math.max(0, this.end_time - this.start_time - pausedTime) / 1000;
        let time_text = document.querySelector(`#${this.type}-time`) ?? document.querySelector("#single-time");
        if (time_text) time_text.innerText = `${time} s`;
        this.finished = true;
        if (this.onComplete) this.onComplete();
    }
}
