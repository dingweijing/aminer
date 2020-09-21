/* eslint-disable no-param-reassign */
import { newsSearchService } from 'services/aminer'

export default {
  namespace: 'searchnews',

  state: {
    news: null,
    total: null,
  },

  effects: {
    // 搜索智库 在homepage获取关键词后跳转至/eb/search页调用
    * searchNews({ payload }, { call, put }) {
      const response = yield call(newsSearchService.searchNews, payload);
      if (response && response.data && response.data.data) {
        yield put({
          type: 'searchNewsSuccess',
          payload: response.data,
        });
      }
    },

  },

  reducers: {
    searchNewsSuccess(state, { payload }) {
      const { data, total } = payload;
      state.news = data;
      state.total = total;
    },
  }
}
