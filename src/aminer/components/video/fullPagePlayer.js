import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { loadStyleSheet } from 'utils/requireCSS';
import { loadDplayer } from 'utils/requirejs';

const css = 'https://fileserver.aminer.cn/jscdn/DPlayer.min.css';
const VideoPlayer = props => {
  const { video, ...config } = props;

  useEffect(() => {
    loadStyleSheet(css);
    loadDplayer(() => {
      if (window && window.DPlayer) {
        const dp = new DPlayer({
          container: document.getElementById('dplayer'),
          video,
          ...config,
          // contextmenu: [
          // ],
        });
      }
    });
  }, []);

  if (!video || video.src) {
    return <p>请输入视频地址</p>;
  }

  return <div id="dplayer"></div>;
};

VideoPlayer.propTypes = {
  autoplay: PropTypes.bool,
  loop: PropTypes.bool,
  screenshot: PropTypes.bool,
  preload: PropTypes.string,
  video: PropTypes.object,
};

VideoPlayer.defaultProps = {
  autoplay: false, // 自动播放
  loop: false, // 循环播放
  preload: 'none', // 视频预热，自动加载
  screenshot: false,
};
export default VideoPlayer;
