/* eslint-disable no-extend-native,guard-for-in,no-param-reassign */
import classnames from 'classnames';
import qs from 'qs';
import request, { nextAPI } from './request';
import * as reflect from './reflect';

// 连字符转驼峰
String.prototype.hyphenToHump = function N() {
  return this.replace(/-(\w)/g, (...args) => args[1].toUpperCase());
};

// 驼峰转连字符
String.prototype.humpToHyphen = function N() {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase();
};

// 日期格式化
Date.prototype.format = function N(format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length));
    }
  }
  return format;
};

// 保留小数位
const getTwoDecimal = (text, num) => {
  const decimal = Math.pow(10, num);
  return Math.floor(text * decimal) / decimal;
};


// ----------------------------------------
// Sort method
// ----------------------------------------

const createSortFunc = (type, by) => {
  if (!by) {
    console.error('createSortFunc must provide \'by\' as string or func');
    return null;
  }
  const sort_funcs = {
    // 按照字母顺序排序。
    alphabetical: (a, b) => {
      if (!a) {
        return -1;
      }
      if (!b) {
        return 1;
      }
      const aa = typeof by === 'string' ? a[by] : by(a);
      const bb = typeof by === 'string' ? b[by] : by(b);
      return aa.localeCompare(bb);
    },
    order: (a, b) => {
      const aOrder = a.order || 0;
      const bOrder = b.order || 0;
      return aOrder - bOrder;
    },
  };
  const sortfunc = sort_funcs[type];
  if (!sortfunc) {
    console.error(`createSortFunc: 'sort:${type}' is invalid`);
    return null;
  }
  return sortfunc;
};


const isObjectEmpty = obj => {
  for (const i in obj) {
    return true;
  }
  return false; // 如果为空,返回false
};

const isMobile = () => {
  const p = navigator.platform;
  const arr = ['MacIntel', 'Win32', 'Win64', 'Linux i686', 'Linux x86_64', 'X11', 'MacPPC'];
  return !arr.includes(p);
};

// ----------------------------------------
// Exports
// ----------------------------------------

export {
  // 3rd party tools.
  classnames, qs,

  // library
  reflect,

  // API & request
  request, nextAPI,

  // Tools
  getTwoDecimal,

  createSortFunc,

  isObjectEmpty,

  // systems
  isMobile,

};
