export function dimensionalArray<T>(n: number, m: number): Array<Array<T>> {
  let arr = new Array(n);
  for (let i = 0; i < n; i++) {
    arr[i] = new Array(m);
  }
  return arr;
}
