/* eslint-disable camelcase */
import { request, nextAPI } from 'utils';
import { api } from 'consts/api';
import { sysconfig } from 'systems';
import { plugins } from 'acore';
import { zhCN } from 'locales';
import { apiBuilder, F, H, Action } from 'utils/next-api-builder';
import { getLocalToken } from 'utils/auth';
import searchHelper from 'helper/search';


export async function search(payload, config) {
  const {
    query, pagination, filter, sort, // required
    searchType, // optional
    ebid, expertBases, schema, // others
  } = payload;

  // Smart Assistant related
  const {
    smartQuery,
    useTranslateSearch, // old things
  } = payload;

  const { isNotAffactedByAssistant = true } = smartQuery;
  console.log('>>> search service: query is: ', payload, config);


  // const ebs = sysconfig.ExpertBases;
  // const defaultHaves = ebs && ebs.length > 0 && ebs.map(eb => eb.id);
  const allOrTobPerson = sysconfig.Auth_AllowAnonymousAccess && !getLocalToken();

  const isAdvancedMode = query && !!query.advanced;
  const queryString = query && query.query && query.query.trim();
  const advquery = searchHelper.makeAdvQuery(query.advanced);

  // TODO use override mode.

  const nextapi = apiBuilder.create(Action.search.search, 'SEARCH')
    .param({ // must have types;
      searchType: searchType || (allOrTobPerson ? F.searchType.all : F.searchType.ToBPerson), // : F.searchType.ToBPerson;,
      offset: pagination && (pagination.current - 1) * pagination.pageSize || 0,
      size: pagination && pagination.pageSize || 20,
      // haves: { eb: expertBases },
    })
    .addParam({ query: queryString }, { when: queryString && queryString !== '-' })
    .addParam(advquery, { when: isAdvancedMode && advquery != null })
    .addParam({ aggregation: F.params.default_aggregation }, { when: config.useAggregation })

    // Intelligence
    .addSchema({ person: ['tags_translated_zh'] }, { when: sysconfig.Locale === zhCN })
    .addParam(
      { switches: ['lang_zh'] },
      { when: sysconfig.Locale === zhCN && sysconfig.Search_EnableSmartSuggest && isNotAffactedByAssistant })
    .addParam(
      { switches: ['intell_expand'] },
      { when: sysconfig.Search_EnableSmartSuggest && isNotAffactedByAssistant },
    )
    // .addParam(
    //   { switches: ['intell_search_kg'] },
    //   { when: sysconfig.Search_EnableSmartSuggest && isNotAffactedByAssistant },
    // )

    // Schema
    .schema({ person: schema || F.fields.person_in_PersonList })
    .addSchema({ person: ['tags_translated_zh'] }, { when: sysconfig.Locale === zhCN })

  // H.filterByEBs(nextapi, [ebid], filters);
  H.filtersToQuery(nextapi, filter);

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
      nextapi.param({ sorts: [sortKey] })
    }
  }

  // * process plugins.
  plugins.applyPluginToAPI(nextapi, 'api_search');

  // * debug print
  // console.log('DEBUG---------------------', nextapi.api);
  // console.log('DEBUG---------------------', JSON.stringify(nextapi.api));

  // * call nextAPI search.
  return nextAPI({ data: [nextapi.api] });
}

// 上下位次点击More的action
export async function create_dm_intellwords_expand({ query, typesTotals, texts }) {
  const { abbrTotal, kghypernymTotal, kghyponymTotal } = typesTotals;
  const nextapi = apiBuilder.create(Action.dm_intellwords.expand, 'expand')
    .param({ query, kgFromabbr: true, lang_zh: sysconfig.Locale === zhCN })
    .param({
      types: [{
        type: 'abbr',
        total: abbrTotal,
        random: 0,
      }, {
        type: 'kghypernym',
        total: kghypernymTotal,
        random: 0,
      }, {
        type: 'kghyponym',
        total: kghyponymTotal,
        random: 0,
      }],
    })
    .param({
      keeps: texts || [],
    });

  return nextAPI({ data: [nextapi.api] });
}
