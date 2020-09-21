/* eslint-disable camelcase */
import { request, nextAPI } from 'utils';
import { sysconfig } from 'systems';
import { plugins } from 'acore';
import { zhCN } from 'locales';
import { baseURL } from 'consts/api';
import { getLangLabel } from 'helper';
import { apiBuilder, F, H, Action } from 'utils/next-api-builder';

// export async function searchOrg(payload) {
//   const { orgNameEn, orgNameZh } = payload;
//   const nextapi = apiBuilder.create(Action.org.SearchOrg)
//   .addParam({ org_name_en: orgNameEn }, { when: orgNameEn })
//   .addParam({ org_name_zh: orgNameZh }, { when: orgNameZh })
//   return nextAPI({ data: [nextapi.api], type: 'n' });
// }

// export async function updateOrg(payload) {
//   const { id, orgNameEn, orgNameZh, alias } = payload;
//   const nextapi = apiBuilder.create(Action.org.UpdateOrg)
//   .param({ id })
//   .addParam({ org_name_en: orgNameEn }, { when: orgNameEn })
//   .addParam({ org_name_zh: orgNameZh }, { when: orgNameZh || orgNameZh === '' })
//   .addParam({ alias }, { when: alias })
//   return nextAPI({ data: [nextapi.api], type: 'n' });
// }

const api = {
  bind_me: `${baseURL}/user/bind/:id`,
  unbind: `${baseURL}/user/unbind`,
  bind_profile: `${baseURL}/user/bind`,
  searchSuggest: `${baseURL}/search/suggest/gen/:query`,
};

export async function notifications(payload) {
  const nextapi = apiBuilder
    .create(Action.social.Notifications)
    .param(payload)
    .schema({
      publication: [
        'title',
        'authors',
        'authors._id',
        'authors.name',
        'authors.name_zh',
        'venue.info.name',
        'venue.volume',
        'venue.info.name_zh',
        'venue.info.publisher',
        'venue.issue',
        'pages.start',
        'pages.end',
        'year',
      ],
      person: [
        'name',
        'avatar',
        'img',
        'name_zh',
        'profile.position',
        'profile.position_zh',
        'profile.affiliation',
        'profile.affiliation_zh',
        { indices: ['hindex', 'pubs', 'citations'] },
      ],
    });

  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function SuggestTopics(payload) {
  const { query } = payload;
  return request(api.searchSuggest.replace(':query', query), { method: 'GET' });
  // const nextapi = apiBuilder.create(Action.social.SuggestTopics).param(payload);
  // return nextAPI({ data: [nextapi.api], type: 'n', baseAPI: 'https://yapi.aminer.cn/mock/26' });
}

export async function ExpertisedTopics(payload) {
  const nextapi = apiBuilder.create(Action.social.ExpertisedTopics).param(payload);

  return nextAPI({ data: [nextapi.api], type: 'n', baseAPI: 'https://yapi.aminer.cn/mock/26' });
}

export async function GetRecommendNotifications(payload) {
  const nextapi = apiBuilder
    .create(Action.social.GetRecommendNotifications)
    .param(payload)
    .schema({
      publication: [
        'title',
        'authors',
        'authors._id',
        'authors.name',
        'authors.name_zh',
        'venue.info.name',
        'venue.volume',
        'venue.info.name_zh',
        'venue.info.publisher',
        'venue.issue',
        'pages.start',
        'pages.end',
        'year',
      ],
      person: [
        'name',
        'avatar',
        'img',
        'name_zh',
        'profile.position',
        'profile.position_zh',
        'profile.affiliation',
        'profile.affiliation_zh',
        { indices: ['hindex', 'pubs', 'citations'] },
      ],
    });

  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function GetRecommendTopic(payload) {
  const nextapi = apiBuilder.create(Action.social.GetRecommendTopic).param(payload);

  return nextAPI({ data: [nextapi.api], type: 'n' });
}

// export async function RecommendEntitiesByTopics(payload) {
//   // const nextapi = apiBuilder.create(Action.social.RecommendEntitiesByTopics).param(payload);

//   // return nextAPI({ data: [nextapi.api], type: 'n', baseAPI: 'https://yapi.aminer.cn/mock/26' });
//   const defauleQuerys = [
//     'Cloud Robotics',
//     'Adversarial Attacks',
//     'Quantum Computation',
//     'Computer Vision',
//     'Data Mining',
//   ];
//   const {
//     searchType = 'advance',
//     // topic_id,
//     // sort = 'must_reading',
//     querys = [],
//     includes = ['keywords', 'author'],
//   } = payload;
//   const search_querys = [...querys];
//   search_querys.push(defauleQuerys[Math.floor(Math.random() * defauleQuerys.length)]);
//   const query = search_querys && search_querys.map(item => `(\"${item}\")`).join(' ');

//   const esSearchCondition = {
//     include_or: {
//       conditions: [
//         {
//           search_type: 'query_string',
//           is_phrase: true,
//           fields_raw: ['title', 'title_zh', 'keywords', 'keywords_zh'],
//           to_score: true,
//           query: query || '("data mining")',
//         },
//       ],
//     },
//   };

//   const nextapi = apiBuilder
//     .create(Action.social.Recommend)
//     .param({
//       offset: 0,
//       size: 0,
//       searchType: searchType || F.searchType.all,
//       aggregation: includes,
//     })
//     .addParam({ es_search_condition: esSearchCondition })
//     .addParam(
//       {
//         agg_terms_field: {
//           author: [
//             'contact.position',
//             'contact.position_zh',
//             'tags',
//             'tags_zh',
//             'avatar',
//             'contact.affiliation',
//             'contact.affiliation_zh',
//             // 'indices.pubs',
//           ],
//         },
//       },
//       { when: includes && includes.includes('author') },
//     )
//     .schema({ publication: [] });
//   return nextAPI({ data: [nextapi.api], type: 'n' });
// }

export async function FollowTopic(payload) {
  const nextapi = apiBuilder.create(Action.social.FollowTopic).param(payload);

  return nextAPI({ data: [nextapi.api], type: 'n' });
}
export async function ListTopic(payload) {
  const nextapi = apiBuilder.create(Action.social.ListTopic).param(payload);

  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function RemoveSuggestTopics(payload) {
  const nextapi = apiBuilder.create(Action.social.RemoveSuggestTopics).param(payload);

  return nextAPI({ data: [nextapi.api], type: 'n', baseAPI: 'https://yapi.aminer.cn/mock/26' });
}

export async function GetUser(payload) {
  // const nextapi = apiBuilder.create(Action.userapi.get).param(payload);
  // return nextAPI({ data: [nextapi.api], type: 'n' });
  const nextapi = apiBuilder.create('user.GetMe', 'ME');
  return nextAPI({ data: [nextapi.api] });
}

export async function UpdateUser(payload) {
  const nextapi = apiBuilder.create(Action.userapi.update).param(payload);
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

// TODO: xenaluo -- move to collection, DEL /
export async function GetFollows(payload) {
  const person_fields = [
    'id',
    'name',
    'name_zh',
    'avatar',
    'tags',
    { indices: ['hindex', 'pubs', 'citations'] },
    { profile: ['affiliation', 'affiliation_zh', 'position', 'position_zh'] },
  ];
  const { schema } = payload;
  const nextapi = apiBuilder
    .create(Action.social.GetFollows)
    .param(payload)
    .schema({ person: schema || person_fields });
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function BindMe(params) {
  const { id } = params;
  return request(api.bind_me.replace(':id', id), {
    method: 'PUT',
  });
}

export async function UnBind() {
  return request(api.unbind, {
    method: 'PUT',
  });
}

export async function BindProfile(params) {
  return request(api.bind_profile, {
    method: 'POST',
    body: params,
  });
}

// export async function CreateTrendProject(payload) {
//   const nextapi = apiBuilder.create('trend_project.Alter').param(payload);
//   return nextAPI({ data: [nextapi.api], baseAPI: 'https://analyse-api.aminer.cn' });
// }
