import { commonService, reportService } from 'services/aminer';

export default {
  namespace: 'aminerCommon',

  state: {
    wechatVer: false,
    homeWords: null,
    showFeedDot: true,
  },

  subscriptions: {},

  effects: {
    *Track({ payload }, { call }) {
      const { pid, aid, assign } = payload;
      const params = [
        {
          payload: JSON.stringify({ pid, aid, flag: assign }),
          type: 'verifed_da',
        },
      ];
      yield call(commonService.Track, params);
    },

    *setTrack({ payload }, { call }) {
      yield call(commonService.Track, { data: payload });
    },

    *getHomeData({ payload }, { call, put, all, select }) {
      const { size } = payload;
      // TODO cache.
      const { data: dailyNewsData } = yield call(reportService.getDailyNews, { size });
      // console.log("++++++++++", dailyNewsData);
      yield put({
        type: 'report/setDailyNews',
        payload: { list: dailyNewsData && dailyNewsData.data },
      });
    },
  },

  reducers: {
    setWechatVer(state, { payload }) {
      const { ver } = payload;
      state.wechatVer = ver;
    },
    HideFeedDot(state, { payload }) {
      state.showFeedDot = false;
    },
  },
};
