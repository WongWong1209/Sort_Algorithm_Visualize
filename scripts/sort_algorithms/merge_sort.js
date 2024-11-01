export {merge_sort};

async function merge(data, start, mid, end, sleepTime) {
    let left = data.arr.slice(start, mid + 1);
    let right = data.arr.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            data.arr[k] = left[i];
            i++;
        } else {
            data.arr[k] = right[j];
            j++;
        }
        data.cur = k;
        data.draw();
        await sleep(sleepTime);
        k++;
    }
    
    while (i < left.length) {
        data.arr[k] = left[i];
        data.cur = k;
        data.draw();
        await sleep(sleepTime);
        i++;
        k++;
    }
    
    while (j < right.length) {
        data.arr[k] = right[j];
        data.cur = k;
        data.draw();
        await sleep(sleepTime);
        j++;
        k++;
    }
}

async function mergeSortHelper(data, start, end, sleepTime) {
    if (start >= end) return;
    
    const mid = Math.floor((start + end) / 2);
    await mergeSortHelper(data, start, mid);
    await mergeSortHelper(data, mid + 1, end);
    await merge(data, start, mid, end, sleepTime);
}

async function merge_sort(data, sleepTime) {
    await mergeSortHelper(data, 0, data.arr.length - 1, sleepTime);
    data.cur = -1;
    data.draw();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}