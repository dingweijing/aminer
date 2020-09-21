/**
 * Created by BoGao on 2019/06/30.
 */
import React, { useMemo, useEffect } from 'react';
import { connect, component, withRouter } from 'acore';
import { Helmet } from 'umi';
import { sysconfig } from 'systems';
import consts from 'consts';

const TheRootLayout = props => {
  const { children, preventRender, location } = props;

  useEffect(() => {
    if (typeof window === 'object') {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const helmet = useMemo(() => (
    <Helmet>
      <link
        href={`${consts.ResourcePath}/sys/${sysconfig.SYSTEM}/favicon.ico`}
        rel="icon" type="image/x-icon"
      />

      {/* TODO 计划将来要去掉 font-awesome */}
      <link rel="stylesheet" href={`${consts.ResourcePath}/lib/fa/css/font-awesome.min.css`} />

      {/* AMiner 图标计划 :: https://at.alicdn.com/t/font_1190641_998lo6nlbb4.js */}
      {sysconfig.ICONFONT_LINK && <script src={sysconfig.ICONFONT_LINK} />}

    </Helmet>
  ), []);


  // ! Special Case 用来在新老两个系统切换是用到的临时阻止刷新.
  if (preventRender) {
    console.log('Prevent Render!');
    return [];
  }

  return (
    <>
      {helmet}
      {children}
    </>
  );
};

export default component(
  withRouter,
  connect(({ global }) => ({
    preventRender: global.preventRender,
  })),
)(TheRootLayout);
