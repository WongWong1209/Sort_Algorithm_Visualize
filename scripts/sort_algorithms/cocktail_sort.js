export {cocktail_sort};

async function cocktail_sort(data, sleepTime) {
    let start = 0;
    let end = data.arr.length - 1;
    let swapped = true;
    
    while (swapped) {
        swapped = false;
        
        // Forward pass (left to right)
        for (let i = start; i < end; i++) {
            if (data.arr[i] > data.arr[i + 1]) {
                [data.arr[i], data.arr[i + 1]] = [data.arr[i + 1], data.arr[i]];
                swapped = true;
                data.cur = i + 1;
                data.draw();
                await sleep(sleepTime);
            }
        }
        
        if (!swapped) break;
        
        swapped = false;
        end--;
        
        // Backward pass (right to left)
        for (let i = end - 1; i >= start; i--) {
            if (data.arr[i] > data.arr[i + 1]) {
                [data.arr[i], data.arr[i + 1]] = [data.arr[i + 1], data.arr[i]];
                swapped = true;
                data.cur = i;
                data.draw();
                await sleep(sleepTime);
            }
        }
        
        start++;
    }
    
    data.cur = -1;
    data.draw();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}