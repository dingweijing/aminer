/* eslint-disable no-console */
// getSchedule

import React, { useEffect, useState } from 'react';
import { page, connect } from 'acore';
import { classnames } from 'utils';
import { Tabs, Pagination } from 'antd';
import { formatMessage, FM } from 'locales';
import { ChineseAuthors, ChineseStudent } from '../index';
import styles from './Roster.less';

const { TabPane } = Tabs;
const SIZEPERPAGE = 20;
const Roster = props => {
  const [middleKey, setMiddleKey] = useState('chinese-scholar');
  const [confType, setConfType] = useState();
  const { confInfo, dispatch } = props;

  return (
    <div className={styles.Roster}>
      <div className="leftBlock">
        <div className="roster_legend">
          <div>
            <svg className="icon">
              <use xlinkHref="#icon-huiyi" />
            </svg>
            <FM id="aminer.search.placeholder.conference"/>
          </div>
        </div>
        <div className="conf_list">
          {confInfo &&
            confInfo.related_conf &&
            confInfo.related_conf.map(conf => {
              return (
                <div
                  className={classnames('authorList', {
                    active: conf.conf_id === (confType || '5e6f3c26a7058c6e3520dbd3'),
                  })}
                  key={conf.conf_id}
                  onClick={() => {
                    setConfType(conf.conf_id);
                  }}
                >
                  {conf.conf_name}
                </div>
              );
            })}
        </div>
      </div>
      <div className="content">
        <Tabs
          defaultActiveKey={middleKey}
          activeKey={middleKey}
          onChange={key => {
            setMiddleKey(key);
          }}
          animated={false}
        >
          {tabJson.map(tab => {
            return (
              <TabPane
                tab={
                  <div className="center-tab">
                    <span className="tabIcon">
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref={`#${tab.icon}`} />
                      </svg>
                    </span>
                    <FM id={`aminer.conf.${tab.tab}.legend`} />
                  </div>
                }
                key={tab.tab}
              >
                {tab.content({ confInfo, tab: middleKey, confType })}
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};

export default page(connect())(Roster);
const tabJson = [
  {
    tab: 'chinese-scholar',
    icon: 'icon-head-01',
    content: params => <ChineseAuthors {...params} />,
  },
  {
    tab: 'chinese-first',
    icon: 'icon-w_xuesheng-',
    content: params => <ChineseStudent {...params} />,
  },
  // {
  //   tab: 'session',
  //   icon: 'icon-huiyi',
  //   content: params => <Schedule {...params} />,
  // },
];
