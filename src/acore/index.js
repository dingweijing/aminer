/**
 *  Created by BoGao on 2017-12-16;
 *
 *  ! 此文件夹下面不允许 import systems, themes
 */

import React from 'react';
import {
  dynamic,
  withRouter,
  connect,
  Link,
  useHistory,
  useLocation,
  useParams,
  history,
} from 'umi';
import { isBrowser } from '@umijs/utils/lib/ssr.js';
// import { Form } from '@ant-design/compatible'; // TODO remove this
import { Form } from 'antd';
import * as system from './system';
import * as hole from './hole';
import * as plugins from './plugins';
import { page, component } from './component-wrapper';
// import { injectHoc } from './hoc/inject-hoc';
// import { EnableLocale } from '../../.startup/startup';

// import '@ant-design/compatible/assets/index.css'; // If you need

// const { Link, Switch } = routerDVA; // from dva ???
const P = plugins; // !deprecated plugins.

const FormCreate = Form.create;

// safe parse children.
const renderChildren = children => {
  const c = React.Children.map(children, child => child);
  return c || false;
};

// 如果启用了Locale，需要在connect的时候强制加入一个属性。实现不刷新切换语言。 // TODO 这个还要么？
// const connect = EnableLocale
//   ? (...params) => pageComponent => {
//     const result = connectDVA(...params)(pageComponent);
//     return injectHoc(result);
//   }
//   : connectDVA;
// const connect = connectDVA;
// TODO: 这里暂时先写这个，先让项目跑起来，再看看

export {
  // Framework...
  connect,
  dynamic,
  withRouter,
  history,
  isBrowser,
  Link,
  // injectHoc,

  P,
  plugins,
  system,
  hole,
  FormCreate, // TODO 移出这个包，FormCreate 与 antd 解耦合。
  renderChildren, // TODO move to helper.
  page,
  component, // wrapper
  useHistory,
  useLocation,
  useParams,
};
