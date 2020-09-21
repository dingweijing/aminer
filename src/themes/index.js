/* eslint-disable prefer-template,import/no-dynamic-require */
/**
 * Created by BoGao on 2017/10/10.
 * Refactered by BoGao on 20180-8-27,
 *
 * Theme 是定义了system的一些坑的填充内容。以及基础样式的一些设置。
 * Note: Plugins 包括了system需要加载的插件。插件中用到的组件必须是小组件。禁止再次引入Themes。全部使用参数传递theme的配置。
 *
 */
// import React from 'react';
import { theme } from '../../.startup/theme';

// init something.
// plugins.initPlugins(theme.plugins);

const ALL_PLACES = '__all_places__';

// plugins returns a list of plugin config.
const plugins = plugable => {
  if (!theme || !theme.plugins || theme.plugins.length === 0) {
    return null;
  }
  // get ALL plugable Cached.
  if (ALL_PLACES === plugable) {
    let { all_merged_plugins } = theme;
    if (!all_merged_plugins) {
      all_merged_plugins = [];
      const keyset = {};
      Object.keys(theme.plugins).forEach(key => {
        const values = theme.plugins[key]
        if (values && values.length > 0) {
          // eslint-disable-next-line no-restricted-syntax
          for (const plugin of values) {
            if (plugin && !keyset[plugin.name]) { // if not duplicated
              all_merged_plugins.push(plugin);
            }
            keyset[plugin && plugin.name || '-'] = true;
          }
        }
      })
      theme.all_merged_plugins = all_merged_plugins;
    }
    // console.log(">>>>> plugin is : ", all_merged_plugins)
    return all_merged_plugins;
  }

  const matchedPlugins = theme.plugins[plugable]; // plugin config list
  if (!matchedPlugins || matchedPlugins.length === 0) {
    return null;
  }
  return matchedPlugins;
};

export {
  theme,
  plugins,
};
