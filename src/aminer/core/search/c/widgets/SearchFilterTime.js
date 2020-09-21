import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Input, Button, AutoComplete } from 'antd';
import { connect, withRouter, component } from 'acore';
import { FM } from 'locales';
import moment from 'moment';
import helper from 'helper';
import { classnames } from 'utils';
import styles from './SearchFilterTime.less';

const { Option } = AutoComplete;
const yearOptionsLen = 100;

const SearchFilterTime = (props) => {
  const { inputYearStart, setInputYearStart, inputYearEnd, setInputYearEnd, 
    onPressEnter, searchBtnSwtichCancel, latestYearEnd, sortKey={} } = props;


  const onTimeRangeChange = () => {
    if (inputYearStart && inputYearEnd && inputYearStart.length === 4 && inputYearEnd.length === 4 &&
        Number(inputYearStart) > 0 && Number(inputYearEnd) > 0) {
      helper.routeTo(props, {time: `${inputYearStart}-${inputYearEnd}`}, null);
    }
  };

  const clearTimeRange = () => {
    helper.routeTo(props, {}, {}, {
      removeParams: ['time']
    })
    setInputYearStart(null);
    setInputYearEnd(null);
  }

  const thisYear = useMemo(() => moment().format('YYYY'));

  const yearOptions = useMemo(() => {
    const options = [];
    
    for(let i = 0; i < yearOptionsLen; i++) {
      const value = String(thisYear - i);
      options.push(<Option key={value} value={value}>{value}</Option>)
    }
    return options;
  }, [])

  const onFilterBtnClick = (gap) => {
    helper.routeTo(props, {time: `${thisYear - gap}-${thisYear}`}, null );

    if (inputYearEnd !== thisYear) {
      setInputYearEnd(String(thisYear));
    }
    if (inputYearStart !== thisYear - gap) {
      setInputYearStart(String(thisYear - gap))
    }
  }

  return (
    <div className={styles.searchFilterTime}>
      <div className={classnames(styles.timeRange, searchBtnSwtichCancel && styles.fontItalic)}>
        <AutoComplete 
          showArrow
          value={inputYearStart}
          style={{ width: '60px', fontSize: 12 }} 
          dropdownMatchSelectWidth={false} 
          onChange={setInputYearStart}
          defaultActiveFirstOption={false}
        >
          {yearOptions}
        </AutoComplete>
        <div className={styles.split}/>
        <AutoComplete 
          showArrow
          value={inputYearEnd}
          style={{ width: '60px', fontSize: 12 }} 
          dropdownMatchSelectWidth={false} 
          onChange={setInputYearEnd}
          defaultActiveFirstOption={false}
        >
          {yearOptions}
        </AutoComplete>
        <Button
          className={classnames(styles.timeFilterBtn, {
            [styles.timeFilterBtnCancel]: searchBtnSwtichCancel,
          })}
          onClick={searchBtnSwtichCancel ? clearTimeRange : onTimeRangeChange}
          onClick={searchBtnSwtichCancel ? clearTimeRange : onTimeRangeChange}
        >
          <svg className={styles.timeRangeIcon} aria-hidden="true">
            <use xlinkHref={searchBtnSwtichCancel ? '#icon-modal_close'  : '#icon-search1'} />
          </svg>
        </Button>
      </div>
      <div className={styles.recentTip}><FM id='aminer.search.filter.time.latest' defaultMessage=''/></div>
      <div className={styles.yearFilterBtn}>
        {[10, 5, 3].map(year => (
          <Button key={`yearFilter${year}`} className={styles.filterBtn} onClick={() => onFilterBtnClick(year)}>
            <FM id='aminer.search.filter.time.years' defaultMessage='' values={{ year }}/>
          </Button>
        ))}
      </div>
    </div>
  )
}

// export default SearchFilterTime;

export default component(
  connect(({ searchpaper }) => ({
      latestYearEnd: searchpaper.latestYearEnd,
  })),
  withRouter
)(SearchFilterTime)
