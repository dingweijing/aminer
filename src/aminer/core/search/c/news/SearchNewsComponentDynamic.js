/**
 * Created by zelda on 2019/08/13
 */

import React from 'react';
import { dynamic } from 'acore';

// export default dynamic({
//   modules: () => ({
//     SearchNewsComponent: import('./SearchNewsComponent')
//   }),
//   render(props, loaded) {
//     return <loaded.SearchNewsComponent {...props} />
//   },
//   // loading: () => (null),
// })

export default dynamic({
  loader: async function() {
    // 这里的注释 webpackChunkName 可以指导 webpack 将该组件 HugeA 以这个名字单独拆出去
    const { default: SearchNewsComponent } = await import(/* webpackChunkName: "SearchNewsComponent" */ './SearchNewsComponent');
    return SearchNewsComponent;
  },
});