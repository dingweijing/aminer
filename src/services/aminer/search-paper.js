/* eslint-disable camelcase */
import { request, nextAPI } from 'utils';
// import { api } from 'consts/api';
import { sysconfig } from 'systems';
import { plugins } from 'acore';
import { zhCN } from 'locales';
import { baseURL } from 'consts/api';
import { apiBuilder, F, H, Action } from 'utils/next-api-builder';
import searchHelper from 'helper/search';
import strings from 'utils/strings';

const api = {
  get_paper_comments: `${baseURL}/comment/:type/:id/offset/:offset/size/:size`,
  // paper collect or like
  getPubLiked: `${baseURL}/social/pub/likded/offset/:offset/size/:size`,
}
const nodeApi = 'https://nodeapi.aminer.cn/api/click/:topicname '

export async function search(payload, config) {
  const {
    query, pagination, filter, sort, // required
    searchType, // optional
    schema, // others
    switches,
    esSearchCondition,
    notTranslate,
    yearInterval,
    aggregation,
    topicIds,
    searchTab,
    mustReadSortKey,
    searchScope,
    haveDomains
  } = payload;

  // console.log('// >>> search service: query is: ', payload, config);
  const isAdvancedMode = query && !!query.advanced;
  const queryString = query && query.query && query.query.trim();
  const advquery = searchHelper.makeAdvQuery(query.advanced);

  // const nextapi = apiBuilder.create(Action.search.search, 'SEARCH')
  // const nextapi = apiBuilder.create(Action.search.SearchPubs, 'SEARCH')
  const nextapi = apiBuilder.create(Action.search.SearchPubsCommon, 'SEARCH')
    .param({ // must have types;
      offset: pagination && (pagination.current - 1) * pagination.pageSize || 0,
      size: pagination && pagination.pageSize || 20,
      searchType: searchType || F.searchType.all,
      switches,
      // aggregation: aggregation || ["year","author_year","venue", "org"],
      aggregation: aggregation || ["year", "author_year"],
    })
    // .addParam({ query: queryString }, { when: queryString && queryString !== '-' })
    .addParam({ query: queryString })
    .addParam(advquery, { when: isAdvancedMode && advquery != null })
    .addParam({ es_search_condition: esSearchCondition }, { when: esSearchCondition && Object.keys(esSearchCondition).length })
    .addParam({ year_interval: yearInterval }, { when: yearInterval })
    .addParam({ not_translate: notTranslate }, { when: notTranslate })
    .addParam({ search_tab: searchTab }, { when: searchTab })
    .addParam({ topic_sort: mustReadSortKey }, { when: mustReadSortKey })
    .addParam({ topic_ids: topicIds }, { when: topicIds && topicIds.length > 0 })
    .addParam({ search_strategy: 'beyond_title' }, { when: searchScope === 'title' })
    .addParam({ haves: ["domains"] }, { when: haveDomains })
    .schema({ publication: schema || F.fields.paper.forSearch })

  H.filtersToQuery(nextapi, filter);

  if (sort) {
    let sortKey = sort.key;
    // 没有query，不能按relevance排序，改成默认的name.
    // if (!config.hasQuery && sortKey === 'relevance') {
    //   sortKey = 'name'
    // }

    if (sortKey === 'name') {
      sortKey = '!name_zh_sorted';
    }

    if (sortKey && sortKey !== 'relevance') {
      nextapi.param({ sorts: [sortKey] })
    }
  }

  // * debug print
  // console.log('DEBUG---------------------', nextapi.api);
  // console.log('DEBUG---------------------', JSON.stringify(nextapi.api));

  // * call nextAPI search.
  // console.log('// search paper nextapi.api :', nextapi.api);
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function getAggregation(payload) {
  const {
    query, aggregation, switches, yearInterval, esSearchCondition, searchType,
    schema, // others
    notTranslate,
    topicIds,
    mustReadSortKey,
    searchTab,
    sort,
  } = payload;
  const queryString = query && query.query && query.query.trim();
  const nextapi = apiBuilder.create(Action.search.SearchPubsCommon, 'SEARCH')
    .param({ // must have types;
      offset: 0,
      size: 0,
      switches,
      aggregation: aggregation || ["year","author_year"],
      searchType: searchType || F.searchType.all,
      year_interval: yearInterval,
    })
    .addParam({ query: queryString }, { when: queryString && queryString !== '-' })
    .addParam({ es_search_condition: esSearchCondition }, { when: Object.keys(esSearchCondition).length })
    .addParam({ not_translate: notTranslate }, { when: notTranslate })
    .addParam({ search_tab: searchTab }, { when: searchTab })
    .addParam({ topic_sort: mustReadSortKey }, { when: mustReadSortKey })
    .addParam({ topic_ids: topicIds }, { when: topicIds && topicIds.length > 0 })
    .schema({ publication: schema || F.fields.paper.forSearch })
  
  if (sort) {
    let sortKey = sort.key;

    if (sortKey === 'name') {
      sortKey = '!name_zh_sorted';
    }

    if (sortKey && sortKey !== 'relevance') {
      nextapi.param({ sorts: [sortKey] })
    }
  }

  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function getSearchFilter(payload) {
  const {
    query, 
    aggregation, 
    switches, 
    yearInterval, 
    esSearchCondition, 
    searchType,
    schema, // others
    notTranslate,
    topicIds,
    searchTab,
    mustReadSortKey,
    sort,
  } = payload;

  const isAdvancedMode = query && !!query.advanced;
  const advquery = searchHelper.makeAdvQuery(query.advanced);

  const queryString = query && query.query && query.query.trim();
  const nextapi = apiBuilder.create(Action.search.SearchPubsCommon, 'SEARCH')
    .param({ // must have types;
      offset: 0,
      size: 0,
      switches,
      // aggregation: aggregation || ['year', 'author_year', 'venue', 'org'],
      // 先隐藏机构 filter
      aggregation: aggregation || ['venue', 'keywords'],
      searchType: searchType || F.searchType.all,
    })
    .addParam({ query: queryString }, { when: queryString && queryString !== '-' })
    .addParam(advquery, { when: isAdvancedMode && advquery != null })
    .addParam({ es_search_condition: esSearchCondition }, { when: esSearchCondition && Object.keys(esSearchCondition).length })
    .addParam({ year_interval: yearInterval }, { when: yearInterval })
    .addParam({ not_translate: notTranslate }, { when: notTranslate })
    .addParam({ search_tab: searchTab }, { when: searchTab })
    .addParam({ topic_sort: mustReadSortKey }, { when: mustReadSortKey })
    .addParam({ topic_ids: topicIds }, { when: topicIds && topicIds.length > 0 })
    .schema({ publication: schema || F.fields.paper.forSearch })

    if (sort) {
      let sortKey = sort.key;
      if (sortKey === 'name') {
        sortKey = '!name_zh_sorted';
      }
  
      if (sortKey && sortKey !== 'relevance') {
        nextapi.param({ sorts: [sortKey] })
      }
    }
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function getTopic(payload) {
  const { query } = payload;
  const queryString = query && query.query && query.query.trim();
  const nextapi = apiBuilder.create(Action.topic.SearchTopic, 'SearchTopic')
    .param({
      query: queryString,
      which_pubs: 'no',
    })
    // .addParam({ query: queryString }, { when: queryString && queryString !== '-' })
    // .addParam({ es_search_condition: esSearchCondition }, { when: Object.keys(esSearchCondition).length })
    // .addParam({ not_translate: notTranslate }, { when: notTranslate })
    .schema({ pub_topic: F.fields.topic.full })

  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function updateTopic(payload) {
  const { name, name_zh, def, def_zh, alias, id } = payload;
  const nextapi = apiBuilder.create(Action.topic.UpdateTopicInfo)
  .param({ id })
  .addParam({ name }, { when: name })
  .addParam({ name_zh }, { when: name_zh || name_zh === '' })
  .addParam({ def }, { when: def || def === '' })
  .addParam({ def_zh }, { when: def_zh || def_zh === '' })
  .addParam({ alias }, { when: alias })
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function CreatePubTopic(payload) {
  const { name, name_zh, def, def_zh, alias } = payload;
  const nextapi = apiBuilder.create(Action.topic.CreatePubTopic)
  .addParam({ name }, { when: name })
  .addParam({ name_zh }, { when: name_zh || name_zh === '' })
  .addParam({ def }, { when: def || def === '' })
  .addParam({ def_zh }, { when: def_zh || def_zh === '' })
  .addParam({ alias }, { when: alias })
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function UpdateMustReadingPub(payload) {
  const { img, year, reason, pid, topicId, order, selected, title, tmp_id, method } = payload;
  const nextapi = apiBuilder.create(Action.topic.UpdateMustReadingPub)
  .param({ topic_id: topicId })
  .addParam({ pid }, { when: pid })
  .addParam({ tmp_id }, { when: tmp_id })
  .addParam({ title }, { when: title })
  .addParam({ img }, { when: img || img === '' })
  .addParam({ year }, { when: year })
  .addParam({ reason }, { when: reason || reason === '' })
  .addParam({ order }, { when: order })
  .addParam({ method }, { when: method || method === '' })
  .addParam({ selected }, { when: selected === true || selected === false })
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function DeleteMustReadingPub(payload) {
  const { topicId, tmpId, pid } = payload;
  const nextapi = apiBuilder.create(Action.topic.DeleteMustReadingPub)
  .param({ topic_id: topicId })
  .addParam({ tmp_id: tmpId }, { when: tmpId })
  .addParam({ pid }, { when: pid })
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function searchPaperById(params) {
  const { id, schema } = params;
  const nextapi = apiBuilder.create(Action.search.search, 'GetPaperById')
    .param({ // must have types;
      ids: [id]
      // switches: ['master'] 读取mark出错
    })
    .schema({ publication: schema || F.fields.paper.full })
  return nextAPI({ data: [nextapi.api] });
}

export async function getPaperComments(params) {
  const { id, offset = 0, size = 20, type } = params;
  return request(api.get_paper_comments.replace(':type', type).replace(':id', id).replace(':offset', offset).replace(':size', size));
}

export async function getPaperCollected(params) {
  const { offset = 0, size = 20 } = params;
  return request(api.getPubLiked.replace(':offset', offset).replace(':size', size));
}

export async function collectPaper(params) {
  return request(api.getPubLiked.replace(':offset', offset).replace(':size', size));
}

export async function Subscribe(payload) {
  const { email, keysords } = payload;
  const nextapi = apiBuilder.create(Action.topic.GetSubscriberEmail)
  .addParam({ email }, { when: email })
  .addParam({ keysords }, { when: keysords })
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function like(params) {
  // id, op: cancel取消
  const nextapi = apiBuilder.create(Action.topic.Like, 'Like').param(params)
  return nextAPI({ data: [nextapi.api] });
}
export async function tread(params) {
  // id, op: cancel取消
  const nextapi = apiBuilder.create(Action.topic.Tread, 'Tread').param(params)
  return nextAPI({ data: [nextapi.api] });
}

export async function tmpLike(params) {
  // id, op: cancel取消
  const nextapi = apiBuilder.create(Action.topic.TmpLike, 'Like').param(params)
  return nextAPI({ data: [nextapi.api] });
}
export async function tmpTread(params) {
  // id, op: cancel取消
  const nextapi = apiBuilder.create(Action.topic.TmpTread, 'Tread').param(params)
  return nextAPI({ data: [nextapi.api] });
}

export async function listTopic() {
  const nextapi = apiBuilder.create(Action.topic.ListTopicKeywords)
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function updateTopicEnable(payload) {
  const { openStatus, keywords } = payload;
  const nextapi = apiBuilder.create(Action.topic.ListTopicKeywords)
  .param({ keywords })
  .addParam({ tp: openStatus ? 1 : 2 }, { when: openStatus === false || openStatus === true })

  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function suggestTopic(params) { // 提议topic
  const { topicName } = params;
  const nextapi = apiBuilder.create(Action.topic.ProposalTopic)
  .addParam({ topic: topicName })
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

export async function getPaperRelatedWork(payload) {
  const { ids, query } = payload;
  const nextapi = apiBuilder.create(Action.topic.GetOutLine)
  .param({ ids })
  .addParam({ query }, { when: query })
  return nextAPI({ data: [nextapi.api], type: 'n' });
}

// export async function AddPaperSearch(payload) {
//   const {
//     page, size = 20, texts,
//     term, name, org, filter, id, ids
//   } = payload;

//   const schema = ['id', 'year', 'title', 'title_zh', 'abstract', 'abstract_zh', 'authors', 'authors._id', 'authors.name', 'authors.name_zh', 'num_citation', 'num_viewed', 'num_starred', 'num_upvoted', 'is_starring', 'is_upvoted', 'is_downvoted', 'venue.info.name', 'venue.volume', 'venue.info.name_zh', 'venue.info.publisher', 'venue.issue', 'pages.start', 'pages.end', 'lang', 'pdf', 'doi', 'urls', 'flags']


//   // const isAdvancedMode = query && !!query.advanced;
//   // const queryString = query && query.query && query.query.trim();
//   // const advquery = searchHelper.makeAdvQuery(query.advanced);
//   const params = Object.keys(texts).filter(item => !!texts[item]).map(item => {
//     return { source: item, text: texts[item] }
//   })

//   const nextapi = apiBuilder.create(Action.search.search, 'SEARCH')
//     .param({ // must have types;
//       offset: page * size,
//       size,
//       searchType: 'advance',
//       advquery: {
//         texts: params
//       }
//     })
//     .addParam({
//       filters: {
//         must_not: {
//           match_phrase: {
//             'authors.id': id
//           }
//         }
//       }
//     }, { when: filter })
//     .addParam({ ids }, { when: ids && ids.length > 0 })
//     .schema({ publication: schema })

//   // * call nextAPI search.
//   return nextAPI({ data: [nextapi.api] });
// }

export async function loadingTimer(params) {
  const { time } = params;
  return new Promise(((resolve, reject) => {
    setTimeout(resolve, time, 'timer');
  }));
}
