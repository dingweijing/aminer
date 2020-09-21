import React, { useState, useEffect } from 'react';
import { connect, component } from 'acore';
import { Button } from 'antd';
import { classnames } from 'utils';
import { FM } from 'locales';
import { isLogin } from 'utils/auth';
import styles from './PaperCollect.less';


const PaperCollect = props => {
  const { paper, dispatch, user, paperAllLiked, wrapClassName, wrapCollectBtn } = props;
  const { is_starring, num_starred, id } = paper;
  // conf 系统记录view 和 track 用的
  const { extraClickEvent } = props;
  const [isStarring, setIsStarring] = useState(is_starring);
  const [numStarred, setNumStarred] = useState(num_starred);

  const collectFunc = (type, num_starred, is_starring) => {
    dispatch({
      type,
      payload: { id, paper },
    }).then(({ data, success }) => {
      if (success) {
        setIsStarring(is_starring);
        setNumStarred(num_starred);
      }
    });
  };

  const collect = () => {
    if (extraClickEvent) {
      extraClickEvent();
    }
    if (isLogin(user)) {
      if (!isStarring) {
        collectFunc('searchpaper/paperMark', numStarred + 1, !isStarring);
        // const btn = document.getElementById('collectorIconAnimation');
        // btn.classList.add('show');
        // let ripple = btn.querySelector('.animation');
        // if (!ripple) {
        //   ripple = document.createElement('span');
        //   ripple.className = 'animation';
        //   btn.appendChild(ripple);
        // }
      } else {
        unCollect();
      }
    } else {
      dispatch({ type: 'modal/login' });
    }
  };

  const unCollect = () => {
    collectFunc('searchpaper/paperUnMark', numStarred - 1, !isStarring);
  };

  useEffect(() => {
    const likeIds = paperAllLiked && paperAllLiked.length > 0 ? paperAllLiked.map(n => n.id) : [];
    setIsStarring(likeIds.includes(id));
  }, [paperAllLiked]);

  return (
    <div
      className={classnames(styles.paperCollect, { [styles.collected]: isStarring }, 'paperCollect', wrapClassName)}
      onClick={collect}
    >
      <div className={classnames(styles.collectBtn, wrapCollectBtn)}>
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-Shopping" />
        </svg>

        {/* <FM id="aminer.paper.collect" defaultMessage="Collect" /> */}
        {/* <div className={styles.numCollected}>{numStarred || ''}</div> */}
        {/* <div className={classnames(styles.collect, styles.visibleWhenHover)}>
          <FM id="aminer.paper.collect" defaultMessage='Collect' />
        </div> */}
        {/* <div className={styles.collectIcon}>
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-bookmark" />
          </svg>
        </div> */}
      </div>
      {isStarring ? (
        <FM id="aminer.paper.addedSummarize" defaultMessage="Collect" />
      ) : (
          <FM id="aminer.paper.batchSummarize" />
        )}
      {/* {!isStarring && (
        <div className={classnames(styles.collectBtn, styles.notCollected)} onClick={collect}>
          <div className={styles.numCollected}>{numStarred}</div>
          <div className={classnames(styles.collect, styles.visibleWhenHover)}><FM id="aminer.paper.collect" defaultMessage='Collect' /></div>
          <div className={styles.collectIcon}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-bookmark" />
            </svg>
          </div>
        </div>
      )} */}
      {/* {isStarring && (
        <div className={classnames(styles.collectBtn, styles.collected)} onClick={unCollect}>
          <div className={styles.numCollected}>{numStarred}</div>
          <div className={classnames(styles.cancel, styles.visibleWhenHover)}><FM id="aminer.paper.uncollect" defaultMessage='Cancel' /></div>
          <div className={styles.collectIcon}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-bookmark" />
            </svg>
          </div>
        </div>
      )} */}
    </div>
  );
};
export default component(
  connect(({ searchpaper, auth }) => ({
    paperAllLiked: searchpaper.paperAllLiked,
    user: auth.user,
  })),
)(PaperCollect);
