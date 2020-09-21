/* eslint-disable no-empty */
/* eslint-disable react/no-this-in-sfc */

// Author: GaoBo, 2018-10-10
// -----------------------------------------
// LocalStorage Checker
// -----------------------------------------
import { sysconfig } from 'systems';
import { isEqual } from 'lodash';
import consts from 'consts';

const parseValue = rawValue => {
  try {
    const lsValue = JSON.parse(rawValue);
    if (lsValue && Object.prototype.hasOwnProperty.call(lsValue, 'value')) { // is valid?
      return lsValue;
    }
  } catch (err) {
    console.error(err);
  }
  return null;
}

const setValue = (key, value) => {
  if (!consts.IsServerRender()) {
    localStorage.setItem(key, JSON.stringify({
      time: new Date().getTime(),
      value
    }));
  }
  return null;
}


// Use localStorage to cache values.
// Note: 禁止异步访问
// params:
//   key - message key
//   initValue -  default value
//   checker - customerized checker function;
//   loader - load function that load data async. will override initValue.
//   expired - expired time.
//   alwaysLoad - 是否在获取到数据之后也要延时读取数据。
//
// value:
//   {value: xxx, expires: xxxx}
//
// TODO 怎么有两个版本的cache？
const localCache = ({ key, initValue, checker, loader, done, alwaysLoad, expires }) => {
  // some check
  if (initValue && loader) {
    throw new Error('localCache: Can not set initValue and loader both!');
  }

  let lsValue;
  let isValueValid
  const tokenKey = `lc_${sysconfig.SYSTEM}_${key}`;
  if (!consts.IsServerRender()) {
    try {
      lsValue = parseValue(localStorage.getItem(tokenKey)) // v && v.value
      const checkFunc = checker || (v => !!v);
      isValueValid = checkFunc(lsValue);
    } catch (error) {
    }
  }

  // 过期判断
  let expired = false;
  if (lsValue && lsValue.time) {
    const exp = expires || 1000 * 60 * 60 * 24 * 1; // 1天
    if (new Date().getTime() - lsValue.time > exp) {
      expired = true;
    }
  }

  const needCallLoader = !isValueValid || alwaysLoad || expired;

  if (!needCallLoader && done) { // 如果localStorage中取得的值合法，那么立刻返回值；
    done(lsValue.value);
  }

  if (needCallLoader) {
    if (loader) {
      loader(newValue => {
        // 判断新老值是否相等，如果不等再更新！
        console.log('compare values', lsValue && lsValue.value, newValue);
        if (!isEqual(lsValue && lsValue.value, newValue) || expired) {
          setValue(tokenKey, newValue); // set to localstorage;
          if (done) { // call done again to refresh new value.
            done(newValue);
          }
        }
      });
    }
  }
};


// 使用在effect中的cache；参考getMe；
class LocalStorageCache {
  constructor({ key, initValue, checker, alwaysLoad, expires }) {
    Object.assign(this, { key, initValue, checker, alwaysLoad, expires });
    this.tokenKey = `lc_${sysconfig.SYSTEM}_${this.key}`;
    this.checkFunc = checker || (v => !!v);
    this.init();
  }

  init = () => {
    this.loaded = false;
    this.cacheValid = false;
    this.expired = false;
    this.cachedData = null;
  }

  loadCacheValue = () => {
    if (!consts.IsServerRender()) {
      try {
        this.cachedData = parseValue(localStorage.getItem(this.tokenKey)) // v && v.value
        this.cacheValid = this.checkFunc(this.cachedData);
      } catch (error) {
      }
    }
    this.loaded = true;
    if (this.cacheValid && this.cachedData) {
      return this.cachedData.value
    }
    return null;
  }

  isCacheValid = () => {
    if (!this.loaded) {
      throw new Error('must call loadCached first!');
    }
    return this.cacheValid && !!this.cachedData.value;
  }

  shouldLoad = () => {
    // 过期判断
    this.expired = false;
    if (this.cachedData && this.cachedData.time) {
      const exp = this.expires || 1000 * 60 * 60 * 24 * 1; // 1天
      if (new Date().getTime() - this.cachedData.time > exp) {
        this.expired = true;
      }
    }
    return !this.cacheValid || this.alwaysLoad || this.expired;
  }

  shouldUpdate = newValue =>
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>",this.expired, isEqual(this.cachedData && this.cachedData.value, newValue), this.cachedData, newValue)
    this.expired || !isEqual(this.cachedData && this.cachedData.value, newValue)


  updateCache = newValue => {
    setValue(this.tokenKey, newValue); // set to localstorage;
  }
}

export {
  localCache, LocalStorageCache,
}
