import React from 'react';
import PropTypes from 'prop-types';
import { connect,  withRouter, component } from 'acore';
import { Layout } from 'antd';
import { theme } from 'themes';
import { Hole } from 'components/core';
import consts from 'consts';
import classnames from 'classnames';
import helper from 'helper';
import { getSearchPathname, getParamsFromUrl } from 'utils/search-utils'
import { SearchBox } from 'aminer/core/search/c/control';
import HeaderLeftZone from './HeaderLeftZone';
import styles from './Header.less';

const version = 'v1';
const imgPath = `${consts.ResourcePath}/sys/aminer/layout/${version}`;

const defaultRightZone = theme.rightZone;
const defaultLeftZone = theme.leftZone;

const Header = props => {
  const { headerSize, showSearch, leftZone, rightZone, covidHeader, pageHeaderFixed, showNav } = props;
  const { query, className, disableAdvancedSearch, isAdvancedSearch, showAdvanceFilterIcon, location } = props;

  const { pathname } = location;


  const callSearch = (changes, clearFilter = true) => {
    const { query: { queryObject, advanceFilter }, } = changes;
    if ((queryObject.query && queryObject.query !== '-' && queryObject.query.trim()) ||
      (queryObject.advanced && (queryObject.advanced.term || queryObject.advanced.name || queryObject.advanced.org)) ||
      (advanceFilter)) {
      let params = {};
      const removeParams = [];
      let newUrl = '';

      if (clearFilter) {
        newUrl = getSearchPathname(queryObject);
        params = getParamsFromUrl(newUrl);
        removeParams.push('searchIn', 'author', 'conference', 'keywords', 'org', 'time', 'field', 'sortKey');
      } else {
        newUrl = getSearchPathname(queryObject, advanceFilter);
        params = getParamsFromUrl(newUrl);
        if (advanceFilter) {
          if (!advanceFilter.searchIn || advanceFilter.searchIn === 'all') {
            removeParams.push('searchIn');
          }
          if (!advanceFilter.author) {
            removeParams.push('author');
          }
          if (!advanceFilter.conference) {
            removeParams.push('conference');
          }
          if (!advanceFilter.keywords) {
            removeParams.push('keywords');
          }
        }
      }
      if (queryObject.advanced) {
        removeParams.push('q');
      } else {
        removeParams.push('k', 'n', 'o');
      }
 
      // if (showAdvanceFilterIcon) {
      if (pathname.startsWith('/search')) {
        helper.routeTo(props, params, null, { removeParams });
      } else {
        window.location.href = newUrl;
      }
    }
  }

  const onSearch = (q, clearFilter) => callSearch({ query: q }, clearFilter)

  return (
    <div className={classnames(styles.headerBg, { [styles.headerFixed]: pageHeaderFixed }, styles[className])}>
      <Layout.Header className={classnames(styles.header, styles[className], styles[headerSize])}>

        <div className={styles.left}>
          <Hole defaults={defaultLeftZone} fill={leftZone} param={{ className, showSearch, showNav }} />
        </div>

        {showSearch && (
          <div className={styles.center}>
            <SearchBox
              className={className}
              queryObject={query}
              showSearchIcon
              onSearch={onSearch}
              disableAdvancedSearch={disableAdvancedSearch}
              showAdvanceFilterIcon={showAdvanceFilterIcon}
            />
          </div>
        )}

        {covidHeader && (
          <div className={styles.covidMenu}>{covidHeader}</div>
        )}

        <div className={classnames(styles.right, { [styles.noRightZone]: covidHeader, [styles.noSearch]: !showSearch })}>
          <Hole
            defaults={defaultRightZone}
            fill={rightZone}
            param={{ className }}
          />
        </div>

      </Layout.Header>
    </div>
  );
}

Header.propTypes = {
  rightZone: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  leftZone: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  className: PropTypes.string,
  pageHeaderFixed: PropTypes.bool,
}
Header.defaultProps = {
  // className: 'home',
  rightZone: false,
  leftZone: false,
  pageHeaderFixed: false
};

export default component(withRouter, connect(({ aminerSearch, searchmodel }) => ({
  disableAdvancedSearch: aminerSearch.disableAdvancedSearch,
  isAdvancedSearch: searchmodel.isAdvancedSearch,
})))(Header);
