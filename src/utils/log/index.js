/* eslint-disable no-console */
/**
 *  Created by BoGao on 2019-07-30;
 */
import consts from 'consts';

const timelogger = require('debug')('amg:time');

const colorLog = (pattren, style, ...params) => {
  const serverRender = consts.IsServerRender();
  const msg = serverRender ? pattren : `%c${pattren}`;
  const p = serverRender ? params : [style, ...params];
  if (console && console.log) {
    console.log(msg, ...p);
  }
}

const logtime = msg => {
  timelogger(msg);
}

export {
  colorLog,
  logtime,
};
