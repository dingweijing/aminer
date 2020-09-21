/* eslint-disable no-param-reassign */
import * as bridge from 'utils/next-bridge';
import { wget } from 'utils/request-umi-request';
import { timeLineService } from 'services/aminer';
import EXPERT_LIST from '../../aminer/core/pub/specialist'

const myservice = timeLineService.getData1()
const newsService = timeLineService.expertClosure()

// TODO 移动service到独立的service。
// const dataurl = `${consts.ResourcePath}/data/ai10/v2.0/ai10data.json`;
const dataurl = 'https://originalstatic.aminer.cn/misc/ncov/ncovV2.json';
const timeurl = 'https://originalstatic.aminer.cn/misc/ncov/time.json';
export default {
  namespace: 'timeLine',

  state: {
    pubData: [],
    updateTime: null,
    // likeData: null,
    total: 0,
    spcialistList: [],
    expert_loading: true,
    expertMap: {},
  },

  effects: {
    *getPubTimeLine({ payload }, { put, call, select }) {
      const { pass, type, classes, skip, limit, isExpert = false } = payload;
      const spcialistList = yield select(state => state.timeLine.spcialistList);
      if (isExpert /* && !spcialistList.length */) {
        yield put({
          type: 'getDefaultSpecialList',
        });
      }
      const [time] = yield [wget(timeurl)];
      if (isExpert) {
          yield put({ type: 'setLoading', payload: { loading: true } })
          const data = yield call(myservice, { type, classes, skip, limit });
          const result = data.data.data.res
          yield put({
            type: 'getSpecialListSuccess',
            payload: { data: data.length ? data : result },
          });

           if (!classes.includes('allTopic')) {
            const sl = yield select(state => state.timeLine.spcialistList);

            const ids = sl && sl.length && sl.map(obj => EXPERT_LIST[obj.name] && EXPERT_LIST[obj.name].id)

            yield put({
              type: 'getExpertNews',
              payload: { id: ids },
            });
          }
      } else {
      const { data } = yield call(timeLineService.getData, { type, classes, skip, limit });

        yield put({
          type: 'getPubTimeLineSuccess',
          payload: { data: data.data || [], time, pass },
        });
      }
    },
    // * getLike({ payload }, { call, put }) {
    //   const { data } = yield call(timeLineService.getLike);
    //   if (data && data.data) {
    //    ' yield put({ type: 'getLikeSuccess', payload: { data: data.data } });
    //   }
    // },
    *updateLike({ payload }, { call, put }) {
      const { data } = yield call(timeLineService.updateLike, payload);
      if (data && data.success) {
        yield put({ type: 'updateLikeSuccess', payload });
      }
    },
    *getSpecialList({ payload }, { call, put }) {
      const { data } = yield call(timeLineService.getSpecialList, payload);
      if (data && data.success) {
        yield put({ type: 'getSpecialListSuccess', payload: { data: data.data } });
      }
    },
    *getExpertNews({ payload }, { call, put }) {
      const { id } = payload
      const data = yield call(newsService.getExpert, id);
      if (data) {
        /* console.log('id', id)
        console.log('getExpertNews', data) */
        yield put({ type: 'setExpertNews', payload: { data, id } })
      }
    },
  },

  reducers: {
    setExpertNews(state, { payload }) {
      const { data, id } = payload
      if (Array.isArray(id)) {
        state.expertMap = {
          ...state.expertMap,
          ...data
        }
      } else {
        state.expertMap = {
          ...state.expertMap,
          [id]: data
        }
      }
    },
    getDefaultSpecialList(state) {
        state.spcialistList = Object.keys(EXPERT_LIST).map(k => ({ name: k, data: [] }))
    },
    setLoading(state, { payload }) {
      const { loading } = payload
      state.expert_loading = loading
    },
    getSpecialListSuccess(state, { payload: { data } }) {
      const oldSpecialList = state.spcialistList
      const newSecialList = [...oldSpecialList]
      const indexMap = {
        // name:idx
      }
      data.forEach(r => {
        if (r.related && r.related.length) {
          const rs = r.related[0]
          if (rs && EXPERT_LIST[rs]) {
            let idx = -1
            if (indexMap[rs]) {
              idx = indexMap[rs]
            } else {
              idx = oldSpecialList.findIndex(item => item.name === rs)
              indexMap[rs] = idx
            }
            if (idx > -1) {
              newSecialList[idx].data.push(r)
            }
          }
        }
      })
      // const r = Object.keys(result).map(i => ({ name: i, ...result[i] }));
      state.spcialistList = newSecialList.filter(i => i.data && i.data.length)
      state.expert_loading = false
    },
    getPubTimeLineSuccess(state, { payload: { data, time, pass } }) {
      // const filData = data.filter((item) => {
      //   return item.type === '学者论文'
      // })
      const { total, res } = data;
      if (pass) {
        state.pubData = res;
      } else {
        state.pubData.push(...res);
      }
      state.total = total;
      state.updateTime = time.time;
    },

    // filterData(state, { payload: { type, topic } }) {
    //   console.log('type, topic :', type, topic);
    //   const { backData } = state;
    //   const defaultType = ['学者论文', '专家论点', '学术事件'];
    //   const defaultTopic = ['药物&疫苗', '检测诊断', '病毒溯源', '疫情防控', '流行预测', '机理研究', '临床救治', '其他'];
    //   let typeMap = {}, topicMap = {};
    //   if (type.length === 1 && type[0] === 'allType') {
    //     typeMap = null;
    //   } else {
    //     type.forEach(item => typeMap[item] = 1);
    //   }
    //   if (topic.length === 1 && topic[0] === 'allTopic') {
    //     topicMap = null;
    //   } else {
    //     topic.forEach(item => topicMap[item] = 1);
    //   }

    //   const filData = backData.filter(item => {
    //     let bool1 = true, bool2 = true;
    //     if (typeMap) {
    //       bool1 = typeMap[item.type];
    //     }
    //     if (topicMap) {
    //       bool2 = topicMap[item.class];
    //     }
    //     return bool1 && bool2;
    //   })
    //   state.pubData = filData.length > 0 ? filData : [];
    // },

    getLikeSuccess(state, { payload: { data } }) {
      state.likeData = data;
    },

    updateLikeSuccess(state, { payload: { id } }) {
      const { pubData } = state;
      for (const index in pubData) {
        if (pubData[index].aid === id || pubData[index].id === id) {
          pubData[index].like ? (pubData[index].like += 1) : (pubData[index].like = 1);
        }
      }
    },
  },
};
/* eslint-enable no-param-reassign */
