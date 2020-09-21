/**
 * Created by bo gao on 2019-05-17
 * Refactor: Use Hooks.
 */
import React, { useEffect } from 'react';
import { connect, page } from 'acore';
import { sysconfig } from 'systems';
import { Layout } from 'layouts/2b';
import { FM } from 'locales';
import { Auth } from 'acore/hoc';
import { JConfList } from '../components';
import styles from './JConfList.less';

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
const thepage = (props) => {
  const { roles } = props;

  return (
    <Layout
      classNames={[styles.layout]}
      searchZone={[]}
      rightZone={[]}
      contentClass={styles.ebIndex}
      showSidebar
      showNavigator={false}
    >

      <div className={styles.container}>
        <div className="header">
          <h1>Journal / Conference List</h1>
        </div>

        <JConfList
          link={(id, jconf) => (`/jconf/view/${id}`)}
        />

      </div>
    </Layout>
  )
}

export default page(
  connect(({ auth }) => ({ roles: auth.roles })),
  // Auth,
)(thepage)
