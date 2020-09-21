import { sysconfig } from 'systems';
import { baseURL } from 'consts/api';
import { request, nextAPI } from 'utils';
import { apiBuilder, Action } from 'utils/next-api-builder';

const api = {
  stats: `${baseURL}/stats`,
  rosterAward: `${baseURL}/roster/award/:id/offset/:offset/size/:size`,
  recRosters: `${baseURL}/rec-rosters`,
  rosterList: `${baseURL}/roster/list/mix/offset/:offset/size/:size`
}

export async function getStats() {
  return request(api.stats)
}

export async function getAwardRosterPersons() {
  return request(api.rosterAward.replace(':id', '57a57c630a3ac5e5b97e6f98').replace(':offset', 0).replace(':size', 10))
}

export async function getRecRoster() {
  return request(api.recRosters)
}

export async function getRosterList(params) {
  const { offset, size } = params;
  return request(api.rosterList.replace(':offset', offset).replace(':size', size || 100));
}

export async function getNewStats() {
  const nextapi = apiBuilder.create(Action.stat.GetIndexStat)
  return nextAPI({ data: [nextapi.api] });
}


export async function getNotesFromRosters({ ids }) {
  const nextapi = apiBuilder.create('expertbase.GetNotesFromRosters').param({ ids });
  return nextAPI({ data: [nextapi.api] });
}

export async function Track(params) {
  const { data } = params;
  const nextapi = apiBuilder.create(Action.tracking.Track, 'Track')
    .param(params);
  return nextAPI({ data: [nextapi.api] });
}
