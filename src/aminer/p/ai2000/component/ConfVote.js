import React, { useState } from 'react';
import { component, connect } from 'acore';
import { classnames } from 'utils';
import { isLogin } from 'utils/auth';
import styles from './ConfVote.less';

const ConfVote = props => {
  const { dispatch, user } = props;
  const { conf_id, year } = props;
  const { is_vote_up, is_vote_down, vote_up_num, vote_down_num, vote_id } = props;

  const [isUpvoted, setIsUpvoted] = useState(is_vote_up);
  const [numUpvoted, setNumUpvoted] = useState(vote_up_num);
  const [numDownvoted, setNumDownvoted] = useState(vote_down_num);
  const [isDownvoted, setIsDownvoted] = useState(is_vote_down);

  const voteup = () => {
    if (isLogin(user)) {
      dispatch({
        type: 'aminerSearch/ChangeVoteByID',
        payload: {
          tid: '5e0b0d9fb9722cc1310351ac',
          id: conf_id,
          is_cancel: isUpvoted,
          type: 'AI2000VENUE',
          vote_type: 'UP',
          year: year - 0,
        },
      }).then(({ data, success }) => {
        // console.log('kkkkkkkkkkkk', { data, success });
        const {
          keyValues: { num_upvoted, num_downvoted },
        } = data;
        if (success) {
          // this.setState({
          //   num_upvoted,
          //   is_upvoted: !is_upvoted,
          //   is_downvoted: false,
          // });
          setNumDownvoted(num_downvoted);
          setNumUpvoted(num_upvoted);
          setIsUpvoted(!isUpvoted);
          setIsDownvoted(false);
        }
      });
    } else {
      dispatch({ type: 'modal/login' });
    }
  };

  const votedown = () => {
    if (isLogin(user)) {
      dispatch({
        type: 'aminerSearch/ChangeVoteByID',
        payload: {
          tid: vote_id,
          id: conf_id,
          is_cancel: isDownvoted,
          type: 'AI2000VENUE',
          vote_type: 'DOWN',
          year: year - 0,
        },
      }).then(({ data, success }) => {
        const {
          keyValues: { num_upvoted, num_downvoted },
        } = data;
        if (success) {
          // this.setState({
          //   num_upvoted,
          //   is_upvoted: false,
          //   is_downvoted: !is_downvoted,
          // });
          setNumDownvoted(num_downvoted);
          setNumUpvoted(num_upvoted);
          setIsUpvoted(false);
          setIsDownvoted(!isDownvoted);
        }
      });
    } else {
      dispatch({ type: 'modal/login' });
    }
  };
  return (
    <span className={styles.confVote}>
      <span>
        <svg
          className={classnames('icon vote', { active: isUpvoted })}
          aria-hidden="true"
          onClick={voteup}
        >
          <use xlinkHref={`#icon-zan${isUpvoted ? '-active' : ''}`} />
        </svg>
        <span>{numUpvoted || 0}</span>
      </span>
      <span>
        <svg
          className={classnames('icon vote fan', { active: isDownvoted })}
          aria-hidden="true"
          onClick={votedown}
        >
          <use xlinkHref={`#icon-zan${isDownvoted ? '-active' : ''}`} />
        </svg>
        <span>{numDownvoted || 0}</span>
      </span>
    </span>
  );
};

export default component(connect(({ auth }) => ({ user: auth.user })))(ConfVote);

// [
//   {
//       "action": "comments.ChangeVoteByID",
//       "parameters": {
//           "tid": "55830b928c93a0d726985aa7",
//           "id": "5e0aa8527982e0bc3e8b77c5",
//           "vote_type": "DOWN",
//           "type": "AI2000VENUE",
//           "is_cancel": false,
//           "year":2019
//       }
//   }
// ]
