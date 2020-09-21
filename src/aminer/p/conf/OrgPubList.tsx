import React, { useEffect, useState } from 'react';
import { page, connect, Link } from 'acore';
import { Divider } from 'antd';
import { classnames } from 'utils';
import { sysconfig } from 'systems';
import { formatMessage, FM } from 'locales';
import { Layout } from 'aminer/layouts';
import { getLangLabel, parseMatchesParam } from 'helper';
import { Spin } from 'aminer/components/ui';
import * as confUtils from './c/utils/utils';
import { ConfPaperList, Breadcrumb, SetOrGetViews } from './c';
import styles from './OrgPubList.less';

interface Proptypes {
  dispatch: (config: { type: string; payload?: object }) => Promise<any>;
  confInfo: any;
  orgData: any;
  org: string;
  pubIds: [];
  loading: boolean;
  short_name: string;
  confInfoDesc: object;
  pIds: string;
}

const OrgPubList: React.FC<Proptypes> = props => {
  const [pubs, setPUbs] = useState();
  const [viewed, setViewed] = useState();
  const { org, short_name } = parseMatchesParam(props, {}, ['org', 'short_name']);

  const { dispatch, confInfo, orgData, loading } = props;

  const getPubsByIds = ({ pIds }) => {
    dispatch({
      type: 'aminerConf/GetPubsByIds',
      payload: {
        conf_id: confInfo && confInfo.id,
        pids: pIds,
      },
    }).then(res => {
      setPUbs(res);
    });
  };

  const getOrgJson = confInfoDesc => {
    if (confInfoDesc && confInfoDesc.config) {
      const { config = {} } = confInfoDesc;
      const { paper = {} } = config;
      if (paper && paper.org) {
        dispatch({
          type: 'aminerConf/getInterpretation',
          payload: { id: confInfoDesc && confInfoDesc.id, type: 'org' },
        });
      }
    }
  };

  useEffect(() => {
    if (orgData) {
      getPubsByIds({ pIds: orgData[org].ids });
    } else if (confInfo && confInfo.config) {
      getOrgJson(confInfo);
    } else {
      dispatch({
        type: 'aminerConf/getConfList',
        payload: {
          offset: 0,
          size: 1,
          short_name,
          needReturn: false,
        },
      });
    }
    // 记录view
    if (confInfo && confInfo.id) {
      SetOrGetViews('click', dispatch, confInfo.id);
    }
  }, [org, short_name]);

  useEffect(() => {
    getOrgJson(confInfo);
  }, [confInfo]);

  useEffect(() => {
    if (orgData) {
      getPubsByIds({ pIds: orgData[org].ids });
    }
  }, [orgData]);

  useEffect(() => {
    if (confInfo) {
      dispatch({
        type: 'aminerConf/setOrGetClickView',
        payload: { type: 'getClick', id: confInfo.id },
      }).then(result => {
        setViewed(result);
      });
    }
  }, [confInfo]);

  return (
    <Layout
      rootClassName="shortNameIndex"
      pageUniqueTitle={
        (confInfo && confInfo.config && confInfo.config.tdk.pageTitle) ||
        formatMessage({
          id: `aminer.conf.iclr.pageTitle`,
        })
      }
      pageDesc={
        (confInfo && confInfo.config && confInfo.config.tdk.pageDesc) ||
        formatMessage({
          id: `aminer.conf.iclr.pageDesc`,
        })
      }
      pageKeywords={
        (confInfo && confInfo.config && confInfo.config.tdk.pageKeywords) ||
        formatMessage({
          id: `aminer.conf.iclr.pageKeywords`,
        })
      }
      pageHeaderFixed
    >
      <div className={styles.orgPubList}>
        {confInfo && confInfo.config && confInfo.config.breadcrumb && (
          <Breadcrumb
            routes={['confIndex', 'confInfo', 'org']}
            getConfInfo={confInfo && confInfo.short_name}
          />
        )}
        {confInfo && (
          <div
            className="confHeader"
            style={{
              backgroundImage: 'url(https://originalfileserver.aminer.cn/data/conf/conf_bg.jpg)',
            }}
            alt={`${confInfo.short_name}|国际学习表征会议|AMiner`}
          >
            <div className="homepage">
              <div className="content">
                <div className="short_name">
                  {confInfo.short_name && confInfo.short_name.toUpperCase()}
                </div>
                <div className="full_name">{confInfo.full_name}</div>
                <div className="date">
                  {`${confUtils.formatTime(confInfo.begin_date, 'MM.dd')} - ${confUtils.formatTime(
                    confInfo.end_date,
                    'MM.dd',
                  )}`}
                </div>
                <div className="url">
                  <a
                    href={confInfo.url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    onClick={() => SetOrGetViews('click', dispatch, confInfo.id)}
                  >
                    <FM id="aminer.conf.HomePage.webSite" />
                    {confInfo.url}
                  </a>
                </div>
              </div>
            </div>
            <div className="viewed">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-icon-test" />
              </svg>
              <span className="viewed_num">{viewed}</span>
            </div>
          </div>
        )}

        <div className="orgPubContent">
          <Spin loading={loading} />
          <ConfPaperList pubs={pubs} confInfo={confInfo} infoRightZone={[]} />
          {orgData && orgData[org].link && (
            <div className="orgLogo_code">
              <a
                className="down_pdf"
                href={orgData[org].link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => SetOrGetViews('click', dispatch, confInfo.id)}
              >
                <img src={orgData[org].avatar} alt={orgData[org].name} />
              </a>
              <span>提取码：{orgData[org].code}</span>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default page(
  connect(({ aminerConf, loading }) => ({
    orgData: aminerConf.orgData,
    confInfo: aminerConf.confInfo,
    loading: loading.effects['aminerConf/GetPubsByIds'],
  })),
)(OrgPubList);
