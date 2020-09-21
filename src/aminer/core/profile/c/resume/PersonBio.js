import React, { useState, useEffect } from 'react';
import { component, connect } from 'acore';
import PropTypes from 'prop-types';
import { FM, formatMessage } from 'locales';
import { isLogin, isRoster, isLockAuth, isBianYiGeToken } from 'utils/auth';
import { classnames } from 'utils';
import { Modal } from 'antd';
import PersonBioEdit from './PersonBioEdit';
import ResumeCard from '../ResumeCard';
import styles from './resume.less';

const PersonBio = props => {
  const { bio, user, dispatch, pid, lock, onlyEdit } = props;
  const [edit, setEdit] = useState(false);

  const [editBio, setEditBio] = useState(bio);

  useEffect(() => {
    setEditBio(bio)
  }, [bio])

  // const showLogin = () => {
  //   dispatch({ type: 'modal/login' })
  // }
  const toggleEdit = () => {
    setEdit(!edit)
  }
  const afterEdit = data => {
    setEditBio(data)
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
      title={formatMessage({ id: 'aminer.person.bio', defaultMessage: 'Bio' })}
      leftIcon={
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-publications" />
        </svg>
      }
    >
      {!edit && !onlyEdit && (
        <>
          {editBio && (
            <div className={styles.bio} dangerouslySetInnerHTML={{ __html: editBio }} />
          )}
          {!editBio && (
            <div className={styles.bio}>
              <FM id="aminer.common.none" defaultMessage="None" />
            </div>
          )}
        </>
      )}
      {(edit || onlyEdit) && (
        <PersonBioEdit onlyEdit={onlyEdit} pid={pid} bio={editBio} afterEdit={afterEdit} cancleEdit={toggleEdit} />
      )}
    </ResumeCard>
  )
}

PersonBio.propTypes = {
  bio: PropTypes.string
};

PersonBio.defaultProps = {

}

export default component(connect(({ auth }) => ({
  user: auth.user,
  roles: auth.roles,
})))(PersonBio)
