import React, { PureComponent, useEffect, useState, useRef, useMemo } from 'react';
import { connect, component } from 'acore';
import { EmptyLayout } from 'aminer/layouts';
// import { syncMatchesToState } from 'helper';
import { classnames, qs } from 'utils';
import { FM, saveLocale } from 'locales';
import { logtime } from 'utils/log';
import { decodeLocation } from 'utils/misc';
import helper from 'helper';
import { sysconfig } from 'systems';
import { PubComponent, ProjectComponent, PatentComponent } from '../c/list_component';
// import PersonBio from './c/PersonBio';
// import TabZone from './c/PersonTabzone';
import styles from './pub.less';


// const { Profile_List_Length = 100 } = sysconfig;
const ProfilePubHome = props => {
  const { dispatch, match } = props;
  const { params: { id: pid } = {} } = match;

  // TODO needloading???
  useEffect(() => {
    if (pid) {
      dispatch({
        type: 'profile/resetPubPage',
      });
      dispatch({
        type: 'profile/getPersonPapers',
        payload: { id: pid }
      });
    }

    // return () => {
    //   dispatch({
    //     type: 'profile/resetProfile'
    //   });
    // }
  }, [pid])

  // console.log('profileData', profileData)

  return (
    <EmptyLayout>
      <article className={styles.pubPage}>
        <PubComponent pid={pid} />
      </article>
    </EmptyLayout>
  )
}

// ProfilePubHome.getInitialProps = async ({ store, route, isServer, res, req }) => {
//   if (!isServer) { return; }
//   console.log('!!!!!!!')
  // await store.dispatch({
  //   type: 'profile/resetPubPage',
  // });
// };

export default component(
  connect()
)(ProfilePubHome)
