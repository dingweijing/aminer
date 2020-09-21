/* eslint-disable no-console */
/**
 *  Created by BoGao on 2017-08-14;
 *
 *  Note: This util is disabled in production mode.
 */
// const ReduxLoggerEnabled = true;

import { colorLog } from 'utils/log';
import { fundebug, logFundebug } from './firebug';

const debuger = require('debug');

export function setDebug(debugConfig) {
  // debuger.enable('*,-sockjs*,-aminerdebug:*');
  debuger.enable(debugConfig);
}

// TODO 禁用服务端的输出.
const ReduxLoggerEnabled = false;
const DebugLogEnabled = false;
const LogRequest = true;
const LogRequestResult = false;
const LogRequestContent = false;

const LogHOC = false;

const HighlightHoles = 'none'; // ['none' | 'yes' | 'all']

// Log common message.
function log(...data) {
  if (DebugLogEnabled) {
    // add color automatically.
    console.log(...data);
  }
}

// Log every network request.
function logRequest(pattern, ...data) {
  if (LogRequest) {
    const style = 'background-color:#00a854;color:white;padding:2px 8px;border-radius: 2px;';
    colorLog(pattern, style, ...data)
  }
}

// Log every network request Response.
function logRequestResult(pattern, ...data) {
  if (LogRequestResult) {
    const style = 'background-color:#49a9ee;color:white;padding:2px 8px;border-radius: 2px;';
    colorLog(pattern, style, ...data)
  }
}

const logRequestError = (pattern, ...data) => {
  const style = 'background-color:red;color:white;padding:2px 8px;border-radius: 2px;';
  colorLog(pattern, style, ...data)
};

export {
  // configs
  ReduxLoggerEnabled,
  DebugLogEnabled,
  LogRequest,
  LogRequestResult,
  LogRequestContent,
  LogHOC,
  // methods
  log,
  logRequest,
  logRequestResult,
  logRequestError,
  // other configs:
  HighlightHoles,

  fundebug, logFundebug,
};
