/*
 * @Author: your name
 * @Date: 2019-12-03 10:35:40
 * @LastEditTime: 2020-03-10 17:44:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /aminer2c/src/models/confrence.js
 */
/* eslint-disable quote-props */
import * as conference from 'services/aminer/conference';

export default {
  namespace: 'conference',
  state: {
    data: {},
    report: null,
  },
  effects: {
    *InsertArticle({ payload }, { call }) {
      const { data } = yield call(conference.InsertArticle, payload);
      if (data && data.succeed) {
        return data.succeed;
      }
      return false;
    },

    *GetArticlesByConfID({ payload }, { call }) {
      const { data } = yield call(conference.GetArticlesByConfID, payload);
      if (data && data.keyValues) {
        return data.keyValues;
      }
      return data.keyValues;
    },

    *DeleteArticle({ payload }, { call }) {
      const { data } = yield call(conference.DeleteArticle, payload);
      if (data && data.succeed) {
        return data.succeed;
      }
      return false;
    },

    *AuthorsVote({ payload }, { call }) {
      const { data } = yield call(conference.AuthorsVote, payload);
      if (data && data.succeed) {
        return data.succeed;
      }
      return false;
    },

    *GetUsrVoted({ payload }, { call }) {
      const { data } = yield call(conference.GetUsrVoted, payload);
      if (data.succeed) {
        return data.item;
      }
      return null;
    },
  },
  reducers: {
    saveStepFormData(state, { payload }) {
      state.data = payload;
    },

    getReportSuccess(state, { payload }) {
      state.report = payload.data;
    },
  },
};
