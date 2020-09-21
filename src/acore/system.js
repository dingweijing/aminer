/* eslint-disable no-console */
/**
 * Created by bogao on 2017/8/18.
 *
 * Note:
 *   This file is also run in node environment.
 *   Can't import any utils. Make sure this file load first.
 */

/* eslint-disable import/no-mutable-exports */
import { colorLog } from 'utils/log';
import consts from 'consts';

let System = '';
let Source = ''; // AppID, Used in UniversalConfig.
let AvailableSystems = [];
/* eslint-enable import/no-mutable-exports */
try {
  // eslint-disable-next-line global-require
  const { System: system, Source: source, AvailableSystems: as } = require('../../.startup/startup');

  System = system;
  Source = source;
  AvailableSystems = as;

  // TODO here is a warning if file doesn't exist.
  // if (process.env.NODE_ENV !== 'production') {
  //   colorLog(
  //     'System Override to [%s] using OVERRIDE. (original is %s)',
  //     'color:white;background-color:orange;padding:1px 4px;',
  //     System, System,
  //   )
  // }
} catch (err) {
  colorLog(
    'Warning! No System Override found. use system[%s]',
    'color:white;background-color:orange;padding:1px 4px;',
    System,
  )
}

// check available
if (AvailableSystems.indexOf(System) < 0) {
  if (process.env.NODE_ENV !== 'production') {
    colorLog(
      'System [%s] is invalid, available:%v',
      'color:white;background-color:orange;padding:1px 4px;',
      System, AvailableSystems,
    )
  }
  throw new Error('System [%s] is invalid! Please check your code.');
}

const SavedSystemKey = 'IJFEOVSLKDFJ';
const LS_USER_KEY = `user_${System}`;

function loadSavedSystem() {
  if (consts.IsServerRender()) {
    return;
  }

  const savedSystem = localStorage.getItem(SavedSystemKey);
  if (!savedSystem) {
    return;
  }
  const ss = JSON.parse(savedSystem);
  if (!ss) {
    return;
  }
  // validate auth
  const data = localStorage.getItem(LS_USER_KEY);
  if (data) {
    const dataObj = JSON.parse(data);
    // console.log('userInSession', dataObj);
    // only god can switch system.
    if (dataObj && dataObj.roles && dataObj.roles.god
      && dataObj.data && dataObj.data.email === ss.user) {
      colorLog(
        'System Override to [%s]. (original is %s)',
        'color:red;background-color:rgb(255,251,130);padding:1px 4px;',
        ss.system, System,
      )

      System = ss.system;
      Source = ss.system;
    }
  }
}

function saveSystem(system, user) {
  if (consts.IsServerRender()) {
    return;
  }
  if (user) {
    localStorage.setItem(SavedSystemKey, JSON.stringify({ user: user.email, system }));
  }
}

// Override system settings from localStorage.
// 只有开发环境或者线上的demo系统可以切换。
if (process.env.NODE_ENV !== 'production' || System === 'demo') {
  loadSavedSystem();
}

export {
  AvailableSystems,
  System,
  Source,
  saveSystem,
  loadSavedSystem,
};
