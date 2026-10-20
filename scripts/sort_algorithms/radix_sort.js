export { radix_sort };

async function countingSortForRadix(data, exp, sleepTime) {
  let output = new Array(data.arr.length).fill(0);
  let count = new Array(10).fill(0);
  const place = exp === 1 ? "ones" : exp === 10 ? "tens" : "hundreds";

  for (let i = 0; i < data.arr.length; i++) {
    let digit = Math.floor(data.arr[i] / exp) % 10;
    count[digit]++;
    const sameDigit = data.arr
      .slice(0, i)
      .flatMap((value, index) =>
        Math.floor(value / exp) % 10 === digit ? [index] : [],
      );
    data.showStep(
      `${place} digit of ${data.arr[i]} is ${digit} · bucket ${digit}: ${count[digit]}`,
      {
        active: [i],
        reference: sameDigit,
      },
    );
    if (!(await data.wait(sleepTime))) return;
  }

  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  for (let i = data.arr.length - 1; i >= 0; i--) {
    let digit = Math.floor(data.arr[i] / exp) % 10;
    output[count[digit] - 1] = data.arr[i];
    count[digit]--;
  }

  for (let i = 0; i < data.arr.length; i++) {
    data.arr[i] = output[i];
    data.recordWrite();
    data.showStep(`${place} pass · write ${output[i]} at position ${i + 1}`, {
      active: [i],
    });
    if (!(await data.wait(sleepTime))) return;
  }
}

async function radix_sort(data, sleepTime) {
  data.start_time = new Date().getTime();
  let max = Math.max(...data.arr);

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    await countingSortForRadix(data, exp, sleepTime);
    if (data.cancelled) return;
  }

  data.cur = -1;
  data.end_time = new Date().getTime();
  data.setTimeText();
  data.draw();
}
