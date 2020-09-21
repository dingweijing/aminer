/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
// Author: Elivoa, 2018-10-12
// Universal Search System.
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Pagination, Tag } from 'antd';
import { connect, withRouter, Link } from 'acore';
import { sysconfig } from 'systems';
import { theme } from 'themes';
import consts from 'consts';

import * as hole from 'acore/hole';
import { classnames } from 'utils';
import compare from 'utils/compare';
import searchHelper from 'helper/search';
import { FM, formatMessage } from 'locales';
import helper, { getLangLabel } from 'helper';

import { PersonList } from 'aminer/core/person/c';
import { Spin, CompState } from 'aminer/components/ui';
import { Hole } from 'components/core';
import { formatNumberWithKZero } from 'utils/search-utils'
import { SearchFilter, SearchSorts } from 'aminer/core/search/c/control';
import KGSearchHelper from 'aminer/core/search/c/ai/KGSearchHelper';
import { PersonFollow, ExportExperts } from 'aminer/core/search/c/widgets';
import TopicIntro from './TopicIntro';
import styles from './SearchComponent.less';

@connect(({ searchperson, auth, loading, topic, searchpaper }) => ({
  searchperson,
  user: auth.user,
  topic: topic.topic,
  loading: loading.effects['searchperson/search'],
  mustReadTopic: searchpaper.topic,
}))
@withRouter
class SearchComponentBase extends PureComponent {
  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
  }

  static propTypes = {
    query: PropTypes.object, // QueryObject: {query: 'data mining', advanced: ''}
    filter: PropTypes.object,
    sort: PropTypes.object, // {key, d:'asc'/'desc'}
    pagination: PropTypes.object, // { current, pageSize }

    restrictEBs: PropTypes.array, // 限制再某个智库范围内；
    defaultEBs: PropTypes.array, // 默认选中的智库范围

    sorts: PropTypes.array, // sort keys [];

    className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

    // switches
    disableFilter: PropTypes.bool,

    // callbacks
    onSearch: PropTypes.func,
    onFilterChange: PropTypes.func,
    onSortChange: PropTypes.func,
    onPageChange: PropTypes.func,
  };

  componentDidMount() {
    this.getCOVIDHotExpert();
    // TODO load props.
    const { query, filter, sort, pagination } = this.props;
    this.callSearch({ query, pagination, reset: true });
  }

  componentDidUpdate(prevProps, prevState) {
    const { changed, changes } = compare.anyChanges(prevProps, this.props, 'query', 'filter', 'sort', 'pagination');
    if (changed) {
      this.callSearch(changes);
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'searchperson/reset' });
  }

  // !!!! Example Changes pass to callSearch
  exampleChanges = {
    query: {
      advanced: null,
      query: '',
    },
    sort: {},
    filter: {},
    pagination: {
      current: 1, pageSize: 20,
    },
    smartQuery: {
      texts: [], isNotAffactedByAssistant: true, isSearchAbbr: true, typesTotals: true,
    },
  };

  getCOVIDHotExpert = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'aminerSearch/getCOVIDHotExpert' });
  }

  // !!!! search entrance!!!
  callSearch = (changes, config) => {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  SearchComponentBase')

    const { dispatch, restrictEBs, defaultEBs, schema } = this.props;
    // 本来不应该修改参数的；但是所有调用callSearch都是外面方法的e最后一步，之后就会抛弃changes；所以这里改参数不回影响任何值；
    changes.restrictEBs = restrictEBs; // eslint-disable-line no-param-reassign
    changes.defaultEBs = defaultEBs; // eslint-disable-line no-param-reassign
    changes.schema = schema; // eslint-disable-line no-param-reassign
    dispatch({ type: 'searchperson/search', payload: changes });
  };

  // 注意：如果 showSearch = false, 则不需要重写onSearch了；
  // query: {advanced: null, query: "data clear fddfsdf"}
  onSearch = query => {
    const { onSearch } = this.props;
    if (onSearch) {
      return onSearch(query);
    }
    return this.callSearch({ query });
  };

  onFilterChange = (key, value, enable, count) => {
    const filterChange = { key, value, enable, count };
    const { onFilterChange } = this.props;
    if (onFilterChange) {
      return onFilterChange(filterChange);
    }
    return this.callSearch({ filterChange });
  };

  onPageChange = (current, pageSize) => {
    const pagination = { current, pageSize };
    const { onPageChange } = this.props;
    if (onPageChange) {
      return onPageChange(pagination);
    }
    return this.callSearch({ pagination });
  };

  onSortChange = sortKey => {
    const sort = { key: sortKey, d: '---' };
    const { onSortChange } = this.props;
    if (onSortChange) {
      return onSortChange(sort);
    }
    return this.callSearch({ sort });
  };

  // TODO change to call search;
  onAssistantChange = (texts, isNotAffactedByAssistant, typesTotals) => {
    const smartQuery = { texts, isNotAffactedByAssistant, typesTotals }
    // Not expose this method to outer.
    return this.callSearch({ smartQuery });
  };

  disableTranslate = e => {
    this.callSearch({ notTranslate: true });
    e.preventDefault();
  }

  switchToSearchPaper = () => {
    helper.routeTo(this.props, null, { pathType: 'pub' }, { removeParams: ['forceType'] });
  }

  render() {
    const { searchperson, loading } = this.props;
    const { query, results, aggregation, filter, sort, pagination, devinfo, translate } = searchperson;

    const { className, sorts, topic, mustReadTopic } = this.props;
    const { disableFilter, special, listZone } = this.props;

    const { pageSize, current } = pagination;

    const personListZone = {}
    if (!topic) {
      personListZone.contentLeftZone = []
    }
    if (special && special.withTrajecotry) {
      personListZone.contentRightZone = [({ person }) => (
        <PersonFollow
          key={5}
          personId={person.id}
          isFollowing={person.is_following}
          numFollowed={person.num_followed}
        />
      ), ({ person, id }) => {
        const url = `https://traj2.aminer.cn/external-singleTrajectory?id=${id}&flag=aminer`;
        return (
          <a key={9}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.trajecotry}
            // href={`//trajectory.aminer.cn/trajectory/${id}`}
            href={url}
          >
            Trajecotry
          </a>
        )
      }
      ]
    }

    // right zone data
    const expertBaseId = (filter && filter.eb && filter.eb.id) || 'aminer';
    const rightZoneData = {
      query,
      pageSize,
      current,
      filters: filter,
      sortType: sort && sort.key,
      expertBaseId,
    };

    const SearchSortsRightZone = !sysconfig.Enable_Export ? null :
      hole.fillFuncs(theme.SearchSorts_RightZone, [
        () => () => (
          <ExportExperts
            key="0" expertBaseId={expertBaseId}
            query={query} pageSize={pageSize} current={current} filters={filter}
            sort={sort && sort.key}
          />
        ),
      ], null, rightZoneData);

    // SearchSorts
    let searchSortsOptions = sorts || ['name', 'relevance', 'h_index', 'activity', 'rising_star', 'n_citation', 'n_pubs'];
    const searchSortsKey = sort;
    const filterHasEB = searchHelper.filterHasEB(filter);
    const hasQuery = !searchHelper.isQueryEmpty(query);
    if (filterHasEB) {
      // later
    } else {
      searchSortsOptions = searchSortsOptions.filter(k => k !== 'name');
    }
    if (hasQuery) {
      searchSortsOptions = searchSortsOptions.filter(k => k !== 'name');
    } else {
      searchSortsOptions = searchSortsOptions.filter(k => k !== 'relevance');
    }

    const hideSearchAssistant = false;
    const { disableSmartSuggest } = this.props;

    const { rightZoneFuncs } = this.props;

    const profileListZone = listZone || personListZone;

    return (
      <div className={classnames(styles.searchComponent, styles[className])}>
        <div className={styles.topZone}>
          <div className={styles.searchZone}>

            {!disableSmartSuggest && !hideSearchAssistant && (
              <KGSearchHelper query={query} modelName="searchperson"
                onAssistantChanged={this.onAssistantChange} />
            )}

            {/* ---- Filter ----*/}
            {!disableFilter && aggregation && results && results.length > 0 && (
              <SearchFilter
                // titlsearche={Math.random()}
                className={className}
                filters={filter}
                aggs={aggregation}
                onFilterChange={this.onFilterChange}
              />
            )}

          </div>
        </div>

        <Spin loading={loading} />

        <div className={styles.view}>

          {pagination && !!pagination.total && (
            <div className={styles.resultTip}>
              <div className={styles.tipWrap}>
                <span>
                  {formatMessage({ id: 'aminer.search.results.label', defaultMessage: 'Query result contains' })} “
                  <span className={styles.searchQuery}>{query.query}</span>”
                </span>
                {translate && <span>{formatMessage({ id: 'aminer.search.results.and', defaultMessage: 'and' })}</span>}
                {translate && (
                  <Tag
                    className={styles.filterItem}
                    closable={true}
                    onClose={this.disableTranslate}
                  >{translate}</Tag>
                )}
                <span>
                  ( <em>{formatNumberWithKZero(pagination.total)}</em> {formatMessage({ id: 'aminer.search.results', defaultMessage: 'results' })})
                </span>
                {/* {isRoster(user) && (
                  <span className="specialzone_annotate">重置缓存刷新</span>
                )} */}
              </div>
              {/* , <em> {t && `${t[0]}`}</em>{t && t[2]} */}
            </div>
          )}

          {/* Sort */}
          {results && results.length > 0 && (
            <div className={styles.controlLine}>
              <SearchSorts
                className={className}
                sorts={searchSortsOptions}
                sortKey={searchSortsKey}
                rightZone={SearchSortsRightZone}
                onSortChange={this.onSortChange}
              />
              {pagination && pagination.total > 0 && (
                <div className={styles.smallPagination}>
                  <Pagination
                    simple
                    current={pagination.current}
                    defaultCurrent={1}
                    defaultPageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={this.onPageChange} />
                </div>
              )}
            </div>
          )}


          {/* <Spinner loading={loading} /> */}
          <div className={styles.searchContent}>
            <div className={styles.leftRight}>
              <div className={styles.personList}>
                <CompState condition={results}>
                  <PersonList className=""
                    id="aminerPersonList"
                    target="_blank"
                    {...profileListZone}
                    {...special}
                  />
                </CompState>
              </div>
              <div className={classnames(styles.personListRightZone, 'desktop_device')}>
                {pagination && pagination.total > 0 && mustReadTopic && (
                  <>
                    {/* <div className={styles.topicIntro}>
                      <div className={styles.topicBgImgWrap}>
                        <img className={styles.topicBgImg} src={`${consts.ResourcePath}/sys/aminer/search_iclr2020_bg.jpg`} />
                      </div>
                      <Link target="_blank" to='/conf/iclr2020/' className={styles.topicIntroTip}>ICLR-2020</Link>
                    </div>
                    <div className={styles.topicIntro} onClick={this.switchToSearchPaper}>
                      <div className={styles.topicBgImgWrap}>
                        <img className={styles.topicBgImg} src={`${consts.ResourcePath}/sys/aminer/search_topic_bg.jpg`} />
                      </div>
                      <div className={styles.topicIntroTip}>
                        <FM id='aminer.paper.topic.viewIntro' values={{ topic: getLangLabel(mustReadTopic.name, mustReadTopic.name_zh) }} />
                      </div>
                    </div> */}
                    <TopicIntro switchToSearchPaper={this.switchToSearchPaper} topic={getLangLabel(mustReadTopic.name, mustReadTopic.name_zh)} />
                  </>
                )}

                <Hole
                  name="search.rightZoneFuncs"
                  fill={rightZoneFuncs}
                  defaults={this.defaultZone}
                  param={{ query }}
                  config={{ containerClass: styles.searchKgContent }}
                />
              </div>
            </div>

            {pagination && pagination.total > 0 && (
              <div className={styles.paginationWrap}>
                <Pagination
                  // showQuickJumper
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


        {/* -------- Plugin:: Floating System -------- */}
        {/* <Hole
          name="search.FloatingContent"
          plugins={P.getHoles(this.props.plugins, 'search.FloatingContent')}
          param={{}}
          config={{}}
        /> */}

      </div>
    );
  }
}

export default SearchComponentBase;
