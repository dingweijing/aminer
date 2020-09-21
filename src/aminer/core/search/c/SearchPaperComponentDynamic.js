/**
 * Created by xenaluo on 2019/02/19
 */

import React from 'react';
import { dynamic } from 'acore';

// export default dynamic({
//   modules: () => ({
//     SearchPaperComponent: import('./SearchPaperComponent')
//   }),
//   render(props, loaded) {
//     return <loaded.SearchPaperComponent {...props} />
//   },
//   loading: () => (null),
// })

export default dynamic({
  loader: async function() {
    // 这里的注释 webpackChunkName 可以指导 webpack 将该组件 HugeA 以这个名字单独拆出去
    const { default: SearchPaperComponent } = await import(/* webpackChunkName: "SearchPaperComponent" */ './SearchPaperComponent');
    return SearchPaperComponent;
  },
});