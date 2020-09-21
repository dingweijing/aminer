/* eslint-disable no-param-reassign */

import { sysconfig } from 'systems';
import { topicService } from 'services/aminer';
import { takeLatest } from 'utils/helper';

export default {
  namespace: 'newTopic',

  state: {
    newTopicList: null,
    topicList: null,
    hottestTopic: null,
    // forumTopics: null,
  },

  subscriptions: {},

  effects: {
    *listTopic({ payload }, { put, call }) {
      const data = yield call(topicService.listTopic, payload);
      if (data && data.success && data.data && data.data.data) {
        yield put({ type: 'setTopicList', payload: { data: data.data.data } });
      }
    },

    *setLikeTopicById({ payload }, { put, call }) {
      const data = yield call(topicService.setLikeTopicById, payload);
      if (data && data.success) {
        return true;
      }
      return false;
    },

    *setUnLikeTopicById({ payload }, { put, call }) {
      const data = yield call(topicService.setUnLikeTopicById, payload);
      if (data && data.success) {
        return true;
      }
      return false;
    },

    *getHottestTopic({ payload }, { put, call }) {
      const data = yield call(topicService.getHottestTopic, payload);
      if (data && data.success && data.data && data.data.data) {
        yield put({ type: 'setHottestTopic', payload: { data: data.data.data } });
      }
    },

    *getNewestTopic({ payload }, { put, call }) {
      const data = yield call(topicService.getHottestTopic, payload);
      if (data && data.success && data.data && data.data.data) {
        yield put({ type: 'setNewestTopic', payload: { data: data.data.data } });
      }
    },

    // * getTopics({ payload }, { put, call }) {
    //   const data = yield call(topicService.getHottestTopic, payload);
    //   if (data && data.success && data.data && data.data.data) {
    //     yield put({ type: 'setTopics', payload: { data: data.data.data } });
    //   }
    // },
  },

  reducers: {
    setTopicList(state, { payload }) {
      const { data } = payload;
      let topicList = data && data.length > 0 && data[0].topics;
      for (let index = 1; index < data.length; index++) {
        if (data[index] && data[index].topics) {
          topicList = topicList.concat(data[index].topics);
        }
      }
      state.topicList = topicList;
    },

    // setTopics(state, { payload }) {
    //   const { data } = payload;
    //   state.forumTopics = data;
    // },

    setHottestTopic(state, { payload }) {
      const { data } = payload;
      state.hottestTopic = data;
    },

    setNewestTopic(state, { payload }) {
      const { data } = payload;
      state.newTopicList = data;
    },

    changeTopicLiked(state, { payload }) {
      const { firstIndex, is_like, num_like, id } = payload;
      const index = state.topicList && state.topicList.findIndex(n => n.id === id);
      const newIndex = state.newTopicList && state.newTopicList.findIndex(n => n.id === id);
      if (firstIndex && index >= 0) {
        state.topicList[index].is_like = is_like;
        state.topicList[index].num_like = num_like;
      } else if (!firstIndex && newIndex >= 0) {
        state.newTopicList[newIndex].is_like = is_like;
        state.newTopicList[newIndex].num_like = num_like;
      }
    },
  },
};
