export {quick_sort};

async function partition(data, low, high, sleepTime) {
    let pivot = data.arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (data.arr[j] < pivot) {
            i++;
            [data.arr[i], data.arr[j]] = [data.arr[j], data.arr[i]];
            data.cur = i;
            data.draw();
            await sleep(sleepTime);
        }
    }

    [data.arr[i + 1], data.arr[high]] = [data.arr[high], data.arr[i + 1]];
    data.cur = i + 1;
    data.draw();
    await sleep(sleepTime);
    return i + 1;
}

async function quick_sort(data, low, high, sleepTime) {
    if (low < high) {
        let pivot = await partition(data, low, high, sleepTime);
        await quick_sort(data, low, pivot - 1, sleepTime);
        await quick_sort(data, pivot + 1, high, sleepTime);
    }
    data.cur = -1;
    data.end_time = new Date().getTime();
    data.setTimeText();
    data.draw();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}