export function createArray(size, pattern) {
  const values = Array.from({ length: size }, (_, index) => index + 1);

  if (pattern === "reversed") return values.reverse();

  if (pattern === "nearly-sorted") {
    for (let index = 0; index < size - 1; index += 5) {
      [values[index], values[index + 1]] = [values[index + 1], values[index]];
    }
    return values;
  }

  for (let index = size - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [values[index], values[other]] = [values[other], values[index]];
  }
  return values;
}
