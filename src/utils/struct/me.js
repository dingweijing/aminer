// Author: elivoa, 2018-10-11
//
// Me 的信息中包含用户登录信息，权限信息，整个系统的配置信息等。一次调用返回来。
// 并用localstorage缓存。
//

if (process.env.NODE_ENV !== 'production') {
  const me_data_in_localStorage = {
    me: {},
    privileges: {},
    time: {},
  }

  if (me_data_in_localStorage) { /* */ }
}

// -------------------------------------------------------


const marshal = (me) => {
   // TODO
}

const unmarshal = (stringValue) => {
  try {
    const data = JSON.parse(stringValue);
    if (data && data.data && data.data.user) { // is valid?
      return data;
    }
    console.log('Error when unmarshal struct "me" :', stringValue);
  } catch (error) {
    console.log('Error when unmarshal struct "me" :', stringValue);
  }
  return null;
}

const isExpired = (data, exptime) => {
  const time = data && data.time;
  if (time && new Date().getTime() - time > exptime) {
    return true;
  }
  return false;
}

export default {
  marshal,
  unmarshal,
  isExpired,

}
