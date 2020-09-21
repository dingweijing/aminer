import React from 'react';
import { connect, component, Link } from 'acore';
import { sysconfig } from 'systems'
import { FM } from 'locales'
import { classnames } from 'utils';
import * as profileUtils from 'utils/profile-utils';
import styles from './InfoCard.less';

const InfoCard = props => {
  // const infoEl = useRef();
  // useImperativeHandle(ref, () => infoEl.current);

  const { user, className } = props;
  const userLink = user && user.raw_info && user.raw_info.bind ? profileUtils.getProfileUrl(user.name, user.raw_info.bind) : '/dashboard/findyourself'

  const logout = () => {
    const { dispatch } = props;
    dispatch({ type: 'auth/logout' });
    localStorage.removeItem(`lc_${sysconfig.SYSTEM}_me-data`)
  }

  if (!user) {
    return false;
  }

  const renderEmail = email => {
    let em = ''
    if (email && email.includes('@phone.aminer.cn')) {
      em = email.replace('@phone.aminer.cn', '')
    } else if (email) {
      em = email
    }
    return em;
  }

  return (
    <div className={classnames('user_info_card', styles.infoCard, styles[className])}>
      <div className="top">
        <div className="image">
          <Link to={userLink}>
            <img src={profileUtils.getAvatar(user.avatar, user.id, 80)} alt="" />
          </Link>
        </div>

        <div className="info">
          <p className="name">
            <Link to={userLink}>
              {user.name || ''}
            </Link>
          </p>
          <p className="email">
            <Link to={userLink}>
              {renderEmail(user.email)}
            </Link>
          </p>

        </div>
      </div>
      <div className="logout" onClick={logout}>
        <FM id="aminer.common.logout" defaultMessage="Logout" />
      </div>
    </div>
  )
}

export default component(connect(({ auth }) => ({ user: auth.user })))(InfoCard)
