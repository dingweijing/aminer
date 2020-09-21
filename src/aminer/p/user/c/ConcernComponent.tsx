import React, { useEffect, useState } from 'react';
import { component, connect, withRouter, Link } from 'acore';
import { classnames } from 'utils';
import { IUser, IUserInfo, IKeyword, IKeywordSocial } from 'aminer/components/common_types';
import { Spin } from 'aminer/components/ui';
import { MyFollows } from './concern';
import styles from './ConcernComponent.less';

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
  defaultTopics: IKeyword[];
  selectTopics: IKeywordSocial[];
  userinfo: IUserInfo;
}

const ConcernComponent = (props: IPropTypes) => {
  const { routePath, location, dispatch, page_loading } = props;
  const { userinfo } = props;
  // const [user, setUser] = useState<IUserInfo>();
  // console.log('user', user);

  // console.log('avatar', avatar);

  // useEffect(() => {
  //   getUser();
  // }, []);

  // if (!user) {
  //   return <></>;
  // }

  return (
    <section className={classnames(styles.concernComponent)}>
      <Spin loading={page_loading} />
      {/* <SearchTopics defaultTopics={defaultTopics} selectTopics={selectTopics} /> */}
      <MyFollows userinfo={userinfo} />
      {/* {user && } */}
    </section>
  );
};

// Topic.propTypes = {

// }

export default component(
  withRouter,
  connect(({ auth, loading, social }) => ({
    user: auth.user,
    page_loading: loading.effects['social/GetUser'],
    defaultTopics: social.defaultTopics,
    selectTopics: social.selectTopics,
  })),
)(ConcernComponent);
