import { nextAPI } from 'utils';
import { sysconfig } from 'systems';
import { plugins } from 'acore';
import { zhCN } from 'locales';
import { apiBuilder, F, H, Action } from 'utils/next-api-builder';
import { getLocalToken } from 'utils/auth';

export async function search(payload, config) {
  const {
    query,
    pagination,
    filter,
    sort, // required
    schema, // others
    searchType, // optional
    ebid,
    expertBases,
    notTranslate,
    extra_ids,
  } = payload;

  // Smart Assistant related
  const {
    smartQuery,
    useTranslateSearch, // old things
  } = payload;

  const { isNotAffactedByAssistant = true } = smartQuery;

  // const ebs = sysconfig.ExpertBases;
  // const defaultHaves = ebs && ebs.length > 0 && ebs.map(eb => eb.id);
  const allOrTobPerson = sysconfig.Auth_AllowAnonymousAccess && !getLocalToken(); // localStorage.getItem(`token_${sysconfig.SYSTEM}`)

  const isAdvancedMode = query && !!query.advanced;
  const queryString = query && query.query && query.query.trim();
  // const advquery = searchHelper.makeAdvQuery(query.advanced);
  let { advanced } = query;
  advanced = advanced || {};
  const { name, org } = advanced;
  const { gender, h_index, lang, nation } = filter;
  let knowledge_graph = smartQuery.texts || [];
  knowledge_graph = knowledge_graph.map(item => item.text);

  // console.log('knowledge_graph', knowledge_graph)

  // TODO use override mode.

  const nextapi = apiBuilder
    .create('person7.SearchPersonWithDSL')
    .param({
      // must have types;
      // searchType: searchType || (allOrTobPerson ? F.searchType.all : F.searchType.ToBPerson), // : F.searchType.ToBPerson;,
      offset: (pagination && (pagination.current - 1) * pagination.pageSize) || 0,
      size: (pagination && pagination.pageSize) || 20,
      // haves: { eb: expertBases },
    })
    .addParam({ query: queryString }, { when: queryString && queryString !== '-' })
    // .addParam(advquery, { when: isAdvancedMode && advquery != null })
    .addParam({ name }, { when: name })
    .addParam({ org }, { when: org })
    .addParam({ as_h_index: h_index }, { when: h_index })
    .addParam({ as_gender: gender }, { when: gender })
    .addParam({ as_nationality: nation }, { when: nation })
    .addParam({ as_language: lang }, { when: lang })

    .addParam({ knowledge_graph }, { when: knowledge_graph && knowledge_graph.length > 0 })
    .addParam({ aggregation: F.params.default_aggregation }, { when: config.useAggregation })
    .addParam({ not_translate: notTranslate }, { when: notTranslate })
    .addParam({ extra_ids }, { when: extra_ids && extra_ids.length > 0 })

    // Intelligence
    // .addSchema({ person: ['tags_translated_zh'] }, { when: sysconfig.Locale === zhCN })
    // .addParam(
    //   { switches: ['lang_zh'] },
    //   { when: sysconfig.Locale === zhCN && sysconfig.Search_EnableSmartSuggest && isNotAffactedByAssistant })
    // .addParam(
    //   { switches: ['intell_expand'] },
    //   { when: sysconfig.Search_EnableSmartSuggest && isNotAffactedByAssistant },
    // )
    // .addParam(
    //   { switches: ['intell_search_kg'] },
    //   { when: sysconfig.Search_EnableSmartSuggest && isNotAffactedByAssistant },
    // )

    // Schema
    .schema({ person: schema || F.fields.person_in_PersonList })
    .addSchema({ person: ['tags_translated_zh'] }, { when: sysconfig.Locale === zhCN });

  // H.filterByEBs(nextapi, [ebid], filters);
  // H.filtersToQuery(nextapi, filter);

  // * Set sorts. Modify sort conditions.
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
      nextapi.param({ sort: sortKey });
    }
  }

  // * process plugins.
  plugins.applyPluginToAPI(nextapi, 'api_search');

  // * debug print
  // console.log('DEBUG---------------------', nextapi.api);
  // console.log('DEBUG---------------------', JSON.stringify(nextapi.api));

  // * call nextAPI search.
  return nextAPI({ data: [nextapi.api] });

  // baseAPI: 'http://192.168.220.1:4005'
}

export async function create_dm_intellwords_expand({ query, typesTotals, texts }) {
  console.log('create_dm_intellwords_expand', create_dm_intellwords_expand);
  const { abbrTotal, kghypernymTotal, kghyponymTotal } = typesTotals;
  const nextapi = apiBuilder
    .create(Action.dm_intellwords.expand, 'expand')
    .param({ query, kgFromabbr: true, lang_zh: sysconfig.Locale === zhCN })
    .param({
      types: [
        {
          type: 'abbr',
          total: abbrTotal,
          random: 0,
        },
        {
          type: 'kghypernym',
          total: kghypernymTotal,
          random: 0,
        },
        {
          type: 'kghyponym',
          total: kghyponymTotal,
          random: 0,
        },
      ],
    })
    .param({
      keeps: texts || [],
    });

  return nextAPI({ data: [nextapi.api] });
}

export async function new_search(payload, config) {
  const {
    query,
    pagination,
    filter,
    sort, // required
    schema, // others
    notTranslate,
    extra_ids,
    include = ['agg', 'intelli', 'topics'],
    domain,
  } = payload;

  // Smart Assistant related
  const { smartQuery } = payload;

  const queryString = query && query.query && query.query.trim();
  const domains = domain && domain.split('+');
  // const advquery = searchHelper.makeAdvQuery(query.advanced);
  let { advanced } = query;
  advanced = advanced || {};
  const { name, org } = advanced;
  const { gender, h_index, lang, nation } = filter;
  let knowledge_graph = smartQuery.texts || [];
  knowledge_graph = knowledge_graph.map(item => item.text);

  const nextapi = apiBuilder
    .create('searchapi.SearchPerson')
    .param({
      // must have types;
      // searchType: searchType || (allOrTobPerson ? F.searchType.all : F.searchType.ToBPerson), // : F.searchType.ToBPerson;,
      offset: (pagination && (pagination.current - 1) * pagination.pageSize) || 0,
      size: (pagination && pagination.pageSize) || 20,
    })
    // .addParam({ query: queryString }, { when: queryString && queryString !== '-' })
    .addParam({ query: queryString })
    // .addParam(advquery, { when: isAdvancedMode && advquery != null })
    .addParam({ include })
    .addParam({ name }, { when: name })
    .addParam({ org }, { when: org })
    .addParam({ as_h_index: h_index }, { when: h_index })
    .addParam({ as_gender: gender }, { when: gender })
    .addParam({ as_nationality: nation }, { when: nation })
    .addParam({ as_language: lang }, { when: lang })
    .addParam({ knowledge_graph }, { when: knowledge_graph && knowledge_graph.length > 0 })
    .addParam({ aggregation: F.params.default_aggregation }, { when: config.useAggregation })
    .addParam({ not_translate: notTranslate }, { when: notTranslate })
    .addParam({ extra_ids }, { when: extra_ids && extra_ids.length > 0 })
    .addParam({ domains }, { when: domains })

    // Schema
    .schema({ person: schema || F.fields.person_in_PersonList })
    .addSchema({ person: ['tags_translated_zh'] }, { when: sysconfig.Locale === zhCN });

  // * Set sorts. Modify sort conditions.
  if (sort) {
    let sortKey = sort.key;

    if (sortKey === 'name') {
      sortKey = '!name_zh_sorted';
    }

    if (sortKey && sortKey !== 'relevance') {
      nextapi.param({ sort: sortKey });
    }
  }

  // * process plugins.
  plugins.applyPluginToAPI(nextapi, 'api_search');

  // * debug print
  // console.log('DEBUG---------------------', nextapi.api);
  console.log('DEBUG---------------------', nextapi.api);

  // * call nextAPI search.
  return nextAPI({ data: [nextapi.api], type: 'n' });

  // baseAPI: 'http://192.168.220.1:4005'
}

export async function searchEbPerson(payload, config) {
  const { ebId, sort, query, pagination } = payload;
  console.log('searchEbPerson', pagination, sort);
  const name = query && query.query && query.query.trim() || '';
  const nextapi = apiBuilder.create('expertbasenext.GetPersonsFromDB', 'getPersonFromEb')
    .param({
      ebid: ebId,
      system: "aminer",
      type: "person",
      dim1: "eb",
      sort: "labels.o",
      offset: (pagination && (pagination.current - 1) * pagination.pageSize) || 0,
      size: (pagination && pagination.pageSize) || 20,
    })
    .addParam({ name }, { when: !!name })
    .schema({ person: F.fields.person_profile })
  return nextAPI({ data: [nextapi.api] });
}

// export async function searchEbPerson1(payload, config) {
//   console.log('searchEbPerson', payload);
//   const {
//     query, pagination, filter, sort, // required
//     searchType, // optional
//     ebId, expertBases, schema, haves,// others
//   } = payload;

//   const allOrTobPerson = sysconfig.Auth_AllowAnonymousAccess && !localStorage.getItem(`token_${sysconfig.SYSTEM}`);

//   const queryString = query && query.query && query.query.trim();

//   const nextapi = apiBuilder.create('search.search', 'SEARCH')
//     .param({
//       searchType: searchType || (allOrTobPerson ? F.searchType.all : F.searchType.ToBPerson), // : F.searchType.ToBPerson;,
//       offset: pagination && (pagination.current - 1) * pagination.pageSize || 0,
//       size: pagination && pagination.pageSize || 20,
//       aggregation: F.params.default_aggregation
//     })
//     .addParam({ query: queryString }, { when: queryString && queryString !== '-' })
//     .addSchema({ person: ['tags_translated_zh'] }, { when: sysconfig.Locale === zhCN })
//     .addParam({ filters: { dims: { eb: [ebId] } } }, { when: !!ebId })
//     .schema({ person: schema || F.fields.person_in_PersonList })
//     .addSchema({ person: ['tags_translated_zh'] }, { when: sysconfig.Locale === zhCN })

//   H.filtersToQuery(nextapi, filter);

//   if (sort) {
//     let sortKey = sort.key;

//     if (sortKey === 'name') {
//       sortKey = '!name_zh_sorted';
//     }

//     if (sortKey && sortKey !== 'relevance') {
//       nextapi.param({ sorts: [sortKey] })
//     }
//   } else {
//     nextapi.param({ sorts: ['h_index'] })
//   }

//   // plugins.applyPluginToAPI(nextapi, 'api_search');

//   return nextAPI({ data: [nextapi.api] });
// }
