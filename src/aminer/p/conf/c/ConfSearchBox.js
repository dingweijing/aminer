// getSchedule

import React, { useEffect, useState } from 'react';
import { page, connect } from 'acore';
import { classnames } from 'utils';
import { Input } from 'antd';
import { formatMessage } from 'locales';
import styles from './ConfSearchBox.less';

const ConfSearchBox = props => {
  // TODO: funciton
  const { onSearch = () => { } } = props;
  return (
    <div className={styles.confSearchBox}>
      <Input.Search
        allowClear
        placeholder={formatMessage({ id: 'aminer.conf.search.placeholder' })}
        onSearch={value => onSearch(value)}
        style={{ width: '100%', height: '40px' }}
        className="searchInput"
      />
    </div>
  );
};

export default page(connect())(ConfSearchBox);
