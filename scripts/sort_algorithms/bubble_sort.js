export {bubble_sort};

async function bubble_sort(data, sleepTime) {
    data.start_time = new Date().getTime();
    const complete = [];
    for(let i = 0; i < data.arr.length - 1; i++) {
        for(let j = 0; j < data.arr.length - 1 - i; j++) {
            const left = data.arr[j];
            const right = data.arr[j + 1];
            const swapped = left > right;
            if (swapped) {
                [data.arr[j], data.arr[j + 1]] = [right, left];
            }
            data.showStep(`${left} ${swapped ? ">" : "≤"} ${right} · ${swapped ? "swap" : "keep"}`, {
                active: [j, j + 1], complete
            });
            if (!(await data.wait(sleepTime))) return;
        }
        complete.unshift(data.arr.length - 1 - i);
    }

    data.cur = -1;
    data.end_time = new Date().getTime();
    data.setTimeText();
    data.draw();
}
