/* eslint-disable camelcase */
import { request, nextAPI } from 'utils';
import { sysconfig } from 'systems';
import { plugins } from 'acore';
import { zhCN } from 'locales';
import { baseURL } from 'consts/api';
import { getLangLabel } from 'helper';
import { apiBuilder, F, H, Action } from 'utils/next-api-builder';

export async function ListCategory(payload) {
  const { offset, includes } = payload;
  const nextapi = apiBuilder
    .create(Action.social.ListCategory)
    .param({ includes })
    .addParam({ offset: offset || 0 });

  return nextAPI({ data: [nextapi.api], type: 'n' });
}

// export async function Follow(payload) {
//   const nextapi = apiBuilder.create(Action.social.Follow).param(payload);
//   return nextAPI({ data: [nextapi.api], type: 'n' });
// }

export async function Follow(payload) {
  const { cat_id, ...params } = payload;
  const nextapi = apiBuilder
    .create(Action.social.Follow)
    .param(params)
    .addParam({ cat_id }, { when: !!cat_id });
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function IsFollow(payload) {
  const { cat_id, ...params } = payload;
  const nextapi = apiBuilder.create(Action.social.IsFollow).param(params);
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function GetFollows(payload) {
  const person_fields = [
    'id',
    'name',
    'name_zh',
    'avatar',
    'tags',
    'tags_translated_zh',
    { indices: ['hindex', 'pubs', 'citations'] },
    { profile: ['affiliation', 'affiliation_zh', 'position', 'position_zh'] },
  ];
  const { schema, ...params } = payload;
  const nextapi = apiBuilder
    .create(Action.social.GetFollows)
    .param(params)
    .schema(schema || { person: person_fields, publication: F.fields.paper.forSearch });
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function GetFollowsByCategory(payload) {
  const { schema, ...params } = payload;
  const nextapi = apiBuilder
    .create(Action.social.GetFollowsByCategory)
    .param(params)
    .schema(schema || { publication: [...F.fields.paper.forSearch, 'comments'] });
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function GetCategoryByFollowIDs(payload) {
  const nextapi = apiBuilder.create(Action.social.GetCategoryByFollowIDs).param(payload);
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function UpdateComments(payload) {
  const nextapi = apiBuilder.create(Action.social.UpdateComments).param(payload);
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

// export async function RemoveSuggestTopics(payload) {
//   const nextapi = apiBuilder.create(Action.social.RemoveSuggestTopics).param(payload);

//   return nextAPI({ data: [nextapi.api], type: 'n', baseAPI: 'https://yapi.aminer.cn/mock/26' });
// }

// export async function UnBind() {
//   return request(api.unbind, {
//     method: 'PUT',
//   });
// }

export async function CreateCategory(payload) {
  const { cat_id, ...params } = payload;
  const nextapi = apiBuilder.create(Action.social.CreateCategory).param(params);
  return nextAPI({ data: [nextapi.api], type: 'n' });
}
export async function UpdateCategory(payload) {
  const { cat_id, ...params } = payload;
  const nextapi = apiBuilder.create(Action.social.UpdateCategory).param(params);
  return nextAPI({ data: [nextapi.api], type: 'n' });
}
export async function RemoveCategory(payload) {
  const { cat_id, ...params } = payload;
  const nextapi = apiBuilder.create(Action.social.RemoveCategory).param(params);
  return nextAPI({ data: [nextapi.api], type: 'n' });
}
