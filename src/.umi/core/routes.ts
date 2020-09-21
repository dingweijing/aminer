// @ts-nocheck
import { ApplyPluginsType } from 'D:/dingwj/node_modules/@umijs/runtime';
import { plugin } from './plugin';

const routes = [
  {
    "path": "/",
    "component": require('D:/dingwj/src/aminer/layouts/root').default,
    "routes": [
      {
        "path": "/",
        "component": require('D:/dingwj/src/aminer/aiopen/index.js').default,
        "exact": true
      },
      {
        "path": "/rank",
        "component": require('D:/dingwj/src/aminer/aiopen/index.js').default,
        "exact": true
      },
      {
        "path": "/list",
        "component": require('D:/dingwj/src/aminer/aiopen/index.js').default,
        "exact": true
      },
      {
        "path": "/industry",
        "component": require('D:/dingwj/src/aminer/aiopen/indexCompany.js').default,
        "exact": true
      },
      {
        "path": "/industrydetail",
        "component": require('D:/dingwj/src/aminer/aiopen/companyDetail.js').default,
        "exact": true
      },
      {
        "path": "/cityRank",
        "component": require('D:/dingwj/src/aminer/aiopen/CityRank.tsx').default,
        "exact": true
      },
      {
        "path": "/authorList",
        "component": require('D:/dingwj/src/aminer/aiopen/containers/authorList.tsx').default,
        "exact": true
      }
    ]
  }
];

// allow user to extend routes
plugin.applyPlugins({
  key: 'patchRoutes',
  type: ApplyPluginsType.event,
  args: { routes },
});

export { routes };
