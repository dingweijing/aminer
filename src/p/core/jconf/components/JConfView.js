/**
 * Created by bo gao on 2019-05-17
 * Refactor: Use Hooks.
 */
import React, { useState, useEffect } from 'react';
import { connect, component, Link } from 'acore';
import { differenceInDays, parseISO } from 'date-fns';

import { formatMessage, FD, FT, FR } from 'locales';
import { Table } from 'antd';
import styles from './JConfView.less';

const JConfList = (props) => {
  const { roles, dispatch, id, } = props;

  const [jconf, setJconf] = useState()

  // loading person effect.
  useEffect(() => {
    dispatch({
      type: "jconf/get",
      payload: { id, pure: true, mode: '' }
    }).then((data) => {
      // console.log('...get jconfs', data);
      initData(data)
    }).catch((err) => {
      console.log('...some error occured, ', err);
    })
  }, [id]); // TODO when update.

  const initData = (data) => {
    setJconf(data)
  }

  console.log(">>> ", id, jconf);

  // empty placeholder.
  if (!jconf) {
    return (
      <div className={styles.container}>
        <h1>Loading...</h1>
      </div>
    )
  }

  // render func
  return (
    <div className={styles.container}>
      <h1>
        {jconf.name}
        {jconf.abbr && <span> ({jconf.abbr}) </span>}
      </h1>
      <h2>short for: {jconf.short_name}</h2>
      <div>type: {jconf.type}</div>
      <div>
        updated_time:
        {jconf.updated_time && (
          <>
            <FD value={jconf.updated_time} />&nbsp;
            <FT value={jconf.updated_time} />
          </>
        )}
      </div>

      {/* <JConfTable data={jconfs} /> */}

    </div>
  )
}


// -----------------------------------------------------------------------------
// -- TODO: functions with immer
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// -- tables
// -----------------------------------------------------------------------------


// -------------------------------------
// -- export
// -------------------------------------
export default component(
  connect(({ auth }) => ({ roles: auth.roles })),
  // Auth,
)(JConfList)
