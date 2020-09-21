/**
 * Refactor by GaoBo 2019-04-09
 */
import React, { PureComponent, useEffect, useState, useRef } from 'react';
import { connect, history, FormCreate, component } from 'acore';
import { Button, Row, Form, Input, Checkbox } from 'antd';
import { FM, formatMessage } from 'locales';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
// import { DelayTrigger } from 'utils/action';
// import * as auth from 'utils/auth';
import styles from './Login.less';

// const { Auth_LoginPage } = sysconfig;

const EmailLogin = (props) => {
  // ------------------  disable trigger ------------------------------------------
  // 这里是DelayTrigger的用法，但是本文件中不需要用到这个。在其他地方用好后，删除本文v中的这些代码。

  // onChange event handler
  // onValidate = () => {
  // this.validateTrigger.trigger(); // 不需要每次onchange的时候就validate.
  // }

  // validateTriggerFunc = () => {
  //   const { form } = this.props;
  //   form.validateFieldsAndScroll(async (errors) => {
  //     this.setState({ ready: !errors });
  //   });
  // };
  // ------------------  disable trigger ------------------------------------------

  const [ready, setReady] = useState(true);
  const prevReady = useRef();
  const { form, error, dispatch, page } = props;
  const { getFieldDecorator, getFieldsError, validateFieldsAndScroll } = form;

  useEffect(() => {
    const errs = getFieldsError(['email', 'password']);
    let newReady = true;
    for (const f in errs) {
      if (errs[f] !== undefined) {
        newReady = false
      }
    }
    setReady(newReady);
  })

  // login form handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const { href } = window.location;
    validateFieldsAndScroll(['email', 'password', 'persist'], (errors, values) => {
      const { email, password, persist } = values;
      if (!errors) {
        dispatch({ type: 'auth/initLoginForm' });
        dispatch({ type: 'auth/login', payload: { email, password, persist: persist || false, pathname: href } });
      }
    });
  }

  const onShowRegister = () => {
    history.push('/signup')
    if (!page) {
      dispatch({ type: 'modal/close' })
    }
    // if (page) {
    //  history.push('/signup')
    // } else {
    //   dispatch({ type: 'modal/register' })
    // }
  }

  const onShowForget = () => {
    history.push('/forgotpassword');
    if (!page) {
      dispatch({ type: 'modal/close' })
    }
  }


  return (
    <Form onSubmit={handleSubmit} layout="vertical" autoComplete="off">
      <Row className={styles.formContent}>
        <Form.Item className={styles.formItem}>
          {getFieldDecorator('email', {
            rules: [
              { required: true, message: formatMessage({ id: 'aminer.login.email.require' }) },
              {
                message: formatMessage({
                  id: 'aminer.regiest.email.right',
                  defaultMessage: 'Please enter vaild email address'
                }),
                pattern: /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/
              }
            ]
          })(
            <Input placeholder={formatMessage({ id: 'aminer.login.email', defaultMessage: 'Email' })} onPressEnter={handleSubmit} />
          )}
        </Form.Item>

        <div style={{ marginTop: '20px' }} /> {/* TODO: Xiaoxuan, use styles. */}

        <Form.Item className={styles.formItem}>
          {getFieldDecorator('password', {
            rules: [{
              required: true,
              message: formatMessage({
                id: 'aminer.login.password.require',
                defaultMessage: 'Please input your password'
              })
            }]
          })(
            <Input.Password autoComplete="new-password" placeholder={formatMessage({ id: 'aminer.login.password', defaultMessage: 'Password' })} onPressEnter={handleSubmit} />
          )}
        </Form.Item>

        <div style={{ marginTop: '20px' }} /> {/* TODO: Xiaoxuan, use styles. */}

        <Form.Item>
          {getFieldDecorator('persist', {
            initialValue: false,
            valuePropName: 'checked'
          })(
            <Checkbox>
              <FM id="aminer.login.signin.stay" defaultMessage="Stay signed in" />
            </Checkbox>
          )}
          <span className={styles.forgot} onClick={onShowForget}>
            <FM id="aminer.login.password.forgot" defaultMessage="Forgot password" />
          </span>
        </Form.Item>
        <p className={styles.error}>{error || ''}</p>
        <Form.Item className={styles.formItem}>
          <Button className={classnames(styles.loginBtn, { [styles.ready]: ready, fullBtn: !page }, 'loginBtn')} onClick={handleSubmit}>
            <FM id="aminer.login.signin" defaultMessage="Sign In" />
          </Button>
        </Form.Item>
        <span className={styles.signUpBtn} onClick={onShowRegister}>
          {'-> '}<FM id="aminer.login.signup" defaultMessage="Sign Up" />
        </span>
      </Row>
    </Form>
  )
}

export default component(connect(({ auth }) => ({ error: auth.error })))(EmailLogin);
