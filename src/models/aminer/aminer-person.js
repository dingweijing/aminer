import pathToRegexp from 'path-to-regexp';
import { personService } from 'services/person';
import { searchService } from 'services/aminer';
import display from 'utils/display';
import { getImageType } from 'utils/profile-utils';

export default {

  namespace: 'aminerPerson',

  state: {
    personId: '',
    skillsModal: {},
    profile: {},
    skillsUp: {},
    skillsDown: {},
    results: [],
    avgScores: [],
    hideActivityMoreBtn: false,
    offset: 0,
    query: null,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      pageSize: 30,
      total: null,
    },
    profileSimilarID: '',
    profileSimilar: [],
    profileDcore: [],
    profileEgoNet: [],
    ProfileInfocard: {},
    ProfileRadarChart: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen(location => {
        // const match = pathToRegexp('/p/:id').exec(location.pathname);
        const match = pathToRegexp('/profile/:name/:id').exec(location.pathname);
        if (match) {
          const personId = decodeURIComponent(match[2]);
          // // TODO listen以后不用 待迁移到页面
          // dispatch({ type: 'getActivityAvgScoresByPersonId', payload: { id: personId } });
        }
      });
    },
  },

  effects: {
    * getPerson({ payload }, { call, put }) {  // eslint-disable-line
      // console.log('effects: getPerson', payload);
      const { personId } = payload;
      // const data = yield call(personService.getPerson, personId);
      const { data } = yield call(searchService.searchPersonById, payload);
      yield put({ type: 'getPersonSuccess', payload: { data: data.items[0] } });
      return data.items[0];
    },
    * getActivityAvgScoresByPersonId({ payload }, { call, put }) {
      const { id } = payload;
      const { data } = yield call(personService.getActivityAvgScoresByPersonId, id);
      yield put({ type: 'getActivityAvgScoresByPersonIdSuccess', payload: { data } });
    },
    // this is used in the new aminer PersonPage--Tabzone--Skills
    * getPersonSkillsByParams({ payload }, { call, put, all }) {
      const { paramsUp, paramsDown } = payload;
      const [dataUp, dataDown] = yield all([
        call(personService.getPersonSkills, paramsUp),
        call(personService.getPersonSkills, paramsDown),
      ]);
      const data = { dataUp, dataDown };
      yield put({ type: 'getPersonSkillsByParamsSuccess', payload: { data } });
    },
    * votePersonInSomeTopicById({ params }, { call }) {
      yield call(personService.votePersonInSomeTopicById, params); 600;
    },
    * unvotePersonInSomeTopicById({ params }, { call }) {
      yield call(personService.unvotePersonInSomeTopicById, params);
    },
    * getTopicOfModal({ payload }, { call, put }) {
      const { data } = yield call(personService.getTopicOfModal, payload);
      yield put({ type: 'getTopicOfModalSuccess', payload: { data } });
    },
    * getProfileSimilar({ payload }, { call, put }) {
      const { personId } = payload;
      const data = yield call(personService.getProfileSimilar, personId);
      const similars = data && data.data && data.data.length > 0 && data.data.slice(0, 12);
      // for (const author of similars) {
      //   const avatar = author && display.personAvatar(author.img, 0);
      //   const extEndUrl = avatar.replace(/!.*\b/, '');
      //   try {
      //     const shape = yield getImageType(extEndUrl, 1);
      //     author.shape = shape;
      //   } catch (e) {
      //     console.warn(e);
      //   }
      // }
      yield put({ type: 'getProfileSimilarSuccess', payload: { data: similars, personId } });
    },
    * followPerson({ payload }, { call, put }) {
      const { personId } = payload;
      const data = yield call(personService.followPerson, personId);
    },
    * getProfileDcore({ payload }, { call, put }) {
      const { data } = yield call(personService.getProfileDcore, payload);
      if (data.data) {
        yield put({ type: 'getProfileDcoreSuccess', payload: { data } });
      }
      return true;
    },
    // * getProfileEgoNet({ payload }, { call, put }) {
    //   const { personId } = payload;
    //   const data = yield call(personService.getProfileEgoNet, personId);
    //   if (data.data) {
    //     // console.log("success getProfileEgoNet------------------  ", data.data.nodes);
    //     yield put({ type: 'getProfileEgoNetSuccess', payload: { data } });
    //   }
    //   return true;
    // },
    * getProfileEgoNet({ payload }, { call, put }) {
      const { data } = yield call(personService.getProfileEgoNet, payload);
      if (data.data) {
        // console.log("success getProfileEgoNet------------------  ", data.data.nodes);
        yield put({
          type: 'getProfileEgoNetSuccess', payload: {
            data: {
              data: { nodes: data.data }
            }
          }
        });
      }
      return true;
    },
    * getProfileInfocard({ payload }, { call, put }) {
      const { id } = payload;
      const data = yield call(personService.getProfileInfocard, id);
      if (data.data) {
        yield put({ type: 'getProfileInfocardSuccess', payload: { data } });
      }
    },
    * getProfileRadarChart({ payload }, { call, put }) {
      const { personId } = payload;
      const data = yield call(personService.getProfileRadarChart, personId);
      if (data && data.data) {
        yield put({ type: 'getProfileRadarChartSuccess', payload: { data } });
      }
      return true;
    },
    * setPersonRelModify({ payload }, { call }) {
      const { type, cardID, personId } = payload;
      const param = {
        r: type, s: personId, t: cardID
      };
      const data = yield call(personService.setPersonRelModify, param);
      if (data.success) {
        return true;
      }
      return false;
    },
    * getAwardTags({ payload }, { call }) {
      const { personId } = payload;
      const { data } = yield call(searchService.getAwardTags, { id: personId });
      if (data && data.status) {
        return data;
      }
      return null;
    }
  },

  reducers: {
    // setParams(state, { payload: { query, offset, size } }) {
    //   console.log('reducers:setParams ');
    //   return { ...state, query, offset, pagination: { pageSize: size } };
    // },

    /* update person profile info. */

    getPersonSuccess(state, { payload: { data } }) {
      // console.log('reducers:getPersonSuccess', data.data);
      // return { ...state, profile: data.data };
      state.profile = data;
    },

    getActivityAvgScoresByPersonIdSuccess(state, { payload: { data } }) {
      // return { ...state, avgScores: data.indices };
      state.avgScores = data.indices;
    },

    getPersonSkillsByParamsSuccess(state, { payload: { data } }) {
      const { dataUp, dataDown } = data;
      // return { ...state, skillsUp: dataUp.data, skillsDown: dataDown.data };
      state.skillsUp = dataUp.data;
      state.skillsDown = dataDown.data;
    },

    getTopicOfModalSuccess(state, { payload: { data } }) {
      // return { ...state, skillsModal: data };
      state.skillsModal = data;
    },

    getProfileSimilarSuccess(state, { payload: { data, personId } }) {
      // return { ...state, profileSimilar: data.data };
      state.profileSimilar = data;
      state.profileSimilarID = personId;
    },

    getProfileDcoreSuccess(state, { payload: { data } }) {
      // return { ...state, profileDcore: data.data };
      state.profileDcore = data.data;
    },

    getProfileEgoNetSuccess(state, { payload: { data } }) {
      // return { ...state, profileEgoNet: data.data };
      state.profileEgoNet = data.data;
    },

    getProfileInfocardSuccess(state, { payload: { data } }) {
      // return { ...state, ProfileInfocard: data.data };
      state.ProfileInfocard = data.data;
    },

    getProfileRadarChartSuccess(state, { payload: { data } }) {
      // return { ...state, ProfileRadarChart: data.data };
      state.ProfileRadarChart = data.data;
    },
  },

};
