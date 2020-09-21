/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring, react/destructuring-assignment */

import { history } from 'acore';
import { qs } from 'utils';

const isNotEmpty = v => {
  if (typeof v === 'boolean') {
    return true;
  }
  switch (v) {
    case '':
    case 0:
    case 'true':
      return true;
    default:
      return !!v;
  }
};

// 将参数同步到State中。只返回变化的值。如果置空，则返回xxx=null;
// !!! 只返回变化的值
const syncUrlParamToState = (props, state, paramConfigs) => {
  const changes = {};
  let changed = false;
  const locationQuery = props.location.query;
  for (const config of paramConfigs) {
    let key;
    let converFunc;
    if (config && typeof config === 'string') { // is string
      key = config;
    } else { // is array
      key = Object.keys(config)[0];
      converFunc = config[key];
    }

    let value = locationQuery[key];
    value = converFunc ? converFunc(value, state[key]) : value;
    // state[key] || value  || =?    || process
    //   null     ||  null     ===      return nothing
    //   1234     ||  1234     ===      return nothing
    //   null     ||  1234     !==      return 1234
    //   1234     ||  null     !==      return null
    if ((state[key] !== value) && isNotEmpty(value)) {
      changes[key] = value;
      changed = true;
    }
  }
  if (changed) {
    return changes;
  }
  return null;
};

const parseUrlParam = (props, defaultValues, paramConfigs) => {
  const changes = {};
  const locationQuery = props && props.location && props.location.query || {};
  for (const config of paramConfigs) {
    let key;
    let converFunc;
    if (config && typeof config === 'string') { // is string
      key = config;
    } else { // is array
      key = Object.keys(config)[0];
      converFunc = config[key];
    }

    let value = locationQuery[key];
    if (value === undefined) {
      changes[key] = config.default;
    } else {
      value = converFunc ? converFunc(value, defaultValues[key]) : value;
      changes[key] = value;
    }
  }
  return changes;
};

const getUrlParam = (search, name) => {
  if (!search) {
    return null
  }
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const r = search && search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

const parseUrlParamWithSearch = (props, defaultValues, paramConfigs) => {
  const changes = {};
  const search = props.location.search || '';
  // const pattern = /(\w+)=(\w+)/ig;
  // search.replace(pattern, (a, b, c) => {
  //   changes[b] = c;
  // });
  // return parames;//返回这个数组.
  for (const config of paramConfigs) {
    changes[config] = getUrlParam(search, config);
  }
  return changes;
};


// 将参数同步到State中。只返回变化的值。如果置空，则返回xxx=null;
// Note: !!! 没有上面那么啰嗦，所有url参数都是必须有值的。
const syncMatchesToStateFull = (props, state, paramConfigs) => {
  if (!paramConfigs || paramConfigs.length === 0) {
    throw new Error('syncMatchesToState.paramConfigs must not empty!');
  }
  const changes = {};
  const values = {};
  let changed = false;
  const matchParams = props.match.params;
  for (const config of paramConfigs) {
    let key;
    let converFunc;
    if (config && typeof config === 'string') { // is string
      key = config;
    } else { // is array
      key = Object.keys(config)[0];
      converFunc = config[key];
    }

    let value = matchParams[key];
    value = converFunc ? converFunc(value) : value;

    // state[key] || value  || =?    || process
    //   null     ||  null     ===      return nothing
    //   1234     ||  1234     ===      return nothing
    //   null     ||  1234     !==      return 1234
    //   1234     ||  null     !==      return null
    if ((state[key] !== value) && isNotEmpty(value)) {
      changes[key] = value;
      changed = true;
    }
    values[key] = value;
  }
  return { changes: changed ? changes : null, values };
};

const parseMatchesParam = (props, state, paramConfigs) => {
  if (!paramConfigs || paramConfigs.length === 0) {
    throw new Error('parseMatchesParam.paramConfigs must be not empty!');
  }
  const changes = {};
  const matchParams = props.match.params;
  for (const config of paramConfigs) {
    let key;
    let converFunc;
    if (config && typeof config === 'string') { // is string
      key = config;
    } else { // is array
      key = Object.keys(config)[0];
      converFunc = config[key];
    }

    let value = matchParams[key];
    value = converFunc ? converFunc(value) : value;
    changes[key] = value;
  }
  return changes;
};

// TODO wrapper
const syncMatchesToState = (props, state, paramConfigs) => syncMatchesToStateFull(props, state, paramConfigs).changes;

const mergeChanges = (...changes) => {
  const finalChanges = {};
  if (changes && changes.length > 0) {
    for (const change of changes) {
      Object.assign(finalChanges, change || {});
    }
  }
  return Object.keys(finalChanges).length > 0 ? finalChanges : null;
};


// syncUrlParamToState 中使用的，转换函数，string => type 的转换。
const paramType = {
  string: value => value,
  bool: (value, defaultValue) => {
    switch (value) {
      case '1':
      case 'true':
        return true;
      case '0':
      case 'false':
        return false;
      default:
        return defaultValue || false; // Boolean(value);
    }
  },
  int: value => {
    if (!value) {
      return 0;
    }
    try {
      return parseInt(value, 10);
    } catch (error) {
      return 0;
    }
  },
  date: value => value, // moment(value).format(consts.DATE_FORMAT),
  datetime: value => {
    switch (value) {
      case '1':
      case 'true':
        return true;
      case '0':
      case 'false':
        return false;
      default:
        return false; // Boolean(value);
    }
  },

};

const makePathnameFromMatch = (match, changes, config) => {
  let url = match.path;

  // apply config.transferPath
  if (config && config.transferPath && config.transferPath.length > 0) {
    for (const tp of config.transferPath) {
      const { from, to } = tp;
      if (to && (!from || from === url)) {
        url = to;
      }
    }
  }

  const finalParams = { ...match.params, ...changes };
  Object.keys(finalParams).forEach(param => {
    const value = finalParams[param];
    url = url.replace(`:${param}`, value);
  });
  return url;
};

// replace changes to url parameters.
// @author: elivoa 2018
// @params:
//    props        - this.props in react component.
//    changes      - url param changes. this will override url param. new param will add to url;
//    matchChanges - path param. key/values here will be override to props.location.path. new value will be dropped.
//    config       - configs that will change default action.
//        .transferPath - value { from, to }; from is optional, to is required.
//                        if location.path matches from, things in matchChagnes will be applyed to `to`.
//                        e.g.: { transferPath: { from: '/search', to: '/search/:query/:page/:size' } }
//
const routeTo = (props, changes, matchChanges, config) => {
  const { dispatch, location, match } = props;
  let { search, pathname } = location;

  const hasRemoveParamsConfig = config && config.removeParams && config.removeParams.length > 0;
  if (changes || hasRemoveParamsConfig) {
    // apply config.removeParams
    const queryParams = { ...(location.query), ...changes };
    if (hasRemoveParamsConfig) {
      for (const key of config.removeParams) {
        delete queryParams[key];
      }
    }
    search = `?${qs.stringify(queryParams)}`;
  }
  if (matchChanges) {
    // apply config.transferPath
    pathname = makePathnameFromMatch(match, matchChanges, config);
  }

  // 这里只是返回新的URL。不做跳转。
  if (config && config.returnUrl) {
    return { pathname, search };
  }

  // 跳转
  const method = config && config.replace ? 'replace' : 'push';
  history[method]({ pathname, search });
};

const routeToReplace = (props, changes, matchChanges, config) => {
  const newConfig = config || {};
  newConfig.replace = true;
  routeTo(props, changes, matchChanges, newConfig);
}

const getRouteToUrl = (props, changes, matchChanges, config) => {
  const newConfig = config || {};
  newConfig.returnUrl = true;
  return routeTo(props, changes, matchChanges, newConfig);
}

const isBuildInToken = () => {
  let search;
  if (global) {
    search = (global.window && global.window.g_history && global.window.g_history.location &&
      global.window.g_history.location.search) || '';
  } else if (window) {
    search = (window.g_history && window.g_history.location && window.g_history.location.search) ||
      (window.location && window.location.search) || '';
  }
  const query = qs.parse(search, { ignoreQueryPrefix: true });
  return query && query.token ? query.token === 'bianyigetoken' : false
}

export {
  syncUrlParamToState,
  syncMatchesToState, syncMatchesToStateFull,
  parseUrlParam, parseMatchesParam, parseUrlParamWithSearch,

  mergeChanges,
  paramType,

  routeTo, routeToReplace, getRouteToUrl,

  isBuildInToken
};
