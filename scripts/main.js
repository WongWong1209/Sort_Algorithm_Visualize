const canvas = document.getElementById('panel');
const ctx = canvas.getContext('2d');
const unit = 8;

let sleepTime = 5;
let arr = [];
let cur = -1;

resetArr();
draw();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function resetArr() {
    for(let i = 0; i <= 99; i++) arr[i] = 0;
    for(let i = 1; i <= 100; i++) {
        do {
            let index = Math.floor(Math.random() * 100);
            if(!arr[index]) {
                arr[index] = i;
                break;
            }
        } while(true);
    }
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let i = 0; i < 100; i++) {
        if(i == cur) ctx.fillStyle = "red";
        else ctx.fillStyle = "white";
        ctx.fillRect(i * unit, (100 - arr[i]) * unit, unit, arr[i] * unit);
    }
}