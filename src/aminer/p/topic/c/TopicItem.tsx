import React, { useState, useEffect } from 'react';
import { page, connect, Link } from 'acore';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import consts from 'consts';
import { Popconfirm } from 'antd';
import { isLogin } from 'utils/auth';
import { getLangLabel } from 'helper';
import styles from './TopicItem.less';

interface Proptypes {
  dispatch: (config: { type: string; payload?: object }) => Promise<any>;
  color: string;
  topic: any;
  user: object;
}

const TopicItem: React.FC<Proptypes> = props => {
  const { color, topic, user, dispatch } = props;

  const editTheTopic = topic => {
    console.log('编辑topic', topic);
  };

  const delTopic = delTopic => {
    dispatch({ type: 'aminerTopic/DeleteTopic', payload: { id: delTopic.id } }).then(result => {
      if (result) {
        document.getElementById(topic.id).style.display = 'none';
      }
    });
  };
  return (
    <div className={styles.topic_item_content} id={topic.id}>
      <div className="topic_item" style={{ borderColor: color }}>
        <div className="top">
          {/* <img src="" alt="topic_name" className="logo" /> */}
          <Link to={`/topic/${topic.id}`} className="logo_name">
            <div className="logo">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-topicicon" />
              </svg>
            </div>

            <div className="name" style={{ color }}>
              {getLangLabel(topic.name, topic.name_zh)}
            </div>
          </Link>
          {/* TODO: 管理员或者是自己创建的 */}
          {isLogin(user) && (
            <div className="action">
              <div className="edit_btn desktop_device" onClick={editTheTopic.bind(null, topic)}>
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-ico_compile_thick" />
                </svg>
              </div>
              <Popconfirm
                title={`确定删除${getLangLabel(topic.name, topic.name_zh)}吗？`}
                okText="是"
                cancelText="否"
                onConfirm={() => delTopic(topic)}
              >
                <div className="del_topic">
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-modal_close" />
                  </svg>
                </div>
              </Popconfirm>
            </div>
          )}
        </div>
        <div className="middle">
          <div className="statistics_time">
            <div className="statistics">
              <span>浏览: {topic.num_view}</span>
              <span>文章: {topic.mustreading_count}</span>
            </div>
            <div className="time">2020-10-06</div>
          </div>
          {/* TODO: 更多显示省略号 */}
          <div className="desc">{getLangLabel(topic.def, topic.def_zh)}</div>
        </div>
      </div>
      <div className="bottom">{/* TODO: 显示作者信息 */}</div>
    </div>
  );
};

export default page(connect())(TopicItem);
