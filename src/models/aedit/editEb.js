import { statsService } from 'services/aminer';
import { editEbService } from 'services/aedit';
import { personSearchService } from 'services/aminer/search';

export default {
  namespace: 'editEb',

  state: {

  },


  effects: {

    *getNotesFromRosters({ payload }, { call, put }) {
      const { data } = yield call(statsService.getNotesFromRosters, payload);
      if (data && data.succeed) {
        return {
          note: data && data.items && data.items[0] && data.items[0].note,
          actUser: data && data.keyValues && data.keyValues.op_users,
        };
      }
      return null;
    },

    *SetEbNoteToRoster({ payload }, { call, put }) {
      const { data } = yield call(editEbService.SetEbNoteToRoster, payload);
      if (data && data.succeed) {
        return data.succeed;
      }
      return null;
    },

    *getEbBasic({ payload }, { call, put }) {
      const { data } = yield call(editEbService.getEbBasic, payload);
      if (data) {
        return data
      }
      return null;
    },

    *SaveEbBasic({ payload }, { call, put }) {
      const { data } = yield call(editEbService.SaveEbBasic, payload);
      if (data && data.status) {
        return data.status;
      }
      return null;
    },

    *ExtractEbEmail({ payload }, { call, put }) {
      const { data } = yield call(editEbService.ExtractEbEmail, payload);
      if (data) {
        return data
      }
      return null;
    },

    *getExpertList({ payload }, { call, put }) {
      const { data } = yield call(editEbService.getExpertList, payload);
      if (data) {
        return data
      }
      return null;
    },

    * checkEmail({ payload }, { call, put }) {
      const { data } = yield call(editEbService.checkEmail, payload);
      if (data) {
        return data
      }
      return null;
    },

    * setEbMember({ payload }, { call, put }) {
      const { data } = yield call(editEbService.setEbMember, payload);
      if (data && data.status) {
        return data.status
      }
      return null;
    },

    * getEbMember({ payload }, { call, put }) {
      const { data } = yield call(editEbService.getEbMember, payload);
      if (data) {
        return data
      }
      return null;
    },

    * deleteMember({ payload }, { call, put }) {
      const { data } = yield call(editEbService.deleteMember, payload);
      if (data && data.status) {
        return data
      }
      return null;
    },

    * getEbReplacePerson({ payload }, { call, put }) {
      const { data } = yield call(personSearchService.new_search, payload, {});
      console.log('getEbReplacePerson', data);
      if (data && data.succeed) {
        return data
      }
      return null;
    },

    * replaceEbPerson({ payload }, { call, put }) {
      const { data } = yield call(editEbService.replaceEbPerson, payload);
      if (data && data.succeed) {
        return data
      }
      return null;
    },

  },

  reducers: {
    // setPassawayInfo(state, { payload }) {
    //   const { data } = payload;
    //   state.passawayData = data;
    // },
  },
};
