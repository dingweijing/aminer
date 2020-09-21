import React from 'react';
import { component, connect } from 'acore';
import PropTypes from 'prop-types';
import { FM, formatMessage } from 'locales'
import { isLogin, isRoster } from 'utils/auth';
import { classnames } from 'utils';
import { Button, message } from 'antd';
import { AutoForm } from 'amg/ui/form';
import ResumeCard from '../ResumeCard';
import styles from './resume.less';

const formSchema = [
  {
    name: 'experience',
    label: '',
    type: 'textarea',
    autoSize: true,
  }
]

const PersonExperienceCompile = props => {
  const { experience, user, dispatch, pid, afterEdit, cancleEdit, onlyEdit, oldWork } = props;

  const Submit = data => {
    const work = data.experience && data.experience.trim().replace(/\n/g, '<br>')
    const fields = []
    if (work !== (experience && experience.replace(/\n/g, '<br>'))) {
      fields.push({
        field: 'profile.work',
        value: work
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
      if (work || (!work && !oldWork)) {
        afterEdit(work)
      } else {
        afterEdit(oldWork)
      }
    }).catch((error) => {
      message.error(formatMessage({ id: 'aminer.common.error', defaultMessage: 'Error' }))
    })
  }

  const onCancle = () => {
    if (cancleEdit) {
      cancleEdit()
    }
  }

  return (
    <div className={styles.personMerge}>
      <AutoForm
        config={formSchema}
        data={{ experience: experience && experience.replace(/<br>/g, '\n') }}
        onSubmit={Submit}
      />
    </div>
  )
}

PersonExperienceCompile.propTypes = {
  experience: PropTypes.string
};

PersonExperienceCompile.defaultProps = {

}

export default component(connect(({ auth }) => ({
  user: auth.user,
  roles: auth.roles,
})))(PersonExperienceCompile)
