
import { setOrGetClickView } from 'services/aminer/conf'
import cookies from 'utils/cookie';

export default {
  namespace: 'openIndexSetting',

  state: {

  },

  effects: {
    // 设置网站统计量
    *setViewsStatics({ payload }, { call, put }) {
      const { id } = payload
      // 没有token的情况下再请求
      /* const openIndexInfo = cookies.getCookie('openIndex');
      if (!openIndexInfo) {
        cookies.setCookie('openIndex', 1, '/', 0.1);
      } */
      yield call(setOrGetClickView, { type: 'click', id })
    }
  },
}
