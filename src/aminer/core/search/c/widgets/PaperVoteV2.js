import React, { useState, useEffect, useCallback } from 'react';
import { connect, component } from 'acore';
import { Button } from 'antd';
import { isLogin } from 'utils/auth';
import { classnames } from 'utils';
import styles from './PaperVoteV2.less';

const PaperVoteV2 = props => {
  const { paper: { is_upvoted, is_downvoted, id, is_like, is_tread, like_count, tread_count, tmp_id }, dispatch, keyValues, user } = props;
  const [isUpVoted, setIsUpVoted] = useState(is_like);
  const [isDownVoted, setIsDownVoted] = useState(is_tread);
  const [numUpVoted, setNumUpVoted] = useState(like_count);
  const [numTread, setNumTread] = useState(tread_count);

  const vote = (isUp) => {
    if (isLogin(user)) {
      let type = null, payload = {};
      if (id) {
        payload.id = id;
        type = 'set';
      } else if (!id && tmp_id) {
        payload.id = tmp_id;
        type = 'tmp';
      }
      if (isUp) {
        if (isUpVoted) payload.op = 'cancel';
        type += 'Like';
      } else {
        if (isDownVoted) payload.op = 'cancel';
        type += 'Tread';
      }
      dispatch({
        type: `searchpaper/${type}`, payload,
      }).then((result) => {
        const { data = {} } = result;
        setNumUpVoted(data.like_count);
        setNumTread(data.tread_count)
        setIsUpVoted(data.is_like);
        setIsDownVoted(data.is_tread);
      })
    } else {
      dispatch({ type: 'modal/login' })
    }
  }

  return (
    <div className={classnames(styles.endorseGroup, 'paperVote')}>
      <div className={styles.btnAndNum}>
          <Button className={classnames(styles.endorseBtn, { [styles.checked]: isUpVoted })}
            onClick={vote.bind(null, true)}
          >
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-dianzan" />
            </svg>
          </Button>
          <span className={classnames(styles.endorseCount)}>
            <span>
              {numUpVoted || 0}
            </span>
          </span>
        </div>
      <div className={styles.btnAndNum}>
        <Button className={classnames(styles.endorseBtn, styles.downBtn, { [styles.checked]: isDownVoted })}
          onClick={vote.bind(null, false)}
        >
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-diancai" />
          </svg>
        </Button>
        <span className={classnames(styles.endorseCount)}>
          <span>
            {numTread || 0}
          </span>
        </span>
      </div>
      
    </div>
  )
}
export default component(connect(({ auth, searchpaper }) => ({
  user: auth.user,
  keyValues: searchpaper.keyValues
})))(PaperVoteV2)
