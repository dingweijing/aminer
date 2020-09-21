import { apiBuilder, Action } from 'utils/next-api-builder';
import { wget } from 'utils/request-umi-request';
import { request, nextAPI } from 'utils';


export function getCompanyList(params = {}) {
  const nextapi = apiBuilder.create(Action.aiopen.ListCompany).param(params);
  return nextAPI({ data: [nextapi.api] });
  return request('https://yapi.aminer.cn/mock/78/getCompanyList', { method: 'post' })
}

export function getGiant(params = {}) {
  return wget('https://fileserver.aminer.cn/data/ai_company/ai2000_company.json',
    { method: 'get' })
}

export function getSelections(params = {}) {
  return wget('https://fileserver.aminer.cn/data/ai_company/consts.json',
    { method: 'get' })
}

export function getCompanyPerson(data = {}) {
  return request('https://yapi.aminer.cn/mock/78/getCompanyPerson', { method: 'post', data })
}


export function getBannerComs(data = {}) {
  return wget('https://fileserver.aminer.cn/data/ai_company/banner_coms.json',
    { method: 'get' })
  return wget('http://sftpuser@originalfileserver.aminer.cn:23333/files/data/ai_company/banner_coms.json', { method: 'get' })
}

export function getCompanyDetail(params = {}) {
  const nextapi = apiBuilder.create(Action.aiopen.ListComDetails).param(params);
  return nextAPI({ data: [nextapi.api] });
  return request('https://yapi.aminer.cn/mock/78/getCompanyPerson', { method: 'post', data })
}
