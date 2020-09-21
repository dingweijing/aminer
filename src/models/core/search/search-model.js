/* eslint-disable prefer-destructuring,no-unused-expressions,no-param-reassign,no-lonely-if */
import { sysconfig } from 'systems';
import { personSearchService } from 'services/search';
import searchHelper from 'helper/search';

export const createSearchModel = namespace => ({

  namespace,

  state: {
    query: {},
    filter: {},
    sort: {}, // { key, d }

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

    // rename from assistantDataMeta { texts, isNotAffactedByAssistant, typesTotals<扩展词或者上下位次的个数> }
    smartQuery: { isNotAffactedByAssistant: true },
    assistantData: null, // api返回的结果

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
        const { query, filter, sort, pagination, smartQuery } = state[namespace]
        return { query, filter, sort, pagination, smartQuery }
      });
      let { query, filter, sort, pagination, smartQuery } = modeldata; // almost all data get back;
      console.log('DEBUG::::', modeldata)

      // console.log("[Effects::search] !!!!!!! searchmodel.Search:: Param is ", payload);
      // console.log("[Effects::search] !!!!!!! searchmodel.debug:: old superquery is ", { query, pagination, filter, sort });

      // switch configs passed to service.search.
      const config = {
        useAggregation: false, // need to recalculate aggregation.
        filterHasEB: false, // has eb restriction in filter.
        hasQuery: true, // has query or advanced query.

        resetPagination: false,
        hasNewPagination: false,
        resetFilter: false,
      };

      // values need to update in reducer;
      const updates = {};

      let newPagination = null;
      let newFilter = null;
      const smartQueryNotAffacted = false; // ???

      // * pre-process changes
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
            console.warn('lllllll smartQuery is :', value)
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
            console.warn('>>>>smartQuery----', smartQuery)

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
            // config.resetPagination = true;

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

      const { schema, haves } = payload;
      const params = {
        query,
        filter,
        sort,
        pagination, // basic search params
        smartQuery,
        assistantQuery: '', // intelligence search params
        schema,
        haves,
      };

      if (payload.pageSize) {
        params.pagination.pageSize = payload.pageSize
      }

      // TODO Gao
      // if no query and no eb
      // if (!config.filterHasEB && !config.hasQuery) {
      //   updates.results = [];
      //   yield put({ type: 'update', payload: updates });
      //   return;
      // }

      // TODO fix thu 特殊需求，小北改的，2019-8-5

      // console.log('params', params, payload);
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
              updates.keyValues = value;
              break;


            default:
              break;
          }
        });

        // 强制设置返回值；
        updates.results = result.items || [];

        yield put({ type: 'update', payload: updates });
      }
    }, { type: 'takeLatest' }],

    * getMoreKG({ payload }, { call, put }) {
      const { data } = yield call(personSearchService.create_dm_intellwords_expand, payload);
      yield put({ type: 'update', payload: { assistantData: data.items && data.items[0] } });
    },

    * searchByEb({ payload }, { call }) {
      const { ebid, size } = payload;
      const config = {
        useAggregation: true,
        filterHasEB: ebid,
        hasQuery: false,
        resetPagination: false,
        hasNewPagination: false,
        resetFilter: false
      };
      const params = {
        query: { query: null },
        filter: { eb: { id: ebid } },
        pagination: { pageSize: size },
        smartQuery: { isNotAffactedByAssistant: true }
      };
      const data = yield call(personSearchService.search, params, config);
      if (data.success) {
        return data;
      }
      return false;
    }
  },
})

export default createSearchModel('searchmodel');

// TODO: return true to clear assistant; ?????
// const checkSmartClear = ({ prevTexts, texts, dispatch, assistantData }) => {
//   console.log(">>>>>>>>>>>>>20934802938487", checkSmartClear)
//   if (!assistantData) {
//     console.error('Error! assistantData Can not be null.');
//     return;
//   }
//   if (!prevTexts) {
//     // can't be null.
//   }
//   if (!texts || texts.length <= 0) {
//     // TODO no results?
//   }
//   const expandWordItem = texts && texts.find(term => term.source === 'expands');
//   const expandWord = expandWordItem && expandWordItem.text;
//   if (expandWord) {
//     let prevExpandWord;
//     const prevExpandWordItem = prevTexts && prevTexts.find(term => term.source === 'expands');
//     if (!prevExpandWordItem) {
//       prevExpandWord = assistantData.abbr && assistantData.abbr.length > 0
//         && assistantData.abbr[0].word;
//     } else {
//       prevExpandWord = prevExpandWordItem && prevExpandWordItem.text;
//     }
//     if (expandWord !== prevExpandWord) {
//       // here we clear kg data.
//       if (dispatch) {
//         // const { modelName, dispatch } = this.props;
//         // TODO don;t call this. just hide.
//         // dispatch({ type: `${modelName}/clearAssistantDataMeta` });
//         dispatch({ type: 'search/clearSearchAssistantKG' });
//       }
//     }
//   }
// };
