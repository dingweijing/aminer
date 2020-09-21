import React, { PureComponent } from 'react';
import { connect, withRouter } from 'acore';
import { classnames } from 'utils';
import { Icon, Pagination, Tag, message } from 'antd';
import { parseUrlParam, routeTo } from 'helper';
import moment from 'moment';
import styles from './ArticleList.less';


export default @connect(({ report, auth }) => ({
  reportList: report.reportList,
  total: report.total, 
  isUserLogin: auth.isUserLogin,
}))
@withRouter
class ArticleList extends PureComponent {

  constructor(props) {
    super(props);

    const { page = 1, keyword = '', title = '' } = parseUrlParam(this.props, {}, ['page', 'keyword', 'title',  ])
    this.current = page;
    this.title = title;
    this.keyword= props.keyword; 
    this.classify= props.classify
  }

  componentDidUpdate(provProps){ 
    if(provProps.classify !== this.props.classify ){
      this.classify = this.props.classify 
    }
    if(provProps.keyword !== this.props.keyword ){
      this.keyword = this.props.keyword 
    }
  }
  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    clearTimeout(this.debounce);
  }

  goArticlePage = (report) => {
    const { _id, pdfname, is_download } = report;
    // TODO 现在是用这个
    // let href = `https://www.aminer.cn/research_report/${_id}?download=${is_download}`;
    let href = `/research_report/${_id}?download=${is_download}`;
    if (pdfname) {
      href += `&pathname=${pdfname}`;
    }
    window.open(href);
  };

  keywordSearch = (keyword) => {
    const { location } = this.props;
    let { pathname } = location;
      pathname += `?page=1` 
      pathname += `&keyword=${keyword}`
      routeTo(this.props, { page: '1', keyword }, null, {removeParams: ['classify', 'title']});
      this.props.searchListByKey({ keyword });

  }

  initCurrent = () => {
    this.current = 1;
  }

  changePage = (page, pageSize) => {
    const { getMore } = this.props;
    routeTo(this.props, { page }, null);

    this.current = page; 
    getMore && getMore({page, pageSize, keyword: this.keyword, title: this.title, classify: this.classify});
  }

  changeLiked = (id, isLiked, index) => {
    const { isUserLogin, dispatch, getMore } = this.props;
    if (!isUserLogin) {
      dispatch({ type: 'modal/login' });
    } else if(isLiked) {
      if (!this.likeDebounce) {
        message.warning("您已为该篇文章点过赞。");
        this.likeDebounce = 1;
        this.debounce = setTimeout(() => {
          this.likeDebounce = 0;
        }, 1000)
      }
    } else {
      dispatch({ type: 'report/setUserLiked', payload: { id } }).then(res => {
        if (res) {
          message.success("点赞成功。");
          dispatch({ type: 'report/changeReportList', payload: { index } })
        } else {
          message.error("点赞失败。");
        }
      })
    }
  }

  render() {
    const { reportList, total, pageSize } = this.props;

    if (!reportList || !reportList.length) {
      return (
        <p>暂无相关文章</p>
      )
    }
    return (
      <div className={classnames(styles.reportList)}>
        {reportList && reportList.map((report, index) => {
          const { _id, image, title, abstract, author, classify, view, update_time, is_top, keywords, curUserLiked, like } = report;
          return (
            <div className={styles.report} key={_id}>
              <div className={styles.reportImg} onClick={this.goArticlePage.bind(this, report)}>
                <div className={styles.imgCover}>
                  <img src={image} alt={title} />
                </div>
              </div>
              <div className={styles.reportRight}>
                <section>
                  <div className={styles.titleBox}>
                    <div className={styles.title} onClick={this.goArticlePage.bind(this, report)}>
                      {is_top && <span><img src={`${process.env.publicPath}sys/aminer/top.png`} className={styles.isTop} /></span>}
                      <span>{title}</span>
                    </div>
                    <span className={styles.classify}>{classify}</span>
                  </div>
                  <p className={styles.abstract}>{abstract}</p>
                </section>

                {keywords && keywords.length ? (
                  <div className={styles.keywords}>
                    {keywords.slice(0, 5).map((keyword, index) => (
                      <Tag
                        key={keyword}
                        className={classnames({'isChecked': this.props.keyword === keyword}, 'keyword')}
                        onClick={this.keywordSearch.bind(this, keyword)}
                      >{keyword}</Tag>
                    ))}
                  </div>
                ) : ''}

                <section className={styles.rightFooter}>
                  <div>
                    {author && (<div className={styles.author}>
                        <Icon type="user" />
                        <span>{author}</span>
                      </div>
                    )}
                    {update_time && (<div className={classnames(styles.author, 'calendar')}>
                        <Icon type="calendar" />
                        <span>{moment(update_time).format('YYYY-MM-DD HH:mm')}</span>
                      </div>
                    )}
                    {!isNaN(view) && (<div className={styles.author}>
                        <Icon type="eye" />
                        <span>阅读量：{view} </span>
                      </div>
                    )}

                  </div>

                  <div className={styles.other} onClick={this.changeLiked.bind(this, _id, curUserLiked, index)}>
                    <div className={classnames(styles.like, { 'isLiked': curUserLiked })}>
                      <svg className="icon likeIcon" aria-hidden="true">
                        <use xlinkHref="#icon-top" />
                      </svg>
                    </div>
                    <span className={styles.likeNum}>{like}</span>
                  </div>
                </section>
              </div>
            </div>
          );
        })}
        <Pagination current={+this.current} total={total} className={styles.pagination} pageSize={pageSize} onChange={this.changePage}/>
      </div>
    );
  }
}
