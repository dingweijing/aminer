import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'acore';
import { FM } from 'locales';
import { classnames } from 'utils';
import { Tag } from 'antd';
import { sysconfig } from 'systems';
import styles from './SearchPaperCurrentFilter.less';

/**
 * SearchPaperCurrentFilter Component
 * 论文搜索当前已选的 filter
 */

const SearchPaperCurrentFilter = props => {
  const { onFilterChange, filters, className } = props;

  const onFilterClose = (key, value) => {
    if (onFilterChange) onFilterChange(key, value);
  };

  const getFilterValue = (key, value) => {
    if (key === 'field' || key === 'resource') {
      return <FM id={`aminer.search.filter.field.${value.split(' ').join('_')}`} defaultMessage={value} />;
    }
    if (key === 'searchIn') {
      return <FM id={`com.search.filter.value.searchIn.${value}`} defaultMessage={value} />;
    }
    if (key === 'author') {
      return value.split('@')[0];
    }
    return <span title={value}>{value}</span>;
  };

  if (!filters || !filters.length) return <></>;

  return (
    <div className={classnames(styles.searchPaperCurrentFilter)}>
      <div className={styles.filter}>
        {/* ------ 过滤条件 ------ */}
        <div className={styles.filterRow}>
          <span className={styles.filterTitle}>
            <FM id="com.search.filter.Filters" defaultMessage="Filters:" />
          </span>
          <ul className={styles.filterItems}>
            {filters.map((filter, index) => {
              const { key, value } = filter;
              return (
                <Tag
                  key={`${key}${value}${index}`}
                  className={styles.filterItem}
                  closable={true}
                  onClose={() => onFilterClose(key, value)}
                  color="geekblue"
                >
                  <FM id={`com.search.filter.label.${key}`} defaultMessage={key} />:{' '}
                  {getFilterValue(key, value)}
                </Tag>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchPaperCurrentFilter;
