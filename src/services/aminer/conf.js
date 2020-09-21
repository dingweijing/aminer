import { request, nextAPI } from 'utils';
import moment from 'moment';
import { baseURL } from 'consts/api';
import { apiBuilder, F, Action } from 'utils/next-api-builder';

const nodeApi = 'https://nodeapi.aminer.cn/api/:type/:id';
const xu = 'http://192.168.11.84:4005';

export async function RunCache(params) {
  // "conf_id": "5ed4d6e792c7f9be21693a3c",
  //           "op": [
  //               4,5,6
  //           ]
  const nextapi = apiBuilder.create(Action.conf.RunCache, 'RunCache').param(params);
  return nextAPI({ data: [nextapi.api] });
}

export async function setSysTrack(params) {
  const { data } = params;
  const nextapi = apiBuilder.create(Action.tracking.Track, 'Track').param({ data: [params] });
  return nextAPI({ data: [nextapi.api] });
}

export async function getOldConfView(params) {
  const { track } = params;
  return request(`${baseURL}/pschedule/conference/${track}/schedule`, {
    method: 'GEt',
  });
}

export async function setOrGetClickView(params) {
  const { type, id } = params;
  return request(nodeApi.replace(':type', type).replace(':id', id));
}

export async function getConfList(params) {
  // params offset size short_name year
  // const nextapi = apiBuilder
  //   .create(Action.confs.ListConfs)
  //   .param(params)
  //   .schema(confSchema);
  const nextapi = apiBuilder.create(Action.conf.List).param(params);
  return nextAPI({ data: [nextapi.api] });
}

export async function Get(params) {
  // params id
  // const nextapi = apiBuilder
  //   .create(Action.confs.ListConfs)
  //   .param(params)
  //   .schema(confSchema);
  const nextapi = apiBuilder.create(Action.conf.Get).param(params);
  return nextAPI({ data: [nextapi.api] });
}

export async function delConfById(params) {
  // params id
  // const nextapi = apiBuilder
  //   .create(Action.confs.ListConfs)
  //   .param(params)
  //   .schema(confSchema);
  const nextapi = apiBuilder.create(Action.conf.Delete).param(params);
  return nextAPI({ data: [nextapi.api] });
}

// 获取sechedule 不包括pubs
export async function getSchedule(params) {
  // conf_id, keywords, begin_time, end_time,aids
  const payload = formatDate(params);
  const nextapi = apiBuilder
    .create(Action.conf.GetSchedule)
    .param(payload)
    .schema({});
  return nextAPI({ data: [nextapi.api] });
}

const scheduleSchema = [
  'title',
  'type',
  'date',
  'begin_time',
  'end_time',
  'chair',
  'place',
  'day',
  'time_of_day',
];
// AlterConfs
export async function AlterConfs(payload) {
  const params = { opts: [payload] };
  const nextapi = apiBuilder.create(Action.confs.AlterConfs).param(params);
  return nextAPI({ data: [nextapi.api] });
  // return GetScheduleData;
}

export async function CreateConf(payload) {
  // const params = { opts: [payload] };
  const nextapi = apiBuilder.create(Action.conf.Create).param(payload);
  return nextAPI({ data: [nextapi.api] });
}

export async function UpdateConf(payload) {
  // const params = { opts: [payload] };
  const nextapi = apiBuilder.create(Action.conf.Update).param(payload);
  return nextAPI({ data: [nextapi.api] });
}

export async function GetTimeTable(payload) {
  // id, timezone = ‘asia/shanghai
  const { id } = payload;
  // const nextapi = apiBuilder.create(Action.confs.GetTimeTable).param(payload);
  const nextapi = apiBuilder
    .create(Action.conf.GetTimeTable)
    // aisa/shanghai
    .param({ id, timezone: 'utc' });
  return nextAPI({ data: [nextapi.api] });
}

export async function GetLikePapers(payload) {
  // conf_track_id
  const nextapi = apiBuilder.create(Action.confs.UserLikes).param(payload);
  return nextAPI({ data: [nextapi.api] });
}

export async function setLikePaper(payload) {
  // id， op, cancel取消，不传或者其它值是点赞
  const nextapi = apiBuilder.create(Action.conf.Like).param(payload);
  return nextAPI({ data: [nextapi.api] });
}

export async function GetArticlesByConfID(payload) {
  const { id } = payload;
  const nextapi = apiBuilder
    .create(Action.conference.GetArticlesByConfID, 'GetArticlesByConfID')
    .param({ id });

  return nextAPI({ data: [nextapi.api] });
}

export async function GetUsrVoted(payload) {
  const { pid, index } = payload;
  const nextapi = apiBuilder.create(Action.confs.GetUsrVoted, 'GetUsrVoted').param({ pid, index });
  return nextAPI({ data: [nextapi.api] });
}

export async function GetPubsLikes(payload) {
  const { ids } = payload;
  const nextapi = apiBuilder.create(Action.confs.GetPubsLikes, 'GetPubsLikes').param({ ids });
  return nextAPI({ data: [nextapi.api] });
}

export async function GetMostViewPubs(payload) {
  // conf_id, offset, size
  const nextapi = apiBuilder.create(Action.conf.GetMostViewPubs, 'GetMostViewPubs').param(payload);
  return nextAPI({ data: [nextapi.api] });
}

export async function ListConfPubs(payload) {
  // const { conf_id, offset, size } = payload;
  const nextapi = apiBuilder.create(Action.confs.ListConfPubs, 'ListConfPubs').param(payload);
  return nextAPI({ data: [nextapi.api] });
}

export async function GetMostLikePubs(payload) {
  // const { conf_id, offset, size } = payload;
  const nextapi = apiBuilder.create(Action.conf.GetMostLikePubs, 'GetMostViewPubs').param(payload);
  return nextAPI({ data: [nextapi.api] });
}

export async function AlterSchedules(payload) {
  const nextapi = apiBuilder
    .create(Action.confs.AlterSchedules, 'AlterSchedules')
    .param({ opts: [payload] });
  return nextAPI({ data: [nextapi.api] });
}

export async function CreateSchedule(payload) {
  const nextapi = apiBuilder.create(Action.conf.CreateSchedule, 'CreateSchedule').param(payload);
  return nextAPI({ data: [nextapi.api] });
}
// export async function ListSchedule(payload) {
//   const nextapi = apiBuilder.create(Action.conf.ListSchedule, 'ListSchedule').param(payload);
//   return nextAPI({ data: [nextapi.api] });
// }
export async function DeleteSchedule(payload) {
  const nextapi = apiBuilder.create(Action.conf.DeleteSchedule, 'DeleteSchedule').param(payload);
  return nextAPI({ data: [nextapi.api] });
}
export async function AddSchedulePubs(payload) {
  const nextapi = apiBuilder.create(Action.conf.AddSchedulePubs, 'AddSchedulePubs').param(payload);
  return nextAPI({ data: [nextapi.api] });
}

export async function GetKeywords(payload) {
  // id, offset, size
  // const nextapi = apiBuilder.create(Action.confs.GetKeywords, 'GetKeywords').param(payload);
  const nextapi = apiBuilder.create(Action.conf.GetKeywords, 'GetKeywords').param(payload);
  return nextAPI({ data: [nextapi.api] });
}

export async function GetPubsByKeywords(payload) {
  // conf_id keywrods
  const nextapi = apiBuilder
    .create(Action.confs.GetPubsByKeywords, 'GetPubsByKeywords')
    .param(payload);
  return nextAPI({ data: [nextapi.api] });
}

export async function GetRecommendPubs(payload) {
  // const nextapi = apiBuilder
  //   .create(Action.confs.GetRecommendPubs, 'GetRecommendPubs')
  //   .param(payload)
  //   .schema({ pubs: [] });
  const nextapi = apiBuilder
    .create(Action.conf.GetRecommend, 'GetRecommend')
    .param(payload)
    .schema({});
  return nextAPI({ data: [nextapi.api] });
}

export async function GetUserLikeKeywords(payload) {
  // id 会议的
  const nextapi = apiBuilder
    .create(Action.confs.GetUserLikeKeywords, 'GetUserLikeKeywords')
    .param(payload);
  return nextAPI({ data: [nextapi.api] });
}

export async function GetUserLikePubsByKeywords(payload) {
  // id 会议的, keywords<string>
  const nextapi = apiBuilder
    .create(Action.confs.GetUserLikePubsByKeywords, 'GetUserLikePubsByKeywords')
    .param(payload);
  return nextAPI({ data: [nextapi.api] });
}

export async function GetUserLikePubs(payload) {
  // conf_id offset size
  const nextapi = apiBuilder.create(Action.conf.GetUserLikePubs, 'GetUserLikePubs').param(payload);
  return nextAPI({ data: [nextapi.api] });
}

// export async function GetFilterPubs(payload) {
//   // conf_id 会议的, tp, keywords
//   const nextapi = apiBuilder.create(Action.confs.GetFilterPubs, 'GetFilterPubs').param(payload);
//   return nextAPI({ data: [nextapi.api] });
// }

export async function GetAuthorsPubs(payload) {
  // conf_id 会议的
  const nextapi = apiBuilder.create(Action.confs.GetAuthorsPubs, 'GetAuthorsPubs').param(payload);
  return nextAPI({ data: [nextapi.api] });
}

export async function UpdateBestPaper(payload) {
  const { conf_id, pids } = payload;
  const nextapi = apiBuilder
    .create(Action.conf.UpdateBestPaper, 'UpdateBestPaper')
    .param({
      conf_id,
      pids,
      best_paper: true,
    })
    .schema({ publication: [] });
  return nextAPI({ data: [nextapi.api] });
}

// TODO: 4月10号
export async function SearchSchedule(payload) {
  // ids: []， filters:{date:string,time_of_day:string, keywords:string,aid:string}
  const nextapi = apiBuilder
    .create(Action.confs.SearchSchedule, 'SearchSchedule')
    .param(payload)
    // .addParam({ switches: ['pub'] })
    .schema(searchScheduleSchema);
  return nextAPI({ data: [nextapi.api] });
}

function formatDate(payload) {
  const params = payload;
  const dict = { Afternoon: 12, Morning: 0 };
  const begin_time = moment(payload.date);
  const end_time = moment(payload.date);
  if (payload.time_of_day) {
    begin_time.add(dict[payload.time_of_day], 'hours');
    end_time.add(dict[payload.time_of_day] + 12, 'hours');
  } else {
    end_time.add(24, 'hours');
  }
  if (payload.date) {
    params.begin_time = begin_time;
    params.end_time = end_time;
  }
  return params;
}
export async function SearchPubs(payload) {
  // conf_id, author_id, keywords, begin_time, end_time, offset, size, sort
  // const nextapi = apiBuilder
  //   .create(Action.confs.SearchPubs, 'SearchPubs')
  //   .param(payload)
  //   .schema(searchScheduleSchema);
  // const dict = { Afternoon: 12, Morning: 0 };
  // const params = payload;
  // const begin_time = moment(payload.date);
  // const end_time = moment(payload.date);
  // if (payload.time_of_day) {
  //   begin_time.add(dict[payload.time_of_day], 'hours');
  //   end_time.add(dict[payload.time_of_day] + 12, 'hours');
  // } else {
  //   end_time.add(24, 'hours');
  // }
  // if (payload.date) {
  //   params.begin_time = begin_time;
  //   params.end_time = end_time;
  // }
  const params = formatDate(payload);
  const nextapi = apiBuilder
    .create(Action.conf.GetPubs, 'GetPubs')
    .param(params)
    // .addParam({ is_cache: false })
    .schema(searchScheduleSchema);
  return nextAPI({ data: [nextapi.api] });
}

export async function SearchAuthors(payload) {
  // ids: []， filters:{date:string,time_of_day:string, keywords:string,aid:string}
  // ids: [confInfo.id], offset: 0, size: max, shortSchema: true
  // const { shortSchema = false } = payload;
  // const nextapi = apiBuilder
  //   .create(Action.confs.SearchAuthors, 'SearchAuthors')
  //   .param(payload)
  //   .schema(shortSchema ? leftAuthorsSchema : authorsSchema);
  const { shortSchema = false } = payload;
  // conf_id, offset, size, begin_date, end_date, keywords
  // "parameters": {
  //   "is_cache":false
  //   }
  const params = formatDate(payload);
  const nextapi = apiBuilder
    .create(Action.conf.GetAuthors, 'GetAuthors')
    .param(params)
    .addParam({ is_cache: false }, { when: shortSchema })
    .schema(shortSchema ? leftAuthorsSchema : authorsSchema);
  return nextAPI({ data: [nextapi.api] });
}

export async function GetPubsByIds(payload) {
  // ids: []， filters:{date:string,time_of_day:string, keywords:string,aid:string}
  const nextapi = apiBuilder
    .create(Action.conf.GetPubsByIds, 'GetPubsByIds')
    .param(payload)
    .schema(searchScheduleSchema);
  return nextAPI({ data: [nextapi.api] });
}

export async function AddConfPubs(payload) {
  // conf_id<string>, pids<array>
  const nextapi = apiBuilder.create(Action.conf.AddConfPubs, 'AddConfPubs').param(payload);
  return nextAPI({ data: [nextapi.api] });
}
export async function DelConfPubs(payload) {
  // conf_id<string>, pids<array>
  const nextapi = apiBuilder.create(Action.conf.DelConfPubs, 'AddConfPubs').param(payload);
  return nextAPI({ data: [nextapi.api] });
}

export async function searchInConf(payload) {
  const { confId, query, category, size, offset } = payload;
  const param = {
    offset,
    size,
    search_tab: category,
    es_search_condition: {
      include_and: {
        conditions: [
          // {
          //   search_type: 'query_string',
          //   fields: ['lbs'],
          //   to_score: false,
          //   keep_symbol: true,
          //   query: `\\:${confId}`,
          // },
          // {
          //   search_type: 'query_string',
          //   fields: ['authors.name', 'title', 'keywords'],
          //   to_score: false,
          //   query: `\"${query}\"`,
          // },
          {
            search_type: 'term',
            field: 'lbs2',
            to_score: false,
            keep_symbol: true,
            query: confId,
          },
          {
            search_type: 'query_string',
            fields_raw: ['jconfs'],
            to_score: true,
            query: `\"${query}\"`,
          },
        ],
      },
    },
  };

  const nextapi = apiBuilder
    .create(Action.conf.Search, 'Search')
    .param(param)
    .schema({ publication: searchPubSchema });
  return nextAPI({ data: [nextapi.api] });
}

export async function GetPubsBySId(payload) {
  // ids: []， filters:{date:string,time_of_day:string, keywords:string,aid:string}

  const nextapi = apiBuilder
    .create(Action.conf.GetPubsBySID, 'GetPubsBySId')
    .param(payload)
    .schema(searchScheduleSchema);
  return nextAPI({ data: [nextapi.api] });
}
const searchPubSchema = [
  'id',
  'year',
  'title',
  'title_zh',
  'abstract',
  'abstract_zh',
  'authors',
  'authors._id',
  'authors.name',
  'keywords',
  'authors.name_zh',
  'num_citation',
  'num_viewed',
  'num_starred',
  'num_upvoted',
  'is_starring',
  'is_upvoted',
  'is_downvoted',
  'venue.info.name',
  'venue.volume',
  'venue.info.name_zh',
  'venue.info.publisher',
  'venue.issue',
  'pages.start',
  'pages.end',
  'lang',
  'pdf',
  'ppt',
  'doi',
  'urls',
  'flags',
  'resources',
];

const searchScheduleSchema = {
  // schedule: [],
  publication: [
    'id',
    'year',
    'title',
    'title_zh',
    'abstract',
    'abstract_zh',
    'authors',
    'authors._id',
    'authors.name',
    'keywords',
    'authors.name_zh',
    'num_citation',
    'num_viewed',
    'lang',
    'pdf',
    'ppt',
    'doi',
    'urls',
    'resources',
    'urls',
  ],
};
const pubsSchema = {
  pubs: [],
};
const authorsSchema = {
  authors: [
    ...F.fields.person_in_PersonList,
    'person.indices.activity',
    'person.indices.citations',
    'person.indices.citation',
    'person.indices.diversity',
    'person.indices.gindex',
    'person.indices.hindex',
    'person.indices.newStar',
    'person.indices.pubs',
    'person.indices.numpubs',
    'contact.position',
    'contact.position_zh',
    'contact.affiliation',
    'contact.affiliation_zh',
    'contact.org',
    'contact.org_zh',
  ],
};
const leftAuthorsSchema = {
  authors: ['id', 'name', 'name_zh'],
};
// export async function AddSchedulePubs(payload) {
//   const nextapi = apiBuilder.create('confs.AddSchedulePubs', 'addSchePubs').param(payload);
//   return nextAPI({ data: [nextapi.api] });
// }

const confSchema = {
  confs: [
    'short_name',
    'full_name',
    'order',
    'address',
    'begin_date',
    'end_date',
    'introduce',
    'url',
    'year',
    'is_public',
    'enable_xiaomai',
    'enable_mrt',
    'enable_knowledge_atlas',
    'enable_relation',
    'enable_report',
    'enable_statistics',
    'paper_count',
    'logo',
    'background',
    'relation_id',
    'related_conf',
  ],
  // logo：”1“, 必须有图片，
  // TODO: logo background同时传
};
