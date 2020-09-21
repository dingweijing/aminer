import React, { useEffect } from 'react'
import { page, connect, Link } from 'acore';
import { Tag } from 'antd';
import { FM, formatMessage } from 'locales';
import { Layout } from 'aminer/layouts';
import { getLangLabel } from 'helper';
// import { wget } from 'utils/request-umi-request';
import { classnames } from 'utils';
import { Subscribe } from 'aminer/core/search/c/widgets';
import TopicContent from './common/TopicContent';
import styles from './index.less';

const TopicHomePage = props => {
  const { dispatch, topicList, isUserLogin, hottestTopic } = props;

  useEffect(() => {
    if (!topicList) {
      getTopics();
    }
  }, [])

  const getTopics = () => {
    // wget('https://static.aminer.cn/misc/aminer/zhiyuan.json').then(ids => {
    //   dispatch({ type: 'newTopic/getTopics', payload: { offset: 0, size: 19, type: 'ids', ids } })
    // })
    dispatch({ type: 'newTopic/listTopic', payload: { offset: 0, size: 200 } });
    dispatch({ type: 'newTopic/getHottestTopic', payload: {"offset": 0, "size": 3, "type": "hot"} });
    dispatch({ type: 'newTopic/getNewestTopic', payload: {"offset": 0, "size": 3, "type": "new"} });
  }

  return (
    <Layout
      className="topic"
      pageTitle="AMiner-计算机主题论文阅读推荐-必读论文"
      pageDesc="AMiner必读论文栏目通过精选计算机科学领域等100个热门主题，提供论文推荐检索，方便您检索各热门学术主题论文，帮助您在短时间里体验主题阅读的更多精彩。"
      pageKeywords="计算机科学与技术论文；计算机论文；论文推荐；论文主题；主题阅读；论文检索"
    >
      <div className={styles.topicPage}>
        <h1 style={{ display: 'none' }}>AMiner-计算机主题论文阅读推荐-必读论文</h1>
        <div className={styles.header}>
          <div className={styles.function}>
            <span className={styles.here}>{formatMessage({ id: 'aminer.home.banner.title.topic' })}</span>
            <div>
              <Subscribe query="" mustLogin={true} icon={"biaoji1"}/>
              <Subscribe type="suggest" query="" mustLogin={true} icon={"bianji"}/>
            </div>
          </div>
          <div className={styles.desc}>
            <p>{formatMessage({ id: 'aminer.topic.desc1' })}</p>
            <p>{formatMessage({ id: 'aminer.topic.desc2' })}</p>
            <p>{formatMessage({ id: 'aminer.topic.desc3' })}</p>
          </div>
          <div className={styles.look}>
            <p>{formatMessage({ id: 'aminer.topic.everybody_watch' })}</p>
            <div>
              {hottestTopic && hottestTopic.map(item => (
                <Tag key={item.id} className={styles.tag}>
                  <a href={`/topic/${item.id}`} target="_blank">
                    {getLangLabel(item.name, item.name_zh)}
                  </a>
                </Tag>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.newTopic}>
            <TopicContent title={formatMessage({ id: 'aminer.topic.latest_topic' })} />
          </div>

          <div className={styles.topicList}>
            <TopicContent title={formatMessage({ id: 'aminer.topic.topic_list' })} topicNum={topicList && topicList.length} anchor={true}/>
          </div>
        </div>
      </div>
    </Layout>
  );
}

TopicHomePage.getInitialProps = async ({ store, route, isServer }) => {
  if (!isServer) return;
  await store.dispatch({ type: 'newTopic/listTopic', payload: { offset: 0, size: 200 } });
  await store.dispatch({ type: 'newTopic/getHottestTopic', payload: { "offset": 0, "size": 3, "type": "hot" } });
  await store.dispatch({ type: 'newTopic/getNewestTopic', payload: {"offset": 0, "size": 3, "type": "new"} });
  const { newTopic } = store.getState();
  return newTopic;
};

export default page(
  connect(({ newTopic, auth }) => ({
    topicList: newTopic.topicList,
    hottestTopic: newTopic.hottestTopic,
    isUserLogin: auth.isUserLogin,
  }))
)(TopicHomePage);
