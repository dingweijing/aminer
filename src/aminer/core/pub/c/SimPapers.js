import React, { useState, useEffect } from 'react';
import { connect, component } from 'acore';
import { sysconfig } from 'systems';
import { List, Pagination } from 'antd';
import { Spin } from 'aminer/components/ui';
import { PaperInfo } from './index';
import styles from './PubsComponent.less';

const { Pub_SimilarPaper_Pagesize } = sysconfig;

const SimPapers = props => {
  const { loading, data, id, dispatch } = props;
  const [simlist, setSimlist] = useState(data);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    getSimPubs();
  }, [current])

  const onPageChange = curr => setCurrent(curr);

  const getSimPubs = () => {
    dispatch({
      type: 'pub/getSimPubs',
      payload: {
        id, offset: (current - 1) * Pub_SimilarPaper_Pagesize,
        size: Pub_SimilarPaper_Pagesize,
      }
    }).then((data) => {
      setSimlist(data)
    })
  }

  return (
    <div className={styles.pubsList}>
      <Spin loading={loading} size="small" />
      {simlist && simlist.count !== 0 && (
        <section className={styles.listContent}>
          <List dataSource={simlist.data} size="small" className={styles.list}
            renderItem={(item, index) => (
              <List.Item>
                <PaperInfo data={item} index={(current - 1) * Pub_SimilarPaper_Pagesize + index + 1} />
              </List.Item>
            )}
          />
          {simlist && simlist.count > Pub_SimilarPaper_Pagesize && (
            <Pagination
              className={styles.pagination}
              defaultCurrent={1}
              current={current}
              total={simlist.count}
              pageSize={Pub_SimilarPaper_Pagesize}
              onChange={onPageChange}
            />
          )}
        </section>
      )}
      {simlist && simlist.count === 0 && (<p className={styles.noData}>Similar paper is not avaliable</p>)}
    </div>
  );
}

export default component(
  connect(({ loading }) => ({
    loading: loading.effects['pub/getSimPubs']
  })),
)(SimPapers);
