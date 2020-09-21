import React, { useEffect, useState } from 'react';
import { FM, formatMessage } from 'locales';
import { classnames } from 'utils';
import styles from './MustReadSorts.less';

const mustReadSortKeys = ['year', 'n_citation', 'like'];
enum sortEnum {
  'year',
  'n_citation',
  'like',
}
interface Proptypes {
  mustReadSortKey: string;
  onMustReadSortKeyChange: (key: string) => void;
}

const MustReadSorts = (props: Proptypes) => {
  // const [key, setKey] = useState();
  const { mustReadSortKey, onMustReadSortKeyChange } = props;

  return (
    <div className={styles.mustReadSort}>
      {mustReadSortKeys.map(sort => (
        <a
          key={sort}
          className={classnames('sortItem', { sortSelected: mustReadSortKey === sort })}
          onClick={onMustReadSortKeyChange.bind(null, sort)}
        >
          <FM id={`aminer.paper.${sort}`} />
        </a>
      ))}
    </div>
  );
};

export default MustReadSorts;
