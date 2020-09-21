/**
 * This is aminer front-end plugin system.
 *
 * @bogao <bogao@tsinghua.edu.cn> at 2018-04-01.
 */

const debug = require('debug')('ACore:plugins');
const debugTime = require('debug')('ACore:plugins:profiling');

/**
 * Priority:
 *
 * - HIGH:   They will override all holes defined in component.
 *           Only 1 high priority plugin can exist in one hole.
 *           > HIGH 优先级的plugin会覆盖掉所有其他级别的plugin.
 * - MEDIUM: Plugin will override all common holes,
 *           but can coexist with other plugins.
 * - LOW:    Low plugin coexist with all plugins.
 *
 */
const Priority = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

/**
 * Where plugin can be set.
 * 可以插入plugin的地点。 // TODO refactor 使用register来动态注册可插入地点。现在全部写在这里。
 *
 * e.g.: eb/index
 */
const Plugable = {
  EB_SearchResult_PersonList: 'EB_SearchResult_PersonList', // 智库专家列表
  Search_SearchResult_PersonList: 'Search_SearchResult_PersonList', // 通用搜索结果专家列表
};

const ALL_PLACES = "__all_places__";


const HoleNames = {};

/**
 * Where Hooks can be set.
 * 可以插入Hooks的地点。
 */
const Hookable = {
  PersonList_DataReady: 'PersonList_DataReady',
};

// -----------------------------------------------------------
// Others Methods.
// -----------------------------------------------------------

const getHoles = (plugins, holeName) => {
  return getMergedElement(plugins, 'holes', holeName);
  // if (!plugins || plugins.length === 0) {
  //   return null;
  // }
  // const holes = [];
  // for (const plugin of plugins) {
  //   if (plugin && plugin.holes && plugin.holes[holeName]) {
  //     holes.push(...plugin.holes[holeName]);
  //   }
  // }
  // return holes;
};

const getHooks = (plugins, holeName) => {
  return getMergedElement(plugins, 'hooks', holeName);
};

const getMergedElement = (plugins, elmName, holeName) => {
  if (!plugins || plugins.length === 0) {
    return null;
  }
  const holes = [];
  for (const plugin of plugins) {
    if (plugin && plugin[elmName] && plugin[elmName][holeName]) {
      holes.push(...plugin[elmName][holeName]);
    }
  }
  return holes;
};

// TODO support call order.
const callAllHooks = (hooks, params, funcs) => {
  if (hooks && hooks.length > 0) {
    for (const hook of hooks) {
      if (hook) {
        hook(params, funcs);
      }
    }
  }
};

// used in hole.js
function extractPlugins(plugins) {
  if (!plugins || plugins.length === 0) {
    return {};
  }
  let currentPriority = Priority.LOW;
  let selectedPlugins = [];
  for (const plugin of plugins) {
    if (plugin) {
      if (plugin.priority === Priority.HIGH) {
        // HIGH only allow one plugin.
        if (selectedPlugins.length > 0) {
          const { name } = selectedPlugins[0];
          console.log(
            'Warning! more than one HIGH Priority plugin detected. ',
            plugin.name, 'and', name,
          );
        }
        selectedPlugins = [plugin];
        currentPriority = Priority.HIGH;
      } else if (plugin.priority === Priority.MEDIUM) {
        // ignore when current is HIGH
        if (currentPriority === Priority.MEDIUM) {
          selectedPlugins.push(plugin);
        } else if (currentPriority === Priority.LOW) {
          selectedPlugins = [plugin]; // drop exists.
          currentPriority = Priority.MEDIUM;
        }
      } else if (plugin.priority === Priority.LOW) {
        if (currentPriority === Priority.LOW) {
          selectedPlugins.push(plugin);
        }
      }
    }
  }
  const holeFuncs = selectedPlugins.map(plugin => plugin.func);
  return { holeFuncs, priority: currentPriority };
}

// ------------------- old things -----------------------
/**
 *  System level plugins, stores all system level plugins.
 *  This value is set by themes config file.
 */
let plugins; // set by themes.

// plugin router map; router key => module funcs array.
const pluginsModelMap = new Map();

// called on init.
const initPlugins = (systemPlugins) => {
  debug(`initPlugins: systemPlugins is `, systemPlugins)

  plugins = systemPlugins;
  // console.log('==== initPlugins', systemPlugins);

  // init pluginModelMap.
  if (plugins && plugins.length > 0) {
    const allPlugins = [];
    plugins.forEach((plugin) => {
      allPlugins.push(...plugin);
    });
    plugins = allPlugins;

    plugins.forEach((plugin) => {
      const routerKeys = typeof plugin.router === 'string'
        ? [plugin.router]
        : plugin.router;

      for (const routerKey of routerKeys) {
        const modules = pluginsModelMap.get(routerKey);
        if (!modules) {
          pluginsModelMap.set(routerKey, [...plugin.modules]);
        } else {
          modules.push(...plugin.modules);
        }
      }
    });
  }
};

//
// Functions
//

/***************************************************
 * Plugin-system bootstrap.
 **************************************************/
// do some cache things.


const applyPluginModules = (namespace, routerConfig) => {
  const newRouterConfig = {};
  Object.keys(routerConfig).forEach((key) => {
    const value = routerConfig[key]; // value is router.
    const pluginModelFuncs = pluginsModelMap.get(`${namespace}.${key}`);
    if (pluginModelFuncs && pluginModelFuncs.length > 0) {
      const funcs = [value.models, ...pluginModelFuncs];
      value.models = () => {
        const pluginModels = [];
        for (const pluginFunc of funcs) {
          pluginModels.push(...pluginFunc());
        }
        return pluginModels;
      };
    }
    newRouterConfig[key] = value;
  });
  return newRouterConfig;
};

// eslint-disable-next-line camelcase
const applyPluginToAPI = (nextapi, api_plugin_key) => {
  if (plugins && plugins.length > 0) {
    plugins.forEach((plugin) => {
      if (plugin && plugin[api_plugin_key]) {
        const apiPlugin = plugin[api_plugin_key];
        if (apiPlugin.parameters) {
          nextapi.addParam(apiPlugin.parameters);
        }
        if (apiPlugin.schema) {
          nextapi.addSchema(apiPlugin.schema);
        }
      }
    });
    // TODO ... merge filters, sorts, havings, etc...
  }
};


export {
  // constants
  Priority, Plugable, Hookable,

  ALL_PLACES,

  // merge methods.
  getHoles, getHooks,

  extractPlugins, callAllHooks,


  // old things

  plugins,
  initPlugins,
  applyPluginToAPI,
  applyPluginModules,
};
