/* eslint-disable no-param-reassign */
import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import { connect, component, withRouter, history, Link } from 'acore';
import { classnames } from 'utils';
import helper from 'helper';
import consts from 'consts';
import { FM, formatMessage } from 'locales';
import { loadWechatJSSDK } from 'utils/requirejs';
import { useResizeEffect } from 'helper/hooks';
import { Layout } from 'aminer/layouts';
import { sysconfig } from 'systems';
import { logtime } from 'utils/log';
import { BackTop } from 'antd';
import { Menu, PositionPage, QAPage, MessageBoard } from './c';
import { IntroComponent } from './c/intro';
import { FieldComponent } from './c/field';
import styles from './index.less';

const { AI2000_Latest_Year, AI2000_Default_Year } = sysconfig;
const logoPath = `${consts.ResourcePath}/sys/aminer/AI2000-logo.png`;

// Methods

const findIDItem = (type, list) =>
  list.find(scholar => scholar.alias === type || scholar.id === type);

const menuData = [
  { tag_id: 'menu_about', id: 'ai2000.side.about' },
  { tag_id: 'menu_women', id: 'ai2000.side.women_in_ai' },
  { tag_id: 'winners_in_multiple_fields', id: 'ai2000.home.menu.multiple' },
  { tag_id: 'countries_of_winners', id: 'ai2000.home.menu.countries' },
  { tag_id: 'institutes_of_winners', id: 'ai2000.home.menu.institutes' },
  { tag_id: 'gender_of_winners', id: 'ai2000.home.menu.gender' },
  { tag_id: 'menu_rules', id: 'ai2000.side.rules' },
  { tag_id: 'menu_contact', id: 'ai2000.side.contact' },
  // { tag_id: 'menu_previous', id: 'ai2000.side.previous' },
];

const specialTypes = ['position', 'qa', 'multi-domains'];
const specialComp = {
  position: PositionPage,
  qa: QAPage,
  'multi-domains': FieldComponent,
};
// Computer Graphics， Visualization, Knowledge Engineering
const hasVersionDomains = ['5dc122672ebaa6faa962c104', '5dc122672ebaa6faa962bf6c', '5dc122672ebaa6faa962c073'];

// Components

const AI10Page = props => {
  const [selectDomains, setSelectDomains] = useState([]);
  const [isShowTitleMenu, setIsShowTitleMenu] = useState(false);
  const {
    dispatch,
    match,
    location,
    currentID,
    domainList,
    aiYearData,
    // tracks,
    homeComments,
    wechatVer,
  } = props;
  const {
    params: { type, year },
  } = match;
  const { pathname, search } = location;
  const nameLang = sysconfig.Locale === 'en-US' ? 'name' : 'name_zh';
  const awardID = useMemo(() => {
    if (domainList && !specialTypes.includes(type)) {
      return findIDItem(type, domainList);
    }
    return null;
  }, [type, domainList]);

  const menuRef = useRef();

  const isRecent = useMemo(() => {
    return pathname && pathname.startsWith('/ai2000');
  }, [pathname]);
  const searchType = useMemo(() => {
    return isRecent ? 'AI 2000' : 'AI ALL';
  }, [isRecent]);
  const isMultiDomain = useMemo(() => type === 'multi-domains', [type]);

  const aiType = useMemo(() => (isRecent ? 'ai2000' : 'ai'), [isRecent]);

  const trackType = useMemo(() => (isRecent ? 'ai10' : 'ai'), [isRecent]);

  const y = useMemo(() => (year ? year - 0 : AI2000_Default_Year), [year]);

  useEffect(() => {
    if (wechatVer) {
      return;
    }
    dispatch({
      type: 'aminerCommon/setWechatVer',
      payload: {
        ver: true,
      },
    });
    dispatch({
      type: 'aminerAI10/GetWechatSignature',
      payload: {
        url: `https://www.aminer.cn${pathname}${search}`,
      },
    }).then(data => {
      loadWechatJSSDK(wx => {
        const { appId, nonceStr, signature, timestamp } = data;
        const option = {
          // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId,
          nonceStr,
          signature,
          timestamp,
          jsApiList: [
            // 'updateAppMessageShareData', // “分享给朋友”及“分享到QQ”
            // 'updateTimelineShareData', // “分享到朋友圈”及“分享到QQ空间”
            'onMenuShareAppMessage',
            'onMenuShareTimeline',
          ], // 必填，需要使用的JS接口列表
        };
        wx.config(option);
        wx.ready(() => {
          // 需在用户可能点击分享按钮前就先调用
          // const desc = '';
          const shareLink = `https://www.aminer.cn${pathname}`;

          // wx.updateAppMessageShareData({
          //   title: 'AI 2000人工智能全球最具影响力学者 - AMiner', // 分享标题
          //   desc: '不能错过的人工智能全球 2000 位最具影响力学者榜单', // 分享描述
          //   link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          //   imgUrl: `${consts.ResourcePath}/sys/aminer/ai10/ai2000_logo.jpeg`, // 分享图标
          //   success: () => {
          //     alert('Search updateAppMessageShareData 设置成功');
          //     // 设置成功
          //   },
          // });
          // wx.updateTimelineShareData({
          //   title: 'AI 2000人工智能全球最具影响力学者 - AMiner', // 分享标题
          //   link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          //   imgUrl: `${consts.ResourcePath}/sys/aminer/ai10/ai2000_logo.jpeg`, // 分享图标
          //   success: () => {
          //     alert('Search updateTimelineShareData 设置成功');
          //     // 设置成功
          //   },
          // });

          wx.onMenuShareAppMessage({
            title: 'AI 2000人工智能全球最具影响力学者 - AMiner', // 分享标题
            desc: '不能错过的人工智能全球 2000 位最具影响力学者榜单', // 分享描述
            link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: `${consts.ResourcePath}/sys/aminer/ai10/ai2000_logo.jpeg`, // 分享图标
            success: () => {
              // alert('aaaaaaaaaaaaaaaaa');
              // 设置成功
            },
          });
          wx.onMenuShareTimeline({
            title: 'AI 2000人工智能全球最具影响力学者 - AMiner', // 分享标题
            link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: `${consts.ResourcePath}/sys/aminer/ai10/ai2000_logo.jpeg`, // 分享图标
            success: () => {
              // alert('bbbbbbbbbbbbbbbbb');
              // 设置成功
            },
          });
        });

        wx.error(res => {
          // alert(JSON.stringify(res));
        });
      });
    });

    return () => {
      dispatch({
        type: 'aminerCommon/setWechatVer',
        payload: {
          ver: false,
        },
      });
    };
  }, []);

  useEffect(() => {
    if (!domainList && !aiYearData) {
      dispatch({
        type: 'aminerAI10/GetSSRDomainInfoData',
        payload: { aiType: trackType, year: y },
      });
    }
    if (!type && !aiYearData) {
      dispatch({
        type: 'aminerAI10/GetHomeInfo',
        payload: {
          // recent_10: isRecent,
          type: searchType,
          year: y,
        },
      });
    }

    if (type && !specialTypes.includes(type) && awardID && awardID.id !== currentID) {
      dispatch({
        type: 'aminerAI10/Track',
        payload: {
          data: [
            {
              type: `${trackType}${y}`,
              target_type: awardID.name,
            },
          ],
        },
      });
      dispatch({
        type: 'aminerAI10/GetDomainTopScholars',
        payload: {
          domain: awardID.id,
          top_n: 100,
          // recent_10: isRecent,
          type: searchType,
          year: y,
        },
      });
      // dispatch({
      //   type: 'aminerAI10/getAwardRosterTop100ById',
      //   payload: {
      //     domain_id: awardID.id,
      //     top_n: 100,
      //     recent_10: isRecent,
      //     year: y,
      //   },
      // });
    }
  }, [awardID, domainList]);

  useResizeEffect(menuRef);

  const pageTitle = useMemo(
    () =>
      type && awardID
        ? `AI 2000 ${awardID[nameLang]}`
        : formatMessage({ id: 'ai2000.browser.title' }),
    [type, awardID],
  );

  const showTitleMenu = () => {
    setIsShowTitleMenu(!isShowTitleMenu);
  };

  const showMenu = useCallback(() => {
    if (!menuRef.current) {
      return;
    }
    if (menuRef.current.style.display === 'block') {
      menuRef.current.style.display = 'none';
    } else {
      menuRef.current.style.display = 'block';
    }
  }, []);

  // -- actions

  const scrollToAnchor = (anchorName, isHigh = true) => {
    if (anchorName) {
      // 找到锚点
      const anchorElement = document.getElementById(anchorName);

      if (isHigh) {
        const menuElement = document.getElementById(`to_${anchorName}`);
        const menuContainer = menuElement.parentElement;
        Array.from(menuContainer.children).forEach(item => {
          item.classList.remove('active');
        });
        menuElement.classList.add('active');
      }

      // 如果对应id的锚点存在，就跳转到锚点
      if (anchorElement) {
        anchorElement.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }
  };
  // const changeVersion = () => {
  //   console.log('index changeVersion');
  //   setIsVersion(!isVersion);
  // };

  const MainPage = type && !specialTypes.includes(type) ? FieldComponent : specialComp[type];
  const mainPageParams = useMemo(() => {
    if (!type) {
      return {};
    }
    const params = {
      year,
      showMenu,
    };
    if (type === 'position') {
      params.aiType = aiType;
    } else if (type === 'qa') {
      params.trackType = trackType;
    } else if (type === 'multi-domains') {
      // params.trackType = trackType;
      params.isRecent = isRecent;
      params.isMultiDomain = isMultiDomain;
      params.selectDomains = selectDomains;
    } else {
      params.isRecent = isRecent;
      // params.persons = props.scholarList;
      params.pageData = awardID;
      params.isMultiDomain = isMultiDomain;
      params.selectDomains = selectDomains;
      params.hasVersion = awardID && hasVersionDomains.includes(awardID.id);
    }
    return params;
  });

  if (!domainList) {
    return false;
  }
  return (
    <Layout pageTitle={pageTitle}>
      <article className={styles.wrapper}>
        <section className={styles.article}>
          <div className="scholar_menu" ref={menuRef}>
            <div className="top_title">
              <p className="title_line">
                <Link
                  to={`/${aiType}${year ? `/year/${year}` : ''}`}
                  className={classnames('main_title', { active: !type })}
                >
                  <img className="logo_img" src={logoPath} alt="" />
                </Link>
                {/* {!type && (
                  <span
                    className={classnames('arrow', { active: isShowTitleMenu })}
                    onClick={showTitleMenu}
                  ></span>
                )} */}
              </p>
              {/* 
              {!type && !isShowTitleMenu && (
                <ul className="title_menu">
                  {menuData.map(
                    (item, index) =>
                      ((item.id !== 'ai2000.side.women_in_ai' && sysconfig.Locale === 'zh-CN') ||
                        sysconfig.Locale === 'en-US') && (
                        <span
                          key={item.id}
                          className="title_sub_menu"
                          onClick={() => {
                            scrollToAnchor(`${item.tag_id}`, false);
                          }}
                        >
                          <FM id={item.id} />
                        </span>
                      ),
                  )}
                </ul>
              )} */}
            </div>
            <Menu
              year={y}
              domainList={domainList}
              isRecent={isRecent}
              defaultType={specialTypes.includes(type) ? type : awardID && awardID.alias}
              specialTypes={specialTypes}
              // defaultTypeInfo={awardID}
              selectDomains={selectDomains}
              setSelectDomains={setSelectDomains}
              menuRef={menuRef}
              isMultiDomain={isMultiDomain}
            />
            {!specialTypes.includes(type) && (
              <div className="domain_message">
                <FM tagName="h3" id="ai10.domain.message" defaultMessage="AI scholar comments" />
                <MessageBoard
                  trackType={trackType}
                  comment_id={
                    type
                      ? awardID &&
                      awardID.comment_id_map &&
                      awardID.comment_id_map[`${trackType}${y}`]
                      : homeComments[`${trackType}${y}`]
                  }
                />
              </div>
            )}
          </div>
          <section className="scholar_content">
            {!type && (
              <>
                <IntroComponent
                  showMenu={showMenu}
                  year={year}
                  isRecent={isRecent}
                  aiType={aiType}
                />
                <div className="menu_fix">
                  <div className="menu_center">
                    <div className="home_menu" id="home_menu">
                      {menuData.map(
                        (item, index) =>
                          ((item.id !== 'ai2000.side.women_in_ai' &&
                            sysconfig.Locale === 'zh-CN') ||
                            sysconfig.Locale === 'en-US') && (
                            <a
                              key={item.id}
                              id={`to_${item.tag_id}`}
                              className={classnames({ active: index === 0 })}
                              // href={`#${item.tag_id}`}
                              onClick={() => {
                                scrollToAnchor(`${item.tag_id}`);
                              }}
                            >
                              <FM id={item.id} />
                            </a>
                          ),
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            {type && <MainPage {...mainPageParams} />}
            {/* {type && !specialTypes.includes(type) && (
              <FieldPage
                hasVersion={hasVersionDomains.includes(awardID.name)}
                year={year}
                isRecent={isRecent}
                persons={props.scholarList}
                pageData={awardID}
                showMenu={showMenu}
              />
            )}
            {specialTypes.includes(type) && (
              <PositionPage year={year} showMenu={showMenu} aiType={aiType} />
            )} */}
          </section>
        </section>
      </article>
      <BackTop />
    </Layout>
  );
};

// SSR时，服务端初次加载页面数据用这个方法。
// 这个例子数据存在model中，model数据会序列化在页面中，在客户端加载时还原到model中。
// 此组件在useEffect中通过判断model中是否有值来再次获取数据。
AI10Page.getInitialProps = async ({ store, isServer, match, history }) => {
  if (!isServer) {
    return;
  }
  const { location } = history || {};

  logtime('getInitialProps::AI10Page init');
  const { pathname } = location;
  const { year, type } = match.params || {};
  const isRecent = pathname.startsWith('/ai2000');
  const searchType = isRecent ? 'AI 2000' : 'AI ALL';
  const aiType = isRecent ? 'ai2000' : 'ai';
  const trackType = isRecent ? 'ai10' : 'ai';
  // const now = new Date().getFullYear() - 0;
  const y = year ? year - 0 : AI2000_Default_Year;

  if (isServer && year) {
    if (year === '2016') {
      history.replace('/mostinfluentialscholar');
      throw new Error(`HANDLABLE_ERROR:{"type":"redirect","url":"${'/mostinfluentialscholar'}"}`);
    } else if (year === '2018') {
      history.replace('/ai10');
      throw new Error(`HANDLABLE_ERROR:{"type":"redirect","url":"${'/ai10'}"}`);
    } else if (year - 0 > AI2000_Latest_Year || year - 0 < 2018) {
      history.replace('/ai2000');
      throw new Error(`HANDLABLE_ERROR:{"type":"redirect","url":"${'/ai2000'}"}`);
    }
  }

  const domainList = await store.dispatch({
    type: 'aminerAI10/GetSSRDomainInfoData',
    payload: { aiType: trackType, year: y },
  });

  if (!type) {
    await store.dispatch({
      type: 'aminerAI10/GetHomeInfo',
      payload: {
        // recent_10: isRecent,
        type: searchType,
        year: y,
      },
    });
  }
  if (type && !specialTypes.includes(type)) {
    await store.dispatch({
      type: 'aminerAI10/GetDomainTopScholars',
      payload: {
        domain: findIDItem(type, domainList).id,
        top_n: 100,
        // recent_10: isRecent,
        type: searchType,
        year: y,
      },
    });
    // await store.dispatch({
    //   type: 'aminerAI10/getAwardRosterTop100ById',
    //   payload: {
    //     domain_id: findIDItem(type, domainList).id,
    //     top_n: 100,
    //     recent_10: isRecent,
    //     year: y,
    //   },
    // });
    await store.dispatch({
      type: 'aminerAI10/Track',
      payload: {
        data: [
          {
            type: `${trackType}${y}`,
            target_type: findIDItem(type, domainList).name,
          },
        ],
      },
    });
  }
  logtime('getInitialProps::AI10Page Done');

  const { aminerAI10 } = store.getState();
  const {
    domainList: domainLists,
    domainInfo,
    homeComments,
    aiYearData,
    currentID,
    scholarList,
    dynamic_id,
  } = aminerAI10 || {};
  // console.log('aminerAI10---', aminerAI10);
  return {
    aminerAI10: {
      domainList: domainLists,
      domainInfo,
      homeComments,
      aiYearData,
      currentID,
      scholarList,
      dynamic_id,
    },
  };
  // return { aminerAI10 };
  // 也可以直接使用下面方式返回。

  // return Promise.resolve({
  //   data: {
  //     ssr: 'http://127.0.0.1:7001',
  //     csr: 'http://127.0.0.1:8000',
  //   },
  // });
};

export default component(
  withRouter,
  connect(({ aminerAI10, aminerCommon }) => ({
    currentID: aminerAI10.currentID,
    domainList: aminerAI10.domainList,
    aiYearData: aminerAI10.aiYearData,
    homeComments: aminerAI10.homeComments,
    // tracks: aminerAI10.tracks,
    wechatVer: aminerCommon.wechatVer,
  })),
)(AI10Page);
