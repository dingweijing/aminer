import React, { useEffect, useState } from 'react';
import { loadD3v5 } from 'utils/requirejs';
import { component, connect, withRouter } from 'acore';
import { Tabs, Input, Select } from 'antd';
import { FM, formatMessage } from 'locales';
import { classnames } from '@/utils';
import helper from 'helper';
import { PaperStatisticsCharts } from 'aminer/core/search/c/widgets';
import styles from './SearchResultStatistics.less';
const { TabPane } = Tabs;
const { Option } = Select;
const colors = ['#4285f4', '#db4437', '#f4b400', '#ab47bc', '#00acc1'];
const nameMaxLen = 30;

const TopStatistics = props => {
  const { topItems, searchByItem, isItemSelected, itemType } = props;

  const onClick = (item, itemSelected) => {
    if (!itemSelected && searchByItem) {
      searchByItem(item.value, item.id)
    }
  }
  if (!topItems.length) {
    return <span>No Result</span>
  }
  return topItems.map((item, index) => {
    let valueDisplay = item.value;
    if (item.value.length > nameMaxLen) {
      valueDisplay = `${item.value.slice(0, nameMaxLen)}...`;
    }
    const itemSelected = isItemSelected(item, itemType);
    return (
      <div key={`${item.value}${index}`} className={styles.topItemsRow}>
        <div className={styles.colorBlock} style={{ backgroundColor: index < 5 ? colors[index] : '#fff' }} />
        <div className={styles.valueBlock}>
          <div className={classnames(styles.value, searchByItem && styles.clickAble, itemSelected && styles.clickDisabled)}
            title={item.value}
            onClick={() => onClick(item, itemSelected)}
          >
            {valueDisplay}
          </div>
          {/* <div className={styles.precent}>{item.count}</div> */}
          <div className={styles.precent}>{item.percent}%</div>
        </div>
      </div>
    )
  })
}

const SearchResultStatistics = (props) => {
  const { query, statistics, dispatch, onYearIntervalChange } = props;
  const [tabActiveKey, setTabActiveKey] = useState('author');
  const [authorExpanded, setAuthorExpanded] = useState(false);
  const [venuesExpanded, setVenuesExpanded] = useState(false);

  const { author = '', conference = '' } = helper.parseUrlParam(props, {}, ['author', 'conference']);
  const { top5AuthorsProportion = [], topVenues = [] } = statistics || {};

  const onTabChange = (tabKey) => {
    setTabActiveKey(tabKey);
  }

  const toogleAuthorExpanded = () => {
    setAuthorExpanded(!authorExpanded);
  }

  const toogleVenuesExpanded = () => {
    setVenuesExpanded(!venuesExpanded);
  }

  const searchByItem = (value, id) => {
    if (tabActiveKey === 'author') {
      const curAuthor = author.split('+');
      if (curAuthor.includes(value)) {
        const newAutor = curAuthor.map(item => {
          if (item === value) return `${value}@${id}`; // 如果高级搜索中已经存在相同的author, 则替换为带id的author
          return item;
        })
        helper.routeTo(props, { author: newAutor.join('+'), }, null);
      } else {
        helper.routeTo(props, { author: `${author}+${value}@${id}`, }, null);
      }
    } else if (tabActiveKey === 'venue') {
      helper.routeTo(props, { conference: `${conference}+${value}` }, null);
    }
  }

  const isItemSelected = (item, type) => {
    if (type === 'author') {
      return author.split('+').includes(`${item.value}@${item.id}`);
    }
    if (type === 'conference') {
      return conference.split('+').includes(item.value);
    }
  }

  if (!statistics || !Object.keys(statistics).length) {
    return <></>;
  }

  return (
    <div className={styles.searchResultStatistics}>
      <div className={styles.statisticsDesc}>
        <div className={styles.desc}><FM id='aminer.search.statistics.absolute' defaultMessage='Top 10,000 results' /></div>
        <div className={styles.yearChangeWrap}>
          <Select defaultValue={1} onChange={onYearIntervalChange} className={styles.yearSelect} dropdownMatchSelectWidth={false}>
            <Option value={1} style={{ fontSize: 12 }}>
              <FM id='aminer.search.statistics.gap1' defaultMessage='Every year' />
            </Option>
            <Option value={3} style={{ fontSize: 12 }}>
              <FM id='aminer.search.statistics.gap3' defaultMessage='Every 3 years' />
            </Option>
            <Option value={5} style={{ fontSize: 12 }}>
              <FM id='aminer.search.statistics.gap5' defaultMessage='Every 5 years' />
            </Option>
            <Option value={10} style={{ fontSize: 12 }}>
              <FM id='aminer.search.statistics.gap10' defaultMessage='Every 10 years' />
            </Option>
          </Select>
        </div>

      </div>
      <PaperStatisticsCharts statistics={statistics} tabActiveKey={tabActiveKey} />
      <div className={styles.statisticsDesc}>
        <div className={styles.desc}>
          <FM
            id='aminer.search.statistics.relavite'
            defaultMessage='Relative statistics of results'
            values={{
              statisticsItem: formatMessage({ id: `aminer.search.statistics.${tabActiveKey}` })
            }}
          />
        </div>
      </div>
      <div className={styles.relativeStatistics}>
        {/* <TopStatistics topItems={authorExpanded ? topAuthors : topAuthors.slice(0, 5)} searchByItem={searchByItem} isItemSelected={isItemSelected} itemType='author'/>
        {topAuthors.length >= 5 && (
          <span className={styles.expandBtn} onClick={toogleAuthorExpanded}>
            {authorExpanded ?
              <FM id='aminer.search.statistics.collapse' defaultMessage='Collapse' /> :
              <FM id='aminer.search.statistics.expand' defaultMessage='Expand' />
            }
          </span>
        )} */}
        {/* 不能点击且显示百分比 */}
        <TopStatistics topItems={top5AuthorsProportion} isItemSelected={isItemSelected} itemType='author' />
      </div>
      {/* <div className={styles.relativeStatistics}>
        <Tabs activeKey={tabActiveKey} animated={false} onChange={onTabChange}>
          <TabPane tab={formatMessage({ id: 'aminer.search.statistics.author', defaultMessage: 'Author'})} key="author">
            <TopStatistics topItems={authorExpanded ? topAuthors : topAuthors.slice(0, 5)} searchByItem={searchByItem} isItemSelected={isItemSelected} itemType='author'/>
            {topAuthors.length >= 5 && (
              <span className={styles.expandBtn} onClick={toogleAuthorExpanded}>
                {authorExpanded ?
                  <FM id='aminer.search.statistics.collapse' defaultMessage='Collapse' /> :
                  <FM id='aminer.search.statistics.expand' defaultMessage='Expand' />
                }
              </span>
            )}
          </TabPane>
          <TabPane tab={formatMessage({ id: 'aminer.search.statistics.venue', defaultMessage: 'Journal / Conference'})} key="venue">
            <TopStatistics topItems={venuesExpanded ? topVenues : topVenues.slice(0, 5)} searchByItem={searchByItem} isItemSelected={isItemSelected} itemType='conference'/>
            {topVenues.length >= 5 && (
              <span className={styles.expandBtn} onClick={toogleVenuesExpanded}>
                {venuesExpanded ?
                  <FM id='aminer.search.statistics.collapse' defaultMessage='Collapse' /> :
                  <FM id='aminer.search.statistics.expand' defaultMessage='Expand' />
                }
              </span>
            )}
          </TabPane>
        </Tabs>
      </div> */}
    </div>
  )
}

export default component(
  connect(({ searchpaper }) => ({
    statistics: searchpaper.statistics,
  })),
  withRouter,
)(SearchResultStatistics);
