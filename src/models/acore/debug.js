/* eslint-disable no-param-reassign */
import * as debug from 'utils/debug';

export default {
  namespace: 'debug',

  state: {
    ShowAnnotation: true,
    // debug: null,
  },

  effects: {
  },

  reducers: {
    initDebug(state, { debug: debugval }) {
      // state.debug = debug;
      state.HighlightHoles = debugval.HighlightHoles; // can change to Object.assign?
      // return state.set('debug', debug);
    },

    set(state, { payload }) {
      Object.keys(payload).forEach(key => {
        state[key] = payload[key];
      });
    },

  },

  subscriptions: {
    setup({ history, dispatch }) {
      // 刷新页面第一次调用。这里的DEBUG内容，只有开发模式时才生效。
      if (process.env.NODE_ENV !== 'production') {
        dispatch({ type: 'initDebug', debug });
      }
    },
  },

};
/* eslint-enable no-param-reassign */
