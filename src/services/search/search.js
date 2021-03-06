/* eslint-disable camelcase */
import { request, nextAPI } from 'utils';
import { api } from 'consts/api';
import { sysconfig } from 'systems';
import { plugins } from 'acore';
import { zhCN } from 'locales';
import { apiBuilder, F, H, Action } from 'utils/next-api-builder';
import strings from 'utils/strings';
import { getLocalToken } from 'utils/auth';

// TODO v1.0 search service, replace with new version;

export function getBools(filters) {
  const filterByGlobal = filters && filters.eb && filters.eb.id === 'aminer';
  const filterBySomeEB = filters && filters.eb && filters.eb.id !== 'aminer';
  const filterByDefaultGlobal = (!filters || !filters.eb) && sysconfig.DEFAULT_EXPERT_BASE === 'aminer';
  const filterByDefaultSomeEB = (!filters || !filters.eb) && sysconfig.DEFAULT_EXPERT_BASE !== 'aminer';

  const searchInGlobalExperts = filterByGlobal || filterByDefaultGlobal;
  const searchInSomeExpertBase = filterBySomeEB || filterByDefaultSomeEB;
  return { searchInGlobalExperts, searchInSomeExpertBase };
}

/* 目前搜索的各种坑
 全局搜索：
 智库高级搜索：
 /api/search/roster/59..08/experts/advanced?name=&offset=0&org=&size=20&sort=n_citation&term=jie
 sort = relevance, h_index, a_index, activity, diversity, rising_star, n_citation, n_pubs,
 智库无缓存查询：
 */
export async function searchPerson(params) {
  const { query, offset, size, filters, sort, assistantDataMeta, typesTotals, searchType } = params;
  const { expertBaseId, expertBases } = params;
  const { useTranslateSearch, assistantQuery, isNotAffactedByAssistant, isSearchAbbr } = params;
  const { schema } = params;

  // some conditions
  const { searchInGlobalExperts, searchInSomeExpertBase } = getBools(filters);

  // BRANCH: list in EB.
  // if query is null, and eb is not aminer, use expertbase list api.
  if (searchInSomeExpertBase && !query) {
    const newExpertBase = new Set(expertBases);
    if (sysconfig.USE_NEXT_EXPERT_BASE_SEARCH) {
      return listPersonInEBNextAPI({
        ebid: filters.eb.id,
        sort,
        offset,
        size,
        filters,
        expertBases: [...newExpertBase],
        schema,
      });
    }
    return listPersonInEB({ ebid: filters.eb.id, sort, offset, size });
  }

  const finalQuery = assistantQuery || query;
  // BRANCH: search in Global

  // if search in global experts, jump to another function;
  // Fix bugs when default search area is 'aminer'
  if (searchInGlobalExperts) {
    return searchPersonGlobal(finalQuery, offset, size, filters, sort, useTranslateSearch, expertBaseId);
  }

  //
  // BRANCH: search in EB new/old.
  //

  // 1. prepare parameters.
  const Sort = sort || 'relevance'; // TODO or '_sort';

  // 2. query
  // ------------------------------------------------------------------------------------------
  if (sysconfig.USE_NEXT_EXPERT_BASE_SEARCH && Sort !== 'activity-ranking-contrib') {
    // const ebs = expertBases || sysconfig.ExpertBases;
    let defaultHaves;
    if (expertBases) {
      defaultHaves = expertBases.length > 0 && expertBases.map(eb => eb);
    } else if (sysconfig.ExpertBases) {
      const ebs = sysconfig.ExpertBases;
      defaultHaves = ebs.length > 0 && ebs.filter(eb => eb.id !== 'aminer').map(eb => eb.id);
    }
    // const defaultHaves = ebs && ebs.length > 0 && ebs.filter(eb => eb.id !== 'aminer').map(eb => eb.id);

    const enTrans = sysconfig.Search_EnableTranslateSearch && !sysconfig.Search_EnableSmartSuggest;
    const isSearchAssistantAdvMode = !!((assistantDataMeta && assistantDataMeta.advquery));
    const allOrAllb = sysconfig.Auth_AllowAnonymousAccess && !getLocalToken();

    const nextapi = apiBuilder.create(Action.search.search, 'search')
      .param({ query, offset, size })
      .param({
        searchType: allOrAllb ? F.searchType.all : F.searchType.ToBPerson,
        aggregation: F.params.default_aggregation,
      })
      .addParam({ haves: { eb: defaultHaves } }, { when: defaultHaves && defaultHaves.length > 0 })
      .addParam({ switches: ['loc_search_all'] }, { when: useTranslateSearch }) // TODO remove this
      .addParam({ switches: ['loc_translate_all'] }, { when: enTrans && !useTranslateSearch }) // TODO remove this
      // .addParam(
      //   { switches: ['intell_expand'] },
      //   { when: sysconfig.Search_EnableSmartSuggest && !isNotAffactedByAssistant },
      // )
      .addParam({ switches: ['lang_zh'] }, { when: sysconfig.Locale === zhCN })

      .schema({ person: schema || F.fields.person_in_PersonList })
      .addSchema({ person: ['tags_translated_zh'] }, { when: sysconfig.Locale === zhCN })
      .addParam(
        { switches: ['intell_search_abbr'] },
        { when: sysconfig.Search_EnableSmartSuggest && isNotAffactedByAssistant && isSearchAbbr },
      )
      .addParam(
        { switches: ['intell_search_kg'] },
        { when: sysconfig.Search_EnableSmartSuggest && isNotAffactedByAssistant },
      );


    // filters
    H.filtersToQuery(nextapi, filters);

    // sort
    if (Sort && Sort !== 'relevance') {
      let newSort = Sort;
      if (Sort === 'name') {
        newSort = '!name_zh_sorted';
      }
      nextapi.param({ sorts: [newSort] });
    }

    // Apply Plugins.
    plugins.applyPluginToAPI(nextapi, 'api_search');

    // apply SearchAssistant
    if (isSearchAssistantAdvMode) {
      nextapi.param(assistantDataMeta);
    }

    // console.log('DEBUG---------------------\n', nextapi.api);
    // console.log('DEBUG---------------------\n', JSON.stringify(nextapi.api));

    const data = [nextapi.api];
    if (isSearchAssistantAdvMode && typesTotals) {
      data.push(create_dm_intellwords_expand(query, assistantDataMeta, typesTotals));
    }
    return nextAPI({ data });

    // ------------------------------------------------------------------------------------------
  }
  // TODO fix 华为bug
  let oldSearchUseQuery;
  if (filters.eb && filters.eb.id !== 'aminer' && sysconfig.SOURCE === 'huawei') {
    oldSearchUseQuery = query;
  } else {
    oldSearchUseQuery = assistantQuery || query;
  }

  const { expertBase, data } =
    prepareParameters(oldSearchUseQuery, offset, size, filters, sort, useTranslateSearch);
  return request(
    api.searchPersonInBase.replace(':ebid', expertBase),
    { method: 'GET', data },
  );
}

function create_dm_intellwords_expand(query, assistantDataMeta, typesTotals) {
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
      keeps: (assistantDataMeta.advquery && assistantDataMeta.advquery.texts) || [],
    });

  return nextapi.api;
}

export async function onlySearchAssistant(params) {
  const { query, assistantDataMeta, isSearchAbbr, typesTotals, isNotAffactedByAssistant } = params;
  const isSearchAssistantAdvMode = !!((assistantDataMeta && assistantDataMeta.advquery));
  const nextapi = apiBuilder.create(Action.search.search, 'searchAssistant')
    .param({ query, offset: 0, size: 0, searchType: 'all' })
    .addParam(
      { switches: ['intell_search_abbr'] },
      { when: sysconfig.Search_EnableSmartSuggest && isNotAffactedByAssistant && isSearchAbbr },
    )
    .addParam({ switches: ['intell_search_kg'] }, { when: sysconfig.Search_EnableSmartSuggest && isNotAffactedByAssistant })
    .addParam({ switches: ['lang_zh'] }, { when: sysconfig.Locale === zhCN })
    .schema({ person: [] });
  // apply SearchAssistant
  if (isSearchAssistantAdvMode) {
    nextapi.param(assistantDataMeta);
  }
  const data = [nextapi.api];
  if (isSearchAssistantAdvMode && typesTotals) {
    data.push(create_dm_intellwords_expand(query, assistantDataMeta, typesTotals));
  }
  return nextAPI({ data });
}

export async function listPersonInEB(payload) {
  const { sort, ebid, offset, size } = payload;
  if (!sort || sort === 'time') {
    return request(
      api.allPersonInBase
        .replace(':ebid', ebid)
        .replace(':offset', offset)
        .replace(':size', size),
      { method: 'GET', data: { rev: 1 } },
    );
  }
  return request(
    api.allPersonInBaseWithSort
      .replace(':ebid', ebid)
      .replace(':sort', sort)
      .replace(':offset', offset)
      .replace(':size', size),
    { method: 'GET' /* , data: { rev: 0 } */ },
  );

  // const rosterAPI = sort === 'time' ? api.allPersonInBase : api.allPersonInBaseWithSort;
  //
  // const data = {};
  // if (sort === 'time') {
  //   data.rev = 1;
  // }
  // return request(
  //   rosterAPI.replace(':ebid', ebid),
  //   { method: 'GET', data },
  // );
}

export async function listPersonInEBNextAPI(payload) {
  const { sort, ebid, offset, size, filters, expertBases, schema, searchType } = payload;

  // const ebs = sysconfig.ExpertBases;
  // const defaultHaves = ebs && ebs.length > 0 && ebs.map(eb => eb.id);
  const allOrAllb = sysconfig.Auth_AllowAnonymousAccess && !getLocalToken();
  const nextapi = apiBuilder.create(Action.search.search, 'list-in-EB')
    .param({
      offset,
      size,
      searchType: allOrAllb ? F.searchType.all : F.searchType.ToBPerson,
      aggregation: F.params.default_aggregation,
      haves: { eb: expertBases },
    })
    .schema({ person: schema || F.fields.person_in_PersonList })
    .addSchema({ person: ['tags_translated_zh'] }, { when: sysconfig.Locale === zhCN });

  // H.filterByEBs(nextapi, [ebid], filters);
  H.filtersToQuery(nextapi, filters);

  if (sort && sort !== 'relevance' && sort !== 'time') {
    let newSort = sort;
    if (sort === 'name') {
      newSort = '!name_zh_sorted';
    }
    nextapi.param({ sorts: [newSort] });
  }

  plugins.applyPluginToAPI(nextapi, 'api_search');

  // console.log('DEBUG---------------------\n', nextapi.api);
  // console.log('DEBUG---------------------\n', JSON.stringify(nextapi.api));

  return nextAPI({ data: [nextapi.api] });
}

// used in acm fellow forecast
export async function listAllPersonIdsInEBNextAPI(payload) {
  const { ebid, offset, size, filters } = payload;
  const nextapi = apiBuilder.create(Action.search.search, 'list-all-ids-in-EB')
    .param({
      offset,
      size,
      searchType: F.searchType.all,
    })
    .schema({ person: ['id'] });
  // H.filterByEBs(nextapi, [ebid]);
  H.filtersToQuery(nextapi, filters);
  return nextAPI({ data: [nextapi.api] });
}

// Search Global.
export async function searchPersonGlobal(query, offset, size, filters, sort, useTranslateSearch, expertBaseId) {
  const data = prepareParametersGlobal(query, offset, size, filters, sort, useTranslateSearch, expertBaseId);
  const { term, name, org, isAdvancedSearch } = strings.destructQueryString(query);
  const apiURL = isAdvancedSearch ? api.searchPersonAdvanced : api.searchPerson;
  return request(apiURL, { method: 'GET', data });
}

//
// Search Aggregation!
//
export async function searchPersonAgg(params) {
  const { query, offset, size, filters, sort, expertBaseId } = params;
  const { useTranslateSearch, assistantQuery } = params;
  // some conditions
  const finalQuery = assistantQuery || query;

  // if search in global experts, jump to another function;
  if (filters && filters.eb && filters.eb.id === 'aminer') {
    return searchPersonAggGlobal(finalQuery, offset, size, filters, useTranslateSearch, expertBaseId);
  }
  // Fix bugs when default search area is 'aminer'
  if ((!filters || !filters.eb) && sysconfig.DEFAULT_EXPERT_BASE === 'aminer') {
    return searchPersonAggGlobal(finalQuery, offset, size, filters, useTranslateSearch, expertBaseId);
  }

  if (sysconfig.USE_NEXT_EXPERT_BASE_SEARCH && sort !== 'activity-ranking-contrib') {
    // TODO 注意注意，agg从新的api中获取，所以这里什么都不做!
  } else {
    const { expertBase, data } = prepareParameters(finalQuery, offset, size, filters, '', useTranslateSearch, expertBaseId);
    return request(
      api.searchPersonInBaseAgg.replace(':ebid', expertBase),
      { method: 'GET', data },
    );
  }
}

export async function searchPersonAggGlobal(query, offset, size, filters, useTranslateSearch, expertBaseId) {
  const data = prepareParametersGlobal(query, offset, size, filters, '', useTranslateSearch, expertBaseId);
  const { term, name, org, isAdvancedSearch } = strings.destructQueryString(query);
  const apiURL = isAdvancedSearch ? api.searchPersonAdvancedAgg : api.searchPersonAgg;
  return request(apiURL, { method: 'GET', data });
}

function prepareParameters(query, offset, size, filters, sort, useTranslateSearch, expertBaseId) {
  let expertBase = sysconfig.DEFAULT_EXPERT_BASE;
  let data = { offset, size, sort: sort || '' };

  if (filters) {
    // const newFilters = {};
    Object.keys(filters).forEach(k => {
      if (k === 'eb') {
        expertBase = filters[k].id;
      } else {
        const newKey = `as_${k.toLowerCase().replace(' ', '_').replace('-', '_')}`;
        const mappedKey = new2oldFilterValueMap[newKey] || newKey;
        data[mappedKey] = filters[k];
      }
    });
    // data = { ...data, ...newFilters };
  }
  const { term, name, org } = strings.destructQueryString(query);
  if (term) {
    // const cleanedTerm = encodeURIComponent(strings.cleanQuery(term));
    const cleanedTerm = strings.cleanQuery(term);
    data.term = useTranslateSearch ? `cross:${cleanedTerm}` : cleanedTerm;
  }
  if (name) {
    data.name = name;
  }
  if (org) {
    data.org = strings.cleanQuery(org);
  }

  data = addAdditionParameterToData(data, sort, 'eb', expertBaseId);
  // if (useTranslateSearch && data[sysconfig.DEFAULT_EXPERT_SEARCH_KEY]) {
  //   data[sysconfig.DEFAULT_EXPERT_SEARCH_KEY] = `cross:${data[sysconfig.DEFAULT_EXPERT_SEARCH_KEY]}`;
  // }
  return { expertBase, data };
}

const new2oldAggQueryKeyMap = {
  as_nation: 'as_nationality',
  as_lang: 'as_language',
};

const new2oldFilterValueMap = {
  as_nation: 'as_nationality',
  as_lang: 'as_language',
};

function prepareParametersGlobal(query, offset, size, filters, sort, useTranslateSearch, expertBaseId) {
  let data = { query, offset, size, sort };
  data = { offset, size, sort: sort || '' };

  // add filters
  if (filters) {
    Object.keys(filters).forEach(k => {
      if (k !== 'eb') { // ignore eb;
        const newKey = `as_${k.toLowerCase().replace(' ', '_').replace('-', '_')}`;
        const newMappedKey = new2oldAggQueryKeyMap[newKey];
        let value = k === 'gender'
          ? filters[k] && filters[k].toLowerCase()
          : filters[k];

        // quick fix for nation, used when switch from new to old.
        const mappedValue = new2oldFilterValueMap[value && value.toLowerCase()];
        value = mappedValue || value;
        // if (k === 'nation') {
        //   if (value && value.toLowerCase() === 'usa') {
        //     value = 'USA';
        //   } else if (value && value.toLowerCase() === 'unitedkingdom') {
        //     value = 'United Kingdom';
        //   } else if (value && value.toLowerCase() === 'hongkong') {
        //     value = 'Hong Kong';
        //   }
        // }

        data[newMappedKey || newKey] = value;
      }
    });
  }

  // add query // TODO Use Advanced Search?????
  const { term, name, org, isAdvancedSearch } = strings.destructQueryString(query);
  if (isAdvancedSearch) {
    if (term) {
      const cleanedTerm = strings.cleanQuery(term);// encodeURIComponent(strings.cleanQuery(term));
      data.term = useTranslateSearch ? `cross:${cleanedTerm}` : cleanedTerm;
    }
    if (name) {
      data.name = name;
    }
    if (org) {
      data.org = strings.cleanQuery(org);
    }
  } else {
    const newQuery = strings.firstNonEmpty(term, name, org); // use new query?
    data.query = useTranslateSearch ? `cross:${newQuery}` : newQuery;
  }

  // data.query = encodeURIComponent(newQuery);
  data = addAdditionParameterToData(data, sort, 'global', expertBaseId);

  // if (useTranslateSearch && data.query) {
  //   data.query = `cross:${data.query}`;
  // }
  return data;
}

// Additional parameters. range=[eb|global]
function addAdditionParameterToData(data, sort, range, expertBaseId) {
  const newData = data;

  // 置顶huawei项目中的acm fellow和高校top100
  if (sysconfig.Search_EnablePin) {
    if (sort || sort === 'relevance') {
      newData.pin = 1;
    }
  }

  // with search in expert-base.
  if ((sysconfig.Search_CheckEB && range === 'global') || sysconfig.Search_checkEB_Roster) {
    newData.lk_roster = expertBaseId || sysconfig.ExpertBase;
  }
  return newData;
}

// ---------------------------------------------------------

export async function getSeminars(offset, size) {
  return request(api.getSeminars.replace(':offset', offset).replace(':size', size));
}

export async function relationGraph(id) {
  return request(api.searchExpertNetWithDSL.replace(':id', id), {
    method: 'GET',
  });
}

// publications:

export async function searchPublications(params) {
  return request(api.searchPubs, { method: 'GET', data: params });
}

export async function getActivityScoresByPersonIds(ids) {
  return request(api.batchGetActivityCompareScoresByPersonId.replace(':ids', ids), {
    method: 'GET',
  });
}

export async function getMoreIntellWords(params) {
  const { query, text, type, total } = params;
  const nextapi = apiBuilder.magic(F.magic.expand, 'expand')
    .param({ query })
    .param({ kgFromabbr: true })
    .addParam({ switches: ['lang_zh'] }, { when: sysconfig.Locale === zhCN })
    .addParam({ types: [{ type: type.toLowerCase(), total, random: 0 }] })
    .addParam({ keeps: [{ text, source: 'abbr', id: '0' }] });
  return nextAPI({ data: [nextapi.api], type: 'magic' });
}

export async function getPersonIsExistInEB(payload) {
  const { ids, ebid, expertBases } = payload;
  let defaultHaves;
  if (expertBases) {
    defaultHaves = expertBases.length > 0 && expertBases.map(eb => eb);
  } else if (sysconfig.ExpertBases) {
    const ebs = sysconfig.ExpertBases;
    defaultHaves = ebs.length > 0 && ebs.filter(eb => eb.id !== 'aminer').map(eb => eb.id);
  }

  const nextapi = apiBuilder.create(Action.search.search, 'search')
    .param({ offset: 0, size: 20, searchType: 'ToBPerson' })
    .param({
      ids,
      filters: { dims: { eb: [ebid] } },
    })
    .addParam({ haves: { eb: defaultHaves } }, { when: defaultHaves && defaultHaves.length > 0 })
    .schema({ person: ['id'] });
  return nextAPI({ data: [nextapi.api] });
}
