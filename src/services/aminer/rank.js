import { baseURL } from 'consts/api';
import { apiBuilder, F, H, Action } from 'utils/next-api-builder';
import { request, nextAPI } from 'utils';

const api = {
  person_overall: `${baseURL}/leaderboard/person/overall`,
  person_type_rank: `${baseURL}/leaderboard/person/list/:type/offset/:offset/size/:size`,

  paper_all_venue: `${baseURL}/rank/bestpapers/allvenue`,
  paper_type_rank: `${baseURL}/rank/bestpapers/:id`,

  org_meta: `${baseURL}/rank/org/meta`,
  conf_list: `${baseURL}/rank/conf/list/:type`
}

export async function personOverall() {
  return request(api.person_overall)
}

export async function personTypeRank(params) {
  const { type, offset, size } = params;
  return request(api.person_type_rank.replace(':type', type).replace(':offset', offset).replace(':size', size))
}



export async function paperAllVenue() {
  return request(`${api.paper_all_venue}?query={ "method": "GET", "isArray": true }`);
}

export async function paperTypeRank(params) {
  const { id } = params;
  return request(api.paper_type_rank.replace(':id', id))
}

export async function orgMeta() {
  return request(`${api.org_meta}`);
}

export async function confList(payload) {
  const nextapi = apiBuilder.create('conferencerank.GetConferenceRankInfo')
    .param(payload);
  return nextAPI({ data: [nextapi.api] });
}

export async function GetBestPapersFromConferenceType(params) {
  const { cf_type } = params || {};
  const nextapi = apiBuilder.create(Action.bestpaper.FromType)
    .param({ cf_type: cf_type || 'all' });
  return nextAPI({ data: [nextapi.api] });
}

export async function GetBestPapersById(params) {
  const { ids } = params;
  const nextapi = apiBuilder.create(Action.bestpaper.FromIDs)
    .param({ ids });

  return nextAPI({ data: [nextapi.api] });
}

export async function getConfRankIntro({ id }) {
  const nextapi = apiBuilder.create('conferencerank.GetConferenceIntroduction')
    .param({ id });
  return nextAPI({ data: [nextapi.api] });
}

export async function getConfRankInfo(payload) {
  const nextapi = apiBuilder.create('conferencerank.GetConferenceInformation')
    .param(payload);
  return nextAPI({ data: [nextapi.api] });
}


export async function getBestPaperRankInfo(payload) {
  const nextapi = apiBuilder.create('bestpaper.GetBestPaperRankInfo')
    .param(payload);
  return nextAPI({ data: [nextapi.api] });
}

export async function GetBestPaperSubmitByUid(params) {
  const nextapi = apiBuilder.create(Action.bestpaper.GetBestPaperSubmitByUid)
    .param(params);
  return nextAPI({ data: [nextapi.api] });
}

export async function SaveBestPaperSubmit(params) {
  const { urls, conference_name } = params;
  const nextapi = apiBuilder.create(Action.bestpaper.SaveBestPaperSubmit)
    .param({ urls, conference_name });
  return nextAPI({ data: [nextapi.api] });
}

export async function UpdateBestPaperSubmitByUid(params) {
  const { id, conference_name, url, status } = params;
  const nextapi = apiBuilder.create(Action.bestpaper.UpdateBestPaperSubmitByUid)
    .param({ id, conference_name, url, status });
  return nextAPI({ data: [nextapi.api] });
}

export async function DeleteBestPaperSubmit(params) {
  const { ids } = params;
  const nextapi = apiBuilder.create(Action.bestpaper.DeleteBestPaperSubmit)
    .param({ ids });
  return nextAPI({ data: [nextapi.api] });
}

export async function getNaResult(payload) {
  const nextapi = apiBuilder.create('annotation.paper_na.PaperAuthorOrderNA')
    .param(payload)
  return nextAPI({ data: [nextapi.api] });
}

export async function getAuthorList(payload) {
  const nextapi = apiBuilder.create('search.search')
    .param(payload)
    .schema({ person: F.fields.person_in_PersonList })
  return nextAPI({ data: [nextapi.api] });
}

export async function userFeedback(payload) {
  const data = [{
    type: 'na-demo',
    target_type: 'userFeedback',
    target_name: 'saveTotable',
    payload: JSON.stringify(payload),
  }];
  const nextapi = apiBuilder.create(Action.tracking.Track, 'demoTrack')
    .param({ data });
  return nextAPI({ data: [nextapi.api] });
}

export async function getNaPaperInfo() {
  const nextapi = apiBuilder.create('annotation.paper_na.GetPaperInfo')
  return nextAPI({ data: [nextapi.api] });
}

export async function CreatePaperAuthor(payload) {
  const nextapi = apiBuilder.create('annotation.paper_na.CreatePaperAuthor')
    .param(payload)
  return nextAPI({ data: [nextapi.api] });
}

export async function GetListCategoryType() {
  const nextapi = apiBuilder.create('newconferencerank.ListCategoryType')
  return nextAPI({ data: [nextapi.api] });
}


export async function GetListConferenceRank(payload) {
  const nextapi = apiBuilder.create('newconferencerank.ListConferenceRank').param(payload)
  return nextAPI({ data: [nextapi.api] });
}

export async function GetJconfStaticInfo(payload) {
  const nextapi = apiBuilder.create('newconferencerank.GetJconfStaticInfo').param(payload)
  return nextAPI({ data: [nextapi.api] });
}

export async function GetJconfDynamicInfo(payload) {
  const nextapi = apiBuilder.create('newconferencerank.GetJconfDynamicInfo').param(payload)
  return nextAPI({ data: [nextapi.api] });
}

// 获取会议列表， 用于做搜索提示(robot)
export function GetConfListRobot(params) {
  const nextapi = apiBuilder.create(Action.confrankrobot.GetConfList).param(params);
  return nextAPI({ data: [nextapi.api] });
}

// 获取会议列表， 用于做搜索提示(robot)
export function askQ3() {
  const nextapi = apiBuilder.create(Action.confrankrobot.GetAnswersNew).param({ question: 'Q3' });
  return nextAPI({ data: [nextapi.api] });
}


// 获取问题答案 robot
// export function GetAnswers(params) {
//   const nextapi = apiBuilder.create(Action.confrankrobot.GetAnswers).param(params);
//   return nextAPI({ data: [nextapi.api] })
// }

// 获取问题答案 robot 双语言
export function GetAnswersNew(params) {
  const nextapi = apiBuilder.create(Action.confrankrobot.GetAnswersNew).param(params);
  return nextAPI({ data: [nextapi.api] })
}
