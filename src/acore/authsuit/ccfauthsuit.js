// Auth config with ccf system.
import { api } from 'consts/acaonline';
import { request } from 'utils';

// api返回的user到通用user的转换函数.
const apiToUser = user => {
  const { user_id, user_name, role, email, phone, token, client_id, created_time, ...rest } = user;
  // 这里是标准的UserModel需要的数据。标*为强标准。
  return {
    id: user_id, // * user id
    name: user_name, // * display name 显示用的名字
    username: user_name, // * 通常是登录用的用户名
    avatar: '/img/avatar.png', // * 头像地址
    role, // * 角色 是一个字符串数组, ['admin']
    email, // 电子邮件地址, 通常可能不需要.
    phone, // 电话，其实并不是必须字段。
    token, // * 登录的token，必须
    client_id, // * 客户ID，对于一些区分id的人是需要的。
    created_time,
    raw_info: rest, // 其他剩余字段信息.
  };
};

// auth services

async function getCurrentUserInfo(params) {
  const { token, ...data } = params;
  const options = { method: 'get', data };
  if (token) {
    options.token = token;
  }
  return request(api.currentUser, options);
}

async function login({ user_name, password, src, persist }) {
  return request(api.userLogin, {
    method: 'POST', body: { user_name, password },
  });
}

async function logout(optionalToken) {
  const options = { method: 'post' };
  if (optionalToken) {
    options.token = optionalToken; // override toke when call request.
  }
  return request(api.userLogout, options);
}

export default {
  // configs
  LoginPage: '/auth/login',
  TokenPrefix: 'Bearer ', // can't ignore space. for CCF kind backend.

  // methods
  apiToUser,

  // services
  getCurrentUserInfo,
login,
logout,

  // processors.
  processGetMe: apiResult => {
    if (!apiResult) {
      return { success: false, msg: 'GetME Error, API returns nothing.' };
    }
    if (apiResult.code !== 0) {
      return { success: false, msg: apiResult.error };
    }
    const user = apiToUser(apiResult && apiResult.data);
    return { success: true, user };
  },

  /**
   * @return: {success, msg, token, ex}
   */
  processLogin: loginResult => {
    if (!loginResult) {
      return { success: false, msg: 'Login error, API returns nothing.' };
    }
    if (loginResult.code !== 0) {
      return { success: false, msg: loginResult.error };
    }
    const { data } = loginResult;
    const { token, ex } = data; // 这个API返回User了。但是aminer的没有。这里忽略。
    return { success: true, token, ex };
  },

  processLoginException: err => {
    const { success, statusCode, message } = err;
    if (!success && statusCode > 400 && statusCode < 500) {
      console.error('API Error:', message);
      return { success: false, msg: '用户名或密码错误' };
    } else {
      // 其他错误直接抛出
      throw err;
    }
  },


  // login API results:
  _login_results: { 'status': true, 'token': 'ey' },
  _login_error_results: { 'status': false, message: 'credentials.invalid' },
  // aminer success: { "status": true, "token": "ey" },
  // aminer error  : { "status": false, "message": "credentials.invalid" },
  // ccf success: {  },
  // ccf error  : { "code":404, "error":"user not found" }


};
