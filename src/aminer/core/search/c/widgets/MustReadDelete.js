// MustReadDelete
import React from 'react'
import { page, connect, component } from 'acore';
import { Popconfirm, message } from 'antd';
import PropTypes from 'prop-types'
import styles from './MustReadDelete.less';

const MustReadDelete = props => {
  const { dispatch, topic, paper } = props;

  const confirm = () => {
    dispatch({
      type: 'searchpaper/DeleteMustReadingPub',
      payload: {
        topicId: topic.id,
        pid: paper.id,
        tmpId: paper.tmp_id,
        // pid: [paper.id],
        // tmpId: [paper.tmp_id],
      }
    }).then(data => {
      if (data) {
        message.success('删除成功');
      }
    })
  }

  const deleteIcon = (
    <svg aria-hidden="true" className={styles.deleteIcon}>
      <use xlinkHref='#icon-delete-'/>
    </svg>
  )

  return (
    <Popconfirm
      title="确定删除这篇必读吗 ？"
      onConfirm={confirm}
      okText="Yes"
      cancelText="No"
      icon={deleteIcon}
    >
      <span className={styles.mustReadDelete}>删除</span>
    </Popconfirm>
  )
}

export default page(
  connect(({ searchpaper }) => ({ topic: searchpaper.topic }))
)(MustReadDelete);
