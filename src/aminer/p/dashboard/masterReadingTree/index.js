import React, { useState, useEffect } from 'react';
import { connect, Link, component } from 'acore';
import { FM, formatMessage } from 'locales';
import { Pagination } from 'antd';
import { Spin } from 'aminer/components/ui';
import PaperMRTList from 'aminer/p/mrt/c/PaperMRTList';
import styles from './index.less';

const MyMasterReadingTree = props => {
  const { user, dispatch, mrtList, total, loading } = props;
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    getMyMRT(current);
  }, [current]);

  const getMyMRT = (current, pageSize) => {
    // const size = pageSize || 5;
    if (!user || !user.id) return;
    dispatch({
      type: 'mrt/getPaperMRTBySponsors',
      payload: {
        sponsors: [user.id],
        pagination: {
          current, pageSize
        },
      }
    })
  }
  return (
    <div className={styles.myMRT}>
      <Spin loading={loading} />
      {mrtList && !!mrtList.length && <PaperMRTList mrtList={mrtList}/>}
      {mrtList && mrtList.length === 0 && (
        <div>
          <p><FM id="aminer.mrt.null" /></p>
          <p><FM id="aminer.mrt.introduction" /></p>
          <p><FM id="aminer.mrt.create" /></p>
        </div>
      )}
      <div className={styles.paginationWrap}>
        <Pagination
          hideOnSinglePage
          current={current}
          defaultCurrent={1}
          defaultPageSize={20}
          total={total}
          onChange={(current) => setCurrent(current)}
        />
      </div>
    </div>
  );
};

export default component(connect(({ auth, loading, mrt }) => ({
  user: auth.user,
  loading: loading.effects[`mrt/getPaperMRTBySponsors`],
  mrtList: mrt.mrtList,
  total: mrt.total
})))(MyMasterReadingTree);
