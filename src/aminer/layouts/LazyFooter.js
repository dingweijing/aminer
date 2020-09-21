import React from 'react';
import { dynamic } from 'acore';

// TODO hooks/umi应该有新的动态加载的方案了。

export default dynamic({
  loader: async function () {
    // 这里的注释 webpackChunkName 可以指导 webpack 将该组件 HugeA 以这个名字单独拆出去
    const { default: LazyFooter } = await import(/* webpackChunkName: "external_A" */ 'aminer/layouts/footer/Footer');
    return LazyFooter;
  },
});