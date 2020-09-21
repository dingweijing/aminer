import React, { useEffect, useState } from 'react';
import { connect, component } from 'acore';
import { FM } from 'locales';
import { Button, Tooltip } from 'antd';
import { isLogin } from 'utils/auth';
import { classnames } from 'utils';
import { ProfileInfo } from 'aminer/components/person/person_type';
import { PubInfo } from 'aminer/components/pub/pub_type';
import styles from './FollowBtn.less';

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  is_following: boolean;
  isFollow: any;
  type: 'p' | 'e';
  entity: PubInfo | ProfileInfo;
  size: string;
  num_followed: number;
  withNum: boolean;
  withIcon: boolean;
}

const FollowBtn: React.FC<IPropTypes> = props => {
  const {
    dispatch,
    user,
    entity,
    is_following,
    num_followed,
    type,
    isFollow,
    size = 'normal',
    withNum = true,
    withIcon = false,
  } = props;
  const { id: pid } = entity;
  const { is_follow, count } = isFollow || {};
  const [isFollowing, setIsFollowing] = useState(is_following || is_follow);
  const [numFollowed, setNumFollowed] = useState(num_followed || count);

  const onFollow: (state: boolean, remove_all: boolean) => void = (
    state = isFollowing,
    remove_all,
  ) => {
    if (isLogin(user)) {
      const params = {
        ids: [pid],
        f_type: type,
        op: state ? 'cancel' : '',
        remove_completely: remove_all,
      };
      dispatch({
        type: 'collection/Follow',
        payload: params,
      }).then(res => {
        if (res) {
          setIsFollowing(!isFollowing);
          const num = isFollowing ? numFollowed - 1 : numFollowed + 1;
          setNumFollowed(num);
        }
      });
    } else {
      dispatch({ type: 'modal/login' });
    }
  };

  useEffect(() => {
    setIsFollowing(is_following || is_follow);
  }, [is_following, is_follow]);

  useEffect(() => {
    setNumFollowed(num_followed || count);
  }, [num_followed, count]);

  if (withIcon) {
    return (
      <span className={styles.followIcon}>
        {isFollowing && (
          <Tooltip title={<FM id="aminer.person.unfollow" defaultMessage="Unfollow" />}>
            <svg
              onClick={() => {
                onFollow(true, true);
              }}
              className="icon follow_icon"
              aria-hidden="true"
            >
              <use xlinkHref="#icon-follow" />
            </svg>
          </Tooltip>
        )}
        {!isFollowing && (
          <Tooltip title={<FM id="aminer.person.follow" defaultMessage="Follow" />}>
            <svg
              onClick={() => {
                onFollow(false, false);
              }}
              className="icon follow_icon"
              aria-hidden="true"
            >
              <use xlinkHref="#icon-unfollow" />
            </svg>
          </Tooltip>
        )}
        <span className="follow_num">{`[${numFollowed || 0}]`}</span>
      </span>
    );
  }

  return (
    <div className={classnames(styles.followBtn, styles[size], 'follow-btn')}>
      <div className="btns_box">
        {isFollowing && (
          <div className="btn_box">
            <Button
              className="marked_btn btn"
              onClick={() => {
                onFollow(true, true);
              }}
            >
              <div className={styles.left}>
                <FM id="aminer.person.following" defaultMessage="Following" />
              </div>
              {withNum && !!numFollowed && <span className="count">{numFollowed}</span>}
            </Button>
          </div>
        )}

        {!isFollowing && (
          <div className="btn_box mark_btn_box">
            <div>
              <Button
                className="mark_btn btn"
                onClick={() => {
                  onFollow(false, false);
                }}
              >
                <div className={styles.left}>
                  {/* <i className={classnames('fa fa-plus', styles.icon)} /> */}
                  <FM id="aminer.person.follow" defaultMessage="Follow" />
                </div>
                {withNum && !!numFollowed && <span className="count">{numFollowed}</span>}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default component(
  connect(({ auth, collection }, { entity }) => ({
    user: auth.user,
    isFollow: collection?.collectionMap[entity.id],
  })),
)(FollowBtn);
