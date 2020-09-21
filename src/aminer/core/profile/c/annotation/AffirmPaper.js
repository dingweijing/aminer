import React, { useEffect, useState } from 'react';
import { connect, component } from 'acore';
import PropTypes from 'prop-types';
import { formatMessage } from 'locales'
import { Switch, Modal } from 'antd';
import { isLockAuth } from 'utils/auth';
import ResumeCard from '../ResumeCard';
import styles from '../resume/resume.less';


const initVerifyDA = (aid, data) => {
  let isFlag = false;
  if (data && data.length > 0) {
    data.forEach(flag => {
      if (flag.person_id === aid && flag.flag === 'affirm_author') {
        isFlag = true
      }
    })
  }
  return isFlag;
}


const AffirmPaper = props => {
  const { flags, pid, aid, dispatch, afterConfirmPaper, user, lock, isStar } = props;

  const [affirm, setAffirm] = useState(initVerifyDA(aid, flags))
  let unmounted = false;


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

  useEffect(() => {
    return () => {
      unmounted = true;
    }
  }, [])

  const affirmPub = () => {
    if (!isUserEdit()) {
      return;
    }
    dispatch({ type: 'aminerCommon/Track', payload: { pid, aid, assign: !affirm } })
    dispatch({ type: 'editProfile/AffirmPubToPerson', payload: { pid, aid, assign: !affirm } })
      .then(res => {
        if (res && !unmounted) {
          setAffirm(!affirm);
          if (afterConfirmPaper) {
            afterConfirmPaper()
          }
        }
      })
  }

  return (
    <div className={styles.note}>
      <span>论文确认: </span>
      <Switch disabled={isStar} onClick={affirmPub} checked={affirm}
        checkedChildren="Yes" unCheckedChildren="No"
      />
      {/* {affirm && (<span onClick={affirmPub}>Yes</span>)}
      {!affirm && (<span onClick={affirmPub}>No</span>)} */}
    </div>
  )
}

AffirmPaper.propTypes = {

};

AffirmPaper.defaultProps = {

}


export default component(connect(({ auth }) => ({
  user: auth.user,
  roles: auth.roles,
})))(AffirmPaper)
