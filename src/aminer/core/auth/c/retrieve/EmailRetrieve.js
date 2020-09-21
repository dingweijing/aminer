import React from 'react'
import { connect, history, FormCreate, component } from 'acore';
import { Button, Row, Form, Input, Modal, notification } from 'antd';
import { FM, formatMessage } from 'locales';
import { sysconfig } from 'systems';
import { classnames } from 'utils';
import styles from './Retrieve.less';

const EmailRetrieve = (props) => {
  const { form, dispatch, onCloseModal, page } = props;
  const { getFieldDecorator, getFieldsError, validateFieldsAndScroll } = form;

  const handleSubmit = (e) => {
    e.preventDefault();
    validateFieldsAndScroll(['email'], (errors, values) => {
      const { email } = values;
      if (errors) {
        return;
      }
      dispatch({ 
        type: 'auth/resetPw', 
        payload: { identifier: email, password: ' ' } 
      }).then(({ status, message }) => {
        if (status) {
          if (onCloseModal) {
            onCloseModal();
          }
          onShowLogin()
          notification.success({
            message: formatMessage({ id: 'aminer.common.success', defaultMessage: 'Success!' }),
            description: formatMessage({ id: 'aminer.login.reset.checkemail', defaultMessage: 'Please check your e-mail' }),
          })
        } else {
          const second = message && message.indexOf('_') !== -1 && message.split('_')[1]
          notification.error({
            message: formatMessage({ id: 'aminer.login.reset.fast', defaultMessage: 'Frequency Limit Exceeded:' }),
            description: `${formatMessage({ id: 'aminer.login.reset.please', defaultMessage: 'Please try again' })} ${second} ${formatMessage({ id: 'aminer.login.reset.retry', defaultMessage: 'seconds later' })}`,
          });
        }
      }).catch(err => {
        notification.error({
          message: formatMessage({ id: 'aminer.common.error', defaultMessage: 'Error!' }),
          description: formatMessage({ id: 'aminer.login.reset.incorrect', defaultMessage: 'E-mail address is incorrect' }),
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
  
  return (
    <Form onSubmit={handleSubmit} layout="vertical">
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

export default connect()(EmailRetrieve)
