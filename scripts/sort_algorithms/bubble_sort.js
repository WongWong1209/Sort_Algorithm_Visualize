export {bubble_sort};

async function bubble_sort(data, sleepTime) {
    let count = 0;
    for(let i = 0; i < 99; i++) {
        for(let j = 0; j < 99 - i; j++) {
            if(data.arr[j] > data.arr[j + 1]) {
                data.cur = j + 1;
                let temp = data.arr[j];
                data.arr[j] = data.arr[j + 1];
                data.arr[j + 1] = temp;
                data.draw();
                count++;
                await sleep(sleepTime);
            }
        }
    }

    data.cur = -1;
    data.draw();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}