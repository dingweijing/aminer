import React, { useState, useEffect, useRef } from 'react';
import { Link, FormCreate, page, connect, history } from 'acore';
import { FM, formatMessage } from 'locales';
import { Icon, Tabs } from 'antd';
import { sysconfig } from 'systems';
import EmailForget from './forget/EmailForget'
import PhoneForget from './forget/PhoneForget'
import styles from './Forget.less';

const TabPane = Tabs.TabPane;

const Forget = props => {
  const { dispatch } = props;
  let timer = null;
  let type = useRef();

  const [time, setTime] = useState(8)
  const [forgetSuccess, SetForgetSuccess] = useState(false)

  const clearError = () => {
    dispatch({ type: 'auth/initLoginForm' });
  }

  useEffect(() => {
    return () => {
      clearInterval(timer)
    };
  });

  if (forgetSuccess) {
    timer = setInterval(() => {
      console.log(time);
      if (time > 0) {
        setTime(time - 1)
      } else {
        clearInterval(timer)
        history.push('/login');
      }
    }, 1000)
  }

  const setForgetCallBack = (t) => {
    if (t) {
      type = 1
    } else {
      type = 0
    }
    SetForgetSuccess(true)
  }

  return (
    <div className={styles.fogetPwd}>
      {!forgetSuccess && <div className={styles.loginContainer}>
        <Tabs defaultActiveKey="phone" animated={false} size='large' onChange={clearError}>
          <TabPane
            tab={formatMessage({ id: 'aminer.login.reset.phone', defaultMessage: 'Quick Login' })}
            key="phone"
          >
            <PhoneForget {...props} SetForgetSuccess={setForgetCallBack} />
          </TabPane>
          <TabPane
            tab={formatMessage({ id: 'aminer.login.reset.email', defaultMessage: 'Sign In' })}
            key="email"
          >
            <EmailForget {...props} SetForgetSuccess={setForgetCallBack} />
          </TabPane>
        </Tabs>
      </div>}
      {forgetSuccess && <div className={styles.tips}>
        <Icon type="check-circle"
          style={{
            color: 'green',
            fontSize: 60,
            marginBottom: 30,
            display: 'block',
            textAlign: 'center'
          }}
        />
        {type && <p><FM id="aminer.login.reset.phone.success" defaultMessage="您以成功修改密码"></FM></p>}
        {!type && <p><FM id="aminer.login.reset.checkemail" defaultMessage="请您查看邮箱，通过邮件中链接重置密码。"></FM></p>}
        <p><FM id="aminer.login.reset.autojump" values={{ time }} /></p>
      </div>}
    </div>

  )
}


export default page(
  FormCreate(),
  connect(),
)(Forget)
