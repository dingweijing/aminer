import { isBrowser } from "@umijs/utils/lib/ssr.js"

/**
 * 调用用户登录检测API来做sso跨域检查是否已经登录
 * @param appKey 系统是否登录
 * @param callback sso登录状态回调函数
 */

export function checkSSO(appKey, callback) {
  if (isBrowser()) {
    return;
  }
  const browser = isBrowser();

  const base_ssourl = 'https://sso.ckcest.cn/api';
  const serviceUrl = browser && window.location.href;
  // 判断用户是否登录过
  if (browser) {
    protoAjax({
      url: `${base_ssourl}/auth_web/check`,
      data: {
        app_key: appKey,
        service: serviceUrl,
      },
      type: 'GET',
      jsonp: `getUser_${Math.floor(Math.random() * 100000 + 5000)}`,
      time: 5000,
      success(result) {

        console.info('ckcest check login success: ', result);

        if (result.code === 10000) {
          if (typeof callback === 'function') {
            // 登录状态
            callback(true);
          }
        } else if (result.code !== 10000) {
          // 退出
          // console.info('请求的其他结果-退出');
          if (typeof callback === 'function') {
            // 登录状态
            callback(false);
          }
        }
      },
      error(status) {
        console.log('ckcest check login failed: ', status);
      },
    });
  }

}

// TODO use umi-request instead.....

/*
 * 原生js实现Ajax
 */

function protoAjax(params) {
  params = params || {};
  params.data = params.data || {};
  const _json = params.jsonp ? jsonp(params) : json(params); // 判断是json还是jsonp
  function json(params) {
    // 普通请求
    params.type = (params.type || 'GET').toUpperCase(); // 设置请求默认类型
    const urlData = formatParams(params.data); // 对数据进行格式化
    let xhr = null; // 对xhr进行初始化
    if (window.XMLHttpRequest) {
      xhr = new window.XMLHttpRequest();
    } else {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    const headers = params.headers || {};
    if (params.type === 'GET') {
      xhr.open(params.type, `${params.url}?${urlData}`, true);
      setHeaders(xhr, headers);
      xhr.send(null);
    } else {
      xhr.open(params.type, params.url, true);
      setHeaders(xhr, headers);
      xhr.send(JSON.stringify(params.data));
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        const { status } = xhr;
        if (status >= 200 && status < 300) {
          let response = '';
          const type = xhr.getResponseHeader('Content-Type');
          if (type.indexOf('xml') !== -1 && xhr.responseXML) {
            // xml格式
            response = xhr.responseXML;
          } else if (type.indexOf('application/json') !== -1) {
            // JSON格式
            response = JSON.parse(xhr.responseText);
          } else {
            response = xhr.responseText; // 字符串格式
          }
          params.success && params.success(response);
        } else {
          params.error && params.error(status);
        }
      }
    };
  }

  function jsonp(params) {
    const callbackName = params.jsonp; // 回调函数名
    const head = document.getElementsByTagName('head')[0];
    params.data.callback = callbackName;
    const data = formatParams(params.data);
    const script = document.createElement('script');
    head.appendChild(script);
    // 创建jsonp函数，成功后自动让success函数调用，在自动删除
    window[callbackName] = function (json) {
      // 设置回调，获取后台数据后才执行
      head.removeChild(script);
      clearTimeout(script.timer);
      window[callbackName] = null;
      params.success && params.success(json);
    };
    script.src = `${params.url}?${data}`; // 设置src的时候才开始向后台请求数据
    if (params.time) {
      // 限定时间
      script.timer = setTimeout(function () {
        window[callbackName] = null;
        head.removeChild(script);
        params.error &&
          params.error({
            message: '超时',
          });
      }, params.time);
    }
  }
  function formatParams(data) {
    // 使用 encodeURIComponent 对 URI的某部分编码
    const arr = [];
    for (const key in data) {
      arr.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
    }
    // 添加随机数，防止缓存
    arr.push(`v=${random()}`);
    return arr.join('&');
  }
  function random() {
    return Math.floor(Math.random() * 10000 + 500);
  }
  function setHeaders(xhr, headers) {
    for (const key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }
  }
}
