import { baseURL } from 'consts/api';
import { request, nextAPI } from 'utils';
import { apiBuilder, Action } from 'utils/next-api-builder';

const api = {
  personSimilar: `${baseURL}/person/similar/:id`,
  bibtex: `${baseURL}/pub/ctext/:id`,
  getAwardTags: `${baseURL}/person/award-tags/:id/offset/:offset/size/:size`,
  rosterAward: `${baseURL}/roster/award/:id/offset/:offset/size/:size`,
};

export async function ChangeVoteByID(params) {
  const { tid, id, is_cancel, type, vote_type } = params;
  const nextapi = apiBuilder.create(Action.comments.ChangeVoteByID).param(params);
  return nextAPI({ data: [nextapi.api] });
}

export async function PaperMark(params) {
  const { id } = params;
  const nextapi = apiBuilder.create(Action.publication.StarOnePub).param({ pid: id });
  return nextAPI({ data: [nextapi.api] });
}

export async function PaperUnMark(params) {
  const { id } = params;
  const nextapi = apiBuilder.create(Action.publication.UnStarOnePub).param({ pid: id });
  return nextAPI({ data: [nextapi.api] });
}

export async function PersonFollow(params) {
  const { id } = params;
  const nextapi = apiBuilder.create(Action.person.FollowPersonByUidAid).param({ aid: id });
  return nextAPI({ data: [nextapi.api] });
}

export async function PersonUnFollow(params) {
  const { id } = params;
  const nextapi = apiBuilder.create(Action.person.UnfollowPersonByUidAid).param({ aid: id });
  return nextAPI({ data: [nextapi.api] });
}

export async function personSimilar(params) {
  const { id } = params;
  return request(api.personSimilar.replace(':id', id));
}

// TODO Deprecated - use person/getPersons instead.
export async function searchPersonsById(params) {
  // const { ids, offset, size } = params;
  const fields = [
    'id',
    'name',
    'name_zh',
    'avatar',
    { indices: ['hindex', 'pubs', 'citations'] },
    { profile: ['affiliation', 'position'] },
  ];
  const nextapi = apiBuilder
    .create(Action.search.search, 'SEARCH')
    .param(params)
    .addParam({ switches: ['master'] })
    .schema({ person: fields });

  return nextAPI({ data: [nextapi.api] });
}

export async function getAwardRosterPersons(params) {
  const { id, offset, size } = params;
  return request(
    api.rosterAward
      .replace(':id', id)
      .replace(':offset', offset)
      .replace(':size', size),
  );
}

export async function searchPersonById(params) {
  // const { ids, offset, size } = params;
  const fields = [
    'id',
    'name',
    'name_zh',
    'avatar',
    'num_view',
    'is_follow',
    'work',
    'hide',
    'nation',
    'language',
    'bind',
    'acm_citations',
    'links',
    'educations',
    'tags',
    'tags_zh',
    'num_view',
    'num_follow',
    'is_upvoted',
    'num_upvoted',
    'is_downvoted',
    'is_lock',
    { indices: ['hindex', 'pubs', 'citations'] },
    {
      profile: [
        'position',
        'position_zh',
        'affiliation',
        'affiliation_zh',
        'work',
        'gender',
        'lang',
        'homepage',
        'phone',
        'email',
        'fax',
        'bio',
        'edu',
        'address',
        'note',
        'homepage',
      ],
    },
  ]; // locks.edit.status hidden indices.patents indices.activities  acm_citations？？？
  const nextapi = apiBuilder
    .create('personapi.get', 'getPerson')
    .param(params)
    // .addParam({ switches: ['master'] })
    .schema({ person: fields });

  return nextAPI({ data: [nextapi.api] });
}

export async function getExperienceById(params) {
  const fields = ['work'];
  const nextapi = apiBuilder
    .create(Action.search.search, 'SEARCH')
    .param(params)
    .schema({ person: fields });
  return nextAPI({ data: [nextapi.api] });
}

export async function bibtex(params) {
  const { id } = params;
  return request(api.bibtex.replace(':id', id));
}

export async function getAwardTags(params) {
  const { id, offset, size } = params;
  return request(
    api.getAwardTags
      .replace(':id', id)
      .replace(':offset', offset || 0)
      .replace(':size', size || 100),
  );
}

export async function getListAwardsByAid(params) {
  // const { ids, offset, size } = params;
  const fields = ['id', 'name'];
  const nextapi = apiBuilder
    .create(Action.influentialscholar.ListAwardsByAid)
    .param(params)
    // .addParam({ switches: ['master'] })
    .schema({ person: fields });

  return nextAPI({ data: [nextapi.api] });
}

export async function getCOVIDHotExpert() {
  // const { id, offset, size } = params;
  return request(
    'https://innovaapi.aminer.cn/predictor/api/v1/valhalla/highlight/get_ncov_expers_show_list',
  );
}

// export async function GetPersonInterests(params) {
//   const nextapi = apiBuilder.create(Action.PersonInterest.GetPersonInterests).param(params);
//   return nextAPI({ data: [nextapi.api] });
//   // , type: 'n'
// }
export async function Get(params) {
  const nextapi = apiBuilder.create(Action.PersonInterest.Get).param(params);
  return nextAPI({ data: [nextapi.api], type: 'n' });
  // , type: 'n'
}

export async function GetPersonInterestsByYear(params) {
  const { id } = params;
  const nextapi = apiBuilder.create(Action.PersonInterest.GetPersonInterestsByYear).param({ id });
  return nextAPI({ data: [nextapi.api]});
  // , type: 'n'
}

export async function UpdatePersonInterests(params) {
  const nextapi = apiBuilder.create(Action.PersonInterest.Update).param(params);
  return nextAPI({ data: [nextapi.api], type: 'n' });
}
// export async function UpdatePersonInterests(params) {
//   // const { id } = params;
//   const { tp } = params;
//   const nextapi = apiBuilder.create(Action.PersonInterest.UpdatePersonInterests).param(params);
//   const arr = [nextapi.api];
//   return nextAPI({ data: arr });
// }

export async function UpdatePersonInterestsOrder(params) {
  const { data } = params;
  const arr = data.map(item => {
    const nextapi = apiBuilder
      .create(Action.PersonInterest.UpdatePersonInterests, 'UpdatePersonInterests')
      .param(item);
    return nextapi.api;
  });
  return nextAPI({ data: arr });
  // , type: 'n'
}

export async function ResetInterests(params) {
  const { id } = params;
  const nextapi = apiBuilder.create(Action.PersonInterest.Reset).param({ id });
  return nextAPI({ data: [nextapi.api], type: 'n' });
  // , type: 'n'
}

export async function Calculation(params) {
  const nextapi = apiBuilder.create(Action.PersonInterest.Calculation).param(params);
  return nextAPI({ data: [nextapi.api], type: 'n' });
  // , type: 'n'
}

export async function SetScore(params) {
  const nextapi = apiBuilder.create(Action.PersonInterest.SetScore).param(params);
  return nextAPI({ data: [nextapi.api], type: 'n' });
  // , type: 'n'
}
