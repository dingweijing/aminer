import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { page, connect, withRouter, Link, history } from 'acore';
import { FM } from 'locales';
import { useResizeEffect_NEW } from 'helper/hooks';
import { classnames } from 'utils';
import { Layout } from 'aminer/layouts';
import { isLogin } from 'utils/auth';
import { IUser, IUserInfo } from 'aminer/components/common_types';
import { match as IMatch } from 'react-router-dom';
import { getLangLabel } from 'helper';

import {
  Sider,
  NotificationComponent,
  CenterComponent,
  ScholarComponent,
  ConcernComponent,
  CollectionsComponent,
} from './c';
import { PubListMenu } from './c/side';
import styles from './index.less';

const title_map = {
  scholar: { title: 'Academic Profile', title_zh: '学术主页' },
  center: { title: 'User Information', title_zh: '个人账户' },
  notification: { title: 'Research Feed', title_zh: '科研动态' },
  concern: { title: 'My following', title_zh: '我的关注' },
  collections: { title: 'My Collections', title_zh: '我的收藏' },
};

const notLogin = ['/user/notification'];

interface IPropTypes {
  match: IMatch<IRouteParam>;
  user: IUser;
  userinfo: IUserInfo;
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
}
interface IRouteParam {
  type: string;
}

interface IRouteMap {
  [route: string]: React.FC;
}

const routeMap: IRouteMap = {
  notification: NotificationComponent,
  center: CenterComponent,
  scholar: ScholarComponent,
  concern: ConcernComponent,
  collections: CollectionsComponent,
};

const siderMap: IRouteMap = {
  collections: PubListMenu,
};

const UserPage = (props: IPropTypes) => {
  const { match, dispatch, userinfo, location, loading } = props;
  // const [user, setUser] = useState<IUserInfo>();
  const {
    params: { type },
  } = match;
  const { pathname, query } = location;

  const menuRef = useRef();
  useResizeEffect_NEW(menuRef, { width: 992, monitors: ['type'] });

  const state = notLogin.every(item => pathname.startsWith(item));
  const is_login = isLogin(userinfo);

  const getUser = () => {
    dispatch({
      type: 'social/GetUser',
    }).then((info: IUserInfo) => {
      if (!isLogin(info) && !state) {
        history.replace(`/login?callback=${pathname}`);
        return false;
      }
    });
  };

  // useEffect(() => {}, []);

  useEffect(() => {
    getUser();
  }, [type]);

  const pageTitle = useMemo(() => {
    const { title, title_zh } = title_map[type] || {};
    return getLangLabel(title, title_zh);
  }, [type]);

  const Component = routeMap[type];
  const SiderMenu = siderMap[type];
  // console.log('Component', type, Component);
  //  autoScale autoScaleWidth="width-device"
  return (
    <Layout pageTitle={pageTitle} className="user">
      {/* {isLogin(userinfo) && ( */}
      <article className={styles.userPage}>
        <div className={classnames('sider', styles.movein)} ref={menuRef}>
          <div className="top">
            <Sider routePath={type} />
          </div>
          {SiderMenu && (
            <div className="menu">
              <SiderMenu />
            </div>
          )}
        </div>
        <div className={classnames('main_component', `${type}`)}>
          <ToggleMenuIcon cWidth={992} menuRef={menuRef} />
          {Component && (is_login || state) && <Component userinfo={userinfo} query={query} />}
          {/* <NotificationComponent /> */}
        </div>
      </article>
      {/* )} */}
    </Layout>
  );
};

// Topic.propTypes = {

// }
// UserPage.getInitialProps = async () => {};

export default page(
  withRouter,
  connect(({ auth, social, loading }) => ({
    user: auth.user,
    userinfo: social.userinfo,
    loading: loading.effects['social/GetUser'],
  })),
)(UserPage);

const ToggleMenuIcon: React.FC<any> = props => {
  const { menuRef, icon = 'caidanshouqi', cWidth = 768 } = props;
  const iconRef = useRef();

  useResizeEffect_NEW(iconRef, { width: cWidth, reverse: true });

  const showMenu = useCallback(() => {
    if (!menuRef.current) {
      return;
    }
    if (menuRef.current.style.display === 'block') {
      menuRef.current.style.display = 'none';
    } else {
      menuRef.current.style.display = 'block';
    }
  }, []);

  return (
    <div
      className={classnames(styles.toggleMenuIcon, 'toggle-menu-icon mobile_device pointer_btn')}
      ref={iconRef}
    >
      <svg className="icon" aria-hidden="true" onClick={showMenu}>
        <use xlinkHref={`#icon-${icon}`} />
      </svg>
    </div>
  );
};
