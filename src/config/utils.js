/* eslint-disable no-restricted-syntax */
/* eslint-disable global-require, import/no-dynamic-require */

const fs = require('fs');

const debugRouter = require('debug')('ACore:Router');

const PanicWhenDupRoutes = false;
const StrictMode = false;
const PrintInfo = true;

function filterRoutes(system, routeConfig) {
  const start = Date.now(); // * Timer

  if (!routeConfig) {
    throw new Error(`ACore Error: Router config not found: "../systems/${system}/routes.js"`);
  }

  const finalRoutes = [];
  const pathSet = {};
  Object.keys(routeConfig).map(moduleName => {
    const routeConfigs = routeConfig[moduleName];

    // * some special case for homepage.
    if (moduleName === '/') {
      pathSet['/'] = '';
      finalRoutes.push(routeConfigs);
      debugRouter('Add Router \'/\' -> <ignore>');
      return false;
    }

    // * normal situation
    let moduleRoutes = null;
    try {
      moduleRoutes = require(`../../modules/${moduleName}/router.js`);
      // if (!moduleRoutes) {
      //   throw new Error(`ACore Error: Module config not found: "src/modules/${moduleName}-router.js"`)
      // }
    } catch (err) {
      throw new Error(`Can't find module ${moduleName}. Detail Error is:\n ${err}`);
      // debugRouter(`Can't find module ${moduleName}. ${err}`)
    }
    if (!moduleRoutes) {
      throw new Error(`ACore Error: Module config not found: "modules/${moduleName}/router.js"`);
      // return false; // exit when module not found.
    }

    // loop all system router configs.

    for (const rc of routeConfigs) {
      let matched = false;
      const routerdesc = `${moduleName} -> ${rc}`;

      for (const r of moduleRoutes) {
        // TODO use regex to match path.
        // TODO match nested path.
        if (r && r.path && (r.path === rc || rc === '*')) {
          matched = true;

          // judge duplication.
          if (pathSet[r.path]) { // if duplidated
            if (rc !== '*') { // print message when not *.
              if (PanicWhenDupRoutes) {
                throw new Error(`ACore Error: Duplicated routes: "${routerdesc}" with "${pathSet[rc]}"`);
              } else {
                console.log(`Warn: Duplicated routes: "${routerdesc}" with "${pathSet[rc]}", use first one.`);
              }
            }
          } else {
            // update cache and push router.
            pathSet[r.path] = routerdesc;
            if (PrintInfo) {
              debugRouter(`... Route ${moduleName}\t-> ${r.path}`);
            }
            finalRoutes.push(r);
          }
        }
      }

      if (!matched) {
        console.log(`Warn: Route "${moduleName} -> ${rc}" matche no routes.`);
        if (StrictMode) {
          throw new Error(`ACore Error: Route "${moduleName} -> ${rc}" matche no routes.`);
        }
      }

      // if (PrintInfo) {
      //   debugRouter(`Add Route ${moduleName}\t-> ${rc}`)
      // }
    }
    return null;
  });
  debugRouter(`Create Router finished in ${Date.now() - start}ms`);
  return finalRoutes;
}

module.exports = {
  filterRoutes,
};
/* eslint-enable no-restricted-syntax */
