/*
 * @Author: your name
 * @Date: 2019-12-02 18:19:41
 * @LastEditTime: 2020-02-18 16:59:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /aminer2c/src/pages/conf/create.js
 */
import React, { Fragment, useEffect, useState } from 'react';
import { Form, Input, Button, Popconfirm, message, Pagination } from 'antd';
import { connect, Link, history, FormCreate, component } from 'acore';
import { classnames } from 'utils';
import { loadECharts4 } from 'utils/requirejs';
import { Spin } from 'aminer/components/ui';
import * as auth from 'utils/auth';
import ArticleBlock from './ArticleBlock';
import styles from './Articlelist.less';

const Articlelist = props => {
  const [articles, setArticles] = useState();
  const [conference, setConference] = useState();
  const { dispatch, match, roles, loading } = props;
  const confId = match.params.id;

  useEffect(() => {
    dispatch({ type: 'conference/GetArticlesByConfID', payload: { id: confId } }).then(result => {
      setArticles(result.paper);
      setConference(result.conference);
    });
  }, []);

  useEffect(() => {
    postHeight();
  }, [articles, conference]);

  const postHeight = () => {
    const aminerHeight = document.getElementById('articleList').offsetHeight;
    console.log({aminerHeight})
    if (aminerHeight !== 0) {
      window.top.postMessage(`articleHeight###${aminerHeight}`, '*');
    }
  };

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

  const cancel = e => {
    console.log('Click on No');
  };

  return (
    <div className={styles.articleList} id="articleList">
      <Spin loading={loading} />
      <div>
        <img
          className={styles.advImg}
          src="https://static.aminer.cn/misc/image/neurips2019_ggw.png"
        />
      </div>
      {(!articles && !conference) ||
        (articles && articles.length <= 0 && conference && conference.length <= 0 && (
          <div
            className={styles.alertInfo}
            style={{ borderColor: '#9cb4c5', borderWidth: 0, borderLeftWidth: '5px' }}
          >
            <h1>It hasn't been reported yet.</h1>
          </div>
        ))}
      {conference && conference.length > 0 && (
        <div>
          <div className={styles.legend}>Conference Interpretation</div>
          {conference.map(conf => {
            return (
              <ArticleBlock
                type="conference"
                article={conf}
                key={conf.title}
                deleteArticleIDs={deleteArticleIDs}
              />
            );
          })}
        </div>
      )}
      {articles && articles.length > 0 && (
        <div>
          <div className={styles.legend}>Paper Interpretation</div>
          {articles.map(article => {
            return (
              <ArticleBlock
                article={article}
                type="paper"
                key={article.title}
                deleteArticleIDs={deleteArticleIDs}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default component(
  connect(({ auth, loading }) => ({
    roles: auth.roles,
    loading: loading.effects['conference/GetArticlesByConfID'],
  })),
)(Articlelist);
