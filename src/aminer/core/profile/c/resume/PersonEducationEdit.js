import React from 'react';
import { component, connect } from 'acore';
import PropTypes from 'prop-types';
import { formatMessage } from 'locales'
import { message } from 'antd';
import { AutoForm } from 'amg/ui/form';

const formSchema = [
  {
    name: 'education',
    label: '',
    type: 'textarea',
    autoSize: true,
  }
]

const PersonEducation = props => {
  const { education, dispatch, pid, afterEdit, cancleEdit } = props;

  const Submit = data => {
    const edu = data.education && data.education.trim().replace(/\n/g, '<br>')
    const fields = [];
    if (edu !== (education && education.replace(/\n/g, '<br>'))) {
      fields.push({
        field: 'profile.edu',
        value: edu
      })
    }
    dispatch({
      type: 'editProfile/UpsertPersonAnnotation',
      payload: {
        id: pid, fields,
        force_update: true
      }
    }).then(() => {
      message.success(formatMessage({ id: 'aminer.common.success' }));
      afterEdit(edu);
    }).catch((error) => {
      message.error(formatMessage({ id: 'aminer.common.error' }))
    })
  }

  return (
    <AutoForm
      config={formSchema}
      data={{ education: education && education.replace(/<br>/g, '\n') }}
      onSubmit={Submit}
    />
  )
}

PersonEducation.propTypes = {
  education: PropTypes.string
};

PersonEducation.defaultProps = {

}

export default component(connect())(PersonEducation)
