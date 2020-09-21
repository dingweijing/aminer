// getSchedule

import React, { useEffect, useState } from 'react';
import { page, connect, history } from 'acore';
import { classnames } from 'utils';
import { formatMessage, FM } from 'locales';
import { isLogin, isAuthed, isDeveloper } from 'utils/auth';
import styles from './Breadcrumb.less';

const DEFAULT_ROUTES = ['index', 'confIndex'];
const Breadcrumb = props => {
  // const [history, setHistory] = useState();
  const {
    actionActive = false,
    show_action = false,
    routes = DEFAULT_ROUTES,
    getConfInfo = '',
  } = props;
  const { onClickAction, dispatch } = props;
  const { user } = props;

  const jumpToCreate = () => {
    if (!isLogin(user)) {
      dispatch({ type: 'modal/login' });
      return;
    }
    history.push(`/conf/create`);
  };
  const JumpToAnotherPage = (value, index) => {
    if (index === routes.length - 1) {
      return;
    }
    if (typeof value === 'object') {
      history.push(value.path);
    } else {
      history.push(value({ conf_id: getConfInfo }).path);
    }
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.content}>
        <div className={styles.history}>
          {/* <span
            className={styles.otherHistory}
            onClick={JumpToAnotherPage.bind(null, breadCrumb['index'])}
          >
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-homepage" />
            </svg>
            <FM id="aminer.conf.crumb.index" defaultMessage="首页" />
          </span> */}
          {routes.map((route, index) => {
            return (
              <span key={index} className={styles.outBlock}>
                {index !== 0 && <span className={styles.split} />}
                <span
                  className={classnames(styles.otherHistory, {
                    [styles.currentPosition]: index === routes.length - 1,
                  })}
                  onClick={JumpToAnotherPage.bind(null, breadCrumb[route], index)}
                >
                  {typeof breadCrumb[route] === 'object' ? (
                    <FM id={breadCrumb[route].title} />
                  ) : (
                      <FM id={`${breadCrumb[route]({ conf_id: getConfInfo }).title}`} />
                    )}
                  {/* <FM id={breadCrumb[route]({ conf_id: getConfInfo.short_name }).title} /> */}
                </span>
              </span>
            );
          })}
        </div>
        <div className={classnames(styles.rightZone, { [styles.active]: actionActive })}>
          {/* show_action isDeveloper(user) */}
          {show_action && (
            <div onClick={jumpToCreate} className={styles.addBtn}>
              +
            </div>
          )}
          {show_action && (
            <div onClick={onClickAction} className={classnames(styles.action, 'desktop_device')}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-caozuo" />
              </svg>
              {!actionActive ? (
                <FM id="aminer.nav.action.start" defaultMessage="操作" />
              ) : (
                  <FM id="aminer.nav.action.end" defaultMessage="完成" />
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page(connect(({ auth }) => ({ user: auth.user, roles: auth.roles })))(Breadcrumb);

const breadCrumb = {
  // index: { tilte: 'aminer.conf.crumb.index', path: '/' },
  confIndex: { title: 'aminer.conf.crumb.confIndex', path: '/conf' },
  create: { title: 'aminer.conf.crumb.create', path: '/conf/create' },
  download: { title: '下载', path: '/' },
  confInfo: ({ conf_id }) => {
    return { title: (conf_id && conf_id.toUpperCase()) || '会议详情', path: `/conf/${conf_id}` };
  },
  org: { title: 'aminer.conf.crumb.org' },
  videos: ({ conf_id }) => {
    return { title: 'aminer.conf.crumb.videos', path: `/conf/${conf_id}/videos` };
  },
  video: { title: 'aminer.conf.crumb.video' },
};
