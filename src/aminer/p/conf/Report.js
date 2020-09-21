/*
 * @Author: your name
 * @Date: 2019-12-02 18:19:41
 * @LastEditTime: 2020-07-31 11:45:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /aminer2c/src/pages/conf/create.js
 */
import React, { Fragment, useEffect, useState } from 'react';
import { Button, message, Pagination } from 'antd';
import { connect, component } from 'acore';
import { classnames } from 'utils';
import { Spin } from 'aminer/components/ui';
import { FM, formatMessage } from 'locales';
import { isLogin, isRoster } from 'utils/auth';
import ArticleBlock from './c/ArticleBlock';
import CreateArticleToConf from './c/CreateArticleToConf';
import { SetOrGetViews } from './c';
import styles from './Report.less';

const Articlelist = props => {
  const [articles, setArticles] = useState();
  const [conference, setConference] = useState();
  const { confInfo, dispatch, match, roles, user, loading } = props;
  // TODO: confId 要换成id，目前测试版会报参数错误
  const confId = (confInfo && confInfo.id) || '5dea06b093083110d34a5563';

  useEffect(() => {
    getList();
    if (confInfo && confInfo.id) {
      SetOrGetViews('click', dispatch, confInfo.id);
    }
  }, []);

  useEffect(() => {
    // postHeight();
  }, [articles, conference]);

  const getList = () => {
    dispatch({ type: 'aminerConf/GetArticlesByConfID', payload: { id: confId } }).then(result => {
      if (result) {
        const mergeData = [];
        //   ...result.conference,
        //   ...result.paper.filter(paper => paper.source !== 'AMiner'),
        // ];
        if (result.conference && result.conference.length > 0) {
          mergeData.push(...result.conference);
        }
        if (result.paper && result.paper.length > 0) {
          const paperData = result.paper.filter(paper => paper.source !== 'AMiner');
          if (paperData) {
            mergeData.push(...paperData);
          }
          mergeData.unshift(...result.paper.filter(paper => paper.source === 'AMiner'));
        }
        setArticles(mergeData);
      }
    });
  };

  // const postHeight = () => {
  //   const aminerHeight = document.getElementById('articleList').offsetHeight;
  //   console.log({ aminerHeight })
  //   if (aminerHeight !== 0) {
  //     window.top.postMessage(`articleHeight###${aminerHeight}`, '*');
  //   }
  // };

  const deleteArticleIDs = (id, type) => {
    dispatch({
      type: 'conference/DeleteArticle',
      payload: {
        id: confId,
        pid: id,
      },
    }).then(result => {
      if (result) {
        message.success('删除成功');
        type === 'paper' && setArticles(articles.filter(article => article.id !== id));
        type === 'conference' && setConference(conference.filter(article => article.id !== id));
      } else {
        message.error('删除失败');
      }
    });
  };

  const editArticleIDs = data => {
    dispatch({
      type: 'modal/open',
      payload: {
        title: `${formatMessage({ id: 'aminer.common.edit' })}${formatMessage({
          id: 'aminer.conf.tab.News',
        })}`,
        extraArticleStyle: { padding: '20px 30px' },
        content: <CreateArticleToConf data={data} getList={getList} id={confId} />,
      },
    });
  };

  const addReport = () => {
    dispatch({
      type: 'modal/open',
      payload: {
        title: `${formatMessage({ id: 'aminer.common.add' })}${formatMessage({
          id: 'aminer.conf.tab.News',
        })}`,
        extraArticleStyle: { padding: '20px 30px' },
        content: <CreateArticleToConf getList={getList} id={confId} />,
      },
    });
  };

  return (
    <div
      className={classnames(styles.report, {
        [styles.flexGrow]:
          confInfo.config && confInfo.config.right && confInfo.config.right.length === 0,
      })}
    >
      <div className={styles.addBtn}>
        {isLogin(user) && isRoster(user) && (
          <Button onClick={addReport}>
            {formatMessage({ id: 'aminer.common.add' })}
            {formatMessage({ id: 'aminer.conf.tab.News' })}
          </Button>
        )}
      </div>
      <div className={styles.articleList} id="articleList">
        <Spin loading={loading} />
        {/* <div>
          <img
            className={styles.advImg}
            src="https://static.aminer.cn/misc/image/neurips2019_ggw.png"
          />
        </div> */}
        {(!articles && !conference) ||
          (articles && articles.length <= 0 && conference && conference.length <= 0 && (
            <div
              className={styles.alertInfo}
              style={{ borderColor: '#9cb4c5', borderWidth: 0, borderLeftWidth: '5px' }}
            >
              <h1>
                <FM id="aminer.con.report.empty" defaultMessage="It hasn't been reported yet." />
              </h1>
            </div>
          ))}
        {conference && conference.length > 0 && (
          <>
            <div className={styles.legend}>
              <FM id="aminer.conf.tab.Video" />
            </div>
            {conference.map(conf => {
              return (
                <ArticleBlock
                  type="conference"
                  article={conf}
                  key={conf.title}
                  deleteArticleIDs={deleteArticleIDs}
                  editArticleIDs={editArticleIDs}
                />
              );
            })}
          </>
        )}
        {articles && articles.length > 0 && (
          <>
            {/* <div className={styles.legend}>
              <FM id="aminer.conf.text" />
            </div> */}
            {articles.map(article => {
              return (
                <ArticleBlock
                  article={article}
                  type="paper"
                  key={article.title}
                  deleteArticleIDs={deleteArticleIDs}
                  editArticleIDs={editArticleIDs}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default component(
  connect(({ auth, loading }) => ({
    user: auth.user,
    roles: auth.roles,
    loading: loading.effects['conference/GetArticlesByConfID'],
  })),
)(Articlelist);
