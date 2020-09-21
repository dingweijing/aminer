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
import ProfileEgoNetwork from '../c/ProfileEgoNetwork';
import styles from './ego.less';

// const { Profile_List_Length = 100 } = sysconfig;
const ProfilePubHome = props => {
  const { dispatch, match } = props;
  const { params: { id: pid } = {} } = match;

  return (
    <EmptyLayout>
      <article className={styles.egoPage}>
        <ProfileEgoNetwork personId={pid} />
      </article>
    </EmptyLayout>
  )
}


export default component(connect(({ aminerPerson, auth, publications, profile, loading }) => ({
})))(ProfilePubHome)
