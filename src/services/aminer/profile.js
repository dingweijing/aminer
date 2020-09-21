/*
 * @Author: your name
 * @Date: 2019-11-01 15:10:50
 * @LastEditTime: 2020-07-31 12:25:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /aminer-ssr/src/services/aminer/profile.js
 */
import { baseURL } from 'consts/api';
import { request, nextAPI } from 'utils';
import { apiBuilder, F, H, Action } from 'utils/next-api-builder';

const api = {
  getProfilePatents: `${baseURL}/person/patents/:id/all/year/:offset/:size`,
  getProfileProjects: `${baseURL}/person/projects/:id/all/year/:offset/:size`,
  getProfileActivity: `${baseURL}/activity/list/offset/:offset/size/:size?aid=:id`,
  personModify: `${baseURL}/person/contact/modify`,
  getEmail: `${baseURL}/person/email/s/:id`,
  createExperience: `${baseURL}/person/exp/work/:id`,
  updateExperience: `${baseURL}/person/exp/work/:id/weid/:weid`,
  profilePapersNa: `${baseURL}/person/pos_check/:aid/:pid`,
  personRefresh: `${baseURL}/person/refresh/:pid`
}

export async function getProfilePatents(params) {
  const { id, offset = 0, size = 20 } = params;
  return request(api.getProfilePatents.replace(':id', id).replace(':offset', offset).replace(':size', size))
}

// export async function getProfileProjects(params) {
//   const { id, offset = 0, size = 20 } = params;
//   return request(api.getProfileProjects.replace(':id', id).replace(':offset', offset).replace(':size', size))
// }

export async function getProfileProjects(params) {
  const { id, offset = 0, size = 20 } = params;
  const nextapi = apiBuilder.create(Action.person.GetFundsByPersonID, 'GetFundsByPersonID')
    .param({ id, end: size, start: offset });
  return nextAPI({ data: [nextapi.api] });

}

export async function getPersonPapers(params) {
  const { id, offset = 0, size = 20, sorts = ['!year'], year = 'recent', n_citation = '', affirm_author } = params;
  // return request(oldApi.pubInPerson.replace(':id', id).replace(':offset', offset).replace(':size', size));
  const nextapi = apiBuilder.create(Action.person.GetPersonPubs, 'GetPersonPubs')
    .param({
      offset,
      size,
      sorts,
      ids: [id],
      searchType: 'all',
    })
    .addParam({ filters: { year } }, { when: typeof year === 'number' })
    .addParam({ filters: { n_citation } }, { when: n_citation })
    .addParam({ advquery: { texts: [{ source: 'affirm_author', text: `${affirm_author}` }] } },
      {
        when: typeof affirm_author === 'boolean' || (typeof affirm_author === 'string')
      })
    .schema({
      publication: [
        'id', 'year', 'title', 'title_zh',
        // 'abstract', 'abstract_zh',
        // 'authors',
        'authors._id', 'authors.name', 'authors.name_zh',
        'num_citation',
        // 'num_viewed', 'num_starred', 'num_upvoted',
        // 'is_starring', 'is_upvoted', 'is_downvoted',
        'venue.info.name', 'venue.volume', 'venue.info.name_zh',
        // 'venue.info.publisher',
        'venue.issue',
        'pages.start', 'pages.end', 'lang', 'pdf',
        'doi', 'urls',
        // 'keywords', 'keywords_zh',
        'versions'
      ]
    });
  return nextAPI({ data: [nextapi.api] });
}

export async function GetModifiersOfPerson(params) {
  const { id } = params;
  // return request(oldApi.pubInPerson.replace(':id', id).replace(':offset', offset).replace(':size', size));
  const nextapi = apiBuilder.create(Action.person_annotation.GetModifiersOfPerson, 'GetModifiersOfPerson')
    .param({
      aid: id,
    });
  return nextAPI({ data: [nextapi.api] });
}
export async function GetNoteFromPerson(params) { // TODO 没用了？
  const { id } = params;
  // return request(oldApi.pubInPerson.replace(':id', id).replace(':offset', offset).replace(':size', size));
  const nextapi = apiBuilder.create(Action.person.GetNoteFromPerson, 'GetNoteFromPerson')
    .param({ id });
  return nextAPI({ data: [nextapi.api] });
}
export async function GetNotesFromPerson(params) {
  const { id } = params;
  // return request(oldApi.pubInPerson.replace(':id', id).replace(':offset', offset).replace(':size', size));
  const nextapi = apiBuilder.create('person.GetNotesFromPerson', 'GetNotesFromPerson')
    .param({ id });
  return nextAPI({ data: [nextapi.api] });
}
export async function SetNoteToPerson(params) {
  const { id, note } = params;
  // return request(oldApi.pubInPerson.replace(':id', id).replace(':offset', offset).replace(':size', size));
  const nextapi = apiBuilder.create(Action.person.SetNoteToPerson, 'SetNoteToPerson')
    .param({ id, note });
  return nextAPI({ data: [nextapi.api] });
}
export async function SetNotesToPerson(params) {
  const { id, op, notes_paper, notes_other, notes_email, notes_phone, notes_homepage, notes_avatar, notes_company, notes_pubs } = params;
  // return request(oldApi.pubInPerson.replace(':id', id).replace(':offset', offset).replace(':size', size));
  const nextapi = apiBuilder.create('person.SetNotesToPerson', 'SetNoteToPerson')
    .param({ id, op, notes_paper, notes_other, notes_email, notes_phone, notes_homepage, notes_avatar, notes_company, notes_pubs });
  return nextAPI({ data: [nextapi.api] });
}


export async function GetPersonPubsStats(params) {
  const { id } = params;
  // return request(oldApi.pubInPerson.replace(':id', id).replace(':offset', offset).replace(':size', size));
  const nextapi = apiBuilder.create(Action.person.GetPersonPubsStats, 'GetPersonPubsStats')
    .param({ ids: [id] })
  return nextAPI({ data: [nextapi.api] });
}

export async function UpsertPersonAnnotation(params) {
  const { id, fields, force_update } = params;
  const nextapi = apiBuilder.create(Action.person_annotation.UpsertPersonAnnotation, 'UpsertPersonAnnotation')
    .param({
      id,
      fields,
      force_update
    });
  return nextAPI({ data: [nextapi.api] });
}

export async function personModify(params) {
  const { i, m } = params;
  return request(api.personModify, {
    method: 'POST',
    body: { i, m }
  })
}

export async function AffirmPubToPerson(params) {
  const { aid, pid, assign } = params;
  const nextapi = apiBuilder.create(Action.person.AffirmPubToPerson, 'AffirmPubToPerson')
    .param({
      id: aid,
      pids: [pid],
      assign
    });
  return nextAPI({ data: [nextapi.api] });
}

export async function GetProfile(params) {
  const { id } = params;
  const nextapi = apiBuilder.create(Action.person.GetProfile, 'GetProfile')
    .param({ id })
  return nextAPI({ data: [nextapi.api] });
}

export async function RemovePubsFromPerson(params) {
  const { id, pids } = params;
  const nextapi = apiBuilder.create(Action.person.RemovePubsFromPerson, 'RemovePubsFromPerson')
    .param({ id, pids });
  return nextAPI({ data: [nextapi.api] });
}
export async function AddPubsToPerson(params) {
  const { id, pubs } = params;
  const nextapi = apiBuilder.create(Action.person.AddPubsToPerson, 'AddPubsToPerson')
    .param({ id, pubs });
  return nextAPI({ data: [nextapi.api] });
}

export async function getEmail(params) {
  const { id } = params;
  return request(api.getEmail.replace(':id', id))
}

export async function profilePapersNa(params) {
  const { aid, pid } = params;
  return request(api.profilePapersNa.replace(':aid', aid).replace(':pid', pid))
}
// [{
//   "action": "person.AffirmPubToPerson",
//   "parameters": {
//     "pids": ["5cd69e71ced107d4c6f0bcd8"],
//     "id": "53f47ebbdabfae9126cc42a9",
//     "assign": true
//   }
// }]

export async function createExperience({ id }) {
  return request(api.createExperience.replace(':id', id), {
    method: 'POST',
  })
}

export async function updateExperience({ id, weid, ...params }) {
  return request(api.updateExperience
    .replace(':id', id)
    .replace(':weid', weid), {
    method: 'PUT',
    body: params
  })
}

export async function deleteExperience({ id, weid }) {
  return request(api.updateExperience
    .replace(':id', id)
    .replace(':weid', weid), {
    method: 'DELETE',
  })
}

export async function personRefresh(params) {
  const nextapi = apiBuilder.create(Action.datacenter.RebuildExpert, 'datacenter.RebuildExpert')
    .param(params)
  // return nextAPI({ data: [nextapi.api] });
  try {
    const res = await nextAPI({ data: [nextapi.api] });
    return res
  } catch (err) {
    return err
  }
}

export async function mergePerson(params) {
  console.log('mergePerson', params);
  const nextapi = apiBuilder.create('person.MergeRepeatPersons', 'mergePerson')
    .param(params)
  return nextAPI({ data: [nextapi.api] });
}

export async function getAvatars(params) {
  const nextapi = apiBuilder.create('person.GetAvatars', 'getAvatars')
    .param(params)
  return nextAPI({ data: [nextapi.api] });
}


export async function updateAvatars(params) {
  const nextapi = apiBuilder.create('person.UpdateAvatars', 'updateAvatars')
    .param(params)
  return nextAPI({ data: [nextapi.api] });
}

export async function GetPassawayInfo(params) {
  const nextapi = apiBuilder.create(Action.personpassaway.GetPassawayInfo, 'GetPassawayInfo')
    .param(params)
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function ForceBurnCandle(params) {
  const nextapi = apiBuilder.create(Action.personpassaway.ForceBurnCandle, 'ForceBurnCandle')
    .param(params)
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function DisableBurnCandle(params) {
  const nextapi = apiBuilder.create(Action.personpassaway.DisableBurnCandle, 'DisableBurnCandle')
    .param(params)
  return nextAPI({ data: [nextapi.api], type: 'n' });
}
export async function BurnLittleCandle(params) {
  const nextapi = apiBuilder.create(Action.personpassaway.BurnLittleCandle, 'BurnLittleCandle')
    .param(params)
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function GetBaseNum(params) {
  const nextapi = apiBuilder.create(Action.personpassaway.GetBaseNum, 'GetBaseNum')
    .param(params)
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function SetBaseNum(params) {
  const nextapi = apiBuilder.create(Action.personpassaway.SetBaseNum, 'SetBaseNum')
    .param(params)
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function getPersonAnnotationVersion(params) {
  const nextapi = apiBuilder.create("person_annotation.GetPersonAnnotation", 'getPersonVersion')
    .param(params)
  return nextAPI({ data: [nextapi.api] });
}

export async function AffirmPersonAnnotation(params) {
  const nextapi = apiBuilder.create("person_annotation.AffirmPersonAnnotation", 'AffirmAnnotation')
    .param(params)
  return nextAPI({ data: [nextapi.api] });
}

export async function starPaperToPerson(params) {
  const nextapi = apiBuilder.create("person.StarPaperToPerson", 'starPaper')
    .param(params)
  return nextAPI({ data: [nextapi.api] });
}
