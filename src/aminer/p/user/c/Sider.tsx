import React, { useEffect } from 'react';
import { component, connect, withRouter, Link } from 'acore';
import { FM } from 'locales';
import { getLangLabel } from 'helper';
import { isLogin, isALLRoster } from 'utils/auth';
import { classnames } from 'utils';
import { IUser } from 'aminer/components/common_types';
import styles from './Sider.less';

interface IRouterItem {
  title: string;
  title_zh: string;
  link?: string;
  permission?: (user: IUser) => boolean;
  routes?: ISubRouteItem[];
}
interface ISubRouteItem {
  title: string;
  title_zh: string;
  route: string;
  icon: string;
}
interface IPropTypes {
  user: IUser;
  routePath: string;
}

const router: IRouterItem[] = [
  {
    title: 'Profile Management',
    title_zh: '主页管理',
    routes: [
      {
        title: 'Academic Profile',
        title_zh: '学术主页',
        route: '/user/scholar',
        icon: 'icon-graduation-cap',
      },
      {
        title: 'User Information',
        title_zh: '个人账户',
        route: '/user/center',
        icon: 'icon-profile',
      },
    ],
  },
  {
    title: 'Academic Home',
    title_zh: '学术中心',
    routes: [
      {
        title: 'Research Feed',
        title_zh: '科研动态',
        route: '/user/notification',
        icon: 'icon-emizhifeiji',
      },
      {
        title: 'My following',
        title_zh: '我的关注',
        route: '/user/concern',
        icon: 'icon-like',
      },
      {
        title: 'Paper Collections',
        title_zh: '论文收藏',
        route: '/user/collections',
        icon: 'icon-dongtai1',
      },
      // {
      //   title: '我的清单',
      //   title_zh: '我的清单',
      //   route: '/user/publist',
      // },
      // {
      //   title: '我的历史',
      //   title_zh: '我的历史',
      //   route: '/histroy'
      // },
    ],
  },
  // {
  //   title: 'My Master Reading Tree',
  //   title_zh: '我的溯源树',
  //   link: '/dashboard/mrt',
  // },
  {
    title: 'EXPERT EXPLORER',
    title_zh: '智库管理',
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

const Sider = (props: IPropTypes) => {
  const { user, routePath } = props;

  return (
    <section className={classnames(styles.sider)}>
      {router &&
        router.map(item => {
          const { title, title_zh, routes, permission, link } = item;
          const title_label = getLangLabel(title, title_zh);
          const link_target = link?.startsWith('/user') ? '_self' : '_blank';
          // const isAuth = permission || defualtAuth;
          if (permission && !permission(user)) {
            return false;
          }
          return (
            <div className="part" key={title}>
              <h5 className={classnames('title_line menu_item', { title_link: !routes })}>
                {link && (
                  <Link to={link} target={link_target}>
                    {title_label}
                  </Link>
                )}
                {!link && <span>{title_label}</span>}
              </h5>
              {routes &&
                routes.map(route => {
                  const { route: type_path, icon } = route;
                  const name_label = getLangLabel(route.title, route.title_zh);
                  const target = type_path.startsWith('/user') ? '_self' : '_blank';
                  return (
                    <span className="route_container" key={type_path}>
                      <Link
                        to={type_path}
                        key={type_path}
                        target={target}
                        className={classnames('route menu_item', {
                          active: type_path.includes(routePath),
                        })}
                      >
                        <svg className="icon" aria-hidden="true">
                          <use xlinkHref={`#${icon}`} />
                        </svg>
                        {name_label}
                      </Link>
                    </span>
                  );
                })}
            </div>
          );
        })}
    </section>
  );
};

// Topic.propTypes = {

// }

export default component(
  // withRouter,
  connect(({ auth }) => ({
    user: auth.user,
  })),
)(Sider);
