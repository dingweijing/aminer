
import { getDomainTree, getRankTree, getRankList, getRankChildren, getMixList, getWorldMapData, getDomainList, personFollow, followedScholars, personUnFollow } from 'services/aiopen/rank';
import { getTargetNode } from 'utils/treeFuncs'

export default {
  namespace: 'ai2000rank',

  state: {
    domainLoading: true,
    rankLoading: true,
    domainTree: {},
    rankTree: {},

    list: {},
    mixList: [],
    listLoading: true,
    mapLoading: true,
    mapList: [],
    domainList: [],

    followedMap: {},
    viewsMap: {},

  },

  effects: {
    // 领域树
    *getDomainTree({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: { load: true, type: 'domain' } });
      const data = yield call(getDomainTree, payload);
      // 请求
      if (data && data.success && data.data) {
        const { keyValues } = data.data
        yield put({ type: 'setTree', payload: { tree: keyValues, type: 'domain' } });
      } else {
        yield put({ type: 'setLoading', payload: { load: false, type: 'domain' } });
      }
    },
    // 专家树
    *getRankTree({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: { load: true, type: 'rank' } });
      const data = yield call(getRankTree, payload);
      yield put({ type: 'setTree', payload: { tree: data, type: 'rank' } });
      // 请求
      /*   if (data && data.success && data.data) {
          const { keyValues } = data.data
          yield put({ type: 'setTree', payload: { tree: keyValues, type: 'rank' } });
        } else {
          yield put({ type: 'setLoading', payload: { load: false, type: 'rank' } });
        } */
    },
    // 获取当前节点下的子节点
    *getOneRank({ payload }, { call, put }) {
      const { parentNode, queryParams, offset } = payload
      const params = {
        ...queryParams, offset
      }
      // yield put({ type: 'setLoading', payload: { load: true, type: 'rankLeaf' } });
      const data = yield call(getRankTree, { ...params });
      // console.log('data', data)
      if (data && data.length) {
        yield put({ type: 'insertRankTree', payload: { parentNode, children: data } });
        // yield put({ type: 'setLoading', payload: { load: false, type: 'rankLeaf' } });
      }
    },

    // 首页几个榜单
    *getList({ payload }, { call, put }) {
      // const {type}=payload
      yield put({ type: 'setLoading', payload: { load: true, type: 'list' } });
      const data = yield call(getRankList, payload);
      yield put({ type: 'setRankList', payload: { list: data } });
      /*  if () {

       } */
    },
    // 混合查询
    *getPeopleList({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: { load: true, type: 'list' } });
      const data = yield call(getMixList, payload);
      // console.log('people list ', data.data.data)
      const { data: { data: personList } } = data
      if (personList && personList.length) {
        const IDs = []
        for (const { person: { id: personID } } of personList) {
          IDs.push(personID)
        }
        yield put({ type: 'userFollowedScholars', payload: { ids: IDs } })
        yield put({ type: 'setList', payload: { list: personList } });
        yield put({ type: 'setLoading', payload: { load: false, type: 'list' } });
      }
    },
    // 混合查询-获取地图数据
    *getMapData({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: { load: true, type: 'map' } });
      const data = yield call(getWorldMapData, payload);
      if (data && data.length) {
        yield put({ type: 'setMapList', payload: { list: data } });
        yield put({ type: 'setLoading', payload: { load: false, type: 'map' } });
      }
    },
    // 获取领域列表
    *getDomainList({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: { load: true, type: 'list' } });
      const data = yield call(getDomainList, payload);
      const { data: { data: domainData } } = data
      if (domainData && domainData.length) {
        const convertData = []
        for (let i = 1; i < domainData.length; i += 1) {
          const { id, name_zh, name } = domainData[i]
          const temp = { id, name_cn: name_zh, value: name, name }
          convertData.push(temp)
        }
        yield put({ type: 'setDomainList', payload: { list: convertData } });
        yield put({ type: 'setLoading', payload: { load: false, type: 'list' } });
      }
    },
    // 用户关注功能
    *personFollow({ payload }, { call }) {
      const data = yield call(personFollow, payload)
      // console.log('person fellow ', data)
      if (data) {
        if (data.success) {
          return 200
        }
      }
      return 201
    },
    // 用户取消关注
    *personUnFollow({ payload }, { call }) {
      const data = yield call(personUnFollow, payload)
      if (data) {
        if (data.success) {
          return 200
        }
      }
      return 201
    },
    // 用户-- 学者 关注对应
    *userFollowedScholars({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: { load: true, type: 'map' } });
      const data = yield call(followedScholars, payload)
      const { data: { item: scholars } } = data
      // console.log('items ', scholars)
      if (scholars && scholars.length) {
        const myMap = new Map();
        const viewsMap = new Map();
        for (let i = 0; i < scholars.length; i += 1) {
          myMap.set(scholars[i].id, scholars[i].is_following)
          viewsMap.set(scholars[i].id, scholars[i].num_viewed)
        }
        yield put({ type: 'setMap', payload: { map: myMap, type: 'followed' } });
        yield put({ type: 'setLoading', payload: { load: false, type: 'map' } });
        // 学者关注数量
        yield put({ type: 'setMap', payload: { map: viewsMap, type: 'views' } });
        yield put({ type: 'setLoading', payload: { load: false, type: 'map' } });
      }
    }
  },
  reducers: {
    /* eslint-disable no-param-reassign */
    setLoading(state, { payload }) {
      const { type = 'rank', load = false } = payload
      state[`${type}Loading`] = load
    },
    setTree(state, { payload }) {
      const { type = 'rank', tree } = payload
      state[`${type}Tree`] = tree
      state[`${type}Loading`] = false
      // state.domainTree = tree
    },
    insertRankTree(state, { payload }) {
      const { parentNode, children } = payload
      const prevTree = { children: state.rankTree.tree }
      getTargetNode(prevTree, parentNode.id, node => {
        node.children = children
      })
    },
    setRankList(state, { payload }) {
      const { list } = payload
      if (list && list.scholar) {
        state.list = list
      }
    },
    setList(state, { payload }) {
      const { list } = payload
      if (Array.isArray(list)) {
        state.mixList = list
      }
    },
    setMapList(state, { payload }) {
      const { list } = payload
      if (Array.isArray(list)) {
        state.mapList = list
      }
    },
    setDomainList(state, { payload }) {
      const { list } = payload
      if (Array.isArray(list)) {
        state.domainList = list
      }
    },
    setMap(state, { payload }) {
      const { type, map } = payload
      if (map) {
        state[`${type}Map`] = map
      }
    }
  }
}
