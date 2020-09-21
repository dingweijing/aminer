import React, { PureComponent } from 'react';
import { connect } from 'acore';
import { classnames } from 'utils';
import { Icon } from 'antd';
import moment from 'moment';
import styles from './RankList.less';

const tabs = [
  // { key: 'like', tab: '点赞量排行' },
  { key: 'view', tab: '阅读量排行' },
]

export default @connect(({ report }) => ({
  rankList: report.rankList,
}))

class RankList extends PureComponent {

  goArticlePage = (report) => {
    const { _id, pdfname, is_download } = report;
    let href = `/research_report/${_id}?download=${is_download}&from=likeRank`;
    if (pdfname) {
      href += `&pathname=${pdfname}`;
    }
    window.open(href);
  }

  render() {
    const { rankList } = this.props;
    return (
      <div className={styles.reportRank}>
        <div className={styles.rankTitle}>排行</div>
        <div className={styles.rank}>
          {(rankList && rankList.data && rankList.data.length) ? rankList.data.map(item =>(
            <div className={styles.rankList} key={item._id}>
              <h3 className={styles.title} onClick={this.goArticlePage.bind(this, item)}>{item.title}</h3>
            </div>
          )) : '暂无排行信息'}
        </div>
      </div>
    );
  }
}
