async function cocktail_sort() {
    let start = 0;
    let end = arr.length - 1;
    let swapped = true;
    
    while (swapped) {
        swapped = false;
        
        // Forward pass (left to right)
        for (let i = start; i < end; i++) {
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
                cur = i + 1;
                draw();
                await sleep(sleepTime);
            }
        }
        
        if (!swapped) break;
        
        swapped = false;
        end--;
        
        // Backward pass (right to left)
        for (let i = end - 1; i >= start; i--) {
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
                cur = i;
                draw();
                await sleep(sleepTime);
            }
        }
        
        start++;
    }
    
    cur = -1;
    draw();
}