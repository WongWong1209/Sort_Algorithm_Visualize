export {radix_sort};

async function countingSortForRadix(data, exp, sleepTime) {
    let output = new Array(data.arr.length).fill(0);
    let count = new Array(10).fill(0);

    for (let i = 0; i < data.arr.length; i++) {
        let digit = Math.floor(data.arr[i] / exp) % 10;
        count[digit]++;
    }

    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    for (let i = data.arr.length - 1; i >= 0; i--) {
        let digit = Math.floor(data.arr[i] / exp) % 10;
        output[count[digit] - 1] = data.arr[i];
        count[digit]--;
    }

    for (let i = 0; i < data.arr.length; i++) {
        data.arr[i] = output[i];
        data.cur = i;
        data.draw();
        await sleep(sleepTime);
    }
}

async function radix_sort(data, sleepTime) {
    let max = Math.max(...data.arr);

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        await countingSortForRadix(data, exp, sleepTime);
    }

    data.cur = -1;
    data.draw();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}