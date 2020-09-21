// getSchedule

import React, { useEffect } from 'react';
import { page, connect, Link, history } from 'acore';
import consts from 'consts';
import { classnames } from 'utils';
import { FM } from 'locales';
import { SetOrGetViews } from '../SetOrGetViews';
import { isLogin } from 'utils/auth';
import styles from './index.less';

const Videos = props => {
  const { dispatch, user } = props;
  const { confInfo = {}, videoData } = props;

  useEffect(() => {
    if (confInfo && confInfo.id) {
      dispatch({
        type: 'aminerConf/getInterpretation',
        payload: { id: confInfo && confInfo.id, type: 'video' },
      });
      SetOrGetViews('click', dispatch, confInfo.id);
    }
  }, []);

  const openToVideoDesc = id => {
    // 记录访问量
    if (SetOrGetViews) {
      SetOrGetViews('click', dispatch, confInfo.id);
      SetOrGetViews('click', dispatch, `${confInfo.id}_${id}`);
    }
    if (!isLogin(user)) {
      dispatch({ type: 'modal/login' });
      return;
    }
    history.push(`/conf/${confInfo.short_name}/videos/${id}`);
  };

  // const onSharePaper = (text,id) => {
  //   const url = `${window.location.href}/${id}`;
  //   const openWeibo = () =>
  //     window.open(
  //       `http://service.weibo.com/share/share.php?title=${text}&url=${url}&source=bookmark&appkey=2992571369`,
  //     );
  //   if (/Firefox/.test(navigator.userAgent)) {
  //     setTimeout(openWeibo, 0);
  //   } else {
  //     openWeibo();
  //   }
  // };
  return (
    <div className={classnames('video', styles.videoList)}>
      {videoData &&
        videoData.map(video => {
          return (
            <div key={video.id} className="video_block">
              <div className="TinyPlayer" onClick={openToVideoDesc.bind(null, video.id)}>
                <div className="videoIcon">
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-shipin1" />
                  </svg>
                </div>
                <img src={video.cover} alt="视频遮罩" style={{ cursor: 'pointer' }} />
              </div>

              <Link
                to={`/pub/${video.id}?conf=${confInfo.short_name}`}
                target="_blank"
                className="pub_title"
                onClick={() => SetOrGetViews('click', dispatch, confInfo.id)}
              >
                {video.title}
              </Link>
              <p className="name_org">
                {video.author && video.author.id && (
                  <Link
                    className="name"
                    to={`/profile/${video.author.id}?conf=${confInfo.short_name}`}
                  >
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-profile" />
                    </svg>
                    {video.author.name}
                  </Link>
                )}
                {video.author && !video.author.id && (
                  <span className="name">{video.author.name}</span>
                )}
                {video.author && video.author.org && (
                  <span className="org">{video.author.org}</span>
                )}
              </p>
              {/* <p>
                <div
                  className="right_weibo"
                  onClick={onSharePaper.bind(null, video.title, video.id)}
                >
                  <div className="svg_outer">
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-weibo1" />
                    </svg>
                  </div>
                  <span className="legend">
                    <FM id="aminer.paper.headline" defaultMessage="Wei bo" />
                  </span>
                </div>
              </p> */}

            </div>
          );
        })}
    </div>
  );
};

export default page(
  connect(({ aminerConf, auth }) => ({
    videoData: aminerConf.videoData,
    user: auth.user
  })),
)(Videos);
