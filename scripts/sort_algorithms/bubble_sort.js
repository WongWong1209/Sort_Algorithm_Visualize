export {bubble_sort};

async function bubble_sort(data, sleepTime) {
    data.start_time = new Date().getTime();
    let count = 0;
    for(let i = 0; i < data.arr.length - 1; i++) {
        for(let j = 0; j < data.arr.length - 1 - i; j++) {
            if(data.arr[j] > data.arr[j + 1]) {
                data.cur = j + 1;
                let temp = data.arr[j];
                data.arr[j] = data.arr[j + 1];
                data.arr[j + 1] = temp;
                data.draw();
                count++;
                if (!(await data.wait(sleepTime))) return;
            }
        }
    }

    data.cur = -1;
    data.end_time = new Date().getTime();
    data.setTimeText();
    data.draw();
}
