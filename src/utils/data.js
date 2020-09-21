/* eslint-disable no-restricted-syntax */
/**
 * Data Tools
 */

/**
 * data is object or list.
 * fieldSelector is list of fields.
 * array data will be automatically expand and pass through.
 * config: {dedup:true, ...}
 * Usages:
 *    const ids = extract(paths, ['nodes', '*', 'id']);
 */
const extract = (data, fieldSelector, config) => {
  if (!data) {
    return null;
  }
  if (!fieldSelector) {
    throw (new Error('util/extract: fieldSelector not valid!'));
  }

  let current = Array.isArray(data) ? data : [data];

  // loop fieldSelector, must be array.
  for (const field of fieldSelector) {
    const newCurrent = [];
    for (const node of current) {
      if (node) {
        if (field === '*') { // 如果是*，扩展一层
          for (const n of node) {
            if (n) {
              newCurrent.push(n);
            }
          }
        } else {
          const newValue = node[field];
          if (newValue) {
            newCurrent.push(newValue);
          }
        }
      }
    }
    current = newCurrent;
  }

  const dedup = (config && config.dedup) || true;
  if (dedup) {
    const result = new Set();
    for (const cu of current) {
      result.add(cu);
    }
    return Array.from(result);
  }
  return current;
};

// extract by fieldSelector, used as key, return a map;
// fieldSelector is string for now. only support one level.
// config: {dupStrategy: error, ignoreLatter, override }
const buildIndexMap = (dataArray, fieldSelector, config) => {
  if (!dataArray) {
    return null;
  }
  if (!fieldSelector) {
    throw (new Error('util/extract: fieldSelector not valid!'));
  }
  if (!Array.isArray(dataArray)) {
    throw (new Error('dataArray must be type of Array'));
  }
  if (dataArray.length === 0) {
    return null;
  }

  const dupStrategy = (config && config.dupStrategy) || 'error';

  const result = {};
  for (const item of dataArray) {
    const key = item[fieldSelector];
    // if already exists.
    if (result[key]) {
      switch (dupStrategy) {
        case 'error':
          throw (new Error('utils/buildIndexMap: found duplicated key.'));
        case 'ignoreLatter':
          // do nothing just ignore latter one.
          break;
        case 'override':
          result[key] = item;
          break;
        default:
          break;
      }
    } else {
      result[key] = item;
    }
  }
  return result;
};


// TODO change to immer version.
const applyIndexMapIntoData = (data, indexMap, fieldSelector, injectedKey, config) => {
  if (!data) {
    return null;
  }
  if (!fieldSelector) {
    throw (new Error('util/extract: fieldSelector not valid!'));
  }
  if (!indexMap) {
    throw (new Error('util/extract: indexMap should not be null!'));
  }

  let current = Array.isArray(data) ? data : [data];

  // loop fieldSelector, must be array.
  for (let i = 0; i < fieldSelector.length; i += 1) {
    const field = fieldSelector[i];

    if (i === fieldSelector.length - 1) {
      // last field, just do it directly.
      for (const node of current) {
        if (node) {
          const key = node[field];
          if (key) {
            const injectedData = indexMap[key];
            node[injectedKey] = injectedData;
            // console.log('found by key: and found data:', node, injectedData);
          }
        }
      }
    } else {
      const newCurrent = [];
      for (const node of current) {
        if (node) {
          if (field === '*') { // 如果是*，扩展一层
            for (const n of node) {
              if (n) {
                newCurrent.push(n);
              }
            }
          } else {
            const newValue = node[field];
            if (newValue) {
              newCurrent.push(newValue);
            }
          }
        }
      }
      current = newCurrent;
    }
  }
  return null;
};

// module.exports = {
export {
  extract, buildIndexMap, applyIndexMapIntoData,
};
