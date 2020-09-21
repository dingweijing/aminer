/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring,no-unused-expressions,no-param-reassign,no-lonely-if */
import { sysconfig } from 'systems';
import { personSearchService } from 'services/aminer/search';
// import { translateService } from 'services/misc';
// import { topicService } from 'services/topic';
import searchHelper from 'helper/search';
import { isEqual } from 'lodash';


const handleIntellResults = intellResults => {
  const map = {
    Level: 'level',
    TranslatedText: 'transText',
    TranslatedLanguage: 'transLang',
    KnowledgeGraphHyponym: 'kgHyponym',
    KnowledgeGraphHypernym: 'kgHypernym',
  }

  const newJson = {}

  for (const key in map) {
    if (intellResults[key]) {
      let result = intellResults[key]
      if (key === 'KnowledgeGraphHypernym' || key === 'KnowledgeGraphHyponym') {
        result = result.map(item => ({
          word: item.Word,
          word_zh: item.WordZh,
          is_random: item.IsRandom
        }))
      }
      newJson[map[key]] = result;
    }
  }

  return newJson
}

const handleAggregation = aggregation => {
  const arrMap = {
    type: 'name',
    item: 'items'
  }
  const jsonMap = {
    nationality: 'nation',
    language: 'lang',
  }
  const newArr = []

  for (const agg of aggregation) {
    const newJson = {}
    for (const key in arrMap) {
      if (agg[key]) {
        let result = agg[key]
        if (jsonMap[result]) {
          result = jsonMap[result]
        }
        if (key === 'item') {
          result = result.map(item => ({
            count: item.count,
            term: item.label
          }))
        }

        newJson[arrMap[key]] = result;
      }
    }
    newArr.push(newJson)
  }
  return newArr;
}

// ---------------------------------------------------------------------------------------------
//
// ---------------------------------------------------------------------------------------------

export const createSearchModel = namespace => ({

  namespace,

  state: {
    query: {},
    filter: {},
    sort: {}, // { key, d }
    keyValues: {},
    results: null, // search result.
    aggregation: null,
    pagination: {
      total: null,
    },

    devinfo: {},

    // 暂时保留，以后准备用其他方式替代
    isAdvancledSearch: null, // null 表示未设置

    // Intelligence search assistants. TODO change to assistantMeta, assistantData
    // assistantDataMeta: {}, // {advquery: texts: [...]} assistant控件传递来的参数
    smartQuery: {
      // rename from assistantDataMeta { texts, isNotAffactedByAssistant, typesTotals<扩展词或者上下位次的个数> }
      isNotAffactedByAssistant: true,
    },

    assistantData: null, // api返回的结果

    translate: null, 
    notTranslate: false,

    // isNotAffactedByAssistant: true, // 标记没有点过翻译。点了就变成false了。碰过就不能用intell_expand了。
    // isSearchAbbr: true, // 默认搜索扩展词，当扩展词为空变为false
  },

  reducers: {

    // TODO 动态
    update(state, { payload }) {
      // console.log('[Reducer::update] payload is - ', payload);
      Object.keys(payload).forEach(key => {
        const value = payload[key];
        state[key] = value;
      });
    },

    reset(state) { // reset parameters without query;
      state.filter = {};
      state.sort = {};
      state.results = null;
      state.aggregation = null;
      state.pagination = { total: null };
      state.translate = null;
      state.notTranslate = false;
    },

    clearAssistantDataMeta(state) { // TODO
      state.smartQuery = { isNotAffactedByAssistant: true };
    },

    toggleAdvancedSearch(state, { payload }) {
      state.isAdvancedSearch = !payload;
    },

  },

  effects: {

    search: [function* f({ payload }, { call, put, select }) {
      // const modeldata = yield select(state => state[namespace]); // TODO bug, searchmodelB
      const modeldata = yield select(state => {
        const { query, filter, sort, pagination, smartQuery, notTranslate } = state[namespace]
        return { query, filter, sort, pagination, smartQuery, notTranslate }
      });

      let { query, filter, sort, pagination, smartQuery, assistantData, notTranslate } = modeldata; // almost all data get back;
      //
      const oldParam = { query, filter, sort, pagination, smartQuery, assistantQuery: '' };
      console.log('^^^Old Param is: ', oldParam);

      // switch configs passed to service.search.
      const config = {
        useAggregation: false, // need to recalculate aggregation.
        filterHasEB: false, // has eb restriction in filter.
        hasQuery: true, // has query or advanced query.

        resetPagination: false,
        hasNewPagination: false,
        resetFilter: false,
        resetNotTranslate: false,
      };

      // values need to update in reducer;
      const updates = {};

      let newPagination = null;
      let newFilter = null;
      const smartQueryNotAffacted = false; // ???

      // * pre-process changes; payload is changes.
      if (payload.reset) {
        filter = {};
      }

      Object.keys(payload).forEach(key => {
        const value = payload[key];
        switch (key) {
          // 如果进入了didmount，也就是换了一个SearchComponent，那么重置agg，分页等；
          case 'reset':
            if (value) {
              config.useAggregation = true;
              config.resetNotTranslate = true;
              // 但是如果传入的有pagination，也就是changes里面有paginiation，不要重置
              if (!payload.pagination) {
                config.resetPagination = true;
              }
              // config.resetFilter = true;
            }
            break;

          case 'query':
            query = value;
            updates.query = value;
            config.useAggregation = true;
            config.resetNotTranslate = true;
              // 本来是如果query变了，那么重置分页；现在加一个条件，如果query变了同时传入了pagination，那么使用传入的分页；
            if (!payload.pagination) {
              config.resetPagination = true;
            }
            break;

          case 'pagination':
            // process pagination later;
            break;

          case 'sort':
            // 先假设一下sort是默认全排序的；
            sort = value;
            updates.sort = sort;
            config.resetPagination = true;
            break;

          case 'filterChange':
            newFilter = Object.assign({}, filter);
            newFilter = searchHelper.mergeToNewFilter(filter, value);
            filter = newFilter;
            updates.filter = filter;
            config.useAggregation = true;
            config.resetPagination = true;
            break;

          case 'smartQuery':
            // smartQuery is old smartQuery
            // value is new smartQuery
            // const { texts, isNotAffactedByAssistant, isSearchAbbr, typesTotals } = value;
            // let isNotAffacted;
            // if (isNotAffactedByAssistant !== null) {
            //   isNotAffacted = isNotAffactedByAssistant;
            // } else {
            //   isNotAffacted = state.isNotAffactedByAssistant;
            // }
            smartQuery = value;
            updates.smartQuery = value;

            if (value.texts) {
              const newQuery = { ...query, advanced: { texts: value.texts } };
              query = newQuery;
              updates.query = newQuery;
            }
            // if (value && value.texts && value.texts.length >0 ){
            //   isNotAffactedByAssistant = false
            // }
            // updates.assistantDataMeta = (value.isSearchAbbr || value.typesTotals) ? { advquery: { texts: value.texts } } : {};
            // updates.isNotAffactedByAssistant = value.isNotAffactedByAssistant !== null
            //   ? value.isNotAffactedByAssistant
            //   : isNotAffactedByAssistant;
            // updates.isSearchAbbr = value.isSearchAbbr;

            // const prevTexts = smartQuery && smartQuery.advquery && smartQuery.advquery.texts;

            // newFilter = Object.assign({}, filter);
            // newFilter = searchHelper.mergeToNewFilter(filter, value);
            // filter = newFilter;
            // updates.filter = filter;
            // config.useAggregation = true;
            config.resetPagination = true;

            //     // NOTE: query keep unchanged. Change type: [nothing|expansion|kg]
            // // advanced clear assistant value.
            // const { dispatch } = this.props;
            // const { assistantDataMeta, assistantData } = this.props.search;

            // // on expansion change, only clear kg data.
            // AssistantUtils.smartClear({ assistantData, prevTexts, texts, dispatch });

            // dispatch({
            //   type: 'search/setAssistantDataMeta',
            //   payload: { texts, isNotAffactedByAssistant, isSearchAbbr, typesTotals },
            // });
            // this.doSearchUseProps(typesTotals);


            break;

          case 'restrictEBs':
            // 判断限制的eb是否都在filter中，如果不在，更新filter强制加上；
            if (!value || value.length === 0) { // not set; break;
              break;
            }
            // TODO this is single version; chagne to multi eb version
            if (value.length > 1) {
              throw new Error('限定不得超过多余一个智库');
            }
            if (filter && filter.eb && filter.eb.id === value[0].id) {
              // 命中，已经有了，直接退出；
              break;
            }
            // 需要替换, 这里才是真的改变了filter，需要重新搜索aggregation;
            newFilter = Object.assign({}, filter);
            // 标记清空eb？
            if (value[0].id === null) {
              delete newFilter.eb;
            } else {
              newFilter = searchHelper.mergeToNewFilter(filter, {
                key: 'eb',
                value: value[0],
                enable: true,
              });
            }
            updates.filter = newFilter; // 需要更新filter回model;
            filter = newFilter;
            break;

          case 'defaultEBs':
            // TODO 需要添加进去
            // throw new Error("TODO 这个功能还没实现；")
            break;

          case 'notTranslate':
            notTranslate = value;
            updates.notTranslate = value;
            config.resetPagination = true;
            break;

          default:
            break;
        }
      });

      // * pager
      const pchange = payload.pagination;
      // need update pager?
      if (pchange || config.resetPagination || !pagination || !pagination.current || !pagination.pageSize) {
        newPagination = {
          // current: config.resetPagination ? 1 : (pchange && pchange.current ** zero bug** || pagination.current || 1,
          pageSize: (pchange && pchange.pageSize) || pagination.pageSize || sysconfig.MainListSize,
        };
        // 处理重置
        if (config.resetPagination) {
          newPagination.current = 1;
        } else {
          if (pchange && Object.prototype.hasOwnProperty.call(pchange, 'current')) { // and is number?
            newPagination.current = Math.max(pchange.current, 1); // make sure current >= 1
          } else {
            newPagination.current = pagination.current;
          }
        }
        pagination = newPagination;
        updates.pagination = pagination;
      }

      if (config.resetNotTranslate) {
        updates.notTranslate = false;
        notTranslate = false;
      }

      // * 设置sort 默认值
      config.filterHasEB = searchHelper.filterHasEB(filter);
      config.hasQuery = !searchHelper.isQueryEmpty(query);

      const defalutSortInEB = sysconfig.defalutSortInEB || 'name';
      const defalutSortInSearch = sysconfig.defalutSortInSearch || 'relevance';

      if (sort && sort.key) {
        // 有query且不是智库模式时，没有安时间排序的选项；因此默认给relevance；
        if (config.hasQuery && !config.filterHasEB && sort === 'time') {
          sort = { key: defalutSortInSearch };
        }
        // 从没有query到有query切换时，sort从name应该转到relevance
        if (config.hasQuery && config.filterHasEB && sort.key === 'name') {
          sort = { key: defalutSortInSearch };
        }
        // 没有query，不能按relevance排序，改成默认的name.
        if (!config.hasQuery && sort.key === 'relevance') {
          sort = { key: defalutSortInEB };
        }
      } else {
        if (config.hasQuery) {
          sort = { key: 'relevance' };
        } else if (config.filterHasEB) {
          sort = { key: defalutSortInEB }; // ! 如果需要改默认排序改这里！！！
        }
      }
      updates.sort = sort;

      const { schema, extra_ids } = payload;
      const params = {
        query,
        filter,
        sort,
        pagination, // basic search params
        smartQuery,
        assistantQuery: '', // intelligence search params
        schema,
        notTranslate,
        extra_ids,
      };

      if (payload.pageSize) {
        params.pagination.pageSize = payload.pageSize
      }


      console.log('SEARCH: ', params);
      console.log('SEARCH ME ????  : ', isEqual(params, oldParam));


      console.log('SEARCH config is : ', config);

      // * Call search
      const data = yield call(personSearchService.search, params, config);

      if (data && data.success) {
        const result = data.data || {};
        Object.keys(result).forEach(key => {
          const value = result[key];
          switch (key) {
            case 'aggregation':
              updates[key] = value;
              break;

            case 'items':
              // items 是强制的，如果返回结果没有items，那么也要强制置空；
              break;

            case 'total':
              if (updates.pagination) {
                updates.pagination.total = value;
              } else {
                updates.pagination = {
                  total: value, // write back total;
                };
              }
              break;

            case 'intellResults':
              updates.assistantData = value;
              break;

            case 'duration':
              updates.devinfo = {
                time: value,
              };
              break;
            case 'keyValues':
              // updates.keyValues = value;
              if (value.intellResults) {
                updates.assistantData = handleIntellResults(value.intellResults)
              }
              if (value.aggregation) {
                updates.aggregation = handleAggregation(value.aggregation)
              }
              if (value.topics) {
                updates.topics = value.topics
              }
              break;

            default:
              break;
          }
        });

        if (!notTranslate && result.keyValues && result.keyValues.intellResults && result.keyValues.intellResults.TranslatedText) {
          updates.translate = result.keyValues.intellResults.TranslatedText;
        } else  {
          updates.translate = null;
        }

        // 强制设置返回值；
        updates.results = result.items || [];

        yield put({ type: 'update', payload: updates });
      }
    }, { type: 'takeLatest' }],

    * getMoreKG({ payload }, { call, put }) {
      const { data } = yield call(personSearchService.create_dm_intellwords_expand, payload);
      yield put({ type: 'update', payload: { assistantData: data.items && data.items[0] } });
    },
  },
})

export default createSearchModel('searchperson');
