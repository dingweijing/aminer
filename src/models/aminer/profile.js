/* eslint-disable no-param-reassign */
import { sysconfig } from 'systems';
import { profileService, searchService, paperSearchService, ai10Service } from 'services/aminer';
import { takeLatest } from 'utils/helper';
import pubHelper from 'helper/pub';

export default {
  namespace: 'profile',

  state: {
    transitionState: false,
    profile: null,
    profileID: null,

    profilePubsPage: 0,
    profilePubs: null,
    profilePubsTotal: null,

    profilePatentsPage: 0,
    profilePatents: null,
    profilePatentsTotal: null,
    profilePatentsEnd: false,

    profileProjectsPage: 0,
    profileProjects: null,
    profileProjectsTotal: null,
    newInfo: null,

    checkDelPubs: [],
  },

  subscriptions: {},

  effects: {
    //  ssr
    *getProfileBaseData({ payload }, { call, put, all, select }) {
      // console.log('getProfileBaseData...')
      const { id, size } = payload;
      // const modelID = yield select(state => state.profile.profileID);
      // console.log('modelID', modelID);
      // if (id === modelID) {
      //   return
      // }
      // if (!modelID) {
      // yield put({ type: 'resetProfile' });
      yield put({ type: 'setProfileID', payload: { id } });
      // }
      const [
        profileData,
        profilePubsData,
        profilePatentsData,
        // profileProjectsData
      ] = yield all([
        call(searchService.searchPersonById, { ids: [id] }),
        call(profileService.getPersonPapers, { id, size }),
        call(profileService.getProfilePatents, { id, size }),
        // call(profileService.getProfileProjects, { id, size }),
      ]);
      // console.log('profileProjectsData123', profileProjectsData)
      // const data = { profileData: profileData.data, profilePubsData: profilePubsData.data }
      yield all([
        put({
          type: 'getPersonPapersSuccess',
          payload: { data: profilePubsData && profilePubsData.data, reset: true },
        }),
        put({
          type: 'getProfileInfoSuccess',
          payload: {
            data:
              profileData && profileData.data && profileData.data.data && profileData.data.data[0],
          },
        }),
        put({
          type: 'getProfilePatentsSuccess',
          payload: { data: profilePatentsData && profilePatentsData.data, size, reset: true },
        }),
        // put({ type: 'getProfileProjectsSuccess', payload: { data: profileProjectsData && profileProjectsData.data, reset: true } })
      ]);

      return profileData && profileData.data && profileData.data.redirect_id;
    },

    *getPersonById({ payload }, { call, put, select }) {
      const { ids } = payload;
      const { data } = yield call(searchService.searchPersonById, payload);
      if (data.items && data.items[0]) {
        yield put({ type: 'getProfileInfoSuccess', payload: { data: data.items[0], id: ids[0] } });
      }
    },

    // * refactor by gb: getPapersByAuthor => getPersonPapers
    // 注意，字段有变化，不能直接替换成这个effect，需要核实清楚。
    // TODO 需要改成 xxxLatest => xxx
    getPersonPapers: [
      function* G({ payload }, { call, put, select }) {
        const { id, size = 20, ...params } = payload;
        // if (reset) {
        //   yield put({ type: 'resetPubPage' });
        // }
        const page = yield select(state => state.profile.profilePubsPage);
        const reset = page === 0;
        const { data } = yield call(profileService.getPersonPapers, {
          id,
          size,
          offset: page * size,
          ...params,
        });
        yield put({ type: 'getPersonPapersSuccess', payload: { data, id, reset } });
      },
      takeLatest,
    ],

    *getPersonPapersStar({ payload }, { call, put, select }) {
      const { id, size = 20, affirm_author, ...params } = payload;
      const page = yield select(state => state.profile.profilePubsPage);
      const reset = page === 0;
      const { data: data1 } = yield call(profileService.getPersonPapers, {
        id,
        size,
        offset: page * size,
        affirm_author: 'star',
        ...params,
      });
      const { data: data2 } = yield call(profileService.getPersonPapers, {
        id,
        size,
        offset: page * size,
        affirm_author: 'unstar',
        ...params,
      });
      const newData = {
        items: ((data1 && data1.items) || []).concat((data2 && data2.items) || []),
        keyValues: {
          total:
            ((data1 && data1.keyValues && data1.keyValues.total) || 0) +
            ((data2 && data2.keyValues && data2.keyValues.total) || 0),
        },
      };
      yield put({ type: 'getPersonPapersSuccess', payload: { data: newData, id, reset } });
    },

    *getProfilePatents({ payload }, { call, put, select }) {
      const { id, offset, size = 20 } = payload;
      const page = yield select(state => state.profile.profilePatentsPage);
      const { data } = yield call(profileService.getProfilePatents, {
        id,
        size,
        offset: page * size,
      });
      yield put({ type: 'getProfilePatentsSuccess', payload: { data, size } });
    },

    *getProfileProjects({ payload }, { call, put, select }) {
      const { id, offset, size, reset = false } = payload;
      const page = yield select(state => state.profile.profileProjectsPage);
      const { data } = yield call(profileService.getProfileProjects, {
        id,
        size,
        offset: page * size,
      });
      yield put({ type: 'getProfileProjectsSuccess', payload: { data, reset } });
    },

    *GetModifiersOfPerson({ payload }, { call, put }) {
      const { data } = yield call(profileService.GetModifiersOfPerson, payload);
      if (data && data.succeed) {
        return data && data.items;
      }
      return null;
      // yield put({ type: 'getProfileProjectsSuccess', payload: { data } });
    },
    *GetNoteFromPerson({ payload }, { call, put }) {
      const { data } = yield call(profileService.GetNoteFromPerson, payload);
      if (data && data.succeed) {
        return data;
      }
      return null;
    },
    *GetNotesFromPerson({ payload }, { call, put }) {
      const { data } = yield call(profileService.GetNotesFromPerson, payload);
      if (data && data.succeed) {
        return data;
      }
      return null;
    },

    *GetPersonPubsStats({ payload }, { call, put }) {
      const { data } = yield call(profileService.GetPersonPubsStats, payload);
      if (data && data.succeed) {
        return data && data.keyValues && data.keyValues;
      }
      return null;
    },
    *UpsertPersonAnnotation({ payload }, { call, put }) {
      const { data } = yield call(profileService.UpsertPersonAnnotation, payload);
      if (data && data.succeed) {
        return true;
      }
      return null;
    },

    *GetPersonEmail({ payload }, { call, put }) {
      const { data } = yield call(profileService.getEmail, payload);
      if (data && data.status) {
        return data && data.email;
      }
      return null;
    },

    *GetProfile({ payload }, { call }) {
      yield call(profileService.GetProfile, payload);
    },

    *RemovePubsFromPerson({ payload }, { call }) {
      const { data } = yield call(profileService.RemovePubsFromPerson, payload);
      if (data && data.succeed) {
        return true;
      }
      return null;
    },
    *AddPubsToPerson({ payload }, { call }) {
      const { data } = yield call(profileService.AddPubsToPerson, payload);
      console.log('AddPubsToPerson data', data);
      if (data && data.succeed) {
        return true;
      }
      return null;
    },
    *profilePapersNa({ payload }, { call, put }) {
      const { data } = yield call(profileService.profilePapersNa, payload);
      if (data && data.status) {
        return data.pos;
      }
      return null;
    },

    *personRefresh({ payload }, { call, put }) {
      const { data } = yield call(profileService.personRefresh, payload);
      const { succeed, timeleft } = data || {};
      if (succeed) {
        return {
          succeed,
          timeleft,
        };
      }
      return null;
    },

    *getAllAwards({ payload }, { call, all, put, select }) {
      const { pid, ...params } = payload;
      const [old_awards, new_awards] = yield all([
        call(searchService.getAwardTags, { id: pid }),
        call(ai10Service.getPersonAwardsById, params),
      ]);

      if ((old_awards && old_awards.success) || (new_awards && new_awards.success)) {
        return {
          old_awards: old_awards.data && old_awards.data.awards,
          new_awards:
            new_awards.data && new_awards.data.keyValues && new_awards.data.keyValues.awards,
        };
      }
      return null;
    },
  },

  reducers: {
    resetPage(state, { payload }) {
      state.profilePubsPage = 0;
      state.profilePatentsPage = 0;
      state.profileProjectsPage = 0;
    },

    resetPubPage(state, { payload }) {
      state.profilePubsPage = 0;
    },

    setTransitionData(state, { payload }) {
      const { data } = payload;
      state.profile = data;
      state.transitionState = true;
    },

    getProfileInfoSuccess(state, { payload }) {
      const { data, id } = payload;
      state.profile = data;
      state.transitionState = false;
      state.newInfo = null;
      // state.profileID = id;
    },

    setProfileInfo(state, { payload }) {
      const newProfile = { ...state.profile, ...payload };
      state.profile = newProfile;
    },

    setProfileID(state, { payload }) {
      const { id } = payload;
      state.profileID = id;
    },

    getPersonPapersSuccess(state, { payload }) {
      const { data, reset, allMes } = payload;
      if (!data) return;
      const papers = data.items || [];
      if (!state.profilePubs || reset) {
        state.profilePubs = papers;
      } else {
        state.profilePubs = state.profilePubs.concat(papers);
      }
      state.profilePubsPage += 1;
      // console.log('state', state);
      state.profilePubsTotal = data.keyValues ? data.keyValues.total : 0;
    },

    sortPersonPapersByStar(state, { payload }) {
      if (state.profilePubs) {
        state.profilePubs.sort((a, b) => {
          let n = pubHelper.PaperHasStar(a.flags),
            m = pubHelper.PaperHasStar(b.flags);
          if (n && !m) {
            return -1;
          } else if (!n && m) {
            return 1;
          }
          return 0;
        });
      }
    },

    getProfilePatentsSuccess(state, { payload }) {
      const { data, reset, size } = payload;
      if (!data) return;

      if (data.patents && data.patents.length < size) {
        state.profilePatentsEnd = true;
      } else {
        state.profilePatentsEnd = false;
      }

      if (!state.profilePatents || reset) {
        state.profilePatents = data.patents;
      } else {
        state.profilePatents = state.profilePatents.concat(data.patents);
      }
      state.profilePatentsPage += 1;
      state.profilePatentsTotal = data.size;
    },

    getProfileProjectsSuccess(state, { payload }) {
      const { data, reset } = payload;
      if (!data || (data && !data.items)) return;
      if (!state.profileProjects || reset) {
        state.profileProjects = data.items;
      } else {
        state.profileProjects = state.profileProjects.concat(data.items);
      }
      state.profileProjectsPage += 1;
      state.profileProjectsTotal = data.keyValues.total;
      // state.profileProjectsTotal = 20
    },

    resetProfile(state, { payload }) {
      state.profile = null;
      state.profileID = null;

      state.profilePubsPage = 0;
      state.profilePubs = null;
      state.profilePubsTotal = null;

      state.profilePatentsPage = 0;
      state.profilePatents = null;
      state.profilePatentsTotal = null;
      state.profilePatentsEnd = false;

      state.profileProjectsPage = 0;
      state.profileProjects = null;
      state.profileProjectsTotal = null;
      state.newInfo = null;
    },

    resetProfilePubs(state, { payload }) {
      state.profilePubs = null;
      state.profilePubsTotal = null;
    },

    resetProfileInfo(state, { payload }) {
      state.profile = null;
    },

    refreshNewInfo(state, { payload }) {
      console.log('refreshNewInfo', payload);
      state.newInfo = payload;
    },

    updateDelPubs(state, { payload }) {
      const { id, list } = payload;
      if (list) {
        state.checkDelPubs = list;
        return;
      }
      const { checkDelPubs } = state;
      const newList = [...checkDelPubs];
      if (newList.length > 0 && newList.includes(id)) {
        state.checkDelPubs = newList.filter(item => item !== id) || [];
      } else {
        newList.push(id);
        state.checkDelPubs = newList;
      }
    },
  },
};
