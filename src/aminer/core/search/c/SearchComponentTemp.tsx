/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
// Author: xenaluo, 2020-4-30
// Universal Search System.
import React, { useEffect, ReactElement, useRef, useState } from 'react';
import { Pagination, Tag } from 'antd';
import { PaginationProps } from 'antd/lib/pagination';
import { connect, page, withRouter } from 'acore';
import { classnames } from 'utils';
import compare from 'utils/compare';
import { formatMessage } from 'locales';
// TODO
import PersonList from 'aminer/components/expert/PersonList.tsx';
import { Spin, CompState } from 'aminer/components/ui';
import { Hole } from 'components/core';
import { formatNumberWithKZero } from 'utils/search-utils';
import { SearchFilter, SearchSorts } from 'aminer/core/search/c/control';
import KGSearchHelper from 'aminer/core/search/c/ai/KGSearchHelper';
import { PersonVote, Tags, SimilarPerson } from 'aminer/components/expert/c';
import { QueryType, ExpertSearchType, SortType } from 'models/aminer/expert_search';
import {
  IframeSpecialType,
  PersonListZoneType,
  ProfileInfo,
} from 'aminer/components/person/person_type';
import styles from './SearchComponentTemp.less';

interface SearchCondition {
  query?: QueryType;
  filter?: object;
  sort?: SortType;
  pagination?: PaginationProps;
  schema?: object;
  reset?: boolean;
  notTranslate?: boolean;
  smartQuery?: { texts: object[]; isNotAffactedByAssistant: boolean; typesTotals: boolean };
  filterChange?: { key: string; value: string; enable: boolean; count: number };
  skipCache?: boolean;
  reloadCache?: boolean;
  debug?: boolean;
  domain?: string | undefined;
  ebId?: string | undefined;
}

interface PropsType {
  dispatch: (config: { type: string; payload?: object }) => Promise<any>;
  query: QueryType;
  schema: object;
  className: string;
  loading: boolean;
  hideSearchAssistant: boolean;
  changeMode: boolean;
  disableFilter: boolean;
  alltopic: string | undefined; // TODO boolean?
  rightZoneFuncs: ReactElement[];
  expertSearch: ExpertSearchType;
  sorts: string[];
  tagTarget: string;
  onPageChange: ({ current, pageSize }: { current: number; pageSize: number | undefined }) => void;
  onFilterChange: ({
    key,
    value,
    enable,
    count,
  }: {
    key: string;
    value: string;
    enable: boolean;
    count: number;
  }) => void;
  onSortChange: ({ key }: { key: string }) => void;
  special: IframeSpecialType;
  listZone: Array<() => ReactElement>;
  domain: string | undefined;
  ebId: string | undefined;
  mode: string | undefined;
  personContentBottomZone: ReactElement[];
}

// interface ComponentZone {
//   [propsName: string]: ReactElement[] | [];
// }

const SearchComponentBase = (props: PropsType) => {
  const { dispatch, expertSearch, user } = props;
  const { results, aggregation, filter, sort, pagination, topics, translate } = expertSearch;
  const {
    query,
    alltopic,
    rightZoneFuncs,
    listZone,
    special,
    tagTarget = '_blank',
    domain,
    ebId,
    changeMode = false,
    personContentBottomZone
  } = props;
  const {
    // onSearch: _onSearch,
    onPageChange: _onPageChange,
    onFilterChange: _onFilterChange,
    onSortChange: _onSortChange,
    schema,
    sorts,
    loading,
  } = props;

  const { hideSearchAssistant = false, disableFilter } = props;
  const { className } = props;

  const { source } = special || {};

  const prevProps = useRef(props);

  const [mode, setMode] = useState(props.mode || 'v1');

  const getCOVIDHotExpert = () => {
    dispatch({ type: 'aminerSearch/getCOVIDHotExpert' });
  };

  const callGetTopic = (topic_query: object) => {
    dispatch({
      type: 'searchpaper/getTopic',
      payload: { query: topic_query, alltopic },
    });
  };

  const callSearch = (changes: SearchCondition) => {
    changes.schema = schema; // eslint-disable-line no-param-reassign
    if (ebId) {
      changes.ebId = ebId;
    }
    dispatch({ type: 'expertSearch/search', payload: changes });
  };

  const onPageChange = (current: number, pageSize: number | undefined) => {
    const cur_pagination = { current, pageSize };
    if (_onPageChange) {
      _onPageChange(cur_pagination);
    }
    callSearch({ pagination: cur_pagination });
  };

  const onSortChange = (sortKey: string) => {
    const cur_sort = { key: sortKey };
    if (_onSortChange) {
      _onSortChange(cur_sort);
    }
    callSearch({ sort: cur_sort });
  };

  const onAssistantChange = (
    texts: object[],
    isNotAffactedByAssistant: boolean,
    typesTotals: boolean,
  ) => {
    const smartQuery = { texts, isNotAffactedByAssistant, typesTotals };
    // Not expose this method to outer.
    callSearch({ smartQuery });
  };

  const onFilterChange = (key: string, value: string, enable: boolean, count: number) => {
    const filterChange = { key, value, enable, count };
    if (_onFilterChange) {
      _onFilterChange(filterChange);
    }
    callSearch({ filterChange });
  };

  const disableTranslate = (e: React.MouseEvent) => {
    e.preventDefault();
    callSearch({ notTranslate: true });
  };

  const getResetData = () => {
    callSearch({ query, domain, reset: true });
  };

  useEffect(() => {
    getCOVIDHotExpert();
    getResetData();
    return () => {
      dispatch({ type: 'expertSearch/reset' });
    };
  }, []);

  useEffect(() => {
    // callGetTopic(query);  // 开启获取topic，需要先修改搜索页广告的跳转链接
    const { changed, changes } = compare.anyChanges(
      prevProps.current,
      props,
      'query',
      'filter',
      'sort',
      'pagination',
      'domain',
      'ebId'
    );
    prevProps.current = props;
    if (changed) {
      callSearch(changes);
    }
  }, [query, domain, ebId]);

  // SearchSorts
  const searchSortsOptions = sorts || [
    'relevance',
    'h_index',
    'activity',
    'rising_star',
    'n_citation',
    'n_pubs',
  ];
  // const hasQuery = !searchHelper.isQueryEmpty(query);
  // if (hasQuery) {
  //   searchSortsOptions = searchSortsOptions.filter(k => k !== 'name');
  // } else {
  //   searchSortsOptions = searchSortsOptions.filter(k => k !== 'relevance');
  // }

  const searchSortsKey = sort;

  const defaultZone: PersonListZoneType = {
    contentBottomZone: personContentBottomZone || [
      ({ person }: { person: ProfileInfo }) => (
        <SimilarPerson
          key={10}
          person={person}
          showAvatar
        // personInfocard={this.personInfocard}
        />
      ),
    ],
  };

  if (!topics || !topics[0] || !topics[0].i) {
    defaultZone.leftZone = [];
  } else {
    defaultZone.leftZone = [
      ({ person }) => <PersonVote key={0} person={person} topicid={topics[0].i} source={source} />,
    ];
  }
  if (special && special.withTrajecotry) {
    defaultZone.contentRightZone = [
      ({ id }: { id: string }) => {
        const url = `https://traj2.aminer.cn/external-singleTrajectory?id=${id}&flag=aminer`;
        return (
          <a
            key={9}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.trajecotry}
            // href={`//trajectory.aminer.cn/trajectory/${id}`}
            href={url}
          >
            Trajecotry
          </a>
        );
      },
    ];
  }

  const toggleMode = [
    () => {
      return (
        <div key='toggleModeZone'>
          <span className={classnames("toggleMode",
            { activeMode: mode === 'list' })}
            onClick={() => setMode('list')}
          >
            <svg className="icon" aria-hidden="true">
              <use xlinkHref='#icon-list' />
            </svg>
          </span>
          <span className={classnames("toggleMode",
            { activeMode: mode === 'table' })}
            onClick={() => setMode('table')}
          >
            <svg className="icon" aria-hidden="true">
              <use xlinkHref='#icon-menu' />
            </svg>
          </span>
        </div>
      )
    }
  ];

  const profileListZone = listZone || defaultZone;

  return (
    <div className={classnames(styles.searchComponent, styles[className])}>
      <div className="topZone">
        <div className="searchZone">
          {!hideSearchAssistant && (
            <KGSearchHelper
              query={query}
              modelName="expertSearch"
              onAssistantChanged={onAssistantChange}
            />
          )}

          {/* ---- Filter ----*/}
          {!disableFilter && aggregation && results && results.length > 0 && (
            <SearchFilter
              // titlsearche={Math.random()}
              className={className}
              filters={filter}
              aggs={aggregation}
              onFilterChange={onFilterChange}
            />
          )}
        </div>
      </div>

      <Spin loading={loading} />

      <div className="view">
        {pagination && !!pagination.total && (
          <div className="resultTip">
            <div className="tipWrap">
              <span>
                {formatMessage({
                  id: 'aminer.search.results.label',
                  defaultMessage: 'Query result contains',
                })}{' '}
                “<span className="searchQuery">{query.query}</span>”
              </span>
              {translate && (
                <span>
                  {formatMessage({ id: 'aminer.search.results.and', defaultMessage: 'and' })}
                </span>
              )}
              {translate && (
                <Tag className="filterItem" closable onClose={disableTranslate}>
                  {translate}
                </Tag>
              )}
              <span>
                ( <em>{formatNumberWithKZero(pagination.total)}</em>{' '}
                {formatMessage({ id: 'aminer.search.results', defaultMessage: 'results' })})
              </span>
            </div>
            {/* , <em> {t && `${t[0]}`}</em>{t && t[2]} */}
          </div>
        )}

        {/* Sort */}
        {results && results.length > 0 && (
          <div className="controlLine">
            <SearchSorts
              // className={className}
              sorts={searchSortsOptions}
              sortKey={searchSortsKey}
              onSortChange={onSortChange}
              rightZone={toggleMode}
              changeMode={changeMode}
            />
            {pagination && !!pagination.total && (
              <div className="smallPagination">
                <Pagination
                  simple
                  current={pagination.current}
                  defaultCurrent={1}
                  defaultPageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={onPageChange}
                />
              </div>
            )}
          </div>
        )}

        {/* <Spinner loading={loading} /> */}
        <div className="searchContent">
          <div className="leftRight">
            <div className="personList">
              <CompState condition={results}>
                <PersonList
                  className=""
                  id="aminerPersonList"
                  target="_blank"
                  mode={mode}
                  followSize="small"
                  persons={results}
                  special={special}
                  withFollow
                  // showViews={false}
                  {...profileListZone}
                />
              </CompState>
            </div>
            <div className={classnames('personListRightZone', 'desktop_device')}>
              <Hole
                name="search.rightZoneFuncs"
                fill={rightZoneFuncs}
                defaults={[]}
                param={{ query }}
                config={{ containerClass: 'searchKgContent' }}
              />
            </div>
          </div>

          {pagination && !!pagination.total && (
            <div className="paginationWrap">
              <Pagination
                // showQuickJumper
                current={pagination.current}
                defaultCurrent={1}
                defaultPageSize={pagination.pageSize}
                total={pagination.total}
                onChange={onPageChange}
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
};

export default page(
  withRouter,
  connect(
    ({ expertSearch, auth, loading, topic, searchpaper }: { expertSearch: ExpertSearchType }) => ({
      user: auth.user,
      expertSearch,
      topic: topic.topic,
      loading: loading.effects['expertSearch/search'],
      mustReadTopic: searchpaper.topic,
    }),
  ),
)(SearchComponentBase);
