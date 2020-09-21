import React, { useState } from 'react';
import { connect, component } from 'acore';
import { FM } from 'locales';
import { Button, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { isLogin } from 'utils/auth';
import { classnames } from 'utils';
import styles from './PersonFollow.less';

const PersonFollow = props => {
  const {
    dispatch,
    user,
    source,
    personId,
    withIcon,
    isFollowing: is_following,
    numFollowed: num_followed,
  } = props;

  const [isFollowing, setIsFollowing] = useState(is_following);
  const [numFollowed, setNumFollowed] = useState(num_followed);
  const isUserLogin = isLogin(user);

  const toTop = () => {
    if (source === 'sogou' || source === 'true') {
      window.top.postMessage('aminerToTop###true', '*');
    }
  };

  const onFollow = () => {
    if (isUserLogin) {
      dispatch({
        type: 'aminerSearch/personFollow',
        payload: { id: personId },
      }).then(({ data, success }) => {
        if (success) {
          setNumFollowed(numFollowed + 1);
          setIsFollowing(!isFollowing);
        }
      });
    } else {
      toTop();
      dispatch({ type: 'modal/login' });
    }
  };

  const onUnFollow = () => {
    dispatch({
      type: 'aminerSearch/personUnFollow',
      payload: { id: personId },
    }).then(({ data, success }) => {
      if (success) {
        setNumFollowed(Math.max(numFollowed - 1, 0));
        setIsFollowing(!isFollowing);
      }
    });
  };

  // Hide if bind?
  if (user && user.id === personId) {
    return false;
  }

  if (withIcon) {
    return (
      <span className={styles.personFollow}>
        {isFollowing && (
          <Tooltip title={<FM id="aminer.person.unfollow" defaultMessage="Unfollow" />}>
            <span onClick={onUnFollow} className={styles.followIcon}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-follow" />
              </svg>
            </span>
          </Tooltip>
        )}
        {!isFollowing && (
          <Tooltip title={<FM id="aminer.person.follow" defaultMessage="Follow" />}>
            <span onClick={onFollow} className={styles.followIcon}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-unfollow" />
              </svg>
            </span>
          </Tooltip>
        )}
        <span className={styles.followNum}>{`[${numFollowed || 0}]`}</span>
      </span>
    );
  }

  return (
    <div className={styles.personFollow}>
      {/* {num_starred && ( */}
      {/* <span className={styles.followNum}>{num_followed || 0}</span> */}
      {/* )} */}
      {isFollowing && (
        <div className={styles.followBtns}>
          <div className={classnames(styles.btnContent, styles.s1)}>
            <Button className={classnames(styles.fbtn, styles.following)}>
              <div className={styles.left}>
                <FM id="aminer.person.following" defaultMessage="Following" />
              </div>
              <span className={styles.split}></span>
              <div className={styles.right}>
                <span>{numFollowed || 0}</span>
              </div>
            </Button>
          </div>

          <div className={classnames(styles.btnContent, styles.absolute)}>
            {/* 占位隐藏：unfollow 和 folling 一样宽 */}
            <Button className={classnames(styles.fbtn, styles.following, styles.visibility)}>
              <div className={styles.left}>
                <FM id="aminer.person.following" defaultMessage="Following" />
              </div>
              <span className={styles.split}></span>
              <div className={styles.right}>
                <span className={styles.number}>{numFollowed || 0}</span>
              </div>
            </Button>
            <Button
              className={classnames(styles.fbtn, styles.unfollow, styles.i)}
              onClick={onUnFollow}
            >
              <div className={styles.left}>
                <FM id="aminer.person.unfollow" defaultMessage="Unfollow" />
              </div>
            </Button>
          </div>
        </div>
      )}

      {!isFollowing && (
        <div className={styles.btnContent}>
          <Button className={classnames(styles.fbtn, styles.follow)} onClick={onFollow}>
            <div className={styles.left}>
              <i className={classnames('fa fa-plus', styles.icon)} />
              <FM id="aminer.person.follow" defaultMessage="Follow" />
            </div>
            {!!numFollowed && (
              <>
                <span className={styles.split}></span>
                <div className={styles.right}>{numFollowed && <span>{numFollowed || 0}</span>}</div>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default component(connect(({ auth }) => ({
  user: auth.user,
})))(PersonFollow);
