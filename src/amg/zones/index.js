/*
 * @Author: your name
 * @Date: 2019-11-25 14:38:09
 * @LastEditTime: 2019-12-02 13:28:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /aminer-ssr/src/amg/zones/index.js
 */
import React, { useEffect, useState, useMemo, memo } from 'react';
import { connect, component } from 'acore';
import { useSSRTwoPassRender } from 'helper/hooks';
import consts from 'consts';

// * -----------------------------------------------------------------
const AnnotationZone = component(
  connect(({ auth, debug }) => ({
    isUserLogin: auth.isUserLogin, // 是否已经登录
    canAnnotate: auth.canAnnotate, // 是否可以标注
    peekannotationlog: auth.peekannotationlog, // 是否能看到标注信息
    ShowAnnotation: debug.ShowAnnotation,
  })),
)(props => {
  const { isUserLogin, canAnnotate, peekannotationlog, ShowAnnotation, children, monitors } = props;

  // Render empty on Server.
  const content = useSSRTwoPassRender({
    render: () => children,
    test: (canAnnotate || peekannotationlog) && ShowAnnotation,
    // defaultRender: () => (<div>empty</div>), // SSR渲染，客户端第一次渲染，或者condition为false时走这个。
  }, monitors || [])
  return content
});


// * -----------------------------------------------------------------
const DeveloperZone = component(
  connect(({ auth, debug }) => ({
    isDeveloper: auth.isDeveloper,
  })),
)(props => {
  const { isDeveloper, children } = props;
  const content = useSSRTwoPassRender({ // Render empty on Server.
    render: () => children,
    test: isDeveloper,
    // defaultRender: () => (<div>empty</div>),
  }, [])
  return content
});

export {
  AnnotationZone, DeveloperZone
}
