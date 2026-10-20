export { merge_sort };

async function merge(data, start, mid, end, sleepTime) {
  let left = data.arr.slice(start, mid + 1);
  let right = data.arr.slice(mid + 1, end + 1);
  let i = 0,
    j = 0,
    k = start;
  const showWrite = () =>
    data.showStep(
      `Merge ${start + 1}–${mid + 1} with ${mid + 2}–${end + 1} · write ${data.arr[k]} at ${k + 1}`,
      { active: [k], reference: [mid], range: [start, end] },
    );

  while (i < left.length && j < right.length) {
    data.recordComparison();
    if (left[i] <= right[j]) {
      data.arr[k] = left[i];
      i++;
    } else {
      data.arr[k] = right[j];
      j++;
    }
    data.recordWrite();
    showWrite();
    if (!(await data.wait(sleepTime))) return;
    k++;
  }

  while (i < left.length) {
    data.arr[k] = left[i];
    data.recordWrite();
    showWrite();
    if (!(await data.wait(sleepTime))) return;
    i++;
    k++;
  }

  while (j < right.length) {
    data.arr[k] = right[j];
    data.recordWrite();
    showWrite();
    if (!(await data.wait(sleepTime))) return;
    j++;
    k++;
  }
}

async function mergeSortHelper(data, start, end, sleepTime) {
  if (data.cancelled || start >= end) return;

  const mid = Math.floor((start + end) / 2);
  await mergeSortHelper(data, start, mid, sleepTime);
  if (data.cancelled) return;
  await mergeSortHelper(data, mid + 1, end, sleepTime);
  if (data.cancelled) return;
  await merge(data, start, mid, end, sleepTime);
}

async function merge_sort(data, sleepTime) {
  data.start_time = new Date().getTime();
  await mergeSortHelper(data, 0, data.arr.length - 1, sleepTime);
  if (data.cancelled) return;
  data.cur = -1;
  data.end_time = new Date().getTime();
  data.setTimeText();
  data.draw();
}
