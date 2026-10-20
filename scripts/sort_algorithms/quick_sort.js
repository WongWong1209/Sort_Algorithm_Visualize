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
            if (!(await data.wait(sleepTime))) return;
        }
    }

    [data.arr[i + 1], data.arr[high]] = [data.arr[high], data.arr[i + 1]];
    data.cur = i + 1;
    data.draw();
    if (!(await data.wait(sleepTime))) return;
    return i + 1;
}

async function quick_sort(data, low, high, sleepTime) {
    if (data.cancelled) return;
    const isRoot = low === 0 && high === data.arr.length - 1;
    if (isRoot && data.start_time === undefined) data.start_time = new Date().getTime();
    if (low < high) {
        let pivot = await partition(data, low, high, sleepTime);
        if (data.cancelled) return;
        await quick_sort(data, low, pivot - 1, sleepTime);
        if (data.cancelled) return;
        await quick_sort(data, pivot + 1, high, sleepTime);
        if (data.cancelled) return;
    }
    if (isRoot) {
        data.cur = -1;
        data.end_time = new Date().getTime();
        data.setTimeText();
        data.draw();
    }
}
