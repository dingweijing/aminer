import React, { useMemo, useEffect, Fragment } from 'react';
import { message } from 'antd';
import { page, connect } from 'acore';
import { Layout } from 'aminer/layouts';
import { FM, formatMessage, zhCN } from 'locales';
import helper, { getLangLabel } from 'helper';
import { classnames } from 'utils';
import { sysconfig } from 'systems';
import { getSearchPathname2, getParamsFromUrl, buildEsSearchCondition } from 'utils/search-utils'

import {
  SearchPaperComponentDynamic as SearchPaperComponent,
} from 'aminer/core/search/c';
import { AdvanceSearchBox } from 'aminer/core/search/c/control'
import searchConfigs from '../search/searchconfigs';
import styles from './paper.less';

const avaliableDomain = ['141', '142', '144', '145', '146'];
const domainMap = {
  '141': '人工智能',
  '142': '网络安全',
  '144': '云计算',
  '145': '大数据',
  '146': '智能机器人'
}

const ZhiJiangChannelPage = (props) => {
  const { dispatch, domainInfo } = props;

  const { domain = '141', sortKey, q } = helper.parseUrlParam(props, {}, ['domain', 'sortKey', 'q'])

  const sids = [domain - 0];

  // console.log('domain, sortKey ', domain, sortKey)
  const searchType = 'pub';
  const queryObj = useMemo(() => searchConfigs.composeQueryObject2(q, q, '', '', searchType), [q]);
  const searchSortsKey = { key: sortKey || 'relevance' };

  const esSearchCondition = useMemo(
    () => {
      const params = {
        domain,
        queryObj,
      }
      if (domain === 'all') {
        params.domain = avaliableDomain.join('+')
      }
      return buildEsSearchCondition(params)
    },
    [domain, queryObj],
  );

  const onSearchSubmit = ({ fieldsValue, advancedMode, selectedDomains: domain, query }) => {
    console.log('domain', domain)
    if (domain && domain.length && !avaliableDomain.includes(domain[0]) && domain[0] && domain[0] !== 'all') {
      return message.info(formatMessage({ id: 'aminer.zhijiang.channel.domain.error' }));
    }
    if ((!domain || !domain.length) && !query) {
      return message.info(formatMessage({ id: 'com.KgSearchBox.placeholder' }))
    }
    // 从搜索条件里构造新的 url 并跳转
    let queryObject = { query };
    let personAdvanceFilter = {}, paperAdvanceFilter = {};
    let urlParams = {}, removeUrlParams = [], newUrl = '';

    // 构造搜索对象和新的url
    if (searchType === 'person') {
      let { pid } = fieldsValue;
      pid = pid && pid.length ? pid.split(/[, ， ； ;]/) : [];
      if (advancedMode) {
        const { name, org } = fieldsValue;
        personAdvanceFilter = { n: name, o: org, k: query };
      }
      newUrl = getSearchPathname2(query, personAdvanceFilter, domain, searchType);
    } else if (searchType === 'pub') {
      if (advancedMode) {
        const { searchIn, author, conference, keywords } = fieldsValue;
        paperAdvanceFilter = { searchIn, author, conference, keywords };
      }
      newUrl = getSearchPathname2(query, paperAdvanceFilter, domain, searchType);
    }

    // 构造新的 url
    urlParams = getParamsFromUrl(newUrl);

    removeUrlParams = ['searchIn', 'author', 'conference', 'keywords', 'k', 'n', 'o'].filter(item => {
      if (!paperAdvanceFilter[item] && !personAdvanceFilter[item]) return true;
    })
    if (!domain || !domain.length) {
      removeUrlParams.push('domain');
    }
    helper.routeTo(props, urlParams, null, { removeParams: removeUrlParams });
  }

  const getZhWithEn = () => {
    const isZh = sysconfig.Locale === zhCN;
    if (domainInfo) {
      if (domainInfo.display_name) {
        const { en, cn } = domainInfo.display_name;
        if (isZh) {
          return (
            <Fragment>
              {cn && <div>{cn}</div>}
              {en && <div>({en})</div>}
            </Fragment>
          )
        }
        return <div>{en || cn || ''}</div>;
      }
      return domainInfo.name || '';
    }
    return '';
  }

  const getDomainInfoAndKeywordTrend = () => {
    dispatch({
      type: 'domain/getDomainInfoAndKeywordTrend',
      payload: { sids }
    })
  }

  useEffect(() => {
    if (avaliableDomain.includes(domain)) {
      getDomainInfoAndKeywordTrend();
    } else if (domain !== 'all') {
      message.info(formatMessage({ id: 'aminer.zhijiang.channel.domain.error' }));
    } else {
    }
    return () => {
      dispatch({ type: 'domain/reset' });
    }
  }, []);

  const titleRightZone = domain === 'all' ? [
    ({ paper }) => (
      <div className="domains">{paper && paper.domains && paper.domains.map(domain => {
        if (!domain || !domainMap[domain]) {
          return null
        }
        return <span className="domain">{domainMap[domain]}</span>
      })}</div>
    ),
  ] : []

  return (
    <Layout
      classNames={styles.layout}
      // pageTitle={`${title}`}
      pageSubTitle="AMiner Channel"
    // className="home"
    // {...layoutParams}
    >
      <article id="search_body" className={styles.article}>
        <div className={styles.searchPageSearchBox}>
          {domain !== 'all' && (
            <div className={styles.domainName}>
              {getZhWithEn()}
            </div>
          )}
          <div className={styles.searchBoxWrap}>
            <AdvanceSearchBox
              // advanceSearchItems={advanceSearchItems} 
              advancedMode={false}
              onSearchSubmit={onSearchSubmit}
              initialParams={{ domain }}
              query={q}
              searchBoxLeftZone={[]}
              // className='advanceSearchBoxCover'
              className='search'
            />
          </div>
        </div>
        <div className={classnames(styles.componentContent, { all: domain === 'all' })}>
          {(avaliableDomain.includes(domain) || domain === 'all') && <SearchPaperComponent
            query={queryObj}
            domain={domain}
            sortKey={sortKey}
            esSearchCondition={esSearchCondition}
            sorts={['relevance', 'n_citation']}
            noResultTip
            haveDomains={domain === 'all'}
            infoRightZone={titleRightZone}
          />}
        </div>
      </article>
    </Layout>
  )
}

export default page(
  connect(({ loading, domain }) => ({
    loading: loading.effects['domain/getDomainInfo'],
    domainInfo: domain.domainInfo,
  })),
)(ZhiJiangChannelPage)
