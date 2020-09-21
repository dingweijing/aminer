import fetch from 'umi-request';
import { message } from 'antd';
import qs from 'qs';
import { isBrowser } from 'acore';
export interface IOption extends RequestInit {
  params?: object;
}

const request = (url, option: IOption) => {
  const { params = {}, ...restOpts } = option || {};
  const paramsStr = params
    ? qs.stringify(params, { addQueryPrefix: true, arrayFormat: 'brackets', encode: false })
    : '';
  // https://github.com/bitinn/node-fetch/issues/481
  const reqUrl = `${
    isBrowser() ? '' : `${global.host || 'http://localhost:7001'}`
    }${url}${paramsStr}`;
  return fetch(reqUrl, restOpts).catch(e => {
    console.error('e', e);
    if (typeof document !== 'undefined' && !window.USE_PRERENDER) {
      message.error('请求错误');
    }
  });
};

// * --------------------------------------------------------------
// * Wget
// * --------------------------------------------------------------
// TODO add token support.
const wget = (url, option: IOption) => {
  const { params = {}, ...restOpts } = option || {};
  const paramsStr = params
    ? qs.stringify(params, { addQueryPrefix: true, arrayFormat: 'brackets', encode: false })
    : '';
  // https://github.com/bitinn/node-fetch/issues/481
  const reqUrl = `${url}${paramsStr}`;
  return fetch(reqUrl, restOpts).catch(e => {
    console.error('e', e);
    //   throw new Error(`WGET Error: ${data.status}: ${data.statusText}`);
    if (typeof document !== 'undefined' && !window.USE_PRERENDER) {
      message.error('请求错误');
    }
  });
};

// export async function wget(url) {
//   const token = getLocalToken();
//   const headers = new Headers();
//   headers.append('Accept', 'application/json');
//   headers.append('Content-Type', 'application/json');
//   if (token) {
//     headers.append('Authorization', token);
//   }
//   const options = { url, headers };
//   const data = await fetch(options);

//   if (data && data.status >= 200 && data.status < 300) {
//     return data.data;
//   } if (data.data) {
//     return data.data;
//   }
//   throw new Error(`WGET Error: ${data.status}: ${data.statusText}`);
// }


export default request;
export { wget }
