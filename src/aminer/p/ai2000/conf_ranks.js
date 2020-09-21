/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo, useState } from 'react';
import { connect, component, withRouter, Link, history } from 'acore';
import consts from 'consts';
import { FM } from 'locales';
import { getLangLabel, routeTo } from 'helper';
import { loadWechatJSSDK } from 'utils/requirejs';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import { Layout } from 'aminer/layouts';
import { Tabs } from 'antd';
import PublicationList from 'aminer/components/pub/PublicationList.tsx';
import AI2000PersonList from 'aminer/p/ai2000/component/AI2000PersonList';
import { Spin } from 'aminer/components/ui';
import { setViews, getViews } from 'utils/aminer-common';
import styles from './conf_ranks.less';

const { TabPane } = Tabs;
const background =
  'https://static.aminer.cn/buildin/confs/1922/469/1920/5e6f3c26a7058c6e3520dbd3_4.jpg';

const type_map = {
  scholars: {
    key: '',
    component: AI2000PersonList,
    params: {
      contentRankZone: [
        ({ rank }) => (
          <div key={6} className={styles.personRanking}>
            {rank <= 3 && (
              <div className={styles.top}>
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref={`#icon-ai10_rank_${rank}`} />
                </svg>
              </div>
            )}
            {rank > 3 && rank <= 10 && (
              <div className={classnames(styles.no, styles.top)}>
                <span>{rank}</span>
              </div>
            )}
            {rank > 10 && (
              <div className={styles.no}>
                <span>{rank}</span>
              </div>
            )}
          </div>
        ),
      ],
    },
  },
  pubs: {
    key: 'pubs',
    component: PublicationList,
    params: {
      contentRightZone: [],
      showInfoContent: ['cited_num', 'bibtex', 'url'],
    },
  },
};

const AI2000ConfExpertsRank = props => {
  const { match, ai2000_conf_ranks, dispatch, loading, wechatVer, location } = props;

  const [viewed, setViewed] = useState();
  const {
    params: { type, conf_name, rank_type },
  } = match;

  const { pathname, search } = location;

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
            title: 'ICLR 高引华人榜单（2013-2020） - AMiner', // 分享标题
            desc: 'ICLR 2013-2020年论文被引用量最高的50名华人榜单', // 分享描述
            link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: `${consts.ResourcePath}/data/ranks/iclr2020/iclr2020.jpg
            `, // 分享图标
            success: () => {
              // alert('aaaaaaaaaaaaaaaaa');
              // 设置成功
            },
          });
          wx.onMenuShareTimeline({
            title: 'ICLR 高引华人榜单（2013-2020） - AMiner', // 分享标题
            link: shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: `${consts.ResourcePath}/data/ranks/iclr2020/iclr2020.jpg
            `, // 分享图标
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
    getViews(dispatch, '5dc122672ebaa6faa962c005', result => {
      setViewed(result);
    });
    setViews(dispatch, '5dc122672ebaa6faa962c005');
    // dispatch({
    //   type: 'aminerConf/setOrGetClickView',
    //   payload: { type: 'click', id: '5dc122672ebaa6faa962c005' },
    // });
    // dispatch({
    //   type: 'aminerConf/setOrGetClickView',
    //   payload: { type: 'getClick', id: '5dc122672ebaa6faa962c005' },
    // }).then(result => {

    // });
  }, []);

  useEffect(() => {
    dispatch({
      type: 'aminerAI10/getConfRanksData',
      payload: { domain_alias: type, conf_name },
    });
  }, [type]);

  useEffect(() => {
    const { scholars } = ai2000_conf_ranks || {};
    if (!scholars) {
      return;
    }
    const ids = scholars.map(item => item.person_id);
    dispatch({
      type: 'aminerAI10/GetScholarsDynamicValue',
      payload: { ids },
    });
  }, [ai2000_conf_ranks]);

  const callback = key => {
    if (key === 'link') {
      window.open('/conf/iclr2020');
      return;
    }
    if (key == rank_type) {
      return;
    }
    if (key) {
      routeTo(
        props,
        null,
        { rank_type: key },
        {
          transferPath: [
            { from: '/ai2000/:type/:conf_name', to: '/ai2000/:type/:conf_name/:rank_type' },
          ],
        },
      );
    } else {
      routeTo(
        props,
        null,
        {},
        {
          transferPath: [
            { from: '/ai2000/:type/:conf_name/:rank_type', to: '/ai2000/:type/:conf_name' },
          ],
        },
      );
    }
  };

  const { tabs, title, title_zh, desc, desc_zh } = ai2000_conf_ranks || {};

  return (
    <Layout pageTitle={getLangLabel(title, title_zh)}>
      <div className={styles.confRankPage}>
        <div
          className="conf_header"
          style={{
            background: `url(${background}) no-repeat center`,
            backgroundSize: 'cover',
          }}
          alt="ICLR 2020|国际学习表征会议|AMiner"
        >
          <div className="homepage">
            <div className="content">
              <div className="short_name">{getLangLabel(title, title_zh)}</div>
              <div className="full_name">{getLangLabel(desc, desc_zh)}</div>
              {/* <div className="url">
                <FM id="aminer.conf.HomePage.webSite" />
                <a href={confInfo.url} target="_blank" rel="noopener noreferrer">
                  {confInfo.url}
                </a>
              </div> */}
            </div>
          </div>
          <div className="viewed">
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-icon-test" />
            </svg>
            <span className="viewed_num">{viewed}</span>
          </div>
        </div>
        <div className="article">
          <Spin loading={loading} />
          {tabs && !!tabs.length && (
            <Tabs activeKey={rank_type || ''} onChange={callback} animated={false}>
              {tabs.map(tab => {
                const { title: tab_title, title_zh: tab_title_zh, type: tab_type } = tab;
                const list_data = ai2000_conf_ranks[tab_type];
                const title = ai2000_conf_ranks[`${tab_type}_title`];
                const title_zh = ai2000_conf_ranks[`${tab_type}_title_zh`];
                const desc = ai2000_conf_ranks[`${tab_type}_desc`];
                const desc_zh = ai2000_conf_ranks[`${tab_type}_desc_zh`];

                const tab_data = type_map[tab_type] || {};
                const Component = tab_data.component;
                const params = { ...tab_data.params };
                if (tab_type === 'scholars') {
                  params.persons = list_data;
                }
                if (tab_type === 'pubs') {
                  params.papers = list_data;
                }
                return (
                  <TabPane tab={getLangLabel(tab_title, tab_title_zh)} key={tab_data.key || ''}>
                    {/* <h2 className="rank_title">{getLangLabel(title, title_zh)}</h2> */}
                    <p className="rank_desc">{getLangLabel(desc, desc_zh)}</p>
                    {Component && <Component {...params} />}
                  </TabPane>
                );
              })}
              <TabPane key="link" tab={<FM id="ai2000.link.conf.iclr" />}></TabPane>
            </Tabs>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default component(
  withRouter,
  connect(({ aminerAI10, loading, aminerCommon }) => ({
    loading: loading.effects['aminerAI10/getConfRanksData'],
    ai2000_conf_ranks: aminerAI10.ai2000_conf_ranks,
    wechatVer: aminerCommon.wechatVer,
  })),
)(AI2000ConfExpertsRank);
