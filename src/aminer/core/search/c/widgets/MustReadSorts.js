import React from 'react';
import { FM, formatMessage } from 'locales';
import { classnames } from 'utils';
import styles from './MustReadSorts.less';

const mustReadSortKeys = ['year', 'n_citation', 'like', 'selected'];

const MustReadSorts = (props) => {
  const {searchSortsKey, mustReadSortKey, onMustReadSortKeyChange} = props;
  if (!searchSortsKey || searchSortsKey.key !== 'must_reading') {
    return null;
  }
  return (
    <div className={styles.mustReadZone}>
      <div className={styles.mustReadSort}>
        {mustReadSortKeys.map(key => (
          <a 
            key={key} 
            className={classnames(styles.sortItem, mustReadSortKey === key && styles.sortSelected)} 
            onClick={() => onMustReadSortKeyChange(key)}
          >
            <FM id={`aminer.paper.${key}`} />
          </a>
        ))}
      </div> 
    </div>
  )
}

export default MustReadSorts
