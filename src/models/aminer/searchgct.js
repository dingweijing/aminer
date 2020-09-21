/* eslint-disable no-param-reassign */
import { sysconfig } from 'systems';
import * as ebService from 'services/eb/expert-base';

export default {
  namespace: 'searchgct',

  state: {
    searchResult: null,
    matched: false,
    // 上下位词
    smartQuery: { isNotAffactedByAssistant: true }, // rename from assistantDataMeta { texts, isNotAffactedByAssistant, typesTotals<扩展词或者上下位次的个数> }
    assistantData: null, // api返回的结果
  },

  effects: {
    // 搜索智库 在homepage获取关键词后跳转至/eb/search页调用
    * getExpertBaseTreeByQuery({ payload }, { call, put }) {
      const data = yield call(ebService.getExpertBaseTreeByQuery, payload);
      if (data && data.data && data.data.succeed) {
        const { items, keyValues, intellResults } = data.data;
        yield put({
          type: 'getSearchResultSuccess',
          payload: { items, keyValues, intellResults },
        });
        return items;
      }
    },

  },

  reducers: {
    getSearchResultSuccess(state, { payload }) {
      const { items, keyValues, intellResults } = payload;
      state.searchResult = items;
      state.matched = (keyValues && keyValues.matched) || false;
      state.assistantData = intellResults || null
    },
  }
}
