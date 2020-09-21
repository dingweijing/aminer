import React, { useEffect, useState, Fragment, useMemo, useRef } from 'react';
import { page, connect, Link, FormCreate } from 'acore';
import { Button, Tooltip } from 'antd';
import { classnames } from 'utils';
import { sysconfig } from 'systems';
import PropTypes from 'prop-types';
import consts from 'consts';
import { formatMessage, FM, enUS } from 'locales';
import { isLogin } from 'utils/auth';
import { highlight } from 'utils/hooks';
import pubHelper from 'helper/pub';
import { MustReadReason } from 'aminer/core/pub/widgets/info';
import { getProfileUrl } from 'utils/profile-utils';
import PaperList from 'aminer/components/pub/PublicationList.tsx';
import { authorInitialCap, getPubLabels } from 'aminer/core/pub/utils';
import { ExpertLink, PaperPackLink } from 'aminer/components/widgets';
import LikeModal from './LikeModal';
import PaperInfoRightZone from './PaperInfoRightZone';
import { SetOrGetViews } from '../SetOrGetViews';
import VotePerson from '../Schedule/VotePerson';
import styles from './ConfPaperList.less';

const { PubList_Show_Authors_Max = 12 } = sysconfig;

const ConfPaperList = props => {
  const { user, pubs, filters, clickedPid, confInfo, dispatch, isTagClick } = props;
  const {
    infoRightZone,
    contentLeftZone,
    contentRightZone,
    isShowHeadline,
    isShowPdfDownload,
  } = props;
  const { color = '#d5d5d5', bestPaper = false } = props;
  // vote person 需要的pubid
  const [hoverPaperId, setHoverPaperId] = useState();

  useEffect(() => {
    if (confInfo && confInfo.id && confInfo.config.jiedu) {
      dispatch({
        type: 'aminerConf/getInterpretation',
        payload: { id: confInfo && confInfo.id },
      });
    }
  }, []);

  const onClickPdf = key => {
    if (SetOrGetViews) {
      SetOrGetViews('click', dispatch, confInfo && confInfo.id);
    }
    dispatch({ type: 'aminerConf/updateStateByKey', payload: { clickedPid: key } });
  };

  const highlightWords = filters && filters.keywords ? [filters.keywords] : [];
  const highlightAuthorIDs = filters && filters.aid ? [filters.aid] : [];

  const defaultZones = {
    contentRightZone: [
      params => (
        <div className="desktop_like" key={2}>
          <div className="desktop_device">
            {params && params.paper && params.paper.best_paper && (
              <div className="best_paper">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-bestpaper" />
                </svg>
              </div>
            )}
            <LikeModal
              {...params}
              user={user}
              key={2}
              color={color}
              confInfo={confInfo}
              SetOrGetViews={SetOrGetViews}
            />
          </div>
        </div>
      ),
    ],
    contentLeftZone: [],
  };

  const votePerson = (i, name, pid) => {
    if (SetOrGetViews) {
      SetOrGetViews('click', dispatch, confInfo && confInfo.id);
    }
    if (isLogin(user)) {
      dispatch({
        type: 'modal/open',
        payload: {
          title: formatMessage({
            id: 'aminer.conf.session.selectExpert',
            defaultMessage: 'Select Expert',
          }),
          width: '847px',
          extraArticleStyle: { padding: '20px 30px' },
          content: <VotePerson name={name} pid={pid} index={i} />,
        },
      });
    } else {
      dispatch({ type: 'modal/login' });
    }
  };

  const cardBottomZone = [
    ({ person, ...params }) => {
      const { name, id: cardID } = person;
      const { index, pid } = params;
      return (
        <div className={styles.personExtralLink} key="1">
          <a
            size="small"
            className={styles.votePersonBtn}
            onClick={votePerson.bind(null, index, name, pid)}
          >
            Vote Person
          </a>
          {cardID && (
            <Tooltip title={<FM id="aminer.home.arrival.star" />}>
              <a
                href={`https://star.aminer.cn/forecast?id=${cardID}&lang=en-US`}
                className="to_profile"
                target="_blank"
                rel="noopener noreferrer"
                onClick={SetOrGetViews.bind(null, 'click', dispatch, confInfo && confInfo.id)}
              >
                <svg
                  key="24"
                  style={{ cursor: 'pointer' }}
                  className={classnames('icon', styles.xiaomaoSvg)}
                  aria-hidden="true"
                >
                  <use xlinkHref="#icon-mai-1" />
                </svg>
              </a>
            </Tooltip>
          )}
        </div>
      );
    },
  ];

  const onDownloadPdf = pdf => {
    SetOrGetViews('click', dispatch, confInfo.id);
    dispatch({
      type: 'aminerConf/setSysTrack',
      payload: {
        type: 'conf_system',
        target_type: confInfo.short_name,
        target_name: 'paper',
        payload: JSON.stringify({ event: 'download_pdf' }),
      },
    });
  };

  const titleRightZone = [
    ({ paper }) => {
      const type = paper.type && paper.type.split(' ')[0];
      return (
        <span key="33" className="titleRightInner desktop_device">
          {type && (
            <span className={classnames('paperTag', 'img')}>
              <img
                src={`${consts.ResourcePath}/sys/aminer/conf/${type.toLowerCase()}.png`}
                alt={type}
              />
            </span>
          )}
          {isShowPdfDownload && paper.pdf && (
            <Tooltip
              placement="top"
              title={`${formatMessage({ id: 'aminer.paper.download' })} PDF`}
            >
              <a
                className="pdfIcon"
                target="_blank"
                rel="noopener noreferrer"
                href={paper.pdf}
                onClick={onDownloadPdf.bind(null, paper.pdf)}
              >
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-pdf" />
                </svg>
              </a>
            </Tooltip>
          )}
        </span>
      );
    },
  ];

  const setCollectViewAndTrack = () => {
    SetOrGetViews('click', dispatch, confInfo.id);
    dispatch({
      type: 'aminerConf/setSysTrack',
      payload: {
        type: 'conf_system',
        target_type: confInfo.short_name,
        target_name: 'paper',
        payload: JSON.stringify({ event: 'collect_img' }),
      },
    });
  };

  const abstractZone = [
    ({ paper }) => {
      return (
        <MustReadReason
          paper={{
            ...paper,
            reason: paper.headline || paper.abstract,
            img: pubHelper.getPubImg({ id: paper.id, img: paper.picture }),
          }}
          extraClickEvent={setCollectViewAndTrack}
          key="mustReadReason"
        />
      );
    },
  ];

  return (
    <div className={classnames(styles.confPaperList)}>
      <div>
        <PaperList
          // id={props.id}
          className={styles.paperList}
          highlight_item_id_index={clickedPid}
          papers={pubs}
          cardBottomZone={cardBottomZone}
          showKeywords
          isShowPdfIcon={false}
          highlightWords={highlightWords}
          onPaperTitleClick={() => {
            SetOrGetViews('click', dispatch, confInfo && confInfo.id);
          }}
          titleLinkQuery={{ query: { conf: confInfo && confInfo.short_name } }}
          venueZone={[]}
          abstractZone={isShowHeadline ? abstractZone : []}
          titleRightZone={titleRightZone}
          contentLeftZone={contentLeftZone || defaultZones.contentLeftZone}
          contentRightZone={contentRightZone || defaultZones.contentRightZone}
          // authorsZone={[renderAuthors]}
          infoRightZone={
            infoRightZone || [
              param => (
                <PaperInfoRightZone {...param} onClickPdf={onClickPdf} confInfo={confInfo} key="rightZone"/>
              ),
            ]
          }
          keywordsZone={[
            ({ paper }) => {
              const { keywords } = paper;

              const handleTag = tag => {
                if (!isTagClick) {
                  return;
                }
                if (filters.keywords !== tag) {
                  dispatch({ type: 'aminerConf/clearFilters' });
                }
                dispatch({ type: 'aminerConf/updateFilters', payload: { keywords: tag } });
              };
              return (
                <p className="tags" key="keywords">
                  {keywords &&
                    keywords.map((tag, index) => {
                      if (!tag) {
                        return null;
                      }
                      return (
                        <button
                          type="button"
                          className={isTagClick ? 'tag' : 'localeTag'}
                          key={`${tag}_${index}`}
                          onClick={handleTag.bind(null, tag)}
                        >
                          <span
                            dangerouslySetInnerHTML={{ __html: highlight(tag, highlightWords) }}
                          />
                        </button>
                      );
                    })}
                </p>
              );
            },
          ]}
        />
        {/* <div className="mobile_device">
          <LikeModal paper={pub} user={user} key={3} color={color} />
        </div> */}
      </div>
    </div>
  );
};

ConfPaperList.propTypes = {
  contentLeftZone: PropTypes.array,
  isAuthorsClick: PropTypes.bool,
  isTagClick: PropTypes.bool,
  isShowHeadline: PropTypes.bool,
  isShowPdfDownload: PropTypes.bool,
};

ConfPaperList.defaultProps = {
  isAuthorsClick: true,
  isTagClick: true,
  isShowHeadline: true,
  isShowPdfDownload: true,
};

export default page(
  connect(({ auth, aminerConf }) => ({
    user: auth.user,
    filters: aminerConf.filters,
    clickedPid: aminerConf.clickedPid,
  })),
)(ConfPaperList);
