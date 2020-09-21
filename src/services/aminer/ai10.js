import { baseURL } from 'consts/api';
import { request, nextAPI } from 'utils';
import { apiBuilder, Action } from 'utils/next-api-builder';
const dev1Url = 'http://dev1.aminer.cn';

const api = {
  getAddFields: `${dev1Url}/jconf.do`,
};

export async function getAwardRosterPersonsById(params) {
  const nextapi = apiBuilder.create(Action.mostinfluentialscholars.GetTopNScholars).param(params);
  return nextAPI({ data: [nextapi.api] });
}

export async function GetDomainTopScholars(params) {
  const nextapi = apiBuilder.create(Action.aiglobal.GetDomainTopScholars).param(params);
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function GetMultDomainsTopScholars(params) {
  const nextapi = apiBuilder.create(Action.aiglobal.GetMultDomainsTopScholars).param(params);
  return nextAPI({ data: [nextapi.api] });
}

export async function GetAuthorPubs(params) {
  const nextapi = apiBuilder.create(Action.aiglobal.GetAuthorPubs).param(params);
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function CheckDomainsExist(params) {
  const nextapi = apiBuilder.create(Action.aiglobal.CheckDomainsExist).param(params);
  return nextAPI({ data: [nextapi.api] });
}

export async function getPersonAwardsById(params) {
  const nextapi = apiBuilder.create(Action.mostinfluentialscholars.QueryPersonAward).param(params);
  return nextAPI({ data: [nextapi.api] });
}

export async function GetDomainList(params) {
  const nextapi = apiBuilder.create(Action.mostinfluentialscholars.GetDomainList).param(params);
  return nextAPI({ data: [nextapi.api] });
}

export async function GetSelectedPapers(params) {
  const nextapi = apiBuilder.create(Action.mostinfluentialscholars.GetSelectedPapers).param(params);
  return nextAPI({ data: [nextapi.api] });
}

export async function SetDomainComment(params) {
  const nextapi = apiBuilder.create(Action.mostinfluentialscholars.SetDomainComment).param(params);
  return nextAPI({ data: [nextapi.api] });
}

export async function GetHomeInfo(params) {
  const nextapi = apiBuilder.create(Action.mostinfluentialscholars.GetHomeInfo).param(params);
  return nextAPI({ data: [nextapi.api] });
}

export async function GetOrgHomeInfo(params) {
  const nextapi = apiBuilder.create(Action.mostinfluentialscholars.GetOrgHomeInfo).param(params);
  return nextAPI({ data: [nextapi.api] });
}

export async function GetScholarsDynamicValue(params) {
  const nextapi = apiBuilder
    .create(Action.mostinfluentialscholars.GetScholarsDynamicValue)
    .param(params);
  return nextAPI({ data: [nextapi.api] });
}

export async function Track(params) {
  const { data } = params;
  const nextapi = apiBuilder.create(Action.tracking.Track, 'Track').param(params);
  return nextAPI({ data: [nextapi.api] });
}

export async function GetTrack(params) {
  const { data } = params;
  const arr = data.map(item => {
    const nextapi = apiBuilder.create(Action.tracking.GetTrack, 'GetTrack').param(item);
    return nextapi.api;
  });
  return nextAPI({ data: arr });
}

export async function GetWechatSignature(params) {
  const nextapi = apiBuilder.create(Action.wechat.GetSignature).param(params);
  return nextAPI({ data: [nextapi.api] });
}

export async function getAddFields(params) {
  const { query } = params;
  return request(api.getAddFields, {
    method: 'POST',
    data: { query },
  });
}
