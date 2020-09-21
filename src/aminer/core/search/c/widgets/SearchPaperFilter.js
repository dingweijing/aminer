import React, { useState, useEffect, useMemo, useRef } from 'react';
import { formatMessage, FM } from 'locales';
import { Collapse, Checkbox, Icon, Input, Button, Tree } from 'antd';
import { connect, P, withRouter, component } from 'acore';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import { isRoster, isPeekannotationlog, isTempAnno } from 'utils/auth';
import { OrgEdit, VenueEdit } from 'aminer/core/search/c/widgets';
import { getLocale } from 'locales';
import NumberInputBox from './NumberInputBox';
import SearchFilterTime from './SearchFilterTime';
import SearchFilterContent from './SearchFilterContent';
import helper from 'helper';
import searchConfigs from '../../searchconfigs';

import styles from './SearchPaperFilter.less';

const { Panel } = Collapse;
const { TreeNode } = Tree;

const { resource, fieldsTreeData, getFieldChildren, domainsTreeData } = searchConfigs;

const customPanelStyle = {
  borderRadius: 2,
  marginBottom: 12,
  overflow: 'hidden',
  border: '1px solid #D8D8D8',
};

const SearchPaperFilter = props => {
  const { query, callSearch,
    // resourceSelected, 
    fieldSelected, timeSelected, venuesSelected, orgSelected, keywordsSelected,
    domainSelected,
    siderFilterVisibleOnMobile,
    statistics, statistics_all,
    sortKey,
    user,
  } = props;
  const [timeExpanded, setTimeExpanded] = useState(false);
  const [inputYearStart, setInputYearStart] = useState(null);
  const [inputYearEnd, setInputYearEnd] = useState(null);

  const lang = getLocale();

  const [venuesFilter, orgFilter, keywordsFilter] = useMemo(() => {
    const venues = [], orgs = [], keywords = [];
    if (statistics_all && statistics_all.topVenues ) {
      statistics_all.topVenues.forEach(item => {
        venues.push({en: item.value || item.value_zh, zh: item.value_zh || item.value, value: item.label});
      })
    }
    if (statistics_all && statistics_all.topOrgs) {
      statistics_all.topOrgs.forEach(item => {
        orgs.push({en: item.value || item.value_zh, zh: item.value_zh || item.value, value: item.label});
      })
    }
    if (statistics_all && statistics_all.topKeywords) {
      statistics_all.topKeywords.forEach(item => {
        keywords.push({en: item.value , zh: item.value, value: item.label});
      })
    }
    return [venues, orgs, keywords];
  }, [statistics_all, lang])

  const { timesChecked, timeRangeStart, timeRangeEnd } = useMemo(() => {
    const times = {
      timesChecked: [],
      timeRangeStart: null,
      timeRangeEnd: null
    };
    if (timeSelected && timeSelected.includes('-')) {
      const [ timeRangeStart, timeRangeEnd ] = timeSelected.split('-').sort((a, b) => { return Number(a) - Number(b)});
      times.timeRangeStart = timeRangeStart;
      times.timeRangeEnd = timeRangeEnd;
      setInputYearStart(timeRangeStart);
      setInputYearEnd(timeRangeEnd);
    } else {
      const timesChecked = (timeSelected && timeSelected.split('+') || []);
      times.timesChecked = timesChecked;
      setInputYearStart(null);
      setInputYearEnd(null);
    }
    return times;
  }, [timeSelected])

  const filterSellectedKeys = (filterSelected) => {
    if (filterSelected) return filterSelected.split('+');
    return [];
  };

  const domainCheckedKeys = useMemo(() => filterSellectedKeys(domainSelected), [domainSelected]);
  const fieldCheckedKeys = useMemo(() => filterSellectedKeys(fieldSelected), [fieldSelected]);
  const orgSelectedKeys = useMemo(() => filterSellectedKeys(orgSelected), [orgSelected, lang]);
  const venuesSelectedKeys = useMemo(() => filterSellectedKeys(venuesSelected), [venuesSelected, lang]);
  const keywordsSelectedKeys = useMemo(() => filterSellectedKeys(keywordsSelected), [keywordsSelected, lang]);

  const searchBtnSwtichCancel = useMemo(() => {
    if (inputYearStart && inputYearEnd && inputYearStart === timeRangeStart && inputYearEnd === timeRangeEnd) {
      return true;
    } else return false;
  }, [inputYearStart, inputYearEnd, timeRangeStart, timeRangeEnd])

  // const onResourceChecked = resource => {
  //   if (resource.length) {
  //     helper.routeTo(props, {resource: resource.join('+')}, null);
  //   } else {
  //     helper.routeTo(props, {}, {}, {
  //       removeParams: ['resource']
  //     })
  //   }
  // }
  const onFilterChecked = (checkedKeys, filter) => {
    if (checkedKeys.length) {
      helper.routeTo(props, { [filter]: checkedKeys.join('+') }, null);
    } else {
      helper.routeTo(props, {}, null, {
        removeParams: [filter]
      })
    }
  };

  const onDomainChecked = (checkedKeys) => onFilterChecked(checkedKeys, 'domain');
  const onFieldChecked = (checkedKeys) => onFilterChecked(checkedKeys, 'field');
  const onOrgChecked = (checkedKeys) => onFilterChecked(checkedKeys, 'org');
  const onVenuesChecked = (checkedKeys) => onFilterChecked(checkedKeys, 'conference');
  const onKeywordsChecked = (checkedKeys) => onFilterChecked(checkedKeys, 'topkeywords');

  const onDomainClick = (clickedKey) => {
    if (!clickedKey) return;
    const fieldChildren = getFieldChildren(clickedKey);
    let fieldChildrenKey = [];
    if (fieldChildren && fieldChildren.length) {
      fieldChildrenKey = fieldChildren.map(item => item.title);
    }
    let newDomainChecked = [];
    if (domainCheckedKeys.includes(clickedKey)) {
      newDomainChecked = domainCheckedKeys.filter(item => item !== clickedKey && (fieldChildrenKey && !fieldChildrenKey.includes(item)));
    } else {
      newDomainChecked = [...domainCheckedKeys].concat(clickedKey, ...fieldChildrenKey);
    }
    onDomainChecked(newDomainChecked);
  }

  const onFieldClick = (clickedKey) => {
    if (!clickedKey) return;
    const fieldChildren = getFieldChildren(clickedKey);
    let fieldChildrenKey = [];
    if (fieldChildren && fieldChildren.length) {
      fieldChildrenKey = fieldChildren.map(item => item.title);
    }
    let newFieldChecked = [];
    if (fieldCheckedKeys.includes(clickedKey)) {
      newFieldChecked = fieldCheckedKeys.filter(item => item !== clickedKey && (fieldChildrenKey && !fieldChildrenKey.includes(item)));
    } else {
      newFieldChecked = [...fieldCheckedKeys].concat(clickedKey, ...fieldChildrenKey);
    }
    onFieldChecked(newFieldChecked);
  }

  const timeRangeFilter = useMemo(() => {
    return (
      <div className={styles.timeRangeFilter}>
        <SearchFilterTime 
          inputYearStart={inputYearStart} 
          setInputYearStart={setInputYearStart}
          inputYearEnd={inputYearEnd}
          setInputYearEnd={setInputYearEnd}
          searchBtnSwtichCancel={searchBtnSwtichCancel}
          sortKey={sortKey}
        />
      </div>
    )
  }, [searchBtnSwtichCancel, inputYearStart, inputYearEnd, sortKey]);

  return (
    <div className={classnames(
      styles.searchPaperFilter, 
      !siderFilterVisibleOnMobile && styles.searchPaperFilterHide, 
      (!isRoster(user) && !isPeekannotationlog(user) && !isTempAnno(user)) && styles.limitThreeRows
    )}>
      <Collapse
        bordered={false}
        defaultActiveKey={['time', 'org', 'venues', 'field', 'keywords', 'domain']}
        expandIconPosition="right"
        expandIcon={({ isActive }) => (
          <svg
            className={classnames(styles.collapseIcon, { [styles.collapseIconRotate]: isActive })}
            aria-hidden="true"
          >
            <use xlinkHref="#icon-PathCopy" />
          </svg>
        )}
      >
        <Panel
          header={PanelHeader('#icon-Group', 'aminer.search.filter.time', 'Time')}
          key="time"
          style={customPanelStyle}
        >
          {timeRangeFilter}
        </Panel>
        {/* <Panel
          header={PanelHeader('#icon-Group1', 'aminer.search.filter.resource', 'Resource')}
          key="resource"
          style={customPanelStyle}
        >
          <SearchFilterContent
            isTree={false}
            useExpanded={false}
            useFM={true}
            checkOptions={resource}
            onChecked={onResourceChecked}
            checkedKey={resourceSelectedKeys}
          />
        </Panel> */}
        {orgFilter && !!orgFilter.length && (isRoster(user) || isPeekannotationlog(user) || isTempAnno(user)) && (<OrgEdit />)}
        {orgFilter && !!orgFilter.length && (
          <Panel
            header={PanelHeader('#icon-Institution', 'aminer.search.statistics.org', 'Organization')}
            key="org"
            style={customPanelStyle}
          >
            <SearchFilterContent
              isTree={false}
              useExpanded={true}
              useFM={false}
              showLangSearchValue={true} // 根据语言切换显示名称，以 checkOptions.value 作为 filter 条件
              checkOptions={orgFilter}
              onChecked={onOrgChecked}
              checkedKey={orgSelectedKeys}
            />
          </Panel>
        )}
        {venuesFilter && !!venuesFilter.length && (isRoster(user) || isPeekannotationlog(user) || isTempAnno(user)) && (<VenueEdit />)}
        {venuesFilter && !!venuesFilter.length && (
          <Panel
            header={PanelHeader('#icon-Journals', 'aminer.search.statistics.venue', 'Journal / Conference')}
            key="venues"
            style={customPanelStyle}
          >
            <SearchFilterContent
              isTree={false}
              useExpanded={true}
              useFM={false}
              showLangSearchValue={true} // 根据语言切换显示名称，以 checkOptions.value 作为 filter 条件
              checkOptions={venuesFilter}
              onChecked={onVenuesChecked}
              checkedKey={venuesSelectedKeys}
            />
          </Panel>
        )}
        {keywordsFilter && !!keywordsFilter.length && (
          <Panel
            header={PanelHeader('#icon-guanjianci', 'aminer.search.advance.keywords', 'Key words')}
            key="keywords"
            style={customPanelStyle}
          >
            <SearchFilterContent
              isTree={false}
              useExpanded={true}
              useFM={false}
              showLangSearchValue={true} // 根据语言切换显示名称，以 checkOptions.value 作为 filter 条件
              checkOptions={keywordsFilter}
              onChecked={onKeywordsChecked}
              checkedKey={keywordsSelectedKeys}
            />
          </Panel>
        )}
        
        {/* <Panel
          header={PanelHeader('#icon-yixuekepu-', 'aminer.search.filter.subject', 'Subject')}
          key="field"
          style={customPanelStyle}
        >
          <SearchFilterContent
            isTree={true}
            useExpanded={true}
            useFM={true}
            checkOptions={fieldsTreeData}
            onChecked={onFieldChecked}
            onTreeNodeClick={onFieldClick}
            checkedKey={fieldCheckedKeys}
            showOptionCnt={8}
          />
        </Panel> */}
{/* 
        <Panel
          header={PanelHeader('#icon-yixuekepu-', 'aminer.search.filter.domain', 'Channel')}
          key="domain"
          style={customPanelStyle}
        >
          <SearchFilterContent
            isTree={true}
            useExpanded={true}
            useFM={true}
            checkOptions={domainsTreeData}
            onChecked={onDomainChecked}
            onTreeNodeClick={onDomainClick}
            checkedKey={domainCheckedKeys}
            showOptionCnt={8}
          />
        </Panel> */}
      </Collapse>
    </div>
  );
};

export default component(
  connect(({ searchpaper, auth }) => ({
    statistics: searchpaper.statistics,
    statistics_all: searchpaper.statistics_all,
    user: auth.user
  })),
  withRouter
)(SearchPaperFilter)

const PanelHeader = (icon, formatMessageId, defaultMessage ) => {
  return (
    <div className={styles.icon_section}>
      <svg className={styles.icon} aria-hidden="true">
        <use xlinkHref={icon} />
      </svg>
      {formatMessage({ id: formatMessageId, defaultMessage })}
    </div>
  )
}
