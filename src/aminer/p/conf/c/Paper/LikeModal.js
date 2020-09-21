import React, { useEffect, useState } from 'react';
import { page, connect, Link, FormCreate } from 'acore';
import { classnames } from 'utils';
import { PaperCollect } from 'aminer/core/search/c/widgets';
import { formatMessage, FM, enUS } from 'locales';
import { isLogin } from 'utils/auth';
import styles from './LikeModal.less';

const LikeModal = props => {
  const [likeNum, setLikeNum] = useState();
  const [isLike, setIsLike] = useState();
  const { user, paper, color, dispatch, SetOrGetViews, confInfo } = props;

  useEffect(() => {
    setLikeNum(paper.num_like);
    setIsLike(paper.is_like);
  }, [paper]);

  const clickThumb = paper => {
    SetOrGetViews('click', dispatch, confInfo && confInfo.id);
    if (!isLogin(user)) {
      dispatch({ type: 'modal/login' });
      return;
    }
    const payload = { pid: paper.id };
    if (paper.is_like) {
      payload.op = 'cancel';
    }
    dispatch({
      type: 'aminerConf/setLikePaper',
      payload,
    }).then(result => {
      if (result) {
        if (isLike) {
          setLikeNum(paper.num_like ? --paper.num_like : 0);
        } else {
          setLikeNum(paper.num_like ? ++paper.num_like : 1);
        }
        setIsLike(!isLike);
      }
    });
  };

  const setCollectViewAndTrack = () => {
    SetOrGetViews('click', dispatch, confInfo && confInfo.id);
    dispatch({
      type: 'aminerConf/setSysTrack',
      payload: {
        type: 'conf_system',
        target_type: confInfo && confInfo.short_name,
        target_name: 'paper',
        payload: JSON.stringify({ event: 'collect' }),
      },
    });
  };

  return (
    <div className={styles.desktop_mobild_like} style={{ borderLeftColor: color }}>
      <div
        className={classnames('desktop_device', styles.likeModal)}
        onClick={clickThumb.bind(null, paper)}
      >
        {/* TODO: 点过的变成红色 */}
        <div className={classnames('likeBtn', { active: isLike })}>
          <svg className={classnames('icon', styles.thumb)} aria-hidden="true">
            <use xlinkHref={`#icon-top`} />
          </svg>
        </div>
        {/* TODO: 需要重新调用api获取 */}
        {!!likeNum && <div className={classnames('likeNum', { active: isLike })}>{likeNum}</div>}
      </div>
      {/* <PaperCollect
        wrapClassName="paperCollects"
        wrapCollectBtn="wrapCollectBtn"
        paper={paper}
        extraClickEvent={setCollectViewAndTrack}
      /> */}
      {/* <div className="mobile_device">
        <div className={styles.mobile_like} onClick={clickThumb.bind(null, paper)}>
          <div className={classnames('likeBtn', { active: isLike })}>
            <svg className={classnames('icon', styles.thumb)} aria-hidden="true">
              <use xlinkHref={`#icon-top`} />
            </svg>
          </div>
          {!!likeNum && <div className={classnames('likeNum', { active: isLike })}>{likeNum}</div>}
        </div>
      </div> */}
    </div>
  );
};
export default page(
  connect(({ auth }) => ({
    user: auth.user,
    roles: auth.roles,
  })),
)(LikeModal);
