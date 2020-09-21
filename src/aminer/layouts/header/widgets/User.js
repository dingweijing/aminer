import React from 'react';
import { connect, component } from 'acore';
import { classnames } from 'utils';
import * as profileUtils from 'utils/profile-utils';
import styles from './User.less';

const User = props => {
  const { user, className } = props;

  return (
    <div
      className={classnames('user_avatar', styles.profile, styles[className], {
        [styles.login]: user,
      })}
    >
      {user && <img src={profileUtils.getAvatar(user.avatar, user.id, 30)} alt="" />}
      {!user && (
        <svg className="icon default_icon" aria-hidden="true">
          {className === 'home' && <use xlinkHref="#icon-me" />}
          {className !== 'home' && <use xlinkHref="#icon-profile" />}
        </svg>
      )}
    </div>
  );
};

export default component(connect(({ auth }) => ({ user: auth.user })))(User);
