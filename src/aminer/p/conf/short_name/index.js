import React, { useEffect, useState } from 'react';
import { page, connect, history, withRouter } from 'acore';
import { Tabs, BackTop, Tooltip, Button, message } from 'antd';
import { classnames } from 'utils';
import { formatMessage, FM } from 'locales';
import PropTypes from 'prop-types';
import { isLogin, isAuthed } from 'utils/auth';
import { Layout } from 'aminer/layouts';
import cookies from 'utils/cookie';
import { AutoForm } from 'amg/ui/form';
import { PaperAnalysis } from 'aminer/components/common';
import { Statistics, SetOrGetViews, Papers, Authors, Comments, Breadcrumb, Videos, Contact } from '../c';
import Like from '../Like';
import Recommend from '../Recommend';
import Report from '../Report';
import HomePage from '../HomePage';
import PaperHomePage from '../PaperHomePage';
import InvitedTalk from '../InvitedTalk';
import { ChineseAuthors, ChineseStudent } from '../c';
import * as confUtils from '../c/utils/utils';
import styles from './index.less';

const { TabPane } = Tabs;
const ConfInfoPage = props => {
  // const [confInfo, setConfInfo] = useState();
  const [activeKey, setActiveKey] = useState();
  const [viewed, setViewed] = useState();
  // clickedPid 高亮论文块
  // const [clickedPid, setClickedPid] = useState();
  const { confInfo, user, roles, clickedPid } = props;
  const { dispatch, match } = props;
  const {
    params: { type, short_name },
  } = match;

  const { rightConfig, navigatorConfig } = props;

  const naviConfig = (confInfo && confInfo.config && confInfo.config.navigator) || navigatorConfig;
  useEffect(() => {
    if (type && type !== '') {
      setActiveKey(type);
    } else {
      setActiveKey(naviConfig[0]);
    }
  }, [naviConfig]);

  useEffect(() => {
    if (!confInfo || (confInfo && confInfo.short_name !== short_name)) {
      const shortLength = short_name.length;
      dispatch({
        type: 'aminerConf/getConfList',
        payload: {
          offset: 0,
          size: 1,
          short_name,
          needReturn: false,
        },
      }).then(data => {
        if (data) {
          const { id } = (data.items && data.items[0]) || {};
          dispatch({
            type: 'aminerConf/getConfBaseData',
            payload: {
              timeTalePayload: { id },
              viewPayload: { conf_id: id, offset: 0, size: 10 },
              keywordsPayload: { id, offset: 0, size: 100 },
              searchAuthorsPayload: { conf_id: id, offset: 0, size: 10, shortSchema: true },
              searchPubsPayload: { conf_id: id, offset: 0, size: 20, sort: 'view' },
              coverage: true,
            },
          });
        }
      });
    }
  }, [short_name]);

  const tempRightTabConfig =
    confInfo && confInfo.config && confInfo.config.right ? confInfo.config.right : rightConfig;

  useEffect(() => {
    if (confInfo) {
      dispatch({
        type: 'aminerConf/setOrGetClickView',
        payload: { type: 'getClick', id: confInfo.id },
      }).then(result => {
        setViewed(result);
      });
    }
  }, [confInfo]);

  useEffect(() => {
    return () => {
      cookies.delCookie('conf');
      dispatch({ type: 'aminerConf/clearFilters' });
      dispatch({
        type: 'aminerConf/updateStateByKey',
        payload: { searchQuery: null, clickedPid: '' },
      });
    };
  }, []);

  useEffect(() => {
    if (type !== undefined) {
      setActiveKey(type);
    }
  }, [type]);

  const callback = key => {
    dispatch({
      type: 'aminerConf/setSysTrack',
      payload: {
        type: 'conf_system',
        target_type: confInfo.short_name,
        target_name: key,
      },
    });
    if (key === 'ai2000') {
      // TODO: 新窗口打开
      window.open('https://www.aminer.cn/ai2000/ml/iclr2020');
    }
    if (key === 'more_conf') {
      window.location.href = '/conf';
    }
    // 清空所有的filters
    dispatch({ type: 'aminerConf/clearFilters' });
    dispatch({ type: 'aminerConf/updateStateByKey', payload: { searchQuery: null } });
    dispatch({ type: 'aminerConf/updateStateByKey', payload: { clickedPid: '' } });
    if (key !== 'ai2000') {
      history.push(`/conf/${confInfo.short_name}/${key}`);
    }
    // SetOrGetViews('click', dispatch, confInfo.id);
  };

  const onChangeRightTab = key =>
    dispatch({ type: 'aminerConf/updateStateByKey', payload: { clickedPid: key } });

  const showPaperAnalysis = () => clickedPid && clickedPid.length === 24;

  const RunCache = () => {
    dispatch({
      type: 'aminerConf/RunCache',
      payload: { conf_id: confInfo.id, op: [0] },
    });
  };

  const SubmitRosterId = ({ roster_ids }, { setSubmitting }) => {
    setSubmitting(false);
    if (roster_ids) {
      const payload = {
        id: confInfo.id,
        eid: roster_ids.split(/[,，；;.。]/g),
      };
      // if (sche_id) {
      //   payload.sid = sche_id;
      // }
      dispatch({
        type: 'aminerConf/UpdateConf',
        payload,
      }).then(res => {
        if (res) {
          message.success('add roster success');
          dispatch({ type: 'modal/close' });
        } else {
          message.error('error');
        }
      });
    }
  };

  const updateConfPubs = type => {
    dispatch({
      type: 'modal/open',
      payload: {
        title: `Conf ${type} Pubs`,
        extraArticleStyle: { padding: '20px' },
        content: (
          <div style={{ maxHeight: '50vh' }}>
            <AutoForm
              config={[
                {
                  name: 'roster_ids',
                  label: '智库id',
                  type: 'textarea',
                  autoSize: true,
                  placeholder: '第一个是华人学者，第二是一作华人学生，id之间请用逗号分隔',
                },
              ]}
              data={{ roster_ids: '' }}
              onSubmit={SubmitRosterId}
              showReset={false}
            />
          </div>
        ),
      },
    });
  };

  return (
    <Layout
      rootClassName="shortNameIndex"
      pageUniqueTitle={
        (confInfo && confInfo.config && confInfo.config.tdk.pageTitle) ||
        formatMessage({
          id: `aminer.conf.iclr.pageTitle`,
        })
      }
      pageDesc={
        (confInfo && confInfo.config && confInfo.config.tdk.pageDesc) ||
        formatMessage({
          id: `aminer.conf.iclr.pageDesc`,
        })
      }
      pageKeywords={
        (confInfo && confInfo.config && confInfo.config.tdk.pageKeywords) ||
        formatMessage({
          id: `aminer.conf.iclr.pageKeywords`,
        })
      }
      pageHeaderFixed
    >
      {confInfo && confInfo.config && confInfo.config.breadcrumb && (
        <Breadcrumb
          routes={['confIndex', 'confInfo']}
          getConfInfo={confInfo && confInfo.short_name}
        />
      )}
      <div className={styles.containCrumb}>
        <h1 style={{ display: 'none' }}>{`${(confInfo && confInfo.short_name) ||
          'ICLR2020'}|国际学习表征会议|AMiner`}</h1>
        {confInfo && (
          <div>
            <div
              className="confHeader"
              style={{
                backgroundImage: 'url(https://originalfileserver.aminer.cn/data/conf/conf_bg.jpg)',
              }}
              alt={`${confInfo.short_name}|国际学习表征会议|AMiner`}
            >
              <div className="homepage">
                <div className="content">
                  <div className="short_name">
                    {confInfo.short_name && confInfo.short_name.toUpperCase()}
                  </div>
                  <div className="full_name">{confInfo.full_name}</div>
                  <div className="date">
                    {`${confUtils.formatTime(
                      confInfo.begin_date,
                      'MM.dd',
                    )} - ${confUtils.formatTime(confInfo.end_date, 'MM.dd')}`}
                  </div>
                  <div className="url">
                    <a
                      href={confInfo.url}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      onClick={() => SetOrGetViews('click', dispatch, confInfo.id)}
                    >
                      <FM id="aminer.conf.HomePage.webSite" />
                      {confInfo.url}
                    </a>
                  </div>
                </div>
              </div>
              <div className="viewed">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-icon-test" />
                </svg>
                <span className="viewed_num">{viewed}</span>
              </div>
            </div>

            <div className="ConfInfo">
              <Tabs
                activeKey={activeKey}
                onChange={callback}
                animated={false}
                tabBarStyle={{ backgroundColor: '#f3f3f3' }}
              >
                {naviConfig.map((k, index) => {
                  if (tabJson[k].tab === 'ai2000') {
                    return (
                      <TabPane
                        tab={
                          <Tooltip title="ICLR Most Influential Scholars of Chinese Descent & ICLR Top Cited Pubs">
                            {formatMessage({ id: `aminer.conf.tab.${tabJson[k].tab}` })}
                          </Tooltip>
                        }
                        key={k}
                      />
                    );
                  }
                  if (confInfo.short_name === 'iclr2020' && k === 'papers') {
                    return (
                      <TabPane tab={formatMessage({ id: `aminer.conf.tab.HomePage` })} key={k} />
                    );
                  }
                  return (
                    <TabPane
                      tab={formatMessage({ id: `aminer.conf.tab.${tabJson[k].tab}` })}
                      key={k}
                    />
                  );
                })}
              </Tabs>
              {/*TODO: 只有管理员可以看见  */}
              {isLogin(user) && isAuthed(roles) && (
                <div className="adminBtn">
                  <Button
                    className="annotationArea"
                    loading={props.runCacheLoading}
                    onClick={RunCache}
                  >
                    刷新页面所有缓存
                </Button>
                  {/* UpdateConf */}
                  <Button className="annotationArea" onClick={updateConfPubs}>添加智库</Button>
                </div>
              )}
              {tabJson[activeKey] && typeof tabJson[activeKey].content === 'function' && (
                <div className="threeBlock">
                  {tabJson[activeKey].content({
                    confInfo,
                    user,
                    roles,
                    activeKey,
                  })}

                  {tempRightTabConfig &&
                    tempRightTabConfig.length !== 0 &&
                    activeKey !== 'homepage' && (
                      <div
                        className={classnames('desktop_device statsBlock', {
                          activePub: showPaperAnalysis(),
                          marginTop60: activeKey === 'papers',
                        })}
                      >
                        <Tabs
                          onChange={onChangeRightTab}
                          activeKey={
                            showPaperAnalysis() ||
                              tempRightTabConfig[0] === 'insight' ||
                              clickedPid === 'insight'
                              ? 'insight'
                              : 'statistics'
                          }
                          animated={false}
                        >
                          {tempRightTabConfig &&
                            tempRightTabConfig.map(right => {
                              if (right === 'insight' && tabJson[activeKey].hideInsight) {
                                return '';
                              }
                              return (
                                <TabPane
                                  tab={
                                    <div className="statistics_legend">
                                      <svg className="icon" aria-hidden="true">
                                        <use xlinkHref={`#${rightTab[right].icon}`} />
                                      </svg>
                                      <FM id={`aminer.conf.basicForm.${right}`} />
                                    </div>
                                  }
                                  key={right}
                                >
                                  {right === 'insight'
                                    ? !tabJson[activeKey].hideInsight &&
                                    rightTab[right].content({
                                      confInfo,
                                      SetOrGetViews,
                                      id: clickedPid,
                                    })
                                    : rightTab[right].content({ confInfo, SetOrGetViews })}
                                </TabPane>
                              );
                            })}
                        </Tabs>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <BackTop />
    </Layout>
  );
};

ConfInfoPage.getInitialProps = async ({ store, match, isServer }) => {
  if (!isServer) {
    return;
  }
  const { short_name } = match.params || {};
  if (short_name) {
    await store.dispatch({ type: 'aminerConf/clearGetInitialDataclearGetInitialData' });
    await store
      .dispatch({
        type: 'aminerConf/getConfList',
        payload: {
          offset: 0,
          size: 1,
          short_name,
          needReturn: false,
        },
      })
      .then(async data => {
        // TODO: 存储confInfo 信息
        if (data) {
          const { id } = (data.items && data.items[0]) || {};
          await store.dispatch({
            type: 'aminerConf/getConfBaseData',
            payload: {
              timeTalePayload: { id },
              viewPayload: { conf_id: id, offset: 0, size: 10 },
              keywordsPayload: { id, offset: 0, size: 100 },
              searchAuthorsPayload: { conf_id: id, offset: 0, size: 10, shortSchema: true },
              searchPubsPayload: { conf_id: id, offset: 0, size: 20, sort: 'view' },
              coverage: true,
            },
          });
        }
        // cookies.setCookie('conf', JSON.stringify(data[0]));
      });
  }
  const { aminerConf } = store.getState();
  const { confInfo, timeTable, SearchPubsData, MostViewPubsData, KeywordsList, SearchAuthorsData } =
    aminerConf || {};
  return {
    aminerConf: {
      confInfo,
      timeTable,
      SearchPubsData,
      MostViewPubsData,
      KeywordsList,
      SearchAuthorsData,
    },
  };
};

ConfInfoPage.propTypes = {
  navigatorConfig: PropTypes.array,
  rightConfig: PropTypes.array,
};

ConfInfoPage.defaultProps = {
  // TODO: 默认没有homepage
  navigatorConfig: [
    'papers',
    'recommend',
    'invited_talk',
    'news',
    'roster',
    'relation',
    'like',
    'comments',
    'ai2000',
  ],
  rightConfig: ['statistics', 'insight'],
};
export default page(
  withRouter,
  connect(({ auth, aminerConf, loading }) => ({
    user: auth.user,
    roles: auth.roles,
    clickedPid: aminerConf.clickedPid,
    confInfo: aminerConf.confInfo,
    runCacheLoading: loading.effects['aminerConf/RunCache'],
  })),
)(ConfInfoPage);

const PapersFunc = params => <Papers {...params} />;
const AuthorsFunc = params => <Authors {...params} />;

const tabJson = {
  // { tab: 'Schedule', key: 'schedule', content: ((params) => { return <Schedule {...params} /> }) },
  // statistics: {
  //   tab: 'statistics',
  //   key: '',
  //   content: params => <div {...params}>123</div>,
  // },
  homepage: {
    tab: 'HomePage',
    content: params => <HomePage {...params} />,
  },
  papers: {
    tab: 'Papers',
    content: params => <PaperHomePage {...params} type="paper" />,
  },
  recommend: {
    tab: 'Recommend',
    content: params => <Recommend {...params} />,
  },
  invited_talk: {
    tab: 'InvitedTalk',
    hideInsight: true,
    content: params => <InvitedTalk {...params} />,
  },
  news: {
    tab: 'News',
    hideInsight: true,
    content: params => <Report {...params} dataType="paper" />,
  },
  videos: {
    tab: 'Videos',
    hideInsight: true,
    content: params => <Videos {...params} dataType="paper" />,
  },
  roster: {
    tab: 'roster',
    // content: params => <Roster {...params} />,
    content: params => (
      <PaperHomePage
        {...params}
        hideSearch
        hideMostViewAndLike
        hiddenInLeftAuthors={[]}
        type="roster"
        middleTabJson={[
          {
            tab: 'chinese-scholar',
            icon: 'icon-head-01',
            content: params => <ChineseAuthors {...params} />,
          },
          {
            tab: 'chinese-first',
            icon: 'icon-w_xuesheng-',
            content: params => <ChineseStudent {...params} />,
          },
        ]}
      />
    ),
  },

  relation: {
    tab: 'Relation',
    hideInsight: true,
    content: params => {
      const { confInfo } = params;
      return (
        <div className={styles.relation} style={{ minHeight: '500px' }}>
          <iframe
            src={`https://relation.aminer.cn/?query=${confInfo.relation_id}`}
            height="100%"
            width="100%"
          />
        </div>
      );
    },
  },
  like: {
    tab: 'Like',
    content: params => <Like {...params} />,
  },
  comments: {
    tab: 'Comments',
    hideInsight: true,
    content: params => <Comments {...params} />,
  },
  contact: {
    tab: 'Contact',
    hideInsight: true,
    content: params => <Contact {...params} />,
  },

  // workshop: {
  //   tab: 'Workshop',
  //   key: 'workshop',
  //   hideInsight: true,
  //   content: params => <Workshop {...params} />,
  // },

  // {
  //   tab: 'Papers',
  //   key: 'papers',
  //   content: params => {
  //     return <PaperAndAuthorComponent {...params} ChildrenComp={PapersFunc} />;
  //   },
  // },
  // {
  //   tab: 'Authors',
  //   key: 'authors',
  //   content: params => {
  //     return <PaperAndAuthorComponent {...params} ChildrenComp={AuthorsFunc} />;
  //   },
  // },

  // favorite: {
  //   tab: 'Favorite',
  //   key: 'favorite',
  //   content: params => <Favorite {...params} />,
  // },
  // TODO:直接显示在右侧
  // { tab: 'Statistics', key: 'statistics', content: ((params) => { return <Statistics {...params} /> }) },
  ai2000: { tab: 'ai2000', key: 'ai2000', content: null },
};

const rightTab = {
  statistics: {
    icon: 'icon-tubiao',
    content: params => <Statistics {...params} />,
  },
  insight: {
    icon: 'icon-dushu',
    content: params => <PaperAnalysis size="small" pdfInfo={{}} {...params} />,
  },
};
// { tab: 'More Conf', key: 'more_conf', content: null }
