import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'acore';
import { Tag, Tabs } from 'antd';
import { FM } from 'locales';
import { classnames } from 'utils';
import consts from 'consts';
import { Hole } from 'components/core';
import styles from './SearchSortsV2.less';


// time // TODO special for time
const defaultSorts = ['relevance', 'h_index', 'activity', 'rising_star', 'n_citation', 'n_pubs'];

const SearchSortsV2 = props => {
  const { sorts = defaultSorts, rightZone = [], sortKey, className, onSortChange } = props;
  const sortByKey = sortKey.key;

  if (!sorts || sorts.length <= 0) {
    return <></>;
  }

  // render rightZone
  const rightZoneJSXs = useMemo(() => {
    if (rightZone && !!rightZone.length) {
      return (
        <div className={classnames(styles.exportButtonZone, 'desktop_device')} key="rzjsx">
          {rightZone && rightZone.length > 0 && rightZone.map((block) => {
            return block && block({ sortKey });
          })}
        </div>
      );
    }
  }, []);

  const rightZoneJSX = useMemo(() => <Hole fill={rightZone} param={{ sortKey }} />, []);

  const TabPanes = useMemo(() => {
    return sorts.map((sortItem, index) => {
      let icon = null;
      const label = <FM id={`com.search.sort.label.${sortItem}`} defaultMessage={sortItem} />;
      return <Tabs.TabPane key={`${sortItem}${index}`} tab={<div className={styles.tabName}>{icon}{label}</div>} key={sortItem} />;
    })
  }, [sorts])

  return (
    <div className={styles.searchSorts}>
      <Tabs
        className={classnames(styles[className])}
        defaultActiveKey={sortByKey}
        activeKey={sortByKey}
        size="small"
        onChange={onSortChange}
        tabBarExtraContent={rightZoneJSXs}
      >
        {TabPanes}
      </Tabs>
    </div>

  );

}

export default SearchSortsV2;
