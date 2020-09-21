import { isBrowser } from 'acore';

export function removeLSItemIfExist(...keys) {

  if (isBrowser() && window && window.localStorage && keys) {
    const ls = window.localStorage;
    if (typeof keys === 'string') { // string
      if (ls.getItem(keys)) {
        ls.removeItem(keys);
      }
    } else { // array
      for (let i = 1; i < keys.length; i += 1) {
        if (ls.getItem(keys[i])) {
          ls.removeItem(keys[i]);
        }
      }
    }
  }
}
