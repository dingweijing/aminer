import React, { useEffect, useState } from 'react';
import { classnames } from 'utils';
import { Menu, Dropdown, Drawer } from 'antd';
import { FM, } from 'locales';
import { useIntl } from 'umi';
import { Link, component, withRouter } from 'acore';
import consts from 'consts';
import styles from './HeaderNav.less';

const nav = [
  {
    id: 'aminer.home.header.nav.home',
    defaultMessage: 'Home',
    nav: 'home',
    href: '/',
  },
  {
    id: 'aminer.user.rss',
    defaultMessage: 'Research-feed',
    nav: 'user/notification',
    href: '/user/notification',
  },
  {
    id: 'aminer.home.header.nav.channel',
    defaultMessage: 'Channel',
    nav: 'channel',
    href: '/channel',
  },
  {
    id: 'aminer.home.header.nav.rankings',
    defaultMessage: 'Rankings',
    nav: 'ranks',
    href: '/ranks/home',
  },
  {
    id: 'aminer.home.header.nav.gct',
    defaultMessage: 'GCT',
    target: '_blank',
    href: 'https://gct.aminer.cn/',
  },
  {
    id: 'aminer.home.header.nav.thu',
    defaultMessage: 'THU AI TR',
    nav: 'research_report',
    href: '/research_report/articlelist',
  },

  {
    id: 'aminer.home.labs.open_data',
    defaultMessage: 'Open Data',
    target: '_blank',
    href: 'https://aminer.cn/data?nav=openData',
  },
  {
    id: 'aminer.home.header.nav.must_reading',
    defaultMessage: 'Must Reading',
    nav: 'topic',
    href: '/topic',
  },
];

const HeaderNav = props => {
  const { className, showSearch, location } = props;
  const [isHidden, setIsHidden] = useState(true);
  const [navIconChecked, setNavIconChecked] = useState(false);
  const [drawerChecked, setDrawerChecked] = useState(false);
  const [navNow, setNavNow] = useState('home');
  const intl = useIntl();
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    if (isHidden) {
      handleResize();
    }
    let nav = 'home';

    // fix notification!!
    if (props.location.pathname.includes('/user/notification')) {
      setNavNow('user/notification');
      return componentUnload();
    }
    if (props.location.pathname === '/') {
      setNavNow(nav);
    } else {
      nav = props.location.pathname.slice(1);
      if (nav.length > 0) {
        let index = nav.indexOf('/');
        if (index < 0) {
          index = nav.length;
        }
        nav = nav.slice(0, index);
        setNavNow(nav);
      }
    }
    return componentUnload();
  }, [location]);

  const componentUnload = () => {
    window.removeEventListener('resize', handleResize);
  };

  const handleResize = () => {
    const width = document.body.clientWidth || document.documentElement.clientWidth;
    width < 1000 ? setIsHidden(true) : setIsHidden(false);
  };

  const menu = () => {
    return (
      <Menu>
        {nav && nav.map(item => <Menu.Item key={item.id}>{renderNavItem(item)}</Menu.Item>)}
      </Menu>
    );
  };

  const clickIcon = () => {
    if (document.body.clientWidth <= 736) {
      setDrawerChecked(true);
    }
  };

  const drawerClose = () => {
    setDrawerChecked(false);
  };

  const visibleChange = visible => {
    setNavIconChecked(visible);
  };

  const renderNavItem = item =>
    item.target ? (
      <a
        href={item.href}
        key={item.id}
        className={classnames('navItem', {
          hiddenNav: isHidden || showSearch,
          navNow: item.nav === navNow,
          home: className === 'home',
        })}
        target={item.target}
      >
        {intl.formatMessage({ id: item.id })}
      </a>
    ) : (
        <Link
          to={item.href}
          key={item.id}
          className={classnames('navItem', {
            hiddenNav: isHidden || showSearch,
            navNow: item.nav === navNow,
            home: className === 'home',
          })}
        >
          {intl.formatMessage({ id: item.id })}
        </Link>
      );

  return (
    <div className={classnames(styles.nav)}>
      <div className={styles.headerNav}>{nav && nav.map(item => renderNavItem(item))}</div>
      <span className={classnames({ hiddenIcon: !isHidden && !showSearch })}>
        <Dropdown
          overlay={menu()}
          trigger={['click']}
          overlayClassName="navDropdown"
          onVisibleChange={visibleChange}
        >
          <svg
            className={classnames('icon navIcon', {
              navIconChecked,
              notHomeColor: className !== 'home',
            })}
            aria-hidden="true"
            onClick={clickIcon}
          >
            <use xlinkHref="#icon-caidanshouqi" />
          </svg>
        </Dropdown>
      </span>
      <Drawer
        placement="left"
        destroyOnClose={true}
        closable={false}
        onClose={drawerClose}
        visible={drawerChecked}
        className="navDrawer"
        width="45%"
      >
        <svg className="icon navHomeIcon" aria-hidden="true">
          <use xlinkHref="#icon-AMinerlogo" />
        </svg>
        {nav && nav.map(item => renderNavItem(item))}
      </Drawer>
    </div>
  );
};

export default component(withRouter)(HeaderNav);
