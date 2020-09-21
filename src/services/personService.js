import { nextAPI } from 'utils';
import { apiBuilder, Action, F, H } from 'utils/next-api-builder';


// !----------[... Checking Line by BoGao ...]-----------------------------------------------


// TODO @Deprecated use services/person/person.ls::getPersons instead.
// getPersoni will fetch person by ids using new search api.
// export async function getPersons(payload) {
//   const { ids, schema } = payload;

//   const nextapi = apiBuilder.create('search.Search', 'getPersons')
//     .param({
//       ids,
//       searchType: F.searchType.all,
//       // haves: { eb: expertBases },
//     })
//     .schema({ person: schema || F.fields.person_in_PersonList });
//   // .addSchema({ person: ['tags_translated_zh'] }, { when: sysconfig.Locale === zhCN });

//   // H.filtersToQuery(nextapi, filters);
//   // plugins.applyPluginToAPI(nextapi, 'api_search');
//   return nextAPI({ data: [nextapi.api] });
// }

export async function findPath(payload) {
  const { id1, id2, n, sort } = payload;
  const nextapi = apiBuilder.create(Action.person.FindPath, 'FindPath')
    .param({ from_id: id1, to_id: id2, n, sort });
  return nextAPI({ data: [nextapi.api] });
}

/**
 * Fetch person by ids.
 * @param {null} payload
 */
export async function fetchPersonByIDs(payload) {
  console.log('payload', payload);
  const { ids, schema } = payload;
  const size = 1000;
  if (ids && ids.length > size) {
    console.error('fetchPersonByIDs: ids exceed max limitation 1000 ids.');
  }
  const finalSchema = schema || {
    person: ['id', 'name', 'name_zh', 'avatar',
      { profile: ['position', 'affiliation'] },
      { indices: ['hindex', 'pubs', 'citations'] },
    ],
  };
  const nextapi = apiBuilder.create(Action.search.search, 'fetchPersonByIDs')
    .param({ ids, size })
    .schema(finalSchema);
  return nextAPI({ data: [nextapi.api] });
}

// 根据名字和单位寻找专家列表，带分页。
export async function choosePerson(name, org, offset, size) {
  const data = [{
    action: 'search.search',
    parameters: {
      advquery: {
        texts: [
          {
            source: 'name',
            text: name,
          },
          {
            source: 'org',
            text: org || '',
          }],
      },
      offset,
      size,
      searchType: 'SimilarPerson',
    },
    schema: {
      person: ['id', 'name', 'name_zh', 'profile.affiliation', 'avatar',
        'profile.affiliation_zh', 'profile.position', 'profile.position_zh',
        'profile.email', 'profile.phone', 'profile.affiliation', 'profile.homepage', 'profile.edu',
        'profile.position', 'profile.work', 'profile.gender',
        { indices: ['hindex', 'pubs', 'citations'] }],
    },
  }];

  return nextAPI({ data });
}

// -------------------------------------------------
// tob_profile related.
// -------------------------------------------------

export async function getToBProfileByPid(payload) {
  const { ids } = payload;
  const nextapi = apiBuilder.create('tob.profile.Get', 'getTobP')
    .param({ ids });
  return nextAPI({ data: [nextapi.api] });
}

// 专家高级搜索专用
export async function advSearchPerson(payload) {
  const { params, sorts, offset, size, keyword, interest } = payload;
  const { name, gender, position, aff, nation, lang, h_index } = params;
  let query = '';
  if (keyword && interest && interest.length > 0) {
    query = interest.concat([keyword]).join(' or ');
  } else if (!keyword && interest && interest.length > 0) {
    query = interest.join(' or ');
  } else if (keyword && (!interest || interest.length === 0)) {
    query = keyword;
  }
  const reg = {
    zh: name.match(/([\u4e00-\u9fa5])/ig) || [],
    en: name.match(/[a-z]+[\-\']?[a-z]*/ig) || [],
  };
  const filters = {
    and: [
      { ranges: { h_index } },
      { or: [{ terms: { gender } }] },
      { or: [{ terms: { name: reg.en } }] },
      { or: [{ terms: { name_zh: reg.zh } }] },
      { or: [{ terms: { position } }] },
      { or: [{ terms: { aff } }] },
      { or: [{ terms: { nation } }] },
      { or: [{ terms: { lang } }] },
    ],
  };
  const schema = {
    person: ['id', 'name', 'name_zh', 'avatar', 'tags',
      {
        profile: ['position', 'affiliation', 'org'],
      },
      {
        indices: ['hindex', 'gindex', 'pubs', 'citations', 'newStar',
          'risingStar', 'activity', 'diversity', 'sociability'],
      },
      'tags_translated_zh',
    ],
  };
  const nextapi = apiBuilder.create(Action.search.search, 'advSearch')
    .param({
      offset,
      size,
      searchType: F.searchType.ToBPerson,
      filters,
      sorts,
      query,
    })
    .schema(schema);
  return nextAPI({ data: [nextapi.api] });
}

export async function CheckShortName({ short_name }) {
  const nextapi = apiBuilder.create('person.CheckShortName', 'checkUrl')
    .param({ short_name });
  return nextAPI({ data: [nextapi.api] });
}

export async function setShortName({ short_name, real_name, aid }) {
  const nextapi = apiBuilder.create('person.EditProfileInfo', 'setUrl')
    .param({ short_name, real_name, aid });
  return nextAPI({ data: [nextapi.api] });
}

export async function getProfile({ short_name, aid }) {
  const nextapi = apiBuilder.create('person.GetAuthorInfoByShortNameOrID', 'getInfo')
    .param({ short_name, aid });
  return nextAPI({ data: [nextapi.api] });
}

export async function getExternalLinks({ ids }) {
  const nextapi = apiBuilder.create('search.search', 'getExternalLinks')
    .param({ ids })
    .schema({ person: ['id', 'name', 'links'] });
  return nextAPI({ data: [nextapi.api] });
}

// export async function setExternalLinks({ id, links }) { // api后端已经删除
//   const nextapi = apiBuilder.create('person.SetExternalLink', 'setExternalLink')
//     .param({ id, links });
//   return nextAPI({ data: [nextapi.api] });
// }

export async function addNewExpert(payload) {
  const opts = [{
    operator: 'upsert',
    fields: H.createFieldsArray(payload),
  }];
  const nextapi = apiBuilder.create('person.Alter', 'person.Alter')
    .param({ opts });
  return nextAPI({ data: [nextapi.api] });
}
