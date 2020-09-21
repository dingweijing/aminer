/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import React from 'react';

import { formatMessage } from 'locales';
// import { ImgViewer } from 'aminer/components/widgets';

const initModal = {
  visible: false,
  intro: '',
  src: null,
  mask: true,
  maskClosable: true,
  maskStyle: {},
  afterClose: null,
  content: null,
  // onOk: null,
  // onCancel: null,
  // maskClosable: false,
  // extraArticleStyle: {},
  // width: '600px',
  // className: '',
  // height: null,
  // left: null,
  // top: null,
  // right: null,
  // bottom: null,
  // afterClose: null,
};

export default {
  namespace: 'imgViewer', // TODO rename

  state: {
    visible: false,
    intro: '',
    src: null,  // 图片 src
    mask: true, // 	是否展示遮罩
    maskClosable: true, // 点击遮罩是否允许关闭
    maskStyle: {}, // 遮罩样式
    afterClose: null,   // 关闭后的回调
    content: null,
    // sh: false,
    // onOk: null,
    // onCancel: null,
    // maskClosable: false,
    // extraArticleStyle: {},
    // width: '600px',
    // className: null,
    // height: null,
    // left: null,
    // top: null,
    // right: null,
    // bottom: null,
    // afterClose: null,
  },

  subscriptions: {},

  effects: {

  },

  reducers: {
    open(state, { payload }) {
      console.log('payload', payload)
      Object.keys(payload).forEach(key => {
        const value = payload[key];
        state[key] = value;
      });
      state.visible = true;
      const { ImgViewer } = require('aminer/components/widgets');
      state.content = <ImgViewer />
    },

    close(state, { payload }) {
      for (const key in initModal) {
        state[key] = initModal[key];
      }
    }
  }
};
