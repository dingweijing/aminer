import React, { useEffect, useState } from 'react';
import { connect, component } from 'acore';
import PropTypes from 'prop-types';
import { formatMessage } from 'locales';
import { AutoForm } from 'amg/ui/form';
import { Button, message } from 'antd';
import ResumeCard from '../ResumeCard';
import styles from '../resume/resume.less';

const formSchema = [
  {
    name: 'note',
    label: '',
    type: 'textarea',
    autoSize: { minRows: 2 },
    // rules: [
    //   {
    //     required: true,
    //     message: formatMessage({
    //       id: 'aminer.person.edit.note.empty',
    //       defaultMessage: 'Please Enter Note'
    //     })
    //   },
    //   // { validator: validatefun },
    // ]
  }
]

const PersonNoteEdit = props => {
  const { note, pid, dispatch, afterEdit, cancleEdit, onlyEdit } = props;

  const Submit = data => {
    const n = data.note && data.note.trim().replace(/\n/g, '<br>')
    // const fields = []

    // if (n !== (note && note.replace(/\n/g, '<br>'))) {
    //   fields.push({
    //     field: 'profile.note',
    //     value: n
    //   })
    // }

    dispatch({
      type: 'editProfile/SetNoteToPerson',
      payload: {
        id: pid,
        note: n,
      }
    }).then(() => {
      message.success(formatMessage({ id: 'aminer.common.success', defaultMessage: 'Success' }))
      afterEdit(n)
    })
  }

  const onCancle = () => {
    if (cancleEdit) {
      cancleEdit()
    }
  }

  // if (!note && note !== '') {
  //   return false
  // }

  return (
    <AutoForm
      config={formSchema}
      data={{ note: note && note.replace(/<br>/g, '\n') }}
      onSubmit={Submit}
    />
  )
}

PersonNoteEdit.propTypes = {
  note: PropTypes.string
};

PersonNoteEdit.defaultProps = {

}

export default component(connect())(PersonNoteEdit)
