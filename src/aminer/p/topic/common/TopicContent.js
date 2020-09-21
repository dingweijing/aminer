import React, { useEffect, useState, Fragment } from 'react'
import { connect, component } from 'acore';
import { Tag, Anchor, message, Tooltip } from 'antd';
import { FM } from 'locales';
import { getLangLabel } from 'helper';
import { classnames } from 'utils';
import styles from './TopicContent.less';
import { render } from 'react-dom';

const { Link } = Anchor;

const anchorList = ['A', 'B', 'C', 'D', 'E', "F", 'G', 'H', 'I', "J", "K", 'L', 'M', 'N', "O", "P", "Q", 'R', 'S', "T", "U", 'V', 'W', 'X', 'Y', "Z"];

const TopicContent = props => {
  const { dispatch, title, topicNum, topicList, anchor, newTopicList, isUserLogin, forumTopics } = props;

  const renderLinkTitle = (data) => {
    const exist = topicList && topicList.filter(n => data === getLangLabel(n.name, n.name_zh_pinyin)[0].toUpperCase()) || [];
    return (
      exist.length ? (<div className={styles.linkTitle}>{data}</div>) : ''
    )
  }

  const likeIconClick = ({ topicInfo, firstIndex, id }) => {
    if (!isUserLogin) {
      dispatch({ type: 'modal/login' });
      return;
    }
    if (!topicInfo.is_like) {
      dispatch({
        type: 'newTopic/setLikeTopicById',
        payload: { id: topicInfo.id },
      }).then(res => {
        if (res) {
          dispatch({
            type: 'newTopic/changeTopicLiked',
            payload: { firstIndex, is_like: true, num_like: (topicInfo.num_like || 0) + 1, id, }
          });
        }
      });
    } else {
      dispatch({
        type: 'newTopic/setUnLikeTopicById',
        payload: { id: topicInfo.id },
      }).then(res => {
        if (res) {
          dispatch({
            type: 'newTopic/changeTopicLiked',
            payload: { firstIndex, is_like: false, num_like: topicInfo.num_like - 1, id }
          });
        }
      })
    }
  }

  const renderTopicItem = ({ id, topicInfo, firstIndex, key }) => {
    return (
      (!firstIndex || topicInfo.is_public) && (
        <div className={classnames(styles.topicItem, { hottest: !!firstIndex })} key={id} id={key}>
          <div className={styles.topicTop}>
            <div className={styles.topicName}>
              <svg className="icon" aria-hidden="true" >
                <use xlinkHref="#icon-topicicon" />
              </svg>
              <a className={styles.topicTitle} href={`/topic/${topicInfo.id}`} target="_blank">
                <Tooltip title={getLangLabel(topicInfo.name, topicInfo.name_zh)}>
                  {getLangLabel(topicInfo.name, topicInfo.name_zh)}
                </Tooltip>
              </a>
            </div>
            <span className={styles.articleNum}>{`文章：${topicInfo.mustreading_count}`}</span>
          </div>
          <a className={styles.topicDesc} href={`/topic/${topicInfo.id}`} target="_blank">
            {getLangLabel(topicInfo.def, topicInfo.def_zh)}
          </a>
          <div className={classnames(styles.topicNum, { existImg: !topicInfo.selected_img })}>
            {topicInfo.selected_img && (
              <div className={styles.topicAvatar}>
                <img src={topicInfo.selected_img} />
              </div>
            )}
            <div className={styles.likeNum}>
              <span className={classnames(styles.likeIcon, { liked: topicInfo.is_like })} onClick={(e) => likeIconClick({ topicInfo, firstIndex, id })}>
                <svg className="icon" aria-hidden="true" >
                  <use xlinkHref="#icon-top" />
                </svg>
              </span>
              <span className={styles.num}>{topicInfo.num_like || 0}</span>
            </div>
          </div>
        </div>
      )
    )
  }

  return (
    <div className={styles.topicContent}>
      <div className={styles.title}>
        <span className={styles.topicWord}>{title}</span>
        {topicNum ? <span className={styles.topicClassNum}>{`${topicNum} 个词条`}</span> : ''}
      </div>

      {anchor && (
        <Anchor offsetTop={40}>
          {anchorList && anchorList.map(item => (
            <Link key={item} href={`#${item}`} title={renderLinkTitle(item)} />
          ))}
        </Anchor>
      )}

      {!anchor ? (
        <div className={styles.topicList}>
          {newTopicList && newTopicList.map((item, index) => (
            renderTopicItem({ id: item.id, topicInfo: item, firstIndex: 0 })
          ))}
          {/*forumTopics && forumTopics.map(item => (
            renderTopicItem({id: item.id, topicInfo: item, firstIndex: 0})
          ))*/}
        </div>
      ) : (
          <div className={styles.topicList}>
            {anchorList.map(key => (
              <Fragment key={key}>
                {/*topicList_zh && topicList_us &&
                getLangLabel(topicList_us, topicList_zh)[key].map((item, index) => (
                  renderTopicItem({id: item.id, topicInfo: item, firstIndex: 1})
                ))*/}
                {topicList && topicList.filter(n => key === getLangLabel(n.name, n.name_zh_pinyin)[0].toUpperCase())
                  .sort((m, n) => getLangLabel(m.name, m.name_zh_pinyin).localeCompare(getLangLabel(n.name, n.name_zh_pinyin)))
                  .map(item => (
                    renderTopicItem({ id: item.id, topicInfo: item, firstIndex: 1, key })
                  ))
                }
              </Fragment>
            ))}
          </div>
        )}
    </div>
  );
}

// Topic.propTypes = {

// }

export default component(connect(({ auth, newTopic }) => ({
  isUserLogin: auth.isUserLogin,
  topicList: newTopic.topicList,
  // forumTopics: newTopic.forumTopics,
  newTopicList: newTopic.newTopicList,
})))(TopicContent);
