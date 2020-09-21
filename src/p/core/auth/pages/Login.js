import React, { useEffect, useState } from 'react';
import { connect, page, FormCreate, Link } from 'acore';
import { Button, Form, Row, Input, Icon, Modal } from 'antd';
import { theme } from 'themes';
import { sysconfig } from 'systems';
import { FM } from 'locales';
import { Layout } from 'layouts';
import styles from './Login.less';


const pageTitle = sysconfig.PageTitle;

const thepage = props => {
  const { dispatch, form, roles, error, loading } = props;
  const { getFieldDecorator, validateFieldsAndScroll } = form;

  const [type, setType] = useState('account');

  // const onTabChange = (tab) => {
  //   this.setState({ tab });
  // };

  const handleOk = () => {
    form.validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        dispatch({ type: 'auth/initLoginForm' });
        dispatch({ type: 'auth/login', payload: { ...values, type } })
          .then(data => {
            console.log('KKKKK', data);
          });
      }
    });
  };


  // const applyUser = () => {
  //   // TODO kill ccf.
  //   Modal.info({
  //     title: '新用户申请',
  //     content: (
  //       <div>
  //         <div>请联系系统管理员</div>
  //         <div className={styles.emailLogin}>xiayu@ccf.org.cn</div>
  //       </div>
  //     ),
  //     onOk() {
  //     },
  //   });
  // };


  return (
    <Layout
      searchZone={[]}
      showNavigator={false}
      showSidebar={false}
      logoZone={[]}
    >
      <div className={styles.loginPage}>
        <h1 className={styles.loginTitle}>{sysconfig.PageTitle}</h1>
        {theme.LoginPage_bgImg &&
          <img src={theme.LoginPage_bgImg} className={styles.bgImg} />
        }
        <Form layout="vertical">
          <Row className={styles.formHeader}>
            <h1>
              <FM id="login.header" defaultMessage="Login" />
              {process.env.NODE_ENV !== 'production' && (
                <span className={styles.loginSource}>
                  {typeof pageTitle === 'string' ? pageTitle : pageTitle(sysconfig.Locale)}
                </span>
              )}
            </h1>
          </Row>
          <Row className={styles.formContent}>
            <Form.Item hasFeedback>
              {getFieldDecorator('email',
                { rules: [{ required: true, message: '邮箱不能为空' }] },
              )(
                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                  onPressEnter={handleOk}
                  placeholder="邮箱" size="large"
                // onChange={this.clearErrorMessage.bind(this)}
                />)}
            </Form.Item>
            <Form.Item hasFeedback>
              {getFieldDecorator('password',
                { rules: [{ required: true, message: '密码不能为空' }] },
              )(
                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                  type="password" placeholder="密码不能为空"
                  size="large" onPressEnter={handleOk}
                // onChange={this.clearErrorMessage.bind(this)}
                />)}
            </Form.Item>
            <Form.Item>
              {error && (
                <div className={styles.errors}>
                  {error}
                </div>
              )}
              <Button type="primary" size="large" onClick={handleOk}
                loading={loading} className={styles.loginBtn}>
                <FM id="login.loginBtn" defaultMessage="Login" />
              </Button>
            </Form.Item>

            {sysconfig.show_UserSelf_Signup && (
              <Form.Item>
                <Link to="/auth/singin">
                  <Button type="primary" size="large" className={styles.loginBtn}>
                    注册
                  </Button>
                </Link>
              </Form.Item>
            )}

            <Form.Item>
              <div className={styles.forgetpw}>
                <Link to="/auth/forgotpwd" className={styles.forgotpwbtn}>
                  <FM id="login.forgetPw" defaultMessage="Forget Password?" />
                </Link>

                {sysconfig.ApplyUserBtn && (
                  {
                    /* <span className={styles.applyUserbtn} onClick={this.applyUser}>
                                        <FM id="login.newUserApplication"
                                          defaultMessage="New user application" />
                                      </span> */
                  }
                )}

                {sysconfig.ShowIndependentRegister && (
                  <span className={styles.applyUserbtn}>
                    <Link to="/auth/singin" className={styles.forgotpwbtn}>
                      注册
                    </Link>
                  </span>
                )}

              </div>
            </Form.Item>

          </Row>
        </Form>
      </div>

    </Layout>
  );
};

export default page(
  connect(({ auth }) => {
    const { roles, error, loading } = auth;
    return { roles, error, loading };
  }),
  FormCreate(),
  // Auth,
)(thepage);
