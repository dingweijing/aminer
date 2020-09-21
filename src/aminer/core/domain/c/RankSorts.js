import React from 'react'
import { FM } from 'locales';
import { classnames } from 'utils';
import styles from './RankSorts.less';

const RankSorts = (props) => {
  const { onTopRankSortChange, topRankSort } = props;
  return (
    <div className={styles.rankSorts}>
      <div className={classnames(styles.rankItem, (topRankSort === 'hindex' && styles.rankSelected))} onClick={() => onTopRankSortChange('hindex')}>
        <FM id='aminer.rank.sort.h_index' />
      </div>
      <div className={classnames(styles.rankItem, (topRankSort === 'citation' && styles.rankSelected))} onClick={() => onTopRankSortChange('citation')}>
        <FM id='aminer.rank.sort.n_citation' />
      </div>
      <div className={classnames(styles.rankItem, (topRankSort === 'pubs' && styles.rankSelected))} onClick={() => onTopRankSortChange('pubs')}>
        <FM id='aminer.rank.sort.n_pubs' />
      </div>      
    </div>
  )
}

export default RankSorts
