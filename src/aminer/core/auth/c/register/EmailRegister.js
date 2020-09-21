import React, { PureComponent } from 'react';
import { connect, history, FormCreate } from 'acore';
import { Link } from 'acore';
import { FM, formatMessage } from 'locales';
import classnames from 'classnames';
import { Button, Row, Form, Input, Checkbox, Select, Modal } from 'antd';
import styles from './Register.less';


@FormCreate()
@connect()
class EmailRegister extends PureComponent {
  state = {
    ready: true
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const errs = nextProps.form.getFieldsError(['email', 'first_name', 'last_name', 'emailGender', 'emailPosition', 'sub']);
    let newReady = true;
    for (const f in errs) {
      if (errs[f] !== undefined) {
        newReady = false
      }
    }
    const changes = {}
    if (newReady !== prevState.ready) {
      changes.ready = newReady
    }
    return changes;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, form, onCloseModal } = this.props;
    form.validateFieldsAndScroll(['email', 'first_name', 'last_name', 'emailGender', 'emailPosition', 'sub'], async (errors, values) => {
      const { email, first_name, last_name, emailGender, emailPosition, sub } = values;
      const params = {
        email, first_name: first_name || '', last_name: last_name || '',
        gender: emailGender - 0, position: emailPosition - 0, sub: sub || false
      }
      if (!errors) {
        dispatch({ type: 'auth/createUser', payload: { ...params } })
          .then((data) => {
            console.log('data', data)
            if (data.status) {
              onCloseModal && onCloseModal()
              this.onShowLogin()
              Modal.success({
                title: formatMessage({ id: 'aminer.common.success', defaultMessage: 'Success!' }),
                content: formatMessage({ id: 'aminer.regiest.success.tip', defaultMessage: 'Please receive a mail in your email box for initializing your account. \n Note that the mail may be left in trash box.' })
              });
            }
          })
      }
    });
  }

  emailValidator = async (rule, value, callback) => {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    // const res = await this.wait(this.checkEmail, 800);
    const res = await this.checkEmail();
    if (res && !res.status) {
      callback(formatMessage({ id: 'aminer.regiest.email.exist', defaultMessage: 'Email not exist' }))
    } else {
      callback()
    }
  }

  wait = (fun, time) => {
    return new Promise((reslove, reject) => {
      this.timer = setTimeout(async () => {
        const res = await fun();
        reslove(res)
      }, time)
      reject('timeout');
    }).catch((error) => {
      console.error(error);
    })
  }

  checkEmail = async () => {
    const { dispatch, form } = this.props;
    const { getFieldValue } = form;
    const email = getFieldValue('email');
    if (!email) {
      return false
    }
    const res = await dispatch({ type: 'auth/checkEmail', payload: { email } })
    return res;
  }

  agreeValidator = (rule, value, callback) => {
    if (value) {
      callback()
    } else {
      callback(formatMessage({ id: 'aminer.regiest.terms.read', defaultMessage: 'Please check the Terms and Conditions' }))
    }
  }

  onShowLogin = () => {
    const { dispatch, page } = this.props;
    if (page) {
      history.push(`/login`)
    } else {
      dispatch({ type: 'modal/login' })
    }
  
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { ready } = this.state;
    return (
      <Form layout="vertical" onSubmit={this.handleSubmit} autoComplete="off">
        <Row className={styles.formContent}>
          <Form.Item className={styles.formItem}>
            {getFieldDecorator('email', {
              validateTrigger: 'onBlur',
              validateFirst: true,
              rules: [
                { required: true, message: formatMessage({ id: 'aminer.login.email.require' }) },
                { message: formatMessage({ id: 'aminer.regiest.email.right', defaultMessage: 'Please enter vaild email' }), pattern: /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/ },
                { validator: this.emailValidator }
              ]
            })(
              <Input placeholder={formatMessage({ id: 'aminer.login.email', defaultMessage: 'Email' })} />)}
          </Form.Item>
          <div className={styles.marginGap}/>

          <div className={styles.formItemRow}>
            <Form.Item className={styles.formItem}>
              {getFieldDecorator('first_name', {
                rules: [
                  { required: true, message: formatMessage({ id: 'aminer.login.firstname.require' }) },
                ]
              })(
                <Input
                  placeholder={formatMessage({ id: 'aminer.regiest.firstname', defaultMessage: 'First Name' })}
                />)}
            </Form.Item>
            <Form.Item className={styles.formItem}>
              {getFieldDecorator('last_name', {
                rules: [
                  { required: true, message: formatMessage({ id: 'aminer.login.lastname.require' }) },
                ]
              })(
                <Input
                  placeholder={formatMessage({ id: 'aminer.regiest.lastname', defaultMessage: 'Last Name' })}
                />)}
            </Form.Item>
          </div>
          <div className={styles.marginGap}/>

          <div className={styles.formItemRow}>
            <Form.Item className={styles.formItem}>
              {getFieldDecorator('emailGender', {
                rules: [{ required: true, message: formatMessage({ id: 'aminer.regiest.gender.require', defaultMessage: 'Please select your gender' }) }],
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'aminer.regiest.gender', defaultMessage: 'Gender' })}
                >
                  <Select.Option value="0" disabled>
                    {formatMessage({ id: 'aminer.regiest.gender', defaultMessage: 'Gender' })}
                  </Select.Option>
                  <Select.Option value="1">
                    {formatMessage({ id: 'aminer.regiest.gender.male', defaultMessage: 'Male' })}
                  </Select.Option>
                  <Select.Option value="2">
                    {formatMessage({ id: 'aminer.regiest.gender.female', defaultMessage: 'Female' })}
                  </Select.Option>
                  <Select.Option value="3">
                    {formatMessage({ id: 'aminer.regiest.gender.notanswer', defaultMessage: 'Prefer not to answer' })}
                  </Select.Option>
                </Select>
              )}
            </Form.Item>

            <Form.Item className={styles.formItem}>
              {getFieldDecorator('emailPosition', {
                rules: [{ required: true, message: formatMessage({ id: 'aminer.regiest.position.require', defaultMessage: 'Please select your position' }) }],
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder={formatMessage({ id: 'aminer.regiest.position', defaultMessage: 'Position' })}
                >
                  <Select.Option value="0" disabled>
                    {formatMessage({ id: 'aminer.regiest.position', defaultMessage: 'Position' })}
                  </Select.Option>
                  <Select.Option value="1">
                    {formatMessage({ id: 'aminer.regiest.position.professor', defaultMessage: 'Professor' })}
                  </Select.Option>
                  <Select.Option value="2">
                    {formatMessage({ id: 'aminer.regiest.position.associate', defaultMessage: 'Associate Professor' })}
                  </Select.Option>
                  <Select.Option value="3">
                    {formatMessage({ id: 'aminer.regiest.position.assistant', defaultMessage: 'Assistant Professor' })}
                  </Select.Option>
                  <Select.Option value="4">
                    {formatMessage({ id: 'aminer.regiest.position.researcher', defaultMessage: 'Researcher' })}
                  </Select.Option>
                  <Select.Option value="5">
                    {formatMessage({ id: 'aminer.regiest.position.postdoc', defaultMessage: 'PostDoc' })}
                  </Select.Option>
                  <Select.Option value="6">
                    {formatMessage({ id: 'aminer.regiest.position.phd', defaultMessage: 'Phd Student' })}
                  </Select.Option>
                  <Select.Option value="7">
                    {formatMessage({ id: 'aminer.regiest.position.master', defaultMessage: 'Master Student' })}
                  </Select.Option>
                  <Select.Option value="8">
                    {formatMessage({ id: 'aminer.regiest.position.other', defaultMessage: 'Other' })}
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          </div>
          <div className={styles.marginGap}/>

          <Form.Item className={styles.formItem}>
            {getFieldDecorator('sub')(
              <Checkbox defaultChecked={true}>
                {formatMessage({ id: 'aminer.regiest.receive', defaultMessage: 'I want to receive news and special offers' })}
              </Checkbox>
            )}
          </Form.Item>
          {/* <Form.Item className={styles.formItem}>
            {getFieldDecorator('emailAgree', {
              rules: [
                { validator: this.agreeValidator }
              ]
            })(
              <Checkbox defaultChecked={false}>
                {`${formatMessage({ id: 'aminer.regiest.agree', defaultMessage: 'I agree with the' })} ${formatMessage({ id: 'aminer.regiest.terms', defaultMessage: 'Terms and Conditions' })}`}
              </Checkbox>
            )}
          </Form.Item> */}

          <Form.Item className={styles.formItem}>
            <Button className={classnames(styles.loginBtn, { [styles.ready]: ready })} htmlType="submit">
              {formatMessage({ id: 'aminer.login.register', defaultMessage: 'Register' })}
            </Button>
          </Form.Item>
          <span className={styles.signinBtn} onClick={this.onShowLogin}>
            {`-> ${formatMessage({ id: 'aminer.login.register.signin', defaultMessage: 'Already have an account, login directly.' })}`}
          </span>
        </Row>
      </Form>
    )
  }
}

export default EmailRegister
