async function counting_sort() {
    let max = Math.max(...arr);
    let min = Math.min(...arr);
    let range = max - min + 1;
    let count = new Array(range).fill(0);
    let output = new Array(arr.length);

    for (let i = 0; i < arr.length; i++) {
        count[arr[i] - min]++;
    }

    for (let i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
    }

    for (let i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
    }

    for (let i = 0; i < arr.length; i++) {
        arr[i] = output[i];
        cur = i;
        draw();
        await sleep(sleepTime);
    }

    cur = -1;
    draw();
}