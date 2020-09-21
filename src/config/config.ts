// * https://umijs.org/config/
import { defineConfig, utils } from 'umi';
import AntdDayjsWebpackPlugin from 'antd-dayjs-webpack-plugin';
import buildrc from '../../config/.buildrc';
import { googlegaID } from '../../.startup/ga';
import themes from './theme.config';
import {
  ThemeName,
  Routes,
  SSR as ssr_in_startup,
  // EnableLocale as enablelocale
} from '../../.startup/startup';

// TODO favicon.ico

const { winPath } = utils;

const publicPath = getPublicPath();
const SSR = getSSR();
const { externalsReacts, reactScripts } = getExcludeReact();

printConfigs(); // if debug: print configs.

const scripts = [
  'https://static.aminer.cn/misc/ga.js',

  ...(process.env.NODE_ENV === 'production'
    ? [
      { src: 'https://hm.baidu.com/hm.js?dc703135c31ddfba7bcda2d15caab04e' }, // ?
      { src: 'https://hm.baidu.com/hm.js?789fd650fa0be6a2a064d019d890b87f' }, // ?
    ]
    : []),

  process.env.NODE_ENV === 'production'
    ? `var _dgt = _dgt || [];
  window._dgt = _dgt;
  (function () {
    _dgt.push(['setSiteId', '1aab55000a31a3ca']);
    var d = document, g = d.createElement('script'),
    s = d.getElementsByTagName('script')[0];
    g.type = 'text/javascript'; g.async = true;
    g.defer = true;
    g.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 't.shujike.com/dgt.js';
    s.parentNode.insertBefore(g, s);
  })();`
    : '',

  process.env.NODE_ENV === 'production'
    ? `var _vds = _vds || [];
    window._vds = _vds;
    (function(){
      _vds.push(['setAccountId', 'ae8dfb99e5e4cda1']);
      (function() {
        var vds = document.createElement('script');
        vds.type='text/javascript';
        vds.async = true;
        vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'assets.giocdn.com/vds.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(vds, s);
      })();
    })();`
    : '',
];

// * ----------------
// * Configs
// * ----------------
export default defineConfig({
  outputPath: '../app/public',

  ssr: SSR
    ? {
      devServerRender: false,
      // mode: 'stream',
    }
    : false,


  // esbuild: {}, // 实验，有问题关掉；

  // 暂时先关闭，还是有问题，会闪烁一下
  // dynamicImport: {},
  // // chunks: ['vendors', 'umi'],
  // chainWebpack(config, { webpack }) {
  //   config.merge({
  //     optimization: {
  //       minimize: true,
  //       splitChunks: {
  //         chunks: 'all',
  //         minSize: 30000,
  //         minChunks: 3,
  //         automaticNameDelimiter: '.',
  //         cacheGroups: {
  //           vendor: {
  //             name: 'vendors',
  //             test({ resource }) {
  //               return /[\\/]node_modules[\\/]/.test(resource);
  //             },
  //             priority: 10,
  //           },
  //         },
  //       },
  //     }
  //   });
  // },

  // for dev server
  publicPath,
  runtimePublicPath: true,
  // node_modules里面的包不编译，会提高打包速度，// TODO 后面配置成prod模式下开启
  nodeModulesTransform: { type: 'none' },
  // 开发模式下不生成sourcemap
  devtool: false, // 'eval',

  // manifest: {
  //   fileName: 'manifest.json'
  // },

  // manifest: {
  //   fileName: '../../config/manifest.json',
  //   // publicPath: '', // 为 ''，不然会有两个 /
  // },

  externals: {
    ...externalsReacts,
  },

  // 注意这个是往头部插入脚本
  headScripts: [
    ...reactScripts,

    // TODO 减少这种第三方应用的文件数量。统一使用一个。 already use file instead.
    // { src: 'https://fileserver.aminer.cn/sys/aminer/checksso.js' }

    // * Note: 这是移动端的控制台代码，暂时先放着，后面如果需要调试移动端，可以放开，
    // { src: "https://cdn.bootcss.com/eruda/1.5.2/eruda.min.js" },
    // 'eruda.init()'
  ],

  scripts,

  alias: buildrc.alias,
  targets: { ie: 11 },
  analytics: {
    ga: googlegaID,
    // baidu: '5a66cxxxxxxxxxx9e13',    TODO: 暂时先不添加百度统计id，后面在把统计加回来，（工程院统计）
  },

  hash: true,

  theme: themes(ThemeName),

  locale: {
    default: 'zh-CN', // TODO:  这里得改一下，默认是系统的默认语言，从sysconfig里面读取
    baseNavigator: true,
    antd: false,
    title: false,
    baseSeparator: '-',
  },

  dva: {
    hmr: true,
    immer: true,
    skipModelValidate: true,
  },

  ignoreMomentLocale: true,

  title: 'AMiner', // TODO: 这里改成从sysconfig读取

  // FIXME: 这里可能是没什么用，后面看看。这是antd pro的配置，如果不用，就注释掉
  cssLoader: {
    modules: {
      getLocalIdent: (
        context: {
          resourcePath: string;
        },
        _: string,
        localName: string,
      ) => {
        if (
          context.resourcePath.includes('node_modules') ||
          context.resourcePath.includes('ant.design.pro.less') ||
          context.resourcePath.includes('global.less')
        ) {
          return localName;
        }
        const match = context.resourcePath.match(/src(.*)/);
        if (match && match[1]) {
          const antdProPath = match[1].replace('.less', '');
          const arr = winPath(antdProPath)
            .split('/')
            .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
            .map((a: string) => a.toLowerCase());
          return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
        }
        return localName;
      },
    },
  },

  lessLoader: { javascriptEnabled: true },

  define: {
    // 部署AMiner的时候使用。已经到处使用了这个环境变量，因此define中必须定义这个； TODO: 后续评估是否还需要这个，准备统一环境变量
    'process.env.publicPath': process.env.publicPath ? `${process.env.publicPath}` : '/',
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  chainWebpack(memo, { env, webpack, createCSSRule }) {
    //  使用day.js替换moment.js // TODO remove 所有的 moment.js
    // TODO: 可能存在问题，后续需要确定下day.js的local-zh文件是否加载进来了
    memo.plugin('AntdDayjsWebpackPlugin').use(AntdDayjsWebpackPlugin);
  },

  terserOptions: { compress: { drop_console: process.env.NODE_ENV === 'production' } },

  routes: Routes,
});

// -----  functions  -----------------------------------------------

function getPublicPath() {
  return process.env.publicPath || 'http://localhost:8000/'; // ? online?
}

function getSSR() {
  // ssr config: ENV > SYSCFG
  const { SSRDEV }: any = process.env;
  return SSRDEV === true || SSRDEV === 'true' ? true : ssr_in_startup;
}

/* eslint-disable no-console */
function printConfigs() {
  console.log('++++  DEGUB: Print Key Configs  +++++++++++++++++++++++++++++++++++++++++++');
  console.log('+ publicPath = ', publicPath);
  console.log('+ SSR :: ', SSR);
  console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
}

// exclude react.
function getExcludeReact() {
  const excludeReact = true;
  if (!excludeReact) {
    return { excludeReact, externalsReacts: {}, reactScripts: [] };
  }

  const folder = 'react-latest'; // "react"

  const reactMode = process.env.NODE_ENV === 'production' ? 'production.min' : 'development';
  return {
    excludeReact: true,
    externalsReacts: {
      react: 'window.React',
      'react-dom': 'window.ReactDOM',
    },
    reactScripts: [
      { src: `https://fileserver.aminer.cn/lib/${folder}/react.${reactMode}.js` },
      { src: `https://fileserver.aminer.cn/lib/${folder}/react-dom.${reactMode}.js` },

      // { src: `${publicPath}lib/react/react.${reactMode}.js` },
      // { src: `${publicPath}lib/react/react-dom.${reactMode}.js` },
    ],
  };
}
