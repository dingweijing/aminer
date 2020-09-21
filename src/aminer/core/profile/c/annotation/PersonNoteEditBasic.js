import React, { } from 'react';
import { connect, component } from 'acore';
import PropTypes from 'prop-types';
import { formatMessage } from 'locales';
import { AutoForm } from 'amg/ui/form';
import { message } from 'antd';
import moment from 'moment';
import styles from './PersonNoteEditBasic.less';

const formSchema = [
  {
    name: 'baseInfo',
    type: 'show',
    labelStyle: 'labelText',
    render: () => (
      <span>基本信息 : <span className="prompt_message">（请点击未找到的信息）</span></span>
    )
  },
  {
    wrapperStyle: 'threeInOne',
    children: [
      {
        name: 'notes_email',
        type: 'checkbox',
        text: '邮箱',
        editorStyle: 'forkCheck',
      },
      {
        name: 'notes_phone',
        type: 'checkbox',
        text: '联系电话',
        editorStyle: 'forkCheck',
      },
      {
        name: 'notes_homepage',
        type: 'checkbox',
        text: '主页',
        editorStyle: 'forkCheck',
      },
      {
        name: 'notes_avatar',
        type: 'checkbox',
        text: '头像',
        editorStyle: 'forkCheck',
      },
      {
        name: 'notes_company',
        type: 'checkbox',
        text: '单位',
        editorStyle: 'forkCheck',
      },
      {
        name: 'notes_pubs',
        type: 'checkbox',
        text: '教育背景',
        editorStyle: 'forkCheck',
      },
    ]
  },
  {
    name: 'notes_other',
    label: '其他',
    labelStyle: 'labelText',
    type: 'textarea',
    autoSize: true,
  },
]

const changeDataType = data => {
  return !!Number(data)
}

const PersonNoteEditBasic = props => {
  const { pid, dispatch, afterEdit, user } = props;

  const { old_user, notes_other, notes_email, notes_phone, notes_homepage, notes_avatar, notes_company,
    notes_pubs, notes_time, notes_user, ...rest } = props.note || {}
  const initialData = {
    notes_email: changeDataType(notes_email),
    notes_phone: changeDataType(notes_phone),
    notes_homepage: changeDataType(notes_homepage),
    notes_avatar: changeDataType(notes_avatar),
    notes_company: changeDataType(notes_company),
    notes_pubs: changeDataType(notes_pubs),
    notes_other: notes_other && notes_other.replace(/<br>/g, '\n'),
  }

  const Submit = (data, { setSubmitting }) => {
    setSubmitting(false);
    const { notes_other, notes_email, notes_phone, notes_homepage, notes_avatar, notes_company, notes_pubs } = data
    const doOther = notes_other && notes_other.trim().replace(/\n/g, '<br>')
    const info = {
      notes_other: doOther,
      notes_email: notes_email ? '1' : '0',
      notes_phone: notes_phone ? '1' : '0',
      notes_homepage: notes_homepage ? '1' : '0',
      notes_avatar: notes_avatar ? '1' : '0',
      notes_company: notes_company ? '1' : '0',
      notes_pubs: notes_pubs ? '1' : '0',
    }

    dispatch({
      type: 'editProfile/SetNotesToPerson',
      payload: {
        id: pid,
        op: '1',
        ...info,
      }
    }).then((res) => {
      if (res && res.succeed) {
        message.success(formatMessage({ id: 'aminer.common.success', defaultMessage: 'Success' }))
        afterEdit({
          ...rest,
          ...info,
          notes_time: new Date(),
          notes_user: user.name,
        })
      }
    }).catch((error) => {
      message.error(formatMessage({ id: 'aminer.common.error', defaultMessage: 'Error' }))
    })
  }
  
  return (
    <div className={styles.personNoteEditBasic}>
      <AutoForm
        config={formSchema}
        data={initialData}
        onSubmit={Submit}
      />
      {
        (notes_user || old_user) && (
          <div className={styles.timeAndUser}>
            <span className={styles.text}>
              {`${notes_user || old_user} ${notes_user ? moment(notes_time).format('YYYY-MM-DD') : ''}`}
            </span>
          </div>
        )
      }
    </div>
  )
}

PersonNoteEditBasic.propTypes = {
  // note: PropTypes.string
};

PersonNoteEditBasic.defaultProps = {

}

export default component(connect(({ auth }) => ({
  user: auth.user,
})))(PersonNoteEditBasic)
