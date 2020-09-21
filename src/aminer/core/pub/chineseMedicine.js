import React, { PureComponent } from 'react';
import { connect } from 'acore';
import { classnames } from 'utils';
import { Layout } from 'aminer/layouts';
import { Icon } from 'antd';
import moment from 'moment';
import CovidBanner from './CovidBanner';
import InfiniteScroll from 'react-infinite-scroller';
import styles from './chineseMedicine.less';


export default @connect(({ chineseMedicine }) => ({
  chineseMedicineList: chineseMedicine.chineseMedicineList,
}))

class ChineseMedicine extends PureComponent {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chineseMedicine/getPubTimeLine'
    })
  }

  goArticlePage = (link) => {
    // TODO 现在是用这个
    // let href = `https://www.aminer.cn/research_report/${_id}?download=${is_download}`;
    window.open(link);
  };

  loadMore = () => {
    const { getMore } = this.props;
    getMore && getMore()
  };

  render() {
    const { chineseMedicineList, end } = this.props;
    if (!chineseMedicineList) {
      return (
        <p>暂无相关文章</p>
      )
    }
    return (
      <Layout
        pageTitle="AMiner-疫情科研论文事件-学术成果"
        pageDesc="AMiner学术成果栏目通过学术成果时间线的方式，提供近期疫情科研学术成果，包括近期疫情论文，疫情论点，疫情等事件新闻动态。"
        pageKeywords={['疫情论文', '疫情科研', '疫情事件', '疫情论点', '新冠疫情', '武汉疫情', '新冠肺炎', 'AMiner']}
        covidHeader={<CovidBanner />}
        rightZone={[]}
      >
        <div className={classnames(styles.reportList)}>
          <div className={styles.bannerWraper}>
            <img src='https://fileserver.aminer.cn/sys/aminer/homepage/covidBanner.jpg' alt='AMiner疫情专题' className={styles.banner} />
          </div>
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={this.loadMore}
            hasMore={!end}
            useWindow={true}
          >
            {chineseMedicineList && chineseMedicineList.map(report => {
              const { _id, image, title, abstract, author, classify, link, update_time, is_top } = report;
              return (
                <div className={styles.report} key={_id}>
                  <div className={styles.reportImg} onClick={this.goArticlePage.bind(this, link)}>
                    <div className={styles.imgCover}>
                      <img src={image} alt={title} />
                    </div>
                  </div>
                  <div className={styles.reportRight}>
                    <section>
                      <div className={styles.title} onClick={this.goArticlePage.bind(this, link)}>
                        <span>{title}</span>
                      </div>
                      <p className={styles.abstract}>{abstract}</p>
                    </section>
                    <section className={styles.rightFooter}>
                      <div>
                        <div className={styles.author}>
                          <Icon type="user" />
                          <span>{author}</span>
                        </div>
                        <div className={styles.author}>
                          <Icon type="calendar" />
                          <span>{moment(update_time).format('YYYY-MM-DD')}</span>
                        </div>

                      </div>

                      <div className={styles.other}>
                        <div className={styles.classify}>{classify}</div>
                      </div>
                    </section>
                  </div>
                </div>
              );
            })}
          </InfiniteScroll>
        </div>
      </Layout>
    );
  }
}
ChineseMedicine.getInitialProps = async ({ store, route, isServer }) => {
  if (!isServer) return;
  await store.dispatch({ type: 'chineseMedicine/getPubTimeLine' })
  const { chineseMedicine } = store.getState();
  return { chineseMedicine };
};
