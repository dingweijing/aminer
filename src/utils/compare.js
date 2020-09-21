/* eslint-disable no-extend-native */
import { isEqual } from 'lodash';

// ShadowCompare: if any rest changes, return true; else return false;
const anyNE = (props1, props2, ...rest) => {
  if (props1 && props2 && rest && rest.length > 0) {
    for (let i = 0; i < rest.length; i += 1) {
      const key = rest[i];
      const item1 = props1[key];
      const item2 = props2[key];
      if (item1 !== item2) {
        return true;
      }
    }
  }
  return false;
};

// ShadowCompare: if any rest changes, return { hasChanges, changes }
// 必须存在于props中，才会比较
const anyChanges = (prevProps, props, ...rest) => {
  let changed = false;
  const changes = {};
  if (prevProps && props && rest && rest.length > 0) {
    for (let i = 0; i < rest.length; i += 1) {
      const key = rest[i];
      if (Object.prototype.hasOwnProperty.call(props, key)) { // 只管存在于props中的，不管其他的。
        const prevValue = prevProps[key];
        const value = props[key];
        if (!isEqual(prevValue, value)) {
          changed = true;
          changes[key] = value;
        }
      }
    }
  }
  return { changed, changes };
};

// Usages:
//   NE(p1,p2, 'id')
//   NE(p1,p2, ['a','b'])  - return true if p1.a.b !== p2.a.b
const NE = (props1, props2, value) => {
  if (props1 && props2 && value) {
    if (typeof value === 'string') {
      return props1[value] !== props2[value];
    }
    // is string array
    let v1 = props1;
    let v2 = props2;
    for (const v of value) {
      if (v1) {
        v1 = v1[v];
        v2 = v2[v];
        if (v1 !== v2) {
          return true;
        }
      }
    }
    return v1 !== v2;
  }
  return true;
};

const deepNE = (props1, props2, value) => {
  if (props1 && props2 && value) {
    if (typeof value === 'string') {
      return !isEqual(props1[value], props2[value]);
    } // is string array
    let v1 = props1;
    let v2 = props2;
    for (const v of value) {
      if (v1) {
        v1 = v1[v];
        v2 = v2[v];
        if (v1 !== v2) {
          return true;
        }
      }
    }
    return !isEqual(v1, v2);
  }
  return true;
};

// const compareDeep = (props1, props2, ...rest) => {
//   if (props1 && props2 && rest && rest.length > 0) {
//     for (let i = 0; i < rest.length; i += 1) {
//       const key = rest[i];
//       const item1 = props1[key];
//       const item2 = props2[key];
//       if (!isEqual(item1, item2)) {
//         return true;
//       }
//     }
//   }
//   return false;
// };

// used when the whole model is immutable.
// TODO change this to use getIn();
// props & nextProps is js object. values in them are immutable.
const imCompare = (props, nextProps, model, key) => {
  if (!props || !nextProps) {
    return false;
  }
  if (model) {
    const modelA = props[model];
    const modelB = nextProps[model];
    if (modelA && modelB) {
      return modelA.get(key) === modelB.get(key);
    }
  } else {
    // model is null or '', directly compare key.
    return props[key] === nextProps[key];
  }
  return false;
};

export { // TODO prefer use next
  anyNE, NE, deepNE,
  // compare, compareDeep,
  imCompare,
};

export default {
  anyNE,
  NE,
  deepNE,
  anyChanges,
};
