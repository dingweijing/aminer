/* eslint-disable no-param-reassign */
import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { connect, component, withRouter } from 'acore';
import { classnames } from 'utils';
import helper from 'helper';
import consts from 'consts';
import { sysconfig } from 'systems';
import { FM, formatMessage } from 'locales';
import { loadWechatJSSDK } from 'utils/requirejs';
import { useResizeEffect } from 'helper/hooks';
import { Layout } from 'aminer/layouts';
import { logtime } from 'utils/log';
import { MessageBoard } from 'aminer/p/ai2000/c';
import { Female, Country, Timeline, Trend, Ages, Cloud, Menu } from './c';
import styles from './index.less';

const logoPath = `${consts.ResourcePath}/sys/aminer/logoFemale.png`;
const wechatPath = `${consts.ResourcePath}/sys/aminer/wechat.jpg`;
const type_map = {
  female: {
    component: Female,
    title_id: 'ai2000.female.sider.female',
  },
  chinese: {
    component: Female,
    title_id: 'ai2000.female.sider.female',
  },
  country: {
    component: Country,
    title_id: 'ai2000.female.sider.country',
  },
  timeline: {
    component: Timeline,
    title_id: 'ai2000.female.sider.timeline',
  },
  trend: {
    component: Ages,
    title_id: 'ai2000.female.sider.trend',
  },
  ages: {
    component: Ages,
    title_id: 'ai2000.female.sider.ages',
  },
  cloud: {
    component: Cloud,
    title_id: 'ai2000.female.sider.cloud',
  },
};

const menus = [
  {
    title_id: 'ai2000.female.sider.female',
    key: ['', 'chinese'],
  },
  {
    title_id: 'ai2000.female.sider.country',
    key: 'country',
  },
  {
    title_id: 'ai2000.female.sider.trend',
    key: 'trend',
  },
  // {
  //   title_id: 'ai2000.female.sider.ages',
  //   key: 'ages',
  // },
  {
    title_id: 'ai2000.female.sider.cloud',
    key: 'cloud',
  },
  {
    title_id: 'ai2000.female.sider.timeline',
    key: 'timeline',
  },
];
const FemalePage = props => {
  const { dispatch, match, location, wechatVer } = props;

  const {
    params: { type },
  } = match;
  const { pathname, search } = location;

  const menuRef = useRef();

  useResizeEffect(menuRef);

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

          wx.onMenuShareAppMessage({
            title: '人工智能全球女性榜单 - AMiner', // 分享标题
            desc: '才逾咏絮，心怀参商。', // 分享描述
            link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: `${consts.ResourcePath}/sys/aminer/ai10/women-in-ai.jpeg`, // 分享图标
            success: () => {
              // alert('aaaaaaaaaaaaaaaaa');
              // 设置成功
            },
          });
          wx.onMenuShareTimeline({
            title: '人工智能全球女性榜单 - AMiner', // 分享标题
            link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: `${consts.ResourcePath}/sys/aminer/ai10/women-in-ai.jpeg`, // 分享图标
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

  const TypeComponent = type_map[type || 'female'].component;
  const typeParams = useMemo(() => {
    const obj = {};
    if (type === 'chinese') {
      obj.is_china = true;
    }
    return obj;
  }, [type]);

  return (
    <Layout pageTitle={formatMessage({ id: 'ai2000.female.pagetitle' })}>
      <article className={styles.wrapper}>
        <section className={styles.article}>
          <div className="left" ref={menuRef}>
            <img
              className="logo"
              src={logoPath}
              alt=""
              useMap="#aiFemaleLogoImg"
              hidefocus="true"
            />
            <map id="aiFemaleLogoImg" name="aiFemaleLogoImg">
              <area
                shape="rect"
                coords="0, 0, 126, 40"
                href="https://www.aminer.cn/ai2000"
                target="_blank"
                title="AI 2000"
                alt="AI 2000"
              />
            </map>
            <Menu menus={menus} menuRef={menuRef} defaultType={type || ''} />
            {sysconfig.Locale === 'zh-CN' && (
              <div className="wechat desktop_device">
                <img src={wechatPath} alt="" />
                <p>扫码关注更多学术动态</p>
              </div>
            )}
            <div className="domain_message">
              <FM tagName="h3" id="ai10.domain.message" defaultMessage="AI scholar comments" />
              <MessageBoard trackType="ai" comment_id="5e5c5040eb2fa482998aae7d" />
            </div>
          </div>
          <div className="right">
            <svg className="icon menu_icon" aria-hidden="true" onClick={showMenu}>
              <use xlinkHref="#icon-menu1" />
            </svg>
            <h1 className="home_title">
              <FM id={type_map[type || 'female'].title_id} />
            </h1>
            <div className="right_component">
              <TypeComponent {...typeParams} />
            </div>
          </div>
          {/* <PersonList
            // typeid={typeid}
            showAuthorCard={false}
            personList={ai10_female_data.ranks}
          /> */}
        </section>
      </article>
    </Layout>
  );
};

// SSR时，服务端初次加载页面数据用这个方法。
// 这个例子数据存在model中，model数据会序列化在页面中，在客户端加载时还原到model中。
// 此组件在useEffect中通过判断model中是否有值来再次获取数据。
FemalePage.getInitialProps = async ({ store, isServer, match }) => {
  if (!isServer) {
    return;
  }

  logtime('getInitialProps::FemalePage init');

  // const { pathname } = location;
  const { type } = match.params || {};

  if (!type) {
    await store.dispatch({
      type: 'aminerAI10/getFemaleAwardRoster',
    });
  } else {
    await store.dispatch({
      type: 'aminerAI10/getFemaleOtherData',
    });
  }
  // if (!type) {
  // } else if (awardID && awardID.id) {
  //   await store.dispatch({
  //     type: 'aminerAI10/getAwardRosterTop100',
  //     payload: { typeid: awardID && awardID.id }
  //   });
  // }
  // const { aminerAI10 } = store.getState()
  logtime('getInitialProps::FemalePage Done');
  const { aminerAI10 } = store.getState();
  return { aminerAI10 };
};

export default component(
  withRouter,
  connect(({ aminerAI10 }) => ({
    ai10_female_ranks: aminerAI10.ai10_female_ranks,
    ai10_female_data: aminerAI10.ai10_female_data,
  })),
)(FemalePage);
