import React, { PureComponent } from 'react';
import { connect } from 'acore';
import { sysconfig } from 'systems';
import { NE } from 'utils/compare';
import { List, Pagination } from 'antd';
import { Spin } from 'aminer/components/ui';
import { PaperInfo } from './index';
import styles from './PubsComponent.less';

const { Pub_CitedPaper_Pagesize } = sysconfig;

@connect(({ loading }) => ({
  loading: loading.effects['pub/getCitePubs']
}))
class CitePapers extends PureComponent {
  constructor(props) {
    super(props);
    this.current = 1;
  }

  state = {
    citelist: null,
  }

  componentDidMount() {
    this.getCitePubs();
  }

  componentDidUpdate(prevProps) {
    if (NE(prevProps, this.props, 'id')) {
      this.getCitePubs();
    }
  }

  onPageChange = current => {
    this.current = current;
    this.getCitePubs();
  }

  getCitePubs = () => {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'pub/getCitePubs',
      payload: { id, offset: (this.current - 1) * Pub_CitedPaper_Pagesize, size: Pub_CitedPaper_Pagesize }
    })
      .then(data => {
        if (data) {
          this.setState({ citelist: data });
        }
      })
  }

  render() {
    const { loading } = this.props;
    const { citelist } = this.state;
    return (
      <div className={styles.pubsList} id='citepapers'>
        <Spin loading={loading} size="small" />
        {citelist && citelist.count !== 0 && (
          <section className={styles.listContent}>
            <List dataSource={citelist.data} size="small" className={styles.list}
              renderItem={(item, index) => (
                <List.Item>
                  <PaperInfo data={item} index={(this.current - 1) * Pub_CitedPaper_Pagesize + index + 1} />
                </List.Item>
              )}
            />
            {citelist && citelist.count > Pub_CitedPaper_Pagesize && (
              <Pagination
                defaultCurrent={1} current={this.current}
                total={citelist.count} pageSize={Pub_CitedPaper_Pagesize}
                onChange={this.onPageChange} className={styles.pagination}
              />
            )}

          </section>
        )}
        {citelist && citelist.count === 0 && (<p className={styles.noData}>Citation not found</p>)}
      </div>
    );
  }
}

export default CitePapers;
