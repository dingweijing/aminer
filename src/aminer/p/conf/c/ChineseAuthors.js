// getSchedule

import React, { useEffect, useState } from 'react';
import { page, connect } from 'acore';
import { Pagination } from 'antd';
import { Spin } from 'aminer/components/ui';
import { EmptyTip } from 'components/ui';
// import { FollowBtn } from 'aminer/components/widgets';
// import { useGetFollowsByID } from 'utils/hooks';
import AuthorBottomZone from './Author/AuthorPubs';
import AuthorList from './Author/AuthorList';

import styles from './Authors.less';

const SIZEPERPAGE = 20;
const ChineseAuthors = props => {
  const [data, setData] = useState();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);

  const { confInfo, confType, tempMiddleTab } = props;
  const { dispatch, loading } = props;

  const { filters, tab } = props;

  useEffect(() => {
    if (tab === 'chinese-scholar') {
      getPapers(current);
    }
  }, [current, tab, filters, confType]);

  const getPapers = cur => {
    dispatch({
      type: 'aminerConf/SearchAuthors',
      payload: {
        conf_id: confInfo && confInfo.id,
        offset: (cur - 1) * SIZEPERPAGE,
        size: SIZEPERPAGE,
        ...filters,
        language: 1,
      },
    }).then(res => {
      const { items: authors, total: count } = res;
      const temp = [];
      authors &&
        authors.forEach(item => {
          const { pids, related_info, author, conf_id, name } = item;
          temp.push({
            person: item || { name },
            related: related_info,
          });
        });
      setData(temp);
      setTotal(count);
    });
  };
  // useGetFollowsByID(dispatch, true, data);

  const personZone = {
    contentBottomZone: tempMiddleTab.includes('paper')
      ? [params => <AuthorBottomZone {...params} confInfo={confInfo} />]
      : [],
    // contentRightZone: [({ person }) => <FollowBtn size="small" key={5} entity={person} type="e" />],
  };
  return (
    <div className={styles.AuthorsComponent}>
      <div className="authors_list">
        <Spin loading={loading} />
        <div className="authors_content">
          {data && data.length > 0 && <AuthorList persons={data} personZone={personZone} />}
          {data && data.length === 0 && <EmptyTip />}
        </div>
        {data && data.length > 0 && total && total > SIZEPERPAGE && (
          <Pagination
            className={styles.pagination}
            defaultCurrent={1}
            current={current}
            total={total}
            pageSize={SIZEPERPAGE}
            onChange={curr => {
              return setCurrent(curr);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default page(
  connect(({ loading, aminerConf }) => ({
    filters: aminerConf.filters,
    loading: loading.effects['aminerConf/SearchAuthors'],
  })),
)(ChineseAuthors);
