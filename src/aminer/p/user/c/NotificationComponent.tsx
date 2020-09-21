import React, { useEffect } from 'react';
import { component, connect, withRouter, Link } from 'acore';
import { FM } from 'locales';

import { getLangLabel } from 'helper';
import { isLogin, isRoster } from 'utils/auth';
import { classnames } from 'utils';

import { match as IMatch } from 'react-router-dom';
import { IUser, IUserInfo } from 'aminer/components/common_types';
import { Notification } from './notification';
import styles from './NotificationComponent.less';

interface ISubRouteItem {
  title: string;
  title_zh: string;
  route: string;
}
interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  userinfo: IUserInfo;
  routePath: string;
}

const NotificationComponent: React.FC<IPropTypes> = props => {
  const { dispatch, userinfo, query } = props;
  // const { search } = location || {};
  // const isSubscribe = search?.includes('subscribe');
  useEffect(() => {
    dispatch({ type: 'aminerCommon/HideFeedDot' });
  }, []);

  return (
    <section className={classnames(styles.notificationComponent)}>
      <Notification userinfo={userinfo} query={query} />
    </section>
  );
};

// Topic.propTypes = {

// }

export default component(
  withRouter,
  connect(({}) => ({})),
)(NotificationComponent);
