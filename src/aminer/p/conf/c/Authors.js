// getSchedule

import React, { useEffect, useState } from 'react';
import { page, connect } from 'acore';
import { classnames } from 'utils';
import { Input, Pagination, Tabs } from 'antd';
import { Spin } from 'aminer/components/ui';
import { EmptyTip } from 'components/ui';
import { formatMessage, FM, enUS } from 'locales';
import AuthorBottomZone from './Author/AuthorPubs';
import AuthorList from './Author/AuthorList';

import styles from './Authors.less';

// TODO: 返回上上层论文id，用来解析论文
const { TabPane } = Tabs;
const SIZEPERPAGE = 20;
const Authors = props => {
  const [data, setData] = useState();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  // TODO: 上层传下来
  const [selectedType, setSelectedType] = useState('all');

  const { confInfo, user } = props;
  const { dispatch, loading } = props;

  const { filters, tab } = props;

  // const updateSelectedType = selected => {
  //   setSelectedType(selected);
  // };
  useEffect(() => {
    // getMostViewPubs(current)
  }, []);

  useEffect(() => {
    if (tab === 'authors') {
      setCurrent(1);
      getPapers(1);
    }
  }, [tab, filters]);
  useEffect(() => {
    if (tab === 'authors') {
      getPapers(current);
    }
  }, [current]);

  const getPapers = cur => {
    dispatch({
      type: 'aminerConf/SearchAuthors',
      payload: {
        conf_id: confInfo.id,
        offset: (cur - 1) * SIZEPERPAGE,
        size: SIZEPERPAGE,
        ...filters,
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

  // const getMostViewPubs = current => {
  //   dispatch({
  //     type: 'aminerConf/ListConfPubs',
  //     payload: { conf_id: confInfo.id, offset: (current - 1) * SIZEPERPAGE, size: SIZEPERPAGE },
  //   }).then(result => {
  //     console.log('result', result);
  //     const { data = {} } = result;
  //     setData(data.data);
  //   });
  // };

  const personZone = {
    contentBottomZone: [params => <AuthorBottomZone {...params} confInfo={confInfo} />],
    // rightZone: [() => {
    //   return <>123</>
    // }]
  };
  return (
    <div className={styles.AuthorsComponent}>
      <div className="authors_list">
        {/* <div className="author_legend">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-head" />
          </svg>
          <FM id="aminer.conf.authors.legend" default="Author List" />
        </div> */}
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
  connect(({ auth, loading, aminerConf }) => ({
    user: auth.user,
    roles: auth.roles,
    filters: aminerConf.filters,
    loading: loading.effects['aminerConf/SearchAuthors'],
  })),
)(Authors);
