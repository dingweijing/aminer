/* eslint-disable no-console */
// getSchedule

import React, { useEffect, useState } from 'react';
import { page, connect } from 'acore';
import { classnames } from 'utils';
import { Pagination, Button } from 'antd';
import { isLogin, isAuthed } from 'utils/auth';
import { formatMessage, FM, enUS } from 'locales';
import { Spin } from 'aminer/components/ui';
import { EmptyTip } from 'components/ui';
// import ConfSearchBox from './ConfSearchBox';
import ConfPaperList from './Paper/ConfPaperList';
import StatsAndFilters from './Paper/StatsAndFilters';
import AddSessionPubForm from './Schedule/AddSessionPubForm';
import styles from './Papers.less';

// TODO: 添加论文
const SIZEPERPAGE = 20;
const Papers = props => {
  const [data, setData] = useState();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  // const [searchQuery, setSearchQuery] = useState();
  const [sort, setSort] = useState('view');

  const { SearchPubsModel, confInfo, searchQuery, SetOrGetViews } = props;
  const { dispatch, loading } = props;
  const { user, roles } = props;
  const { tab } = props;

  // currentKey 左侧选择的key， updateCurrentKey论文中关键词点击后改变左侧
  const { filters } = props;

  useEffect(() => {
    if (confInfo && confInfo.id) {
      SetOrGetViews('click', dispatch, confInfo.id);
    }
  }, []);
  const getMostViewPubs = ({ cur = current, sortTemp = sort }) => {
    dispatch({
      type: 'aminerConf/SearchPubs',
      payload: {
        conf_id: confInfo.id,
        offset: (cur - 1) * SIZEPERPAGE,
        size: SIZEPERPAGE,
        ...filters,
        sort: sortTemp || sort,
      },
    }).then(result => {
      const { items, total } = result || {};
      setData(items);
      setTotal(total);
    });
  };

  const getDataBySearchQuery = ({ cur = current }) => {
    dispatch({
      type: 'aminerConf/searchInConf',
      payload: {
        confId: confInfo.id,
        offset: (cur - 1) * SIZEPERPAGE,
        size: SIZEPERPAGE,
        query: searchQuery,
        category: filters && filters.category,
      },
    }).then(result => {
      const { items, total } = result || {};
      // TODO:需要清空filter，但是还不能刷新
      // if (filters !== {}) {
      //   dispatch({ type: 'aminerConf/clearFilters' });
      // }
      setData(items);
      setTotal(total);
    });
  };

  const deterMineWhichMethod = params => {
    if (searchQuery) {
      getDataBySearchQuery(params);
    } else {
      getMostViewPubs(params);
    }
  };

  // 防止多次调用，判断model中是否返回值了
  const judgeSearchPUbsModel = () =>
    typeof SearchPubsModel !== 'undefined' ||
    (typeof SearchPubsModel === 'object' && SearchPubsModel !== {});

  useEffect(() => {
    const params = { cur: 1, sortTemp: sort };
    if (searchQuery) {
      getDataBySearchQuery(params);
    } else if (judgeSearchPUbsModel()) {
      getMostViewPubs(params);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (tab === 'paper' && filters) {
      setCurrent(1);
      if (JSON.stringify(filters) !== '{}') {
        deterMineWhichMethod({ cur: 1, sortTemp: sort });
      } else if (judgeSearchPUbsModel()) {
        getMostViewPubs({ cur: 1, sortTemp: sort });
      }
    }
  }, [filters, tab]);

  const getPubsBySort = value => {
    if (SetOrGetViews) {
      SetOrGetViews('click', dispatch, confInfo.id);
    }
    dispatch({
      type: 'aminerConf/setSysTrack',
      payload: {
        type: 'conf_system',
        target_type: confInfo.short_name,
        target_name: 'paper',
        payload: JSON.stringify({ sort: value }),
      },
    });
    setSort(value);
    deterMineWhichMethod({ cur: current, sortTemp: value });
  };

  // useEffect(() => {
  //   deterMineWhichMethod({ cur: current });
  // }, [sort]);
  const onChangePaper = value => {
    if (SetOrGetViews) {
      SetOrGetViews('click', dispatch, confInfo.id);
    }
    setCurrent(value);
    deterMineWhichMethod({ cur: value, sortTemp: sort });
  };

  useEffect(() => {
    const { items = [], total: outTotal = 0 } = SearchPubsModel || {};
    setData(items);
    setTotal(outTotal);
  }, [SearchPubsModel]);

  const updateConfPubs = type => {
    dispatch({
      type: 'modal/open',
      payload: {
        title: `Conf ${type} Pubs`,
        extraArticleStyle: { padding: '20px' },
        content: (
          <AddSessionPubForm
            getAllList={() => {
              window.location.reload();
            }}
            type={type}
            dispatch={dispatch}
            confInfo={confInfo}
          />
        ),
      },
    });
  };

  return (
    <div className={styles.Papers}>
      {/* 管理员可见，给会议添加删除论文 */}
      {isLogin(user) && isAuthed(roles) && (
        <>
          <Button className="annotationArea" onClick={updateConfPubs.bind(null, 'add')}>
            Add pubs
          </Button>
          <Button className="annotationArea" onClick={updateConfPubs.bind(null, 'del')}>
            Del conf pubs
          </Button>
          <Button className="annotationArea" onClick={updateConfPubs.bind(null, 'bestPaper')}>
            Update Best Paper
          </Button>
        </>
      )}
      <div className="paperList">
        <StatsAndFilters total={{ total }} confInfo={confInfo} SetOrGetViews={SetOrGetViews} />
        <div className="sort_block">
          {sortsType &&
            sortsType.map(sortItem => {
              return (
                <div
                  className={classnames('item', { active: sortItem === sort })}
                  key={sortItem}
                  onClick={getPubsBySort.bind(null, sortItem)}
                >
                  {sortItem === sort && (
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-paixu1" />
                    </svg>
                  )}
                  <FM id={`aminer.common.${sortItem}`} />
                </div>
              );
            })}
        </div>
        <Spin loading={loading} />
        <div className="paper_content">
          <ConfPaperList pubs={data} confInfo={confInfo} />
        </div>
        {(!data || !data.length) && !loading && <EmptyTip />}
        {data && !!total && total > SIZEPERPAGE && (
          <Pagination
            className={styles.pagination}
            defaultCurrent={1}
            current={current}
            total={total}
            pageSize={SIZEPERPAGE}
            onChange={onChangePaper.bind()}
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
    searchQuery: aminerConf.searchQuery,
    SearchPubsModel: aminerConf.SearchPubsData,
    loading: loading.effects['aminerConf/SearchPubs'] || loading.effects['aminerConf/searchInConf'],
  })),
)(Papers);

const sortsType = ['citation', 'view', 'like'];
