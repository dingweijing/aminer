import React, { useState, useEffect } from 'react';
import { page, connect, Link, routerRedux } from 'acore';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import helper from 'helper';
import consts from 'consts';
import { sysconfig } from 'systems';
import { Layout } from 'aminer/layouts';
import { getLangLabel } from 'helper';
import { TopicItem } from './c';
import styles from './index.less';

const pageSize = 20;
interface Proptypes {
  dispatch: (config: { type: string; payload?: object }) => Promise<any>;
  loading?: boolean;
  leftTabs: any;
  sortType: {
    id: string;
    sort: string;
  }[];
  user: object;
}

const TopicInfo: React.FC<Proptypes> = props => {
  const [active_tab, setActiveTab] = useState('all');
  const [sort, setSort] = useState('view');
  const { dispatch, topicList, user } = props;

  const updateTab = (active: string) => {
    if (active !== active_tab) {
      setActiveTab(active);
    }
  };

  const getTopicBySort = (curSort: string) => {
    // TODO: 根据 sort 获取 topic
    if (curSort !== sort) {
      setSort(curSort);
    }
  };

  useEffect(() => {
    dispatch({ type: 'newTopic/listTopic', payload: { offset: 0, size: 200 } });
  }, []);

  return (
    <Layout
      contentClass="layout_topic"
      pageTitle="AMiner-计算机主题论文阅读推荐-必读论文"
      pageDesc="AMiner必读论文栏目通过精选计算机科学领域等100个热门主题，提供论文推荐检索，方便您检索各热门学术主题论文，帮助您在短时间里体验主题阅读的更多精彩。"
      pageKeywords="计算机科学与技术论文；计算机论文；论文推荐；论文主题；主题阅读；论文检索"
    >
      {/* TODO: header: 搜索框 */}
      <div className={styles.topic_head}>
        <div className="competition"></div>
        <div className="search_action">
            <input />
        </div>
      </div>
      <div className={styles.topic_homepage}>
        <div className="main_content">
          {/* 左侧的tab */}
          <div className="left_tab desktop_device">
            {Object.values(leftTabs).map(tab => (
              <div
                id={tab.id}
                className={classnames('tab', tab.name, { active: active_tab === tab.name })}
                onClick={updateTab.bind(null, tab.name)}
              >
                <svg className="icon" aria-hidden="true" style={{ backgroundColor: tab.color }}>
                  <use xlinkHref={`#${tab.icon}`} />
                </svg>
                <FM id={tab.id} tagName="span" />
              </div>
            ))}
          </div>
          {/* 右侧的topic content */}
          <div className="right_content">
            <div className="header">
              <div className="legend">
                <span className="name">Topic 列表</span>
                <span className="count">{topicList && topicList.length} 个词条</span>
              </div>
              <div className="sorts">
                {sortType.map(type => (
                  <span
                    className={classnames('item', { active: type.sort === sort })}
                    onClick={getTopicBySort.bind(null, type.sort)}
                  >
                    <FM id={type.id} tagName="span" />
                  </span>
                ))}
              </div>
            </div>
            {/* TODO: 循环 */}
            <div className="content">
              {topicList &&
                topicList.map((topic: any) => (
                  <TopicItem
                    // color={leftTabs[active_tab].color}
                    key={topic.id}
                    topic={topic}
                    user={user}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default page(
  connect(({ newTopic, auth }) => ({
    topicList: newTopic.topicList,
    user: auth.user,
  })),
)(TopicInfo);

const leftTabs = {
  all: {
    id: 'aminer.search.advance.searchIn.all',
    name: 'all',
    color: '#37454E',
    icon: 'icon-quanbugengduo',
  },
  keywords: {
    id: 'aminer.conf.keywords.legend',
    name: 'keywords',
    color: '#314077',
    icon: 'icon-huiyishi',
  },
  conf: {
    id: 'aminer.search.placeholder.conference',
    name: 'conf',
    color: '#29245A',
    icon: 'icon-huiyishi',
  },
  labs: {
    id: 'aminer.topic.index.labs',
    name: 'labs',
    color: '#29245A',
    icon: 'icon-xianweijing',
  },
};

// 根据VIews, LIke, 论文数、时间排序
const sortType = [
  {
    id: 'aminer.common.view',
    sort: 'view',
  },
  {
    id: 'aminer.common.like',
    sort: 'like',
  },
  {
    id: 'aminer.common.paper',
    sort: 'paper',
  },
  {
    id: 'aminer.search.filter.time',
    sort: 'time',
  },
];
