import React, { useEffect } from 'react';
import { connect, history } from 'acore';
import VideoPlayer from './fullPagePlayer';
import styles from './tinyPlayer.less';

// const imgSrc = 'https://fileserver.aminer.cn/jscdn/DPlayer.min.css';
const TinyPlayer = props => {
  const {
    src,
    videoConfig,
    video,
    dispatch,
    imgOutBlockSty = { width: '300px' },
    SetOrGetViews,
    confInfo,
    type,
    modalStyle,
    openMethod,
  } = props;
  if (!src) {
    return <p>请输入图片地址</p>;
  }

  const openFullPage = () => {
    // 记录访问量
    if (SetOrGetViews) {
      SetOrGetViews('click', dispatch, confInfo.id);
      SetOrGetViews('click', dispatch, `${confInfo.id}_${type}`);
    }
    if (openMethod === 'modal') {
      dispatch({
        type: 'modal/open',
        payload: {
          showHeader: false,
          maskClosable: true,
          height: modalStyle.height || '560px',
          width: modalStyle.width || '1000px',
          content: <VideoPlayer video={video} />,
          handelOk: () => {
            console.log('handelOk');
          },
        },
      });
    } else {
      history.push(`/conf/${confInfo.short_name}/videos/${id}`);
    }
  };

  return (
    <div className={styles.TinyPlayer} style={imgOutBlockSty} onClick={openFullPage.bind()}>
      <div className="videoIcon">
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-shipin1" />
        </svg>
      </div>
      <img src={src} alt="视频遮罩" style={{ cursor: 'pointer' }} />
    </div>
  );
};

export default connect()(TinyPlayer);
