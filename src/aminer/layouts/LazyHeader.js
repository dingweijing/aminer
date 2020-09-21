import React from 'react';
import { dynamic } from 'acore';

// TODO hooks/umi应该有新的动态加载的方案了。

// const LazyHeader = dynamic({
//   modules: () => ({ Header: import('aminer/layouts/header/Header' /* webpackChunkName:"Header" */) }),
//   render(props, loaded) {
//     return (<loaded.Header {...props} />);
//   },
//   loading: () => (null),
// });


export default dynamic({
  loader: async function () {
    // 这里的注释 webpackChunkName 可以指导 webpack 将该组件 HugeA 以这个名字单独拆出去
    const { default: LazyHeader } = await import('aminer/layouts/header/Header' /* webpackChunkName:"Header" */);
    return LazyHeader;
  },
});


