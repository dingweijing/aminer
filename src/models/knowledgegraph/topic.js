// Author: Elivoa, 2019-08-08
// refactor by Bo Gao, 2019-08-08 Rewrite.

/* eslint-disable prefer-destructuring,no-unused-expressions,no-param-reassign,no-lonely-if */
import { topicService } from 'services/topic';

export default {

  namespace: 'topic',

  state: {
    mention: null,
    topic: null, // search 右边的 topic
  },

  effects: {

    * getTopicByMention({ payload }, { call, put }) {
      try {
        const { mention } = payload;
        const { data } = yield call(topicService.getTopicByMention, mention);
        yield put({ type: 'getTopicByMentionSuccess', payload: { mention, data } });
        return data.items ? data.items[0] : null;
      } catch (err) {
        console.error(err);
        return null;
      }
    },

  },

  reducers: {

    getTopicByMentionSuccess(state, { payload: { mention, data } }) {
      state.mention = mention;
      state.topic = data.items;
      // return { ...state, topic: data.data };
    },
  },

  subscriptions: {},

};
