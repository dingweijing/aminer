import React, { useState } from 'react';
import { component, connect } from 'acore';
import { classnames } from 'utils';
import { FM } from 'locales';
import { getProfileUrl } from 'utils/profile-utils';
import PropTypes from 'prop-types';
import { getSearchPathname } from 'utils/search-utils';
import display from 'utils/display';
import styles from './PaperKeywords.less';

const showMaxSize = 5;
const PaperKeywords = props => {
  const { list: keywords, dispatch, showHead } = props;
  const [more, setMore] = useState(false);

  const seeMore = () => setMore(!more);

  const renderList = (items) => {
    return items && items.length > 0 && items.map((n, m) => {
      return <span key={m} className={styles.keyWord}>{n}</span>
    })
  };

  const list = keywords && keywords.filter(item => !!item)

  // const clickTagToSearch = (query) => {
  //   dispatch({ type: 'searchperson/toggleAdvancedSearch', payload: true });
  //   router.push(getSearchPathname(query));
  // }

  if (!list || (list && !list.length)) {
    return null;
  }

  return (
    <div className={styles.paperKeywords}>
      {showHead && (
        <div className={styles.keyLabel}>
          <span className={styles.keyText}>
            <FM id="aminer.search.placeholder.keywords" defaultMessage="Keywords" />
          </span>
          <FM id='aminer.common.colon' defaultMessage=': ' />
        </div>
      )}
      <div className={styles.list}>
        {list && list.length > 0 && renderList(list.slice(0, showMaxSize))}
        {list && list.length > showMaxSize && more && renderList(list.slice(showMaxSize), true)}
        {list && list.length > showMaxSize && (
          <a onClick={seeMore} className={styles.more}>
            {more ? <FM id="aminer.common.less" defaultMessage='Less' />
              : <span><FM id="aminer.common.more" defaultMessage='More' />{`(${(list && list.length) - 5}+)`}</span>}
          </a>
        )}
      </div>
    </div >
  )
}

PaperKeywords.propTypes = {
  showHead: PropTypes.bool,
}

PaperKeywords.defaultProps = {
  showHead: true,
}

export default component(connect())(PaperKeywords)
