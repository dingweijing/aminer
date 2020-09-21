/* eslint-disable no-param-reassign */
import { sysconfig } from 'systems';
import { paperSearchService, searchService, commonService } from 'services/aminer';
import cache from 'helper/cache';
import * as bridge from 'utils/next-bridge';
import { takeLatest } from 'utils/helper';

export default {
  namespace: 'aminerSearch',

  state: {
    isAdvancedSearch: false,
    topic: null,
    infocards: {},
    scholarList: null,
    profileAwards: null,
    disableAdvancedSearch: false,
    COVIDHotExpert: null,
  },

  effects: {

    // * searchTopic({ payload }, { call, put }) {
    //   let { query } = payload;
    //   console.log(query)
    //   query = query.split('||')[0];
    //   const { data } = yield call(paperSearchService.searchTopic, { query });
    //   console.log('topic data', data.data)
    //   yield put({ type: 'setTopic', payload: { data: data.data } });
    // },

    * searchPaperById({ payload }, { call }) {
      const { id } = payload;
      const { data } = yield call(paperSearchService.searchPaperById, { id });
    },

    * ChangeVoteByID({ payload }, { call }) {
      const { tid, id, is_cancel, type, vote_type } = payload;
      const { data, success } = yield call(searchService.ChangeVoteByID, payload);
      return { data, success };
    },

    // * paperMark({ payload }, { call }) {
    //   const { id } = payload;
    //   const { data, success } = yield call(searchService.PaperMark, { id });
    //   if (data) {
    //     return { data, success };
    //   }
    //   return null;
    // },

    // * paperUnMark({ payload }, { call }) {
    //   const { id } = payload;
    //   const { data, success } = yield call(searchService.PaperUnMark, { id });
    //   if (data) {
    //     return { data, success };
    //   }
    //   return null;
    // },

    // 这两个迁移到searchpaper的model了

    * personFollow({ payload }, { call }) {
      const { id } = payload;
      const { data, success } = yield call(searchService.PersonFollow, { id });
      if (data) {
        return { data, success };
      }
      return null;
    },

    * personUnFollow({ payload }, { call }) {
      const { id } = payload;
      const { data, success } = yield call(searchService.PersonUnFollow, { id });
      if (data) {
        return { data, success };
      }
      return null;
    },

    * personSimilar({ payload }, { call }) {
      const { id } = payload;
      const { data } = yield call(searchService.personSimilar, { id });
      if (data) {
        return data.splice(0, 6);
      }
      return [];
    },

    personInfocard: [function* G({ payload }, { call, put }) {
      const { id } = payload;
      const personCache = new cache.LocalStorageCache({
        key: `person-infocard_${id}`, alwaysLoad: false, expires: 1000 * 60 * 60 * 4, // 4 hours
      });
      let res = null;
      const value = personCache.loadCacheValue();
      if (personCache.isCacheValid()) {
        res = value;
      }

      if (personCache.shouldLoad()) {
        const { data } = yield call(searchService.searchPersonsById, { ids: [id] });
        if (data.succeed && data.items) {
          const info = data.items[0];
          if (personCache.shouldUpdate(info)) {
            personCache.updateCache(info);
            res = info;
          }
        }
        // yield put({ type: 'setInfocard', payload: { data: data.items[0], id } });
      }
      return res;
    }, takeLatest],

    getAwardRosterTop100: [function* G({ payload }, { call, put }) {
      // * getAwardRosterTop100({ payload }, { put, call }) {
      const { typeid } = payload;
      const params = { id: typeid, offset: 0, size: 100 }
      const { data } = yield call(searchService.getAwardRosterPersons, params);

      yield put({ type: 'setScholarList', payload: { scholarList: data.result, typeid } })
    }, takeLatest],

    // TODO Deprecated - use person/getPersons instead.
    * searchPersonsById({ payload }, { put, call }) {
      const { data } = yield call(searchService.searchPersonsById, payload);
      if (data) {
        return data.items;
      }
      return null;
    },

    * bibtex({ payload }, { put, call }) {
      const { id } = payload;
      const { data } = yield call(searchService.bibtex, { id });
      if (data) {
        return data;
      }
      return null;
    },

    * getPaperComments({ payload }, { call }) {
      const { data } = yield call(paperSearchService.getPaperComments, payload);
      if (data) {
        return data;
      }
      return null;
    },

    * getListAwardsByAid({ payload }, { call, put }) {
      const { profile, ...params } = payload;
      const { data } = yield call(searchService.getListAwardsByAid, params)
      yield put({
        type: 'setAwardList',
        payload: {
          result: data, profile
        }
      })
      return data
    },

    * addSearchPaper({ payload }, { call, put }) {
      const { data } = yield call(paperSearchService.search, payload);
      if (data) {
        return data
      }
      return null
    },

    * getCOVIDHotExpert({ payload }, { call, put }) {
      const personCache = new cache.LocalStorageCache({
        key: 'COVID-19_HotExpert', alwaysLoad: false, expires: 1000 * 60 * 60 * 2, // 2 hours
      });
      let res = null;
      const value = personCache.loadCacheValue();
      if (personCache.isCacheValid()) {
        res = value;
      }

      if (personCache.shouldLoad()) {
        const data = yield call(searchService.getCOVIDHotExpert);
        if (data.success) {
          const info = data && data.data && data.data.data;
          if (personCache.shouldUpdate(info)) {
            personCache.updateCache(info);
            res = info;
          }
        }
        yield put({ type: 'setCOVIDHotExpert', payload: { data: data && data.data && data.data.data } });
      }
      yield put({ type: 'setCOVIDHotExpert', payload: { data: res } });
    },

    * setTracking({ payload }, { call }) {
      const params = { data: [payload] }
      yield call(commonService.Track, params);
    },

    * Track({ payload }, { call }) {
      yield call(commonService.Track, { data: [ payload ] });
    },

  },

  reducers: {
    toggleAdvancedSearch(state) {
      state.isAdvancedSearch = !state.isAdvancedSearch;
    },

    changeDisableAdvancedSearch(state, { payload }) {
      const { disableAdvancedSearch } = payload
      state.disableAdvancedSearch = disableAdvancedSearch
    },

    setTopic(state, { payload }) {
      const { data } = payload;
      state.topic = data;
    },

    setInfocard(state, { payload }) {
      const { id, data } = payload;
      state.infocards[id] = data;
    },

    setScholarList(state, { payload: { scholarList, typeid } }) {
      state.scholarList = bridge.toNextPersons(scholarList);
      state.currentID = typeid;
    },

    setAwardList(state, { payload }) {
      // console.log('payload', payload)
      const { result, profile: person } = payload;
      const info = result && result.items && result.items[0]
      const awards = result && result.keyValues && result.keyValues.awards || {}
      if (!info && !person) {
        return
      }
      const profile = {
        id: person && person.id || info && info.id,
        name: person && person.name || info && info.name
      }

      const awardsByJson = [];
      Object.entries(awards).map(([key, value]) => {
        const idAndRank = key.split('#')
        if (idAndRank[1] == '0') {
          awardsByJson.unshift({ id: idAndRank[0], type: idAndRank[1], value })
        } else {
          awardsByJson.push({ id: idAndRank[0], type: idAndRank[1], value })
        }
      })

      profile.awards = awardsByJson

      const { profileAwards } = state;
      if (!profileAwards) {
        state.profileAwards = [profile];
      } else {
        profileAwards.push(profile)
        state.profileAwards = profileAwards;
      }
    },

    cleanAwardList(state, { payload }) {
      state.profileAwards = null
    },

    setCOVIDHotExpert(state, { payload }) {
      const { data } = payload
      state.COVIDHotExpert = data;
    }
  }
}
