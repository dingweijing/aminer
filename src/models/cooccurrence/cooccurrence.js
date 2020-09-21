// Author: Elivoa, 2019-08-08
// refactor by Bo Gao, 2019-08-08 Rewrite.

/* eslint-disable prefer-destructuring,no-unused-expressions,no-param-reassign,no-lonely-if */
import * as cooccurrenceService from 'services/cooccurrence';

export default {

  namespace: 'cooccurrence',

  state: {
    mention: null,
    topic: null, // search 右边的 topic
  },

  effects: {
    * getData({ payload }, { call, put }) {
      const { data } = yield call(cooccurrenceService.getCoData, payload);
      if (data && data.data) {
        return data.data;
      } else {
        return []
      }
    },

  },

  reducers: {

  },

  subscriptions: {},

};
