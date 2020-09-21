import { getCompanyList, getCompanyPerson, getBannerComs, getGiant, getCompanyDetail, getSelections } from 'services/aiopen/company'

import cookies from 'utils/cookie';

export default {
  namespace: 'aiopenCompany',

  state: {
    list: [],
    detail: {},
    loading: false,
    industry: '',
    province: '',
    total: 0,
    giantList: [],
    bannerCompany: [],
    selections: {
      province: [],
      industry: [],
      ai_type: [],
      sort_by: [],
    },
  },

  effects: {
    *getRankList({ payload }, { call, put }) {
      const { type } = payload
      yield put({ type: 'setLoading', payload: { load: true } });
      const { page = 0, size = 25 } = payload
      const offset = page * size
      const data = type === 'giant'
        ? yield call(getGiant, payload)
        : yield call(getCompanyList, { offset, ...payload, });

      if (type === 'giant' && data) {
        yield put({ type: 'setList', payload: { list: data, total: data.length } });
      } else if (data && data.data && data.data.keyValues) {
        const { coms, total } = data.data.keyValues
        yield put({ type: 'setList', payload: { list: coms, total } });
      } else {
        yield put({ type: 'setLoading', payload: { load: false, type: 'domain' } });
      }
    },
    *getCompanyPerson({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: { load: true, type: 'domain' } });
      const data = yield call(getCompanyPerson, payload);
      if (data && data.success && data.data) {
        const list = data.data
        yield put({ type: 'setDetail', payload: list });
      } else {
        yield put({ type: 'setLoading', payload: { load: false, type: 'domain' } });
      }
    },
    *getCompanyDetail({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: { load: true, } });
      const { data } = yield call(getCompanyDetail, payload);
      if (data && data.keyValues && data.keyValues.com) {
        yield put({ type: 'setDetail', payload: data.keyValues });
      } else {
        yield put({ type: 'setLoading', payload: { load: false, type: 'domain' } });
      }
    },

    // 获取公司selections
    *getSelections({ payload }, { call, put, select }) {
      const selections = yield select(state => state.aiopenCompany.selections)
      if (!selections.province && selections.province.length || !selections.industry.length || !selections.ai_type) {
        const data = yield call(getSelections)
        yield put({ type: 'setSelection', payload: data });
      }
    },

    // 获取Banner公司
    *getBannerCompany({ payload }, { call, put, select }) {
      const bannerCompany = yield select(state => state.aiopenCompany.selections)
      if (!bannerCompany || !bannerCompany.length) {
        const data = yield call(getBannerComs)
        yield put({ type: 'setBanner', payload: data });
      }
    },
  },
  reducers: {
    /* eslint-disable no-param-reassign */
    setLoading(state, { payload }) {
      const { load = false } = payload
      state.loading = load
    },
    setList(state, { payload }) {
      const { list, total } = payload
      state.list = list
      state.total = total
      state.loading = false
    },
    setDetail(state, { payload }) {
      state.detail = payload
      state.loading = false
    },
    setBanner(state, { payload }) {
      state.bannerCompany = payload
    },
    setSelection(state, { payload }) {
      const { province, industry } = payload
      if (province && province.length && industry && industry.length) {
        state.selections = payload
      }
    }

  }
}
