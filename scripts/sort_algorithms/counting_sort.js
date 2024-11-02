export {counting_sort};

async function counting_sort(data, sleepTime) {
    data.start_time = new Date().getTime();
    let max = Math.max(...data.arr);
    let min = Math.min(...data.arr);
    let range = max - min + 1;
    let count = new Array(range).fill(0);
    let output = new Array(data.arr.length);

    for (let i = 0; i < data.arr.length; i++) {
        count[data.arr[i] - min]++;
    }

    for (let i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
    }

    for (let i = data.arr.length - 1; i >= 0; i--) {
        output[count[data.arr[i] - min] - 1] = data.arr[i];
        count[data.arr[i] - min]--;
    }

    for (let i = 0; i < data.arr.length; i++) {
        data.arr[i] = output[i];
        data.cur = i;
        data.draw();
        await sleep(sleepTime);
    }

    data.cur = -1;
    data.end_time = new Date().getTime();
    data.setTimeText();
    data.draw();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}