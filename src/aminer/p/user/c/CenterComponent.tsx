import React, { useEffect, useState } from 'react';
import { component, connect, withRouter, Link } from 'acore';

import { classnames } from 'utils';

import { IUser, IUserInfo } from 'aminer/components/common_types';
import { Spin } from 'aminer/components/ui';
import { UserInfo } from './center';
import styles from './CenterComponent.less';

// interface ISubRouteItem {
//   title: string;
//   title_zh: string;
//   route: string;
// }
interface IPropTypes {
  // user: IUser;
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  routePath: string;
  page_loading?: boolean;
  userinfo: IUserInfo;
}

const CenterComponent = (props: IPropTypes) => {
  const { routePath, location, dispatch, page_loading, userinfo } = props;
  // const [user, setUser] = useState<IUserInfo>();
  // console.log('user', user);

  // console.log('avatar', avatar);

  // const getUser = () => {
  //   dispatch({
  //     type: 'social/GetUser',
  //   }).then((info: IUserInfo) => {
  //     setUser(info);
  //   });
  // };
  // useEffect(() => {
  //   getUser();
  // }, []);

  // if (!user) {
  //   return <></>;
  // }

  return (
    <section className={classnames(styles.centerComponent)}>
      <Spin loading={page_loading} />
      <UserInfo userinfo={userinfo} />
    </section>
  );
};

// Topic.propTypes = {

// }

export default component(
  withRouter,
  connect(({ auth, loading }) => ({
    user: auth.user,
    page_loading: loading.effects['social/GetUser'],
  })),
)(CenterComponent);
