import React, { useEffect, useState } from 'react';
import { page, connect, Link, FormCreate } from 'acore';
import { classnames } from 'utils';
import { formatMessage, FM, enUS } from 'locales';
import { isLogin } from 'utils/auth';
import { Radio } from 'antd';
import PropTypes from 'prop-types';
// import ConfSearchBox from '../ConfSearchBox';
import styles from './StatsAndFilters.less';

const categoryDict = {
  0: 'all',
  1: 'Poster Presentations',
  2: 'Spotlight Presentations',
  3: 'Oral Presentations',
};
const StatsAndFilters = props => {
  const [current, setCurrent] = useState('all');
  const { total = {}, filters, dispatch, SetOrGetViews, confInfo } = props;
  const { categoryConfig } = props;
  const defaultCategory = (confInfo.config && confInfo.config.paper.category) || categoryConfig;

  const onChangeType = e => {
    if (SetOrGetViews) {
      SetOrGetViews('click', dispatch, confInfo.id);
    }
    const category = e && e.target && e.target.value;
    dispatch({
      type: 'aminerConf/setSysTrack',
      payload: {
        type: 'conf_system',
        target_type: confInfo.short_name,
        target_name: 'paper',
        payload: JSON.stringify({ category }),
      },
    });
    setCurrent(e.target.value);
    dispatch({ type: 'aminerConf/updateFilters', payload: { category } });
  };

  useEffect(() => {
    const { category } = filters || {};
    if (category) {
      setCurrent(category);
    }
  }, [filters]);

  return (
    <div className={styles.statsAndFilters}>
      <div className="resultStats">
        {!!total.total && (
          <span className="stats">
            <span className="count">{total.total}</span>
            <FM id="aminer.conf.paper.results" />
          </span>
        )}
        {(total.poster_total || total.spotlight_total || total.oral_total) && <span>( </span>}
        {total.poster_total && (
          <span className="stats">
            <span className="count">{total.poster_total}</span>
            Poster
          </span>
        )}
        {total.poster_total && total.spotlight_total && <span>, </span>}
        {total.spotlight_total && (
          <span className="stats">
            <span className="count">{total.spotlight_total}</span>
            Spotlight
          </span>
        )}
        {total.oral_total && total.spotlight_total && <span>, </span>}
        {total.oral_total && (
          <span className="stats">
            <span className="count">{total.oral_total}</span>
            Oral
          </span>
        )}
        {(total.poster_total || total.spotlight_total || total.oral_total) && <span>)</span>}
      </div>
      {/* {props.onSearch && <ConfSearchBox onSearch={props.onSearch} />} */}
      <div className="filters">
        <Radio.Group onChange={onChangeType} value={current}>
          {defaultCategory &&
            defaultCategory.length > 0 &&
            defaultCategory.map((category, index) => {
              return (
                <Radio value={categoryDict[index]} key={category}>
                  {category}
                </Radio>
              );
            })}
        </Radio.Group>
      </div>
    </div>
  );
};

StatsAndFilters.propTypes = {
  categoryConfig: PropTypes.array,
};

StatsAndFilters.defaultProps = {
  categoryConfig: ['All', 'Poster', 'Spotlight', 'Oral'],
};

export default page(
  connect(({ aminerConf }) => ({
    filters: aminerConf.filters,
  })),
)(StatsAndFilters);
