import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'acore';
import { Tag, Tabs } from 'antd';
import { FM } from 'locales';
import { classnames } from 'utils';
import { Hole } from 'components/core';
import styles from './SearchSorts.less';


// time // TODO special for time
const defaultSorts = ['relevance', 'h_index', 'activity', 'rising_star', 'n_citation', 'n_pubs'];

export default class SearchSorts extends PureComponent {
  // static displayName = 'SearchSorts';

  static propTypes = {
    sorts: PropTypes.array,
    sortKey: PropTypes.object.isRequired,
    rightZone: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
    onSortChange: PropTypes.func,
  };

  static defaultProps = {
    // Note: default value只在使用component时不传参数时生效。传空进来并不能生效。
    sorts: defaultSorts,
    // sortKey: '',
    rightZone: [],
  };

  onSortChange = (e) => {
    const { onSortChange } = this.props;
    if (onSortChange) {
      onSortChange(e);
    }
  };

  render() {
    const { sorts, rightZone, sortKey, className, changeMode } = this.props;
    if (!sorts || sorts.length <= 0) {
      return false;
    }

    // render rightZone
    const rightZoneJSXs = rightZone && rightZone.length > 0 && (
      <div className={styles.exportButtonZone} key="rzjsx">
        {rightZone && rightZone.length > 0 && rightZone.map((block) => {
          return block && block({ sortKey });
        })}
      </div>
    );

    // TODO but div ???
    const rightZoneJSX = <Hole fill={rightZone} param={{ sortKey }} />;

    const sortByKey = sortKey.key;

    return (
      <div className={styles.searchSorts}>
        <Tabs
          className={classnames(styles[className])}
          defaultActiveKey={sortByKey}
          activeKey={sortByKey}
          size="small"
          onChange={this.onSortChange}
          tabBarExtraContent={changeMode ? rightZoneJSXs : null}
        >
          {sorts.map((sortItem) => {
            if (!sortItem) {
              return null;
            }
            const icon = sortItem === sortByKey
              ? (
                <svg width="8px" height="8px" viewBox="0 0 8 8" version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink">
                  <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Group-302-Copy-3" transform="translate(-418.000000, -478.000000)" fill="#5396CF" fillRule="nonzero">
                      <g id="Group-126-Copy-3" transform="translate(418.000000, 478.000000)">
                        <g id="Group-122">
                          <polygon id="Rectangle-62-Copy" points="0 6 7.18896484 6 7.18896484 7.71428571 0 7.71428571" />
                          <rect id="Rectangle-62-Copy-2" x="0" y="3" width="5.14285714" height="1.71428571" />
                          <rect id="Rectangle-62-Copy-3" x="0" y="0" width="7.18896484" height="1.71428571" />
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              )
              : '';
            const label = <FM id={`com.search.sort.label.${sortItem}`} defaultMessage={sortItem} />;
            return <Tabs.TabPane tab={<span>{label} {icon}</span>} key={sortItem} />;
          })}
        </Tabs>
      </div>

    );
  }
}
