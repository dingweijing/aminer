/* eslint-disable no-restricted-syntax */
import * as personService from 'services/personService';
import * as dataUtils from 'utils/data';
import { takeLatest } from 'utils/helper';

export default {
  namespace: 'personpath',

  state: {
    paths: null,
  },

  subscriptions: {},

  effects: {

    findPath: [function* findPath({ payload }, { call, put }) {
      const { id1, id2, n, sort } = payload;
      const { success, data } = yield call(personService.findPath, { id1, id2, n, sort });
      if (success && data) {
        if (data.succeed && data.items) {
          yield put({ type: 'findPathSuccess', payload: { paths: data.items } });
          return true;
        }
      } else {
        yield put({ type: 'findPathSuccess', payload: { paths: [] } });
      }
      return false;
    }, takeLatest],

    * fillPersons({ payload }, { call, put, select }) {
      const paths = yield select(state => state.personpath && state.personpath.paths);
      if (!paths || paths.length === 0) {
        return;
      }
      const ids = dataUtils.extract(paths, ['nodes', '*', 'id']);
      if (!ids || ids.length === 0) {
        return;
      }

      const { success, data } = yield call(personService.fetchPersonByIDs, { ids });
      if (success && data) {
        const indexMap = dataUtils.buildIndexMap(data.items, 'id');
        dataUtils.applyIndexMapIntoData(paths, indexMap, ['nodes', '*', 'id'], 'person');
        yield put({ type: 'findPathSuccess', payload: { paths } });
      }
    },

  },

  reducers: {

    clearModel(state) {
      return {
        ...state,
        paths: null,
      };
    },

    findPathSuccess(state, { payload: { paths } }) {
      const newPaths = [];
      for (const path of paths) {
        newPaths.push(path);
      }
      return { ...state, paths: newPaths };
    },

  },

};
