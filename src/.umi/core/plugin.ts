// @ts-nocheck
import { Plugin } from 'D:/dingwj/node_modules/@umijs/runtime';

const plugin = new Plugin({
  validKeys: ['modifyClientRenderOpts','patchRoutes','rootContainer','render','onRouteChange','ssr','dva','getInitialState','locale','locale','request',],
});
plugin.register({
  apply: require('D:/dingwj/src/app.tsx'),
  path: 'D:/dingwj/src/app.tsx',
});
plugin.register({
  apply: require('D:/dingwj/src/.umi/plugin-dva/runtime.tsx'),
  path: 'D:/dingwj/src/.umi/plugin-dva/runtime.tsx',
});
plugin.register({
  apply: require('../plugin-initial-state/runtime'),
  path: '../plugin-initial-state/runtime',
});
plugin.register({
  apply: require('D:/dingwj/src/.umi/plugin-locale/runtime.tsx'),
  path: 'D:/dingwj/src/.umi/plugin-locale/runtime.tsx',
});
plugin.register({
  apply: require('../plugin-model/runtime'),
  path: '../plugin-model/runtime',
});
plugin.register({
  apply: require('D:/dingwj/src/.umi/plugin-helmet/runtime.ts'),
  path: 'D:/dingwj/src/.umi/plugin-helmet/runtime.ts',
});

export { plugin };
