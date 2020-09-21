/* eslint-disable no-param-reassign */

import React from 'react'
import { sysconfig } from 'systems';
import { rankService, reportService } from 'services/aminer';
import { takeLatest } from 'utils/helper';
import helper from 'helper';
import BarChart from '../../aminer/p/ranks-conf/c/BarChart'

const { getLangLabel } = helper
let wholeList = []

export default {
  namespace: 'rank',

  state: {
    personRank: {
      labels: null,
    },
    confList: [],
    currentConfType: undefined,
    dailyList: null,
    isServer: false,
    confIntro: null,
    confInfo: null,
    bestPaperRankInfo: null,
    // confMenus: null,
    expertRankKey: '',
    personAllRank: null,
    personRankByType: null,
    personRankTotal: 0,

    categories: [],
    subMenuList: [],
    tableLoading: true,
    options: [
      {
        /*  label: 'Conference/Journal',
         label_zh: '会议期刊类型', */
        key: 'type',
        single: false,
        span: 12,
        opts: [
          { value: 'C', label: 'Conference', label_zh: '会议' },
          { value: 'J', label: 'Journal', label_zh: '期刊' },
        ],
        defaultValue: ['C', 'J'],
        direction: 'row',
      },
      { direction: 'row', key: 'category_type', single: true, opts: [], span: 12 },
      {
        /*  label: 'Domain',
         label_zh: '领域', */
        key: 'category',
        defaultValue: 'All',
        single: true,
        opts: [],
        span: 12,
      },
    ],
  },

  subscriptions: {},

  effects: {
    *getPersonOverall({ payload }, { call, put }) {
      const { data } = yield call(rankService.personOverall, payload);
      yield put({ type: 'setPersonAllRank', payload: data && data.data });
    },

    getExpertRank: [
      function* G({ payload }, { call, put }) {
        const { data } = yield call(rankService.personTypeRank, payload);
        if (data && data.status) {
          yield put({
            type: 'setExpertRank',
            payload: {
              key: payload.type,
              rankList: data.data,
              total: data.count,
            },
          });
        }
      },
      takeLatest,
    ],

    getExpertRankAndMenu: [
      function* G({ payload }, { call, put, all }) {
        const [initMenu, rankList] = yield all([
          call(rankService.personOverall, payload),
          call(rankService.personTypeRank, payload),
        ]);
        yield put({
          type: 'setExpertRankAndMenu',
          payload: {
            key: payload.type,
            menuList: initMenu && initMenu.data && initMenu.data.data,
            rankList: rankList && rankList.data && rankList.data.data,
            total: rankList && rankList.data && rankList.data.count,
          },
        });
        return {
          menuList: initMenu && initMenu.data && initMenu.data.data,
          rankList: rankList && rankList.data && rankList.data.data,
          total: rankList && rankList.data && rankList.data.count,
        };
      },
      takeLatest,
    ],

    *GetBestPapersFromConferenceType({ payload }, { call, put }) {
      const { data } = yield call(rankService.GetBestPapersFromConferenceType, payload);
      if (data && data.succeed) {
        return data.keyValues.conferences;
      }
      return false;
    },

    GetBestPapersById: [
      function* G({ payload }, { call, put }) {
        const { data } = yield call(rankService.GetBestPapersById, payload);
        if (data && data.succeed) {
          return data.keyValues.conferences;
        }
        return false;
      },
      takeLatest,
    ],

    *getOrgMeta({ payload }, { call, put }) {
      const data = yield call(rankService.orgMeta, payload);
      if (data && data.success) {
        return data;
      }
      return false;
    },

    *SaveBestPaperSubmit({ payload }, { call, put }) {
      const { data } = yield call(rankService.SaveBestPaperSubmit, payload);
      if (data && data.succeed) {
        return true;
      }
      return false;
    },

    *GetBestPaperSubmitByUid({ payload }, { call, put }) {
      const { data } = yield call(rankService.GetBestPaperSubmitByUid, payload);
      if (data.succeed && data.keyValues) {
        return data.keyValues.results;
      }
      return false;
    },

    *UpdateBestPaperSubmitByUid({ payload }, { call, put }) {
      const { data } = yield call(rankService.UpdateBestPaperSubmitByUid, payload);
      if (data && data.succeed) {
        return true;
      }
      return false;
    },

    *DeleteBestPaperSubmit({ payload }, { call, put }) {
      const { data } = yield call(rankService.DeleteBestPaperSubmit, payload);
      if (data && data.succeed) {
        return true;
      }
      return false;
    },

    getConfList: [
      function* G({ payload }, { call, put }) {
        const { data } = yield call(rankService.confList, payload);
        yield put({
          type: 'setConfList',
          payload: { data: data && data.item, type: payload.type },
        });
      },
      takeLatest,
    ],

    *getDailyNews({ payload }, { put, call }) {
      const { data } = yield call(reportService.getReportRank, { 'types': ['view'], 'recent': 30, 'limit': 4 });
      const listArray = data.data || []
      const list = listArray[0] || {}
      const d = list.data
      yield put({ type: 'setDailyNews', payload: d });
    },

    // 聚合的ranks-conf页面的数据获取
    *getConfAndDailyList({ payload }, { call, put, all }) {
      const { size, type } = payload;
      const [confList, dailyList] = yield all([
        call(rankService.confList, { type }),
        call(reportService.getDailyNews, { size }),
      ]);
      const newConfList = confList && confList.data && confList.data.item;
      const newDailyList = dailyList && dailyList.data && dailyList.data.data;
      yield put({ type: 'setConfAndDailyList', payload: { newConfList, newDailyList, type } });
    },

    // 获取左边分类列表
    *getListCategoryType({ payload }, { call, put, all }) {
      const { data } = yield call(rankService.GetListCategoryType, payload);
      const { category_type } = payload;
      if (data && data.succeed) {
        const categories = data && data.data;
        yield put({ type: 'setCategoryList', payload: data && data.data });
        if (categories && typeof categories === 'object') {
          if (!category_type) {
            const keys = Object.keys(categories);
            if (keys.length > 0) {
              const firstChild = categories[keys[0]];
              if (firstChild && firstChild.children) {
                yield put({ type: 'setSubMenuList', payload: firstChild.children });
              }
            }
          } else {
            yield put({ type: 'setSubMenuList', payload: categories[category_type].children });
          }
        }
      }
    },

    // 获取左边分类列表
    *getSelectionOpts({ payload }, { call, put, all }) {
      const { cateType } = payload;
      const { data } = yield call(rankService.GetListCategoryType, payload);
      if (data && data.succeed) {
        const categories = data && data.data;
        yield put({ type: 'setCategoryList', payload: categories });
        yield put({ type: 'setSelection', payload: { cateType } });
      }
    },

    *getConfRankIntro({ payload }, { call, put }) {
      const { data } = yield call(rankService.getConfRankIntro, payload);
      yield put({ type: 'setConfIntro', payload: data && data.item });
    },

    *getConfRankInfo({ payload }, { call, put }) {
      const { data } = yield call(rankService.getConfRankInfo, payload);
      yield put({ type: 'setConfInfo', payload: data && data.keyValues });
    },

    *getConfRankItem({ payload }, { call, put, all }) {
      const [confIntro, confInfo] = yield all([
        call(rankService.getConfRankIntro, payload),
        call(rankService.getConfRankInfo, payload),
      ]);
      const intro = confIntro && confIntro.data && confIntro.data.item;
      const info = confInfo && confInfo.data && confInfo.data.keyValues;
      yield put({ type: 'setConfRankItem', payload: { intro, info } });
    },

    *getBestPaperRankInfo({ payload }, { call, put }) {
      const { data } = yield call(rankService.getBestPaperRankInfo, payload);
      const items = data && data.keyValues && data.keyValues.conferences;
      yield put({ type: 'setBestPaperRankInfo', payload: { data: items } });
    },

    *getListConferenceRank({ payload }, { call, put }) {
      const params = payload;
      console.log('payload', payload)
      const { category, isServer = true } = payload;
      if (
        (category && (category.toLowerCase() === 'all' || category === '所有')) ||
        !payload.category
      ) {
        params.category = null;
      }
      if (payload.type) {
        params.type = payload.type.length > 1 ? undefined : payload.type[0];
      }
      const d = yield call(rankService.GetListConferenceRank, params);
      const { data } = d;
      if (data && data.data) {
        const items = data && data.data;
        yield put({ type: 'setServerState', payload: isServer });
        yield put({ type: 'setLoading', payload: true });
        yield put({ type: 'setConfList', payload: { data: items, type: payload.category } });
        if (payload.sorter) {
          yield put({ type: 'sortConfList', payload: payload.sorter });
        }
        yield put({ type: 'setLoading', payload: false });
      }
      // try {
      // } catch (e) {
      //   console.log('eeee', e);
      // }
    },
    *getConfRankDetail({ payload }, { call, put, all }) {
      const [confIntro, confInfo] = yield all([
        call(rankService.GetJconfStaticInfo, payload),
        call(rankService.GetJconfDynamicInfo, payload),
      ]);
      const intro = confIntro && confIntro.data && confIntro.data.data && confIntro.data.data;
      const info = confInfo && confInfo.data && confInfo.data.data && confInfo.data.data;

      yield put({ type: 'setConfRankItem', payload: { intro, info } });
    },
    // 获取会议列表 （robot）
    *getConfListRobot({ payload }, { call }) {
      const data = yield call(rankService.GetConfListRobot, payload);
      const {
        data: { data: confList },
      } = data;
      const filteredConfList = [];
      if (confList && confList.length) {
        for (let i = 0; i < confList.length; i += 1) {
          const { ccf_category, conference_name, id, short_name } = confList[i];
          filteredConfList.push({ ccf_category, conference_name, id, short_name });
        }
        return filteredConfList;
      }
      return null;
    },
    *askQ3({ payload }, { call, put }) {
      const { data } = yield call(rankService.askQ3, payload)
      const { lang, isMobile } = payload
      const res = data.data
      if (res) {
        const { text } = res
        const isZH = lang.includes('zh')
        const d = isZH ? res.CN : res.EN
        const info = isZH ? text.text_CN : text.text_EN
        const arr = Object.entries(d).map(([k, v]) => ([v, k]))
        yield put({
          type: 'modal/open', payload: {
            width: '1000px',
            content: <BarChart isMobile={isMobile} data={arr} info={info} />,
          }
        });

      }
    },
    // robot 问题1
    *getQ1Answer({ payload }, { call }) {
      const data = yield call(rankService.GetAnswersNew, payload);
      const {
        data: { data: answer },
      } = data;
      if (answer) {
        return answer;
      }
      return null;
    },
    // robot 问题Q2 - Q5
    *getQ2_Q5Answer({ payload }, { call }) {
      const data = yield call(rankService.GetAnswersNew, payload);
      const {
        data: { data: result },
      } = data;
      if (result && result !== '') {
        return result;
      }
      return null;
    },
  },

  reducers: {
    setConfList(state, { payload: { data, type } }) {
      const res = data ? data.map((d, i) => ({ ...d, index: i + 1 })).filter(d => !!d.h5_index) : [];
      state.confList = res
      wholeList = res
      state.confList = data
        ? data.map((d, i) => ({ ...d, index: i + 1 })).filter(d => !!d.h5_index)
        : [];
      // state.currentConfType = type;
    },
    sortConfList(state, { payload: { order, key } }) {
      const { confList } = state;

      const findPrevEqualItemIndex = (key, arr, index) => {
        let cur = index;
        while (cur > 0) {
          if (arr[index][key] === arr[cur][key]) {
            cur -= 1;
          } else break;
        }
        return cur + 2;
      };

      const sortedList = confList
        .sort((a, b) => {
          const a1 = typeof a[key] === 'undefined' || a[key] === '' ? -1 : a[key];
          const b1 = typeof b[key] === 'undefined' || b[key] === '' ? -1 : b[key];

          if (typeof a1 === 'number') return (b1 - a1) * order;
          if (typeof a1 === 'string') {
            if (order > 0) {
              // 正序
              return a1 > b1 ? 1 : -1;
            }
            return a1 > b1 ? -1 : 1;
          }
          return 0;
        })
        .map((a, idx, arr) => {
          const prevIdx = idx - 1;
          if (prevIdx < 0) return { ...a, index: idx + 1 };
          const isEqual = arr[prevIdx][key] === arr[idx][key];
          return { ...a, index: isEqual ? findPrevEqualItemIndex(key, arr, idx) : idx + 1 };
        });

      /*  ({
           ...a,
           index: idx + 1
         })) */
      state.confList = sortedList
      wholeList = sortedList
    },
    setOptions(state, { payload }) {
      state.options = payload;
    },
    searchConference(state, { payload }) {
      const keyword = payload.toLowerCase()
      if (!payload) {
        state.confList = wholeList
        return;
      }

      const final = wholeList.filter(item => {
        const { conference_name, short_name } = item
        return short_name.toLowerCase().includes(keyword) || conference_name.toLowerCase().includes(keyword)
      })
      state.confList = final

    },
    setSelection(state, { payload }) { // 设置第一个类型 ccf/thu
      const { categories, options } = state
      const { key, value, cateType } = payload
      const opt = [...options]

      const handleOpts1 = () => {
        const keys1 = Object.keys(categories);
        const category_type = keys1.map(k => categories[k]);
        opt[1] = { ...opt[1], opts: category_type, defaultValue: keys1[0] };
        handleOpts2(value);
      };
      const handleOpts2 = categoryType => {
        if (!categories[categoryType]) return undefined;
        const domain = categories[categoryType].children;
        opt[2] = {
          ...opt[2],
          // options: domain,
          opts: [{ label: 'All', label_zh: '全部', value: 'All' }, ...domain],
        };
      };

      if (cateType) {
        handleOpts1();
        handleOpts2(cateType);
        state.options = opt;
        return;
      }

      switch (key) {
        case 'category_type': {
          handleOpts1();
          break;
        }
        case 'category': {
          handleOpts2(value);
          break;
        }
        default: {
          // 默认状态，一上来加载
          handleOpts1();
          handleOpts2('ccf');
        }
      }

      state.options = opt;
    },
    setSubMenuList(state, { payload }) {
      const theList = payload.map(({ label, label_zh }) => ({
        title: getLangLabel(label, label_zh),
        hypen: label_zh,
        key: label_zh,
      }));
      theList.unshift({
        title: getLangLabel('ALL', '所有'),
        hypen: 'ALL',
        key: undefined,
      });
      state.subMenuList = theList;
    },

    setServerState(state, { payload }) {
      state.isServer = payload
    },

    setPersonAllRank(state, { payload }) {
      state.expertRankKey = '';
      state.personAllRank = payload;
    },

    setLoading(state, { payload }) {
      state.tableLoading = payload;
    },

    setExpertRankAndMenu(state, { payload }) {
      const { key, rankList, menuList, total } = payload;
      state.expertRankKey = key;
      state.personAllRank = menuList;
      state.personRankByType = rankList;
      state.personRankTotal = total;
    },

    setDailyNews(state, { payload }) {
      state.dailyList = payload;
    },

    cleanPersonRankByType(state, { payload }) {
      state.personRankByType = [];
    },

    setExpertRank(state, { payload }) {
      const { rankList, total, key } = payload;
      state.expertRankKey = key;
      state.personRankByType = rankList;
      state.personRankTotal = total;
    },

    setConfAndDailyList(state, { payload: { newConfList, newDailyList, type } }) {
      state.confList = newConfList;
      state.currentConfType = type;
      state.dailyList = newDailyList;
    },

    clearConfList(state) {
      state.confList = null;
      state.currentConfType = undefined;
    },

    setConfIntro(state, { payload }) {
      state.confIntro = payload;
    },

    setConfRankItem(state, { payload: { intro, info } }) {
      state.confIntro = intro;
      state.confInfo = info;
    },

    setConfInfo(state, { payload }) {
      state.confInfo = payload;
    },

    setBestPaperRankInfo(state, { payload: { data } }) {
      state.bestPaperRankInfo = data;
    },

    setCategoryList(state, { payload }) {
      const keys = Object.keys(payload);
      const data = {};
      keys.forEach(key => {
        const { name_zh, children, name } = payload[key];
        data[key] = {
          value: key,
          label_zh: name_zh,
          label: name,
          children: children.map(child => {
            const { name, name_zh } = child;
            return { value: name_zh, label: name, label_zh: name_zh };
          }),
        };
      });
      state.categories = data;
    },

    // setConfMenus(state, { payload }) {
    //   const { data } = payload;
    //   const list = [{ title: 'All', key: '0' }];
    //   data && data.length > 0 && data.map((item, index) => {
    //     list.push({
    //       title: item.name,
    //       key: `${index + 1}`
    //     })
    //   })
    //   state.confMenus = list;
    // },
  },
};
