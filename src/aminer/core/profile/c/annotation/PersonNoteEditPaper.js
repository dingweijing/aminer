import React, { } from 'react';
import { connect, component } from 'acore';
import PropTypes from 'prop-types';
import { formatMessage } from 'locales';
import { AutoForm } from 'amg/ui/form';
import { message } from 'antd';
import moment from 'moment';
import styles from './PersonNoteEditPaper.less';

const formSchema = [
  {
    name: 'notes_paper',
    label: '论文',
    type: 'textarea',
    autoSize: true,
    labelStyle: 'labelText',
  }
]

const PersonNoteEditPaper = props => {
  const { pid, dispatch, afterEdit, user } = props;
  const { notes_paper, notes_paper_time, notes_paper_user, ...rest } = props.note || {}
  const Submit = ({ notes_paper }, { setSubmitting }) => {
    setSubmitting(false);
    const doPaper = notes_paper && notes_paper.trim().replace(/\n/g, '<br>')
    dispatch({
      type: 'editProfile/SetNotesToPerson',
      payload: {
        id: pid,
        op: '2',
        notes_paper: doPaper,
      }
    }).then((res) => {
      if (res && res.succeed) {
        message.success(formatMessage({ id: 'aminer.common.success', defaultMessage: 'Success' }))
        afterEdit({
          ...rest,
          notes_paper: doPaper,
          notes_paper_time: new Date(),
          notes_paper_user: user.name,
        })
      }
    }).catch((error) => {
      message.error(formatMessage({ id: 'aminer.common.error', defaultMessage: 'Error' }))
    })
  }

  return (
    <div className={styles.personNoteEditPaper}>
      <AutoForm
        config={formSchema}
        data={{
          notes_paper: notes_paper && notes_paper.replace(/<br>/g, '\n'),
        }}
        onSubmit={Submit}
      />
      {
        notes_paper_user && (
          <div className={styles.timeAndUser}>
            <span className={styles.text}>
              {`${notes_paper_user} ${moment(notes_paper_time).format('YYYY-MM-DD')}`}
            </span>
          </div>
        )
      }

    </div>
  )
}

PersonNoteEditPaper.propTypes = {
};

PersonNoteEditPaper.defaultProps = {

}

export default component(connect(({ auth }) => ({
  user: auth.user,
})))(PersonNoteEditPaper)
