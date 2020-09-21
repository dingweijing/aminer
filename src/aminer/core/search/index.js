import React, { useMemo, useEffect, useState } from 'react';
import { Input, Button, Form, Icon, Radio, Tabs, message } from 'antd';
import { page, connect } from 'acore';
import { Layout } from 'aminer/layouts';
import { FM, formatMessage } from 'locales';
import helper, { getLangLabel } from 'helper';
import consts from 'consts';
import { logtime } from 'utils/log';
import { decodeLocation } from 'utils/misc';
import { classnames } from 'utils';
import { setUserTrack } from 'utils/aminer-common';
import cookies from 'utils/cookie';
import { sysconfig } from 'systems';
import {
  splitStrByPlusSign,
  getSearchPathname2,
  getParamsFromUrl,
  buildEsSearchCondition,
} from 'utils/search-utils';
import {
  SearchKnowledge,
  SearchPaperComponentDynamic as SearchPaperComponent,
  SearchComponentDynamic as SearchComponent,
  SearchGCTComponentDynamic as SearchGCTComponent,
  SearchNewsComponentDynamic as SearchNewsComponent,
  SearchResultStatistics,
  TopicIntro,
  AddTopic,
} from 'aminer/core/search/c';
import { AdvanceSearchBox } from 'aminer/core/search/c/control';
import { HeaderTopic, SearchPaperFilter } from 'aminer/core/search/c/widgets';
import searchConfigs from './searchconfigs';
import styles from './index.less';
import id from 'aminer/p/mrt/id';

// 将搜索作为一个不SSR的页面。也就是基本页面做SSR，但是内容和API调用全部都走CSR模式。

const { tabs, withoutAdv, domainsTreeData } = searchConfigs;

// TODO cached search type. Change to cookie.

// -----------------------------------------------------
// Components.
// -----------------------------------------------------

const SearchPage = props => {
  const {
    forceType,
    source,
    stype,
    withTrajecotry,
    q,
    k,
    n,
    o,
    field,
    resource,
    time,
    searchIn = 'all',
    author = '',
    conference = '',
    keywords = '',
    org,
    topkeywords,
    alltopic,
    sortKey,
  } = helper.parseUrlParam(props, {}, [
    'forceType',
    'type',
    'source',
    'stype',
    'withTrajecotry',
    'q',
    'k',
    'n',
    'o',
    'field',
    'resource',
    'time',
    'searchIn',
    'author',
    'conference',
    'keywords',
    'org',
    'topkeywords',
    'alltopic',
    'sortKey',
  ]);

  const [search_scope, setSearchScope] = useState();

  let { domain } = helper.parseUrlParam(props, {}, ['domain']);
  if (domain) {
    domain = domain.split(' ').join('+');
  }

  const { pathType = '' } = helper.parseMatchesParam(props, {}, ['pathType']);
  const searchType = pathType; // 体现url中的type.

  // console.log('+++++++++++++++++', forceType, q, k, n, o, source, stype, withTrajecotry)
  useEffect(() => {
    const d = {
      k,
      n,
      o,
      query: q,
      domain,
      author,
      conference,
      keywords,
      org,
      topkeywords,
      alltopic,
      sortKey,
      searchIn,
      resource,
      time,
      field,
    };

    Object.keys(d).forEach(key => {
      if (!d[key]) {
        d[key] = undefined;
      }
    });

    // console.log('ddddd', d);
    setUserTrack(props.dispatch, {
      type: 'aminer.search',
      target_type: `search.${pathType}`,
      payload: JSON.stringify(d),
    });
    // props.dispatch({
    //   type: 'aminerSearch/setTracking',
    //   payload: {
    //     type: 'aminer.search',
    //     target_type: `search.${pathType}`,
    //     payload: JSON.stringify({ k, n, o, query: q }),
    //   },
    // });
  }, [
    pathType,
    q,
    n,
    o,
    k,
    domain,
    author,
    conference,
    keywords,
    org,
    topkeywords,
    alltopic,
    sortKey,
    searchIn,
    resource,
    time,
    field,
  ]);
  // TODO 有 forceType 是否应该隐藏tab切换条？

  let serverRedirect = false;
  const searchTypeShould = searchConfigs.judgeSearchType({ pathType, forceType });
  if (!pathType) {
    if (consts.IsServerRender()) {
      console.log('Server Side Redirect');
      const newURL = helper.getRouteToUrl(
        props,
        null,
        { pathType: searchTypeShould },
        {
          transferPath: [{ from: '/search', to: '/search/:pathType' }],
        },
      );
      serverRedirect = encodeURI(newURL.pathname + newURL.search); // TODO no hash？
      throw new Error(`HANDLABLE_ERROR:{"type":"redirect","url":"${serverRedirect}"}`);
      // window.location.href = `/search/${searchTypeShould}?ok=ok`;
    } else {
      console.log('Client Side Redirect');
      serverRedirect = true;
      helper.routeToReplace(
        props,
        null,
        { pathType: searchTypeShould },
        {
          transferPath: [{ from: '/search', to: '/search/:pathType' }],
        },
      );
    }
  }

  const queryObj = useMemo(() => searchConfigs.composeQueryObject2(q, k, n, o, searchType), [
    q,
    k,
    n,
    o,
    searchType,
  ]);
  const esSearchCondition = useMemo(
    () =>
      buildEsSearchCondition({
        field,
        resource,
        time,
        searchIn,
        author,
        conference,
        keywords,
        topkeywords,
        org,
        domain,
        queryObj,
      }),
    [
      field,
      resource,
      time,
      searchIn,
      author,
      conference,
      keywords,
      topkeywords,
      org,
      domain,
      queryObj,
    ],
  );
  const showAdvanceFilterIcon = useMemo(() => searchType === 'pub', [searchType]); // 搜索框中是否展示论文的高级搜索button

  const searchCurFilter = useMemo(
    () =>
      searchConfigs.buildCurSearchFilter(
        field,
        resource,
        time,
        searchIn,
        author,
        conference,
        keywords,
        org,
        topkeywords,
        domain,
      ),
    [field, resource, time, searchIn, author, conference, keywords, org, domain],
  );

  const isAdvanceSearchType = useMemo(() => {
    if ((searchIn && searchIn !== 'all') || author || conference || keywords || domain) {
      return true;
    }
    return false;
  }, [searchIn, author, conference, keywords, domain]);

  // useEffect(() => toggleAdvancedSearchByQueryObj(props.dispatch, queryObj), [queryObj]) // TODO test adv search.

  useEffect(() => {
    toggleAdvancedSearchBtnBySearchType(props.dispatch, searchType);
    return () => toggleAdvancedSearchBtnBySearchType(props.dispatch, 'person');
  }, [searchType]);

  useEffect(() => changeQueryWithAdvancedBtnHidden(props, q, k, searchType), [q, k, searchType]);

  // 支持一下有source的情况下 iframe 定期调用调整高度。
  // TODO iframe 定期调用调整高度。 要提取hooks
  useEffect(() => {
    const postHeight = () => {
      const aminerHeight = document.getElementById('search_body').offsetHeight;
      if (aminerHeight !== 0) {
        window.top.postMessage(`aminerHeight###${aminerHeight}`, '*');
      }
    };
    let timer;
    if (source === 'true' || source === 'sogou') {
      timer = setInterval(postHeight, 1000);
      return () => {
        clearInterval(timer);
      };
    }
    return undefined;
  }, [source]);

  const switchToSearchPaper = () => {
    helper.routeTo(props, null, { pathType: 'pub' }, { removeParams: ['forceType'] });
  };

  const { mustReadTopic } = props;
  const componentRightZones = useMemo(() => {
    return {
      pub: [],
      person: [
        () => <AddTopic />,
        () => (
          <TopicIntro
            key={2}
            switchToSearchPaper={switchToSearchPaper}
            topic={mustReadTopic && getLangLabel(mustReadTopic.name, mustReadTopic.name_zh)}
          />
        ),
        () => (
          <SearchKnowledge
            className="size"
            key="chart_person"
            kid="chart_person"
            queryObj={queryObj}
          />
        ),
      ],
    };
  });

  const expertParams = { source, withTrajecotry: withTrajecotry !== undefined, stype };

  const title = useMemo(() => {
    const titleArr = [];
    if (queryObj.advanced) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item in queryObj.advanced) {
        if (queryObj.advanced[item]) {
          titleArr.push(queryObj.advanced[item]);
        }
      }
    } else {
      titleArr.push(queryObj.query);
    }
    return titleArr.join(',');
  }, [queryObj]);

  const authorNames = useMemo(() => {
    const authors = splitStrByPlusSign(author);
    const authorNames = authors.map(name => name.split('@')[0]);
    return authorNames.join('+');
  }, [author]);

  const defaultInitialValues = {
    name: '',
    org: '',
    searchIn: 'all',
    author: '',
    conference: '',
    keywords: '',
  };

  const onComponentPressEnter = (e, fieldsValue, query, selectedDomains) => {
    e.preventDefault();
    onSearchSubmit({ fieldsValue, advancedMode: true, query, selectedDomains });
  };

  const defaultAdvanceSearchItems = {
    person: [
      {
        label: formatMessage({ id: 'aminer.search.advance.name', defaultMessage: 'Name' }),
        fieldName: 'name',
        Component: Input,
        onComponentPressEnter,
        ComponentProps: {
          className: classnames('styles.inputBox', 'styles.name'),
          placeholder: '',
        },
        fieldOptions: { initialValue: n },
      },
      {
        label: formatMessage({ id: 'aminer.search.advance.org', defaultMessage: 'Organization' }),
        fieldName: 'org',
        Component: Input,
        onComponentPressEnter,
        ComponentProps: {
          className: classnames('styles.inputBox', 'styles.name'),
          placeholder: '',
        },
        fieldOptions: { initialValue: o },
      },
    ],
    pub: [
      {
        label: formatMessage({ id: 'aminer.search.advance.searchIn', defaultMessage: 'Search in' }),
        fieldName: 'searchIn',
        Component: Radio.Group,
        ComponentChildren: ['all', 'title'].map(item => (
          <Radio value={item} key={`searchIn${item}`}>
            {formatMessage({ id: `aminer.search.advance.searchIn.${item}` })}
          </Radio>
        )),
        ComponentProps: {
          className: classnames('styles.inputBox', 'styles.name'),
          placeholder: '',
        },
        fieldOptions: { initialValue: searchIn },
      },
      {
        label: formatMessage({ id: 'aminer.search.advance.author', defaultMessage: 'Author' }),
        fieldName: 'author',
        Component: Input,
        ComponentProps: {
          className: classnames('styles.inputBox', 'styles.name'),
          placeholder: formatMessage({
            id: 'aminer.search.advance.placeholder',
            defaultMessage: 'Search terms separated by commas',
          }),
        },
        onComponentPressEnter,
        fieldOptions: { initialValue: authorNames },
      },
      {
        label: formatMessage({
          id: 'aminer.search.advance.conference',
          defaultMessage: 'Conference',
        }),
        fieldName: 'conference',
        Component: Input,
        ComponentProps: {
          className: classnames('styles.inputBox', 'styles.name'),
          placeholder: formatMessage({
            id: 'aminer.search.advance.placeholder',
            defaultMessage: 'Search terms separated by commas',
          }),
        },
        onComponentPressEnter,
        fieldOptions: { initialValue: conference },
      },
      {
        label: formatMessage({ id: 'aminer.search.advance.keywords', defaultMessage: 'Key words' }),
        fieldName: 'keywords',
        Component: Input,
        ComponentProps: {
          className: classnames('styles.inputBox', 'styles.name'),
          placeholder: formatMessage({
            id: 'aminer.search.advance.placeholder',
            defaultMessage: 'Search terms separated by commas',
          }),
        },
        onComponentPressEnter,
        fieldOptions: { initialValue: keywords },
      },
    ],
  };

  const onSearchSubmit = ({ fieldsValue, advancedMode, selectedDomains: domain, query }) => {
    if ((!domain || !domain.length) && !query && !Object.keys(fieldsValue).length) {
      return message.info(formatMessage({ id: 'com.KgSearchBox.placeholder' }));
    }
    console.log('onSearchSubmit');
    setSearchScope('');
    // 从搜索条件里构造新的 url 并跳转
    let queryObject = { query };
    let personAdvanceFilter = {},
      paperAdvanceFilter = {};
    let urlParams = {},
      removeUrlParams = [],
      newUrl = '';

    // 构造搜索对象和新的url
    if (searchType === 'person') {
      let { pid } = fieldsValue;
      pid = pid && pid.length ? pid.split(/[, ， ； ;]/) : [];
      if (advancedMode) {
        const { name, org } = fieldsValue;
        // queryObject = { personAdvanceFilter: { name, org, term: query } };
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

    removeUrlParams = ['searchIn', 'author', 'conference', 'keywords', 'k', 'n', 'o'].filter(
      item => {
        if (!paperAdvanceFilter[item] && !personAdvanceFilter[item]) return true;
      },
    );
    if (!domain || !domain.length) {
      removeUrlParams.push('domain');
    }
    helper.routeTo(props, urlParams, null, { removeParams: removeUrlParams });
  };

  const onSearchClear = ({ fieldsValue, selectedDomains: domain, query }) => {
    const initialValues = {};
    for (const key in fieldsValue) {
      if (defaultInitialValues[key]) initialValues[key] = defaultInitialValues[key];
    }
    onSearchSubmit({
      fieldsValue: initialValues,
      advancedMode: true,
      selectedDomains: domain,
      query,
    });
  };

  const advanceSearchItems = useMemo(() => {
    return defaultAdvanceSearchItems[searchType];
  }, [searchType, n, o, searchIn, authorNames, conference, keywords]);

  const config = useMemo(
    () => ({
      person: {
        key: 'person',
        Component: SearchComponent,
        title: <FM id="aminer.search.tab.expert" defaultMessage="Expert" />,
      },
      pub: {
        key: 'pub',
        Component: SearchPaperComponent,
        title: <FM id="aminer.search.tab.paper" defaultMessage="Paper" />,
      },
      gct: {
        key: 'gct',
        Component: SearchGCTComponent,
        title: formatMessage({ id: 'aminer.home.link.gct', defaultMessage: 'GCT' }),
      },
      news: {
        key: 'news',
        Component: SearchNewsComponent,
        title: formatMessage({ id: 'aminer.common.news', defaultMessage: 'News' }),
      },
    }),
    [],
  );

  const onSearchTypeChange = key => {
    const searchTypeInCookie = cookies.getCookie('searchType');
    if (searchTypeInCookie !== key) {
      cookies.setCookie('searchType', key || 'person', '/');
    }
    console.log('-------------777777--------------------', pathType, key, queryObj);
    // 需要跳转?
    if (!pathType && key) {
      // 从person页面跳转到pub页面
      // console.log('>>>>>>>>>>>>>>>>>>>>>>>>|||| 跳转到 ', key);
      helper.routeTo(
        props,
        null,
        { pathType: key },
        {
          transferPath: [{ from: '/search', to: '/search/:pathType' }],
          removeParams: ['forceType'],
        },
      );
    } else if (pathType && !key) {
      // console.log('.>>>>>>>>>>>>>>>>>>|||| 跳转到', key);
      // 从pub页面跳转到person页面
      helper.routeTo(
        props,
        null,
        { pathType: '' },
        {
          transferPath: [{ from: '/search/:pathType', to: '/search' }],
          removeParams: ['forceType'],
        },
      );
    } else {
      helper.routeTo(
        props,
        null,
        { pathType: key },
        {
          removeParams: [
            'forceType',
            'field',
            'resource',
            'time',
            'searchIn',
            'author',
            'conference',
            'keywords',
            'org',
            'topkeywords',
            'alltopic',
            'sortKey',
          ],
        },
      );
    }
  };

  const onSearchPaperFilterChange = (key, value) => {
    // 当在 SearchPaperCurrentFilter 组件中删除了filter
    const { params, removeParams } = searchConfigs.deleteSearchFilter(
      key,
      value,
      field,
      resource,
      time,
      searchIn,
      author,
      conference,
      keywords,
      org,
      topkeywords,
      domain,
    );
    helper.routeTo(props, params, null, { removeParams });
  };

  if (serverRedirect) {
    return [];
  }

  // TODO process source.
  const layoutParams = {
    // query, TODO
    query: queryObj,
    // showSearch: true,
    showHeader: source !== 'sogou' && source !== 'true',
    showAdvanceFilterIcon,
    // footer: (source === 'sogou' || source === 'true') ? [] :
    //   [
    //     <LazyFooter key="13" className="home" />
    //   ]
  };
  if (source === 'sogou' || source === 'true') {
    layoutParams.footer = [];
  }
  const componentParams = {
    person: {
      schema: searchConfigs.schema,
      className: 'aminer',
      special: expertParams,
      alltopic,
      domain,
    },
    pub: {
      getUrl: urls => {
        let url = urls && urls[0] ? urls[0] : '';
        if (urls) {
          for (const item of urls) {
            if (item.startsWich('db/')) {
              url = item;
              break;
            }
          }
        }
        return url;
      },
      searchScope: search_scope,
      setSearchScope,
      esSearchCondition,
      searchCurFilter,
      onSearchPaperFilterChange,
      isAdvanceSearchType,
      field,
      // resource,
      time,
      conference,
      org,
      topkeywords,
      alltopic,
      sortKey,
      domain,
      topZoneFuncs: [],
      leftZoneFuncs: [
        ({
          callSearch,
          fieldSelected,
          orgSelected,
          venuesSelected,
          keywordsSelected,
          timeSelected,
          siderFilterVisibleOnMobile,
          sortKey,
          domainSelected,
        }) => (
          <SearchPaperFilter
            key="SearchPaperFilter"
            callSearch={callSearch}
            fieldSelected={fieldSelected}
            domainSelected={domainSelected}
            orgSelected={orgSelected}
            venuesSelected={venuesSelected}
            keywordsSelected={keywordsSelected}
            timeSelected={timeSelected}
            siderFilterVisibleOnMobile={siderFilterVisibleOnMobile}
            sortKey={sortKey}
          />
        ),
      ],
      rightZoneFuncs: [
        () => <AddTopic />,
        () => <TopicIntro key="TopicIntro" />,
        ({ query, onYearIntervalChange }) => (
          <SearchResultStatistics
            key="SearchResultStatistics"
            query={query}
            onYearIntervalChange={onYearIntervalChange}
          />
        ),
        () => (
          <SearchKnowledge className="size" key="chart_pub" kid="chart_pub" queryObj={queryObj} />
        ),
      ],
      paperListTopFuncs: [],
    },
  };

  const renderTabBar = (props, DefaultTabBar) => {
    return (
      <div className={classnames(styles.tabWrap, { adataTabWrap: sysconfig.ControlContentWidth })}>
        <DefaultTabBar {...props} className={styles.searchPageTab} />
      </div>
    );
  };

  console.log('CHANNEL ?? componentParams', componentParams['person']);

  return (
    <Layout
      classNames={styles.layout}
      pageTitle={`${title}`}
      pageSubTitle="AMiner Search"
      // className="home"
      {...layoutParams}
    >
      <article id="search_body" className={styles.article}>
        <div className={styles.searchPageSearchBox}>
          <div className={styles.searchBoxWrap}>
            <AdvanceSearchBox
              className="search"
              advanceSearchItems={advanceSearchItems}
              advancedMode={true}
              onSearchSubmit={onSearchSubmit}
              onSearchClear={onSearchClear}
              defaultInitialValues={defaultInitialValues}
              searchOnDomainDropdownBlur={true}
              initialParams={{ domain }}
              query={q || k}
            />
          </div>
        </div>
        <Tabs
          activeKey={searchType}
          onChange={onSearchTypeChange}
          animated={false}
          className={styles.searchPageTab}
          renderTabBar={renderTabBar}
          tabBarStyle={{ overflow: 'visible' }}
          destroyInactiveTabPane
        >
          {tabs &&
            tabs.length > 0 &&
            tabs.map((item, index) => {
              const tab = config[item];
              console.log('item', item);
              const { Component, title: tabTitle, key } = tab;
              return (
                <Tabs.TabPane key={key} tab={<h2>{tabTitle}</h2>}>
                  <div className={styles.componentContent}>
                    <Component
                      query={queryObj}
                      rightZoneFuncs={componentRightZones[item]}
                      {...componentParams[item]}
                    />
                  </div>
                </Tabs.TabPane>
              );
            })}
        </Tabs>
      </article>
    </Layout>
  );
};

// SearchPage.getInitialProps = async ({ store, route, isServer, location, res, req }) => {
//   if (!isServer) { return }

//   logtime('SearchPage.getInitialProps 将搜索作为一个不SSR的页面。')
//   logtime('AI10Page.getInitialProps')

//   // ! 这行会导致一个警告：
//   // ! index.js:1 Unexpected key "location" found in previous state received by the reducer. Expected to find one of the known reducer keys instead: "routing", "@@dva", "debug", "global", "aminerAI10", "aminerPerson", "aminerSearch", "modal", "pub", "rank", "report", "roster", "scholars", "searchgct", "searchnews", "searchpaper", "searchperson", "auth", "person-edit", "person", "personpath", "searchmodel-merge", "searchmodel", "searchmodelB", "search", "topic", "loading". Unexpected keys will be ignored.
//   // eslint-disable-next-line consistent-return

//   // ！暂时注掉这行，否则拿不到url里的time resource field 参数
//   // return { location: decodeLocation(location) } // ! 这是 umi-history 的一个 bug，没兼容 服务端,把这个修掉，不用透传
// };

// 做跳转用的例子 https://github.com/umijs/umi/pull/2938
// static async getInitialProps({ res }) {
//   if (res) {
//     res.statusCode = 404
//     res.end('Not found')
//     return
//   }
// }

// const fetchData = () => {
//   const { dispatch } = this.props;
//   const { queryObj: { query } } = this.state;

//   if (!strings.cleanQuery(query)) {
//     return null;
//   }
//   // dispatch({ type: 'search/getTopicByMentionSuccess', payload: { data: { data: {} } } });

//   // if is translated results, use translated english to fetch.
//   const { translatedLanguage, translatedText } = this.props;
//   // console.log('NOT>>>', translatedLanguage, translatedText, this.props.topic);
//   // (!this.props.topic || !this.props.topic.categories)
//   let mention;
//   if (translatedLanguage === 2 && translatedText) {
//     mention = translatedText;
//   } else {
//     mention = strings.firstNonEmptyQuery(query);
//   }
//   dispatch({ type: 'search/getTopicByMention', payload: { mention } })
// };

export default page(
  connect(({ searchpaper }) => ({
    mustReadTopic: searchpaper.topic,
  })),
  // withRouter,
)(SearchPage);

// ------------------------------------
// Helper Funcs
// ------------------------------------
function toggleAdvancedSearchBtnBySearchType(dispatch, type) {
  dispatch({
    type: 'aminerSearch/changeDisableAdvancedSearch',
    payload: { disableAdvancedSearch: withoutAdv.includes(type) },
  });
}

function changeQueryWithAdvancedBtnHidden(props, q, k, type) {
  if (withoutAdv.includes(type)) {
    if (!q) {
      helper.routeTo(
        props,
        { t: 'b', q: k },
        { pathType: type },
        {
          removeParams: ['k', 'n', 'o'],
        },
      );
    }
  }
}
