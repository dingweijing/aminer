import React, { useEffect, useState } from 'react';
import { page, connect, Link, routerRedux } from 'acore';
import { classnames } from 'utils';
import { Layout } from 'aminer/layouts';
import { Spin } from 'aminer/components/ui';
import cookies from 'utils/cookie';
import { Pagination } from 'antd';
import { formatMessage } from 'locales';
import { isLogin, isAuthed } from 'utils/auth';
import { ConfListRightZone, Breadcrumb, ConfirmModal, SetOrGetViews } from './c';
import UpdateConfInfo from './UpdateConfInfo';
import styles from './index.less';

const SIZEPERPAGE = 10;
const Conf = props => {
  const [result, setResult] = useState();
  const [total, setTotal] = useState();
  const [current, setCurrent] = useState(1);
  const [showAction, setShowAction] = useState(false);
  const { dispatch, user, roles, loading, confList } = props;

  const getConf = currentPage => {
    dispatch({
      type: 'aminerConf/getConfList',
      payload: { offset: (currentPage - 1) * SIZEPERPAGE, size: SIZEPERPAGE, setView: true },
    }).then(() => {
      setCurrent(currentPage);
    });
  };
  useEffect(() => {
    if (!confList) {
      getConf(current);
    }
  }, []);

  useEffect(() => {
    if (confList) {
      if (!total || total < 0) {
        setTotal(confList.total);
      }
      setResult(confList.items);
    }
  }, [confList]);

  const setConfInfoToStorage = conf => {
    new Promise((resolve, reject) => {
      resolve(SetOrGetViews('click', dispatch, conf.id));
    }).then(() => {
      window.open(`/conf/${conf.short_name}`, '_blank');
    });
  };

  const formatTime = time => new Date(time).format('MM.dd,yyyy');

  const onClickAction = () => {
    if (!isLogin(user)) {
      dispatch({ type: 'modal/login' });
      return;
    }
    setShowAction(!showAction);
  };
  return (
    <Layout
      pageUniqueTitle={formatMessage({
        id: `aminer.conf.index.pageTitle`,
      })}
      pageDesc={formatMessage({
        id: `aminer.conf.index.pageDesc`,
      })}
      pageKeywords={formatMessage({
        id: `aminer.conf.index.pageKeywords`,
      })}
    >
      <ConfirmModal />
      <h1 style={{ display: 'none' }}>AMiner - 国际大数据生物信息学医学 - 学术国际会议</h1>
      <div className={styles.confList}>
        <Breadcrumb
          show_action
          actionActive={showAction}
          routes={['confIndex']}
          onClickAction={onClickAction}
        />
        <article id="search_body" className={styles.article}>
          {/* <div className={styles.header}>
            <Button onClick={jumpToCreate}>
              <FM id="conf.create.legend" defaultMessage='创建会议' />
            </Button>
          </div> */}
          <Spin loading={loading} />
          {result &&
            result.length > 0 &&
            result.map(conf => {
              // TODO: 创建者自己能看到私有的conf和删除
              if (!isLogin(user) && !conf.is_public) {
                return;
              }
              /* eslint-disable consistent-return */
              return (
                <div
                  className={classnames(styles.conf, {
                    [styles.showActionConf]:
                      showAction && isLogin(user) && (isAuthed(roles) || conf.uid === user.id),
                  })}
                  key={conf.id}
                >
                  <div className={styles.logo}>
                    <a
                      title={conf.short_name}
                      // href={`/conf/${conf.short_name}`}
                      onClick={setConfInfoToStorage.bind(null, conf)}
                    >
                      <img src={conf.logo} alt={conf.short_name} />
                    </a>
                  </div>
                  <div className={styles.rightZone}>
                    <div className={styles.basicInfo}>
                      <div className={styles.title}>
                        <h2 style={{ display: 'none' }}>{conf.short_name}</h2>
                        <a
                          // href={`/conf/${conf.short_name}`}
                          title={conf.short_name}
                          onClick={setConfInfoToStorage.bind(null, conf)}
                        >
                          {conf.full_name}
                        </a>
                      </div>
                      <div className={styles.info}>
                        {(conf.begin_date || conf.end_date) && (
                          <span>
                            <svg className="icon" aria-hidden="true">
                              <use xlinkHref="#icon-time1" />
                            </svg>
                            <span>{formatTime(conf.begin_date)}</span>
                            {conf.begin_date && conf.end_date && <span> - </span>}
                            <span>{formatTime(conf.end_date)}</span>
                          </span>
                        )}
                        <span>
                          <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#icon-position1" />
                          </svg>
                          {conf.address}
                        </span>
                      </div>
                      <div className={styles.desc}>{conf.introduce}</div>
                      <div className={styles.footer}>
                        {!!conf.paper_count && (
                          <span className={styles.paperCount}>
                            <svg className="icon" aria-hidden="true">
                              <use xlinkHref="#icon-publications" />
                            </svg>
                            {conf.paper_count}
                          </span>
                        )}
                        <span>
                          <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#icon-eye" />
                          </svg>
                          {conf.view}
                        </span>
                        {conf.url && (
                          <span className={styles.url}>
                            <a
                              href={conf.url}
                              title={conf.url}
                              className={styles.urlIcon}
                              target="_blank"
                            >
                              <svg className="icon" aria-hidden="true">
                                <use xlinkHref="#icon-global" />
                              </svg>
                              <span className={classnames('desktop_device', styles.urlText)}>
                                {conf.url}
                              </span>
                            </a>
                          </span>
                        )}
                      </div>
                    </div>
                    {showAction && isLogin(user) && (isAuthed(roles) || conf.uid === user.id) && (
                      <ConfListRightZone
                        conf={conf}
                        user={user}
                        roles={roles}
                        total={total}
                        UpdateConfInfo={params => <UpdateConfInfo {...params} />}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          {result && total > SIZEPERPAGE && (
            <Pagination
              className={styles.pagination}
              defaultCurrent={1}
              current={current}
              total={total}
              pageSize={SIZEPERPAGE}
              onChange={curr => getConf(curr)}
            />
          )}
        </article>
      </div>
    </Layout>
  );
};

Conf.getInitialProps = async ({ store, route, isServer, location, res, req }) => {
  if (!isServer) return;
  await store.dispatch({
    type: 'aminerConf/getConfList',
    payload: { offset: 0, size: SIZEPERPAGE, setView: true },
  });
  const { aminerConf } = store.getState();
  const { confList } = aminerConf || {};
  return { aminerConf: { confList } };
};

export default page(
  connect(({ auth, loading, aminerConf }) => ({
    user: auth.user,
    roles: auth.roles,
    loading: loading.effects['aminerConf/getConfList'],
    confList: aminerConf.confList,
  })),
)(Conf);
