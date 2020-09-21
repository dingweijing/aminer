/**
 * Created by xenaluo on 2019/02/19
 */

import React from 'react';
import { dynamic } from 'acore';

// export default dynamic({
//   modules: () => ({
//     SearchGCTComponent: import('./SearchGCTComponent')
//   }),
//   render(props, loaded) {
//     return <loaded.SearchGCTComponent {...props} />
//   },
//   // loading: () => (null),
// })

export default dynamic({
  loader: async function() {
    // 这里的注释 webpackChunkName 可以指导 webpack 将该组件 HugeA 以这个名字单独拆出去
    const { default: SearchGCTComponent } = await import(/* webpackChunkName: "SearchGCTComponent" */ './SearchGCTComponent');
    return SearchGCTComponent;
  },
});