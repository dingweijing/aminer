/* eslint-disable camelcase */
import React from 'react';
import { Priority, extractPlugins } from 'acore/plugins';

// const debug = require('debug')('ACore:plugins');
// const debugPluginsTime = require('debug')('ACore:plugins:profiling');

/**
 * Created by BoGao on 2017/8/3.
 */
const default_placeholder = '__DEFAULT_PLACEHOLDER__';

// TODO with parameters.
function fill(holeList, defaultHoleList, config) {
  if (!holeList) {
    return defaultHoleList;
  }
  if (!defaultHoleList) {
    return holeList;
  }
  const holes = holeList;
  if (holes && holes && holes.length > 0) {
    const newHoles = [];
    holes.map((elm) => {
      if (elm === default_placeholder && defaultHoleList && defaultHoleList.length > 0) {
        newHoles.push(...defaultHoleList);
      } else {
        newHoles.push(elm);
      }
      return null;
    });
    if (config && (config.withContainer || config.containerClass)) {
      return (
        <div className={config.containerClass}>
          {newHoles}
        </div>
      );
    }
    return newHoles;
  }
  return null;
}

function fillFuncs(holeList, defaultHoleList, plugins, payload, config) {
  // 先获取优先级高的 plugins
  // debugPluginsTime('extractPlugins: %o', plugins)
  const { holeFuncs, priority } = extractPlugins(plugins);
  // debugPluginsTime('extractPlugins done: %o', holeFuncs)

  let holes = holeList;
  if (!holes) {
    holes = defaultHoleList;
  }

  // 如果有plugin并且是中高级权限，覆盖已有的holes.
  if (holeFuncs) {
    if (priority === Priority.HIGH || priority === Priority.MEDIUM) {
      holes = holeFuncs;
    } else if (holeFuncs && priority === Priority.LOW) {
      holes = holes ? [...holes, ...holeFuncs] : holeFuncs;
    }
  }

  // replace default_placeholder and call funcs.
  if (holes && holes.length > 0) {
    const newHoles = [];
    for (const elm of holes) {
      // holes.map((elm) => {
      if (elm === default_placeholder) {
        // apply defaults
        if (defaultHoleList && defaultHoleList.length > 0) {
          for (const defaultHole of defaultHoleList) {
            newHoles.push(defaultHole(payload));
          }
        }
      } else {
        newHoles.push(elm(payload));
      }
    }

    // 从Hole的设计上，没法做到当内容为空的时候连外边框都不显示。如果有边框的话。
    // 但是可以做到隐藏其宽度。

    // 没内容总是不输出。
    if (!newHoles || newHoles.length === 0) {
      return null;
    }

    // 是否要一个wrapper.
    const withContainer = config && (config.withContainer || config.containerClass);
    return withContainer
      ? <div className={config.containerClass}>{newHoles}</div>
      : newHoles;
  }
  return null;
}


const defaults = {
  // placeholders
  IN_COMPONENT_DEFAULT: undefined,
  EMPTY_BLOCK_FUNC: () => null,
  EMPTY_BLOCK: '',
  EMPTY_ZONE_FUNC: [],
  DEFAULT_PLACEHOLDER: default_placeholder,
};

export default defaults;

export { defaults, fill, fillFuncs };
