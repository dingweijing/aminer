/* eslint-disable no-param-reassign */
import { refreshPageIfUrlTransfer } from 'utils/misc';
import { System } from '@/../.startup/startup'; // import from this place in global.js
import { confService } from 'services/aminer';
import * as auth from 'utils/auth';

export default {
  namespace: 'global',

  state: {
    collapsed: false, // TODO menu
    preventRender: false, // TODO 支持跳转用，当不用新老系统共存时就没有这个问题了。
  },

  effects: {
    *setAllViews({ payload }, { call, put }) {
      yield call(confService.setOrGetClickView, {
        type: 'click',
        id: 'AMiner',
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      state.collapsed = payload;
    },

    preventRenderOnce(state) {
      state.preventRender = true;
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        // console.log('||||||||||||||||||||||||||||', pathname, search)

        if (typeof window === 'object' && typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }

        // ! Special, when build aminer production, jump;
        if (System === 'aminer') {
          // && process.env.NODE_ENV !== 'production'
          // 统计AMiner网站的整个流量
          dispatch({ type: 'setAllViews' });
          // 在前后端共存的系统中，当判断出页面由新前端（这里）到老前端的跳转，强制刷新URL。
          const isRedirect = refreshPageIfUrlTransfer(pathname, search);
          if (isRedirect) {
            dispatch({ type: 'preventRenderOnce' });
          }
        }
      });
    },
  },
};
/* eslint-enable no-param-reassign */
