import React from 'react';
import { component, connect } from 'acore';
import PropTypes from 'prop-types';
import { FM, formatMessage } from 'locales';
import { isLogin, isRoster } from 'utils/auth';
import { classnames } from 'utils';
import { AutoForm } from 'amg/ui/form';
import { Input, Button, message } from 'antd';
// import ResumeCard from '../ResumeCard';
import styles from './resume.less';

const formSchema = [
  {
    name: 'bio',
    label: '',
    type: 'textarea',
    autoSize: true,
    // rules: [
    //   {
    //     required: true,
    //     message: formatMessage({
    //       id: 'aminer.person.edit.bio.empty',
    //       defaultMessage: 'Please Enter Bio'
    //     })
    //   },
    //   // { validator: validatefun },
    // ]
    // validator: { type: 'text', required: true, message: "BIO!" },
  }
]

const PersonBioEdit = props => {
  const { bio, user, dispatch, pid, afterEdit, cancleEdit, onlyEdit } = props;
  const Submit = data => {
    const b = data.bio && data.bio.trim().replace(/\n/g, '<br>')
    const fields = []
    if (b !== (bio && bio.replace(/\n/g, '<br>'))) {
      fields.push({
        field: 'profile.bio',
        value: b
      })
    }

    dispatch({
      type: 'editProfile/UpsertPersonAnnotation',
      payload: {
        id: pid,
        fields,
        force_update: true
      }
    }).then(() => {
      message.success(formatMessage({ id: 'aminer.common.success', defaultMessage: 'Success' }))
      afterEdit(b)
    }).catch((error) => {
      message.error(formatMessage({ id: 'aminer.common.error', defaultMessage: 'Error' }))
    })
  }

  const onCancle = () => {
    if (cancleEdit) {
      cancleEdit()
    }
  }

  // if (!bio && bio !== '') {
  //   return false;
  // }

  return (
    <AutoForm
      // className={styles.aform}
      config={formSchema}
      data={{ bio: bio && bio.replace(/<br>/g, '\n') }}
      mode="edit"
      onSubmit={Submit}
    />
  )
}

PersonBioEdit.propTypes = {
  bio: PropTypes.string
};

PersonBioEdit.defaultProps = {

}

export default component(connect(({ auth }) => ({
  user: auth.user,
  roles: auth.roles,
})))(PersonBioEdit)
