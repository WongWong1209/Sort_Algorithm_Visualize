export {cocktail_sort};

async function cocktail_sort(data, sleepTime) {
    data.start_time = new Date().getTime();
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
                if (!(await data.wait(sleepTime))) return;
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
                if (!(await data.wait(sleepTime))) return;
            }
        }
        
        start++;
    }
    
    data.cur = -1;
    data.end_time = new Date().getTime();
    data.setTimeText();
    data.draw();
}
