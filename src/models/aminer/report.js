/* eslint-disable no-param-reassign */

import { sysconfig } from 'systems';
import { reportService } from 'services/aminer';
import { takeLatest } from 'utils/helper';

export default {
  namespace: 'report',

  state: {
    reportList: null,
    dailyList: null,
    report: null,
    rankList: null,
    total: 0,
    keywords: null,
    ads: null,
  },

  subscriptions: {},

  effects: {
    getReportList: [function* G({ payload }, { call, put }) {
      const { data } = yield call(reportService.getReportList, payload);
      if (data && data.success && data.data) {
        yield put({ type: 'setReportList', payload: { data: data.data.data, total: data.data.total } });
      }
    }, takeLatest],

    * getReport({ payload }, { put, call }) {
      const data = yield call(reportService.getReport, payload);
      if (data && data.data && data.data.data) {
        yield put({
          type: 'getReportSuccess',
          payload: data.data.data
        })
      }
      return null;
    },

    * getDailyNews({ payload }, { put, call }) {
      const { data } = yield call(reportService.getDailyNews, payload);
      yield put({ type: 'setDailyNews', payload: { list: data.data } })
    },

    * getRosterAward({ payload }, { put, call }) {
      const data = yield call(reportService.getRosterAward, payload);
      if (data) {
        return data.data;
      }
      return null;
    },

    * addViewById({ payload }, { put, call }) {
      yield call(reportService.addViewById, payload);
    },

    * getReportRank({ payload }, { put, call }) {
      const data = yield call(reportService.getReportRank, payload);
      if (data && data.data && data.data.data) {
        yield put({ type: 'setRankList', payload: { data: data.data.data } });
      }
    },

    * getKeywords({ payload }, { put, call }) {
      const data = yield call(reportService.getKeywords, payload);
      if (data && data.data && data.data.data) {
        yield put({ type: 'setKeywords', payload: { data: data.data.data } });
      }
    },

    * getReportListByKey({ payload }, { put, call }) {
      const data = yield call(reportService.getReportListByKey, payload);
      if (data && data.success && data.data && data.data.data) {
        yield put({ type: 'setReportList', payload: { data: data.data.data.data, total: data.data.data.total } });
      }
    },

    * getAds({ payload }, { put, call }) {
      const data = yield call(reportService.getAds);
      if (data && data.success && data.data && data.data.data && data.data.data) {
        yield put({ type: 'setAds', payload: { ads: data.data.data.ads } });
      }
    },

    * setUserLiked({ payload }, { put, call }) {
      const data = yield call(reportService.setUserLiked, payload);
      return data && data.success;
    },
  }, 

  reducers: {
    initReportList(state, { payload }) {
      state.reportList = null;
    },

    setReportList(state, { payload }) {
      const { data, total } = payload;
      if (data) {
        state.reportList = data;
      }
      if (total) {
        state.total = total;
      }
    },

    setRankList(state, { payload }) {
      const { data } = payload;
      if (data && data[0]) {
        state.rankList = data[0];
      }
    },

    setKeywords(state, { payload }) {
      const { data } = payload;
      if (data) {
        state.keywords = data;
      }
    },

    setAds(state, { payload }) {
      const { ads } = payload;
      if (ads) {
        state.ads = ads;
      }
    },

    setDailyNews(state, { payload }) {
      const { list } = payload;
      const result = list && list.map((item, index) => {
        const params = {
          href: `/research_report/${item._id}?download=false`, ...item
        };
        // if (index === 0) {
        //   params.type = 'hot'
        // }
        // if (index === 1) {
        //   params.type = 'new'
        // }
        return params
      })
      state.dailyList = result
    },

    getReportSuccess(state, { payload }) {
      state.report = payload;
    },

    changeReportList(state, { payload }) {
      const { index } = payload;
      state.reportList[index].like += 1;
      state.reportList[index].curUserLiked = true;
    }
  },
};
