/* eslint-disable no-param-reassign */
import * as bridge from 'utils/next-bridge';
import { wget } from 'utils/request-umi-request';
// import consts from 'consts';
import { takeLatest } from 'utils/helper';
// import { timeLineService } from 'services/aminer';

// TODO 移动service到独立的service。
// const dataurl = `${consts.ResourcePath}/data/ai10/v2.0/ai10data.json`;
const dataurl = 'https://originalstatic.aminer.cn/misc/ncov/chineseMedicine.json'
export default {
  namespace: 'chineseMedicine',

  state: {
    chineseMedicineList: null,
  },

  effects: {
    getPubTimeLine: [
      function* G({ }, { put }) {
        const data = (yield ([
          wget(dataurl),
        ]))[0]
        yield put({ type: 'getChineseMedicineListSuccess', payload: { data } });
      },
      takeLatest,
    ],
  },

  reducers: {
    getChineseMedicineListSuccess(state, { payload: { data } }) {
      state.chineseMedicineList = data;
    },
  },
};
/* eslint-enable no-param-reassign */
