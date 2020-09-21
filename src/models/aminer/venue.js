/* eslint-disable no-param-reassign */
import { sysconfig } from 'systems';
import { venueService } from 'services/aminer';
import { cloneDeep } from 'lodash';
import { wget } from 'utils/request-umi-request';
import consts from 'consts';
import searchHelper from 'helper/search';
import { removeTimeFromEsSearch } from 'utils/search-utils'

const topicDataUrl = `${consts.ResourcePath}/data/topic/topics.json`;

export default {
  namespace: 'venue',

  state: {
    
  },

  effects: {
    searchVenue: [function* G({ payload }, { call, put, select, all }) {
      console.log('models payload :', payload);
      const data = yield call(venueService.searchVenue, payload);
      if (data && data.success && data.data) {
        const result = data.data.venue || {};
        return result;
        // yield put({ type: 'update', payload: updates });
      }
    }, { type: 'takeLatest' }],

    // updateVenue
    * updateVenue({ payload }, { call, put }) {
      const data = yield call(venueService.updateVenue, payload);
      if (data && data.data && data.data.succeed && data.data.venue) {
        return true;
      }
    },

    * createVenue({ payload }, { call, put }) {
      const data = yield call(venueService.createVenue, payload);
      if (data && data.data && data.data.succeed && data.data.venue) {
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
