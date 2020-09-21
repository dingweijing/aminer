import React, { useState, useEffect, useRef } from 'react';
import { Button, message } from 'antd'
import { component, connect } from 'acore';
import { classnames } from 'utils'
import { AutoForm } from 'amg/ui/form';
import EbMemberTable from './EbMemberTable'
import styles from './EbMember.less'

const EbMember = props => {
  const formRef = useRef();

  const { dispatch, id } = props

  const [addMemberSwitch, setAddMemberSwitch] = useState(true);
  const [nameAble, setNameAble] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [memberList, setMemberList] = useState({});

  useEffect(() => {
    init();
  }, [id])

  const formSchema = [
    {
      name: 'email',
      type: 'email',
      label: 'E-mail',
      className: 'memberAutoForm emailStyle',
      onBlur: (value, check) => checkEmail(value, check),
    },
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      className: 'memberAutoForm',
      disabled: nameAble,
    },
    {
      name: 'perm',
      type: 'select',
      label: 'Access',
      className: 'memberAutoForm',
      config: {
        options: [
          { name: 'Browser', value: 1, },
          { name: 'Editor', value: 2, },
          { name: 'Manager', value: 3, },
          { name: 'Owner', value: 4, },
        ]
      }
    }
  ]

  const init = () => {
    dispatch({
      type: 'editEb/getEbMember',
      payload: { id }
    }).then(res => {
      setMemberList(res)
    })
  }

  const checkEmail = (value, check) => {
    let emailValue = ''
    setEmail(value.email)
    if (!check['email']) { emailValue = value.email }
    value.email && dispatch({
      type: 'editEb/checkEmail',
      payload: { email: emailValue, }
    }).then(res => {
      if (res && !res.status && res.name) {
        setName(res.name)
        setNameAble(true)
      } else if (res && res.status) {
        setNameAble(false)
        setName('')
      } else if (res) {
        setNameAble(true)
        setName('')
      }
    })
  }

  const addMemberEdit = (bool = false) => { setAddMemberSwitch(bool || !addMemberSwitch) }

  const SaveNote = (data, { setSubmitting }) => {
    // formRef.current.reset();
    setSubmitting(false);
    dispatch({
      type: 'editEb/setEbMember',
      payload: { data, id }
    }).then(res => {
      if (res) {
        message.success("成功添加成员。")
        reset && reset();
      } else {
        message.error("添加成员失败。")
      }
    })
  }

  const reset = () => {
    setName('');
    setEmail('');
    addMemberEdit(true);
    init();
  }

  return (
    <div className={styles.ebMember}>
      <Button type="primary" onClick={() => addMemberEdit()}>
        Add members
        <span className={addMemberSwitch ? 'arrowsOpen' : 'arrowsClose'} />
      </Button>
      {
        !addMemberSwitch && (
          <AutoForm
            ref={formRef}
            config={formSchema}
            data={{ email, name, perm: 1 }}
            onSubmit={SaveNote}
          />
        )
      }
      <div className={classnames('memberTitle')}>project members</div>
      <EbMemberTable memberList={memberList} id={id} reset={reset} />
    </div>
  )
}

export default component(connect())(EbMember)
