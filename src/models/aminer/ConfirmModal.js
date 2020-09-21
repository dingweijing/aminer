/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import React from 'react';

import { formatMessage } from 'locales';
// import { Login, Register, Forget } from 'aminer/core/auth/c';

const initModal = {
  visible: false,
  title: '',
  onConfirm: null,
  onCancel: null,
  okText: 'Yes',
  cancelText: 'No',
  width: '100vw',
  className: null,
  height: '204px',
  opacity: '95%'
};

export default {
  namespace: 'confirmModal', // TODO rename

  state: {
    visible: false,
    title: '',
    onConfirm: null,
    onCancel: null,
    okText: 'Yes',
    cancelText: 'No',
    width: '100vw',
    className: null,
    height: '204px',
    opacity: '95%'
  },

  subscriptions: {},

  effects: {

  },

  reducers: {
    open(state, { payload }) {
      // Object.keys(payload).forEach(key => {
      //   const value = payload[key];
      //   state[key] = value;
      // });
      Object.entries(payload).map(([key, value]) => {
        state[key] = value
      })
      state.visible = true;
    },

    close(state, { payload }) {
      for (const key in initModal) {
        state[key] = initModal[key];
      }
    }
  }
};
