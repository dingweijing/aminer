import React, { useState, useEffect } from 'react';
import { component, connect } from 'acore';
import PropTypes from 'prop-types';
import { FM, formatMessage } from 'locales'
import { isLogin, isRoster, isLockAuth, isBianYiGeToken } from 'utils/auth';
import { classnames } from 'utils';
import { Modal } from 'antd';
import PersonExperienceCompile from './PersonExperienceCompile';
import ResumeCard from '../ResumeCard';
import styles from './resume.less';
import moment from 'moment';

const PersonExperience = props => {
  const { experience = '', user, dispatch, pid, lock, onlyEdit, work } = props;
  const [edit, setEdit] = useState(false);
  const [editExperience, setEditExperience] = useState('');
  const [oldWork, setOldWork] = useState('');

  useEffect(() => {
    let experienceValue = initExperience()
    experienceValue = experienceValue && experienceValue.join('<br>')
    setOldWork(experienceValue)
    work ? setEditExperience(work) : setEditExperience(experienceValue)
  }, [experience])

  const initExperience = () => {
    let experienceValue = []
    experienceValue = experience && experience.map(item => {
      let date = item.date || {}, aff = item.aff || {};
      let inst = aff.inst || {}, dept = aff.dept || {};
      const { n: instN = '', n_zh: instN_zh = '' } = inst
      const { n: deptN = '', n_zh: deptN_zh = '' } = dept
      if (instN || instN_zh) {
        return `${date.s ? moment(date.s).format('YYYY-MM') : ''}${date.e ? ` - ${moment(date.e).format('YYYY-MM')}` : ''} ${instN || instN_zh} ${deptN || deptN_zh}`
      }
      return ''
    })
    return experienceValue && experienceValue.filter(n => n)
  }

  const showLogin = () => {
    dispatch({ type: 'modal/login' })
  }
  const toggleEdit = () => {
    setEdit(!edit)
  }
  const afterEdit = data => {
    setEditExperience(data)
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
      title={formatMessage({ id: 'aminer.person.experience', defaultMessage: 'Education' })}
      leftIcon={
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-graduation-cap" />
        </svg>
      }
    >
      {!edit && !onlyEdit && (
        <>
          {isLogin(user) && editExperience && (
            <div className={styles.education} dangerouslySetInnerHTML={{ __html: editExperience }} />
          )}
          {isLogin(user) && !editExperience && (
            <div className={styles.education}>
              <FM id="aminer.common.none" defaultMessage="None" />
            </div>
          )}
          {!isLogin(user) && (
            <div onClick={showLogin}
              className={classnames(styles.education)}
            >
              <span className={styles.login}>
                <FM id="aminer.common.loginview" defaultMessage="Sign in to view more" />
              </span>
            </div>
          )}
        </>
      )}
      {(edit || onlyEdit) && (
        <PersonExperienceCompile onlyEdit={onlyEdit} pid={pid} experience={editExperience} oldWork={oldWork} afterEdit={afterEdit} cancleEdit={toggleEdit} />
      )}
    </ResumeCard>
  )
}

PersonExperience.propTypes = {

};

PersonExperience.defaultProps = {

}

export default component(connect(({ auth }) => ({
  user: auth.user,
  roles: auth.roles,
})))(PersonExperience)
