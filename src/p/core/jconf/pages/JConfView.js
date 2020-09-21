/**
 * Created by bo gao on 2019-06-09
 */
import React, { useState, useEffect } from 'react';
import { connect, page } from 'acore';
import { sysconfig } from 'systems';
import { JConfView } from 'modules/core/jconf/components'
import { Layout } from 'layouts/2b';
import { FM } from 'locales';
import { Auth } from 'acore/hoc';
import styles from './JConfView.less';

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
const thepage = (props) => {
  const { dispatch, match, roles } = props;
  const { id } = match.params

  // const [jconf, setJconf] = useState()

  // // loading person effect.
  // useEffect(() => {
  //   dispatch({
  //     type: "jconf/getJConf",
  //     payload: { id, pure: true, mode: '' }
  //   }).then((data) => {
  //     // console.log('...get jconfs', data);
  //     initData(data)
  //   }).catch((err) => {
  //     console.log('...some error occured, ', err);
  //   })
  // }, [id]); // TODO when update.

  // const initData = (data) => {
  //   setJconf(data)
  // }

  // console.log(">>> ", match, id, jconf);

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
          <h1>View Journal / Conference</h1>
        </div>

        <JConfView id={id} />

      </div>
    </Layout>
  )
}

export default page(
  connect(({ auth }) => ({ roles: auth.roles })),
  // Auth,
)(thepage)
