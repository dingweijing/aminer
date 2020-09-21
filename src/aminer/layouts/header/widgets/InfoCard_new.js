import React from 'react';
import { connect, component, Link, withRouter } from 'acore';
import { sysconfig } from 'systems';
import { FM } from 'locales';
import { classnames } from 'utils';
import { getLangLabel } from 'helper';
import { isLogin, isALLRoster } from 'utils/auth';
import * as profileUtils from 'utils/profile-utils';
import styles from './InfoCard_new.less';

const router = [
  {
    key: '1',
    routes: [
      {
        title: 'Academic Profile',
        title_zh: '学术主页',
        route: '/user/scholar',
      },
      {
        title: 'User Profile',
        title_zh: '个人账号',
        route: '/user/center',
      },
    ],
  },
  {
    key: '2',
    routes: [
      {
        title: 'Research Feed',
        title_zh: '科研动态',
        route: '/user/notification',
      },
      {
        title: 'My following',
        title_zh: '我的关注',
        route: '/user/concern',
      },
      {
        title: 'Paper Collections',
        title_zh: '论文收藏',
        route: '/user/collections',
        icon: 'icon-dongtai1',
      },
    ],
  },
  {
    key: '3',
    permission: isALLRoster,
    routes: [
      {
        title: 'My Expert Bases',
        title_zh: '我的智库',
        route: '/dashboard/expert/folders/my',
        icon: 'icon-zhihuitiku',
      },
      {
        title: 'Data Annotation',
        title_zh: '数据标注',
        route: '/dashboard/annotation',
        icon: 'icon-Pencil',
      },
    ],
  },
];

const InfoCard = props => {
  const { user, className, location } = props;
  const userLink = user
    ? '/user/scholar'
    : `/login?callback=${encodeURIComponent(location.pathname.substr(1))}${encodeURIComponent(
      location.search,
    )}`;

  const logout = () => {
    const { dispatch } = props;
    dispatch({ type: 'auth/logout' });
    localStorage.removeItem(`lc_${sysconfig.SYSTEM}_me-data`);
  };

  // if (!user) {
  //   return false;
  // }
  const isAuth = isLogin(user);

  const renderEmail = email => {
    let em = ''
    if (email && email.includes('@phone.aminer.cn')) {
      em = email.replace('@phone.aminer.cn', '')
    } else if (email) {
      em = email
    }
    return em;
  }

  return (
    <div className={classnames('user_info_card', styles.infoCard, styles[className])}>
      <div className={classnames('top', { not_log: !user })}>
        <Link to={userLink} className="image">
          {isAuth && <img src={profileUtils.getAvatar(user.avatar, user.id, 80)} alt="" />}
          {!isAuth && (
            <svg className="icon default_icon" aria-hidden="true">
              <use xlinkHref="#icon-mi" />
            </svg>
          )}
        </Link>

        <div className={classnames('info')}>
          {isAuth && (
            <>
              <p className="name">
                <Link to={userLink}>{user.name || ''}</Link>
              </p>
              <p className="email">
                <Link to={userLink}>{renderEmail(user.email)}</Link>
              </p>
            </>
          )}
          {!isAuth && (
            <Link to={userLink}>
              <FM id="aminer.common.signin" defaultMessage="Log in AMiner" />
            </Link>
          )}
        </div>
      </div>
      {router &&
        router.map(item => {
          const { key, routes, permission } = item;
          if (permission && !permission(user)) {
            return false;
          }
          return (
            <div className="part" key={key}>
              {routes &&
                routes.map(route => {
                  const { route: type_path } = route;
                  const link = user
                    ? type_path
                    : `/login?callback=${encodeURIComponent(type_path)}`;
                  const name_label = getLangLabel(route.title, route.title_zh);
                  const target = type_path.startsWith('/user') ? '_self' : '_blank';
                  return (
                    <Link to={type_path} target={target} key={type_path} className="route list_item">
                      {name_label}
                    </Link>
                  );
                })}
            </div>
          );
        })}
      {isAuth && (
        <div className="part logout">
          <div className="list_item" onClick={logout}>
            <FM id="aminer.common.logout" defaultMessage="Logout" />
          </div>
        </div>
      )}
    </div>
  );
};

export default component(
  withRouter,
  connect(({ auth }) => ({ user: auth.user })),
)(InfoCard);
