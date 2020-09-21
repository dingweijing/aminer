/* eslint-disable no-param-reassign */
import { sysconfig } from 'systems';
import { paperSearchService, searchService } from 'services/aminer';
import { wget } from 'utils/request-umi-request';
import consts from 'consts';
import cache from 'helper/cache';
import searchHelper from 'helper/search';

// const topicDataUrl = `${consts.ResourcePath}/data/topic/topics_new.json`;
const topicDataUrl = `${consts.ResourcePath}/data/topic/topics.json`;

const getSearchParams = (sort, query, isAdvanceSearchType, topicId, mustReadSortKey) => {
  // 因为 topic 而增加的额外参数
  const params = {};
  if (query && query.advanced || isAdvanceSearchType === true) {
    params.searchType = 'advance';
  }

  // params.mustReadSortKey = mustReadSortKey || 'year';

  if (sort && sort.key === 'latest') {
    params.searchTab = 'latest';
  }
  return params;
}

export default {
  namespace: 'searchpaper',

  state: {
    query: {},
    sort: {}, // { key, d }

    results: [], // search result.
    pagination: {
      total: null,
    },
    statistics: null,

    topic: null,
    topicId: null,

    topicList: null, // topic 首页 list

    sortOptions: null, // 根据是否有 topic 返回决定 sort bar
    // latestYearStart: null,  // 选择最新 tab 时，起始年份
    // latestYearEnd: null,

    hideTopicTip: null,  // topic 的提示是否隐藏

    paperLiked: [], // 已收藏的论文
    paperAllLiked: [],
    paperLikedPagination: {
      total: null
    },

    devinfo: {},

    filter: {},
    esSearchCondition: {},
    translate: null,  // 当前搜索词的翻译词
    notTranslate: false,  // 是否取消搜索词的自动翻译
    isAdvanceSearchType: false, // 搜索api传参时的 searchType 是否为 'advance'
    yearInterval: 1, // 论文右侧统计图的年份间隔
    mustReadSortKey: 'year', // 必读论文的排序
    // searchScope: ''
  },

  effects: {
    search: [function* f({ payload }, { call, put, select, all }) {
      const modeldata = yield select(state => ({
        query: state.searchpaper.query,
        pagination: state.searchpaper.pagination,
        sort: state.searchpaper.sort,
        filter: state.searchpaper.filter,
        esSearchCondition: state.searchpaper.esSearchCondition,
        notTranslate: state.searchpaper.notTranslate,
        topicId: state.searchpaper.topicId,
        isAdvanceSearchType: state.searchpaper.isAdvanceSearchType,
        yearInterval: state.searchpaper.yearInterval,
        mustReadSortKey: state.searchpaper.mustReadSortKey,
        // searchScope: state.searchpaper.searchScope,
      }));
      // console.log('modeldata', modeldata)
      let { query, sort, pagination, filter, esSearchCondition, notTranslate, topicId, isAdvanceSearchType, yearInterval, mustReadSortKey } = modeldata;

      const config = {
        resetPagination: false,
        hasNewPagination: false,
        resetMustReadSortKey: false,
      }

      // values need to update in reducer;
      const updates = {};

      // * pre-process changes

      Object.keys(payload).forEach(key => {
        const value = payload[key];
        switch (key) {
          case 'reset':
            if (value) {
              // searchScope = '';
              // updates.searchScope = '';
              config.resetPagination = true;
              config.resetNotTranslate = true;
              config.resetMustReadSortKey = true;
            }
            break;

          case 'query':
            query = value;
            updates.query = value;
            config.resetPagination = true;
            config.resetNotTranslate = true; // 更换query时获取query对应的翻译
            config.resetMustReadSortKey = true;
            break;

          case 'isAdvanceSearchType':
            isAdvanceSearchType = value;
            updates.isAdvanceSearchType = value;
            break;

          // case 'filterChange':
          //   // filterChange: [], the value is an array
          //   let newFilter = null;
          //   newFilter = Object.assign({}, filter);
          //   if (value && value.length) {
          //     value.forEach(item => {
          //       const { key, value: filterValue, enable } = item;
          //       if (enable) {
          //         newFilter[key] = filterValue
          //       } else {
          //         delete newFilter[key];
          //       }
          //     })
          //   }
          //   filter = newFilter;
          //   updates.filter = filter;
          //   config.resetPagination = true;
          //   break;

          case 'esSearchCondition':
            esSearchCondition = value;
            updates.esSearchCondition = value;
            config.resetPagination = true;
            config.resetMustReadSortKey = true;
            break;

          case 'sort':
            // 先假设一下sort是默认全排序的；
            sort = value;
            updates.sort = sort;
            config.resetPagination = true;
            config.resetMustReadSortKey = true;
            break;

          case 'notTranslate':
            notTranslate = value;
            updates.notTranslate = value;
            config.resetPagination = true;
            config.resetMustReadSortKey = true;
            break;

          case 'yearInterval':
            yearInterval = value;
            update.yearInterval = value;
            break;

          case 'mustReadSortKey':
            mustReadSortKey = value;
            updates.mustReadSortKey = value;
            break;

          // case 'search_scope':
          //   searchScope = value;
          //   updates.searchScope = value;
          //   break;

          default:
            break;
        }
      })


      // * pager
      const pchange = payload.pagination;
      // need update pager?
      if (pchange || config.resetPagination || !pagination || !pagination.current || !pagination.pageSize) {
        let newPagination = {
          current: config.resetPagination ? 1 : (pchange && pchange.current) || pagination.current || 1,
          pageSize: (pchange && pchange.pageSize) || pagination.pageSize || sysconfig.MainListSize,
        }
        pagination = newPagination;
        updates.pagination = pagination;
      }

      if (config.resetNotTranslate) {
        updates.notTranslate = false;
        notTranslate = false;
      }
      if (config.resetMustReadSortKey) {
        updates.mustReadSortKey = 'year';
      }
      // * 设置sort 默认值
      if ((!sort || !sort.key)) {
        sort = { key: 'relevance' }
      }
      updates.sort = sort;

      const { searchScope, haveDomains } = payload

      const topicSearchParams = getSearchParams(sort, query, isAdvanceSearchType, topicId, mustReadSortKey);

      const params = { query, sort, pagination, filter, esSearchCondition, notTranslate, yearInterval, searchScope, haveDomains, ...topicSearchParams };

      if (sort && sort.key === 'latest') {
        delete params.sort;
      }

      if (/^[\u4e00-\u9fa5]+/.test(query.query)) {
        params.switches = ['lang_en']
      } else {
        params.switches = ['lang_zh']
      }

      // * Call search
      // console.log('// ~~~~~~ search params, config :', params, config);
      const [timer, data] = yield all([
        updates.notTranslate && call(paperSearchService.loadingTimer, { time: 300 }), // 在删除翻译时，强制loading
        call(paperSearchService.search, params, config)
      ])
      if (updates.notTranslate) {
        clearTimeout(timer);
      }

      if (data && data.success) {
        const result = data.data || {};
        Object.keys(result).forEach(key => {
          const value = result[key];
          switch (key) {
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
            case 'meta':
              if (value && value.time) {
                updates.devinfo = {
                  time: value.time,
                };
              }
              break;
            case 'keyValues':
              updates.keyValues = value;
              break;
            default:
              break;
          }
        })

        if (result.keyValues) {
          if (result.keyValues.aggregation) {
            if (result.keyValues.aggregation.length === 0) {
              updates.statistics = {};
            } else {
              const aggrs = data.data.keyValues.aggregation;
              updates.statistics = searchHelper.convertAggrsToStatistics(aggrs, yearInterval);
            }
          }
          // if (result.keyValues.year_range) {
          //   const [start, end] = result.keyValues.year_range;
          //   updates.latestYearStart = String(start);
          //   updates.latestYearEnd = String(end);
          // } else {
          //   updates.latestYearStart = null;
          //   updates.latestYearEnd = null;
          // }
        }

        if (notTranslate || !result.intellResults || !result.intellResults.transText) {
          updates.translate = null;
        } else {
          updates.translate = result.intellResults.transText;
        }

        // 强制设置返回值；
        updates.results = result.items || [];
        yield put({ type: 'update', payload: updates });
      }
    }, { type: 'takeLatest' }],

    // 获取论文的聚合统计结果
    getAggregation: [function* G({ payload }, { call, put, select }) {
      const modeldata = yield select(state => ({
        query: state.searchpaper.query,
        sort: state.searchpaper.sort,
        notTranslate: state.searchpaper.notTranslate,
        esSearchCondition: state.searchpaper.esSearchCondition,
        topicId: state.searchpaper.topicId,
        yearInterval: state.searchpaper.yearInterval,
        isAdvanceSearchType: state.searchpaper.isAdvanceSearchType,
        mustReadSortKey: state.searchpaper.mustReadSortKey,
      }));
      let { query, sort, topicId, notTranslate, esSearchCondition, yearInterval, isAdvanceSearchType, mustReadSortKey } = modeldata;
      const updates = {};

      if (payload.yearInterval) {
        yearInterval = payload.yearInterval;
        updates.yearInterval = payload.yearInterval;
      }

      const topicSearchParams = getSearchParams(sort, query, isAdvanceSearchType, topicId, mustReadSortKey);

      const params = { query, esSearchCondition, notTranslate, yearInterval, ...topicSearchParams };
      if (sort && sort.key === 'latest') {
        delete params.sort;
      }


      if (/^[\u4e00-\u9fa5]+/.test(query.query)) {
        params.switches = ['lang_en']
      } else {
        params.switches = ['lang_zh']
      }

      const data = yield call(paperSearchService.getAggregation, params);
      if (data && data.data && data.data.keyValues && data.data.keyValues.aggregation) {
        if (data.data.keyValues.aggregation.length === 0) {
          updates.statistics = {};
        } else {
          const aggrs = data.data.keyValues.aggregation;
          updates.statistics = searchHelper.convertAggrsToStatistics(aggrs, yearInterval);
        }

        yield put({ type: 'update', payload: updates });
      }
    }, { type: 'takeLatest' }],

    getSearchFilter: [function* G({ payload }, { call, put, select }) {
      const modeldata = yield select(state => ({
        query: state.searchpaper.query,
        sort: state.searchpaper.sort,
        notTranslate: state.searchpaper.notTranslate,
        topicId: state.searchpaper.topicId,
        mustReadSortKey: state.searchpaper.mustReadSortKey,
        isAdvanceSearchType: state.searchpaper.isAdvanceSearchType,
        yearInterval: state.searchpaper.yearInterval,
      }));
      let { query, sort, topicId, notTranslate, isAdvanceSearchType, yearInterval, mustReadSortKey } = modeldata;

      if ((!sort || !sort.key)) {
        sort = { key: 'relevance' }
      }
      if (payload.sort) {
        sort = payload.sort;
      }
      if (payload.query) {
        query = payload.query;
      }

      const topicSearchParams = getSearchParams(sort, query, isAdvanceSearchType, topicId, mustReadSortKey);
      const params = { query, sort, notTranslate, yearInterval, ...topicSearchParams };
      if (sort && sort.key === 'latest') {
        delete params.sort;
      }

      if (/^[\u4e00-\u9fa5]+/.test(query.query)) {
        params.switches = ['lang_en']
      } else {
        params.switches = ['lang_zh']
      }

      const data = yield call(paperSearchService.getSearchFilter, params);
      if (data && data.data && data.data.keyValues && data.data.keyValues.aggregation) {
        const aggrs = data.data.keyValues.aggregation;
        const statistics = searchHelper.convertAggrsToStatistics(aggrs, yearInterval);
        yield put({ type: 'update', payload: { statistics_all: statistics } });
      }
      return false;
    }, { type: 'takeLatest' }],

    getTopic: [function* G({ payload }, { call, put, select }) {
      const { alltopic } = payload;
      const data = yield call(paperSearchService.getTopic, payload);
      let status = false;
      let updates = { topic: null, topicId: null, sort: { key: 'relevance' }, sortOptions: null };

      if (data && data.data && data.data.topics && data.data.topics.length) {
        const topic = data.data.topics[0];
        const { id } = topic;
        if (alltopic || (sysconfig.Topic_Open_Ids && sysconfig.Topic_Open_Ids.includes(id))) {  // payload 带 alltopic 参数或者该 topic 开放
          updates = { topic, topicId: id };
          status = true;
        }
      }

      yield put({ type: 'update', payload: updates });
      return status;
    }, { type: 'takeLatest' }],

    * listTopic({ payload }, { call, put }) {
      // const data = yield call(paperSearchService.listTopic);
      // if (data && data.data && data.data.succeed) {
      //   yield put({
      //     type: 'update', payload: {
      //       topicList: data.data
      //     }
      //   });
      // }
      const data = yield wget(topicDataUrl);
      yield put({
        type: 'update',
        payload: {
          topicList: data || [],
        }
      });
    },

    * updateTopicEnable({ payload }, { call, put }) {
      const data = yield call(paperSearchService.updateTopicEnable, payload);
      if (data && data.data && data.data.succeed) {
        return true;
      }
    },

    * updateTopic({ payload }, { call, put }) {
      const data = yield call(paperSearchService.updateTopic, payload);
      if (data && data.data && data.data.succeed) {
        return true;
      }
    },

    * CreatePubTopic({ payload }, { call, put }) {
      const data = yield call(paperSearchService.CreatePubTopic, payload);
      if (data && data.data && data.data.succeed) {
        return true;
      }
    },

    * UpdateMustReadingPub({ payload }, { call, put }) {
      const data = yield call(paperSearchService.UpdateMustReadingPub, payload);
      if (data && data.data && data.data.succeed) {
        return true;
      }
    },

    * DeleteMustReadingPub({ payload }, { call, put }) {
      const data = yield call(paperSearchService.DeleteMustReadingPub, payload);
      if (data && data.data && data.data.succeed) {
        return true;
      }
    },

    * setLike({ payload }, { call, put }) {
      const data = yield call(paperSearchService.like, payload);
      if (data && data.data && data.data.succeed) {
        return data.data;
      }
    },

    * setTread({ payload }, { call, put }) {
      const data = yield call(paperSearchService.tread, payload);
      if (data && data.data && data.data.succeed) {
        return data.data;
      }
    },

    * tmpLike({ payload }, { call, put }) {
      const data = yield call(paperSearchService.tmpLike, payload);
      if (data && data.data && data.data.succeed) {
        return data.data;
      }
    },

    * tmpTread({ payload }, { call, put }) {
      const data = yield call(paperSearchService.tmpTread, payload);
      if (data && data.data && data.data.succeed) {
        return data.data;
      }
    },

    getPaperCollected: [function* G({ payload }, { call, put, select }) {
      const modeldata = yield select(state => ({
        paperLiked: state.searchpaper.paperLiked,
      }));
      const { paperLiked } = modeldata;
      const { data } = yield call(paperSearchService.getPaperCollected, payload);
      if (data && data.data && data.data.length) {
        if (payload.offset > 0) {
          yield put({
            type: 'update',
            payload: {
              paperLiked: paperLiked.concat(data.data),
            }
          });
        } else {
          yield put({
            type: 'update',
            payload: {
              paperLiked: data.data,
              paperLikedPagination: { total: data.count },
            }
          });
        }
        return { count: data.count, data: data.data };
      }
    }, { type: 'takeLatest' }],

    * getAllPaperCollected({ payload }, { call, put }) {
      const { data } = yield call(paperSearchService.getPaperCollected, payload);
      yield put({
        type: 'update',
        payload: { paperAllLiked: data && data.data || [] }
      })
    },

    * Subscribe({ payload }, { call, put }) {
      const data = yield call(paperSearchService.Subscribe, payload);
      if (data && data.data && data.data.succeed) {
        return true;
      }
    },

    * Suggest({ payload }, { call, put }) {
      const data = yield call(paperSearchService.suggestTopic, payload);
      if (data) {
        return true;
      }
    },

    * getPaperRelatedWork({ payload }, { call, put, select }) {
      const data = yield call(paperSearchService.getPaperRelatedWork, payload);
      if (data && data.data && data.data.succeed) {
        return data.data.data;
      }
    },

    * getHideTopicTip({ paylaod }, { put }) {
      const hideTipCache = new cache.LocalStorageCache({
        key: 'hide-topic-tip', alwaysLoad: false, expires: 1000 * 60 * 60 * 24, // 24 hours
      });
      let result = null;
      const value = hideTipCache.loadCacheValue();
      if (hideTipCache.isCacheValid()) {
        result = value;
      }
      yield put({ type: 'update', payload: { hideTopicTip: result } })
    },

    * setHideTopicTip({ payload }, { put }) {
      const hideTipCache = new cache.LocalStorageCache({
        key: 'hide-topic-tip', alwaysLoad: false, expires: 1000 * 60 * 60 * 24, // 24 hours
      });
      if (hideTipCache.shouldLoad()) {
        if (hideTipCache.shouldUpdate(true)) {
          hideTipCache.updateCache(true);
        }
      }
      yield put({ type: 'update', payload: { hideTopicTip: true } });
    },

    * paperMark({ payload }, { call, put }) {
      const { id } = payload;
      const { data, success } = yield call(searchService.PaperMark, { id });
      if (data) {
        yield put({ type: 'paperMarkSuccess', payload });
        return { data, success };
      }
      return null;
    },

    * paperUnMark({ payload }, { call, put }) {
      const { id } = payload;
      const { data, success } = yield call(searchService.PaperUnMark, { id });
      if (data) {
        yield put({ type: 'paperUnMarkSuccess', payload });
        return { data, success };
      }
      return null;
    },
  },

  reducers: {
    toggleAdvancedSearch(state) {
      state.isAdvancedSearch = !state.isAdvancedSearch;
    },

    // TODO 动态
    update(state, { payload }) {
      Object.keys(payload).forEach(key => {
        const value = payload[key];
        state[key] = value;
      })
    },

    reset(state) { // reset parameters without query;
      //   query: {},
      state.sort = {}
      state.results = null
      state.pagination = { total: null }
      state.aggregation = null;
      state.notTranslate = false;
      state.translate = null;
      state.topic = null;
      // state.latestYearStart = null;
      // state.latestYearEnd = null;
      // state.paperLiked = null;
      // state.paperLikedPagination = { total: null };
    },

    paperMarkSuccess(state, { payload: { paper } }) {
      state.paperLiked = [...state.paperLiked, paper];
      state.paperAllLiked = [...state.paperAllLiked, paper];
      state.paperLikedPagination.total = state.paperLikedPagination.total + 1;
    },


    paperUnMarkSuccess(state, { payload }) {
      const { id } = payload;
      // TODO: 这块暂时不做了，数据貌似是没关联，放到了state里面，没法处理
      // for (const index in state.results) {
      //   if (state.results[index].id === id) {
      //     console.log('-------', JSON.stringify(state.results[index]));
      //     state.results[index].is_starring = false
      //     state.results[index].num_starred = state.results[index].num_starred - 1
      //   }
      // };
      // state.results = state.results;
      state.paperLiked = state.paperLiked.filter(item => item.id !== id);
      state.paperAllLiked = state.paperAllLiked.filter(item => item.id !== id);
      state.paperLikedPagination.total = state.paperLikedPagination.total - 1;
    },

    resetTopicList(state) {
      state.topicList = null;
    },

    resetStatisticsAll(state) {
      state.statistics_all = null
    }

  }
}
