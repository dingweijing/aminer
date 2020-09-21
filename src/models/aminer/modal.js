/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import React from 'react';

import { formatMessage } from 'locales';
// import { Login, Register, Forget } from 'aminer/core/auth/c';

const initModal = {
  visible: false,
  title: '',
  content: null,
  showHeader: true,
  showFooter: false,
  onOk: null,
  onCancel: null,
  maskClosable: false,
  extraArticleStyle: {},
  width: '600px',
  className: '',
  height: null,
  left: null,
  top: null,
  right: null,
  bottom: null,
  afterClose: null,
};

export default {
  namespace: 'modal', // TODO rename

  state: {
    visible: false,
    title: '',
    content: null,
    showHeader: true,
    showFooter: false,
    onOk: null,
    onCancel: null,
    maskClosable: false,
    extraArticleStyle: {},
    width: '600px',
    className: null,
    height: null,
    left: null,
    top: null,
    right: null,
    bottom: null,
    afterClose: null,
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
    },

    login(state, { payload }) {
      state.title = formatMessage({ id: 'aminer.login.login', defaultMessage: 'Login' });
      state.visible = true;
      const { Login } = require('aminer/core/auth/c')
      state.content = <Login />;
    },

    forget(state, { payload }) {
      state.title = formatMessage({ id: 'aminer.login.password.reset', defaultMessage: 'Reset password' });
      state.visible = true;
      const { Forget } = require('aminer/core/auth/c')
      state.content = <Forget />;
    },

    register(state, { payload }) {
      state.title = formatMessage({ id: 'aminer.login.register', defaultMessage: 'Register' });
      state.visible = true;
      const { Register } = require('aminer/core/auth/c')
      state.content = <Register />;
    },

    close(state, { payload }) {
      for (const key in initModal) {
        state[key] = initModal[key];
      }
    }
  }
};
