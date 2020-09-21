import { sysconfig } from 'systems';
import { confService } from 'services/aminer';
import { wget } from 'utils/request-umi-request';
import consts from 'consts';

const confs_dataurl = `${consts.ResourcePath}/data/conf/`;
const workshop_file = 'workshop.json';
const invited_talk_file = 'invited_talk.json';
const jiedu_file = 'jiedu.json';
const config = 'config.json';

const oldConfDict = {
  nips2019: 'NIPS 2019',
  bibm2019: 'BIBM 2019',
  bigdata2019: 'BIGDATA 2019',
  bigdata2018: 'BIGDATA 2018',
  bigdata2017: 'BIGDATA 2017',
  bibm2018: 'BIBM 2018',
  bibm2017: 'BIBM 2017',
  airs2016: 'AIRS 2016',
  nlpcc2016: 'NLPCC 2016',
  cikm2016: 'CIKM 2016',
  bigdata2016: 'BIGDATA 2016',
  bibm2016: 'BIBM 2016',
  mifs2016: 'MIFS 2016',
};
const oldConfShortName = [
  'nips2019',
  'bibm2019',
  'bigdata2019',
  'bigdata2018',
  'bigdata2017',
  'bibm2018',
  'bibm2017',
  'airs2016',
  'nlpcc2016',
  'cikm2016',
  'bigdata2016',
  'bibm2016',
  'mifs2016',
];
export default {
  namespace: 'aminerConf',

  state: {
    wechatVer: false,
    filters: {},
    clickedPid: '',
    isMobileClickMenu: false,
    searchQuery: null,
    confList: null,
  },

  subscriptions: {},

  effects: {
    *setSysTrack({ payload }, { call, put }) {
      yield call(confService.setSysTrack, payload);
    },
    *getConfList({ payload }, { call, put }) {
      const { needReturn = true, setView = false } = payload;
      const { data } = yield call(confService.getConfList, payload);
      if (!needReturn) {
        yield put({ type: 'getConfListSuccess', payload: data });
      }
      if (data) {
        // TODO: 需要获取view，只有list需要计算view
        if (setView) {
          for (let i = 0; i < data.items.length; i += 1) {
            const { short_name, id } = data.items[i];
            if (oldConfShortName.includes(short_name)) {
              // 获取old conf view
              const oldConfdata = yield call(confService.getOldConfView, {
                track: oldConfDict[short_name],
              });
              if (oldConfdata.data && oldConfdata.data.res) {
                const { res } = oldConfdata.data;
                let currentView = 0;
                res.map(session => {
                  currentView = session.pubs.reduce((viewRes, cur) => {
                    return viewRes + cur.num_viewed;
                  }, currentView);
                  return currentView;
                });
                data.items[i].view = currentView;
              }
            } else {
              // 获取 new conf view
              const newConfView = yield call(confService.setOrGetClickView, {
                type: 'getClick',
                id,
              });
              data.items[i].view = newConfView.data.data;
            }
          }
        }
        yield put({ type: 'getConfIndexListSuccess', payload: data });
        return data;
      }
    },

    *delConfById({ payload }, { call }) {
      const { data } = yield call(confService.delConfById, payload);
      if (data && data.succeed) {
        return data;
      }
    },

    *GetUserLikePubs({ payload }, { call }) {
      const { data } = yield call(confService.GetUserLikePubs, payload);
      if (data.succeed) {
        return data;
      }
    },

    *RunCache({ payload }, { call }) {
      const { data } = yield call(confService.RunCache, payload);
      if (data && data.succeed) {
        return data;
      }
    },

    *getSchedule({ payload }, { call }) {
      const { data } = yield call(confService.getSchedule, payload);
      if (data) {
        return data;
      }
    },

    *AlterConfs({ payload }, { call }) {
      // {
      //   "operator": "delete",
      //   "fields": [{
      //     "field": "id",
      //     "value": "5e4bdf9393d709897cbe8cbe"
      // }]
      // insert
      // update
      const { data } = yield call(confService.AlterConfs, payload);
      if (data && data.succeed) {
        return data;
      }
    },
    *CreateConf({ payload }, { call }) {
      const { data } = yield call(confService.CreateConf, payload);
      if (data && data.succeed) {
        return data;
      }
    },
    *UpdateConf({ payload }, { call }) {
      const { data } = yield call(confService.UpdateConf, payload);
      if (data && data.succeed) {
        return data;
      }
    },

    *GetTimeTable({ payload }, { call }) {
      const { data } = yield call(confService.GetTimeTable, payload);
      if (data) {
        return data;
      }
    },
    *GetLikePapers({}, { call }) {
      const { data } = yield call(confService.GetLikePapers);
      if (data && data.length > 0) {
        return data[0];
      }
    },
    *setLikePaper({ payload }, { call }) {
      const { data } = yield call(confService.setLikePaper, payload);
      if (data && data.succeed) {
        return true;
      }
    },

    *GetArticlesByConfID({ payload }, { call }) {
      try {
        const { data } = yield call(confService.GetArticlesByConfID, payload);
        if (data && data.keyValues) {
          return data.keyValues;
        }
        return data.keyValues;
      } catch (e) {
        console.log('后端没有数据报错');
      }
    },

    *GetUsrVoted({ payload }, { call }) {
      const { data } = yield call(confService.GetUsrVoted, payload);
      if (data.succeed) {
        return data.item;
      }
      return null;
    },
    *GetMostViewPubs({ payload }, { call }) {
      const { data } = yield call(confService.GetMostViewPubs, payload);
      if (data.succeed) {
        return data;
      }
    },
    // *ListConfPubs({ payload }, { call }) {
    //   const { data } = yield call(confService.ListConfPubs, payload);
    //   if (data.succeed) {
    //     return data;
    //   }
    // },
    *GetMostLikePubs({ payload }, { call, put }) {
      const GetMostLikePubsData = yield call(confService.GetMostLikePubs, payload);
      // if (data.succeed) {
      //   return data.data;
      // }
      yield put({
        type: 'GetMostLikePubsSuccess',
        payload: GetMostLikePubsData,
      });
    },
    *AlterSchedules({ payload }, { call }) {
      const { data } = yield call(confService.AlterSchedules, payload);
      if (data.succeed) {
        return data;
      }
    },
    *CreateSchedule({ payload }, { call }) {
      const { data } = yield call(confService.CreateSchedule, payload);
      if (data.succeed) {
        return data;
      }
    },
    // *ListSchedule({ payload }, { call }) {
    //   const { data } = yield call(confService.ListSchedule, payload);
    //   if (data.succeed) {
    //     return data;
    //   }
    // },
    *DeleteSchedule({ payload }, { call }) {
      const { data } = yield call(confService.DeleteSchedule, payload);
      if (data.succeed) {
        return data;
      }
    },
    *GetKeywords({ payload }, { call }) {
      const { data } = yield call(confService.GetKeywords, payload);
      if (data && data.data) {
        return data.data;
      }
      return null;
    },
    *GetPubsByKeywords({ payload }, { call }) {
      const { data } = yield call(confService.GetPubsByKeywords, payload);
      if (data.succeed) {
        return data;
      }
    },
    *GetRecommendPubs({ payload }, { call }) {
      const { data } = yield call(confService.GetRecommendPubs, payload);
      if (data.succeed) {
        return data;
      }
    },
    *GetUserLikeKeywords({ payload }, { call }) {
      const { data } = yield call(confService.GetUserLikeKeywords, payload);
      if (data && data.data) {
        return data.data;
      }
      return null;
    },
    *GetUserLikePubsByKeywords({ payload }, { call }) {
      const { data } = yield call(confService.GetUserLikePubsByKeywords, payload);
      if (data.succeed) {
        return data;
      }
    },
    *setOrGetClickView({ payload }, { call }) {
      const { data } = yield call(confService.setOrGetClickView, payload);
      if (data.success) {
        return data.data;
      }
    },
    // *GetFilterPubs({ payload }, { call }) {
    //   const { data } = yield call(confService.GetFilterPubs, payload);
    //   if (data.succeed) {
    //     return data;
    //   }
    // },
    *SearchAuthors({ payload }, { call, put }) {
      const { shortSchema } = payload;
      const SearchAuthorsData = yield call(confService.SearchAuthors, payload);
      if (shortSchema) {
        yield put({
          type: 'SearchAuthorsSuccess',
          payload: { ...SearchAuthorsData, coverage: false },
        });
      } else {
        return SearchAuthorsData && SearchAuthorsData.data;
      }

      // if (data.succeed) {
      //   return data && data.data;
      // }
    },

    *AddSchedulePubsByIds({ payload }, { call }) {
      const { data } = yield call(confService.AddSchedulePubs, payload);
      if (data && data.succeed) {
        return true;
      }
    },

    // TODO: 4月10
    *SearchSchedule({ payload }, { call }) {
      const { data } = yield call(confService.SearchSchedule, payload);
      if (data && data.data) {
        return data.data || {};
      }
      return null;
    },
    *SearchPubs({ payload }, { call }) {
      const { data } = yield call(confService.SearchPubs, payload);
      if (data && data.succeed) {
        return data || {};
      }
    },
    *GetPubsByIds({ payload }, { call }) {
      const { data } = yield call(confService.GetPubsByIds, payload);
      if (data && data.succeed) {
        return data.items || [];
      }
    },
    *searchInConf({ payload }, { call }) {
      const { data } = yield call(confService.searchInConf, payload);
      if (data && data.succeed) {
        return data || {};
      }
    },
    *getWorkshop({}, { put }) {
      const data = yield wget(confs_dataurl + workshop_file);
      if (data) {
        return data;
      }
      return false;
      // yield put({ type: 'getFemaleAwardRosterSuccess', payload: { data } });
    },
    *getInvitedTalk({}, { put }) {
      const data = yield wget(confs_dataurl + invited_talk_file);
      if (data) {
        return data;
      }
      return false;
    },
    *getInterpretation({ payload }, { put }) {
      const { id, type = 'jiedu', directReturnData = false } = payload;
      const data = yield wget(confs_dataurl + `${id}_${type}.json`);
      if (data && !directReturnData) {
        yield put({ type: 'getInterpretationSuccess', payload: { data, type } });
      }
      if (data && directReturnData) {
        return data;
      }
      return false;
    },
    *GetPubsBySId({ payload }, { call, put, all }) {
      const { data } = yield call(confService.GetPubsBySId, payload);
      if (data && data.succeed) {
        return data.items || {};
      }
    },
    *getOldConfView({ payload }, { call }) {
      const { key } = payload;
      const { data } = yield call(confService.getOldConfView, payload);
      if (data && data.res) {
        return { [key]: data.res } || { [key]: [] };
      }
    },
    *getConfig({ payload }, { put }) {
      const data = yield wget(confs_dataurl + config);
      if (data) {
        return data;
      }
    },
    *AddConfPubs({ payload }, { call, put }) {
      const { data } = yield call(confService.AddConfPubs, payload);
      if (data) {
        return data || [];
      }
    },
    *DelConfPubs({ payload }, { call, put }) {
      const { data } = yield call(confService.DelConfPubs, payload);
      if (data) {
        return data || [];
      }
    },
    *UpdateBestPaper({ payload }, { call, put }) {
      const { data } = yield call(confService.UpdateBestPaper, payload);
      if (data) {
        return data || [];
      }
    },
    // TODO: 未完成
    *getConfBaseData({ payload }, { call, put, all, wget }) {
      const {
        timeTalePayload,
        viewPayload,
        keywordsPayload,
        searchAuthorsPayload,
        searchPubsPayload,
        coverage,
      } = payload;
      const [
        GetTimeTableData,
        GetMostViewPubsData,
        GetKeywordsData,
        SearchAuthorsData,
        SearchPubsData,
      ] = yield all([
        call(confService.GetTimeTable, timeTalePayload),
        call(confService.GetMostViewPubs, viewPayload),
        call(confService.GetKeywords, keywordsPayload),
        call(confService.SearchAuthors, searchAuthorsPayload),
        call(confService.SearchPubs, searchPubsPayload),
      ]);
      yield all([
        put({
          type: 'GetTimeTableSuccess',
          payload: GetTimeTableData,
        }),
        put({
          type: 'GetMostViewPubsSuccess',
          payload: GetMostViewPubsData,
        }),
        put({
          type: 'GetKeywordsSuccess',
          payload: GetKeywordsData && GetKeywordsData.data,
        }),
        put({
          type: 'SearchAuthorsSuccess',
          payload: { ...SearchAuthorsData, coverage },
        }),
        put({
          type: 'SearchPubsSuccess',
          payload: (SearchPubsData && SearchPubsData.data) || {},
        }),
      ]);
    },
  },

  reducers: {
    GetTimeTableSuccess(state, { payload }) {
      state.timeTable = payload.data && payload.data.items;
    },
    getConfIndexListSuccess(state, { payload }) {
      console.log("reducer=-----", payload)
      state.confList = payload || {};
    },
    getConfListSuccess(state, { payload }) {
      const confInfo = payload && payload.items && payload.items[0];
      if (confInfo) {
        if (confInfo.config) {
          confInfo['config'] = JSON.parse(confInfo.config);
        }
        if (conferenceConfig[confInfo.id]) {
          confInfo['config'] = conferenceConfig[confInfo.id];
        }
      }
      state.confInfo = confInfo || {};
    },
    GetMostViewPubsSuccess(state, { payload }) {
      const { data } = payload;
      state.MostViewPubsData = data && data.items;
    },
    GetMostLikePubsSuccess(state, { payload }) {
      const { data } = payload;
      state.GetMostLikePubsData = data && data.items;
    },
    GetKeywordsSuccess(state, { payload }) {
      state.KeywordsList = payload && payload.items;
    },
    SearchAuthorsSuccess(state, { payload }) {
      const { data, coverage } = payload;
      if (state.SearchAuthorsData && !coverage) {
        const moreData = state.SearchAuthorsData.items.concat(data.items);
        state.SearchAuthorsData.items = moreData;
      } else {
        state.SearchAuthorsData = data;
      }
    },
    SearchPubsSuccess(state, { payload }) {
      state.SearchPubsData = payload;
    },
    clearGetInitialData(state, { payload }) {
      state.SearchAuthorsData = null;
    },

    setWechatVer(state, { payload }) {
      const { ver } = payload;
      state.wechatVer = ver;
    },

    getInterpretationSuccess(state, { payload }) {
      const { data, type } = payload;
      if (type === 'jiedu') {
        state.interpretation = data;
      } else {
        state[`${type}Data`] = data;
      }
    },

    setisMobileClickMenu(state, { payload }) {
      state.isMobileClickMenu = payload;
    },

    updateFilters(state, { payload }) {
      Object.entries(payload).map(([key, value]) => {
        if (key !== 'category') {
          state.searchQuery = null;
        }
        if (state.filters[key] === value) {
          if (key === 'date') {
            if (
              state.filters.date === payload.date &&
              state.filters.time_of_day === payload.time_of_day
            ) {
              delete state.filters[key];
            }
          } else {
            delete state.filters[key];
          }
        } else {
          if (!state.filters[key] || state.filters[key] !== value) {
            state.filters[key] = value;
          }
        }
        return state;
      });
    },
    clearFilters(state) {
      const { category } = state.filters || {};
      state.filters = {};
      if (category) {
        state.filters.category = category;
      }
      return state;
    },
    clearFiltersCategory(state) {
      state.filters.category = null;
      return state;
    },
    // TODO: 这个方法可以增强 把clearFiltersCategory整合一起
    updateStateByKey(state, { payload }) {
      // state[Object.keys(payload)[0]] = Object.values(payload)[0];
      Object.entries(payload).map(([key, value]) => (state[key] = value));
      return state;
    },
  },
};
const getLikeCountByPubIds = sessions => {
  let ids = [];
  sessions &&
    sessions.length > 0 &&
    sessions.map(session => {
      if (session.pubs && session.pubs.length > 0) {
        ids = session.pubs.reduce((res, cur) => {
          res.push(cur.id);
          return res;
        }, []);
      }
    });
  return ids;
};
const conferenceConfig = {
  '5eb8f3f192c7f9be2111e178': {
    breadcrumb: true,
    navigator: ['homepage', 'recommend', 'news', 'like', 'comments'],
    left: ['keywords', 'leftAuthors'],
    right: ['insight'],
    paper: {
      navigator: ['paper', 'authors', 'session'],
      category: ['Poster', 'Spotlight', 'Oral'],
    },
    tdk: {
      pageTitle: 'CVPR2020-学术会议',
      pageDesc:
        'CVPR2020 会议涵盖了论文列表、作者列表、论文解读和论文推荐，提供一个全方位分析会议的平台',
      pageKeywords: 'CVPR2020, cvpr, cvpr学术会议',
    },
  },
  '5eb91bfd92c7f9be212e5d05': {
    breadcrumb: true,
    navigator: ['homepage', 'recommend', 'news', 'like', 'comments'],
    left: ['keywords', 'leftAuthors'],
    right: ['insight'],
    paper: {
      navigator: ['paper', 'authors'],
      category: ['Poster', 'Spotlight', 'Oral'],
    },
    tdk: {
      pageTitle: 'ACL2020-学术会议',
      pageDesc:
        'ACL2020 会议涵盖了论文列表、作者列表、论文解读和论文推荐，提供一个全方位分析会议的平台',
      pageKeywords: 'ACL2020, acl, acl学术会议',
    },
  },
};
