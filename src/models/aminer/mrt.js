import { sysconfig } from 'systems';
import { mrtService, commonService } from 'services/aminer';

export default {

  namespace: 'mrt', // TODO change to pub model.

  state: {
    mrtList: null,
    total: null,
    mrtData: null,
    mrtUserEdit: {}
  },

  subscriptions: {},

  effects: {
    * createPaperMRT({ payload }, { call }) {
      const { data } = yield call(mrtService.createPaperMRT, payload);
      if (data && data.succeed) {
        return data.keyValues;
      }
      return false;
    },

    * getPaperMRTById({ payload }, { call, put }) {
      const { data } = yield call(mrtService.getPaperMRTById, payload);
      if (data && data.succeed && data.items) {
        yield put({
          type: 'getPaperMRTByIdSucceed',
          payload: data.items[0]
        })
      }
    },

    * addPaperMRTSponsor({ payload }, { call }) {
      const { data } = yield call(mrtService.addPaperMRTSponsor, payload);
      if (data && data.succeed) {
        return true;
      }
      return false;
    },

    * getPaperMRTBySponsors({ payload }, { call, put }) {
      const { data } = yield call(mrtService.getPaperMRTBySponsors, payload);
      if (data.succeed && data.keyValues) {
        yield put({
          type: 'getPaperMRTBySponsorsSucceed',
          payload: {
            data: data.items,
            total: data.keyValues.total
          }
        });
      }
      return false;
    },

    * createMRTUserEdit({ payload }, { call }) {
      const { data } = yield call(mrtService.createMRTUserEdit, payload);
      if (data && data.succeed) {
        return true;
      }
      return false;
    },

    * getMRTUserEdit({ payload }, { call, put }) {
      const { data } = yield call(mrtService.getMRTUserEdit, payload);
      if (data && data.succeed && data.items) {
        yield put({
          type: 'getMRTUserEditSucceed',
          payload: data.items
        })
      }
      return false;
    },

    * addOrCancelMRTLike({ payload }, { call }) {
      const { data } = yield call(mrtService.addOrCancelMRTLike, payload);
      if (data && data.succeed && data.items) {
        return data.items;
      }
      return false;
    },

    * getMrtCompleted({ payload }, { call, put }) {
      const { data } = yield call(mrtService.getMrtCompleted, payload);
      if (data && data.succeed && data.keyValues) {
        yield put({
          type: 'getMrtCompletedSucceed',
          payload: {
            data: data.items,
            total: data.keyValues.total
          }
        });
      }
    },

    * getMrts({ payload }, { call, put }) {
      const { data } = yield call(mrtService.getMrts, payload);
      if (data && data.succeed && data.keyValues) {
        yield put({
          type: 'getMrtsSucceed',
          payload: {
            data: data.items,
            total: data.keyValues.total
          }
        });
      }
    },

    * addMrtClickNum({ payload }, { call }) {
      const { data } = yield call(mrtService.addMrtClickNum, payload);
      if (data && data.succeed) {
        return true;
      }
      return false;
    },

    * getMrtByPaperIDs({ payload }, { call, put }) {
      const { data } = yield call(mrtService.getMrtByPaperIDs, payload);
      if (data, data.succeed && data.items) {
        yield put({
          type: 'getMrtByPaperIDsSucceed',
          payload: data.items,
        })
      }
    },

    * Track({ payload }, { call }) {
      yield call(commonService.Track, { data: [ payload ] });
    },

  },

  reducers: {
    getMrtCompletedSucceed(state, { payload }) {
      const { data, total } = payload;
      state.mrtList = data;
      state.total = total;
    },
    getMrtsSucceed(state, { payload }) {
      const { data, total } = payload;
      state.mrtList = data;
      state.total = total;
    },
    getPaperMRTBySponsorsSucceed(state, { payload }) {
      const { data, total } = payload;
      state.mrtList = data;
      state.total = total;
    },
    getMrtByPaperIDsSucceed(state, { payload }) {
      const data = payload;
      state.mrtList = data;
    },
    getPaperMRTByIdSucceed(state, { payload }) {
      const data = payload;
      state.mrtData = data;
    },
    getMRTUserEditSucceed(state, { payload }) {
      const data = payload;
      state.mrtUserEdit = data[0].edit_data;
    },
    updateMrtUserEdit(state, { payload }) {
      const data = payload;
      state.mrtUserEdit = data;
    },
    reset(state) {
      state.mrtList = [];
      state.total = null;
      state.mrtData = null;
    }
  },
};
