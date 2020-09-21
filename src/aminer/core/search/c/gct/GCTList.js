import React, { useMemo } from 'react';
import { classnames } from 'utils';
import SearchEBList from './SearchEBList';
import styles from './GCTList.less';

const GCTList = props => {
  const { list, className, ...params } = props;

  return (
    <ul className={classnames(styles.gctList, styles[className], 'search_gct_list')}>
      {list && list.map(eb => (
        <li key={eb.id} className="list_item">
          <SearchEBList data={eb} {...params} />
        </li>
      ))
      }
    </ul>
  )
}

export default (React.memo(GCTList));
