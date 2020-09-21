/* eslint-disable no-param-reassign */
import { searchService, ai10Service } from 'services/aminer';
import * as bridge from 'utils/next-bridge';
import { wget } from 'utils/request-umi-request';
import consts from 'consts';
import { takeLatest } from 'utils/helper';

// TODO 移动service到独立的service。
const dataurl = `${consts.ResourcePath}/data/ai10/v2.0/ai10data.json`;
const female_dataurl = `${consts.ResourcePath}/data/ai_female/v1.0/`;
const conf_dataurl = `${consts.ResourcePath}/data/ranks`;
const ranks_file = 'ranks2020.json';
const chart_file = 'others2020.json';
const ai_history_file = `${consts.ResourcePath}/data/ai_history/history_html/ai-history.html`;

export default {
  namespace: 'aminerAI10',

  state: {
    ai10_data: null,
    profileAwards: null,
    scholarList: null,
    personAwards: null,
    domainList: null,
    domainInfo: null,
    aiYearData: null,
    homeComments: null,
    tracks: null,
    orgHomeInfo: null,
    dynamic_id: false,
    scholarsDynamicValue: null,
    ai_history_data: null,
  },

  effects: {
    getAwardRosterTop100: [
      function* G({ payload }, { call, put }) {
        const { typeid } = payload;
        const params = {
          id: typeid,
          offset: 0,
          size: 100,
        };
        const { data } = yield call(searchService.getAwardRosterPersons, params);
        yield put({
          type: 'setScholarList',
          payload: {
            scholarList: data.result,
            typeid,
          },
        });
      },
      takeLatest,
    ],
    getAwardRoster: [
      function* G({ payload }, { call, put }) {
        const data = yield wget(dataurl);
        yield put({
          type: 'getAwardRosterSuccess',
          payload: {
            data,
          },
        });
      },
      takeLatest,
    ],

    getAwardRosterTop100ById: [
      function* G({ payload }, { call, put }) {
        const { domain_id } = payload;
        yield put({
          type: 'setCurrentID',
          payload: {
            typeid: domain_id,
          },
        });
        const { data } = yield call(ai10Service.getAwardRosterPersonsById, payload);
        yield put({
          type: 'setScholarList1',
          payload: {
            scholarList: data && data.item,
            domain_id,
          },
        });
      },
      takeLatest,
    ],

    GetDomainTopScholars: [
      function* G({ payload }, { call, put }) {
        const { domain, chineseType } = payload;
        yield put({
          type: 'setCurrentID',
          payload: {
            typeid: domain,
          },
        });
        const { data } = yield call(ai10Service.GetDomainTopScholars, payload);
        let res = data && data.data;
        if (chineseType && chineseType.length) {
          res = data && data.data.filter(d => d.chinese && d.chinese === chineseType);
        }

        yield put({
          type: 'setScholarList1',
          payload: {
            scholarList: res,
            domain_id: domain,
          },
        });
      },
      takeLatest,
    ],
    GetMultDomainsTopScholars: [
      function* G({ payload }, { call, put }) {
        const { domain_ids, chineseType } = payload;
        const { data } = yield call(ai10Service.GetMultDomainsTopScholars, payload);
        let res = data && data.data;
        if (chineseType && chineseType.length) {
          res = data && data.data.filter(d => d.chinese && d.chinese === chineseType);
        }
        yield put({
          type: 'setScholarList1',
          payload: {
            scholarList: res,
            domain_id: domain_ids,
          },
        });
      },
      takeLatest,
    ],

    *getFemaleAwardRoster({}, { put }) {
      const data = yield wget(female_dataurl + ranks_file);
      yield put({
        type: 'getFemaleAwardRosterSuccess',
        payload: {
          data,
        },
      });
    },

    *getFemaleOtherData({}, { put }) {
      const data = yield wget(female_dataurl + chart_file);
      yield put({
        type: 'getFemaletherDataSuccess',
        payload: {
          data,
        },
      });
    },
    *getListAwardsByAid({ payload }, { call, put }) {
      const { profile, ...params } = payload;
      const { data } = yield call(searchService.getListAwardsByAid, params);
      yield put({
        type: 'setAwardList',
        payload: {
          result: data,
          profile,
        },
      });
      return data;
    },

    *getPersonAwardsById({ payload }, { call, put }) {
      const { profile, isMe, ...params } = payload;
      const { data } = yield call(ai10Service.getPersonAwardsById, params);
      yield put({
        type: 'getPersonAwardsByIdSuccess',
        payload: {
          result: data,
          profile,
          isMe,
        },
      });
      return data;
    },

    // *GetDomainInfo({ payload }, { call, put }) {
    //   const { data } = yield call(ai10Service.GetDomainList, payload);
    //   yield put({
    //     type: 'getDomainListSuccess',
    //     payload: {
    //       domainData: data && data.item,
    //     },
    //   });
    // },

    *GetSSRDomainInfoData({ payload }, { call, put }) {
      const { aiType, year } = payload;
      const { data } = yield call(ai10Service.GetDomainList, {
        year: year - 0,
      });
      const domainData = data && data.item;
      const homeComments = data && data.keyValues && data.keyValues.home_comments;
      // const tracks = domainData && domainData.map(domain => {
      //   return {
      //     type: `${aiType}${year}`,
      //     target_type: domain.name,
      //     size: 1,
      //   };
      // });
      // const { data: tracksData } = yield call(ai10Service.GetTrack, { data: tracks });

      const list =
        domainData &&
        domainData.map((item, index) => {
          const { name } = item;
          const aliasArr = name.toLowerCase().split(/[^a-zA-Z0-9]/g);
          const alias =
            aliasArr.length > 1 ? aliasArr.map(character => character[0]).join('') : aliasArr[0];
          return {
            ...item,
            alias,
            // total:
            //   tracksData &&
            //   tracksData.data &&
            //   tracksData.data[index] &&
            //   tracksData.data[index].keyValues &&
            //   tracksData.data[index].keyValues.total,
          };
        });
      yield put({
        type: 'getDomainListSuccess',
        payload: {
          domainData,
          list,
          homeComments,
        },
      });
      return list;
    },

    *GetAuthorPubs({ payload }, { call, put }) {
      const { data } = yield call(ai10Service.GetAuthorPubs, payload);
      return data && data.data && data.data[0] && data.data[0].pubs;
    },

    *CheckDomainsExist({ payload }, { call, put }) {
      const { data } = yield call(ai10Service.CheckDomainsExist, payload);
      return data && data.data;
    },

    *SetDomainComment({ payload }, { call, put }) {
      const { data } = yield call(ai10Service.SetDomainComment, payload);
      return data && data.item;
    },

    *GetHomeInfo({ payload }, { call, put }) {
      const { data } = yield call(ai10Service.GetHomeInfo, payload);
      yield put({
        type: 'setAiYearData',
        payload: {
          data: data && data.keyValues,
        },
      });
    },

    *GetOrgHomeInfo({ payload }, { call, put }) {
      const { data } = yield call(ai10Service.GetOrgHomeInfo, payload);
      yield put({
        type: 'setOrgHomeInfo',
        payload: {
          data: data && data.keyValues,
        },
      });
    },

    *GetScholarsDynamicValue({ payload }, { call, put }) {
      const { data } = yield call(ai10Service.GetScholarsDynamicValue, payload);
      yield put({
        type: 'setScholarsDynamicValue',
        payload: {
          data: data && data.item,
        },
      });
    },

    *Track({ payload }, { call, put }) {
      const { data } = yield call(ai10Service.Track, payload);
    },

    *GetTrack({ payload }, { call, put }) {
      const { data } = yield call(ai10Service.GetTrack, payload);
      // yield put({
      //   type: 'setTrack',
      //   payload: { data: data && data.keyValues && data.keyValues.total, req: payload && payload.data },
      // });
      return data && data.keyValues && data.keyValues.total;
    },

    *GetWechatSignature({ payload }, { call, put }) {
      const { data } = yield call(ai10Service.GetWechatSignature, payload);
      if (data.succeed) {
        return data && data.keyValues;
      }
      return null;
    },

    *getAddFields({ payload }, { call, put }) {
      const data = yield call(ai10Service.getAddFields, payload);
      if (data.success) {
        return data.data;
      }
      return null;
    },

    *getConfRanksData({ payload }, { put }) {
      const { domain_alias, conf_name } = payload;
      const data = yield wget(`${conf_dataurl}/${conf_name}/${domain_alias}_${conf_name}.json`);
      yield put({
        type: 'getConfRanksDataSuccess',
        payload: {
          data,
        },
      });
    },

    *getAIHistoryData({ payload }, { put }) {
      const data = yield wget(ai_history_file);
      console.log('data..', data);
      yield put({
        type: 'setAIHistoryData',
        payload: {
          data,
        },
      });
    },
  },

  reducers: {
    getAwardRosterSuccess(state, { payload: { data } }) {
      state.ai10_data = data;
    },

    getFemaleAwardRosterSuccess(state, { payload: { data } }) {
      state.ai10_female_ranks = data;
    },

    getConfRanksDataSuccess(state, { payload: { data } }) {
      state.ai2000_conf_ranks = data;
    },

    setAIHistoryData(state, { payload: { data } }) {
      state.ai_history_data = data;
    },

    getFemaletherDataSuccess(state, { payload: { data } }) {
      state.ai10_female_data = data;
    },

    setCurrentID(state, { payload: { typeid } }) {
      state.currentID = typeid;
    },

    setScholarList(state, { payload: { scholarList, typeid } }) {
      state.scholarList = bridge.toNextPersons(scholarList);
      state.currentID = typeid;
    },

    setScholarList1(state, { payload: { scholarList, domain_id } }) {
      state.scholarList = scholarList;
      state.dynamic_id = domain_id;
    },
    /*
        filterScholarListByChinese(state, { payload: { chineseType } }) {
          state.scholarList = state.scholarList.filter(obj => obj.chinese === chineseType);
        },
     */
    setAwardList(state, { payload }) {
      // console.log('payload', payload)
      const { result, profile: person } = payload;
      const info = result && result.items && result.items[0];
      const awards = (result && result.keyValues && result.keyValues.awards) || {};
      if (!info && !person) {
        return;
      }
      const profile = {
        id: (person && person.id) || (info && info.id),
        name: (person && person.name) || (info && info.name),
      };

      const awardsByJson = [];
      Object.entries(awards).map(([key, value]) => {
        const idAndRank = key.split('#');
        if (idAndRank[1] === '0') {
          awardsByJson.unshift({
            id: idAndRank[0],
            type: idAndRank[1],
            value,
          });
        } else {
          awardsByJson.push({
            id: idAndRank[0],
            type: idAndRank[1],
            value,
          });
        }
      });

      profile.awards = awardsByJson;

      const { profileAwards } = state;
      if (!profileAwards) {
        state.profileAwards = [profile];
      } else {
        profileAwards.push(profile);
        state.profileAwards = profileAwards;
      }
    },

    getPersonAwardsByIdSuccess(state, { payload }) {
      const { result, profile: person, isMe } = payload;
      const info = result && result.item && result.item[0];
      const awards = (result && result.keyValues && result.keyValues.awards) || [];
      // || -> (fix ssr 掉两次 api)
      if (
        (!info && !person) ||
        (person &&
          isMe &&
          state.personAwards &&
          state.personAwards.map(item => item.id).includes(person.id))
      ) {
        return;
      }
      const profile = {
        id: (person && person.id) || (info && info.id),
        name: (person && person.name) || (info && info.name),
      };
      profile.awards = awards;
      const { personAwards } = state;
      if (!personAwards) {
        state.personAwards = [profile];
      } else {
        state.personAwards = state.personAwards.concat(profile);
      }
    },

    getDomainListSuccess(state, { payload }) {
      const { list, domainData, homeComments } = payload;
      state.domainList = list;
      state.domainInfo = domainData;
      state.homeComments = homeComments;
    },

    cleanAwardList(state, { payload }) {
      state.profileAwards = null;
      state.personAwards = null;
    },

    setAiYearData(state, { payload }) {
      const { data } = payload;
      state.aiYearData = data;
    },

    setOrgHomeInfo(state, { payload }) {
      const { data } = payload;
      state.orgHomeInfo = data;
    },

    setScholarsDynamicValue(state, { payload }) {
      const { data = [] } = payload;
      const obj = {};
      data.forEach(item => {
        const { id, ...params } = item;
        obj[id] = params;
      });
      state.scholarsDynamicValue = obj;
    },

    setTrack(state, { payload }) {
      const { data = [], req = [] } = payload;
      const obj = {};
      data.forEach((item, index) => {
        obj[req[index].target_type] = item.keyValues && item.keyValues.total;
      });
      state.tracks = obj;
    },
  },
};
/* eslint-enable no-param-reassign */
