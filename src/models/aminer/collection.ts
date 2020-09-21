/* eslint-disable no-param-reassign */
import { collectionService } from 'services/aminer';
import { takeLatest } from 'utils/helper';

export default {
  namespace: 'collection',

  state: {
    pubCollection: null,
    pubCategoryMap: {},
    reviewPubs: [],
    collectionMap: {},
  },

  effects: {
    *ListCategory({ payload }, { call, put }) {
      const { data } = yield call(collectionService.ListCategory, payload);
      yield put({
        type: 'setCategory',
        payload: { category: data?.data },
      });
    },

    *Follow({ payload }, { call, put }) {
      const { data } = yield call(collectionService.Follow, payload);
      return data?.succeed;
    },

    *IsFollow({ payload }, { call, put }) {
      const { data } = yield call(collectionService.IsFollow, payload);
      yield put({
        type: 'setCollectionMap',
        payload: { data: data?.data },
      });
    },

    *UpdateComments({ payload }, { call, put }) {
      const { data } = yield call(collectionService.UpdateComments, payload);
      return data?.succeed;
    },

    GetFollows: [
      function* G({ payload }, { call, put }) {
        const { data } = yield call(collectionService.GetFollows, payload);
        return data?.data;
      },
      takeLatest,
    ],

    GetFollowsByCategory: [
      function* G({ payload }, { call, put }) {
        const { data } = yield call(collectionService.GetFollowsByCategory, payload);
        return { pubs: data?.pubs, pubs_count: data?.pubs_count };
      },
      takeLatest,
    ],

    *GetCategoryByFollowIDs({ payload }, { call, put }) {
      const { ids } = payload;
      const { data } = yield call(collectionService.GetCategoryByFollowIDs, payload);
      yield put({
        type: 'setPubsCategoryMap',
        payload: { data: data?.data || {}, ids },
      });
    },

    *CreateCategory({ payload }, { call, put }) {
      const { data } = yield call(collectionService.CreateCategory, payload);
      const { id } = data;
      yield put({
        type: 'addCategory',
        payload: { id, ...payload },
      });
      return data && data.succeed;
    },
    *UpdateCategory({ payload }, { call, put }) {
      const { data } = yield call(collectionService.UpdateCategory, payload);
      console.log('update', data);
      yield put({
        type: 'updateCategory',
        payload,
      });
      return data && data.succeed;
    },
    *RemoveCategory({ payload }, { call, put }) {
      const { data } = yield call(collectionService.RemoveCategory, payload);
      console.log('remove', data);
      yield put({
        type: 'removeCategory',
        payload: { ids: payload?.ids },
      });
      return data && data.succeed;
    },
  },

  reducers: {
    update(state, { payload }) {
      Object.keys(payload).forEach(key => {
        const value = payload[key];
        state[key] = value;
      });
    },

    updateReviewPubs(state, { payload }) {
      const { pid } = payload;
      const temp = [...state.reviewPubs];
      const index = temp.indexOf(pid);
      if (index === -1) {
        temp.push(pid);
      } else {
        temp.splice(index, 1);
      }
      state.reviewPubs = temp;
    },

    addCategory(state, { payload }) {
      const { id, name, color } = payload;
      const collections = [...state.pubCollection];
      const new_cat = { id, name, color };
      state.pubCollection = [...collections, new_cat];
    },
    updateCategory(state, { payload }) {
      const { id } = payload;
      const collections = [...state.pubCollection];
      const cids = collections.map(item => item.id);
      const edit_index = cids.indexOf(id);
      collections.splice(edit_index, 1, payload);
      state.pubCollection = collections;
    },
    removeCategory(state, { payload }) {
      const { ids } = payload;
      let collections = [...state.pubCollection];
      collections = collections.filter(item => !ids.includes(item?.id));
      console.log('collections', collections);
      // const new_cat = { id, name, color };
      state.pubCollection = collections;
    },

    setCollectionMap(state, { payload }) {
      const { data } = payload;
      state.collectionMap = { ...state.collectionMap, ...data };
    },

    setReviewPubs(state, { payload }) {
      const { ids = [] }: { ids: string[] } = payload;
      state.reviewPubs = ids;
    },

    setCategory(state, { payload }) {
      const { category } = payload;
      state.pubCollection = category?.pubs;
      // .reverse()
      // state.defaultTopics = result;
    },

    setPubsCategoryMap(state, { payload }) {
      const { data, ids } = payload;
      const temp = { ...state.pubCategoryMap, ...data };
      ids.forEach((id: string) => {
        if (!data[id]) {
          temp[id] = null;
        }
      });
      state.pubCategoryMap = temp;
      // state.defaultTopics = result;
    },

    removePubsCategory(state, { payload }) {
      const { pid } = payload;
      const temp = {
        ...state.pubCategoryMap,
      };
      temp[pid] = null;
      state.pubCategoryMap = { ...temp };

      const temp_map = {
        ...state.collectionMap,
      };
      temp_map[pid] = null;
      state.collectionMap = { ...temp_map };
      // state.defaultTopics = result;
    },
  },
};
