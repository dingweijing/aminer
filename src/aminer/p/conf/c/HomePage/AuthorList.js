import React, { useEffect, useState } from 'react';
import { page, connect } from 'acore';
import { Button } from 'antd';
import { classnames } from 'utils';
import { formatMessage } from 'locales';
import { getLangLabel } from 'helper';
import { Spin } from 'aminer/components/ui';
import styles from './AuthorList.less';
import { ConfInfo } from 'aminer/p/ranks-conf/c';

let offset = 10,
  max = 1000;
const AuthorList = props => {
  const [data, setData] = useState();
  const [authorsExpanded, setAuthorsExpanded] = useState(false);
  const [size, setSize] = useState(offset);
  const [total, setTotal] = useState();
  // showMenu控制左侧过滤的内容是否显示
  const {
    authorsModel,
    dispatch,
    loading,
    confInfo,
    filters,
    showMenu,
    isMobileClickMenu,
    SetOrGetViews,
  } = props;

  // useEffect(() => {
  // dispatch({
  //   type: 'aminerConf/SearchAuthors',
  //   payload: { ids: [confInfo.id], offset: 0, size: max, shortSchema: true },
  // }).then(res => {
  //   setData(res && res.data);
  // });
  // }, []);

  useEffect(() => {
    if (authorsModel) {
      if (!total) {
        setTotal(authorsModel.total);
      }
      setData(authorsModel.items);
    }
  }, [authorsModel]);

  const setAuthorAid = (aid, name) => {
    SetOrGetViews('click', dispatch, ConfInfo.id);
    dispatch({
      type: 'aminerConf/setSysTrack',
      payload: {
        type: 'conf_system',
        target_type: confInfo.short_name,
        target_name: 'left_authors',
        payload: JSON.stringify(name),
      },
    });
    if (isMobileClickMenu) {
      showMenu();
    }
    if (filters.aid !== aid) {
      dispatch({ type: 'aminerConf/clearFilters' });
    }
    dispatch({ type: 'aminerConf/updateFilters', payload: { aid } });
  };

  const seeMore = () => {
    SetOrGetViews('click', dispatch, ConfInfo.id);
    dispatch({
      type: 'aminerConf/setSysTrack',
      payload: {
        type: 'conf_system',
        target_type: confInfo.short_name,
        target_name: 'left_authors',
        payload: JSON.stringify('More'),
      },
    });
    const newSize = size + offset;
    if (newSize > data.length) {
      dispatch({
        type: 'aminerConf/SearchAuthors',
        payload: { conf_id: confInfo && confInfo.id, offset: size, size: 10, shortSchema: true },
      });
    }
    setSize(newSize);
  };

  const onCollapse = () => {
    SetOrGetViews('click', dispatch, ConfInfo.id);
    dispatch({
      type: 'aminerConf/setSysTrack',
      payload: {
        type: 'conf_system',
        target_type: confInfo.short_name,
        target_name: 'left_authors',
        payload: JSON.stringify('Collapse'),
      },
    });
    setSize(offset);
  };

  return (
    <div className={styles.leftAuthorList}>
      <Spin loading={loading && filters && !Object.keys(filters).length} size="small" top="25px" />
      {data &&
        data
          .slice(0, size)
          .filter(item => item.aid)
          .map((item, index) => (
            <div
              key={`${item.id}_${index}`}
              className={classnames('authorList', {
                active: filters && filters.aid === (item && item.aid),
              })}
              onClick={setAuthorAid.bind(null, item && item.aid, item.name)}
            >
              {getLangLabel(item.name, item.name_zh)} ({item.pub_num})
            </div>
          ))}

      {data && data.length > 0 && (
        <div className="filterControll">
          <span>
            {size >= offset * 2 && (
              <Button type="link" onClick={onCollapse} className="expandBtn">
                <svg className="expandIcon" aria-hidden="true">
                  <use xlinkHref="#icon-subtraction" />
                </svg>
                {formatMessage({ id: 'aminer.conf.session.collapse' })}
              </Button>
            )}
          </span>
          <span>
            {size < total && (
              <Button type="link" onClick={seeMore} className="expandBtn">
                <svg className="expandIcon" aria-hidden="true">
                  <use xlinkHref="#icon-add" />
                </svg>
                {formatMessage({
                  id: 'aminer.common.more',
                  defaultMessage: 'More',
                })}
              </Button>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default page(
  connect(({ loading, aminerConf }) => ({
    loading: loading.effects['aminerConf/SearchAuthors'],
    filters: aminerConf.filters,
    isMobileClickMenu: aminerConf.isMobileClickMenu,
    authorsModel: aminerConf.SearchAuthorsData,
  })),
)(AuthorList);
