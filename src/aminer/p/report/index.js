import React, { Component } from 'react';
import { connect } from 'acore';
import { Spin } from 'antd';
import { Layout } from 'aminer/layouts';
import { classnames } from 'utils';
import { parseUrlParam, routeTo } from 'helper';
import { formatMessage } from 'locales';
import { Tooltip } from 'antd';
import qs from 'qs';
import ArticleList from './c/ArticleList';
import RankList from './c/RankList';
import SearchArticle from './c/SearchArticle';
import Advertising from './c/Advertising';
import styles from './index.less';

const navs = [
  { text: '最新资讯', classify: '', },
  { text: 'AI报告', classify: '报告', },
  { text: '博硕论文', classify: '博硕论文', },
  { text: '会议论文', classify: '会议论文', },
  { text: '人才智库', classify: '智库', },
  { text: '趋势分析', classify: '趋势分析', }
];

const field = [
  'title',
  'keywords',
  'author',
  'abstract',
  'pdfname',
  'classify',
  'is_top',
  'view',
  'share',
  'like',
  'is_download',
  'image',
  'update_time',
]

export default @connect(({ report, loading }) => ({
  report,
  keyLoading: loading.effects['report/getReportListByKey'],
  loading: loading.effects['report/getReportList'],
}))

class ReportHome extends Component {

  constructor(props) {
    super(props);
    this.pageSize = 20;

    const { page = 1, keyword = '', title = '', classify = '' } = parseUrlParam(this.props, {}, ['page', 'keyword', 'title', 'classify'])
    this.title = title; 
    this.page = page;
  
    this.state = {
      keyword,
      classify
    }
  }
  componentDidMount() {
    const { page, pageSize, title } = this;
    const { keyword, classify } = this.state;
    const { reportList, rankList, keywords, ads } = this.props.report;

    !rankList && this.changeRankTabs('view');
    !reportList && this.getReportList({ page, pageSize, classify, keyword, title });
    !keywords && this.getKeywords();
    !ads && this.getAds();
  }

  searchRef = (ref) => {
    this.searchChild = ref;
  }

  articleRef = (ref) => {
    this.articleChild = ref;
  }

  getReportList = ({ page, limit = this.pageSize, classify = '', keyword = '', title = '' }) => {
    const { dispatch } = this.props;
    if (keyword) {
      this.setState({  keyword, classify: null}) 
      this.searchListByKey({ keyword, page, limit }); 
    } else if (title) {
      this.searchListByKey({ page, limit, title });
    } else {
      const filter = {};  

    this.setState({  classify, keyword: null}) 
      if (classify) {
        filter.classify = classify;
      }
      dispatch({
        type: 'report/getReportList',
        payload: {
          skip: (page - 1) * limit,
          limit,
          filter,
          field,
        },
      });
    }
  };

  // 获取广告列表
  getAds = () => { this.props.dispatch({ type: 'report/getAds' }); }

  // 获取热门话题关键词
  getKeywords = () => {
    this.props.dispatch({
      type: 'report/getKeywords',
      payload: { size: 15 }
    });
  };

  // 点击导航栏
  changeClassify = (classify) => {
    const { dispatch } = this.props;
    routeTo(this.props, { page: '1', classify }, null, { removeParams: ['keyword', 'title'] });
    this.page = 1;
    this.articleChild.initCurrent();
    this.getReportList({ page: this.page, pageSize: this.pageSize, classify });
  };

  changeRankTabs = (key) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'report/getReportRank',
      payload: {
        types: [key],
        recent: 30,
        limit: 10,
      }
    });
  }

  // 点击热门话题 或 输入搜索词
  searchListByKey = (values) => {
    const { keyword, page = 1, limit = this.pageSize, title = '', classify = '' } = values;
    !values.page && this.articleChild.initCurrent();
    this.setState({ keyword, classify })
    this.props.dispatch({
      type: 'report/getReportListByKey',
      payload: {
        keyword,
        skip: (page - 1) * limit,
        limit,
        title,
        field,
      }
    })
  }

  render() {
    const { report: { reportList }, loading, keyLoading } = this.props;
    const {classify, keyword} = this.state;  
    return (
      <Layout
        className="report"
        showHeader={true}
        showFooter={false}
        pageTitle={formatMessage({ id: 'aminer.report.scienceInformation' })}
        pageDesc="AMiner科技资讯，每日发布人工智能、认知科学、计算机科学、神经科学、脑科学等领域最新资讯。从跨学科的角度，围绕“认知智能”向科学界和大众介绍前沿话题和深度解读。"
        pageKeywords="人工智能、数据挖掘、科技资讯、认知科学、计算机科学、知识图谱、认知图谱、脑科学、神经科学、AMiner、科技前沿"
      >
        <div className={styles.report}>
          <article className={styles.reportPage}>
            <div className={styles.wrap}>
              <section className={styles.navsLine}>
                <div className={styles.navs}>
                  {navs && navs.map(nav => {
                    return (
                      <span
                        className={classnames(styles.nav, { [styles.active]: classify=== nav.classify })}
                        key={nav.classify} onClick={this.changeClassify.bind(this, nav.classify)}
                      >
                        {nav.text}
                      </span>
                    );
                  })}
                </div>
                <Tooltip placement="bottom"
                  trigger='hover' title={'点击即可发送邮件至report@aminer.cn， 审核通过后会以署名文章形式发布。'}>
                  <a href="mailto:report@aminer.cn" className={styles.sendEmail}>
                    立即投稿
                  </a>
                </Tooltip>
              </section>
              <Spin spinning={Boolean(loading || keyLoading)}>
                <ArticleList onRef={this.articleRef} searchListByKey={this.searchListByKey} pageSize={this.pageSize} getMore={this.getReportList} classify={classify} keyword={keyword} />
              </Spin>
            </div>
          </article>
          <div className={styles.rightList}>
            <SearchArticle onRef={this.searchRef} searchListByKey={this.searchListByKey} classify={classify} keyword={keyword} />
            <RankList changeRankTabs={this.changeRankTabs} />
            <Advertising />
          </div>
        </div>
      </Layout>
    );
  }
}

ReportHome.getInitialProps = async ({ store, history, isServer }) => {
  if (!isServer) return;
  const { location } = history || {};
  const { page = 1, keyword = '', title = '', classify = '' } = location && location.query || {}; 
  await store.dispatch({ type: 'report/initReportList' });
  if (keyword || title) {
    await store.dispatch({
      type: 'report/getReportListByKey',
      payload: {
        keyword,
        skip: (page - 1) * 20,
        limit: 20,
        title,
        field,
      }
    })
  } else {
    const filter = {};
    if (classify) {
      filter.classify = classify;
    }
    await store.dispatch({
      type: 'report/getReportList', payload: {
        skip: (page - 1) * 20,
        limit: 20,
        filter,
        field,
      }
    })
  }
  const { report } = store.getState();
  return { report };
};
