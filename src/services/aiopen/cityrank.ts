import { apiBuilder, Action } from 'utils/next-api-builder';
import { wget } from 'utils/request-umi-request';
import { request, nextAPI } from 'utils';

export function getRankList(params = {}) {
  const nextapi = apiBuilder.create(Action.aiopen.ListCityRank).param(params);
  return nextAPI({ data: [nextapi.api] });
  return request('https://yapi.aminer.cn/mock/218/getCityRank', { method: 'get' });
}


export function getAuthorList(params = {}) {
  const nextapi = apiBuilder.create(Action.aiopen.ListAuthorInfoOfCity).param(params);
  return nextAPI({ data: [nextapi.api] });
  // return request('https://yapi.aminer.cn/mock/78/getAuthor', { method: 'get',data:params });
}

export function CityRankMoodEvent(params = {}) {
  const nextapi = apiBuilder.create(Action.aiopen.CityRankMoodEvent).param(params);
  return nextAPI({ data: [nextapi.api] });
  // return request('https://yapi.aminer.cn/mock/78/getAuthor', { method: 'get',data:params });
}
