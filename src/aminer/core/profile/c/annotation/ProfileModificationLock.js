import React, { useEffect, useState, useMemo, memo } from 'react';
import classnames from 'classnames';
import consts from 'consts';
import { connect, component } from 'acore';
import { Tooltip, Modal, message } from 'antd';
import { FM, formatMessage } from 'locales';
import { isLogin, isRoster, isLockAuth } from 'utils/auth';

const ProfileModificationLock = props => {
  const { dispatch, user, pid, lock } = props;
  const [isLock, setIsLock] = useState(props.lock);
  const userIsRoster = isRoster(user)

  useEffect(() => {
    setIsLock(lock);
  }, [pid, lock])

  const isUserEdit = () => {
    if (isLockAuth(user)) {
      return true
    }
    Modal.error({
      content: '无修改权限'
    })
    return false;
  }

  const UpsertPersonAnnotation = () => {
    if (!isUserEdit()) {
      return;
    }
    dispatch({
      type: 'editProfile/UpsertPersonAnnotation',
      payload: {
        id: pid,
        force_update: true,
        fields: [{
          field: 'is_lock',
          value: !isLock
        }]
      }
    }).then(() => {
      message.success('修改锁定状态成功');
      window.location.reload();
      // setIsLock(!isLock)
    })
  }

  // useEffect(() => {
  //   if (pid && user && userIsRoster) {
  //     UpsertPersonAnnotation();
  //   }
  // }, [pid])

  return (
    <Tooltip placement="top" title="Profile edit is disabled.">
      <svg className="icon lock" aria-hidden="true" onClick={UpsertPersonAnnotation}>
        <use xlinkHref={isLock ? '#icon-suo' : '#icon-suo1'} />
      </svg>
    </Tooltip>
  );
}

export default component(connect(({ auth }) => ({
  user: auth.user,
})))(ProfileModificationLock)
