/*
 * @Author: your name
 * @Date: 2019-12-05 15:36:02
 * @LastEditTime: 2019-12-10 11:12:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /aminer2c/src/pages/conference/ArticleBlock.js
 */
import React, { Fragment, useEffect, useState } from 'react';
import { connect, Link, history, FormCreate, component } from 'acore';
import { Form, Input, Button, Popconfirm, message, Pagination } from 'antd';
import * as auth from 'utils/auth';
import styles from './ArticleBlock.less';

const ArticleBlock = props => {
  const { article, user, deleteArticleIDs, type } = props;
  const cancel = e => {
    console.log('Click on No');
  };
  return (
    <div className={styles.articleBlock}>
      <div key={article.title} className={styles.article}>
        <div className={styles.logo}>
          <div className={styles.imgCover}>
            <a href={article.article_url} target="_blank">
              <img src={article.logo_url} />
            </a>
          </div>
        </div>
        <div className={styles.content}>
          <a href={article.article_url} className={styles.title} target="_blank">
            {article.title}
          </a>
          <p className={styles.desc}>{article.desc}</p>
          <div className={styles.footer}>
            <div className={styles.delBtn}>
              {auth.isSuperAdmin(user) && (
                <Popconfirm
                  title="确定删除该篇论文吗？?"
                  onConfirm={deleteArticleIDs.bind(null, article.id, type)}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  删除文章
                </Popconfirm>
              )}
            </div>
            <div className={styles.source}>{article.source || 'AMiner'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default component(connect(({ auth }) => ({ user: auth.user })))(ArticleBlock);
