export function mapBy<T, K = string>(array: T[], keyExtractor: (t: T) => K) {
  return array.reduce((pre, cur) => {
    pre.set(keyExtractor(cur), cur);
    return pre;
  }, new Map<K, T>());
}

export function groupBy<T, K = string>(array: T[], keyExtractor: (t: T) => K) {
  const result = new Map<K, T[]>();
  for (const item of array) {
    const key = keyExtractor(item);
    if (!result.has(key)) {
      result.set(key, [item]);
    } else {
      result.get(key)!.push(item);
    }
  }
  return result;
}

export function countBy<T, K = string>(array: T[], keyExtractor: (t: T) => K) {
  const result = new Map<K, number>();
  for (const item of array) {
    const key = keyExtractor(item);
    if (!result.has(key)) {
      result.set(key, 1);
    } else {
      result.set(key, result.get(key)! + 1);
    }
  }
  return result;
}

export function flatten<T>(array: T[][]) {
  const result = [];
  for (const subArray of array) {
    result.push(...subArray);
  }
  return result;
}

export function sortByNumber<T>(array: T[], byFunc: (t: T) => number, desc = false) {
  return array.sort((a, b) => (desc ? -1 : 1) * (byFunc(a) - byFunc(b)));
}

export function mapCompute<K, V>(map: Map<K, V>, key: K, func: (k: K, v?: V) => V) {
  const value = func(key, map.get(key));
  map.set(key, value);
  return value;
}

export function newTensor(...dimentions: number[]): Array<any> {
  const [layer, ...d] = dimentions;
  return d.length ? Array(layer).fill(0).map(_ => newTensor(...d)) : Array(layer);
}

export function transpose<T>(array: T[][]) {
  const result: T[][] = newTensor(array[0].length, array.length);
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      result[j][i] = array[i][j];
    }
  }
  return result;
}
