import React, { useEffect, useState } from 'react';
import { page, connect, Link, FormCreate } from 'acore';
import PropTypes from 'prop-types';
import { classnames } from 'utils';
import pubHelper from 'helper/pub';
import { formatMessage, FM, enUS } from 'locales';
import { SetOrGetViews } from '../SetOrGetViews';
import styles from './PaperInfoRightZone.less';

const PaperInfoRightZone = props => {
  const { paper, onClickPdf, confInfo } = props;
  const { dispatch } = props;

  const [interpretation, setInterpretation] = useState();

  const { resources = {}, ppt } = paper;

  useEffect(() => {
    setInterpretation(props.interpretation);
  }, [props.interpretation]);

  const onClickPdfIcon = (type, pid) => {
    if (onClickPdf) {
      onClickPdf(pid);
    }
    if (confInfo && confInfo.id) {
      SetOrGetViews(type, dispatch, confInfo && confInfo.id);
      dispatch({
        type: 'aminerConf/setSysTrack',
        payload: {
          type: 'conf_system',
          target_type: confInfo && confInfo.short_name,
          target_name: 'paper',
          payload: JSON.stringify({ event: 'insight' }),
        },
      });
    }
  };

  const paper_interpretation = interpretation && interpretation[paper.id];

  const { vLink, tLink } = paper_interpretation || {};

  const setViewAndTrack = type => {
    SetOrGetViews('click', dispatch, confInfo && confInfo.id);
    dispatch({
      type: 'aminerConf/setSysTrack',
      payload: {
        type: 'conf_system',
        target_type: confInfo && confInfo.short_name,
        target_name: 'paper',
        payload: JSON.stringify({ outline: type }),
      },
    });
  };

  return (
    <div className={classnames('desktop_device', styles.infoRightZone)}>
      {paper.mrt_link && (
        <div className="icon-link mrt">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.aminer.cn/mrt/${paper.mrt_link}?c=${confInfo &&
              confInfo.short_name}`}
            onClick={setViewAndTrack.bind(null, 'MRT')}
          >
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-tree" />
            </svg>
            <FM id="aminer.conf.mrt" />
          </a>
        </div>
      )}
      {resources.code && resources.code.length > 0 && resources.code[0].link && (
        <div className="icon-link code">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={pubHelper.genPubTitleAnchor({ id: paper.id, title: paper.title, anchor: 'code' })}
            onClick={setViewAndTrack.bind(null, 'code')}
          >
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-code" />
            </svg>
            {formatMessage({ id: 'aminer.paper.code', defaultMessage: 'Code' })}
          </a>
        </div>
      )}
      {resources.data && resources.data.length > 0 && resources.data[0].link && (
        <div className="icon-link data">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={pubHelper.genPubTitleAnchor({ id: paper.id, title: paper.title, anchor: 'data' })}
            onClick={setViewAndTrack.bind(null, 'data')}
          >
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-odps-data" />
            </svg>
            {formatMessage({ id: 'aminer.home.title.data', defaultMessage: 'Data' })}
          </a>
        </div>
      )}

      {ppt && (
        <div className="icon-link ppt">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={pubHelper.genPubTitle(paper)}
            onClick={setViewAndTrack.bind(null, 'ppt')}
          >
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-ppt" />
            </svg>
            PPT
          </a>
        </div>
      )}

      {vLink && (
        <div className="icon-link video">
          <a
            target="_blank"
            href={vLink}
            rel="noopener noreferrer"
            onClick={setViewAndTrack.bind(null, 'v_link')}
          >
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-shipin" />
            </svg>
            <FM id="aminer.conf.video" defaultMessage="Video" />
          </a>
        </div>
      )}

      {tLink && (
        <div className="icon-link text">
          <a
            target="_blank"
            href={tLink}
            rel="noopener noreferrer"
            onClick={setViewAndTrack.bind(null, 't_link')}
          >
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-wenben" />
            </svg>
            <FM id="aminer.conf.interpretation" defaultMessage="Interpretation" />
          </a>
        </div>
      )}

      {paper.headline && (
        <div className="icon-link pdf">
          <a target="_blank" onClick={onClickPdfIcon.bind(null, 'click', paper.id)}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-dushu" />
            </svg>
            <FM id="aminer.paper.insight" defaultMessage="Insight" />
          </a>
        </div>
      )}
    </div>
  );
};

PaperInfoRightZone.propTypes = {
  showAbstract: PropTypes.bool,
};

PaperInfoRightZone.defaultProps = {
  showAbstract: true,
};

export default page(
  connect(({ aminerConf }) => ({
    interpretation: aminerConf.interpretation,
  })),
)(PaperInfoRightZone);
