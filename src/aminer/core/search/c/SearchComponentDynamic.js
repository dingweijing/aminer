// Author: Elivoa, 2018-10-12

import React from 'react';
import { dynamic } from 'acore';

// export default dynamic({
//   modules: () => ({
//     SearchComponent: import('./SearchComponentTemp.tsx' /* webpackChunkName:"SearchComponent" */)
//   }),
//   render(props, loaded) {
//     return <loaded.SearchComponent {...props} />
//   },
//   loading: () => (null),
// })

export default dynamic({
  loader: async function () {
    // 这里的注释 webpackChunkName 可以指导 webpack 将该组件 HugeA 以这个名字单独拆出去
    const { default: SearchComponent } = await import('./SearchComponentTemp.tsx' /* webpackChunkName:"SearchComponent" */);
    return SearchComponent;
  },
});
