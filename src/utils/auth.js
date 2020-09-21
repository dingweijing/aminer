/* eslint-disable no-extend-native */
import consts from 'consts';
import { history } from 'acore';
import { sysconfig } from 'systems';
import cookies from 'utils/cookie';
import helper from 'helper';
import structMe from 'utils/struct/me';

const debug = require('debug')('ACore:Auth');

// import AES from 'crypto-js/aes';
// const AES_KEY = 'deng-dili-dengleng-dideng';
const LS_TOKEN_KEY = `token_${sysconfig.SYSTEM}`;
const LS_USER_KEY = `user_${sysconfig.SYSTEM}`;

const sevenday = 1000 * 60 * 60 * 24 * 7; // TODO 过期时间，配置到外面去。AuthSuit/Sysconfig.

const tokenLong = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhkX3ltQHFxLmNvbSIsImV4cCI6MjA3NTYzMDQwMCwiaWF0IjoxNTc4ODk5OTc2LCJuYmYiOjE0NDQ0Nzg0MDAsInJvbGVzIjpbImJpYW55aWdldG9rZW4iXSwic3JjIjoiYW1pbmVyIiwidWlkIjoiNTVkMmVhMTc0NWNlMDc4YjhjMDliNDM2In0.CM2kKUUfvrGr7BeXSUoF7sndfakyOmasFnl-AG9khaM';

const tempToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhkX3ltQHFxLmNvbSIsImV4cCI6MTczNTAwODQ3MiwiaWF0IjoxNTc3MzI4NDcyLCJuYmYiOjE0NDQ0Nzg0MDAsInJvbGVzIjpbXSwic3JjIjoiYW1pbmVyIiwidWlkIjoiNTVkMmVhMTc0NWNlMDc4YjhjMDliNDM2In0.FG4wZ6tTMRB0JEmSFsbuwQ8nXQSkd_is06XR240M-pM';
// get token from localStorage.
function getLocalToken() {
  let token;
  let buildInToken = false;
  if (consts.IsServerRender()) {
    // global && global.window && global.window.g_history && global.window.g_history.location
    buildInToken = helper.isBuildInToken();
  } else {
    buildInToken = helper.isBuildInToken();
    // TODO: 半年以后删除，这个是fix bianyigetoken的问题的！ xiaobei，2020-1-13
    deleteBianYiGeToken()
  }
  //

  if (!consts.IsServerRender()) {
    token = localStorage.getItem(LS_TOKEN_KEY);
  }

  // enable aminer cookie token.
  if (sysconfig.AuthSupportAMinerCookie) {
    const aminertoken = cookies.getAMinerAuthToken() // support SSR

    // error case, fix 2b token
    if (token && aminertoken && aminertoken !== token) {
      console.log('ERROR: found different aminer cookie and 2b token. User AMiner token instead!')
      saveLocalToken(aminertoken)
      token = aminertoken;// use aminer cookies.
    }
    if (!token && aminertoken) {
      saveLocalToken(aminertoken)
      token = aminertoken;// use aminer cookies.
    }
    if (!token && !aminertoken && buildInToken) {
      token = tokenLong
    }
  }
  return token;
}

function deleteBianYiGeToken() {
  const localToken = localStorage.getItem(LS_TOKEN_KEY)
  if (localToken && localToken === tempToken) {
    removeLocalAuth();
  }
  const cookieToken = cookies.getAMinerAuthToken();
  if (cookieToken && cookieToken === tempToken) {
    removeLocalAuth();
  }
}

function saveLocalToken(token) {
  if (!consts.IsServerRender()) {
    localStorage.setItem(LS_TOKEN_KEY, token);
    if (sysconfig.AuthSupportAMinerCookie) { // write clientside.
      cookies.setTokenToAMinerCookie(token)
    }
  }
  // TODO write cookie when SSR render.
}

// 从localStorage读取用户信息，如果过期了则不算读取到。
const getLocalUser = () => {
  if (consts.IsServerRender()) {
    return null;
  }
  const bootstrapData = structMe.unmarshal(localStorage.getItem(LS_USER_KEY));
  if (!bootstrapData || structMe.isExpired(bootstrapData, sevenday)) { // 非法或者过期!
    console.log('Me not valid or expired!');
    if (!sysconfig.AuthSupportAMinerCookie) {
      removeLocalAuth();
    }
  }
  return null;
};

const saveLocalAuth = (user, roles) => {
  if (!consts.IsServerRender()) {
    const curTime = new Date().getTime();
    localStorage.setItem(LS_USER_KEY,
      JSON.stringify({ data: { user, roles }, time: curTime }),
    );
  }
};

/*
 *
 * @param dispatch or put
 */
function dispatchToLogin(dispatch) {
  debug('AUTH :::: dispatchToLogin');
  const from = getLoginFromURL();
  if (process.env.NODE_ENV !== 'production') {
    console.log('Dispatch to Login Page from ', from);
  }

  // TODO umi jump add parameter.
  const path = { pathname: '/login' };
  debug('AUTH :::: redirect to %o', path);
  if (dispatch) {
    // 分为两种router来调用.
    if (from) {
      // path.query = { from };
      path.search = `?from=${encodeURL(from)}`;
    }
    history.replace(path);
  } else {
    if (from) {
      path.query = { from };
    }
    history.replace(path);
  }
}

// no one call this?
// function dispatchAfterLogin() {
//   const from = queryURL('from') || '/';

//   debug('AUTH :::: dispatchAfterLogin to %s.', from);

//   if (process.env.NODE_ENV !== 'production') {
//     console.log('Login Success, Dispatch to ', decodeURIComponent(from));
//   }
//   let redirect = decodeURIComponent(from);
//   if (redirect.endsWith('.html')) {
//     redirect = redirect.replace('.html', '');
//   }
//   // dispatch ? dispatch(routerRedux.push({ pathname: path })) : router.push(path);
//   router.replace(redirect);
// }

const parseRoles = u => {
  const roles = createEmptyRoles();
  const user = u || {};
  if (user.role && user.role.length > 0) {
    user.role.map(r => {
      switch (r) {
        case 'root':
          roles.god = true;
          roles.admin = true;
          break;
        case 'admin':
          roles.admin = true;
          break;
        case `${sysconfig.SOURCE}_超级管理员`:
          roles.admin = true;
          break;
        case 'forbid':
          roles.forbid = true;
          break;
        case 'bianyigetoken':
          roles.bianyigetoken = true;
          break;

        case 'default':
        case sysconfig.SOURCE:
          roles.authed = true;
          roles[r] = true;
          break;
        default:
          roles[r] = true;
      }

      return false;
    });
  }
  // special
  if (user.email === 'elivoa@gmail.com' || user.email === 'aminervip@gmail.com') {
    roles.god = true;
  }
  return roles;
};

function createEmptyRoles() {
  return {
    god: false, // 神级管理员，是跨system的存在。可以管理2b后台。
    admin: false, // system 的系统管理员，也叫超级管理员。一个system内的最高权限。
    authed: false, // 认证用户，有某个system的权限。
    systems: [], // TODO 标记这个用户有哪些system的访问权限。
    role: [], // 具体细节的role.
    authority: [], // 目前ccf在用。
    // TODO --> 使用普通角色判断。
    primary: false, // reco系统在用，中级用户，可以查看报告中发送的数据
    intermediate: false, // reco系统在用，中级用户，可以查看报告中点击的数据
    senior: false, // reco系统在用，中级用户，可以查看报告中具体点击人的详情链接
    forbid: false, // 禁用用户。
    bianyigetoken: false,
  };
}


/**
 * user in app model.
 */
function isLogin(user) { // banned?
  if (user && user.id) {
    return true;
  }
  return false;
}

// 返回是否是管理员。
function isAuthed(roles) {
  return roles && !roles.forbid && (roles.god || roles.root || roles.admin || roles.authed);
}

function isAdmin(roles) {
  return roles && !roles.forbid && roles.admin;
}

// TODO banned bugs......
function isRoster(user) {
  // const { role = [] } = user
  const role = (user && user.role) || [];
  return role &&
    (role.includes('roster_editor') || role.includes('root')) &&
    user.email !== 'jery.tang@gmail.com' &&
    user.email !== 'jietang@tsinghua.edu.cn'
}
function isALLRoster(user) {
  // const { role = [] } = user
  const role = (user && user.role) || [];
  return role &&
    (role.includes('roster_editor') || role.includes('root'))
}

// 给 topic 和必读的标注人员
function isTempAnno(user) {
  // temp_mr_anno
  const role = (user && user.role) || [];
  return role &&
    (role.includes('temp_mr_anno') || role.includes('root')) &&
    user.email !== 'jery.tang@gmail.com' &&
    user.email !== 'jietang@tsinghua.edu.cn'
}

// TODO banned bugs......
function isDeveloper(user) {
  // const { role = [] } = user
  const role = (user && user.role) || [];
  return role &&
    (role.includes('developer') || role.includes('root')) &&
    user.email !== 'jery.tang@gmail.com' &&
    user.email !== 'jietang@tsinghua.edu.cn'
}

function isPeekannotationlog(user) {
  const role = (user && user.role) || [];
  return role && role.includes('peekannotationlog');
}
function isSuperAdmin(user) {
  const role = (user && user.role) || [];
  return role && (role.includes('roster_editor') || role.includes('root'))
}

function isGod(roles) {
  return roles && !roles.forbid && (roles.root || roles.god);
}

function isBianYiGeToken(user) {
  return user && user.role && user.role.includes('bianyigetoken');
}

function isLockAuth(user) {
  const role = (user && user.role) || [];
  return role && !(role.includes('forbid')) && (role.includes('root') || role.includes('platform'));
}

function isEditAI2000QA(user) {
  // const { role = [] } = user
  const role = (user && user.role) || [];
  return role && user &&
    (user.email === 'contactmx@163.com' ||
      user.email === 'xenaluo@gmail.com' ||
      user.email === 'hd_yangym@sina.com' ||
      user.email === '454943379@qq.com')
}

function haveRole(roles, role) {
  // if baned, have nothing.
  if (!roles || roles.forbid) {
    return false;
  }
  // god has every role.
  if (roles.god || roles.root) {
    return true;
  }
  // check role.
  for (const r of role) {
    if (roles[r]) {
      return true;
    }
  }
  return false;
}

function canAnnotate(roles) {
  return isSuperAdmin(roles) || isGod(roles) || roles.annotation;
}

function canSeeHiddenThings(roles) {
  return isSuperAdmin(roles) || isGod(roles);
}

function removeLocalAuth() {
  localStorage.removeItem(LS_USER_KEY);
  localStorage.removeItem(LS_TOKEN_KEY);

  // 如果是aminer系统，我同时需要清除cookie.
  if (sysconfig.AuthSupportAMinerCookie) {
    cookies.removeAMinerAuthToken()
  }
}

// 暂时不支持夸域名的login重定向。
function getLoginFromURL() {
  // NOTE can't used in node environment.
  const { location } = window;

  let from = location.pathname;
  if (from === '/' || from === sysconfig.Auth_LoginPage) {
    from = '';
  } else {
    from = `${location.pathname}${location.search}`;
  }

  return from;
}

function encodeURL(url) {
  return encodeURIComponent(url);
}

function decodeFrom(from) {
  return decodeURIComponent(from);
  // let redirect = decodeURIComponent(from);
  // 这两句看起来现在没有用了。是老版本的umi的fix。
  // if (redirect.endsWith('.html')) {
  //   redirect = redirect.replace('.html', '');
  // }
  // return redirect;
}

function getAuthority() {
  return [] // kill this
}

function setAuthority(authority) {
  // return localStorage.setItem('antd-pro-authority', JSON.stringify(authority));
}

const isStarPaperRole = (user) => {
  const roles = user && user.role || [];
  if (roles && roles.length) {
    return roles.includes('annotation') && roles.includes('roster_editor')
  }
  return false;
}

export {
  createEmptyRoles,
  dispatchToLogin,
  getLocalToken,
  getLocalUser,
  saveLocalAuth,
  saveLocalToken,
  removeLocalAuth,
  parseRoles,
  haveRole,
  isLogin, isAuthed, isAdmin, isSuperAdmin, isGod, isRoster, isALLRoster, isDeveloper, isPeekannotationlog, isEditAI2000QA, isTempAnno,
  // isLockAuth,
  isLockAuth,
  getLoginFromURL,
  decodeFrom,
  encodeURL,

  getAuthority, setAuthority, isBianYiGeToken,
  isStarPaperRole
};

export default {
  isLogin,
  isAuthed,
  isAdmin,
  isSuperAdmin,
  isGod,
  isRoster,
  isALLRoster,
  isLockAuth,
  canAnnotate,
  canSeeHiddenThings,
  isPeekannotationlog,
  isBianYiGeToken,
  isStarPaperRole
}
