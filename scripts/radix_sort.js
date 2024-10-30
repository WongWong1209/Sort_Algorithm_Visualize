// radix_sort.js
async function countingSortForRadix(exp) {
    let output = new Array(arr.length).fill(0);
    let count = new Array(10).fill(0);

    for (let i = 0; i < arr.length; i++) {
        let digit = Math.floor(arr[i] / exp) % 10;
        count[digit]++;
    }

    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    for (let i = arr.length - 1; i >= 0; i--) {
        let digit = Math.floor(arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
    }

    for (let i = 0; i < arr.length; i++) {
        arr[i] = output[i];
        cur = i;
        draw();
        await sleep(sleepTime);
    }
}

async function radix_sort() {
    let max = Math.max(...arr);

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        await countingSortForRadix(exp);
    }

    cur = -1;
    draw();
}
