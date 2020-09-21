import { sysconfig } from 'systems';
import { baseURL } from 'consts/api';
import { request, nextAPI } from 'utils';

const api = {
  rosterAwardOverview: `${baseURL}/roster/award/overview/offset/:offset/size/:size`,

  socialFollow: `${baseURL}/social/:id/follow`,
  socialVote: `${baseURL}/roster/award/vote/:oper/:id/:aid`,
  // recRosters: `${baseURL}/rec-rosters`,
  stats: `${baseURL}/stats`,
  rosterAward: `${baseURL}/roster/award/:id/offset/:offset/size/:size`,
  recRosters: `${baseURL}/rec-rosters`
}

export async function getRosterAwardOverview(params) {
  const { offset, size } = params;
  return request(api.rosterAwardOverview.replace(':offset', offset).replace(':size', size));
}

export async function getAwardRosterPersons(params) {
  const { id, offset, size } = params;
  return request(api.rosterAward.replace(':id', id).replace(':offset', offset).replace(':size', size));
}

export async function followSocial(params) {
  const { pid } = params;
  return request(api.socialFollow.replace(':id', pid), {
    method: 'POST',
    body: { pid }
  })
}

export async function unfollowSocial(params) {
  const { pid } = params;
  return request(api.socialFollow.replace(':id', pid), {
    method: 'DELETE'
  })
}

export async function voteSocial(params) {
  const { id, aid, oper } = params;
  return request(api.socialVote.replace(':id', id).replace(':aid', aid).replace(':oper', oper), {
    method: 'POST',
    body: { aid, id, oper }
  })
}

export async function unvoteSocial(params) {
  const { id, aid, oper } = params;
  return request(api.socialVote.replace(':id', id).replace(':aid', aid).replace(':oper', oper), {
    method: 'DELETE'
  })
}

// export async function getRecRoster() {
//   return request(api.recRosters)
// }

export async function getStats() {
  return request(api.stats)
}

export async function getRecRoster() {
  return request(api.recRosters)
}
