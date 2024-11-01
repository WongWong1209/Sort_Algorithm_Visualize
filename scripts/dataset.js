class Dataset {
    constructor(type) {
        this.type = type;
        this.arr = [];
        this.cur = -1;
    }

    draw() {
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
}