
import React, { useEffect, useState, useMemo } from 'react';
import { connect, component } from 'acore';
import { classnames } from 'utils';
import { message } from 'antd';
import pubHelper from 'helper/pub';
import styles from './StarPaperToPerson.less';


const StarPaperToPerson = props => {
  const { paper, dispatch, aid, setStarMapFun, starMap, hasStarRole } = props;

  const isStar = useMemo(() => {
    return pubHelper.PaperHasStar(paper.flags)
  }, [paper]);

  const starPaperToPerson = () => {
    if (!isStar) {
      setStarMapFun(paper)
    }
  }

  if (!hasStarRole) {
    return (
      <span className={styles.starPaperToPerson}>
        {isStar && (
          <svg className="icon">
            <use xlinkHref='#icon-china_star-copy' />
          </svg>
        )}
      </span>
    )
  }

  return (
    <span className={styles.starPaperToPerson} onClick={starPaperToPerson.bind(this)}>
      <svg className={classnames("icon", { [styles.starIcon]: !isStar },
        { [styles.activeIcon]: starMap[paper.id] })} aria-hidden="true">
        <use xlinkHref={`#icon-china_${isStar ? 'star-copy' : 'star1'}`} />
      </svg>
    </span>
  )
}

export default component(connect())(StarPaperToPerson)

// dispatch({
//   type: 'editProfile/starPaperToPerson',
//   payload: {
//     "pids": [paperId],
//     "id": aid
//   }
// }).then(data => {
//   if (data) {
//     setIsStar(true);
//   } else {
//     message.error('error');
//   }
// }).catch(() => {
//   message.error('error');
// })
