async function bubble_sort() {
    let count = 0;
    for(let i = 0; i < 99; i++) {
        for(let j = 0; j < 99 - i; j++) {
            if(arr[j] > arr[j + 1]) {
                cur = j + 1;
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                draw();
                count++;
                await sleep(sleepTime);
            }
        }
    }

    cur = -1;
    draw();
}