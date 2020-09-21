/* eslint-disable no-param-reassign */
// import { sysconfig } from 'systems';
import { socialService } from 'services/aminer';
// import { cloneDeep } from 'lodash';
// import { wget } from 'utils/request-umi-request';
import { baseURL } from 'consts/api';
import { IKeyword, IKeywordSocial } from 'aminer/components/common_types';
import { takeLatest } from 'utils/helper';
// import searchHelper from 'helper/search';
// import { removeTimeFromEsSearch } from 'utils/search-utils'

interface IRecommendExpertAPI {
  id: string;
  value: string;
  name_zh: string;
  avatar: string;
  tags: Array<{
    t: string;
    w: number;
  }>;
  is_follow: boolean;
}

const DEFAULT_TOPICS_LENGTH = 6;

const getRandomArrayElements = (arr: IKeyword[], count: number) => {
  const topics = [...arr];
  const res = [];
  while (count) {
    const index = Math.floor(Math.random() * topics.length);
    const item = topics.splice(index, 1);
    res.push(...item);
    count -= 1;
  }
  return res;
  // const item = topics[Math.floor(Math.random() * topics.length)];
};

const handleAuthor = (authors: IRecommendExpertAPI[]) => {
  return authors.map(author => {
    const { value, is_follow, tags, ...params } = author;
    let new_tags = tags ? tags.map(item => item.t) : [];
    // new_tags = Array.from(new Set(new_tags));
    return {
      name: value,
      is_following: is_follow,
      tags: new_tags && new_tags.slice(0, 5),
      ...params,
    };
  });
};

const filterRecommendTopics = (
  recommends: IKeyword[],
  selects: IKeywordSocial[],
  count: number,
) => {
  if (!recommends) {
    return [];
  }
  const select_ids = selects.map(item => item.id);
  const final = recommends?.reduce((res: IKeyword[], cur: IKeyword) => {
    const cur_ids = res?.map(item => item.id);
    const temp: IKeyword[] = [...res];
    if (!select_ids.includes(cur.id) && !cur_ids.includes(cur.id)) {
      temp.push(cur);
    }
    return temp;
  }, []);
  const result = getRandomArrayElements(final, count || DEFAULT_TOPICS_LENGTH);
  return result;
};

export default {
  namespace: 'social',

  state: {
    topic_ids: null,
    ntypes: null,
    defaultTopicsList: [],
    defaultTopics: null,
    selectTopics: null,
    focusTopics: [],
    recommendNotifications: null,
    notifications: null,
    recommendIDs: [],
    allNotifications: null,
  },

  effects: {
    *getAllNotifications({ payload }, { call, put, all }) {
      const { reset, n_params, r_params } = payload || {};
      const [
        { data: nData },
        { data: rData },
        // profileProjectsData
      ] = yield all([
        call(socialService.notifications, n_params),
        call(socialService.GetRecommendNotifications, r_params),
        // call(profileService.getProfileProjects, { id, size }),
      ]);

      yield put({
        type: 'setAllNotifications',
        payload: { rData: rData?.data, nData: nData?.data, reset },
      });
      const t = nData?.t;

      if (!rData?.data?.length && !nData?.data?.length) {
        return { e: true, t };
      }
      return { e: false, t };
    },
    *getRNotifications({ payload }, { call, put, all }) {
      const { reset, r_params } = payload || {};
      const { data: rData } = yield call(socialService.GetRecommendNotifications, r_params);

      yield put({
        type: 'setAllNotifications',
        payload: { rData: rData?.data, reset },
      });

      if (!rData?.data?.length) {
        return true;
      }
      return false;
    },

    *SuggestTopics({ payload }, { call, put }) {
      const { data } = yield call(socialService.SuggestTopics, payload);
      return data?.topic;
    },

    *FollowTopic({ payload }, { call, put }) {
      const { data } = yield call(socialService.FollowTopic, payload);
      return data?.id;
    },
    *UnFollowTopic({ payload }, { call, put }) {
      const { index, ...params } = payload;
      const { data } = yield call(socialService.FollowTopic, params);
      if (data?.succeed) {
        yield put({
          type: 'delSelectedTopics',
          payload: { index },
        });
      }
      return data?.succeed;
    },

    *RemoveSuggestTopics({ payload }, { call, put }) {
      const { data } = yield call(socialService.RemoveSuggestTopics, payload);
      return data?.succeed;
    },

    *ListTopic({ payload }, { call, put }) {
      const { data } = yield call(socialService.ListTopic, payload);
      // console.log('ListTopic', data);

      yield put({
        type: 'setSelectTopics',
        payload: { topics: data?.data?.topic || [] },
      });
      return data?.data?.topic;
    },

    *GetDefaultAndChange({ payload }, { call, put, select }) {
      const { index, ...params } = payload;
      // const { data } = yield call(socialService.GetRecommendTopic, params);

      // const selects = yield select(state => state.social.selectTopics);
      const defaults = yield select(state => state.social.defaultTopics);
      const defaultsList = yield select(state => state.social.defaultTopicsList);
      const result = filterRecommendTopics(defaultsList, [...defaults], 1);
      // const result = data?.data;

      yield put({
        type: 'changeDefaultTopics',
        payload: { new_topic: result && result[0], index },
      });
      return result && result[0];
    },

    GetRecommendTopic: [
      function* G({ payload }, { call, put }) {
        const { data } = yield call(socialService.GetRecommendTopic, payload);

        yield put({
          type: 'setRecommendTopic',
          payload: { default_topics: data?.data },
        });
      },
      takeLatest,
    ],

    // RecommendEntitiesByTopics: [
    //   function* G({ payload }, { call, put }) {
    //     const { data } = yield call(socialService.RecommendEntitiesByTopics, payload);
    //     let { authors, keywords } = data || {};
    //     authors = authors && handleAuthor(authors);

    //     yield put({
    //       type: 'setDefaultTopicsAndRecommendExperts',
    //       payload: { recomment_experts: authors, default_topics: keywords },
    //     });
    //   },
    //   takeLatest,
    // ],

    *GetUser({ payload }, { call, put }) {
      const { data } = yield call(socialService.GetUser, payload);
      // const userinfo = data?.data;
      const userinfo = data?.items && data?.items[0];
      console.log('userinfo..', userinfo);
      yield put({
        type: 'setUserInfo',
        payload: { userinfo },
      });
      return userinfo;
    },

    *UpdateUser({ payload }, { call, put }) {
      const { data } = yield call(socialService.UpdateUser, payload);
      return data?.succeed;
    },

    *Follow({ payload }, { call, put }) {
      const { data } = yield call(socialService.Follow, payload);
      // return [data?.topics, data?.selected_topics];
      return data?.succeed;

      // const { succeed, meta, ...result } = data;
      // if (result) {
      //   return result;
      // }
      // return false;
    },
    // TODO: xenaluo -- collection/  del
    *GetFollows({ payload }, { call, put }) {
      const { data } = yield call(socialService.GetFollows, payload);
      // return [data?.topics, data?.selected_topics];

      return data?.data;
    },

    *BindMe({ payload }, { call, put }) {
      const { data } = yield call(socialService.BindMe, payload);
      if (data) {
        return data;
      }
      return false;
    },

    *UnBind({ payload }, { call, put }) {
      const { data } = yield call(socialService.UnBind, payload);
      if (data) {
        return data;
      }
      return false;
    },

    *BindProfile({ payload }, { call, put }) {
      const { data } = yield call(socialService.BindProfile, payload);
      if (data) {
        return data;
      }
      return false;
    },

    // *CreateTrendProject({ payload }, { call, put }) {
    //   const { data } = yield call(socialService.CreateTrendProject, payload);
    //   console.log('create data', data);
    //   if (data) {
    //     return data;
    //   }
    //   return false;
    // },
  },

  reducers: {
    update(state, { payload }) {
      Object.keys(payload).forEach(key => {
        const value = payload[key];
        state[key] = value;
      });
    },

    setRecommendTopic(state, { payload }) {
      const { default_topics } = payload;
      // const result = filterRecommendTopics(default_topics, [...state.selectTopics], DEFAULT_TOPICS_LENGTH);
      state.defaultTopicsList = default_topics;
      state.defaultTopics = default_topics?.slice(0, DEFAULT_TOPICS_LENGTH);
    },
    setBind(state, { payload }) {
      const { pid } = payload;
      const temp = { ...state.userinfo, bind: pid };
      state.userinfo = temp;
    },
    setUserInfo(state, { payload }) {
      const { userinfo } = payload;
      state.userinfo = userinfo;
    },
    setAllNotifications(state, { payload }) {
      const { rData, nData, reset } = payload;
      let ns =
        nData?.map(item => {
          const { message, ...other } = item;
          const data = message.map(msg => {
            const { data: _data, ...params } = msg;
            return {
              data: _data && JSON.parse(_data),
              ...params,
            };
          });
          return data;
        }) || [];
      ns = ns.flat(2);
      const rs = rData?.map(item => {
        const { data: _data, ...other } = item;
        return {
          ...other,
          data: _data && JSON.parse(_data),
        };
      });
      ns = ns.concat(rs || []);

      let temp = state.allNotifications && [...state.allNotifications];

      if (!temp || reset) {
        temp = ns || [];
      } else {
        temp = temp.concat(ns);
      }

      const rids = rData?.map(r => r.id);
      let rt = state.recommendIDs && [...state.recommendIDs];
      if (!rt || reset) {
        rt = rids || [];
      } else {
        rt = rt.concat(rids);
      }

      state.allNotifications = temp;
      state.recommendIDs = rt;
    },
    setNotifications(state, { payload }) {
      const { data, reset } = payload;
      const n =
        data?.map(item => {
          const { message, ...other } = item;
          return {
            ...other,
            data: message.map(msg => {
              const { data: _data, ...params } = msg;
              return {
                data: _data && JSON.parse(_data),
                ...params,
              };
            }),
          };
        }) || [];
      let temp = state.notifications && [...state.notifications];

      if (!temp || reset) {
        temp = n || [];
      } else {
        temp = temp.concat(n);
      }
      state.notifications = temp;
    },
    setRecommendNotifications(state, { payload }) {
      const { data } = payload;
      const n = data?.map(item => {
        const { data: _data, ...other } = item;
        return {
          ...other,
          data: _data && JSON.parse(_data),
        };
      });
      state.recommendNotifications = n || [];
    },
    setSelectTopics(state, { payload }) {
      const { topics } = payload;
      state.selectTopics = topics;
    },

    changeDefaultTopics(state, { payload }) {
      const { new_topic, index } = payload;
      const default_temp = [...state.defaultTopics];
      const default_list_temp = [...state.defaultTopicsList];
      if (new_topic) {
        default_temp.splice(index, 1, new_topic);
        // default_temp.push(new_topic);
      }

      default_list_temp.splice(index, 1);
      // default_temp.push({
      //   topic: '111',
      //   id: 'aa'
      // });
      console.log({ default_list_temp });
      state.defaultTopics = default_temp;
      state.defaultTopicsList = default_list_temp;
    },

    addSelectedTopics(state, { payload }) {
      const { topic } = payload;
      const temp = [...state.selectTopics];
      // const focus_temp = [...state.focusTopics];
      temp.push(topic);
      // focus_temp.push(topic.id);
      state.selectTopics = temp;
      // state.focusTopics = focus_temp;
    },

    delSelectedTopics(state, { payload }) {
      const { index } = payload;
      const select_temp = [...state.selectTopics];
      select_temp.splice(index, 1);
      state.selectTopics = select_temp;
    },

    // updateFocusTopics(state, { payload }) {
    //   const { id } = payload;
    //   const index = state.focusTopics.indexOf(id);
    //   const temp = [...state.focusTopics];
    //   if (index === -1) {
    //     temp.push(id);
    //   } else {
    //     temp.splice(index, 1);
    //   }
    //   state.focusTopics = temp;
    // },

    // focusAllTopics(state, { payload }) {
    //   const select_temp = [...state.selectTopics];
    //   if (state.selectTopics?.length === state.focusTopics?.length) {
    //     state.focusTopics = [];
    //   } else {
    //     state.focusTopics = select_temp.map(item => item.id);
    //   }
    // },
  },
};
