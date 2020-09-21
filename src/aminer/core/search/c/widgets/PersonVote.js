import React, { PureComponent } from 'react';
import { connect, history } from 'acore';
import { Button } from 'antd';
import { isLogin } from 'utils/auth';
import { classnames } from 'utils';
import styles from './PersonVote.less';


export default
@connect(({ auth, searchperson }) => ({
  user: auth.user,
  topics: searchperson.topics
}))
class PersonVote extends PureComponent {

  state = {
    is_upvoted: false,
    num_upvoted: 0,
    is_downvoted: false,
  }

  componentDidMount() {
    const { person: { is_upvoted, num_upvoted, is_downvoted } } = this.props;
    this.setState({
      is_upvoted, num_upvoted, is_downvoted
    })
  }

  toTop = () => {
    const { source } = this.props;
    if (source == "sogou" || source == "true") {
      window.top.postMessage("aminerToTop###true", "*")
    }
  }

  voteup = () => {
    const { dispatch, user, person, topics, topicid } = this.props;
    const { is_upvoted } = this.state;
    if (isLogin(user)) {
      dispatch({
        type: 'aminerSearch/ChangeVoteByID', payload: {
          tid: topicid || topics[0].i,
          id: person.id,
          is_cancel: is_upvoted,
          type: 'PERSON',
          vote_type: 'UP'
        }
      }).then(({ data, success }) => {
        const { keyValues: { num_upvoted } } = data;
        if (success) {
          this.setState({
            num_upvoted,
            is_upvoted: !is_upvoted,
            is_downvoted: false,
          })
        }
      })
    } else {
      this.toTop()
      dispatch({ type: 'modal/login' })
    }

  }

  votedown = () => {
    const { dispatch, user, person, topics, topicid } = this.props;
    const { is_downvoted } = this.state;
    if (isLogin(user)) {
      dispatch({
        type: 'aminerSearch/ChangeVoteByID', payload: {
          tid: topicid || topics[0].i,
          id: person.id,
          is_cancel: is_downvoted,
          type: 'PERSON',
          vote_type: 'DOWN'
        }
      }).then(({ data, success }) => {
        const { keyValues: { num_upvoted } } = data;
        if (success) {
          this.setState({
            num_upvoted,
            is_upvoted: false,
            is_downvoted: !is_downvoted,
          })
        }
      })
    } else {
      this.toTop()
      dispatch({ type: 'modal/login' })
    }

  }

  render() {
    const { is_upvoted, num_upvoted, is_downvoted } = this.state;

    return (
      <div className={styles.endorseGroup}>
        <Button className={classnames(styles.endorseBtn, styles.upBtn, { [styles.checked]: is_upvoted })}
          onClick={this.voteup}
        >
          <i className="fa fa-sort-up" />
        </Button>
        <span className={classnames(styles.endorseCount)}>
          <span>
            {num_upvoted || 0}
          </span>
        </span>
        <Button className={classnames(styles.endorseBtn, styles.downBtn, { [styles.checked]: is_downvoted })}
          onClick={this.votedown}
        >
          <i className="fa fa-sort-down" />
        </Button>
      </div>
    );
  }
}
