import React, { useState } from 'react'
import { connect, history, FormCreate, component } from 'acore';
import { Button, Row, Form, Input, Select, Modal, notification } from 'antd';
import { FM, formatMessage } from 'locales';
import { getLangLabel } from 'helper';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import styles from './Retrieve.less';

const PhoneRetrieve = (props) => {
  const { form, dispatch, onCloseModal, page, captchaError } = props;
  const { getFieldDecorator, getFieldsError, validateFieldsAndScroll, getFieldsValue } = form;

  const [sendCodeReady, setSendCodeReady] = useState(true);
  const [sendCodeTiming, setSendCodeTiming] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    validateFieldsAndScroll(['area', 'phone', 'captcha', 'password', 'passwordComfirm'],(errors, values) => {
      const { area, phone, captcha, password } = values;
      if (errors) {
        return;
      }
      dispatch({
        type: 'auth/resetMobileUserPass',
        payload: { email: `${area}${phone}@phone.aminer.cn`, sms_code: captcha, pass: password }
      }).then((data) => {
        if (data.succeed) {
          onCloseModal && onCloseModal()
          onShowLogin()
          notification.success({
            message: formatMessage({ id: 'aminer.common.success', defaultMessage: 'Success!' }),
            description: formatMessage({ id: 'aminer.login.reset.phone.success', defaultMessage: 'You have successfully reset your password' })
          });
        }
      }).catch(err => {
        notification.error({
          message: formatMessage({ id: 'aminer.common.error', defaultMessage: 'Error!' }),
          description: formatMessage({ id: 'aminer.login.reset.phone.incorrect', defaultMessage: 'Mobile number is incorrect' }),
        });
      })
    });
  }

  const onShowLogin = () => {
    if (page) {
      history.push(`/login`)
    } else {
      dispatch({ type: 'modal/login' })
    }
  }

  const passwordComfirmValidator = (rule, value, callback) => {
    const {password, passwordComfirm} = getFieldsValue(['password', 'passwordComfirm']);
    if (password !== passwordComfirm) {
      callback(formatMessage({ id: 'aminer.login.password.again.right', defaultMessage: 'Passwords entered twice are inconsistent' }))
    } else {
      callback()
    }
  }

  const sendCaptcha = () => {
    if (!sendCodeReady) return;
    const { area, phone } = getFieldsValue(['area', 'phone']);

    dispatch({
      type: 'auth/getCaptcha',
      payload: { area, phone }
    }).then(data => {
      if (data === true) {
        freeze60sec();
      }
    })
  }

  const freeze60sec = () => {
    let count = 60;
    let timer;
    setSendCodeReady(false);
    timer = setInterval(() => {
      setSendCodeTiming(count);
      count -= 1;
      if (count <= 0) {
        clearInterval(timer);
        setSendCodeReady(true);
        setSendCodeTiming(false);
      }
    }, 1000);
  }

  const phoneValidator = async (rule, value, callback) => {
    const res = await checkPhone();
    if (res && !res.status) {
      callback(formatMessage({ id: 'aminer.regiest.phone.exist', defaultMessage: 'Phone number already exist' }))
      if (sendCodeReady) setSendCodeReady(false);
    } else {
      callback()
      if (!sendCodeTiming && !sendCodeReady) setSendCodeReady(true);
    }
  }

  const checkPhone = async () => {
    const { area, phone } = getFieldsValue(['area', 'phone']);
    if (!phone) {
      return false
    }
    const res = await dispatch({ type: 'auth/checkEmail', payload: { email: `${area}${phone}@phone.aminer.cn` } })
    return res;
  }

  return (
    <Form onSubmit={handleSubmit} layout="vertical">
      <Row className={styles.formContent}>
        <div className={styles.phoneInput}>
          <Form.Item className={styles.phoneAreaSelect}>
            {getFieldDecorator('area', { initialValue: '+86' })(
              <Select dropdownMatchSelectWidth={false}>
                {sysconfig.phone_area && sysconfig.phone_area.map((item, index) => (<Select.Option key={`${item.value}${index}`} value={item.value}>{item.value} {'('}{getLangLabel(item.en, item.zh)}{')'}</Select.Option>))}
              </Select>
            )}
          </Form.Item>
          <Form.Item className={styles.formItem}>
            {getFieldDecorator('phone', {
              rules: [
                { required: true, message: formatMessage({ id: 'aminer.login.phone.require' }) },
              ]
            })(
              <Input
                placeholder={formatMessage({ id: 'aminer.login.phone', defaultMessage: 'Phone number' })}
              />
            )}
          </Form.Item>
        </div>
        <div className={styles.marginGap}/>
        <Form.Item className={styles.formItem}>
          {getFieldDecorator('captcha', {
            rules: [
              { required: true, message: formatMessage({ id: 'aminer.login.code.require' }) },
            ]
          })(
            <div className={styles.sendCodeWrap}>
              <Input
                className={styles.codeInput}
                placeholder={formatMessage({ id: 'aminer.login.login.code', defaultMessage: 'Code' })}
              />
              <Button className={classnames(styles.sendCodeBtn, { [styles.ready]: sendCodeReady })} onClick={sendCaptcha}>
                {sendCodeTiming ? `${formatMessage({id: 'aminer.login.login.code.get.again'})}（${sendCodeTiming}s）` : formatMessage({ id: 'aminer.login.login.code.get', defaultMessage: 'Get the captcha' })}
              </Button>
              {captchaError && (<div className={styles.error}>{captchaError}</div>)}
            </div>
          )}
        </Form.Item>
        <div className={styles.marginGap}/>
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
            <Input.Password placeholder={formatMessage({ id: 'aminer.login.password', defaultMessage: 'Password' })} />
          )}
        </Form.Item>
        <div className={styles.marginGap}/>

        <Form.Item className={styles.formItem}>
          {getFieldDecorator('passwordComfirm', {
            validateTrigger: 'onBlur',
            // validateFirst: true,
            rules: [
              { required: true, message: formatMessage({ id: 'aminer.login.password.again.require', defaultMessage: 'Please input your password again' })},
              { message: formatMessage({ id: 'aminer.login.password.again.right', defaultMessage: 'Passwords entered twice are inconsistent' })},
              { validator: passwordComfirmValidator }
            ]
          })(
            <Input.Password placeholder={formatMessage({ id: 'aminer.login.password.again.require', defaultMessage: 'Please input your password again' })} />
          )}
        </Form.Item>
        <div className={styles.marginGap}/>
        <Form.Item className={styles.formItem}>
          <Button className={classnames(styles.loginBtn)} onClick={handleSubmit}>
          <FM id="aminer.login.password.reset" defaultMessage="Reset password" />
          </Button>
        </Form.Item>
        <span className={styles.signinBtn} onClick={onShowLogin}>
          {`-> ${formatMessage({ id: 'aminer.login.reset.back', defaultMessage: 'Back to sign in' })}`}
        </span>
      </Row>
    </Form>
  )
}

export default connect(({ auth }) => ({ captchaError: auth.captchaError }))(PhoneRetrieve)
