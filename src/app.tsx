import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import { system as sys, isBrowser } from 'acore';
import { enUS, zhCN, isLocaleValid, loadSavedLocale } from 'locales';
import { message } from 'antd';
import { parse } from 'qs';
import * as url from 'url';
import { sysconfig } from 'systems';

dayjs.extend(relativeTime);

const localeAlias = {
  cn: zhCN,
  'zh-cn': zhCN,
  'zh-CN': zhCN,
  en: enUS,
  'en-US': enUS,
  'en-us': enUS,
};

const getLocaleFromURL = () => {
  const browser = isBrowser();
  const href = browser ? window.location.href : global.href;
  const { search = '' } = url.parse(href || '/');
  const { lang: searchLocale = '' } = parse(search, { ignoreQueryPrefix: true });
  const queryLocale = localeAlias[searchLocale.toLowerCase()];
  return queryLocale;
}

function confirmLang(lang) {
  if (!lang || !isLocaleValid(lang)) {
    // colorLog(
    //     'Invalid Lang [%s]. (set to default %s)',
    //     'color:red;background-color:rgb(255,251,130)',
    //     lang, sysconfig.Locale,
    // )
    // console.log('Final lang is default: ', sysconfig.Locale);
    return sysconfig.Locale;
  }
  // check pass.
  sysconfig.Locale = lang;
  // console.log('Final lang is: ', lang);
  return lang;
}

// used to judge lang in csr&ssr.
const cssrLocale = () => {
  // * url lang
  const urlLocale = getLocaleFromURL();
  if (urlLocale) {
    return confirmLang(urlLocale)
  }

  // * default lang
  if (!sysconfig.EnableLocalLocale) {
    return sysconfig.Locale
  }

  // * store & detect lang
  // const lang = loadSavedLocale(sys.System, sysconfig.Locale);
  const lang = loadSavedLocale(sys.System, null); // 这里确保了肯定返回对的语言。
  const finalLang = confirmLang(lang)
  return finalLang;
}

export const locale = {
  default: cssrLocale,

  getLocale() {
    // * 每次页面刷新都会被页面和客户端调用巨多次，因此加上了缓存。
    if (global.PageLevelLocateCache === "auto" || !isLocaleValid(global.PageLevelLocateCache)) {
      global.PageLevelLocateCache = cssrLocale()
    }
    return global.PageLevelLocateCache
  }
};


export const dva = {
  config: {
    // onAction: createLogger(),
    onError: e => {
      console.error('dva Error:', e);
      if (process.env.NODE_ENV !== 'production') {
        message.error(e.message, 3);
      }
    },
  },
};
