import React, { useState, useMemo } from 'react';
import { connect, Link, component, withRouter } from 'acore';
import consts from 'consts';
import { useSSRTwoPassRender } from 'helper/hooks';
import { AnnotationZone, DeveloperZone } from 'amg/zones';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import { Menu, Dropdown, Tooltip } from 'antd';
import { saveLocale, FM, formatMessage, zhCN } from 'locales';
import { isLogin } from 'utils/auth';
import cookies from 'utils/cookie';
import { PopDelay } from 'aminer/components/widgets';
import { SSRPerformanceInfo } from 'amg/dev';
import { LangIndicator, User, InfoCard, PaperCollector, ProductList } from './widgets';
import styles from './RightZone.less';

const HeaderRightZone = props => {
  const { user, location, hideDashboard = false, className, showFeedDot } = props;
  const [visible, setVisible] = useState(false);

  // ---- Blocks ----------------------------

  const DashboardBlock = useSSRTwoPassRender(
    {
      render: () => (
        <li>
          <div
            className={classnames(styles.dashboard, styles.text, {
              [styles.zh]: sysconfig.Locale === zhCN,
            })}
          >
            <Link to="/user/notification" className={classnames(styles.feed, 'feed')}>
              {showFeedDot && <span className="dot" />}
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-xiaoxi" />
              </svg>
              <span className="desktop_device">
                {formatMessage({ id: 'aminer.user.research.feed', defaultMessage: 'Research Feed' })}
              </span>
            </Link>
          </div>
        </li>
      ),
      test: monitor => {
        // const [t_user, t_hideDashboard] = monitor;
        return true;
      },
      // defaultRender: () => (<div>empty</div>), // SSR渲染，客户端第一次渲染，或者condition为false时走这个。
    },
    [user, hideDashboard, sysconfig.Locale, showFeedDot],
  );

  const LogoutBlock = useSSRTwoPassRender(
    {
      render: ({ hasTest, testPassed: isLoggedin }) => (
        <li className={styles.user}>
          <PopDelay iconContent={<User />} dropContent={<InfoCard />} />
        </li>
      ),
      failedRender: () => (
        <li>
          <Link
            to={`/login?callback=${encodeURIComponent(
              location.pathname.substr(1),
            )}${encodeURIComponent(location.search)}`}
          >
            <div className={styles.loginBtn}>
              <span className={styles.loginText}>
                <FM id="header.login" defaultMessage="Login" />
              </span>
              <span className={styles.split} />
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-profile" />
              </svg>
            </div>
          </Link>
        </li>
      ),
      test: montor => isLogin(montor[0]), // montor[0] is user.
      // defaultRender: () => (<div>empty</div>), // SSR渲染，客户端第一次渲染，或者condition为false时走这个。
    },
    [user],
  );

  //  ---- Render ---------------------------------------

  return (
    <ul className={classnames(styles.rightInfo, styles[className])}>
      {/* <DeveloperZone>
        <SSRPerformanceInfo className={styles.perfinfo} />
      </DeveloperZone> */}

      <ProductList className={className} />
      {/* <PaperCollector className={className} /> */}
      {DashboardBlock}

      <LangIndicator className={className} visible={visible} />

      {/* {LogoutBlock} */}
      <li className={styles.user}>
        <PopDelay iconContent={<User className={className} />} dropContent={<InfoCard />} />
      </li>
    </ul>
  );
};

export default component(
  withRouter,
  connect(({ auth, aminerCommon }) => ({ user: auth.user, showFeedDot: aminerCommon.showFeedDot })),
)(HeaderRightZone);
