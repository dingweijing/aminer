import React, { useEffect } from 'react'
import { connect, component } from 'acore';
import { Tag, message } from 'antd';
import { FM } from 'locales';
import { getLangLabel } from 'helper';
import { classnames } from 'utils';
// import PropTypes from 'prop-types';
import styles from './TopicItem.less';

const TopicItem = props => {
  const { dispatch, topicInfo, firstIndex, secondIndex, isUserLogin, topicList } = props;
  if (topicInfo.name_zh === '半监督学习') {
    // console.log(topicInfo, 111)
  }

  useEffect(() => {
    // console.log(22)
  }, [topicList])

  const likeIconClick = () => {
    // dispatch({
    //   type: 'newTopic/changeCs'
    // })
    if (!isUserLogin) {
      dispatch({ type: 'modal/login' });
      return ;
    }
    if (!topicInfo.is_like) {
      dispatch({
        type: 'newTopic/setLikeTopicById',
        payload: { id: topicInfo.id },
      }).then(res => {
        if (res) {
          message.success("点赞成功。");
        } else {
          message.error("点赞失败。");
        }
      });

      dispatch({
        type: 'newTopic/changeTopicLiked',
        payload: { firstIndex, secondIndex, is_like: true, num_like: topicInfo.num_like + 1 }
      });
    } else {
      dispatch({
        type: 'newTopic/setUnLikeTopicById',
        payload: { id: topicInfo.id },
      }).then(res => {
        if (res) {
          message.success("取消点赞成功。");
        } else {
          message.error("取消点赞失败。");
        }
      })

      dispatch({
        type: 'newTopic/changeTopicLiked',
        payload: { firstIndex, secondIndex, is_like: false, num_like: topicInfo.num_like - 1 }
      });
    }
  }

  return (
    topicInfo && (
      <div className={styles.topicItem}>
        <div className={styles.topicName}>
          <svg className="icon" aria-hidden="true" >
            <use xlinkHref="#icon-xingtuxuetang-chuangjianwendangcitiao-" />
          </svg>
          <span className={styles.title}>{getLangLabel(topicInfo.name, topicInfo.name_zh)}</span>
        </div>
        <div className={styles.topicAvatar}>
          <img src={topicInfo.selected_img}/>
        </div>
        <p className={styles.topicDesc}>{getLangLabel(topicInfo.def && topicInfo.def_zh)}</p>
        <div className={styles.topicNum}>
          <span className={styles.articleNum}>{`文章：${topicInfo.mustreading_count}`}</span>
          <div className={styles.likeNum}>
            <span className={classnames(styles.likeIcon, { liked: topicInfo.is_like })} onClick={likeIconClick}>
              <svg className="icon" aria-hidden="true" >
                <use xlinkHref="#icon-top" />
              </svg>
            </span>
            <span className={styles.num}>{topicInfo.num_like}</span>
          </div>
        </div>
      </div>
    )
  );
}

// Topic.propTypes = {

// }

export default component(connect(({ auth, newTopic }) => ({
  isUserLogin: auth.isUserLogin,
  topicList: newTopic.topicList,
  newTopicList: newTopic.newTopicList,
})))(TopicItem);
