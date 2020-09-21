import React, { useState, useEffect } from 'react';
import { connect, component } from 'acore';
import { Button } from 'antd';
import { isLogin } from 'utils/auth';
import { classnames } from 'utils';
import styles from './PersonVote.less';

const PersonVote = props => {
  const [is_upvoted, setIsUpvoted] = useState(false);
  const [num_upvoted, setNumUpvoted] = useState(0);
  const [is_downvoted, setIsDownvoted] = useState(false);

  const { person, dispatch, user, topicid, source } = props;

  useEffect(() => {
    setIsUpvoted(person.is_upvoted);
    setNumUpvoted(person.num_upvoted);
    setIsDownvoted(person.is_downvoted);
  }, []);

  const toTop = () => {
    if (source == 'sogou' || source == 'true') {
      window.top.postMessage('aminerToTop###true', '*');
    }
  };

  const voteup = () => {
    if (isLogin(user)) {
      dispatch({
        type: 'aminerSearch/ChangeVoteByID',
        payload: {
          tid: topicid,
          id: person.id,
          is_cancel: is_upvoted,
          type: 'PERSON',
          vote_type: 'UP',
        },
      }).then(({ data, success }) => {
        const {
          keyValues: { num_upvoted: _num_upvoted },
        } = data;
        if (success) {
          setIsUpvoted(!is_upvoted);
          setNumUpvoted(_num_upvoted);
          setIsDownvoted(false);
        }
      });
    } else {
      toTop();
      dispatch({ type: 'modal/login' });
    }
  };

  const votedown = () => {
    if (isLogin(user)) {
      dispatch({
        type: 'aminerSearch/ChangeVoteByID',
        payload: {
          tid: topicid,
          id: person.id,
          is_cancel: is_downvoted,
          type: 'PERSON',
          vote_type: 'DOWN',
        },
      }).then(({ data, success }) => {
        const {
          keyValues: { num_upvoted: _num_upvoted },
        } = data;
        if (success) {
          setIsUpvoted(false);
          setNumUpvoted(_num_upvoted);
          setIsDownvoted(!is_downvoted);
        }
      });
    } else {
      toTop();
      dispatch({ type: 'modal/login' });
    }
  };

  return (
    <div className={styles.endorseGroup}>
      <Button
        className={classnames(styles.endorseBtn, styles.upBtn, { [styles.checked]: is_upvoted })}
        onClick={voteup}
      >
        <i className="fa fa-sort-up" />
      </Button>
      <span className={classnames(styles.endorseCount)}>
        <span>{num_upvoted || 0}</span>
      </span>
      <Button
        className={classnames(styles.endorseBtn, styles.downBtn, {
          [styles.checked]: is_downvoted,
        })}
        onClick={votedown}
      >
        <i className="fa fa-sort-down" />
      </Button>
    </div>
  );
};

export default component(
  connect(({ auth }) => ({
    user: auth.user,
  })),
)(PersonVote);
