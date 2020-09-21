import React, { PureComponent } from 'react';
import { connect, FormCreate } from 'acore';
import { FM, formatMessage } from 'locales';
import { Tabs } from 'antd';
import EmailRegister from './register/EmailRegister';
import PhoneRegister from './register/PhoneRegister';
import styles from './Register.less';

const TabPane = Tabs.TabPane;

@FormCreate()
@connect()
class Register extends PureComponent {
  state = {};

  clearError = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'auth/initLoginForm' });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.loginContainer}>
        {/* <EmailRegister {...this.props} /> */}
        <Tabs defaultActiveKey="phone" animated={false} size="large" onChange={this.clearError}>
          <TabPane
            tab={formatMessage({
              id: 'aminer.login.register.phone',
              defaultMessage: 'Quick Login',
            })}
            key="phone"
          >
            <PhoneRegister {...this.props} />
          </TabPane>
          <TabPane
            tab={formatMessage({ id: 'aminer.login.register.email', defaultMessage: 'Sign In' })}
            key="email"
          >
            <EmailRegister {...this.props} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Register;
