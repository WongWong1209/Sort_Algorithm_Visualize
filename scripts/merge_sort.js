async function merge(start, mid, end) {
    let left = arr.slice(start, mid + 1);
    let right = arr.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            arr[k] = left[i];
            i++;
        } else {
            arr[k] = right[j];
            j++;
        }
        cur = k;
        draw();
        await sleep(sleepTime);
        k++;
    }
    
    while (i < left.length) {
        arr[k] = left[i];
        cur = k;
        draw();
        await sleep(sleepTime);
        i++;
        k++;
    }
    
    while (j < right.length) {
        arr[k] = right[j];
        cur = k;
        draw();
        await sleep(sleepTime);
        j++;
        k++;
    }
}

async function mergeSortHelper(start, end) {
    if (start >= end) return;
    
    const mid = Math.floor((start + end) / 2);
    await mergeSortHelper(start, mid);
    await mergeSortHelper(mid + 1, end);
    await merge(start, mid, end);
}

async function merge_sort() {
    await mergeSortHelper(0, arr.length - 1);
    cur = -1;
    draw();
}