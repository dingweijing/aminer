import React, { useEffect, useState } from 'react';
import { component, connect, withRouter, Link, history } from 'acore';
import { FM } from 'locales';

import { getLangLabel } from 'helper';
import { isLogin, isRoster } from 'utils/auth';
import { classnames } from 'utils';

import { match as IMatch } from 'react-router-dom';
import { IUser, IUserInfo } from 'aminer/components/common_types';
import { UserInfo, MyFollows } from './concern';

import { PersonalHomepage, FindYourself } from './scholar';
import styles from './ScholarComponent.less';

// interface ISubRouteItem {
//   title: string;
//   title_zh: string;
//   route: string;
// }
interface IPropTypes {
  // user: IUser;
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  routePath: string;
  userinfo: IUserInfo;
}

const ScholarComponent = (props: IPropTypes) => {
  const { location, dispatch, userinfo } = props;
  const { search } = location || {};
  const isFind = search?.includes('findyourself');
  // const { raw_info } = user || {};
  const { bind } = userinfo || {};

  const [isBind, setIsBind] = useState<string>(bind || '');

  useEffect(() => {
    if (!bind) {
      history.replace('/user/scholar?t=findyourself');
    }
  }, []);

  useEffect(() => {
    dispatch({
      type: 'social/GetUser',
    });
  }, [search]);
  useEffect(() => {
    setIsBind(bind);
  }, [bind]);

  if (!userinfo) {
    return <></>;
  }

  // console.log('avatar', avatar);
  return (
    <div className={styles.scholarComponent}>
      {isBind && !isFind && <PersonalHomepage pid={isBind} />}
      {(!isBind || isFind) && <FindYourself setIsBind={setIsBind} userinfo={userinfo} />}
      {/* <FindYourself /> */}
    </div>
  );
};

// Topic.propTypes = {

// }

export default component(
  withRouter,
  connect(({ auth }) => ({
    // user: auth.user,
  })),
)(ScholarComponent);
