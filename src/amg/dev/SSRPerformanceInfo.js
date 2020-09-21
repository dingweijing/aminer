import React, { useState, useMemo } from 'react';
import { connect, Link, component, withRouter } from 'acore';
import consts from 'consts';
import { useSSRTwoPassRender } from 'helper/hooks';
import { AnnotationZone } from 'amg/zones';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import { Menu, Dropdown, Tooltip } from 'antd';
import { saveLocale, FM, formatMessage } from 'locales';
import { isLogin } from 'utils/auth';
import cookies from 'utils/cookie';
import { PopDelay } from 'aminer/components/widgets'
import styles from './SSRPerformanceInfo.less';

const SSRPerformanceInfo = props => {
  const { location, hideDashboard = false, className } = props;
  const [visible, setVisible] = useState(false)

  return (
    <li className={classnames('specialzone_performance small', className)}>
      SSR: 1890ms
  </li>
  );
};

export default component(
  // connect(({ auth }) => ({ user: auth.user })),
)(SSRPerformanceInfo);
