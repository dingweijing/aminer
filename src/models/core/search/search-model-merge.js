/* eslint-disable prefer-destructuring,no-unused-expressions,no-param-reassign,no-lonely-if */
import { sysconfig } from 'systems';
import { notification } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { searchService } from 'services/search';
import { translateService } from 'services/misc';
import { topicService } from 'services/topic';
import { qs } from 'utils';
import * as bridge from 'utils/next-bridge';
import { takeLatest } from 'utils/helper';

export default {

  namespace: 'searchmodel-merge',

  state: {
    // query: null,

    // results: null,
    // topic: null, // search 右边的 topic
    // aggs: [], // Aggregation
    // filters: {},

    // isAdvancedSearch: null,

    // searchSuggests: null,

    // // use translate search? TODO replace with Intelligence Search.
    // useTranslateSearch: sysconfig.Search_EnableTranslateSearch
    //   && !sysconfig.Search_EnableSmartSuggest && sysconfig.Search_DefaultTranslateSearch,
    // translatedLanguage: 0, // 1 en to zh; 2 zh to en;
    // translatedText: '',

    // // Intelligence search assistants. TODO change to assistantMeta, assistantData
    // assistantDataMeta: {}, // {advquery: texts: [...]}
    // assistantData: null,
    // isNotAffactedByAssistant: true, // 标记没有点过翻译。点了就变成false了。碰过就不能用intell_search了。
    // isSearchAbbr: true, // 默认搜索扩展词，当扩展词为空变为false

    // // flags
    // isNewAPI: false,

    // // pager
    // offset: 0,
    // sortKey: '',
    // pagination: {
    //   showSizeChanger: true,
    //   showQuickJumper: true,
    //   showTotal: total => `共 ${total} 条`,
    //   current: 1,
    //   pageSize: sysconfig.MainListSize,
    //   total: null,
    // },

    // seminars: [], // TODO move out.
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, search, select }) => {

        // TODO Later dont't use this method to get query, use in component method.

        // let match = pathToRegexp('/(uni)?search/:query').exec(pathname);

        // //临时增加,监听talentHr的search页面
        // match = pathToRegexp('/talent/search/:offset/:size').exec(pathname);
        // if (match) {
        //   const keyword = search.substring(4);
        //   const offset = parseInt(match[1], 10);
        //   const size = parseInt(match[2], 10);
        //   dispatch({ type: 'updateUrlParams', payload: { query: keyword, offset, size } });
        // }

        // //
        // match = pathToRegexp('/eb/:id/:query/:offset/:size').exec(pathname);
        // if (match) {
        //   const q = decodeURIComponent(match[2]);
        //   const keyword = q === '-' ? '' : q;
        //   const offset = parseInt(match[3], 10);
        //   const size = parseInt(match[4], 10);
        //   dispatch({ type: 'updateUrlParams', payload: { query: keyword, offset, size } });
        //   // dispatch({ type: 'clearSearchAssistant' });
        // }

      });
    },
  },

  effects: {
    // // 搜索全球专家时，使用old service。
    // // 使用智库搜索，并且排序算法不是contribute的时候，使用新的搜索API。
    // searchPerson: [function* G({ payload }, { call, put, select }) {
    //   const { query, offset, size, filters, sort, total, ghost, typesTotals, findPersonInEbByNextApi } = payload;
    //   const { expertBaseId, expertBases, schema } = payload;
    //   const noTotalFilters = {};
    //   for (const [key, item] of Object.entries(filters)) {
    //     if (typeof item === 'string') {
    //       noTotalFilters[key] = item.split('#')[0];
    //     } else {
    //       noTotalFilters[key] = item;
    //     }
    //   }

    //   // fix sort key
    //   const Sort = fixSortKey(sort, query); // Fix default sort key.

    //   // TODO replace this.
    //   const useTranslateSearch = yield select(state => state.search.useTranslateSearch);
    //   const intelligenceSearchMeta = yield select(state => state.search.intelligenceSearchMeta);
    //   const assistantDataMeta = yield select(state => state.search.assistantDataMeta);
    //   const isNotAffactedByAssistant = yield select(state => state.search.isNotAffactedByAssistant);
    //   const isSearchAbbr = yield select(state => state.search.isSearchAbbr);

    //   // 分界线
    //   yield put({ type: 'updateSortKey', payload: { key: Sort } });
    //   yield put({ type: 'updateFilters', payload: { filters } });

    //   const { searchInGlobalExperts, searchInSomeExpertBase } = searchService.getBools(filters);

    //   // TODO call standalone assistant search for old api.
    //   let assistantQuery = '';
    //   if (sysconfig.Search_EnableSmartSuggest
    //     && !ghost
    //     && (searchInGlobalExperts
    //       || (searchInSomeExpertBase && !sysconfig.USE_NEXT_EXPERT_BASE_SEARCH))
    //     && (query && query !== '-' && query.trim() !== '') // 列出专家库所有人不进行下面
    //   ) {
    //     // TODO 第一次搜索出现的bug。
    //     // 点击more 或者 切换abbr
    //     if (typesTotals || isNotAffactedByAssistant) {
    //       const data = yield call(searchService.onlySearchAssistant, {
    //         query, assistantDataMeta, isSearchAbbr, typesTotals, isNotAffactedByAssistant,
    //       });
    //       if (data.data) {
    //         let intellResults;
    //         // console.log('------------------------', data);
    //         if (data.data.succeed) {
    //           intellResults = data.data.intellResults;
    //         } else if (data.data.data && data.data.data.length > 0) {
    //           intellResults = data.data.data[1].items[0];
    //         }
    //         const { kgHyponym, abbr, level } = intellResults;
    //         yield put({ type: 'getAssistantDataSuccess', payload: { data: intellResults } });
    //         let queries;
    //         if (assistantDataMeta && assistantDataMeta.advquery && assistantDataMeta.advquery.texts) {
    //           queries = assistantDataMeta.advquery.texts.map(term => term && `${term.text}`);
    //           queries.push(`${query}`);
    //         } else {
    //           queries = [query];
    //           if (abbr && abbr.length > 0) {
    //             queries.push(abbr[0].word);
    //           }
    //         }
    //         if (isSearchAbbr && intellResults.transText) {
    //           queries.push(intellResults.transText);
    //         }
    //         // typesTotals 点击more的操作
    //         const defaultCheckedLength = level && level <= 1 ? 8 : 3;
    //         if (kgHyponym && kgHyponym.length > 0 && !typesTotals) {
    //           for (let i = 0; i < kgHyponym.length; i += 1) {
    //             if (i < defaultCheckedLength) {
    //               queries.push(kgHyponym[i].word);
    //             }
    //           }
    //         }
    //         if (queries.length > 1) {
    //           assistantQuery = queries.map(item => `(| ${item})`).join(' ');
    //         }
    //       }
    //     } else if (assistantDataMeta && assistantDataMeta.advquery) {
    //       // 除了abbr 和 more 操作
    //       const queries = assistantDataMeta.advquery.texts.map(term => term && `${term.text}`);
    //       queries.push(`${query}`);
    //       if (queries.length > 1) {
    //         assistantQuery = queries.map(item => `(| ${item})`).join(' ');
    //       }
    //     }
    //   }


    //   // 调用 搜索 .
    //   const params = {
    //     query,
    //     offset,
    //     size,
    //     filters: noTotalFilters,
    //     sort: Sort,
    //     intelligenceSearchMeta,
    //     assistantDataMeta,
    //     assistantQuery,
    //     isNotAffactedByAssistant,
    //     isSearchAbbr,
    //     useTranslateSearch,
    //     typesTotals,
    //     expertBaseId,
    //     expertBases,
    //     schema, // TODO remove expertBases
    //   };


    //   if (!typesTotals) {
    //     const data = yield call(searchService.searchPerson, params);

    //     if (!sysconfig.USE_NEXT_EXPERT_BASE_SEARCH || (filters && filters.eb.id === 'aminer')) {
    //       // yield call(searchService.searchPersonAgg,
    //       //   { query: assistantQuery || query, offset, size, filters: noTotalFilters, sort: Sort });
    //       // TODO fix华为bug，非全球搜索其他的不走这里
    //       let finalQuery;
    //       if (filters.eb && filters.eb.id !== 'aminer' && sysconfig.SOURCE === 'huawei') {
    //         finalQuery = query;
    //       } else {
    //         finalQuery = assistantQuery || query;
    //       }

    //       yield put({
    //         type: 'searchPersonAgg',
    //         payload: {
    //           query: finalQuery,
    //           offset,
    //           size,
    //           filters: noTotalFilters,
    //           sort: Sort,
    //           expertBaseId,
    //         },
    //       });
    //     }
    //     if (process.env.NODE_ENV !== 'production') {
    //       if (data && data.data && data.data.queryEscaped) {
    //         console.warn('DEVELOPMENT ONLY MESSAGE: Query中有非法字符，已经过滤。详情：宋驰没告诉我!');
    //         notification.open({
    //           message: 'DEVELOPMENT ONLY MESSAGE',
    //           description: 'Query中有非法字符，已经过滤。详情：宋驰没告诉我!',
    //         });
    //       }
    //     }
    //     const useNewApi = data && data.data && data.data.succeed
    //       || (assistantDataMeta && assistantDataMeta.advquery && data && data.data && !data.data.result)
    //       || (!typesTotals && data && data.data && !data.data.result);
    //     if (data.data && useNewApi) {
    //       let tempData;
    //       let intellResults;
    //       if (data.data.succeed) {
    //         tempData = data.data;
    //         intellResults = data.data.intellResults;
    //       } else if (assistantDataMeta && assistantDataMeta.advquery) {
    //         tempData = data.data.data[0];
    //         intellResults = data.data.data[1].items[0];
    //       }
    //       // console.log('>>>>>> ---==== to next API');
    //       // TODO 修复新API下没有CCF 贡献度值这样的东西。但是：这些东西不应该放这里。。。。。。。
    //       if (sysconfig.SOURCE === 'ccf') {
    //         const personIds = tempData.items && tempData.items.map(item => item && item.id);
    //         if (personIds) {
    //           const activityScores = yield call(
    //             searchService.getActivityScoresByPersonIds,
    //             personIds.join('.'),
    //           );
    //           if (activityScores.success && activityScores.data && activityScores.data.indices
    //             && activityScores.data.indices.length > 0) {
    //             tempData.items && tempData.items.map((item, index) => {
    //               const activityRankingContrib = activityScores.data.indices[index].filter(scores => scores.key === 'contrib');
    //               if (tempData.items[index].indices) {
    //                 tempData.items[index].indices.activityRankingContrib = activityRankingContrib.length > 0 ? activityRankingContrib[0].score : 0;
    //               }
    //               return '';
    //             });
    //           }
    //         }
    //       }
    //       tempData.items && tempData.items.map((item, index) => {
    //         item.locks = { roster: true };
    //         return '';
    //       });

    //       if (ghost) { // called by others. export.
    //         return tempData;
    //       }
    //       // const { intellResults } = tempData;
    //       yield put({ type: 'nextSearchPersonSuccess', payload: { data: tempData, query } });
    //       if (typesTotals || (assistantDataMeta && !assistantDataMeta.advquery)
    //         || isNotAffactedByAssistant) {
    //         yield put({ type: 'getAssistantDataSuccess', payload: { data: intellResults } });
    //       }
    //     } else if (data.data && data.data.result) {
    //       if (ghost) {
    //         return data.data;
    //       }
    //       if ((sysconfig.USE_NEXT_EXPERT_BASE_SEARCH && (filters && filters.eb.id !== 'aminer')) || findPersonInEbByNextApi) {
    //         // 使用新API添加专家到智库，通过lk_roster是得不到结果的
    //         const ids = data.data.result.map(item => item.id);
    //         const personInEB = yield call(
    //           searchService.getPersonIsExistInEB,
    //           { ids, ebid: expertBaseId || sysconfig.ExpertBase, expertBases },
    //         );
    //         const idsInEB = personInEB.data && personInEB.data.items
    //           && personInEB.data.items.length > 0
    //           && personInEB.data.items.map(item => item.id);
    //         if (data.data.result.length > 0) {
    //           data.data.result.map(item => {
    //             if (idsInEB && idsInEB.length > 0 && idsInEB.includes(item.id)) {
    //               item.locks.roster = true;
    //               item.dims = {
    //                 eb: personInEB.data.items[idsInEB.indexOf(item.id)].dims
    //                   && personInEB.data.items[idsInEB.indexOf(item.id)].dims.eb,
    //               };
    //             } else {
    //               item.locks.roster = false;
    //             }
    //             return item;
    //           });
    //         }
    //       }
    //       yield put({
    //         type: 'searchPersonSuccess',
    //         payload: { data: data.data, query, total },
    //       });
    //     } else {
    //       throw new Error('Result Not Available');
    //     }
    //   }
    // }, takeLatest],

    // * onlySearchAssistant({ payload }, { call, put }) {
    //   const { query, assistantDataMeta, isSearchAbbr } = payload;
    //   const data = yield call(searchService.onlySearchAssistant, {
    //     query,
    //     assistantDataMeta,
    //     isSearchAbbr,
    //   });
    //   if (data.data && data.data.succeed) {
    //     const { intellResults } = data.data;
    //     yield put({ type: 'getAssistantDataSuccess', payload: { data: intellResults } });
    //   }
    // },

    // * translateSearch({ payload }, { call, put, select }) {
    //   // yield put({ type: 'clearTranslateSearch' });
    //   const useTranslateSearch = yield select(state => state.search.useTranslateSearch);
    //   if (useTranslateSearch) {
    //     const { query } = payload;
    //     if (query) {
    //       try {
    //         const { data } = yield call(translateService.translateTerm, query);
    //         if (data && data.status) {
    //           const q = query && query.trim().toLowerCase();
    //           const en = data && data.en && data.en.trim().toLowerCase();
    //           if (q !== en) {
    //             yield put({ type: 'translateSearchSuccess', payload: { data } });
    //           }
    //         }
    //       } catch (err) {
    //         console.log(err);
    //       }
    //     }
    //   }
    // },

    // searchPersonAgg: [function* ({ payload }, { call, put, select }) {
    //   const { query, offset, size, filters, sort, expertBaseId } = payload;
    //   const noTotalFilters = {};
    //   for (const [key, item] of Object.entries(filters)) {
    //     if (typeof item === 'string') {
    //       noTotalFilters[key] = item.split('#')[0];
    //     } else {
    //       noTotalFilters[key] = item;
    //     }
    //   }
    //   const useTranslateSearch = yield select(state => state.search.useTranslateSearch);
    //   const intelligenceSearchMeta = yield select(state => state.search.intelligenceSearchMeta);
    //   const assistantDataMeta = yield select(state => state.search.assistantDataMeta);
    //   const isNotAffactedByAssistant = yield select(state => state.search.isNotAffactedByAssistant);

    //   const assistantQuery = findAssistantQuery({
    //     ghost: false,
    //     filters,
    //     assistantDataMeta,
    //     query,
    //   });

    //   const params = {
    //     query,
    //     offset,
    //     size,
    //     filters: noTotalFilters,
    //     sort,
    //     assistantDataMeta,
    //     assistantQuery,
    //     useTranslateSearch,
    //     expertBaseId, // TODO remove
    //   };
    //   const sr = yield call(searchService.searchPersonAgg, params);
    //   if (sr) {
    //     const { data } = sr;
    //     yield put({ type: 'searchPersonAggSuccess', payload: { data } });
    //   }
    // }, takeLatest],


    // * getSeminars({ payload }, { call, put }) {
    //   const { offset, size } = payload;
    //   const { data } = yield call(searchService.getSeminars, offset, size);
    //   yield put({ type: 'getSeminarsSuccess', payload: { data } });
    // },

    // * getTopicByMention({ payload }, { call, put }) {
    //   try {
    //     const { mention } = payload;
    //     const { data } = yield call(topicService.getTopicByMention, mention);
    //     yield put({ type: 'getTopicByMentionSuccess', payload: { data } });
    //   } catch (err) {
    //     console.error(err);
    //   }
    // },

  },


  reducers: {
    //   updateUrlParams(state, { payload: { query, offset, size } }) {
    //     state.query = query;
    //     state.offset = offset || 0;
    //     state.size = size || sysconfig.MainListSize;
    //     if (state.query !== query) {
    //       state.filters = state.filters || {};
    //       if (!state.filters.eb) {
    //         state.filters.eb = {
    //           id: sysconfig.DEFAULT_EXPERT_BASE,
    //           name: sysconfig.DEFAULT_EXPERT_BASE_NAME,
    //         };
    //       }

    //       state.pagination = state.pagination || {
    //         current: 1,
    //         pageSize: sysconfig.MainListSize,
    //         total: null,
    //       };
    //       state.pagination.pageSize = state.size;
    //       state.translatedText = '';
    //     }
    //   },

    //   updateFiltersAndQuery(state, { payload: { query, filters } }) {
    //     state.query = query;
    //     state.filters = filters;
    //     // return { ...state, query, filters };
    //   },

    //   updateFilters(state, { payload: { filters } }) {
    //     state.filters = filters;
    //     // return { ...state, filters };
    //   },

    //   updateSortKey(state, { payload: { key } }) {
    //     state.sortKey = key;
    //   },

    //   searchPersonSuccess(state, { payload: { data, query, total } }) {
    //     const { result } = data;
    //     const currentTotal = total || data.total;
    //     const current = Math.floor(state.offset / state.pagination.pageSize) + 1;
    //     state.results = query === '-' ? null : bridge.toNextPersons(result) || [];
    //     state.pagination = { pageSize: state.pagination.pageSize, total: currentTotal, current };
    //     // if (!data) {
    //     //   return state;
    //     // }
    //     // const { result } = data;
    //     // const currentTotal = total || data.total;
    //     // const current = Math.floor(state.offset / state.pagination.pageSize) + 1;
    //     // return {
    //     //   ...state,
    //     //   results: query === '-' ? null : bridge.toNextPersons(result) || [],
    //     //   pagination: { pageSize: state.pagination.pageSize, total: currentTotal, current },
    //     // };
    //   },

    //   nextSearchPersonSuccess(state, { payload: { data, query } }) {
    //     if (!data) {
    //       return state;
    //     }
    //     const { succeed, message, total, offset, size, items, aggregation } = data;
    //     if (!succeed) {
    //       throw new Error(message);
    //     }
    //     const current = Math.floor(state.offset / state.pagination.pageSize) + 1;
    //     const { translatedLanguage, translatedText } = data;
    //     const newState = {
    //       ...state,
    //       results: query === '-' ? null : items || [],
    //       pagination: { pageSize: state.pagination.pageSize, total, current },
    //       aggs: aggregation,
    //       translatedLanguage,
    //       translatedText,
    //     };
    //     return newState;
    //   },

    //   emptyResults(state) {
    //     return { ...state, results: [] };
    //   },

    //   removePersonFromSearchResultsById(state, { payload: { pid } }) {
    //     const originalResults = [];
    //     for (const value of state.results) {
    //       if (value.id !== pid) {
    //         originalResults.push(value);
    //       }
    //     }
    //     return { ...state, results: originalResults };
    //   },

    //   searchPersonAggSuccess(state, { payload: { data } }) {
    //     // console.log('dataaaaaaaa', data);
    //     if (data) {
    //       // console.log('bridge.toNextAggregation(data.aggs);', bridge.toNextAggregation(data.aggs));
    //       state.aggs = bridge.toNextAggregation(data.aggs);
    //     }
    //   },

    //   getSeminarsSuccess(state, { payload: { data } }) {
    //     return { ...state, seminars: data };
    //   },

    //   translateSearchSuccess(state, { payload: { data } }) {
    //     let translatedLanguage = 0;
    //     if (data.en) {
    //       translatedLanguage = 2;
    //     } else if (data.zh) {
    //       translatedLanguage = 1;
    //     }
    //     return { ...state, translatedText: data.en || data.zh, translatedLanguage };
    //   },

    //   setTranslateSearch(state, { payload: { useTranslate } }) {
    //     state.useTranslateSearch = useTranslate;
    //     // return { ...state, useTranslateSearch: useTranslate };
    //   },

    //   clearTranslateSearch(state) {
    //     state.useTranslateSearch = true;
    //     state.translatedText = '';
    //     // return { ...state, useTranslateSearch: true, translatedText: '' };
    //   },

    //   getTopicByMentionSuccess(state, { payload: { data } }) {
    //     state.topic = data.data;
    //     // return { ...state, topic: data.data };
    //   },

    //   /*
    //    * Search Assistant related reducers.
    //    */

    //   setAssistantDataMeta(state, { payload }) {
    //     const { texts, isNotAffactedByAssistant, isSearchAbbr, typesTotals } = payload;
    //     let isNotAffacted;
    //     if (isNotAffactedByAssistant !== null) {
    //       isNotAffacted = isNotAffactedByAssistant;
    //     } else {
    //       isNotAffacted = state.isNotAffactedByAssistant;
    //     }
    //     state.assistantDataMeta = (isSearchAbbr || typesTotals) ? { advquery: { texts } } : {};
    //     state.isNotAffactedByAssistant = isNotAffacted;
    //     state.isSearchAbbr = isSearchAbbr;
    //     // assistantDataMeta isSearchAbbr为true代表切换abbr。typesTotals如果存在代码点击了more操作
    //     // return {
    //     //   ...state,
    //     //   assistantDataMeta: (isSearchAbbr || typesTotals) ? { advquery: { texts } } : {},
    //     //   isNotAffactedByAssistant: isNotAffacted,
    //     //   isSearchAbbr,
    //     // };
    //   },

    //   clearAssistantDataMeta(state) {
    //     state.assistantDataMeta = {};
    //   },

    //   getAssistantDataSuccess(state, { payload: { data } }) {
    //     state.assistantData = data;
    //   },

    //   clearSearchAssistant(state) {
    //     state.assistantDataMeta = null;
    //     state.assistantData = null;
    //   },

    //   smartClearAssistantMeta(state, { payload: { query } }) {
    //     if (state.query !== query) {
    //       state.assistantDataMeta = null;
    //       state.assistantData = null;
    //       // return { ...state, assistantDataMeta: null, assistantData: null };
    //     }
    //   },

    //   toggleAdvancedSearch(state) {
    //     state.isAdvancedSearch = !state.isAdvancedSearch;
    //   },
    //   changePageSize(state, { payload }) {
    //     state.offset = payload.offset;
    //   },
  },

};

// function fixSortKey(sort, query) {
//   if (query) {
//     // 如果有query，默认按relevance排序。
//     if (!sort || sort === 'time') {
//       return 'relevance';
//     }
//   } else {
//     // List all experts in query. use time as default sort.
//     if (!sort || sort === 'relevance') { // 非search没有relevance，自动切换到time
//       // return 'time'; //
//       return 'name'; // old is h_index, time:智库显示顺序;
//     }
//   }
//   return sort;
// }

// function findAssistantQuery(params) {
//   const { ghost, filters, assistantDataMeta, query } = params;
//   const { searchInGlobalExperts, searchInSomeExpertBase } = searchService.getBools(filters);

//   // TODO call standalone assistant search for old api.
//   let assistantQuery = '';
//   if (sysconfig.Search_EnableSmartSuggest && !ghost
//     && (searchInGlobalExperts
//       || (searchInSomeExpertBase && !sysconfig.USE_NEXT_EXPERT_BASE_SEARCH))
//   ) {
//     // TODO 第一次搜索出现的bug。
//     if (assistantDataMeta && assistantDataMeta.advquery && assistantDataMeta.advquery.texts
//       && assistantDataMeta.advquery.texts.length > 0) {
//       const queries = assistantDataMeta.advquery.texts.map(term => term && `(| ${term.text})`);
//       queries.push(`(| ${query})`);
//       assistantQuery = queries.join(' ');
//       console.log('Note: expand query is:', assistantQuery);
//     } else {
//       // FIXME: here is a bug.
//     }
//   }
//   return assistantQuery;
// }
