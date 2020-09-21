import React, { useState, useEffect } from 'react';
import { page, connect, Link, routerRedux } from 'acore';
import { Layout } from 'aminer/layouts';
import { formatMessage, FM } from 'locales';
import VideoPlayer from 'aminer/components/video/fullPagePlayer';
import { Breadcrumb } from './c';
import { SetOrGetViews } from './c/SetOrGetViews';
import * as confUtils from './c/utils/utils';
import styles from './Video.less';

interface Proptypes {
  dispatch: (config: { type: string; payload?: object }) => Promise<any>;
  match: any;
  short_name: string;
  video: string;
  videoData: object;
  confInfo: any;
}

const TopicInfo: React.FC<Proptypes> = props => {
  const [viewed, setViewed] = useState();
  const { match, videoData, confInfo, dispatch } = props;
  const {
    params: { short_name, video },
  } = match;

  // https://originalstatic.aminer.cn/misc/confvideo/v4/5ec49a639fced0a24b4de7d4.m3u8

  useEffect(() => {
    if (confInfo && confInfo.id) {
      dispatch({
        type: 'aminerConf/setOrGetClickView',
        payload: { type: 'getClick', id: confInfo.id },
      }).then(result => {
        setViewed(result);
      });
    }
  }, [confInfo]);

  useEffect(() => {
    if (!confInfo || confInfo === {}) {
      dispatch({
        type: 'aminerConf/getConfList',
        payload: {
          offset: 0,
          size: 1,
          short_name,
          needReturn: false,
        },
      });
    }
  }, []);

  return (
    <Layout
      rootClassName="shortNameIndex"
      pageUniqueTitle={
        confInfo?.config?.tdk?.pageTitle ||
        formatMessage({
          id: `aminer.conf.iclr.pageTitle`,
        })
      }
      pageDesc={
        confInfo?.config?.tdk?.pageDesc ||
        formatMessage({
          id: `aminer.conf.iclr.pageDesc`,
        })
      }
      pageKeywords={
        confInfo?.config?.tdk?.pageKeywords ||
        formatMessage({
          id: `aminer.conf.iclr.pageKeywords`,
        })
      }
      pageHeaderFixed
    >
      <div className={styles.videoContent}>
        {confInfo && confInfo.config && confInfo.config.breadcrumb && (
          <Breadcrumb
            routes={['confIndex', 'confInfo', 'videos', 'video']}
            getConfInfo={confInfo && confInfo.short_name}
          />
        )}
        {confInfo && (
          <div
            className="confHeader"
            style={{
              backgroundImage: 'url(https://originalfileserver.aminer.cn/data/conf/conf_bg.jpg)',
            }}
            alt={`${confInfo.short_name}|国际学习表征会议|AMiner`}
          >
            <div className="homepage">
              <div className="content">
                <div className="short_name">
                  {confInfo.short_name && confInfo.short_name.toUpperCase()}
                </div>
                <div className="full_name">{confInfo.full_name}</div>
                <div className="date">
                  {`${confUtils.formatTime(confInfo.begin_date, 'MM.dd')} - ${confUtils.formatTime(
                    confInfo.end_date,
                    'MM.dd',
                  )}`}
                </div>
                <div className="url">
                  <a
                    href={confInfo.url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    onClick={() => SetOrGetViews('click', dispatch, confInfo.id)}
                  >
                    <FM id="aminer.conf.HomePage.webSite" />
                    {confInfo.url}
                  </a>
                </div>
              </div>
            </div>
            <div className="viewed">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-icon-test" />
              </svg>
              <span className="viewed_num">{viewed}</span>
            </div>
          </div>
        )}
        <div className="video">
          <Link to={`/conf/${short_name}/videos`}>
            <svg className="icon titleEditIcon" aria-hidden="true">
              <use xlinkHref="#icon-shipin" />
            </svg>
            <FM id="aminer.conf.video.callback" default="查看更多论文解读视频" />
          </Link>
          <div className="video_outBlock">
            <VideoPlayer
              video={{
                url: `https://originalstatic.aminer.cn/misc/confvideo/${
                  short_name && short_name.slice(0, short_name.length - 4)
                }/${video}.m3u8`,
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default page(
  connect(({ aminerConf }) => ({
    videoData: aminerConf.videoData,
    confInfo: aminerConf.confInfo,
  })),
)(TopicInfo);

// https://originalstatic.aminer.cn/misc/confvideo/v4/5ec49a639fced0a24b4de7d4.m3u8
