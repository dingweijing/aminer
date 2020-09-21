/* eslint-disable no-param-reassign */
import { sysconfig } from 'systems';
import { profileService, searchService } from 'services/aminer';
import { takeLatest } from 'utils/helper';

export default {
  namespace: 'editProfile',

  state: {
    passawayData: null,
  },

  subscriptions: {},

  effects: {
    // * personModify({ payload }, { put, call }) {
    //   const { i, m } = payload;
    //   const { data } = yield call(profileService.personModify, { i, m });
    //   console.log('modify', data)
    //   // yield put({
    //   //   type: 'changeFollow',
    //   //   payload: { id }
    //   // });
    // },

    *UpsertPersonAnnotation({ payload }, { call, put }) {
      const { data } = yield call(profileService.UpsertPersonAnnotation, payload);
      if (data && data.succeed) {
        return true;
      }
      return null;
    },

    *AffirmPubToPerson({ payload }, { put, call }) {
      const { aid, pid, assign } = payload;
      const { data } = yield call(profileService.AffirmPubToPerson, { aid, pid, assign });
      if (data.succeed) {
        return true;
      }
      return false;
      // yield put({
      //   type: 'changeFollow',
      //   payload: { id }
      // });
    },

    *getPerson({ payload }, { call, put }) {
      const { data } = yield call(searchService.searchPersonById, payload);
      if (data && data.data) {
        return data.data;
      }
      return null;
    },

    *createExperience({ payload }, { call, put }) {
      const { data } = yield call(profileService.createExperience, payload);
      if (data && data.weid) {
        return data.weid;
      }
      return null;
    },

    *updateExperience({ payload }, { call, put }) {
      const { data } = yield call(profileService.updateExperience, payload);
      if (data && data.status) {
        return true;
      }
      return null;
    },

    *deleteExperience({ payload }, { call, put }) {
      const { data } = yield call(profileService.deleteExperience, payload);
      if (data && data.status) {
        return true;
      }
      return null;
    },

    *getExperienceById({ payload }, { call, put, select }) {
      const { data } = yield call(searchService.getExperienceById, payload);
      if (data && data.items && data.items[0]) {
        return data.items[0].work;
      }
      return null;
    },

    *mergePerson({ payload }, { call, put }) {
      const { data } = yield call(profileService.mergePerson, payload);
      if (data) {
        return data.succeed;
      }
      return null;
    },

    *getAvatars({ payload }, { call, put }) {
      const { data } = yield call(profileService.getAvatars, payload);
      if (data && data.items && data.items[0]) {
        return data.items[0].avatars;
      }
      return null;
    },

    *updateAvatars({ payload }, { call, put }) {
      const { data } = yield call(profileService.updateAvatars, payload);
      if (data) {
        return data;
      }
      return null;
    },

    *SetNoteToPerson({ payload }, { call, put }) {
      const { data } = yield call(profileService.SetNoteToPerson, payload);
      if (data && data.succeed) {
        return data;
      }
      return null;
    },

    *SetNotesToPerson({ payload }, { call, put }) {
      const { data } = yield call(profileService.SetNotesToPerson, payload);
      if (data && data.succeed) {
        return data;
      }
      return null;
    },

    *GetPassawayInfo({ payload }, { call, put }) {
      const { data } = yield call(profileService.GetPassawayInfo, payload);
      yield put({ type: 'setPassawayInfo', payload: { data: data && data.data } });
    },

    *ForceBurnCandle({ payload }, { call, put }) {
      const { data } = yield call(profileService.ForceBurnCandle, payload);
      if (data && data.succeed) {
        return true;
      }
      return false;
    },
    *DisableBurnCandle({ payload }, { call, put }) {
      const { data } = yield call(profileService.DisableBurnCandle, payload);
      if (data && data.succeed) {
        return true;
      }
      return false;
    },
    *BurnLittleCandle({ payload }, { call, put }) {
      const { data } = yield call(profileService.BurnLittleCandle, payload);
      if (data && data.succeed) {
        return true;
      }
      return false;
    },
    *GetBaseNum({ payload }, { call, put }) {
      const { data } = yield call(profileService.GetBaseNum, payload);
      if (data && data.succeed) {
        return data.data;
      }
      return false;
    },
    *SetBaseNum({ payload }, { call, put }) {
      const { data } = yield call(profileService.SetBaseNum, payload);
      if (data && data.succeed) {
        return true;
      }
      return false;
    },

    *getPersonAnnotationVersion({ payload }, { call, put }) {
      const { data } = yield call(profileService.getPersonAnnotationVersion, payload);
      if (data && data.items) {
        return data && data.items[0];
      }
      return null;
    },

    *AffirmPersonAnnotation({ payload }, { call, put }) {
      const { data } = yield call(profileService.AffirmPersonAnnotation, payload);
      const item = data && data.items && data.items[0];
      if (item && item.judge) {
        return { judge: true, succeed: true }
      }
      return { succeed: data && data.succeed }
    },

    *starPaperToPerson({ payload }, { call, put }) {
      const { data } = yield call(profileService.starPaperToPerson, payload);
      if (data && data.succeed) {
        return true;
      }
      return false;
    },

  },

  reducers: {
    setPassawayInfo(state, { payload }) {
      const { data } = payload;
      state.passawayData = data;
    },
    updatePassawayInfo(state, { payload }) {
      const { field, value } = payload;
      const temp = { ...state.passawayData };
      const fields = field && field.split('.');
      fields.reduce((res, cur, index) => {
        if (index === fields.length - 1) {
          res[cur] = value;
        }
        return res[cur];
      }, temp);
      // temp[field] = value
      state.passawayData = temp;
    },
    setCandlesInfo(state, { payload }) {
      const { value } = payload;
      const temp = { ...state.passawayData };
      temp.can_burncandles = !value;
      temp.disable_candles = value;
      state.passawayData = temp;
    },
    resetPassawayInfo(state, { payload }) {
      state.passawayData = null;
    },
  },
};
