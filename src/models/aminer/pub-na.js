/* eslint-disable no-param-reassign */

import { sysconfig } from 'systems';
import { rankService, paperSearchService } from 'services/aminer';

export default {

  namespace: 'pub-na',

  state: {

  },

  subscriptions: {},
  effects: {

    * getNaResult({ payload }, { call, put }) {
      const { data } = yield call(rankService.getNaResult, payload);
      yield put({ type: 'getNaResultSuccess', payload: { data: data.data } });
      if (data) {
        return data;
      }
      return null;
    },

    // * getPaperInfo({ payload }, { call, put }) {
    //   const { data } = yield call(paperSearchService.searchPaperById, payload);
    //   if (data && data.items) {
    //     return data.items;
    //   }
    //   return null;
    // },

    // GetPaperInfo
    * getNaPaperInfo({ payload }, { call, put }) {
      const { data } = yield call(rankService.getNaPaperInfo, payload);
      if (data && data.items) {
        return data.items;
      }
      return null;
    },

    * getAuthorList({ payload }, { call, put }) {
      const { data } = yield call(rankService.getAuthorList, payload);
      if (data && data.items) {
        return data.items;
      }
      return null;
    },

    * userFeedback({ payload }, { call, put }) {
      const { data } = yield call(rankService.userFeedback, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * CreatePaperAuthor({ payload }, { call, put }) {
      const { data } = yield call(rankService.CreatePaperAuthor, payload);
      // console.log('CreatePaperAuthor', data);
      if (data) {
        return data;
      }
      return null;
    },


  },

  reducers: {

    getNaResultSuccess(state, { payload: { data } }) {
      state.candidateRankInfo = data;
    },
  }
};
