import React, { Fragment, useEffect, useMemo } from 'react';
import { message } from 'antd';
import { connect, Link, component } from 'acore';
import { sysconfig } from 'systems';
import { getLangLabel } from 'helper';
import { FM, formatMessage } from 'locales';
import { getSearchPathname, getSearchPathname2 } from 'utils/search-utils';
import { ExpertLink } from 'aminer/components/widgets';
import { getProfileUrl } from 'utils/profile-utils';
import { SearchBox, AdvanceSearchBox } from 'aminer/core/search/c/control';
// import Banner from './Banner';
import BannerWithICLR from './BannerWithICLR';
// import Ncp from './Ncp';

import { navs, profiles_line, profiles, sugg_line2, searchWords } from '../data/home-data';
import styles from './HomeTop.less';

// TODO Another way to focus?

const focusInput = () => {
  const inputs = document.getElementsByClassName('react-autosuggest__input');
  inputs[0].focus();
};

/**
 * Refactor by BoGao 2019-06-10
 * AMiner Homepage
 *   2019-06-10 - to hooks
 */
const HomeTop = props => {
  const { dispatch, isAdvancedSearch } = props;
  useEffect(() => {
    focusInput();
  }, []);

  const callSearch = changes => {
    const {
      query: { queryObject },
    } = changes;
    if (
      (queryObject.query && queryObject.query !== '-') ||
      (queryObject.advanced &&
        (queryObject.advanced.term || queryObject.advanced.name || queryObject.advanced.org))
    ) {
      // dispatch(routerRedux.push(getSearchPathname(queryObject)));
      window.location.href = getSearchPathname(queryObject);
    } else {
      focusInput();
    }
  };

  // const onSearch = query => callSearch({ query });

  const onSearchSubmit = ({ fieldsValue, advancedMode, selectedDomains: domain, query }) => {
    if ((!domain || !domain.length) && !query) {
      return message.info(formatMessage({ id: 'com.KgSearchBox.placeholder' }));
    }
    // 从搜索条件里构造新的 url 并跳转
    const queryObject = { query };
    if (query) {
      window.location.href = getSearchPathname2(query, {}, domain);
    } else {
      window.location.href = getSearchPathname2(query, {}, domain, 'pub');
    }
  };

  // const onSearchQuery = (query, searchType) => {
  //   // if
  //   dispatch({ type: 'searchmodel/toggleAdvancedSearch', payload: true });
  //   // dispatch(routerRedux.push(getSearchPathname(query)));
  //   if (query === '2019-nCOV') {
  //     window.location.href = getSearchPathname(query, null, 'pub');
  //     return;
  //   }
  //   window.location.href = `${getSearchPathname(query, null, searchType)}`;
  // };
  const Search_Line = useMemo(() => {
    return (
      <div className={styles.searchs}>
        {searchWords &&
          searchWords.map((word, index) => (
            <Fragment key={word}>
              <Link to={`/search/person?t=b&q=${word}`}>{word}</Link>
              {index !== searchWords.length - 1 && <em>, </em>}
            </Fragment>
          ))}
      </div>
    );
  }, [searchWords]);

  const langKey = sysconfig.Locale === 'en-US' ? 'en' : 'zh';

  const goToTopic = id => {
    window.open(`/topic/${id}`, '_blank');
  };

  const queryLinks = useMemo(() => {
    const spliterChar = ', ';
    return (
      <>
        {/* <>
          <Link to="/conf/nips2019" target="_blank">
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-lianjie" />
            </svg>
            NeurIPS
          </Link>
          <em>{spliterChar}</em>
        </> */}
        {/* return
        items.map(item => {
                return (
                  <Fragment key={item}>
                    <span className="title">{key}</span>
                    <span onClick={onSearchQuery.bind(this, item)}>{item}</span>
                    {index !== sugg_line2.length - 1 && <em>{spliterChar}</em>}
                  </Fragment>
                );
              }); */}
        {sugg_line2 &&
          sugg_line2.map((line, index) => (
            <div key={line.name}>
              {line.name && (
                <span className={styles.sugg_legend}>
                  <a target="_blank" href={line.href}>
                    {line.name}
                  </a>
                  :
                </span>
              )}
              {line.value.map((item, iIndex) => (
                <Fragment key={item.id}>
                  <span onClick={goToTopic.bind(this, item.id)}>{item.name}</span>
                  {iIndex !== line.value.length - 1 && <em>{spliterChar}</em>}
                </Fragment>
              ))}
            </div>
          ))}
      </>
    );
  }, [langKey, sugg_line2]);

  // const nCoV = useMemo(() => {
  //   const spliterChar = ', ';
  //   return (
  //     <>
  //       {sugg_line1 &&
  //         sugg_line1.map((item, index) => (
  //           <Fragment key={item}>
  //             <span onClick={onSearchQuery.bind(this, item)}>{item}</span>
  //             {index !== sugg_line1.length - 1 && <em>{spliterChar}</em>}
  //           </Fragment>
  //         ))}
  //     </>
  //   );
  // }, [langKey, sugg_line1]);

  // const goProfilePage = item => {
  //   dispatch({ type: 'profile/getProfileInfoSuccess', payload: { data: item } })
  // }

  return (
    <div className={styles.searchContent}>
      <h1 style={{ display: 'none' }}>Knowledge Intelligence</h1>
      <p className={styles.title}>
        {/* <FM id="aminer.home.title.data" defaultMessage='Data' />
          <span className={styles.dat}>·</span> */}
        {/* <FM id="aminer.home.title.knowledge" defaultMessage="Knowledge" /> */}
        <span>
          {/* <svg className="icon" aria-hidden="true">
            <use xlinkHref={`#icon-${formatMessage({ id: 'aminer.home.title.icon' })}`} />
          </svg> */}
          <a
            href={getLangLabel(
              'https://www.aminer.cn/conf/kdd2020/videos/5f03f3b611dc830562231fe7',
              'https://www.aminer.cn/conf/kdd2020/videos/5f03f3b611dc830562231fe7',
            )}
            target="_blank"
          >
            <img
              src={getLangLabel(
                'https://fileserver.aminer.cn/data/conf/img/KDD.gif',
                'https://fileserver.aminer.cn/data/conf/img/KDD.gif',
              )}
            />
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-shipin1" />
            </svg>
          </a>
        </span>
        {/* <span className={styles.dat}>+</span>
        <span>Intelligence</span> */}
        {/* <FM id="aminer.home.title.intelligence" defaultMessage="Intelligence" /> */}
      </p>

      <div className={styles.searchWrap}>
        {/* <Search onSearch={this.onSearch} size="large" textColor="light" /> */}
        {/* <SearchBox
          // query={query}
          // disableAdvancedSearch
          searchPlaceholder={
            isAdvancedSearch
              ? formatMessage({
                  id: 'com.KgSearchBox.placeholderTerm',
                  defaultMessage: 'Term',
                })
              : formatMessage({
                  id: 'aminer.search.placeholder.mind',
                  defaultMessage: 'Whatever comes to your mind',
                })
          }
          size="huge"
          className="home"
          showSearchIcon
          onSearch={onSearch}
        /> */}
        <AdvanceSearchBox
          advancedMode={false}
          searchPlaceholder={formatMessage({
            id: 'aminer.search.placeholder.mind',
            defaultMessage: 'Whatever comes to your mind',
          })}
          size="huge"
          className="home"
          showSearchIcon
          onSearchSubmit={onSearchSubmit}
        />
      </div>

      {Search_Line}
      {/* <p className={styles.SuggestSearch}>{nCoV}</p> */}

      <div className={styles.SuggestSearch}>{queryLinks}</div>

      <p className={styles.profile}>
        {profiles_line && profiles_line.label && (
          <span className={styles.sugg_legend}>
            <a target="_blank" href={profiles_line.label.href}>
              {profiles_line.label.name}
            </a>
            :
          </span>
        )}
        {profiles_line &&
          profiles_line.profiles &&
          profiles_line.profiles.map((item, index) => (
            <Fragment key={item.id}>
              <ExpertLink author={item}>
                <Link to={getProfileUrl(item.name, item.id)}>
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-profile" />
                  </svg>
                  {item.name}
                </Link>
              </ExpertLink>
              {index !== profiles_line.profiles.length - 1 && <em>{', '}</em>}
            </Fragment>
          ))}
      </p>

      <div className={styles.navigation}>
        {/* navs &&
          navs.length > 0 &&
          navs.map(nav => (
            <a
              className={styles.navItem}
              key={nav.id}
              href={nav.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.icon}>
                <div className={styles.icon_inner}>
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref={`#${nav.icon}`} />
                  </svg>
                </div>
              </div>
              <FM id={nav.id} defaultMessage={nav.defaultMessage} />
              <div className={styles.arrow}>
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-arrow-" />
                </svg>
              </div>
            </a>
          )) */}
        {navs &&
          navs.length > 0 &&
          navs.map(nav =>
            nav.target ? (
              <a
                key={nav.id}
                className={styles.navItem}
                href={nav.href}
                target={nav.target}
                rel="noopener noreferrer"
              >
                <span className={styles.itemIcon}>
                  <img src={nav.image} />
                </span>
                <p className={styles.itemName}>{formatMessage({ id: nav.id })}</p>
              </a>
            ) : (
              <Link key={nav.id} className={styles.navItem} to={nav.href}>
                <span className={styles.itemIcon}>
                  <img src={nav.image} />
                </span>
                <p className={styles.itemName}>{formatMessage({ id: nav.id })}</p>
              </Link>
            ),
          )}
      </div>

      <div className={styles.ncpWraper}>
        {/* <Ncp /> */}
        <div className={styles.bannerWraper}>
          {/* <a className={styles.bannerBorder} href="https://covid-19.aminer.cn/" target="_blank" rel="noopener noreferrer">
            <img src="https://fileserver.aminer.cn/sys/aminer/homepage/covidBanner.jpg" alt="AMiner疫情专题" className={styles.banner} />
          </a> */}
          {/* <Banner lang={langKey}/> */}
          <BannerWithICLR lang={langKey} />
        </div>
      </div>
    </div>
  );
};

export default component(
  connect(({ searchmodel }) => ({
    // here is main model.
    isAdvancedSearch: searchmodel.isAdvancedSearch,
  })),
)(HomeTop);

// Previous Version

// {sysconfig.Locale === 'en-US' && (
//   <div className={styles.navigation}>

//     <div className={styles.navItem}>
//       <a href="//map.aminer.cn/geo/touch_v2/trajectory?domain=55e6573845ce9da5c99535a9" target="_blank" rel="noopener noreferrer">
//         <span className={styles.uppercase}>T</span>
//         <span className={styles.normal}>rajectory</span>
//       </a>
//       <img src={`${consts.LocalPublicPath}sys/aminer/homepage/news.png`} alt="new" />
//     </div>

//     <span className={styles.split} />

//     <div className={styles.navItem}>
//       <a href="//csrankings.aminer.cn/" target="_blank" rel="noopener noreferrer">
//         <span className={styles.uppercase}>CS</span>
//         <span className={styles.normal}>Rankings</span>
//       </a>
//       <img src={`${consts.LocalPublicPath}sys/aminer/homepage/news.png`} alt="new" />
//     </div>

//     <span className={styles.split} />

//     <div className={styles.navItem}>
//       <Link to="/ai-history">
//         <span className={styles.uppercase}>AI</span>
//         <span className={styles.normal}>History</span>
//       </Link>
//     </div>

//     <span className={styles.split} />

//     <div className={styles.navItem}>
//       <Link to="/open-academic-graph">
//         <span className={styles.uppercase}>O</span>
//         <span className={styles.normal}>pen Academic Graph</span>
//       </Link>
//     </div>

//     <span className={styles.split} />

//     <div className={styles.navItem}>
//       <Link to="/event">
//         <span className={styles.uppercase}>A</span>
//         <span className={styles.normal}>cademic Events</span>
//       </Link>
//     </div>

//     <span className={styles.split} />

//     <div className={styles.navItem}>
//       <a href="//trend.aminer.cn/" target="_blank" rel="noopener noreferrer">
//         <span className={styles.uppercase}>T</span>
//         <span className={styles.normal}>rend</span>
//       </a>
//     </div>

//   </div>
// )}

// {sysconfig.Locale === 'zh-CN' && (
//   <div className={classnames(styles.navigation, styles.zh)}>

//     <div className={styles.navItem}>
//       <a href="//map.aminer.cn/geo/touch_v2/trajectory?domain=55e6573845ce9da5c99535a9" target="_blank" rel="noopener noreferrer">
//         <span className={styles.normal}>人才流动</span>
//         <img src={`${consts.LocalPublicPath}sys/aminer/homepage/news.png`} alt="new" />
//       </a>
//     </div>

//     <span className={styles.split} />

//     <div className={styles.navItem}>
//       <a href="//csrankings.aminer.cn/" target="_blank" rel="noopener noreferrer">
//         <span className={styles.normal}>CSRankings</span>
//       </a>
//       <img src={`${consts.LocalPublicPath}sys/aminer/homepage/news.png`} alt="new" />
//     </div>

//     <span className={styles.split} />

//     <div className={styles.navItem}>
//       <Link to="/ai-history">
//         <span className={styles.normal}>AI发展史</span>
//       </Link>
//     </div>

//     <span className={styles.split} />

//     <div className={styles.navItem}>
//       <Link to="/open-academic-graph">
//         <span className={styles.normal}>开放学术数据</span>
//       </Link>
//     </div>

//     <span className={styles.split} />

//     <div className={styles.navItem}>
//       <Link to="/event">
//         <span className={styles.normal}>学术活动</span>
//       </Link>
//     </div>

//     <span className={styles.split} />

//     <div className={styles.navItem}>
//       <a href="//trend.aminer.cn/" target="_blank" rel="noopener noreferrer">
//         <span className={styles.normal}>趋势预测</span>
//       </a>
//     </div>

//   </div>
// )}
