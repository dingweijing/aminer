import { sysconfig } from 'systems';
import consts from 'consts';
import { enUS, zhCN } from 'locales';
import { listTristate, renderEach } from './render-helper';
// import downloadJson from './downloadJson';
import {
  syncUrlParamToState, syncMatchesToState, syncMatchesToStateFull, mergeChanges,
  paramType, parseUrlParamWithSearch,
  routeTo, routeToReplace, getRouteToUrl,
  parseUrlParam, parseMatchesParam, isBuildInToken
} from './react-lifecircle';

const debug = require('debug')('aminer:engine:helper');

// TODO @deprecated see pages/topic/trend/index.js for example.
// const getSearchParams = props => {
//   if (!props) {
//     debug('helper: props is not available.');
//   }
//   const { location } = props;
//   return location.query;
// };

// TODO @deprecated see pages/topic/trend/index.js for example.
// const getMatchParams = props => {
//   if (!props) {
//     debug('helper: props is not available.');
//   }
//   const { match } = props;
//   if (!match) {
//     debug('helper: match is not available.');
//   }
//   return match.params; // not check error.
// };


// TODO move to other place. en is default
// return name and subName
const renderLocalNames = (defaultName, localName, config) => {
  const locale = (config && config.locale) || sysconfig.Locale;
  const isDefaultLocale = locale === enUS;
  if (!isDefaultLocale) {
    // eslint-disable-next-line no-param-reassign
    [localName, defaultName] = [defaultName, localName];
  }
  const mainName = defaultName || localName;
  const subName = (defaultName && localName && defaultName !== localName) && localName;
  return { mainName, subName, isDefaultLocale };
};

const renderFirstLocalNames = (defaultName, localName, config) => {
  const { mainName, subName, isDefaultLocale } = renderLocalNames(defaultName, localName, config);
  return mainName || subName;
};

// -----------------------------------------
// LocalStorage Checker
// TODO move to helper/cache
// TODO 在SSR项目中，意义不大.
// -----------------------------------------

// // Use localStorage to cache values.
// // Note: 禁止异步访问
// // TODO 怎么有两个版本的cache？
// const localCache = ({ key, initValue, checker, loader }) => {
//   const IS_SSR_RENDER = (window && window.SSR_RENDER) || false;
//   if (IS_SSR_RENDER) {
//     return initValue;
//   }

//   const tokenKey = `lc_${sysconfig.SYSTEM}_${key}`;
//   let lsValue;
//   try {
//     const rawValue = localStorage.getItem(tokenKey);
//     lsValue = JSON.parse(rawValue);
//   } catch (err) {
//     console.error(err);
//   }
//   const checkFunc = checker || function ck(v) {
//     if (v) {
//       return true;
//     }
//     return false;
//   };
//   if (checkFunc(lsValue)) { // pass check
//     return lsValue;
//   }
//   return initValue;
// };

const setLocalCache = (key, value) => {
  if (!consts.IsServerRender()) {
    localStorage.setItem(`lc_${sysconfig.SYSTEM}_${key}`, JSON.stringify(value));
  }
};

const clearLocalCache = key => {
  localStorage.removeItem(`lc_${sysconfig.SYSTEM}_${key}`);
};

const getLangLabel = (en_label, zh_label) => {
  let en = en_label
  let zh = zh_label
  const isZh = sysconfig.Locale === zhCN;
  if (isZh) {
    [en, zh] = [zh, en]
  }
  return en || zh || ''
}

// 在url中添加埋点
const addBuriedPoint = (href, point) =>{
  const index = href.search(/#/);
  if (index !== -1) {
    let newHref = href.split('');
    newHref.splice(index, 0, href.search(/\?/) !== -1 ? `&${point}` : `?${point}`);
    return newHref.join('');
  }
  return href.search(/\?/) !== -1 ? `${href}&${point}` : `${href}?${point}`;
}

const toRGB = color => {
  const t = {};
  const bits = color.length === 4 ? 4 : 8;
  const mask = (1 << bits) - 1;
  let _color = Number(`0x${color.substr(1)}`);
  if (isNaN(_color)) {
    return null;
  }
  ['b', 'g', 'r'].forEach(x => {
    const c = _color & mask;
    _color >>= bits;
    t[x] = bits === 4 ? 17 * c : c;
  });
  return t; // Color
};

const toRGBA = (hex, alpha = 1) => {
  const rgb = toRGB(hex);
  return rgb
    ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
    : hex;
}

// -----------------------------------------
// Exports
// -----------------------------------------

export default {
  listTristate, // replace with ListTristate Component.

  syncUrlParamToState,
  syncMatchesToState,
  syncMatchesToStateFull,
  paramType,
  routeTo,
  routeToReplace,
  getRouteToUrl,
  mergeChanges,

  // localCache, // TODO delete
  setLocalCache,
  clearLocalCache,

  // getSearchParams,// @deprecated
  // getMatchParams, // @deprecated

  // getUserRole,
  renderLocalNames,
  renderFirstLocalNames,
  renderEach,

  parseUrlParam,
  parseMatchesParam,
  parseUrlParamWithSearch,
  isBuildInToken,
  getLangLabel,
  addBuriedPoint,
  // downloadJson,
  toRGB,
  toRGBA
};

// TODO remove this kind of export.
export {
  listTristate, // replace with ListTristate Component.

  syncUrlParamToState,
  syncMatchesToState,
  syncMatchesToStateFull,
  paramType, routeTo, routeToReplace,

  parseUrlParam,
  parseMatchesParam,
  parseUrlParamWithSearch,
  isBuildInToken,
  getLangLabel,
  addBuriedPoint,

  // getSearchParams, // @deprecated

  // downloadJson,
  toRGB,
  toRGBA
};
