import React from 'react';
import loadScriptJs from 'load-script';
import consts from 'consts';

const info = require('debug')('aminer:requirejs');
const debug = require('debug')('aminerdebug:requirejs');

const lib = `${consts.ResourcePath}/lib/`;

// Load script
const scripts = {
  BingMap: 'https://www.bing.com/api/maps/mapcontrol?key=AiKx6ZkW6x8XlCrv8u8oCyRwABSJnVrnB2VNKNMjTuh-6tNRpv4G1HlP7l1q0M08',
  BingMap2: 'https://www.bing.com/mapspreview/sdkrelease/mapcontrol?key=AiKx6ZkW6x8XlCrv8u8oCyRwABSJnVrnB2VNKNMjTuh-6tNRpv4G1HlP7l1q0M08',
  GoogleMap: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBlzpf4YyjOBGYOhfUaNvQZENXEWBgDkS0',
  echarts: `${lib}/echarts.js`, // v3
  BMap: `${lib}/BMap/bmap.js`, // for combining Baidu Map with echarts
  BMap2: 'https://api.map.baidu.com/getscript?v=2.0&ak=Aa3EfnyGmb2ICCdL10Gq1Gh4GckN08QX&s=1&services=&t=20171031174121',
  BMapLib: 'https://api.map.baidu.com/api?v=2.0&ak=Aa3EfnyGmb2ICCdL10Gq1Gh4GckN08QX&s=1',
  echarts4BMap: `${lib}/echarts4.0/echarts.min.js`, // not original script,with BMap javascript
  echarts4: `${lib}/mapbox/echarts.min.js`, // original echarts script, v4
  world: `${lib}/echarts-trajectory/world.js`, // world
  world_china: `${lib}/echarts-trajectory/world_china.js`,
  china: `${lib}/echarts-trajectory/china.js`,
  mapboxgldev: `${lib}/mapbox/mapbox-gl.js`, // for load mapbox
  mapboxstyle: `${lib}/mapbox/mapbox-gl.css`, // mapbox style
  EchartsLayer: `${lib}/mapbox/EchartsLayer.js`, // for combining mapbox and echarts
  echarts404: `${lib}/echarts-gl/echarts.min.js`, // echarts 4.04,for echarts4gl
  // echarts4gl: `https://echarts.baidu.com/resource/echarts-gl-latest/dist/echarts-gl.min.js`, // echarts v4 gl,  for 3D
  echarts4gl: `${lib}/echarts-gl/echarts-gl.js`, // echarts v4 gl,  for 3D
  wordcloud: `${lib}/echarts4.0/echarts-wordcloud.js`, // worldcloud
  d3v2: `${lib}/d3.v2.min.js`,
  d3v3: `${lib}/d3.v3.js`,
  d3: `${lib}/d3.v4.js`,
  d3v5: `${lib}/d3.v5.js`,
  d3pie: `${lib}/d3pie.min.js`,
  nv: `${lib}/nv.d3.js`,
  jQuery: `${lib}/jquery.js`,
  html2canvas: `${consts.ResourcePath}/html2canvas_1.0.0_rc.5.js`,
  saveAs: `${lib}/saveAs.js`,
  ExportJsonExcel: `${lib}/JsonExportExcel.min.js`,
  wechat_js_sdk: 'https://res.wx.qq.com/open/js/jweixin-1.4.0.js',
  jszip: 'https://fileserver.aminer.cn/lib/jszip.min.js',
  dplayer: 'https://fileserver.aminer.cn/jscdn/DPlayer.min.js',
  hls: 'https://fileserver.aminer.cn/jscdn/hls.min.js',
};

// deprecated
const Libraries = {
  d3v2: [
    <script key="d3v2" type="text/javascript" src="/lib/d3.v2.min.js" async defer />,
  ],
  d3v3: [
    <script key="d3v3" type="text/javascript" src="/lib/d3.v3.js" async defer />,
  ],
  d3: [
    <script key="d3v3" type="text/javascript" src="/lib/d3.v4.js" async defer />,
  ],
  d3v5: [
    <script key="d3v5" type="text/javascript" src="/lib/d3.v5.js" async defer />,
  ],
  echarts: [
    <script key="echarts" type="text/javascript" src="/lib/echarts.js" async
      defer />,
  ],

  html2canvas: [
    <script key="html2canvas" type="text/javascript" src="/lib/html2canvas.js" async
      defer />,
  ],
  saveAs: [
    <script key="saveAs" type="text/javascript" src="/lib/saveAs.js" async defer />,
  ],
  echarts4: [
    <script key="echarts" type="text/javascript" src="/lib/echarts4.0/echarts.min.js"
      async defer />,
  ],
};

const findLibs = keys => {
  if (keys && keys.length > 0) {
    const libs = {};
    keys.map(key => {
      libs[key] = Libraries[key];
      return false;
    });
    return libs;
  }
};

// // find each key in keys in Libraries, merge into final result.
// // if nothing changed, return the original state.
// const mergeLibs = (resources, keys) => {
//   let changed = false;
//   let res = resources || Map();
//   if (keys && keys.length > 0) {
//     const libs = keys.map((key) => {
//       const newRes = Libraries[key];
//       if (!res.get(key) && newRes) {
//         changed = true;
//         return { key, newRes };
//       }
//       return null;
//     });
//     if (changed && libs && libs.length > 0) {
//       res = res.withMutations((map) => {
//         for (const lib of libs) {
//           if (lib) {
//             map.set(lib.key, lib.newRes);
//           }
//         }
//       });
//       return { changed, res };
//     }
//   }
//   return { changed };
// };

// TODO non-liner interval check.
const ensureConfig = {
  tryTimes: 200,
  interval: 80,
};

const ensure = (libs, success, failed) => {
  // first check
  if (checkWindow(libs)) {
    if (success) {
      success(...getObjects(libs));
    }
    return;
  }

  // set interval check.
  let n = 0;
  const mapInterval = setInterval(() => {
    // console.log('check...', libs, n);
    if (checkWindow(libs)) {
      clearInterval(mapInterval);
      if (success) {
        success(...getObjects(libs));
      }
      return;
    }
    n += 1;
    if (n === 10) {
      info('Warning! Loading script slow. [%o] ', libs);
    }
    console.log('ensure', n);
    if (n >= ensureConfig.tryTimes) {
      clearInterval(mapInterval);
      info('Error! Loading script failed. [%o] ', libs);
      if (failed) {
        failed();
      }
    }
  }, ensureConfig.interval);
};

const checkWindow = libs => {
  let libArray = libs || [];
  if (libs && typeof libs === 'string') {
    libArray = [libs];
  }
  for (const lib of libArray) {
    if (!window[lib]) {
      return false;
    }
  }
  return true;
};

const getObjects = libs => {
  let libArray = libs || [];
  if (libs && typeof libs === 'string') {
    libArray = [libs];
  }
  return libArray.map(lib => window[lib]);
};

// const createLoader = (check) => {
//   return {
//     // wait: () => {
//     //   const tryTimes = 200;
//     //   let n = 0;
//     //   const interval = setInterval(() => {
//     //     const ret = hasValue(check);
//     //     if (!ret) {
//     //       n += 1;
//     //       if (n >= tryTimes) {
//     //         clearInterval(interval);
//     //         console.error('Loading script timeout!',);
//     //         // if (failed) {
//     //         //   failed();
//     //         // }
//     //       }
//     //     } else {
//     //       clearInterval(interval);
//     //
//     //       // if (success) {
//     //       //   success(window.BMap);
//     //       // }
//     //     }
//     //   }, interval);
//     // },
//     then: (callback) => {
//       if (callback) {
//         callback(0); // call when callback;
//       }
//     },
//   };
// };

// usages

// let time1 = new Date();
// const d3 = d3Loader.wait();
// console.log('wait for returned .....', d3);
// onsole.log('>>> TIME: calclate:', new Date() - time1);
//
// d3Loader.then((value) => {
//   console.log('wait for returned .....', value);
// });

const loadScript = (url, opts, cb) => {
  // if cached.
  if (!window.requireJsRegistry) {
    window.requireJsRegistry = {};
  }
  const cachedResult = window.requireJsRegistry[url];
  if (cachedResult) {
    if (process.env.NODE_ENV !== 'production') {
      debug('Cached %s %o', url, cachedResult);
    }
    if (cb) {
      cb(cachedResult);
    }
    return cachedResult;
  }

  // if not cached.
  const { check, ...restOpts } = opts;
  const script = scripts[url] || url;

  if (process.env.NODE_ENV !== 'production') {
    debug('load %s', url);
  }

  loadScriptJs(script, restOpts, () => {
    const ret = hasValue(check);
    if (ret || !check) {
      window.requireJsRegistry[url] = ret;
      if (cb) {
        cb(ret);
      }
    } else {
      info('Error loading script: %o', script);
    }
  });
};

const hasValue = check => {
  if (typeof check === 'string') {
    return window[check];
  }
  if (check && check.length === 1) {
    return window[check[0]];
  }
  if (check && check.length === 2) {
    return window[check[0]] && window[check[0]][check[1]];
  }
  return false;
};

const loadBingMap = cb => {
  loadScript('BingMap', { check: 'Microsoft' }, () => {
    loadScript('BingMap2', { check: 'Microsoft' }, cb);
  });
};

const loadBMap = cb => {
  loadScript('BMap', 'BMap_loadScriptTime', () => {
    loadScript('BMap2', { check: 'BMap' }, () => {
      loadScript('BMapLib', { check: 'BMap' }, cb);
    });
  });
};

const loadGoogleMap = cb => {
  loadScript('GoogleMap', { check: ['google', 'maps'] }, cb);
};
const loadD3v2 = cb => {
  loadScript('d3v2', { check: 'd3' }, cb);
};

const loadD3v3 = cb => {
  loadScript('d3v3', { check: 'd3' }, cb);
};

const loadD3 = cb => {
  loadScript('d3', { check: 'd3' }, cb);
};

const loadD3v5 = cb => {
  loadScript('d3v5', { check: 'd3' }, cb);
};
const loadD3Pie = cb => {
  loadScript('d3pie', { check: 'd3pie' }, cb);
};

const loadNvd3 = cb => {
  loadScript('nv', { check: 'nv' }, cb);
};

const loadECharts = cb => {
  loadScript('echarts', { check: 'echarts' }, cb);
};

const loadJquery = cb => {
  loadScript('jQuery', { check: 'jQuery' }, cb);
};

const loadHtml2canvas = cb => {
  loadScript('html2canvas', { check: 'html2canvas' }, cb);
};

const loadSaveAs = cb => {
  loadScript('saveAs', { check: 'saveAs' }, cb);
};

const loadECharts4 = cb => {
  loadScript('echarts4', { check: 'echarts' }, cb);
};

const loadEcharts4WithMapbox = cb => {
  loadScript('echarts4', { check: 'echarts' }, () => {
    loadScript('mapboxgldev', { check: 'echarts' }, () => {
      loadScript('EchartsLayer', { check: 'echarts' }, cb);
    });
  });
};

const loadEcharts4WithBMap = cb => {
  loadScript('BMap', { check: 'BMap_loadScriptTime' }, () => {
    loadScript('BMap2', { check: 'BMap' }, () => {
      loadScript('echarts4BMap', { check: 'echarts' }, cb);// this script is edited by Shaozhou
    });
  });
};

const loadEcharts4WithGeo = cb => {
  loadScript('echarts4', { check: 'echarts' }, () => {
    loadScript('world', { check: 'echarts' }, cb);
  });
};

const loadEcharts4WithGeoWC = cb => {
  loadScript('echarts4', { check: 'echarts' }, () => {
    loadScript('world_china', { check: 'echarts' }, cb);
  });
};

const loadEcharts4WithGeoChina = cb => {
  loadScript('echarts4', { check: 'echarts' }, () => {
    loadScript('china', { check: 'echarts' }, cb);
  });
};

const loadEcharts4WithGeoWorldAndChina = cb => {
  loadScript('echarts4', { check: 'echarts' }, () => {
    loadScript('world', { check: 'echarts' }, () => {
      loadScript('china', { check: 'echarts' }, cb);
    });
  });
};

const loadEchartsWithWordcloud = cb => {
  loadScript('echarts4', { check: 'echarts' }, () => {
    loadScript('wordcloud', { check: 'echarts' }, cb);
  });
};

const loadECharts4GL = cb => {
  loadScript('echarts404', { check: 'echarts' }, () => {
    loadScript('echarts4gl', { check: 'echarts' }, cb);
  });
};

const load3DEarth = cb => {
  loadScript('echarts404', { check: 'echarts' }, () => {
    loadScript('echarts4gl', { check: 'echarts' }, () => {
      loadScript('world', { check: 'echarts' }, cb);
    });
  });
};

const loadExportExcel = cb => {
  loadScript('ExportJsonExcel', { check: 'ExportJsonExcel' }, cb);
};

const loadXiaoMai = () => {
  loadScript('https://originalstatic.aminer.cn/misc/dist/xiaomai_robot.js', { check: '' });
};

const loadWechatJSSDK = cb => {
  loadScript('wechat_js_sdk', { check: 'wx' }, cb);
};

const loadJsZip = (cb) => {
  loadScript('jszip', { check: 'JSZip' }, cb);
};

const loadDplayer = (cb) => {
  loadScript('hls', { check: 'Hls' }, () => {
    loadScript('dplayer', { check: 'DPlayer' }, cb);
  });

};

export {
  loadScript,
  loadD3v2,
  loadD3v3,
  loadD3,
  loadD3v5,
  loadD3Pie,
  loadNvd3,
  loadECharts,
  loadBingMap,
  loadBMap,
  loadGoogleMap,
  loadJquery,
  loadHtml2canvas,
  loadSaveAs,
  loadECharts4,
  loadExportExcel,

  // second requirejs
  // mergeLibs,
  ensure,
  loadEcharts4WithMapbox,
  loadEcharts4WithBMap,
  loadEcharts4WithGeo,
  loadEcharts4WithGeoWC,
  loadEcharts4WithGeoChina,
  loadEcharts4WithGeoWorldAndChina,
  loadEchartsWithWordcloud,
  loadECharts4GL,
  load3DEarth,
  loadXiaoMai,
  loadWechatJSSDK,
  loadJsZip,
  loadDplayer
};
