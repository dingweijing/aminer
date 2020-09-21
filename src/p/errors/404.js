/*
 * @Author: your name
 * @Date: 2019-11-25 14:38:09
 * @LastEditTime: 2019-11-29 10:54:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /aminer-ssr/src/p/errors/404.js
 */
import React, { useEffect } from 'react';
import { connect, page, Link, component } from 'acore';
import { Layout, EmptyLayout } from 'aminer/layouts';
import styles from './404.less';

const Error404 = props => {
  const { header = true } = props;
  const LayoutComponents = header ? Layout : EmptyLayout;

  return (
    <LayoutComponents
      contentClass={styles.content}
      rootClassName={styles.root}
      pageTitle="404 - Page not found"
    >
      {/* <h3>404 - page not found</h3>
      <p>We are sorry but the page you are looking for does not exist.</p> */}
      <h3>THAT'S AN ERROR!</h3>
      <p>
        The requested URL was not found on this server.
        <br />
        That's all we know
      </p>
      <div className={styles.img}>
        <img src="https://fileserver.aminer.cn/sys/aminer/error-404-v5.png" />
      </div>
      <div className={styles.link}>
        <a href="/">Back home</a>
      </div>
    </LayoutComponents>
  );
};

export default component()(Error404);
