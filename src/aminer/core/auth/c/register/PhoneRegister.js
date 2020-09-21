import React, { PureComponent } from 'react';
import { connect, history, FormCreate } from 'acore';
import { FM, formatMessage } from 'locales';
import { getLangLabel } from 'helper';
import classnames from 'classnames';
import { Button, Row, Form, Input, Checkbox, Select, Modal } from 'antd';
import { sysconfig } from 'systems';
import styles from './Register.less';

@FormCreate()
@connect(({ auth }) => ({ captchaError: auth.captchaError }))
class PhoneRegister extends PureComponent {
  state = {
    ready: true,
    sendCodeReady: false,
    sendCodeTiming: false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // const errs = nextProps.form.getFieldsError(['area', 'phone', 'captcha', 'password', 'passwordComfirm', 'fname', 'lname', 'phoneGender', 'phonePosition', 'sub', 'phoneAgree']);
    const errs = nextProps.form.getFieldsError(['area', 'phone', 'captcha', 'password', 'passwordComfirm', 'fname', 'lname', 'sub']);
    const phone = nextProps.form.getFieldValue('phone');
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
    form.validateFieldsAndScroll(
      ['area', 'phone', 'captcha', 'password', 'passwordComfirm', 'fname', 'lname', 'sub'],
      async (errors, values) => {
        const { area, phone, captcha, password, fname, lname, sub } = values;
        const params = {
          phone: [`${area}${phone}`], email: `${area}${phone}@phone.aminer.cn`,
          pass: password, sms_code: captcha,
          fname: fname || '', lname: lname || '',
          name: `${fname || ''} ${lname || ''}`,
          sub: sub || false
        }
        // new createUser by phone
        if (!errors) {
          dispatch({
            type: 'auth/createMobileUser',
            payload: { ...params }
          }).then((data) => {
            console.log('## createMobileUser data', data)
            if (data.succeed) {
              onCloseModal && onCloseModal()
              this.onShowLogin()
              Modal.success({
                title: formatMessage({ id: 'aminer.common.success', defaultMessage: 'Success!' }),
                content: formatMessage({ id: 'aminer.regiest.phone.success.tip', defaultMessage: 'Your AMiner account sign up successfully!' })
              });
            }
          })
        }
      }
    );
  }

  phoneValidator = async (rule, value, callback) => {
    const { sendCodeReady, sendCodeTiming } = this.state;
    const isRight = this.checkChinaPhone();
    if (!isRight) {
      if (sendCodeReady) this.setState({ sendCodeReady: false })
      callback(formatMessage({ id: 'aminer.regiest.phone.right', defaultMessage: 'Please enter vaild phone number' }))
      return;
    }
    if (this.timer) {
      clearTimeout(this.timer)
    }
    const res = await this.checkPhone();
    if (res && !res.status) {
      callback(formatMessage({ id: 'aminer.regiest.phone.exist', defaultMessage: 'Phone number already exist' }))
      if (sendCodeReady) this.setState({ sendCodeReady: false })
    } else {
      callback()
      if (!sendCodeTiming && !sendCodeReady) this.setState({ sendCodeReady: true })
      this.props.dispatch({ type: 'auth/clearCaptchaError' });
    }
  }

  passwordComfirmValidator = (rule, value, callback) => {
    const { password, passwordComfirm } = this.props.form.getFieldsValue(['password', 'passwordComfirm']);
    if (password !== passwordComfirm) {
      callback(formatMessage({ id: 'aminer.login.password.again.right', defaultMessage: 'Passwords entered twice are inconsistent' }));
    } else {
      callback();
    }
  }

  passwordCheck = (rule, value, callback) => {
    const { password } = this.props.form.getFieldsValue(['password']);
    if (password && password.includes(' ')) {
      return false
    }
    return true
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

  checkChinaPhone = () => {
    const { area, phone } = this.props.form.getFieldsValue(['area', 'phone']);
    if (!phone) {
      return false
    }
    if (area && area === '+86' && !(/^1[3456789]\d{9}$/.test(phone))) {
      return false
    }
    if (phone.length < 7 || phone.length > 11) {
      return false
    }
    return true;
  }


  checkPhone = async () => {
    const { dispatch, form } = this.props;
    const { getFieldValue } = form;
    const { area, phone } = this.props.form.getFieldsValue(['area', 'phone']);
    if (!phone) {
      return false
    }
    const res = await dispatch({ type: 'auth/checkEmail', payload: { email: `${area}${phone}@phone.aminer.cn` } })
    return res;
  }

  sendCaptcha = () => {
    const { dispatch } = this.props;
    const { sendCodeReady } = this.state;
    if (!sendCodeReady) return;
    const { area, phone } = this.props.form.getFieldsValue(['area', 'phone']);

    dispatch({
      type: 'auth/getCaptcha',
      payload: { area, phone }
    }).then(data => {
      if (data === true) {
        this.freeze60sec();
      }
    })
  }

  freeze60sec = () => {
    let count = 60;
    let timer;
    this.setState({
      sendCodeReady: false
    })
    timer = setInterval(() => {
      this.setState({
        sendCodeTiming: count
      })
      count -= 1;
      if (count <= 0) {
        clearInterval(timer);
        const isRight = this.checkChinaPhone();
        if (!isRight) {
          this.setState({ sendCodeReady: false, sendCodeTiming: false })
        } else {
          this.setState({
            sendCodeReady: true,
            sendCodeTiming: false,
          })
        }
      }
    }, 1000);
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
    const { form, captchaError } = this.props;
    const { getFieldDecorator } = form;
    const { ready, sendCodeReady, sendCodeTiming } = this.state;
    return (
      <Form layout="vertical" onSubmit={this.handleSubmit} autoComplete="off">
        <Row className={styles.formContent}>
          <div className={styles.phoneInput}>
            <Form.Item className={styles.phoneAreaSelect}>
              {getFieldDecorator('area', { initialValue: '+86' })(
                <Select dropdownMatchSelectWidth={false} showArrow={false}>
                  {sysconfig.phone_area && sysconfig.phone_area.map((item, index) => (<Select.Option key={`${item.value}${index}`} value={item.value}>{item.value} {'('}{getLangLabel(item.en, item.zh)}{')'}</Select.Option>))}
                </Select>
              )}
            </Form.Item>
            <Form.Item className={styles.formItem} >
              {getFieldDecorator('phone', {
                validateTrigger: 'onBlur',
                validateFirst: true,
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'aminer.login.phone.require'
                    })
                  },
                  {
                    min: 7,
                    max: 11,
                    message: formatMessage({ id: 'aminer.regiest.phone.right', defaultMessage: 'Please enter vaild phone number' })
                  },
                  {
                    pattern: new RegExp(/^\d+$|^\d+[.]?\d+$/),
                    message: formatMessage({ id: 'aminer.regiest.phone.right', defaultMessage: 'Please enter vaild phone number' })
                  },
                  { validator: this.phoneValidator }
                ]
              })(
                <Input placeholder={formatMessage({ id: 'aminer.login.phone', defaultMessage: 'Phone number' })} />
              )}
            </Form.Item>
          </div>
          {/* <div className={styles.marginGap}/> */}
          <Form.Item className={styles.formItem}>
            {getFieldDecorator('captcha', {
              rules: [
                { required: true, message: formatMessage({ id: 'aminer.login.code.require' }) },
                {
                  pattern: new RegExp(/^\d+$|^\d+[.]?\d+$/),
                  min: 6,
                  message: formatMessage({ id: 'aminer.login.code.right' })
                },
                {
                  min: 6,
                  max: 6,
                  message: formatMessage({ id: 'aminer.login.code.right' })
                },
              ]
            })(
              <div className={styles.sendCodeWrap}>
                <Input
                  className={styles.codeInput}
                  placeholder={formatMessage({ id: 'aminer.login.login.code', defaultMessage: 'Code' })}
                />
                <Button className={classnames(styles.sendCodeBtn, { [styles.ready]: sendCodeReady })} onClick={this.sendCaptcha}>
                  {sendCodeTiming ? `${formatMessage({ id: 'aminer.login.login.code.get.again' })}（${sendCodeTiming}s）` : formatMessage({ id: 'aminer.login.login.code.get', defaultMessage: 'Get the captcha' })}
                </Button>
                {captchaError && (<div className={styles.error}>{captchaError}</div>)}
              </div>
            )}
          </Form.Item>
          {/* <div className={styles.marginGap}/> */}

          <Form.Item className={styles.formItem}>
            {getFieldDecorator('password', {
              rules: [{
                required: true,
                whitespace: true,
                message: formatMessage({
                  id: 'aminer.login.password.require',
                  defaultMessage: 'Please input your password'
                })
              },
              {
                validator: this.passwordCheck,
                message: formatMessage({
                  id: 'aminer.login.password.check',
                  defaultMessage: 'Password cannot contain whitespace'
                })
              },
              {
                min: 6,
                max: 16,
                message: formatMessage({
                  id: 'aminer.login.password.checkLength',
                  defaultMessage: 'Password length should be 6-16 characters'
                })
              }
              ]
            })(
              <Input.Password autoComplete="new-password" placeholder={formatMessage({ id: 'aminer.login.password', defaultMessage: 'Password' })} />
            )}
          </Form.Item>
          <div className={styles.marginGap} />

          <Form.Item className={styles.formItem}>
            {getFieldDecorator('passwordComfirm', {
              validateTrigger: 'onBlur',
              // validateFirst: true,
              rules: [
                { required: true, message: formatMessage({ id: 'aminer.login.password.again.require', defaultMessage: 'Please input your password again' }) },
                { message: formatMessage({ id: 'aminer.login.password.again.right', defaultMessage: 'Passwords entered twice are inconsistent' }) },
                { validator: this.passwordComfirmValidator }
              ]
            })(
              <Input.Password placeholder={formatMessage({ id: 'aminer.login.password.again.require', defaultMessage: 'Please input your password again' })} />
            )}
          </Form.Item>
          <div className={styles.marginGap} />

          <div className={styles.formItemRow}>
            <Form.Item className={styles.formItem}>
              {getFieldDecorator('fname', {
                rules: [
                  { required: true, message: formatMessage({ id: 'aminer.login.firstname.require' }) },
                ]
              })(
                <Input
                  placeholder={formatMessage({ id: 'aminer.regiest.firstname', defaultMessage: 'First Name' })}
                />)}
            </Form.Item>
            <Form.Item className={styles.formItem}>
              {getFieldDecorator('lname', {
                rules: [
                  { required: true, message: formatMessage({ id: 'aminer.login.lastname.require' }) },
                ]
              })(
                <Input
                  placeholder={formatMessage({ id: 'aminer.regiest.lastname', defaultMessage: 'Last Name' })}
                />)}
            </Form.Item>
          </div>
          <div className={styles.marginGap} />

          <div className={styles.formItemRow}>
            {/* <Form.Item className={styles.formItem}>
              {getFieldDecorator('phoneGender', {
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
            </Form.Item> */}

            {/* <Form.Item className={styles.formItem}>
              {getFieldDecorator('phonePosition', {
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
            </Form.Item> */}
          </div>
          <div className={styles.marginGap} />

          <Form.Item className={styles.formItem}>
            {getFieldDecorator('sub')(
              <Checkbox defaultChecked={true}>
                {formatMessage({ id: 'aminer.regiest.receive', defaultMessage: 'I want to receive news and special offers' })}
              </Checkbox>
            )}
          </Form.Item>
          {/* <Form.Item className={styles.formItem}>
            {getFieldDecorator('phoneAgree', {
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

export default PhoneRegister
