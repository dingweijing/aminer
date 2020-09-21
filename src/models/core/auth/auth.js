/* eslint-disable no-param-reassign */
/**
 * Created by GaoBo on 2017-12-26.
 * Refactor by GaoBo
 *   2018-09-01 - Use immer.
 *   2018-09-04 - Add cfg config.
 *
 */
import { history, isBrowser } from 'acore';
import { sysconfig } from 'systems';
import cookies from 'utils/cookie';
import * as authService from 'services/auth';
import * as auth from 'utils/auth';
import { qs } from 'utils';
import cache from 'helper/cache';
import { removeLocalAuth } from '@/utils/auth';
import { AuthSuit } from '@/../.startup/authsuit';

// enable ckcest SSO, // TODO used when only in aminer.
// import '@/utils/3rd/checksso';
import { checkSSO } from '@/utils/3rd/checksso';

const { Auth_LoginPage, SSO_System } = sysconfig;

// TODO whta's this? move to others. Deprecated???
const queryURL = name => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  let src = window.location.search;
  if (src.indexOf('&amp')) {
    src = src.replace(/&amp;/g, '&');
  }
  const r = src.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
};

const meCache = new cache.LocalStorageCache({
  key: 'me-data', alwaysLoad: false, expires: 1000 * 60, // 1 minute
});

export default {
  namespace: 'auth',

  state: {
    token: auth.getLocalToken(),
    user: null,
    roles: null,
    cfg: {}, // TODO ! 一套localStorage缓存过的pageConfig系统。
    feedbackStatus: null,

    // 以下是登录页面需要的内容.
    error: null, // 登录时显示的错误消息
    captchaError: null, // 获取验证码时显示的错误消息

    // flags
    isUserLogin: false, // 是否已经登录
    canAnnotate: false, // 是否可以标注
    peekannotationlog: false, // 只能看到标注信息，lupei
    isDeveloper: false, // 是否是开发人员
    isRoot: false, // 是否是超级用户

    // TODO what's these?
    type: null,
    list: [],
    status: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // remove user in model when no token in localStorage.
      let token = auth.getLocalToken();
      const authCookie = cookies.getAMinerAuthToken();
      if (!token) {
        dispatch({ type: 'emptyAuthInfo' });
        // return; // do nothing if there are no token in localStorage.
      } else if (!authCookie) {
        // token && !authCookie
        // 老页面退出登录清除了 cookie 但 session 里还有 token，走新页面的退出登录逻辑但不跳转
        dispatch({ type: 'callLogoutApi' });
      } else {
        // 刷新URL第一次访问肯定不会执行这段。url变化之后，比较一下token是否一致，如果一致，跳过检查其他的。
        const userMessage = auth.getLocalUser();
        if (userMessage && userMessage.data) {
          const { data: { user, roles } } = userMessage;
          dispatch({ type: 'alreadyLoggedIn', user, roles });
          // return;
        }
      }
      // no user in localStorage.
      // 上一步：getLocalToken有可能会把过期的token也一起清空。所以要再判断一次。
      token = auth.getLocalToken();
      if (token) {
        // TODO dispatch getMe sync???
        dispatch({ type: 'getMe' });
      } else {
        dispatch({ type: 'emptyAuthInfo' });
      }

      return history.listen(async ({ pathname }) => {

        // debug
        // console.log("........>>> checkSSO", checkSSO);
        // TODO refactor: move to one plugin file.
        if (
          process.env.NODE_ENV === 'production' &&
          sysconfig.SYSTEM === 'aminer' &&
          pathname !== '/ckcest/sso'
          // ？除了ckcest的登录窗页，每个页面都可能弹出登录窗
        ) {
          // if (typeof window === 'object' && typeof window.checkSSO !== 'undefined') {
          if (isBrowser() && checkSSO) {
            checkSSO('81VUYDTrgQgneqa7', function R(state) {
              if (!token && state) {
                // CKCEST 已登录且 AMiner 未登录，需自动登录 CKCEST 账号
                dispatch({ type: 'ckcestSSOLogin' });
              } else if (token && !state) {
                // 如果 CKCEST 已注销
                dispatch({ type: 'ckcestSSOLogout' });
              }
            });
          }
        }

      })

    },
  },

  effects: {

    // TODO 这里可以用cookie来优化速度。
    * getMe({ payload }, { call, put }) {
      const { reloadCache } = payload || {};
      const value = meCache.loadCacheValue();
      if (meCache.isCacheValid() && !reloadCache) {
        yield put({ type: 'getMeSuccess', payload: value });
      }
      if (meCache.shouldLoad() || reloadCache) {
        const medata = yield call(
          AuthSuit.getCurrentUserInfo,
          // backdoor ? { token } : {}, // backdoor, use buildin token.
        );
        const { success, user } = AuthSuit.processGetMe(medata);
        if (success && user) {
          if (meCache.shouldUpdate(user) || reloadCache) {
            meCache.updateCache(user);
            yield put({ type: 'getMeSuccess', payload: user });
          }
        } else {
          removeLocalAuth();
          yield put({ type: 'emptyAuthInfo' });
        }
      }
    },

    * login({ payload }, { put, call }) {
      // first call login.
      const { restrictRoot, backdoor, src, persist, ...formData } = payload;
      let loginResult;
      try {
        formData.src = !sysconfig.UserAuthSystem_AddSysTagAuto ? sysconfig.UserAuthSystem : (src || sysconfig.SYSTEM);
        if (typeof persist === 'boolean') {
          formData.persist = persist;
        } else {
          formData.persist = true; // TODO submit form form.
        }
        loginResult = AuthSuit.processLogin(
          yield call(AuthSuit.login, formData), // user_name, password, src, persist
        );
      } catch (err) {
        loginResult = AuthSuit.processLoginException(err); // TODO need test
      }
      // status 是aminer老API返回的。
      const { success, msg, token, ex } = loginResult;
      if (!success) {
        yield put({ type: 'loginError', payload: msg });
        return true;
      }

      if (!token) {
        yield put({ type: 'loginError', payload: 'API does not return token.' });
        return true;
      }
      auth.saveLocalToken(token);
      if (sysconfig.AuthSupportAMinerCookie) {
        cookies.setTokenToAMinerCookie(token);
      }

      // update me info. // TODO if(restrictRoot){ ... }
      let apiResult;

      try {
        apiResult = AuthSuit.processGetMe(yield call(
          AuthSuit.getCurrentUserInfo,
          backdoor ? { token } : {}, // backdoor, use buildin token.
        ));
      } catch (err) {
        apiResult = AuthSuit.processLoginException(err); // TODO need test
        // antdMessage.error('认证失败!'); // TODO
      }
      if (!apiResult || !apiResult.success) {
        yield put({ type: 'loginError', payload: 'Error when get user info.' });
      }
      if (apiResult && apiResult.user) {
        yield put({ type: 'getMeSuccess', payload: apiResult.user });
        yield put({ type: 'modal/close' });
        // yield auth.dispatchAfterLogin(put);
        const from = queryURL('from') || queryURL('callback') || sysconfig.DefaultUrlAfterLogin;
        let decodedFrom = auth.decodeFrom(from);
        const { origin } = window.location;
        const to = queryURL('to');
        let decodedTo = auth.decodeFrom(to);
        if (process.env.NODE_ENV !== 'production') {
          console.log('Login Success, Dispatch to ', decodedFrom);
        }
        if (sysconfig.SYSTEM === 'aminer' || sysconfig.SYSTEM === 'adata') {
          if (!/^\//.test(auth.decodeFrom(decodedFrom))) {
            decodedFrom = `/${decodedFrom}`;
          }
        }

        console.log('AuthSuit.LoginPage', sysconfig);
        // TODO config to exclude path
        if (sysconfig.AuthSupportAMinerCookie && window.location.pathname !== Auth_LoginPage) { //  '/auth/login'
          // decodedFrom = payload.pathname
          console.log('======================', token);
          cookies.setTokenToAMinerCookie(token); // also set token to aminer cookie.
          window.location.href = payload.pathname; // redi
          return true;
        }

        const sso = queryURL('sso');  // 单点登录，登录成功后跳回 decodedTo 需带 token
        // 三方登录相关
        if ((origin !== decodedTo) && to) {
          if (!decodedTo.includes('http')) {
            decodedTo = `https://${decodedTo}`;
          }
          if (sysconfig.SYSTEM === 'aminer') {
            // console.log('token', `Authorization=%22${token}%22;path=/`);
            // console.log('token', 'Authorization=%22' + token + '%22;path=/');
            document.cookie = `Authorization=%22${token}%22;path=/`;
          }
          if (sso && SSO_System.includes(sso)) {
            if (decodedTo.includes('?')) {
              decodedTo = `${decodedTo}&token=${token}`;
            } else {
              decodedTo = `${decodedTo}?token=${token}`;
            }
          }
          window.location.href = decodedTo;
        } else {
          history.push(decodedFrom);
        }

        // yield put(routerRedux.push({ pathname: decodedFrom }));
        history.push(decodedFrom);
        return true; // login success
      }
      return true;
    },

    * wechatLogin({ payload }, { put, call }) {
      /**
       *  重写一个service
       *  yield call(AuthSuit.login, formData)
       */
      const loginResult = AuthSuit.processLogin(yield call(AuthSuit.wechatLogin, payload))
      const { success, msg, token, } = loginResult;
      if (!success) {
        yield put({ type: 'loginError', payload: msg });
        return true;
      }

      if (!token) {
        yield put({ type: 'loginError', payload: 'API does not return token.' });
        return true;
      }
      auth.saveLocalToken(token);
      if (sysconfig.AuthSupportAMinerCookie) {
        cookies.setTokenToAMinerCookie(token);
      }

      // update me info. // TODO if(restrictRoot){ ... }
      let apiResult;

      try {
        apiResult = AuthSuit.processGetMe(yield call(
          AuthSuit.getCurrentUserInfo,
        ));
      } catch (err) {
        apiResult = AuthSuit.processLoginException(err); // TODO need test
        // antdMessage.error('认证失败!'); // TODO
      }
      if (!apiResult || !apiResult.success) {
        yield put({ type: 'loginError', payload: 'Error when get user info.' });
      }
      if (apiResult && apiResult.user) {
        yield put({ type: 'getMeSuccess', payload: apiResult.user });
        yield put({ type: 'modal/close' });
        // yield auth.dispatchAfterLogin(put);
        const from = queryURL('from') || queryURL('callback') || sysconfig.DefaultUrlAfterLogin;
        let decodedFrom = auth.decodeFrom(from);
        const { origin } = window.location;
        const to = queryURL('to');
        let decodedTo = auth.decodeFrom(to);
        if (process.env.NODE_ENV !== 'production') {
          console.log('Login Success, Dispatch to ', decodedFrom);
        }
        if (sysconfig.SYSTEM === 'aminer' || sysconfig.SYSTEM === 'adata') {
          if (!/^\//.test(auth.decodeFrom(decodedFrom))) {
            decodedFrom = `/${decodedFrom}`;
          }
        }

        console.log('AuthSuit.LoginPage', sysconfig);
        // TODO config to exclude path
        if (sysconfig.AuthSupportAMinerCookie && window.location.pathname !== Auth_LoginPage) { //  '/auth/login'
          // decodedFrom = payload.pathname
          console.log('======================', token);
          cookies.setTokenToAMinerCookie(token); // also set token to aminer cookie.
          window.location.href = payload.pathname || '/'; // redi
          return true;
        }

        const sso = queryURL('sso');  // 单点登录，登录成功后跳回 decodedTo 需带 token
        // 三方登录相关
        if ((origin !== decodedTo) && to) {
          if (!decodedTo.includes('http')) {
            decodedTo = `https://${decodedTo}`;
          }
          if (sysconfig.SYSTEM === 'aminer') {
            // console.log('token', `Authorization=%22${token}%22;path=/`);
            // console.log('token', 'Authorization=%22' + token + '%22;path=/');
            document.cookie = `Authorization=%22${token}%22;path=/`;
          }
          if (sso && SSO_System.includes(sso)) {
            if (decodedTo.includes('?')) {
              decodedTo = `${decodedTo}&token=${token}`;
            } else {
              decodedTo = `${decodedTo}?token=${token}`;
            }
          }
          window.location.href = decodedTo;
        } else {
          history.push(decodedFrom);
        }

        // yield put(routerRedux.push({ pathname: decodedFrom }));
        history.push(decodedFrom);
        return true; // login success
      }
      return true;
    },

    * ckcestLogin({ payload }, { call, put }) {
      const { token, backdoor } = payload;
      if (!token) {
        yield put({ type: 'loginError', payload: 'API does not return token.' });
        return true;
      }
      auth.saveLocalToken(token);
      if (sysconfig.AuthSupportAMinerCookie) {
        cookies.setTokenToAMinerCookie(token);
      }
      document.cookie = `Authorization=%22${token}%22;path=/`;
      // window.location.href = `${window.location.protocol}//${window.location.host}/`;
      return true;
    },

    * ckcestSSOLogin({ payload }, { call, put }) {
      const url = `https://sso.ckcest.cn/login?service=https://api.aminer.cn/api/auth/ckcestauth/signin?forward=${window.location.protocol}//${window.location.host}/ckcest/sso?callback=${window.location.pathname}`
      const a = document.createElement('a');
      a.setAttribute('onclick', `window.open('${url}', '_blank', 'width=1230,height=710,menubar=no,toolbar=no,status=no,scrollbars=no,resizable=yes,directories=no,status=no,location=no')`);
      a.setAttribute('id', 'ckcestLoginPage');
      document.body.appendChild(a);
      setTimeout(() => a.click(), 500);
      document.body.removeChild(a);
    },

    * ckcestSSOLogout({ payload }, { call, put, select }) {
      const user = yield select(state => state.auth.user);
      if (user && user.email && user.email.indexOf('cae-temp.aminer.org') !== -1) {
        const token = auth.getLocalToken();
        yield put({ type: 'logoutSuccess' });
        // 通过邮箱后缀判断是否工程院的账号
        window.location.href = `https://sso.ckcest.cn/logout?service=${window.location.href}`;
        try {
          const data = yield call(AuthSuit.logout, token);
          if (data.data.status) {
            if (process.env.NODE_ENV !== 'production') {
              console.log('Logout successful');
            }
          } else {
            throw (data);
          }
        } catch (err) {
          console.log('TODO DEBUG send .....,catched ');
          console.error(err);
        }
      }
    },

    * logout({ payload }, { call, put }) {
      // 先logout，再调用api. // TODO change back.
      let isCkcestAccount = false; // 是否工程院的账号
      const currentUserInfo = yield AuthSuit.getCurrentUserInfo();
      const { data } = currentUserInfo;
      if (data && data.items && data.items.length) {
        const { email } = data.items[0];
        if (email && email.indexOf('cae-temp.aminer.org') !== -1) {
          // 通过邮箱后缀判断是否工程院的账号
          isCkcestAccount = true;
        }
      }

      const token = auth.getLocalToken();
      yield put({ type: 'logoutSuccess' });
      //
      if (sysconfig.AuthLogoutReload) {
        const { search, pathname } = window.location;
        const query = qs.parse(search, { ignoreQueryPrefix: true });
        if (query && query.token) {
          query.token = undefined;
          const params = qs.stringify(query);
          window.location.href = `${pathname}${params}`;
        } else if (isCkcestAccount) {
          window.location.href = `https://sso.ckcest.cn/logout?service=${window.location.href}`;
        } else {
          window.location.reload();
        }
      } else if (sysconfig.AuthLoginUsingThird) {
        // redirect to 3rd party login system.
        window.location.href = sysconfig.AuthLoginUsingThirdPage;
      } else {
        // normal redirect to login page.
        const fromURL = auth.encodeURL(auth.getLoginFromURL());
        console.log('\n\n------------------------Logout::::', auth.getLoginFromURL());
        history.push({
          pathname: AuthSuit.LoginPage, // '/user/login',
          search: `?from=${fromURL}`, // window.location.href,
        });

        history.push({
          pathname: sysconfig.Auth_LoginPage,
          search: `?from=${fromURL}`,
        });
      }

      // last call api.
      try {
        console.log('TODO DEBUG send .....,');
        const data = yield call(AuthSuit.logout, token);
        console.log('TODO DEBUG-=====slkdjflskdjflskjdf logout,', data);
        if (data.data.status) {
          if (process.env.NODE_ENV !== 'production') {
            console.log('Logout successful');
          }
        } else {
          throw (data);
        }
      } catch (err) {
        console.log('TODO DEBUG send .....,catched ');
        console.error(err);
      }
    },

    * callLogoutApi({ payload }, { call, put }) {
      // 先logout，再调用api. // TODO change back.
      const token = auth.getLocalToken();
      yield put({ type: 'logoutSuccess' });
      // last call api.
      try {
        console.log('TODO DEBUG send .....,');
        const data = yield call(AuthSuit.logout, token);
        console.log('TODO DEBUG-=====slkdjflskdjflskjdf logout,', data);
        if (data.data.status) {
          if (process.env.NODE_ENV !== 'production') {
            console.log('Logout successful');
          }
        } else {
          throw (data);
        }
      } catch (err) {
        console.log('TODO DEBUG send .....,catched ');
        console.error(err);
      }
    },

    * getCaptcha({ payload }, { call, put }) {
      const { area, phone } = payload;
      if (area && phone) {
        const params = { opts: [{ fields: [{ field: "phone", value: [`${area}${phone}`] }] }] };
        let getCapchaResult;
        try {
          getCapchaResult = AuthSuit.processGetCaptcha(yield call(authService.getRealCaptcha, params));
        } catch (err) {
          getCapchaResult = AuthSuit.processGetCaptchaException(err);
        }
        const { success, msg } = getCapchaResult
        if (!success) {
          yield put({ type: 'getCaptchaError', payload: msg });
        }
        return true;
      }
      return false;
    },

    * fetch({ payload }, { call, put }) {
      const response = yield call(authService.query);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    * retrievePw({ payload }, { call, put }) {
      const { data } = yield call(authService.retrieve, payload);
      if (data.status) {
        yield put({ type: 'retrievePsSuccess', data });
        return true;
      }
      throw data;

    },

    * resetPw({ payload }, { call }) {
      const { data } = yield call(authService.forgot, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * updatePw({ payload }, { call }) {
      const { data } = yield call(authService.updatePassword, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * createUser({ payload }, { call, put }) {
      const { data } = yield call(authService.createUser, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * createMobileUser({ payload }, { call }) {
      const payloads = { ...payload, src: payload.source || sysconfig.SOURCE };
      const fields = Object.keys(payloads).map(key => {
        return { field: key, value: payloads[key] }
      });
      const params = { opts: [{ fields }] }
      const { data } = yield call(authService.createMobileUser, params);
      if (data) {
        return data;
      }
      return null;
    },

    * resetMobileUserPass({ payload }, { call }) {
      const payloads = { ...payload, src: payload.source || sysconfig.SOURCE };
      const fields = Object.keys(payloads).map(key => {
        return { field: key, value: payloads[key] }
      });
      const params = { opts: [{ fields }] }
      const { data } = yield call(authService.resetMobileUserPass, params);
      if (data) {
        return data;
      }
      return null;
    },

    * checkEmail({ payload }, { call, put }) {
      const { data } = yield call(authService.checkEmail, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * setFeedback({ payload }, { call, put }) {
      const { email, content, user, url } = payload;
      console.log('', email, content, user);
      const subject = `[${sysconfig.SOURCE}] ${content.slice(0, 50)}`;
      const body = `<div>${content}
  <br><br>Email:&nbsp;&nbsp;&nbsp;${email || ''}<br>URL:&nbsp;&nbsp;&nbsp;${url}<br>System:&nbsp;&nbsp;&nbsp;${sysconfig.SOURCE}
  <br>userID:&nbsp;&nbsp;&nbsp;${user.id}<br>userName:&nbsp;&nbsp;${user.display_name}<br>userEmail:&nbsp;&nbsp;${user.email}
  <br>userRole:&nbsp;&nbsp;${user.role}<br>time:&nbsp;&nbsp;&nbsp;${new Date()}</div>`;

      const data = yield call(authService.setFeedback, {
        subject: subject.replace(/[\r\n]/g, ' '),
        body,
      });

      yield put({ type: 'feedbackSuccess', payload: data });
    },
  },

  reducers: {

    getMeSuccess(state, { payload: user }) {
      const roles = auth.parseRoles(user);
      auth.saveLocalAuth(user, roles);
      setUserRolesAndFlags(state, user, roles);
    },

    logoutSuccess(state) {
      auth.removeLocalAuth();
      delete state.user;
      delete state.token;
    },

    // payload is message; this is an immer example.
    loginError(state, { payload }) {
      state.error = payload;
    },

    getCaptchaError(state, { payload }) {
      state.captchaError = payload;
    },

    emptyAuthInfo(state) {
      state.user = null;
      state.token = null;
    },

    initLoginForm(state) {
      state.error = null;
      state.captchaError = null;
    },

    clearCaptchaError(state) {
      console.log('clearCaptchaError')
      state.captchaError = null;
    },

    alreadyLoggedIn(state, { user, roles }) {
      setUserRolesAndFlags(state, user, roles);
    },

    retrievePsSuccess(state, { data }) {
      console.log('retrieve', data);
      state.token = data.token;
    },

    feedbackSuccess(state, { payload }) {
      state.feedbackStatus = payload.success;
    },
  },
};

function setUserRolesAndFlags(state, user, roles) {
  state.user = user;
  state.roles = roles;
  state.isUserLogin = auth.isLogin(user);
  state.canAnnotate = auth.isRoster(user);
  state.peekannotationlog = auth.isPeekannotationlog(user);
  state.isDeveloper = auth.isDeveloper(user);
  state.isRoot = auth.isSuperAdmin(user); // Todo rename who?
}
