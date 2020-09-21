import React, { PureComponent } from 'react';
import { connect } from 'acore';
import { sysconfig } from 'systems';
import { NE } from 'utils/compare';
import { List, Pagination } from 'antd';
import { Spin } from 'aminer/components/ui';
import { PaperInfo } from './index';
import styles from './PubsComponent.less';

const { Pub_ReferencePaper_Pagesize } = sysconfig;

@connect(({ loading }) => ({
  loading: loading.effects['pub/getRefPubs']
}))
class RefPapers extends PureComponent {
  constructor(props) {
    super(props);
    this.current = 1;
  }

  state = {
    reflist: null,
  }

  componentDidMount() {
    this.getRefPubs();
  }

  componentDidUpdate(prevProps) {
    if (NE(prevProps, this.props, 'id')) {
      this.getRefPubs();
    }
  }

  onPageChange = current => {
    this.current = current;
    this.getRefPubs();
  }

  getRefPubs = () => {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'pub/getRefPubs',
      payload: { id, offset: (this.current - 1) * Pub_ReferencePaper_Pagesize, size: Pub_ReferencePaper_Pagesize }
    })
      .then(data => {
        this.setState({ reflist: data });
      })
  }

  render() {
    const { loading } = this.props;
    const { reflist } = this.state;
    return (
      <div className={styles.pubsList}>
        <Spin loading={loading} size="small" />
        {reflist && reflist.count !== 0 && (
          <section className={styles.listContent}>
            <List dataSource={reflist.data} size="small" className={styles.list}
              renderItem={(item, index) => (
                <List.Item>
                  <PaperInfo data={item} index={(this.current - 1) * Pub_ReferencePaper_Pagesize + index + 1} />
                </List.Item>
              )}
            />
            {reflist && reflist.count > Pub_ReferencePaper_Pagesize && (
              <Pagination
                defaultCurrent={1} current={this.current} total={reflist.count}
                pageSize={Pub_ReferencePaper_Pagesize}
                onChange={this.onPageChange} className={styles.pagination}
              />
            )}
          </section>
        )}
        {reflist && reflist.count === 0 && (<p className={styles.noData}>Reference not found</p>)}
      </div>
    );
  }
}

export default RefPapers;
