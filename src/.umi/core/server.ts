// @ts-nocheck
// umi.server.js
import 'D:/dingwj/node_modules/@umijs/preset-built-in/node_modules/regenerator-runtime/runtime.js';
import { format } from 'url';
import renderServer from 'D:/dingwj/node_modules/@umijs/preset-built-in/lib/plugins/features/ssr/templates/renderServer/renderServer.js';
import { stripBasename, cheerio, handleHTML } from 'D:/dingwj/node_modules/@umijs/preset-built-in/lib/plugins/features/ssr/templates/utils.js';
import { IServerRender } from '@umijs/types';

import { ApplyPluginsType, createMemoryHistory } from 'D:/dingwj/node_modules/@umijs/runtime';
import { plugin } from './plugin';

// origin require module
// https://github.com/webpack/webpack/issues/4175#issuecomment-342931035
const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;

let routes;

/**
 * server render function
 * @param params
 */
const render: IServerRender = async (params) => {
  let error;
  const {
    origin = '',
    path,
    htmlTemplate = '',
    mountElementId = 'root',
    context = {},
    mode = 'string',
    basename = '/',
    staticMarkup = false,
    forceInitial = false,
    getInitialPropsCtx,
  } = params;
  let manifest = params.manifest;
  const env = 'development';

  let html = htmlTemplate || "<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"utf-8\" />\n    <meta\n      name=\"viewport\"\n      content=\"width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no\"\n    />\n    <link rel=\"stylesheet\" href=\"http://localhost:8000/umi.css\" />\n    <script>\n      window.routerBase = \"/\";\n    </script>\n    <script>\n      window.publicPath = \"http://localhost:8000/\";\n    </script>\n    <script src=\"http://localhost:8000/@@/devScripts.js\"></script>\n    <script>\n      //! umi version: 3.2.13\n    </script>\n    <script src=\"https://fileserver.aminer.cn/lib/react-latest/react.development.js\"></script>\n    <script src=\"https://fileserver.aminer.cn/lib/react-latest/react-dom.development.js\"></script>\n    <title>AMiner</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n\n    <script src=\"https://static.aminer.cn/misc/ga.js\"></script>\n    <script src=\"http://localhost:8000/umi.js\"></script>\n  </body>\n</html>\n";
  let rootContainer = '';
  try {
    // handle basename
    const location = stripBasename(basename, `${origin}${path}`);
    const { pathname } = location;
    // server history
    const history = createMemoryHistory({
      initialEntries: [format(location)],
    });

    /**
     * beforeRenderServer hook, for polyfill global.*
     */
    await plugin.applyPlugins({
      key: 'ssr.beforeRenderServer',
      type: ApplyPluginsType.event,
      args: {
        env,
        path,
        context,
        history,
        mode,
        location,
      },
      async: true,
    });

    /**
     * routes init and patch only once
     * beforeRenderServer must before routes init avoding require error
     */
    if (!routes) {
      // 主要为后面支持按需服务端渲染，单独用 routes 会全编译
      routes = [
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
    }

    // for renderServer
    const opts = {
      path,
      history,
      pathname,
      getInitialPropsCtx,
      basename,
      context,
      mode,
      plugin,
      staticMarkup,
      routes,
      isServer: process.env.__IS_SERVER,
    }
    const dynamicImport =  false;
    if (dynamicImport && !manifest) {
      try {
        // prerender not work because the manifest generation behind of the prerender
        manifest = requireFunc(`./`);
      } catch (_) {}
    }

    // renderServer get rootContainer
    const { pageHTML, pageInitialProps, routesMatched } = await renderServer(opts);
    rootContainer = pageHTML;
    if (html) {
      // plugin for modify html template
      html = await plugin.applyPlugins({
        key: 'ssr.modifyServerHTML',
        type: ApplyPluginsType.modify,
        initialValue: html,
        args: {
          context,
          cheerio,
          routesMatched,
          dynamicImport,
          manifest
        },
        async: true,
      });
      html = await handleHTML({ html, rootContainer, pageInitialProps, mountElementId, mode, forceInitial, routesMatched, dynamicImport, manifest });
    }
  } catch (e) {
    // downgrade into csr
    error = e;
  }
  return {
    rootContainer,
    error,
    html,
  }
}

export default render;
