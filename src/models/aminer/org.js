/* eslint-disable no-param-reassign */
import { orgService } from 'services/aminer';
import consts from 'consts';


const topicDataUrl = `${consts.ResourcePath}/data/topic/topics.json`;

export default {
  namespace: 'org',

  state: {
    
  },

  effects: {
    searchOrg: [function* G({ payload }, { call, put, select, all }) {
      const data = yield call(orgService.searchOrg, payload);
      if (data && data.success && data.data) {
        const result = data.data.org || {};
        return result;
        // yield put({ type: 'update', payload: updates });
      }
    }, { type: 'takeLatest' }],

    // updateOrg
    * updateOrg({ payload }, { call, put }) {
      const data = yield call(orgService.updateOrg, payload);
      if (data && data.data && data.data.succeed && data.data.org) {
        return true;
      }
    },

    * createOrg({ payload }, { call, put }) {
      const data = yield call(orgService.createOrg, payload);
      if (data && data.data && data.data.succeed && data.data.org) {
        return true;
      }
    },

  },

  reducers: {
    update(state, { payload }) {
      Object.keys(payload).forEach(key => {
        const value = payload[key];
        state[key] = value;
      })
    },

    reset(state) {
    },

  }
}
