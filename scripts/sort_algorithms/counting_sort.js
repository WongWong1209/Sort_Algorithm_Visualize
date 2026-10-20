export { counting_sort };

async function counting_sort(data, sleepTime) {
  data.start_time = new Date().getTime();
  let max = Math.max(...data.arr);
  let min = Math.min(...data.arr);
  let range = max - min + 1;
  let count = new Array(range).fill(0);
  let output = new Array(data.arr.length);

  for (let i = 0; i < data.arr.length; i++) {
    const value = data.arr[i];
    count[value - min]++;
    data.showStep(`Count ${value} · seen ${count[value - min]}`, {
      active: [i],
    });
    if (!(await data.wait(sleepTime))) return;
  }

  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
    const threshold = min + i;
    const within = data.arr.flatMap((value, index) =>
      value <= threshold ? [index] : [],
    );
    data.showStep(`Prefix count ≤ ${threshold}: ${count[i]}`, {
      reference: within,
    });
    if (!(await data.wait(sleepTime))) return;
  }

  for (let i = data.arr.length - 1; i >= 0; i--) {
    output[count[data.arr[i] - min] - 1] = data.arr[i];
    count[data.arr[i] - min]--;
  }

  for (let i = 0; i < data.arr.length; i++) {
    data.arr[i] = output[i];
    data.recordWrite();
    data.showStep(`Write ${output[i]} at position ${i + 1}`, {
      active: [i],
      complete: Array.from({ length: i }, (_, index) => index),
    });
    if (!(await data.wait(sleepTime))) return;
  }

  data.cur = -1;
  data.end_time = new Date().getTime();
  data.setTimeText();
  data.draw();
}
