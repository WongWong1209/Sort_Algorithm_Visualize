export {cocktail_sort};

async function cocktail_sort(data, sleepTime) {
    data.start_time = new Date().getTime();
    let start = 0;
    let end = data.arr.length - 1;
    let swapped = true;
    
    while (swapped) {
        swapped = false;
        let complete = Array.from({length: data.arr.length}, (_, index) => index)
            .filter(index => index < start || index > end);
        
        // Forward pass (left to right)
        for (let i = start; i < end; i++) {
            const left = data.arr[i];
            const right = data.arr[i + 1];
            if (left > right) {
                [data.arr[i], data.arr[i + 1]] = [data.arr[i + 1], data.arr[i]];
                swapped = true;
            }
            data.showStep(`Right → ${left} ${left > right ? ">" : "≤"} ${right} · ${left > right ? "swap" : "keep"}`, {
                active: [i, i + 1], complete
            });
            if (!(await data.wait(sleepTime))) return;
        }
        
        if (!swapped) break;
        
        swapped = false;
        end--;
        complete = Array.from({length: data.arr.length}, (_, index) => index)
            .filter(index => index < start || index > end);
        
        // Backward pass (right to left)
        for (let i = end - 1; i >= start; i--) {
            const left = data.arr[i];
            const right = data.arr[i + 1];
            if (left > right) {
                [data.arr[i], data.arr[i + 1]] = [data.arr[i + 1], data.arr[i]];
                swapped = true;
            }
            data.showStep(`← Left ${left} ${left > right ? ">" : "≤"} ${right} · ${left > right ? "swap" : "keep"}`, {
                active: [i, i + 1], complete
            });
            if (!(await data.wait(sleepTime))) return;
        }
        
        start++;
    }
    
    data.cur = -1;
    data.end_time = new Date().getTime();
    data.setTimeText();
    data.draw();
}
