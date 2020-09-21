import React, { useState, useEffect } from 'react';
import { page, connect, Link, } from 'acore';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import helper, { getLangLabel } from 'helper';
import consts from 'consts';
import { sysconfig } from 'systems';

import { Pagination } from 'antd';
import { EmptyTip } from 'components/ui';
import { isRoster, isLogin, isPeekannotationlog, isTempAnno } from 'utils/auth';
import { Layout } from 'aminer/layouts';
import { Spin } from 'aminer/components/ui';
import { PubInfo } from 'aminer/components/pub/pub_type';
import { MustReadEdit } from 'aminer/core/search/c/widgets';
import { KeywordCluster, AuthorCluster } from './c/TopicClusterType';
import { MustReadSorts, TopicList, AuthorList, TopicPaperList, TopicEdit } from './c';
import styles from './index.less';

const { Cur_Conf_Link, Cur_Conf_Name } = sysconfig;

const pageSize = 20;
interface Proptypes {
  dispatch: (config: { type: string; payload?: object }) => Promise<any>;
  paperList: PubInfo[];
  paperItem: PubInfo;
  keywordsList: KeywordCluster[];
  authorList: AuthorCluster[];
  id: string;
  loading?: boolean;
  total: number;
  getTopicData: (config: { topic_sort: string }) => any;
}

const TopicInfo: React.FC<Proptypes> = props => {
  const [sort, setSort] = useState('year');
  const [curQuery, setCurQuery] = useState();
  const [current, setCurrent] = useState(1);
  const { id } = helper.parseMatchesParam(props, {}, ['id']);
  const { dispatch, topicInfo, paperList, total, keywordsList, authorList, loading } = props;
  const { user } = props;

  const onMustReadSortKeyChange = (key: string) => {
    setCurrent(1);
    setSort(key);
  };

  const getTopicData = ({
    topic_sort,
    query,
    cur,
  }: {
    topic_sort: string;
    query: string;
    cur: number;
  }) => {
    dispatch({
      type: 'aminerTopic/getTopicById',
      payload: { topic_id: id, topic_sort, query, pagination: { current: cur, pageSize } },
    });
  };
  useEffect(() => {
    getTopicData({ topic_sort: sort, query: curQuery || '', cur: current });
  }, [id, sort]);

  const onChangeQuery = ({ query }: { query: string | undefined }) => {
    setCurQuery(query || '');
    getTopicData({ topic_sort: sort, query: query || '', cur: current });
  };
  const pageChange = (cur: number) => {
    setCurrent(cur);
    getTopicData({ topic_sort: sort, query: curQuery || '', cur });
  };

  return (
    <Layout
      className="newTopic"
      rootClassName="shortNameIndex"
      pageUniqueTitle={formatMessage(
        {
          id: `aminer.topic.pageTitle`,
        },
        { topic: topicInfo ? getLangLabel(topicInfo.name, topicInfo.name_zh) : '' },
      )}
      pageDesc={topicInfo ? getLangLabel(topicInfo.def, topicInfo.def_zh) : ''}
      pageKeywords={formatMessage({
        id: `aminer.topic.pageKeywords`,
      })}
    >
      <div className={classnames(styles.mustReadingList, 'publication_list')}>
        {/* 面包屑 */}
        <div className="breadcrumb">
          <div className="history">
            <Link to="/topic" className="homepage">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-homepage" />
              </svg>
              <FM id="aminer.conf.crumb.index" />
            </Link>
            <span className="split" />
            {topicInfo && (
              <span className="cur">{getLangLabel(topicInfo.name, topicInfo.name_zh)}</span>
            )}
          </div>
          {/* <div className="view">浏览量: 1000</div> */}
        </div>
        {/* 图片banner */}
        <div className="top_banner_img">
          {topicInfo && (
            <div className="top_banner">
              <span className="title">{getLangLabel(topicInfo.name, topicInfo.name_zh)}</span>
              <span className="desc">{getLangLabel(topicInfo.def, topicInfo.def_zh)}</span>
            </div>
          )}
        </div>

        {(isRoster(user) || isPeekannotationlog(user) || isTempAnno(user)) && (
          <TopicEdit topic={topicInfo} editType="update" />
        )}
        {(isRoster(user) || isPeekannotationlog(user) || isTempAnno(user)) && (
          <TopicEdit topic={topicInfo} editType="create" />
        )}

        {/* 内容 */}
        <div>
          <div className="sort_edit">
            <MustReadSorts
              key="MustReadSorts"
              mustReadSortKey={sort}
              onMustReadSortKeyChange={onMustReadSortKeyChange}
            />
            {/* 只有管理员可见 */}
            {isLogin(user) && isRoster(user) && topicInfo && (
              <MustReadEdit
                editType="create"
                key="12"
                fmId="aminer.paper.topic.paper.addMe"
                topicInfo={topicInfo}
              />
            )}
          </div>
          <div className="list_cluster">
            <div className="list">
              <Spin loading={loading} />
              {paperList && paperList.length > 0 ? (
                <TopicPaperList user={user} paperList={paperList} topicInfo={topicInfo} />
              ) : (
                  <EmptyTip />
                )}
              <Pagination
                total={total}
                pageSize={pageSize}
                defaultCurrent={current}
                current={current}
                className="pagination"
                onChange={pageChange}
              />
            </div>
            <div className="cluster desktop_device">
              <TopicList
                keywordsList={keywordsList}
                onChangeQuery={onChangeQuery}
                curQuery={curQuery}
              />
              <AuthorList authorList={authorList} />

              <div className={styles.topicIntro}>
                <div
                  className={styles.topicBgImgWrap}
                  style={{
                    backgroundImage: `url(${consts.ResourcePath}/sys/aminer/search_iclr2020_bg.jpg)`,
                  }}
                >
                  <Link
                    target="_blank"
                    to={`/conf/${Cur_Conf_Link}?s="t"`}
                    className={classnames(styles.topicIntroTip, styles.iclrIntro)}
                  >
                    <span className={styles.title}>
                      {Cur_Conf_Name}
                      <img
                        alt="cvpr2020"
                        className={styles.arrowImg}
                        src={`${consts.ResourcePath}/sys/aminer/homepage/arrow.png`}
                      />
                    </span>
                    <span>
                      <FM id="aminer.search.linkconftip" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default page(
  connect(({ auth, aminerTopic, loading }) => ({
    user: auth.user,
    roles: auth.roles,
    total: aminerTopic.total,
    topicInfo: aminerTopic.topicInfo,
    paperList: aminerTopic.paperList,
    keywordsList: aminerTopic.keywordsList,
    authorList: aminerTopic.authorList,
    loading: loading.effects['aminerTopic/getTopicById'],
  })),
)(TopicInfo);
