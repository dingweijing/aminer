import React, { useEffect, useState } from 'react';
import { connect, component } from 'acore';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { isLogin, isLockAuth, isRoster, isPeekannotationlog } from 'utils/auth';
import { formatMessage, FM } from 'locales';
import PersonNoteEditBasic from './PersonNoteEditBasic';
import PersonNoteEditPaper from './PersonNoteEditPaper';
import ResumeCard from '../ResumeCard';
import styles from '../resume/resume.less';

const PersonNote = props => {
  const { pid, dispatch, user, lock } = props;
  const [editNote, setEditNote] = useState('');

  let unmounted = false;


  const GetNotesFromPerson = () => {
    dispatch({ type: 'profile/GetNotesFromPerson', payload: { id: pid } })
      .then(data => {
        const old_user = data && data.keyValues && data.keyValues.note_op_user && data.keyValues.note_op_user.name
        const {note, notes = {}} = data && data.items && data.items[0] && data.items[0].profile || {};
        if (!unmounted && notes) {
          notes.notes_other = notes.notes_other !== undefined ? notes.notes_other : note
          notes.old_user = old_user
          setEditNote(notes)
        }
      })
  }

  useEffect(() => {
    if (pid && (isRoster(user) || isPeekannotationlog(user))) {
      GetNotesFromPerson()
    }
    return () => { unmounted = true; }
  }, [pid])

  const afterEdit = data => {
    setEditNote(data)
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
      condition={isUserEdit}
      enableEdit={false}
      title={formatMessage({ id: 'aminer.person.note', defaultMessage: 'Note' })}
      leftIcon={
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-book1" />
        </svg>
      }
    >
      <PersonNoteEditBasic pid={pid} note={editNote} afterEdit={afterEdit} />
      <PersonNoteEditPaper pid={pid} note={editNote} afterEdit={afterEdit} />
    </ResumeCard >

  )
}

// PersonNote.propTypes = {
//   note: PropTypes.string
// };

// PersonNote.defaultProps = {

// }

export default component(connect(({ auth }) => ({
  user: auth.user,
})))(PersonNote)
