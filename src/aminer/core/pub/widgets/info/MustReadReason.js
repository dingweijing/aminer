import React, { useState, useEffect, useCallback } from 'react';
import { connect, component, page, Link } from 'acore';
import { Button, Tooltip } from 'antd';
import { isLogin } from 'utils/auth';
import pubHelper from 'helper/pub';
import { PaperPackLink } from 'aminer/components/widgets';
import { formatMessage } from 'locales';
import { classnames } from 'utils';
import styles from './MustReadReason.less';

const chop = (text, size) => {
  if (text) {
    return text.length > size ? `${text.substring(0, size)}...` : text;
  }
  return '';
};

let imgObj;
const MustReadReason = props => {
  const {
    paper,
    hideImg = false,
    abstractLen = 280,
    dispatch,
    reasonClass,
    lazyLoad = false,
    showComment = true,
    showHeadlineOrAbs = false,
  } = props;

  const [imgUrl, setImgUrl] = useState(null);
  const { img, id, headline, abstract } = paper;
  let { reason } = paper;
  const { extraClickEvent } = props;

  const onImgClick = () => {
    if (extraClickEvent) {
      extraClickEvent();
    }
    dispatch({
      type: 'imgViewer/open',
      payload: {
        src: img,
        intro: reason,
      },
    });
  };

  useEffect(() => {
    if (img) {
      imgObj = new Image();
      imgObj.src = img;
      imgObj.onload = () => setImgUrl(img);
    }
    return () => {
      imgObj = null;
    }
  }, []);

  // if (!reason && !showHeadlineOrAbs) {
  //   return null;
  // }

  // if (!reason && showHeadlineOrAbs) {
  //   reason = headline || abstract;
  // }

  if (!reason) {
    if (showHeadlineOrAbs && (headline || abstract)) {
      reason = headline || abstract;
    } else {
      return null;
    }
  }
  return (
    <div className={styles.mustReadReason}>
      {!hideImg && imgUrl && (
        <div className="mustReadImgWrap desktop_device" onClick={onImgClick}>
          <div className="imgWrap">
            <img
              // src={lazyLoad ? '' : imgUrl}
              src={imgUrl}
              alt={reason}
              className={lazyLoad ? classnames('mustReadImg', 'lazeLoad') : 'mustReadImg'}
              title={reason}
              data-src={imgUrl}
            />
          </div>
        </div>
      )}
      <div className="reasonWrap">
        <div className={classnames('quote', 'leftQuote')}>
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-Cited" />
          </svg>
        </div>
        <div className={classnames('reason', reasonClass)}>
          <span title={reason}>{chop(reason, abstractLen)}</span>
        </div>

        <div className={classnames('quote', 'rightQuote')}>
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-Cited" />
          </svg>
        </div>
      </div>
      {showComment && (
        <Link
          className="commentIcon desktop_device"
          to={`${pubHelper.genPubTitle(paper)}?linktocomment=true`}
          target="_blank"
        >
          <PaperPackLink data={paper}>
            <Tooltip
              title={formatMessage({ id: 'aminer.paper.comment', defaultMessage: 'Comment' })}
            >
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-pinglun" />
              </svg>
            </Tooltip>
          </PaperPackLink>
        </Link>
      )}
    </div>
  );
};
// export default MustReadReason;

export default page(connect())(MustReadReason);
