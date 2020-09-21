import React from 'react'
import { Layout } from 'aminer/layouts';
import { Button, Row, Form, Input, Select, Modal, notification } from 'antd';
import { Link, page, FormCreate, connect, history } from 'acore';
import { FM, formatMessage } from 'locales';
import { classnames } from 'utils';
import helper from 'helper';
import styles from './index.less';

// 邮箱账号重置密码
const RetrievePage = (props) => {
  const { form, dispatch } = props;
  const { getFieldDecorator, getFieldsError, validateFieldsAndScroll, getFieldsValue } = form;


  const { email, src, token } = helper.parseUrlParam(props, {}, ['email', 'src', 'token']);
  console.log('email, src, token', email, src, token);

  const handleSubmit = (e) => {
    e.preventDefault();
    validateFieldsAndScroll(['password', 'passwordComfirm'],(errors, values) => {
      const { password, passwordComfirm } = values;
      if (errors) {
        return;
      }
      dispatch({
        type: 'auth/retrievePw',
        payload: { identifier: email, token, password }
      }).then((status) => {
        if (status) {
          history.push(`/login`)
          notification.success({
            message: formatMessage({ id: 'aminer.common.success', defaultMessage: 'Success!' }),
            description: formatMessage({ id: 'aminer.retrieve.success', defaultMessage: 'Password set successfully' })
          });
        }
      }).catch(err => {
        notification.error({
          message: formatMessage({ id: 'aminer.common.error', defaultMessage: 'Error!' }),
          description: formatMessage({ id: 'aminer.retrieve.error', defaultMessage: 'Please try again later' }),
        });
      })
    });
  }

  const passwordComfirmValidator = (rule, value, callback) => {
    const {password, passwordComfirm} = getFieldsValue(['password', 'passwordComfirm']);
    if (password !== passwordComfirm) {
      callback(formatMessage({ id: 'aminer.login.password.again.right', defaultMessage: 'Passwords entered twice are inconsistent' }))
    } else {
      callback()
    }
  }


  return (
    <Layout rightZone={[]} showSidebar={false} className='home'>
      <article className={styles.article}>
        <section className={styles.content}>
          <div className={styles.loginHeader}>
            <div className={styles.registerTip1}><FM id='aminer.retrieve.tip1'/></div>
          </div>
          <div className={styles.retrieveContainer}>
            <Form onSubmit={handleSubmit} layout="vertical">
              <Row className={styles.formContent}>
                <div className={styles.email}>
                  <FM id='aminer.login.email' />{': '}{email}
                </div>
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
              </Row>
            </Form>
          </div>
        </section>
      </article>
    </Layout>
  )
}

export default page(
  FormCreate(),
  connect(),
)(RetrievePage)
