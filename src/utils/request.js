/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console, no-param-reassign,prefer-destructuring */
import axios from 'axios';
import qs from 'qs';
// import jsonp from 'jsonp';
import consts from 'consts';
import { cloneDeep } from 'lodash';
// import { AES } from 'crypto-js';
import pathToRegexp from 'path-to-regexp';
import { getLocalToken } from 'utils/auth';
import { escapeURLBracket, unescapeURLBracket } from 'utils/strings';
import { nextAPIURL, YQL, JSONP, GlobalEnableAPIDebug } from 'consts/api';
import { AuthSuit } from '@/../.startup/authsuit';
import * as debug from './debug';
import { wget } from './request-umi-request';
import { isBrowser } from 'acore'

// import { CORS, strict } from './config';

// ! the following is forbidden
// import { sysconfig } from 'systems';

// TODO retrieve final buildings.

export default function request(url, options) {
  // 为了兼容之前的调用方法。
  options = options || {};
  options.method = options.method || 'get';
  if (url) {
    options.url = url;
  }
  // options.url = encodeURI(options.url);

  if (process.env.NODE_ENV !== 'production') {
    debug.logRequest('❯ Request',
      options.method, options.url && options.url.replace(consts.AMinerOldAPIDomain, ''),
      debug.LogRequestContent ? options : '',
    );
  }
  if (options.url && options.url.indexOf('//') > -1) {
    const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`;
    if (isBrowser() && window && window.location && window.location.origin !== origin) {
      if (JSONP && JSONP.indexOf(origin) > -1) {
        options.fetchType = 'JSONP';
      } else if (YQL && YQL.indexOf(origin) > -1) {
        options.fetchType = 'YQL';
      } else {
        options.fetchType = 'CORS';
      }
    }
  }

  return fetch(options).then(response => {
    const { statusText, status } = response;
    const data = options.fetchType === 'YQL' ? response.data.query.results.json : response.data;
    // if (data instanceof Array) {
    //   data = {
    //     list: data,
    //   };
    // }
    const result = {
      success: true,
      status: statusText, // what this?
      message: statusText, // what this?
      statusCode: status,
      data, // ...data // whitch to use?
    };
    if (process.env.NODE_ENV !== 'production') {
      const output = [options.method, options.url && options.url.replace(consts.AMinerOldAPIDomain, '')];
      if (debug.LogRequestContent) {
        output.push('\n>');
        output.push(result);
      }
      debug.logRequestResult('❯❯ Response:', ...output);
    }

    let success = true;
    const errors = [];
    if (options.nextapi && data && data.data && data.data.length > 0) {
      for (const d of data.data) {
        // Print API Warn message.
        if (process.env.NODE_ENV !== 'production') {
          if (d.warn) {
            console.warn('API Warning:', d.warn);
          }
        }

        // On Error
        if (!d.succeed) {
          success = false;
          errors.push(d.err_message);

          // 开发模式下的报错机制
          if (process.env.NODE_ENV !== 'production') {
            console.error('API Error: ', d.error, d, 'TODO Call Stack');
          }
          // 产品模式下的报错模式
          if (process.env.NODE_ENV === 'production') {
            console.error('API Error: ', d.error);
          }
        }
      }

      // this is a fix; if only one query, return result. if many TODO;
      if (data.data.length === 1) {
        result.data = data.data[0];
      } else if (data.data.length > 1) {
        // return as result.
      }
    }
    // 报错
    if (!success) {
      return Promise.reject({ success: false, statusCode: 500, message: errors.join('\n') });
    }
    return Promise.resolve(result);
  }).catch(error => {
    const { response } = error;
    let msg;
    let statusCode;
    if (response && response instanceof Object) {
      const { data, statusText } = response;
      statusCode = response.status;
      msg = data.message || statusText;

      const reason = printNEXTAPIDebugLog(data);
      if (reason) {
        msg = `${msg}: ${reason}`;
      }
    } else {
      statusCode = 600;
      msg = error.message || 'Network Error';
    }
    return Promise.reject({ success: false, statusCode, message: msg });
  });
}

const printNEXTAPIDebugLog = data => {
  let reason = null;
  if (data.errs && data.errs.length > 0) {
    for (const err of data.errs) {
      console.error('NEXT_API_ERROR: ', err.Error);
      if (err.Details) {
        for (const msg of err.Details) {
          console.log('\t', msg);
          // return reason
          if (!reason) {
            const match = msg.match(/panic:(.*)/);
            reason = match && match.length > 0 && match[1];
          }
        }
      }
    }
  }
  return reason;
};

const fetch = options => {
  let {
    method = options.method,
    data = {},
    fetchType,
    url,
    body, // This is a fix.
  } = options;

  // backward-compatibility: translate body back into data:
  if (body) {
    try {
      if (typeof body === 'string') {
        data = JSON.parse(body);
      } else {
        data = body;
      }
    } catch (err) {
      console.error('::::::::::::', err);
    }
  }

  const cloneData = cloneDeep(data);

  try {
    let domain = '';
    let escapedUrl = escapeURLBracket(url);
    if (escapedUrl.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domain = escapedUrl.match(/[a-zA-z]+:\/\/[^/]*/)[0];
      escapedUrl = escapedUrl.slice(domain.length);
    }
    const match = pathToRegexp.parse(escapedUrl);
    escapedUrl = pathToRegexp.compile(escapedUrl)(data);

    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name];
      }
    }
    url = domain + unescapeURLBracket(escapedUrl);

    // process !post mode data.
    // let newUrl = '';
    // if (options &&
    //   !(options.method && options.method.toUpperCase() === 'POST')
    //   && options.data) {
    //   const queryList = Object.keys(options.data).map(k => `${k}=${options.data[k]}`);
    //   const queryString = queryList.join('&');
    //   newUrl = `${newUrl}?${queryString}`;
    // }
    // console.log('> TODO 没用的newUrl', newUrl);
  } catch (e) {
    console.error('======================新的错误=======================');
    throw e.message;
    // message.error(e.message);
  }

  // process headers
  const headers = {};
  if (options && options.specialContentType) {
    headers.Accept = 'application/json';
    // headers.append('Content-Type', 'text/plain');
  } else if (options && (options.data || options.body)) {
    // Fix a bug
    if (options.method && options.method !== 'FETCH') {
      headers.Accept = 'application/json';
      headers['Content-Type'] = 'application/json';
    }
  }

  const token = (options && options.token) || getLocalToken();
  if (token) {
    headers.Authorization = `${AuthSuit.TokenPrefix}${token}`;
  }

  // enable debug in next api.
  if (options.nextapi) {
    if (process.env.NODE_ENV !== 'production' || GlobalEnableAPIDebug) {
      headers.debug = 1;
    }
  }


  // real call
  // TODO: 后面看，这里应该没用
  // if (fetchType === 'JSONP') {
  //   return new Promise((resolve, reject) => {
  //     jsonp(url, {
  //       param: `${qs.stringify(data)}&callback`,
  //       name: `jsonp_${new Date().getTime()}`,
  //       timeout: 16000,
  //     }, (error, result) => {
  //       if (error) {
  //         reject(error);
  //       }
  //       resolve({ statusText: 'OK', status: 200, data: result });
  //     });
  //   });
  // } if (fetchType === 'YQL') {
  //   url = `http://query.yahooapis.com/v1/public/yql?q=select * from json where url='${options.url}?${encodeURIComponent(qs.stringify(options.data))}'&format=json`;
  //   data = null;
  // }

  // TODO temp: test something:
  // if (options.nextapi) {
  // const text = JSON.stringify(cloneData);
  // const key = '==typeof o?(r=o,o={}):o=o||{}:(r=o,o=a||{},a=void 0))';
  // const ciphertext = AES.encrypt(text, key);
  // console.log('crypto:', text);
  // console.log('crypto:', ciphertext.toString());
  // }


  let result;
  switch (method.toLowerCase()) {
    case 'get':
      result = axios.get(encodeURI(url), { params: cloneData, headers });
      break;
    case 'delete':
      result = axios.delete(url, { data: cloneData, headers });
      break;
    case 'post': // ??? is this work?
      result = axios.post(url, cloneData, { headers });
      break;
    case 'put':
      result = axios.put(url, cloneData, { headers });
      break;
    case 'patch':
      result = axios.patch(url, cloneData, { headers });
      break;
    default:
      result = axios(options);
  }
  return result;
};

/**
 * Requests a URL, returning a promise.
 * Request Format：
 * {
 *  "method" :"search",
 *  "parameters":{"a":"c"},
 *  "schema":{"a":"c"}
 *  }
 */
// TODO Support Multiple queries.
export async function nextAPI(payload) {
  if (!payload) {
    console.error('Error! parameters can\'t be null when call nextApi');
  }
  const { method, type = 'magic', baseAPI, ...options } = payload;
  options.method = method || 'post';
  options.nextapi = true;

  const apiurl = baseAPI || nextAPIURL;
  const url = `${apiurl}/${type}?a=${actionNameString(options.data)}`;
  const result = request(url, options);
  return result;
}

// prepare displaynames;
function actionNameString(requestData) {
  // const actions = options.data && options.data.map(query => `${query.action}+${query.eventName}`);
  const actions = [];
  if (requestData) {
    let i = 0;
    for (const query of requestData) {
      query.eventName = query.eventName || '';
      if (i === 0) {
        // actions.push(`${query.action}...${query.eventName}......`);
        if (requestData.length > 1) {
          actions.push(`[${requestData.length}]`);
        }
        actions.push(`${query.eventName}__${query.action}___`);
      }
      delete query.eventName;
      i += 1;
    }
  }
  return actions && actions.join('');
}

export { wget }
/* eslint-enable no-console, no-param-reassign,prefer-destructuring */
