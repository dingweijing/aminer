import consts from 'consts';
import { isBrowser } from 'acore';

const getServerSideCookie = () => {
  if (global && global.SSR_COOKIE) {
    // TODO move to client.
    // const { errorCookies } = global.SSR_COOKIE;
    // if (errorCookies && errorCookies.length > 0) {
    //   errorCookies.forEach(errk => {
    //     if (!alreadyCleared) {
    //       // TODO clear
    //     }
    //     console.log("???????????????????????????????????????????//", errk);
    //   });
    // }
    return global.SSR_COOKIE;
  }
  return {}
}


const syncSSRCookie = key => {
  const serverRender = consts.IsServerRender();
  if (serverRender) {
    return [getServerSideCookie()[key], serverRender]
  }
  return [null, serverRender];
}

const syncSSRCookieLang = () => {
  const serverRender = consts.IsServerRender();
  if (serverRender) {
    const { lang, navigatorLang } = getServerSideCookie();
    return { lang, navigatorLang, serverRender }
  }
  return { serverRender };
}

function setCookie(name, value, path, days) {
  const serverRender = consts.IsServerRender();
  if (serverRender) { return }
  const Days = days || 30;
  const exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  if (path) {
    document.cookie = `${name}=${encodeURIComponent(value)};path=${path};expires=${exp.toGMTString()}`;
  } else {
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${exp.toGMTString()}`;
  }
}

// get cookie from client;
function getCookie(name) {
  if (!isBrowser()) { return null }

  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  const arr = document.cookie.match(reg);
  if (arr && arr.length > 1) {
    let value;
    try {
      value = decodeURIComponent(arr[2])
    } catch (error) {
      console.warn(`Error parse cookie in browser: ${name} = ${value}`);
    }
    return value;
  }
  return null;
}

// 删除cookies
function delCookie(name) {
  const exp = new Date();
  exp.setTime(exp.getTime() - 1);
  const cval = getCookie(name);
  // fix 无法删除cookie问题，在删除cookie时需要注意cookie的path，如果不给path默认是当前页的路径，给定的话就是给定的参数，
  // 不同path的cookie是不同的，所以删除的时候，删除两次，一次是path=/ 的，一次是当前页的url的
  if (cval != null) {
    if (process.env.NODE_ENV !== 'production') {
      setCookie(name, cval, null, -1)
      setCookie(name, cval, '/', -1)
      // document.cookie = `${name}=${encodeURIComponent(cval)};expires=${exp.toGMTString()};`;
    } else {
      setCookie(name, cval, null, -1)
      setCookie(name, cval, '/', -1)
      // document.cookie = `${name}=${encodeURIComponent(cval)};expires=${exp.toGMTString()};`;
    }
  }
}

// AMiner token cookies:
function getAMinerAuthToken() {
  // SSR render
  if (consts.IsServerRender()) {
    const { authorization: authtoken } = getServerSideCookie();
    return authtoken;
  }

  // CSR render
  const authtoken = getCookie('Authorization');
  if (authtoken && authtoken.substr(0, 1) === '"' && authtoken.substr(-1) === '"' && authtoken.length >= 2) {
    const aminertoken = authtoken.slice(1, authtoken.length - 1);
    return aminertoken;
  }
  return null;
}

function setTokenToAMinerCookie(token) {
  if (process.env.NODE_ENV !== 'production') {
    document.cookie = `Authorization=%22${token}%22;path=/;`;
  } else {
    document.cookie = `Authorization=%22${token}%22;path=/;`;
  }
}

function removeAMinerAuthToken() {
  delCookie('Authorization');
  // document.cookie = 'Authorization=aa'
}

function setAMinerLangCookie(lang) {
  if (lang === 'en-US') {
    setCookie('lang', '{"language":"English","translation":"English","langCode":"en","flagCode":"gb","timeCode":"en-uk","showCode":"en","aminer2b":"en-US"}', '/', 365);
  }
  if (lang === 'zh-CN') {
    setCookie('lang', '{"language":"Chinese","translation":"简体中文","langCode":"zh","flagCode":"cn","timeCode":"zh-cn","showCode":"cn","aminer2b":"zh-CN"}', '/', 365);
  }
}

// Client only, fix lang if not valid;
function parseAMinerLangCookie(cookie) {
  if (cookie) {
    try {
      const parsed = decodeURIComponent(cookie);
      if (parsed && parsed.includes('"language":"Chinese"')) {
        return 'zh-CN';
      }
      if (parsed && parsed.includes('"language":"English"')) {
        return 'en-US';
      }
      console.warn(`Warrning: not zh or en for ${parsed}`);
    } catch (e) {
      console.warn(`Warrning: Error parse cookie: lang = ${cookie}`);
    }
    // * not valid cookie `lang`, remove;
    delCookie('lang');
  }
  return '';
}


export default {
  // Common
  setCookie,
  getCookie,
  delCookie,

  // AMiner
  removeAMinerAuthToken,
  getAMinerAuthToken,
  setTokenToAMinerCookie,

  setAMinerLangCookie,
  parseAMinerLangCookie,

  //
  syncSSRCookie,
  syncSSRCookieLang,
};
