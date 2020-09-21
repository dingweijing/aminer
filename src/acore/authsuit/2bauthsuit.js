// Auth config with AMiner 2B 2C family.
import { api, nextAPIURLOnlineProduction } from 'consts/api';
import { formatMessage } from 'locales';
import { request, nextAPI } from 'utils';
import { sysconfig } from 'systems';
import { apiBuilder } from 'utils/next-api-builder';

const logError = require('debug')('ACore:Auth');

// api返回的user到通用user的转换函数.
const apiToUser = user => {
  const userItem = user && user.data && user.data.items && user.data.items[0] || {};
  const { id, name, fname, lname, email, img, role, reg_ip, reg_time, ...rest } = userItem;
  // const { id, display_name, email, avatar, role, reg_time, ...rest } = user && user.data;
  // 这里是标准的UserModel需要的数据。标*为强标准。
  return {
    id,
    name: name || `${fname} ${lname}`, // * display name 显示用的名字
    username: email, // * 通常是登录用的用户名, AMiner系使用email来登录。
    avatar: img, // * 头像地址
    role, // * 角色 是一个字符串数组, ['admin']
    email, // 电子邮件地址, 通常可能不需要.
    phone: null, // 电话，AMiner暂时不提供。
    // token: token,    // * 登录的token，改成不是必须的，因为，token本身跟user是无关的。
    client_id: null, // * 客户ID，对于一些区分id的人是需要的。
    created_time: reg_time, // reg_time as create_time.
    raw_info: rest, // 其他剩余字段信息。
    // rest: "tags", "social", "reg_ip", "profile", "status", "addr", "position", "sub", "org", "is_social", "gender",
  };
};

// auth services

async function getCurrentUserInfo(params) {
  const { token, ...data } = params || {};
  const options = { method: 'get', data };
  if (token) { // 可以使用传入的token覆盖localstroage中的token
    options.token = token;
  }
  const nextapi = apiBuilder.create('user.GetMe', 'ME');
  return nextAPI({
    data: [nextapi.api],
    token, // 可以使用传入的token覆盖localstroage中的token
    baseAPI: nextAPIURLOnlineProduction, // 强制使用baseAPI，跳过配置;
  });
}


async function wechatLogin(params) {
  const { code } = params || {};
  const nextapi = apiBuilder.create('userapi.WeChatSignIn')
    .param({ code, src: 'aminer' })
  return nextAPI({ data: [nextapi.api] });
}

// LoginForm: user_name, password
// convert to : email, password, src, persist
// acaonline: user_name, password
async function login({ email, password, src, persist }) {
  return request(api.userLogin, {
    method: 'POST', body: { email, password, src, persist }, // transfer fields.
  });
}

async function logout(optionalToken) {
  const options = { method: 'post' };
  if (optionalToken) {
    options.token = optionalToken; // override toke when call request.
  }
  return request(api.userLogout, options);
}

const needVerdictSystem = ['rencaizhongxin']; // 是否需要判断system和nsrc一样

export default {
  // configs
  LoginPage: '/login',
  TokenPrefix: '',

  // methods
  apiToUser,

  // services
  getCurrentUserInfo,
  login,
  wechatLogin,
  logout,

  // processors.
  processGetMe: apiResult => {
    if (!apiResult) {
      return { success: false, msg: 'GetME Error, API returns nothing.' };
    }
    if (!apiResult.status || !apiResult.success || apiResult.statusCode !== 200) {
      return { success: false, msg: apiResult.error };
    }
    const user = apiToUser(apiResult);
    if (needVerdictSystem.includes(sysconfig.SYSTEM) && user && user.raw_info && user.raw_info.src && sysconfig.SYSTEM !== user.raw_info.src) {
      return { success: false, }
    }
    return { success: true, user };
  },

  /**
   * @return: {success, msg, token, ex}
   */
  processLogin: loginResult => {
    // First debug print error
    if (!loginResult) {
      const msg = 'Login error, API returns nothing.';
      logError(msg);
      return { success: false, msg };
    }
    logError(loginResult);

    // for old api: credentials.invalid
    if (!loginResult.success && loginResult.statusCode === 401) {
      const msg = formatMessage({ id: 'login.errormsg.credentialsinvalid' });
      return (logError(msg), { success: false, msg });
    }

    // other errors.
    if (!loginResult.status || !loginResult.success || loginResult.statusCode !== 200) {
      const msg = loginResult.error;
      logError(msg);
      return { success: false, msg };
    }
    const { token } = loginResult.data; // why token?
    return { success: true, token, ex: {} };
  },

  processLoginException: err => {
    const { success, statusCode, message } = err;
    if (!success && statusCode > 400 && statusCode < 500) {
      console.error('API Error:', message);
      return { success: false, msg: '用户名或密码错误' };
    }
    // 其他错误直接抛出
    throw err;
  },

  processGetCaptcha: getCaptchaResult => {
    if (!getCaptchaResult) {
      const msg = 'Send captcha API error';
      logError(msg);
      return { success: false, msg };
    }
    if (!getCaptchaResult.status || !getCaptchaResult.success || getCaptchaResult.statusCode !== 200) {
      const msg = getCaptchaResult.error;
      logError(msg);
      return { success: false, msg };
    }
    return { success: true };
  },

  processGetCaptchaException: err => {
    const { success, message } = err;
    if (!success) {
      return { success: false, msg: message };
    }
  },


  // login API results:
  _login_results: { status: true, token: 'ey' },
  _login_error_results: { status: false, message: 'credentials.invalid' },
  // aminer success: { "status": true, "token": "ey" },
  // aminer error  : { "status": false, "message": "credentials.invalid" },
  // ccf success: {  },
  // ccf error  : { "code":404, "error":"user not found" }
};
