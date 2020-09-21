import React from 'react';
import { Link } from 'acore';
import { formatMessage } from 'locales';
import styles from './Menu.less';
import { FM } from 'locales';
import { classnames } from 'utils';

const Menu = props => {
  const { type } = props;

  const menuData = [
    {
      type: 'expertbase',
      title: 'aminer.dashboard.menu.expertbase',
      icon: 'icon-database',
      link: '/dashboard/expert/folders/my',
    },
  ];

  if (type === 'annotation') {
    menuData.push({
      type: 'annotation',
      title: 'aminer.dashboard.menu.annotation',
      icon: 'icon-Pencil',
      link: '/dashboard/annotation',
    });
  } else if (type === 'mrt') {
    menuData.push({
      type: 'mrt',
      title: 'aminer.dashboard.menu.mrt',
      icon: 'icon-tree',
      link: '/dashboard/mrt',
    });
  }

  return (
    <ul className={styles.menuList}>
      {menuData && menuData.map(item => {
          return (
            <li key={item.type} className={classnames('menu_item', {['active']: item.type === type})}>
              <Link to={item.link}>
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref={`#${item.icon}`} />
                </svg>
                <FM id={item.title} />
              </Link>
            </li>
          );
        })}
    </ul>
  );
};

export default Menu;
