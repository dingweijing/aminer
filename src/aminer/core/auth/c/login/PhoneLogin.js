import React, { useState, useEffect, useRef } from 'react';
import { connect, FormCreate, component, history } from 'acore';
import { FM, formatMessage } from 'locales';
import { Button, Row, Form, Input, Select, Checkbox } from 'antd';
import { getLangLabel } from 'helper';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import styles from './Login.less';

const PhoneLogin = props => {
  const [ready, setReady] = useState(true);
  const prevReady = useRef();
  const { form, error, dispatch, page } = props;
  const { getFieldDecorator, getFieldsError, validateFieldsAndScroll, setFieldsValue } = form;

  useEffect(() => {
    const errs = getFieldsError(['area', 'userPhone', 'phonePassword']);
    let newReady = true;
    for (const f in errs) {
      if (errs[f] !== undefined) {
        newReady = false;
      }
    }
    setReady(newReady);
  })

  const handleSubmit = e => {
    e.preventDefault();
    const { href } = window.location;
    validateFieldsAndScroll(['area', 'userPhone', 'phonePassword', 'persist'], (errors, value) => {
      const { area, userPhone, phonePassword, persist } = value;
      if (!errors) {
        dispatch({ type: 'auth/initLoginForm' });
        dispatch({ type: 'auth/login', payload: { email: `${area}${userPhone}@phone.aminer.cn`, password: phonePassword, persist: persist || false, pathname: href } });
      }
    })
  }

  const onShowRegister = () => {
    history.push('/signup');
    if (!page) {
      dispatch({ type: 'modal/close' })
    }
    // if (page) {
    //   history.push('/signup')
    // } else {
    //   dispatch({ type: 'modal/register' })
    // }
  }

  const onShowForget = () => {
    history.push('/forgotpassword')
    if (!page) {
      dispatch({ type: 'modal/close' })
    }
  }

  const checkChinaPhone = () => {
    const { area, userPhone } = props.form.getFieldsValue(['area', 'userPhone']);
    if (!userPhone) {
      return false
    }
    if (area && area === '+86' && !(/^1[3456789]\d{9}$/.test(userPhone))) {
      return false
    }
    return true;
  }


  const phoneValidator = (rule, value, callback) => {
    console.log('------------------------', value);
    const result = /^[0-9]*$/.test(value);
    const isRight = checkChinaPhone();
    console.log('phoneValidator', isRight);
    if (result && isRight) {
      callback();
    } else {
      callback(formatMessage({ id: 'aminer.regiest.phone.right', defaultMessage: 'Please enter vaild phone number' }));
    }
  }



  return (
    <Form onSubmit={handleSubmit} layout='vertical' autoComplete="off">
      <Row className={styles.formContent}>
        <div className={styles.phoneInput}>
          <Form.Item className={styles.phoneAreaSelect}>
            {getFieldDecorator('area', { initialValue: '+86' })(
              <Select dropdownMatchSelectWidth={false} showArrow={false}>
                {sysconfig.phone_area && sysconfig.phone_area.map((item, index) => (<Select.Option key={`${item.value}${index}`} value={item.value}>{item.value} {'('}{getLangLabel(item.en, item.zh)}{')'}</Select.Option>))}
              </Select>
            )}
          </Form.Item>
          <Form.Item className={styles.formItem}>
            {getFieldDecorator('userPhone', {
              validateTrigger: 'onBlur',
              validateFirst: true,
              rules: [
                { required: true, message: formatMessage({ id: 'aminer.login.phone.require' }) },
                { min: 7, max: 11, message: formatMessage({ id: 'aminer.regiest.phone.right', defaultMessage: 'Please enter vaild phone number' }) },
                { validator: phoneValidator }
              ]
            })(
              <Input
                placeholder={formatMessage({ id: 'aminer.login.login.phone', defaultMessage: 'Phone' })}
                onPressEnter={handleSubmit}
              />)}
          </Form.Item>
        </div>

        {/* <div style={{ marginTop: '20px' }} /> */}
        <Form.Item className={styles.formItem}>
          {getFieldDecorator('phonePassword', {
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
        <div style={{ marginTop: '20px' }} />
        <Form.Item>
          {getFieldDecorator('persist', {
            valuePropName: 'checked',
            initialValue: false,
          })(
            <Checkbox>{formatMessage({ id: 'aminer.login.signin.stay', defaultMessage: 'Stay signed in' })}</Checkbox>
          )}
          <span className={styles.forgot} onClick={onShowForget}>
            <FM id="aminer.login.password.forgot" defaultMessage="Forgot password" />
          </span>
        </Form.Item>
        <p className={styles.error}>{error || ''}</p>
        <Form.Item className={styles.formItem}>
          <Button className={classnames(styles.loginBtn, { [styles.ready]: ready, fullBtn: !page }, 'loginBtn')} onClick={handleSubmit}>
            {formatMessage({ id: 'aminer.login.signin', defaultMessage: 'Sign In' })}
          </Button>
        </Form.Item>
        <span className={styles.signUpBtn} onClick={onShowRegister}>
          {`->${formatMessage({ id: 'aminer.login.signup', defaultMessage: 'Sign Up' })}`}
        </span>
      </Row>
    </Form>
  )
}

export default component(connect(({ auth }) => ({ error: auth.error })))(PhoneLogin);
