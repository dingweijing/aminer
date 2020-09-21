/* eslint-disable react/no-this-in-sfc */

// Author: GaoBo, 2019-01-06
// Should be widely used.
//
// TODO create a GlobalCache,
//      - can share objects between pages.
//      - but will takeup more spaces.
//      - Note fields of different objects.

class DataCache {
  constructor() {
    this.cache = {};
  }

  get(key) {
    return this.cache[key];
  }

  set(key, data) {
    // WILL OVERRIDE ESISTING CACHE;
    this.cache[key] = data;
  }
}

export { DataCache }
