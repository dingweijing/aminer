import { stringify } from 'qs';
import { request, nextAPI } from 'utils';
import { apiBuilder, F, Action } from 'utils/next-api-builder';
import { sysconfig } from 'systems';
import { api } from 'consts/api';


// ---------------------------------------------------------------


// TODO kill this.
export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

export async function getRealCaptcha(params) {
  const { opts } = params;
  const nextapi = apiBuilder.create(Action.user.SendSMSCode)
    .param({ 
      opts
    })
  return nextAPI({ data: [nextapi.api] });
}

export async function query() {
  return request('/api/users');
}

export async function retrieve(data) {
  return request(api.retrieve, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePassword(data) {
  try {
    const res = await request(api.updatePassword, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return res
  } catch (err) {
    return err
  }
}

export async function forgot(params) {
  const data = { ...params, token: sysconfig.SOURCE };
  return request(api.forgot, {
    method: 'POST',
    body: JSON.stringify({ ...data, src: sysconfig.UserAuthSystem }),
  });
}

export async function createUser(params) {
  const data = { ...params, src: params.source || sysconfig.SOURCE };
  if (data.source) {
    delete data.source;
  }
  if (data.password) {
    data.password = data.password;
  }
  return request(api.signup, {
    method: 'POST',
    body: JSON.stringify({ ...data }),
  });
}

export async function createMobileUser(params) {
  const { opts } = params;
  const nextapi = apiBuilder.create(Action.user.CreateMobileUser)
    .param({ opts })
  return nextAPI({ data: [nextapi.api] });
}

export async function resetMobileUserPass(params) {
  const { opts } = params;
  const nextapi = apiBuilder.create(Action.user.UpdateMobileUserPass)
    .param({ opts })
  return nextAPI({ data: [nextapi.api] });
}

export async function checkEmail(params) {
  const { email } = params;
  return request(api.checkAminerEmail.replace(':email', email));
}

export async function setFeedback(params) {
  const { subject, body } = params;
  const nextapi = apiBuilder.notify(F.notify.feedback, 'feedback')
    .param({ subject, body });
  return nextAPI({ type: 'notify', data: [nextapi.api] });
}
