import React, { useEffect, useState } from 'react';
import { page, component, connect } from 'acore';
import * as auth from 'utils/auth';
import { FM, formatMessage } from 'locales';
import styles from './AlertLoginBlock.less';

const AlertLoginBlock = props => {
  const { dispatch } = props;

  const showLogin = () => {
    dispatch({ type: 'modal/login' });
  };

  return (
    <div className={styles.alertLoginBlock}>
      <p className="should_login" onClick={showLogin}>
        <FM id="aminer.common.loginview" defaultMessage="Sign in to view more" />
      </p>
    </div>
  );
};

export default component(connect())(AlertLoginBlock);
