import { baseURL } from 'consts/api';
import { request, nextAPI } from 'utils';
import { apiBuilder, Action } from 'utils/next-api-builder';

// const api = {
//   stats: `${baseURL}/stats`,
// }

// export async function getRosterList(params) {
//   const { offset, size } = params;
//   return request(api.rosterList.replace(':offset', offset).replace(':size', size || 100));
// }

export async function replaceEbPerson(params) {
  const nextapi = apiBuilder.create('expertbasenext.ReplacePerson')
    .param(params)
    .schema({ "person": [] });
  return nextAPI({ data: [nextapi.api] });
}

export async function SetEbNoteToRoster(params) {
  const nextapi = apiBuilder.create('expertbase.SetNoteToRoster').param({ ...params });
  return nextAPI({ data: [nextapi.api] });
}

export async function getEbBasic({ id }) {
  return request(`${baseURL}/roster/mix/${id}`);
}

export async function SaveEbBasic({ id, ...params }) {
  return request(`${baseURL}/roster/${id}`, {
    method: 'PUT',
    body: params,
  });
}

export async function ExtractEbEmail({ id }) {
  return request(`${baseURL}/roster/${id}/crawl-task`, {
    method: 'POST',
    body: { id },
  });
}

export async function checkEmail({ email }) {
  return request(`${baseURL}/user/check${email ? `/${email}` : ''}`);
}

export async function getExpertList({ id }) {
  return request(`${baseURL}/roster/${id}/order-by/h_index/offset/0/size/20`);
}

export async function setEbMember({ id, data }) {
  return request(`${baseURL}/roster/${id}/members/u`, {
    method: 'PUT',
    body: { ...data },
  });
}

export async function deleteMember({ id, userId }) {
  return request(`${baseURL}/roster/${id}/members/u/${userId}`, {
    method: 'DELETE',
  });
}

export async function getEbMember({ id }) {
  return request(`${baseURL}/roster/${id}/members/0/10/0/10`);
}
