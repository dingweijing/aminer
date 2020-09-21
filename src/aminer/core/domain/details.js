import React, { useEffect, useMemo, useState, useRef, Fragment } from 'react';
import { Radio, message, Tabs, Input } from 'antd';
import { FM, formatMessage, zhCN } from 'locales';
import moment from 'moment';

import { getProfileUrl } from 'utils/profile-utils';
import { getSearchPathname, getSearchPathname2 } from 'utils/search-utils';
import { SmallCard } from 'aminer/core/search/c/widgets';
import { ExpertLink } from 'aminer/components/widgets';
import smallcard from 'helper/smallcard';
import helper, { getLangLabel } from 'helper';
import { page, connect, history, Link } from 'acore';
import { Layout } from 'aminer/layouts';
import { Loading } from 'components/ui';
import { loadD3v3, loadNvd3, loadECharts4 } from 'utils/requirejs';
import { AdvanceSearchBox } from 'aminer/core/search/c/control';
import { setUserTrack } from 'utils/aminer-common';
import { sysconfig } from 'systems';
import { TimeRank, OverviewRrank, AuthorRank, VenuesRank, PaperRank, RankSorts } from './c';
import { classnames } from 'utils';

import styles from './details.less';
import './nv.d3.less';

let d3;
let nv;
let paperTrendEle;
let card;
let timer;
const paperTrendCut = 0.95; // paperTrend 数据修剪
const rankOverviewSize = 15;
const { TabPane } = Tabs;
const { Search } = Input;

const DetailsPage = props => {
  const {
    dispatch,
    loading,
    topRankLoading,
    domainInfo,
    keywordTrend,
    paperTrend,
    hotTopics,
    topRank,
    topPaper,
    topAuthor,
  } = props;

  const [rankTabKey, setRankTabKey] = useState('overview');
  const [topRankTime, setTopRankTime] = useState('all');
  const [topRankSort, setTopRankSort] = useState('hindex');

  const smallCard = useRef();

  const { domainId } = helper.parseMatchesParam(props, {}, ['domainId']);
  // TODO check domainId 是否合法
  const sids = [domainId - 0];
  const paperTrendEleId = `paper_trend_${domainId}`;
  const keywordTrendEleId = `keyword_trend_${domainId}`;
  const statsGraphHeight = 230;
  const tabs = ['overview', 'author', 'paper', 'venues'];
  const thisYear = useMemo(() => moment().format('YYYY'));

  const loadViz = () => {
    loadD3v3(ret => {
      d3 = ret;
      if (d3 && keywordTrend) {
        loadNvd3(nvd3 => {
          nv = nvd3;

          let chart;
          nv.addGraph(() => {
            chart = nv.models
              .stackedAreaChart()
              .height(statsGraphHeight)
              .x(d => d[0])
              .y(d => d[1] || 0)
              .showControls(false)
              .style('stream-center')
              .showXAxis(true)
              .showYAxis(false)
              .interpolate('basis')
              .showLegend(true)
              .interactive(false)
              .margin({ left: 25, right: 25, top: 0, bottom: 30 });
            chart.yAxis.tickFormat();

            d3.select(`#${keywordTrendEleId}`).datum(keywordTrend).transition().call(chart);

            nv.utils.windowResize(chart.update);
            return chart;
          });
        });
      }
    });
  };

  const drawPaperTrend = option => {
    loadECharts4(echarts => {
      paperTrendEle = echarts.init(document.getElementById(paperTrendEleId));
      paperTrendEle.setOption(option);
    });
  };

  const getDomainInfoAndKeywordTrend = () => {
    dispatch({
      type: 'domain/getDomainInfoAndKeywordTrend',
      payload: { sids },
    });
  };

  const getDomainPaperTrend = () => {
    dispatch({
      type: 'domain/getDomainPaperTrend',
      payload: { sids },
    });
  };

  const getDomainHotTopicAndTopRank = () => {
    dispatch({
      type: 'domain/getDomainHotTopicAndTopRank',
      payload: { sids },
    });
  };

  const getDomainTopPaper = params => {
    dispatch({
      type: 'domain/getDomainTopPaper',
      payload: { domain: domainId, ...params },
    });
  };

  const getTopAuthorsOfDomain = ({ time = topRankTime, matric = topRankSort }) => {
    const params = {};

    params.byTime = 'all_time';
    if (time === 'recent') {
      params.byTime = 'recent';
    }

    params.byMetric = 'h-index';
    if (matric === 'citation') {
      params.byMetric = 'citation_count';
    } else if (matric === 'pubs') {
      params.byMetric = 'paper_count';
    }

    dispatch({
      type: 'domain/getTopAuthorsOfDomain',
      payload: { sids, ...params },
    });
  };

  const onTopRankTimeChange = e => {
    const value = e.target.value;
    setTopRankTime(value);
    getTopAuthorsOfDomain({ time: value });

    const params = {};
    if (value === 'recent') {
      params.time = `${thisYear - 5}-${thisYear}`;
    }
    getDomainTopPaper(params);
  };

  const onTopRankSortChange = value => {
    setTopRankSort(value);
    getTopAuthorsOfDomain({ matric: value });
  };

  const onSearchSubmit = ({ selectedDomains: domain, query }) => {
    if ((!domain || !domain.length) && !query) {
      return message.info(formatMessage({ id: 'com.KgSearchBox.placeholder' }));
    }
    // 从搜索条件里构造新的 url 并跳转
    window.location.href = getSearchPathname2(query, {}, domain, 'pub');
  };

  const searchTopic = (e, topic) => {
    // e.preventDefault();
    const url = getSearchPathname2(topic, {}, [domainId], 'pub');
    window.open(url, '_blank');
  };

  const goToHome = () => {
    history.push(`/channel`);
  };

  // const infocardShow = (personId) => {
  //   if (card) {
  //     const target = document.querySelector(`#sid_${personId}`);
  //     card.show(target, personId);
  //   }
  //   if (smallCard.current) {
  //     smallCard.current.cancelHide();
  //     timer = setTimeout(() => {
  //       smallCard.current.getData();
  //     }, 0);
  //   }
  // };

  // const infocardHide = () => {
  //   if (timer) {
  //     clearTimeout(timer);
  //   }
  //   if (smallCard.current) {
  //     smallCard.current.tryHideCard();
  //   }
  // };

  const onRef = cardref => {
    smallCard.current = cardref;
  };

  const renderTabBar = (props, DefaultTabBar) => {
    return (
      <div className={classnames('tabWrap')}>
        <DefaultTabBar {...props} className={styles.searchPageTab} />
      </div>
    );
  };

  const onPaperSearch = value => {
    window.open(`${window.location.origin}/search/pub?domain=${domainId}&q=${value}`, '_blank');
  };

  const getDisplayName = () => {
    if (domainInfo) {
      if (domainInfo.display_name) {
        return getLangLabel(domainInfo.display_name.en, domainInfo.display_name.cn);
      }
      return domainInfo.name || '';
    }
    return '';
  };

  const getZhWithEn = () => {
    const isZh = sysconfig.Locale === zhCN;
    if (domainInfo) {
      if (domainInfo.display_name) {
        const { en, cn } = domainInfo.display_name;
        if (isZh) {
          return (
            <Fragment>
              {cn && <div className={styles.displayNameZh}>{cn}</div>}
              {en && <div className={styles.displayNameEn}>{en}</div>}
            </Fragment>
          );
        }
        return <div>{en || cn || ''}</div>;
      }
      return domainInfo.name || '';
    }
    return '';
  };

  useEffect(() => {
    if (!domainInfo) {
      getDomainInfoAndKeywordTrend();
    }
    getDomainPaperTrend();
    getDomainHotTopicAndTopRank();
    getDomainTopPaper();
    getTopAuthorsOfDomain({});

    card = smallcard.init('channelAuthor');
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  useEffect(() => {
    window.onresize = () => {
      paperTrendEle && paperTrendEle.resize(); // echarts重新加载更新
    };
  });

  useEffect(() => {
    const payload = {
      id: domainId,
      name: domainInfo && domainInfo.display_name && domainInfo.display_name.en,
    };
    setUserTrack(dispatch, {
      type: 'aminer.channel',
      target_type: 'detail',
      payload: JSON.stringify(payload),
    });
  }, [domainId]);

  useEffect(() => {
    if (keywordTrend) {
      loadViz();
    }
  }, [keywordTrend]);

  useEffect(() => {
    if (paperTrend && paperTrend.length) {
      // 修剪数据
      const countTotal = paperTrend.reduce((prev, cur) => (prev += cur.count), 0);
      const newCountTotal = countTotal * paperTrendCut,
        newPaperTrend = [];
      let tmpCountTotal = 0;
      for (let i = paperTrend.length - 1; i >= 0; i--) {
        tmpCountTotal += paperTrend[i].count;
        newPaperTrend.push(paperTrend[i]);
        if (tmpCountTotal >= newCountTotal) break;
      }
      newPaperTrend.reverse();

      const xAxisData = newPaperTrend.map(item => item.year);
      const seriesData = newPaperTrend.map(item => item.count);
      const option = {
        xAxis: {
          type: 'category',
          data: xAxisData,
        },
        grid: { left: 70, right: 20, top: 20, bottom: 30 },
        yAxis: {
          type: 'value',
        },
        tooltip: {
          trigger: 'axis',
        },
        series: [
          {
            data: seriesData,
            type: 'line',
          },
        ],
      };
      drawPaperTrend(option);
    }
  }, [paperTrend]);

  // useEffect(() => {
  //   if (rankTabKey === 'paper') {
  //     const params = {};
  //     if (topRankTime === 'recent') {
  //       params.time = `${thisYear - 5}-${thisYear}`;
  //     }
  //     getDomainTopPaper(params)
  //   }
  // }, [rankTabKey, topRankTime])

  const {
    topAuthorRankOverview,
    topAuthorRankAll,
    topConfRankOverview,
    topConfRankAll,
  } = useMemo(() => {
    const topAuthorAndTopConf = {
      topAuthorRankOverview: null,
      topAuthorRankAll: null,
      topConfRankOverview: null,
      topConfRankAll: null,
    };
    if (topRank) {
      let topConfRankAll = topRank[`${topRankTime}TimeJconf`];
      topAuthorAndTopConf.topConfRankAll = topConfRankAll;
      topAuthorAndTopConf.topConfRankOverview = topConfRankAll.slice(0, rankOverviewSize);
    }
    if (topAuthor) {
      topAuthorAndTopConf.topAuthorRankAll = topAuthor;
      topAuthorAndTopConf.topAuthorRankOverview = topAuthor.slice(0, rankOverviewSize);
    }
    return topAuthorAndTopConf;
  }, [topRank, topRankTime, topAuthor]);

  const config = useMemo(
    () => ({
      overview: {
        key: 'overview',
        Component: OverviewRrank,
        title: <FM id="aminer.channel.tab.overview" defaultMessage="Overview" />,
      },
      author: {
        key: 'author',
        Component: AuthorRank,
        title: <FM id="aminer.channel.topAuthor" defaultMessage="Scholar Ranking" />,
      },
      venues: {
        key: 'venues',
        Component: VenuesRank,
        title: <FM id="aminer.channel.topVenues" defaultMessage="Journal / Conference Ranking" />,
      },
      paper: {
        key: 'paper',
        Component: PaperRank,
        title: <FM id="aminer.channel.topPaper" defaultMessage="Paper Ranking" />,
      },
    }),
    [],
  );

  const componentParams = useMemo(
    () => ({
      overview: {
        topAuthorRank: topAuthorRankOverview,
        topConfRank: topConfRankOverview,
        onClickAuthorMore: () => setRankTabKey('author'),
        onClickConfMore: () => setRankTabKey('venues'),
        // infocardHide,
        // infocardShow,
      },
      author: {
        topAuthorRank: topAuthorRankAll,
        // infocardHide,
        // infocardShow,
        onClickOverview: () => setRankTabKey('overview'),
      },
      venues: {
        topConfRank: topConfRankAll,
        onClickOverview: () => setRankTabKey('overview'),
      },
      paper: {
        topPaper: topPaper,
        onClickOverview: () => setRankTabKey('overview'),
      },
    }),
    [topAuthorRankOverview, topConfRankOverview, topAuthorRankAll, topConfRankAll, topPaper],
  );

  return (
    <Layout
      classNames={styles.layout}
      pageTitle={getDisplayName()}
      pageDesc={`${getDisplayName()} Channel 提供学科领域内历年论文数量的统计，顶级学者、期刊会议、文献和机构的排名，并提供学科内热门主题和研究趋势。`}
      pageKeywords={`${getDisplayName()}学科，${getDisplayName()}热门主题，${getDisplayName()}历年论文量，${getDisplayName()}顶级期刊，${getDisplayName()}顶级会议，${getDisplayName()}顶级学者，${getDisplayName()}顶级机构，${getDisplayName()}研究趋势`}
    >
      <article className={styles.article}>
        <section className={styles.content}>
          <div className={styles.loadingWrap}>
            {loading && <Loading fatherStyle={styles.loading} />}
          </div>
          <div className={styles.headerBar}>
            <div className="breadcrumb">
              <div className="history">
                <span className="homepage" onClick={goToHome}>
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-homepage" />
                  </svg>
                  <FM id="aminer.channel.crumb.index" />
                </span>
                <span className="split" />
                <span className="cur">{getDisplayName()}</span>
              </div>
              {/* <div className="view">浏览量: 1000</div> */}
            </div>
            <h1 className={styles.domainName}>{getZhWithEn()}</h1>
            {/* <div className={styles.searchBoxWrap}>
              <AdvanceSearchBox 
                className='search'
                advancedMode={false}
                searchBoxLeftZone={[]}
                onSearchSubmit={onSearchSubmit}
                initialParams={{ domain: domainId }}
              />
            </div> */}
          </div>
          <div className={styles.channelContent} id={`channelAuthor_ROOT`}>
            <SmallCard onRef={onRef} id="channelAuthor" />
            <div className={styles.topZone}>
              <div className={styles.paperSearchWrap}>
                <Search
                  placeholder={formatMessage({
                    id: 'aminer.channel.detail.search.placeholder',
                    defaultMessage: 'Input channel name',
                  })}
                  onSearch={onPaperSearch}
                  className={styles.paperSearch}
                />
              </div>
              <div className={styles.statsGraphs}>
                <div className={styles.graphWrap}>
                  <div className={styles.graphTitle}>
                    <FM id="aminer.channel.paperTrend" />
                  </div>
                  <div className={styles.statsGraph}>
                    <div id={paperTrendEleId} style={{ height: statsGraphHeight }}></div>
                  </div>
                </div>
                <div className={styles.graphWrap}>
                  <div className={styles.graphTitle}>
                    <FM id="aminer.channel.keywordTrend" />
                  </div>
                  <div className={styles.statsGraph}>
                    <svg id={keywordTrendEleId} style={{ height: statsGraphHeight }} />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.hotTopicsAndTopRank}>
              <div className={styles.hotTopicsWrap}>
                <div className={styles.hotTopics}>
                  <div className={styles.topicsHeader}>
                    <FM id="aminer.channel.hotTopics" />
                  </div>
                  <div className={styles.topicsContent}>
                    {hotTopics &&
                      !!hotTopics.length &&
                      hotTopics.map((topic, index) => {
                        let topicContent = `${index + 1}. ${topic.name} ( ${topic.count} ) `;
                        return (
                          <div
                            className={styles.topicItem}
                            key={`${topic.name}${index}`}
                            onClick={e => searchTopic(e, topic.name)}
                            title={topicContent}
                          >
                            {topicContent}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
              <div className={styles.topRanksWrap}>
                <Tabs
                  activeKey={rankTabKey}
                  onChange={setRankTabKey}
                  animated={false}
                  className={styles.topRanksTab}
                  renderTabBar={renderTabBar}
                  tabBarStyle={{ overflow: 'visible' }}
                  destroyInactiveTabPane
                >
                  {tabs &&
                    tabs.length > 0 &&
                    tabs.map((item, index) => {
                      const tab = config[item];
                      const { Component, title: tabTitle, key } = tab;
                      return (
                        <Tabs.TabPane key={key} tab={<h2>{tabTitle}</h2>}>
                          <div className={styles.componentContent}>
                            <div className={styles.filterAndSortZone}>
                              <TimeRank
                                onTopRankTimeChange={onTopRankTimeChange}
                                topRankTime={topRankTime}
                                topRankLoading={topRankLoading}
                              />
                              {rankTabKey === 'author' && (
                                <RankSorts
                                  onTopRankSortChange={onTopRankSortChange}
                                  topRankSort={topRankSort}
                                />
                              )}
                            </div>
                            <Component {...componentParams[item]} />
                          </div>
                        </Tabs.TabPane>
                      );
                    })}
                </Tabs>
              </div>
            </div>
          </div>
        </section>
      </article>
    </Layout>
  );
};

DetailsPage.getInitialProps = async ({ isServer, match, store, route }) => {
  if (!isServer) {
    return;
  }
  const { domainId } = match.params || {};
  if (domainId) {
    const sids = [domainId - 0];
    await store.dispatch({
      type: 'domain/getDomainInfoAndKeywordTrend',
      payload: { sids },
    });
  }

  const { domain } = store.getState();
  return { domain };
};

export default page(
  connect(({ loading, domain }) => ({
    loading: loading.effects['domain/getDomainInfo'],
    topRankLoading:
      loading.effects['domain/getDomainTopPaper'] ||
      loading.effects['domain/getTopAuthorsOfDomain'],
    domainInfo: domain.domainInfo,
    keywordTrend: domain.keywordTrend,
    paperTrend: domain.paperTrend,
    hotTopics: domain.hotTopics,
    topRank: domain.topRank,
    topPaper: domain.topPaper,
    topAuthor: domain.topAuthor,
  })),
)(DetailsPage);
