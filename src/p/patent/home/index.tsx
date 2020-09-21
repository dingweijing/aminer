/**
 * Created by bo gao on 2019-05-17
 * Refactor: Use Hooks.
 */
import React, { useEffect } from 'react';
import { connect, page, Link } from 'acore';
import { sysconfig } from 'systems';
import { Layout } from 'layouts';
import styles from './index.less';
// import { FormCreate } from '@/acore';

const PatentHome = () => {
  return (
    <Layout
      classNames={[styles.layout, sysconfig.EB_LayoutSkin]}
      searchZone={[]}
      rightZone={[]}
      contentClass=""
      showSidebar
      showNavigator={false}
    >

      <div className={styles.container}>
        <h1>Person Basic Contact Annotation Tool.</h1>

      </div>
    </Layout>
  );
};

export default page()(PatentHome);
