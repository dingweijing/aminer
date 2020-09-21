import React, { useState, useEffect } from 'react';
import { component, connect } from 'acore';
import PropTypes from 'prop-types';
import { FM, formatMessage } from 'locales'
import { isLogin, isRoster, isLockAuth, isBianYiGeToken } from 'utils/auth';
import { classnames } from 'utils';
import { Modal } from 'antd';
import PersonEducationEdit from './PersonEducationEdit';
import ResumeCard from '../ResumeCard';
import styles from './resume.less';

const PersonEducation = props => {
  const { education, user, dispatch, pid, lock, onlyEdit } = props;
  const [edit, setEdit] = useState(false);

  const [editEducaton, setEditEducaton] = useState(education);

  useEffect(() => {
    setEditEducaton(education)
  }, [education])

  const showLogin = () => {
    dispatch({ type: 'modal/login' })
  }
  const toggleEdit = () => {
    setEdit(!edit)
  }
  const afterEdit = data => {
    setEditEducaton(data)
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
      enableEdit={isRoster(user) && !onlyEdit && !isBianYiGeToken(user)}
      edit={edit}
      condition={isUserEdit}
      toggleEdit={toggleEdit}
      title={formatMessage({ id: 'aminer.person.education', defaultMessage: 'Education' })}
      leftIcon={
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-graduation-cap" />
        </svg>
      }
    >
      {!edit && !onlyEdit && (
        <>
          {isLogin(user) && editEducaton && (
            <div className={styles.education} dangerouslySetInnerHTML={{ __html: editEducaton }} />
          )}
          {isLogin(user) && !editEducaton && (
            <div className={styles.education}>
              <FM id="aminer.common.none" defaultMessage="None" />
            </div>
          )}
          {!isLogin(user) && (
            <div onClick={showLogin}
              className={classnames(styles.education_no)}
            >
              <span className={styles.login}>
                <FM id="aminer.common.loginview" defaultMessage="Sign in to view more" />
              </span>
            </div>
          )}
        </>
      )}
      {(edit || onlyEdit) && (
        <PersonEducationEdit onlyEdit={onlyEdit} pid={pid} education={editEducaton} afterEdit={afterEdit} cancleEdit={toggleEdit} />
      )}
    </ResumeCard>
  )
}

PersonEducation.propTypes = {
  education: PropTypes.string
};

PersonEducation.defaultProps = {

}

export default component(connect(({ auth }) => ({
  user: auth.user,
  roles: auth.roles,
})))(PersonEducation)
