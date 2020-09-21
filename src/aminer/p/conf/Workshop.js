// getSchedule

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { page, connect } from 'acore';
import { classnames } from 'utils';
import { Tabs, Collapse } from 'antd';
import { formatMessage, FM } from 'locales';
import { useResizeEffect } from 'helper/hooks';
import { Spin } from 'aminer/components/ui';

import { KeynoteList } from './component';
import styles from './Workshop.less';

const Workshop = props => {
  const [workshop_data, setWorkshopData] = useState();

  const { dispatch } = props;

  useEffect(() => {
    dispatch({
      type: 'aminerConf/getWorkshop'
    }).then(data => {
      setWorkshopData(data);
    })
  }, []);

  return (
    <div className={styles.workshopPage}>
      <KeynoteList keynotes={workshop_data} />
    </div>
  );
};

export default page(
  connect(({ auth }) => ({
    user: auth.user,
    roles: auth.roles,
  })),
)(Workshop);
