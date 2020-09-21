import React, { useState, useEffect } from 'react';
import { component, connect } from 'acore';
import PropTypes from 'prop-types';
import { FM, formatMessage } from 'locales';
import { isLogin, isLockAuth, isBianYiGeToken } from 'utils/auth';
import { classnames } from 'utils';
import StatusLabel from '../annotation/StatusLabel';
import PersonPassAway from './PersonPassAway';
import ResumeCard from '../ResumeCard';
import styles from './resume.less';

const PersonStatusLabel = props => {
  const { user, dispatch, pid, lock, onlyEdit, passawayData } = props;
  const {
    is_passedaway,
    can_burncandles,
    profile: passaway = {},
  } = passawayData || {};
  const [edit, setEdit] = useState(false);
  const { passaway_reason, passaway_year, passaway_month, passaway_day } = passaway || {};

  const showLogin = () => {
    dispatch({ type: 'modal/login' })
  }
  const toggleEdit = () => {
    setEdit(!edit)
  }
  const afterEdit = data => {
    setEdit(!edit)
  }
  const isUserEdit = () => {
    if (lock) {
      if (isLockAuth(user)) {
        Modal.error({
          content: '请解锁后修改'
        })
      } else {
        Modal.error({
          content: '信息已被锁不能修改，请联系 feedback@aminer.cn'
        })
      }
      return false;
    }
    return true
  }

  return (
    <ResumeCard
      enableEdit={isLogin(user) && !onlyEdit && !isBianYiGeToken(user)}
      edit={edit}
      condition={isUserEdit}
      toggleEdit={toggleEdit}
      title='牺牲状态'
      leftIcon={
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-dianziqikan" />
        </svg>
      }
    >
      {!edit && !onlyEdit && <PersonPassAway />}
      {(edit || onlyEdit) && passawayData && (
        // <AnnotationZone>
        <StatusLabel
          pid={pid}
          is_passedaway={is_passedaway}
          can_burncandles={can_burncandles}
        />
        // </AnnotationZone>
      )}
    </ResumeCard>
  )
}


export default component(connect(({ auth, editProfile }) => ({
  user: auth.user,
  roles: auth.roles,
  passawayData: editProfile.passawayData,
})))(PersonStatusLabel)
