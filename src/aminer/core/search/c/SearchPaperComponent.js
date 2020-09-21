import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Pagination, Modal, Tabs, Tag, Button, Tooltip, message } from 'antd';
import { FM, formatMessage } from 'locales';
import * as hole from 'acore/hole';
import { connect, withRouter, Link } from 'acore';
import { SearchSortsV2, SearchPaperCurrentFilter } from 'aminer/core/search/c/control';
import cache from 'helper/cache';
import { Hole } from 'components/core';
import { Auth } from 'acore/hoc';
import { classnames } from 'utils';
import { sysconfig } from 'systems';
import { theme } from 'themes';
import compare, { NE } from 'utils/compare';
import { formatNumberWithKZero } from 'utils/search-utils';
import { Spin, CompState } from 'aminer/components/ui';
import { MarkPub } from 'aminer/components/widgets';
import { PaperVote, SearchResultTips, PaperMark } from 'aminer/core/search/c/widgets';
import { MustReadReason } from 'aminer/core/pub/widgets/info';
import { isLogin, isRoster, saveLocalToken, isPeekannotationlog, isTempAnno } from 'utils/auth';
import pubHelper from 'helper/pub';
import helper from 'helper';
import PublicationList from 'aminer/components/pub/PublicationList.tsx';
import styles from './SearchPaperComponent.less';

const abstractLen = 280;

@connect(({ auth, loading, searchpaper, collection }) => ({
  searchpaper,
  loading:
    loading.effects['searchpaper/search'] ||
    loading.effects['searchpaper/getTopic'] ||
    loading.effects['searchpaper/getAggregation'] ||
    loading.effects['searchpaper/getSearchFilter'],
  user: auth.user,
  collectionMap: collection.collectionMap,
}))
@Auth
@withRouter
class SearchPaperComponent extends PureComponent {
  state = {
    siderFilterVisibleOnMobile: false,
    statisticsVisibleOnMobile: false,
  };

  componentDidMount() {
    // TODO load props.
    const { query, isAdvanceSearchType, esSearchCondition, sortKey } = this.props;
    if ((query && query.query) || Object.keys(esSearchCondition).length) {
      // TODO ????
      this.callSearch({
        query,
        isAdvanceSearchType,
        sort: { key: sortKey },
        reset: true,
        esSearchCondition,
      });
    } else {
      message.info(formatMessage({ id: 'com.KgSearchBox.placeholder' }));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      query,
      esSearchCondition,
      isAdvanceSearchType,
      sortKey,
      searchpaper,
      dispatch,
      noResultTip
    } = this.props;
    const { sortOptions, topic, sort } = searchpaper;

    const { changed, changes } = compare.anyChanges(prevProps, this.props, 'query', 'isAdvanceSearchType', 'filter', 'esSearchCondition', 'sortKey', 'searchScope');
    if (changed) {
      if (changes.sortKey) {
        // ????? tab ??? query ??????? callSearch
        if ((query && query.query) || Object.keys(esSearchCondition).length) {
          changes.sort = { key: sortKey, d: '---' };
          changes.esSearchCondition = this.clearEsSearchConditionKeepDomain(esSearchCondition);
          this.callSearch(changes);
        }
      } else if (Object.keys(changes).length) {
        // if page/notTranslate changed
        changes.sort = { key: sortKey || sort.key || 'relevance', d: '---' };
        this.callSearch(changes);
      }
    }
  }

  clearEsSearchConditionKeepDomain = esSearchCondition => {
    if (
      esSearchCondition &&
      esSearchCondition.include_and &&
      esSearchCondition.include_and.conditions
    ) {
      esSearchCondition.include_and.conditions = esSearchCondition.include_and.conditions.filter(
        item => item.field === 'domains',
      );
    }
    return esSearchCondition;
  };

  getSearchFilter = changes => {
    const { dispatch } = this.props;
    dispatch({ type: 'searchpaper/getSearchFilter', payload: changes });
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'searchpaper/reset' });
  }

  callSearch = changes => {
    const { dispatch, searchScope, haveDomains } = this.props;
    dispatch({ type: 'searchpaper/search', payload: { ...changes, searchScope, haveDomains } })
  }

  callGetTopic = async query => {
    const { dispatch, alltopic } = this.props;
    return await dispatch({
      type: 'searchpaper/getTopic',
      payload: { query, alltopic },
    });
  };

  callGetAggregation = (yearInterval = 1) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'searchpaper/getAggregation',
      payload: { yearInterval },
    });
  };

  onSortChange = sortKey => {
    const sort = { key: sortKey, d: '---' };
    const { onSortChange, dispatch, searchpaper } = this.props;
    const { topic } = searchpaper;
    if (onSortChange) {
      return onSortChange(sort);
    }
    if (topic) {
      this.getSearchFilter({ sort });
    }

    helper.routeTo(this.props, { sortKey }, null, {
      removeParams: [
        'author',
        'conference',
        'org',
        'time',
        'field',
        'searchIn',
        'keywords',
        'topkeywords',
      ],
    });
  };

  onPageChange = (current, pageSize) => {
    const pagination = { current, pageSize };
    const { onPageChange } = this.props;
    if (onPageChange) {
      return onPageChange(pagination);
    }
    return this.callSearch({ pagination });
  };

  showSiderFilterOnMobile = () => {
    const { siderFilterVisibleOnMobile, statisticsVisibleOnMobile } = this.state;
    const changes = { siderFilterVisibleOnMobile: !siderFilterVisibleOnMobile };
    if (statisticsVisibleOnMobile) {
      changes.statisticsVisibleOnMobile = false;
    }
    this.setState(changes);
  };

  onTranslateDisable = e => {
    this.callSearch({ notTranslate: true });
    e.preventDefault();
  };

  onClickPaperTitle = paper => {
    const {
      dispatch,
      user,
      query,
      searchpaper,
      sortKey = { key: 'relevance' },
      titleLinkQuery,
    } = this.props;
    const { translate, results: papers } = searchpaper;
    dispatch({
      type: 'aminerSearch/Track',
      payload: {
        type: 'aminer.search-hit',
        target_type: `pub-0.1.0`,
        payload: JSON.stringify({
          hit: paper.id,
          list: papers.map(p => p.id),
          scores: papers.map(p => p.score),
          sort: sortKey.key,
          uid: (user && user.id) || '',
          query: { ...query, translate },
        }),
      },
    });
    window.open(
      `https://www.aminer.cn${pubHelper.genPubTitle({
        id: paper.id,
        title: paper.title,
        ...titleLinkQuery,
      })}`,
      '_blank',
    );
  };

  onMoreResult = search_scope => {
    const { setSearchScope } = this.props;
    setSearchScope(search_scope)
    // return this.callSearch({ search_scope, reset: true });
  }

  // getSearchResultTips = ({domain, query, translate, total}) => {
  //   let domainStatus = 'withoutDomain', translateStatus = 'withoutTranslate', queryStatus = 'withoutQuery';
  //   const values = { total: formatNumberWithKZero(total) };

  //   if (query && query.query) {
  //     queryStatus = 'withQuery';
  //     values.query = query.query;
  //   }
  //   if (domain) {
  //     domainStatus = 'withDomain';
  //     values.domain = formatMessage({id: `aminer.search.filter.field.${domain}`});
  //   }
  //   if (translate) {
  //     translateStatus = 'withTranslate';
  //     values.translate = (
  //       <Tag
  //         className='filterItem'
  //         closable={true}
  //         onClose={this.onTranslateDisable}
  //       >{translate}</Tag>
  //     );
  //   }

  //   console.log('CHANNEL ???? values', values)

  //   console.log('{ id: `aminer.search.results.${queryStatus}.${domainStatus}.${translateStatus}`, ...values }', { id: `aminer.search.results.${queryStatus}.${domainStatus}.${translateStatus}`, ...values })
  //   return formatMessage({ id: `aminer.search.results.${queryStatus}.${domainStatus}.${translateStatus}`, ...values })

  //   // return <FM id={`aminer.search.results.${queryStatus}.${domainStatus}.${translateStatus}`} values={{...values}} />
  // }

  render() {
    const {
      searchpaper,
      loading,
      query,
      sorts,
      sortKey,
      leftZoneFuncs,
      topZoneFuncs,
      rightZoneFuncs,
      paperListTopFuncs,
      topkeywords,
      org,
      conference,
      field,
      resource,
      time,
      esSearchCondition,
      searchCurFilter,
      onSearchPaperFilterChange,
      domain,
      SearchSortsRightZone = [],
      user,
      collectionMap,
      noResultTip = false,
      infoRightZone = []
    } = this.props;
    const { pagination, results, devinfo, aggregation, translate, sortOptions, hideTopicTip, sort, keyValues } = searchpaper;
    const { search_scope } = keyValues || {};
    const { siderFilterVisibleOnMobile, statisticsVisibleOnMobile } = this.state;
    // SearchSorts
    // console.log('&&&777777 sortOptions, sorts', sortOptions, sorts)
    const searchSortsOptions = sortOptions || sorts || ['latest', 'relevance', 'n_citation'];
    const searchSortsKey = { key: sortKey || sort.key || 'relevance', d: '---' };
    // const t = devinfo && devinfo.time && devinfo && devinfo.time.split(/(?<=[0-9])(?=[a-z])/);
    const takeTime =
      devinfo && devinfo.time && devinfo && devinfo.time.split(/(\.[0-9]+)(?=[a-z])/);

    const contentLeftZone = [({ paper }) => <PaperVote key={0} paper={paper} />];

    const topZoneData = {
      lang: sysconfig.Locale,
      onSortChange: this.onSortChange,
    };

    const rightZoneData = {
      query,
      onYearIntervalChange: this.callGetAggregation,
    };

    const leftZoneData = {
      callSearch: this.callSearch,
      fieldSelected: field,
      domainSelected: domain,
      resourceSelected: resource,
      orgSelected: org,
      venuesSelected: conference,
      keywordsSelected: topkeywords,
      timeSelected: time,
      siderFilterVisibleOnMobile,
      sortKey: searchSortsKey,
    };

    const paperListTopData = {
      searchSortsKey,
    };

    const DefaultSearchSortsRightZone = [];

    const PaperAbstractZone = [
      ({ paper }) => {
        if (!paper || !paper.abstract) return null;
        return (
          <div className="abstract" key={8}>
            <span title={paper.abstract}>{chop(paper.abstract, abstractLen)}</span>
          </div>
        );
      },
    ];

    const PaperVenueZone = [
      ({ paper }) => {
        const { venue, pages, year } = paper;
        const { venueName, venueNameAfter } = pubHelper.getDisplayVenue(venue, pages, year);
        return (
          <div className="venue-link" key={18}>
            <div className="venue-line">
              {venueName}
              {venue && <span>{venueNameAfter}</span>}
            </div>
          </div>
        );
      },
    ];

    const showInfoContent = ['cited_num', 'bibtex', 'view_num', 'url', 'paper_vote'];

    return (
      <div className={styles.paperComponent}>
        <Spin loading={loading} />
        <div className={styles.searchResultTopZone}>

          <Hole
            name="search.topZoneFuncs"
            fill={topZoneFuncs}
            defaults={[]}
            param={topZoneData}
          />
        </div>
        <div className={styles.paperSearch}>
          <div className={styles.searchInfo}>
            {/* <SearchPaperCurrentFilter
              filters={searchCurFilter}
              onFilterChange={onSearchPaperFilterChange}
            /> */}
            <div className={styles.searchResultLine}>
              {!noResultTip && (
                <div className={styles.resultTip}>
                  <div className={styles.tipWrap}>
                    {/* {this.getSearchResultTips({domain, query, translate, total: pagination.total })} */}
                    <SearchResultTips
                      query={query}
                      translate={translate}
                      domain={domain}
                      total={pagination.total}
                      onTranslateDisable={this.onTranslateDisable}
                    />
                  </div>
                  {/* <SearchResultTips query={query} translate={translate} domain={domain} total={pagination.total}/> */}
                  {/* <div className={styles.tipWrap}>
                <SearchResultTips query={query} translate={translate} domain={domain} total={pagination.total}/> */}
                  {/* {query.query && (
                  <Fragment>
                    {formatMessage({ id: 'aminer.search.results.label', defaultMessage: 'Query result contains' })} “
                    <span className={styles.searchQuery}>{query.query}</span> ”
                  </Fragment>
                )}
                {translate && <span>{' '} {formatMessage({ id: 'aminer.search.results.and', defaultMessage: 'and' })}</span>}
                {translate && (
                  <Tag
                    className={styles.filterItem}
                    closable={true}
                    onClose={this.onTranslateDisable}
                  >{translate}</Tag>
                )}
                {pagination && !!pagination.total && (
                  <>
                    {' '}
                    {'('}
                    {formatNumberWithKZero(pagination.total)}
                    {' '}
                    {formatMessage({ id: 'aminer.search.results', defaultMessage: 'results' })}
                    {/* {takeTime && !!takeTime.length && (
                        <span>
                          {formatMessage({ id: 'aminer.common.comma', defaultMessage: ', ' })}
                          {`${takeTime[0]} ${takeTime[2]}`}
                        </span>
                      )} */}
                  {/* {' )'}
                  </>
                )} */}
                  {/* </div> */}
                </div>
              )}

              {(!pagination || !pagination.total) && <div />}
              {/* The icon on mobile to show sider filter */}
              <div className={styles.mobileFilter} onClick={this.showSiderFilterOnMobile}>
                <svg className={styles.mobileFilterIcon} aria-hidden="true">
                  <use xlinkHref="#icon-menu2" />
                </svg>
              </div>
            </div>
          </div>
          <div className={styles.searchResultWrap}>
            <Hole
              name="search.leftZoneFuncs"
              fill={leftZoneFuncs}
              defaults={[]}
              param={leftZoneData}
            />
            <div className={styles.searchResult}>
              {/* Sort */}
              <div className={styles.controlLine}>
                <SearchSortsV2
                  sorts={searchSortsOptions}
                  sortKey={searchSortsKey}
                  rightZone={SearchSortsRightZone || DefaultSearchSortsRightZone}
                  onSortChange={this.onSortChange}
                />
              </div>

              <div className={styles.searchContent}>
                <div className={styles.paperListTopZone}>
                  <Hole
                    name="search.paperListTopZone"
                    fill={paperListTopFuncs}
                    defaults={[]}
                    param={paperListTopData}
                  />
                </div>
                <div className={styles.listContent}>
                  <CompState condition={results} hideLoading>
                    <PublicationList
                      id="aminerPaperList"
                      className={styles.paperList}
                      papers={results || []}
                      // query={query || ''}
                      abstractZone={PaperAbstractZone}
                      contentRightZone={[]}
                      titleRightZone={[
                        ({ paper }) => (
                          <MarkPub
                            size="small"
                            key={50}
                            paper={{ ...paper }}
                          />
                        ),
                      ]}
                      infoRightZone={infoRightZone}
                      withFollow
                      withCategory
                      showInfoContent={showInfoContent}
                      venueZone={PaperVenueZone}
                      onClickTitle={this.onClickPaperTitle}
                    />
                  </CompState>
                </div>
              </div>
              {search_scope === 'title' && (
                <span className={styles.moreRes} onClick={this.onMoreResult.bind(this, search_scope)}>
                  <FM id="aminer.paper.search.more" defaultMessage="More results" />
                </span>
              )}
            </div>
            <div className={classnames(styles.paperRightZone, 'desktop_device')}>
              <Hole
                name="search.rightZoneFuncs"
                fill={rightZoneFuncs}
                defaults={this.defaultZone}
                param={rightZoneData}
              />
            </div>
          </div>
          {pagination && pagination.total > 0 && (
            <div className={styles.paginationWrap}>
              <Pagination
                showQuickJumper
                current={pagination.current}
                defaultCurrent={1}
                defaultPageSize={pagination.pageSize}
                total={pagination.total}
                onChange={this.onPageChange}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const chop = (text, size) => {
  if (text) {
    return text.length > size ? `${text.substring(0, size)}...` : text;
  }
  return '';
};

export default SearchPaperComponent;
