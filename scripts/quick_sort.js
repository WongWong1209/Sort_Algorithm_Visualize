async function partition(low, high) {
    let pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            cur = i;
            draw();
            await sleep(sleepTime);
        }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    cur = i + 1;
    draw();
    await sleep(sleepTime);
    return i + 1;
}

async function quick_sort(low, high) {
    if (low < high) {
        let pivot = await partition(low, high);
        await quick_sort(low, pivot - 1);
        await quick_sort(pivot + 1, high);
    }
    cur = -1;
    draw();
}