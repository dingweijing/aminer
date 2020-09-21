import {
  setLocale, getLocale, getIntl,
  FormattedMessage, FormattedDate, FormattedTime, useIntl
} from 'umi'; // * SSR must from here.
import { colorLog } from '@/utils/log';
import cookies from '@/utils/cookie';
import { removeLSItemIfExist } from '@/utils/lsutil';
import { EnableLocale } from '../../.startup/startup';

// enum all locales.
const enUS = 'en-US';
const zhCN = 'zh-CN';
const locales = [enUS, zhCN]; // en, zh
const AllLocales = locales;

const umi_locale_lskey = 'umi_locale';

let FD = (arg) => { return <FormattedDate {...arg} /> };
let FT = (arg) => { return <FormattedTime {...arg} /> };
let FM = (arg) => { return <span><FormattedMessage {...arg} /></span> };
let formatMessage = (id, values) => {
  if (!getIntl) { return null }
  return getIntl(getLocale()).formatMessage(id, values)
};

// --------------------------------------------------------------------------
// 当Locale被禁用的时候，替换一些方法，让语言相关代码不会导致出错。
// --------------------------------------------------------------------------
if (!EnableLocale) {
  // enabled?
  const replacefunc = type => ({ id, value }) => {
    const v = value ? `values:${value}` : '';
    return (`<intl:${type}:${id}${v}>`);
  };

  let res;
  const realfunc = type => ({ id, value }) => {
    if (res && res.default && res.default[id]) {
      return `-${res.default[id]}`;
    }
    const v = value ? `values:${value}` : '';
    return (`<intl:${type}:${id}${v}>`);
  };

  FD = replacefunc('FD');
  FT = replacefunc('FT');
  FR = replacefunc('FR');
  FM = realfunc('FM');
  formatMessage = realfunc('formatMessage');
}
// --------------------------------------------------------------------------

// methods

const isLocaleValid = locale => locales.includes(locale)

// * 确定Locale:
// 入口函数，系统启动时，这个函数来确定具体的locale逻辑。会在 LocaleWrapper 之前运行。
// 因此在这里更改system的locale设置。需要覆盖umi_locale.
//
// 几个地方可以确定locales：AMiner SSR工程只有123条生效。
// 1. 和老AMiner系统兼容的cookie， lang = %7B%22language%22%3A%2...
// 2. 判断浏览器语言获得默认语言。
// 3. sysconfig.Locale 设置的系统默认语言，为空则根据浏览器判断。

// 1. x system/config.js 可以指定默认的语言。中英文或者自动。(SSR工程这个配置不生效)
// 2. x egg文件中定义的默认语言（此条未生效，可以认为无效或者被覆盖，即使是SSR环境。）egg-i18n，已经删除。
// 3. x umi默认会存储localStorage的语言设置。umi_locale=en-US。词条在AMinerSSR工程中也禁用了。
// 7. x AMiner 2b系统框架会存储localStorage的语言设置。locale_aminer="en-US"
// 8. x TODO clear 神奇的还有一个 lang = en 不知道是谁留下的。

// 这里只在刷新页面时执行一次。

// TODO 2b system 的语言设置可能会有问题。需要解决。
const loadSavedLocale = (system, defaultLocale) => {
  // 修正用户有错误localstorage的问题。
  removeLSItemIfExist(umi_locale_lskey, 'lang') // ! fixing

  let sl;
  let naviLang;

  // 1. load from cookie
  const { lang, navigatorLang, serverRender } = cookies.syncSSRCookieLang();
  if (serverRender) {
    // SSR 阶段的语言判定，REQ Cookie -> system 默认设置 -> zh-CN
    sl = lang;
    naviLang = navigatorLang;
  } else {
    // SSR 之后普通阶段，Cookie -> localStorage -> system 默认设置 -> zh-CN
    // 用cookie直接读取。
    const langCookie = cookies.getCookie('lang');
    sl = cookies.parseAMinerLangCookie(langCookie);
    naviLang = navigator && navigator.language; // from navigator.
    naviLang = naviLang.startsWith('zh') ? 'zh-CN' : 'en-US'
  }

  sl = sl || defaultLocale || naviLang;

  // check
  if (!isLocaleValid(sl)) {
    colorLog(
      'Invalid Lang [%s]. (set to default %s)',
      'color:red;background-color:rgb(255,251,130)',
      sl, defaultLocale,
    )
    sl = defaultLocale || naviLang; // set to default.
  }

  return sl;
};

// 更换页面Locale并存储到localStorage。由于调用了umi-plugin-locale，会刷新页面。
function saveLocale(system, locale) {
  if (locale) {
    // update umi locale.
    const umiLocale = getLocale();
    if (locale !== umiLocale) {
      setLocale(locale, false);
    }
    global.PageLevelLocateCache = locale;

    // set Old AMiner locale when system is aminer.
    // TODO 是否所有2b系统也同样使用AMiner的方式来存储语言呢？
    if (system === 'aminer') {
      console.log('setAMinerLangCookie')
      cookies.setAMinerLangCookie(locale);
    }
  } else {
    // TODO 清空？
  }
}


// switch locale between zh and en.
// 只能在非SSR阶段调用，因此直接替换
function switchLocaleZhEn(system) {
  const sl = loadSavedLocale(system); // system no use.
  if (!sl || sl === zhCN) {
    saveLocale(system, enUS);
  } else {
    saveLocale(system, zhCN);
  }
}


function getCurrentLocal() {
  let langCookie = cookies.getCookie('lang');
  langCookie = cookies.parseAMinerLangCookie(langCookie);
  const langLocalStorage = window && window.localStorage && window.localStorage.getItem('umi_locale')
  return { langLocalStorage, langCookie }
}


export default locales;

export {
  AllLocales, enUS, zhCN, getCurrentLocal,

  isLocaleValid, getLocale, getIntl,

  loadSavedLocale, saveLocale, switchLocaleZhEn,

  formatMessage, FM, FD, FT,
};
