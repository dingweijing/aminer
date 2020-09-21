import { sysconfig } from 'systems';
import { topicService } from 'services/topic';
import { wget } from 'utils/request-umi-request';
import consts from 'consts';

export default {
  namespace: 'aminerTopic',

  state: {},

  subscriptions: {},

  effects: {
    *getTopicById({ payload }, { call, put }) {
      const { data } = yield call(topicService.getTopicById, payload);
      if (data) {
        yield put({ type: 'getTopicByIdSuccess', payload: data });
      }
    },
    *DeleteTopic({ payload }, { call, put }) {
      const { data } = yield call(topicService.DeleteTopic, payload);
      console.log('shanchu ------', data);
      if (data && data.length > 0 && data[0].succeed) {
        console.log('删除成功，隐藏该条记录');
      }
    },
  },

  reducers: {
    getTopicByIdSuccess(state, { payload }) {
      const { keyValues = {}, items = [], total = 0 } = payload;
      const { aggregation = [], topic = {} } = keyValues;
      state.total = total;
      state.paperList = items;
      // [state.topicList = [], state.authorList = []] = aggregation;
      // keywordsList authorList
      // keywords authorList
      aggregation.map(agg => {
        if (agg.label === 'author') {
          const experts = [];
          agg.item.map(expert => {
            return experts.push({
              name: expert.value,
              nameZh: expert.name_zh,
              id: expert.id,
              avatar: expert.avatar,
              count: expert.count,
            });
          });
          state[`${agg.label}List`] = experts;
        } else {
          state[`${agg.label}List`] = agg.item || [];
        }
      });
      state.topicInfo = topic;
    },
  },
};
