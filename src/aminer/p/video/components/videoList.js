import React, { useState } from 'react';

import { Card } from 'antd';
import styles from './videoList.less'

const { Meta } = Card;

const VideoList = (props) => {
  const { list, clickVideoCallBack } = props;
  if (!list || list.length === 0) {
    return (
      <div>
        暂无视频
      </div>
    )
  }

  const clickVideo = (id, url) => {
    console.log('key', id, url);
    if (clickVideoCallBack) clickVideoCallBack(id, url)
  }


  return (
    <div className={styles.videoList}>
      {list && list.map((item) => {
        return (
          <Card
            key={item.id}
            onClick={clickVideo.bind(null, item.id, item.url)}
            hoverable
            style={{ width: 240, height: 300 }}
            bodyStyle={{ padding: 12 }}
            cover={<img alt="example" src={item.cover} />}
          >
            <Meta className={styles.videoMeta} title={item.title} description={item.desc} />
          </Card>
        )
      })}
    </div>
  )
}

export default VideoList;
