import React from 'react';
import { Link, FormCreate, page } from 'acore';
import { FM, formatMessage } from 'locales';
import { Button, Row, Form, Input, Checkbox, Tabs } from 'antd';
import { sysconfig } from 'systems';
import EmailRetrieve from './retrieve/EmailRetrieve'
import PhoneRetrieve from './retrieve/PhoneRetrieve'
import styles from './Login.less';

const TabPane = Tabs.TabPane;

const Retrieve = props => {
  return (
    <div className={styles.loginContainer}>
      <Tabs defaultActiveKey="email" animated={false} size='large'>
      {/* <Tabs defaultActiveKey="phone" animated={false} size='large'> */}
        <TabPane
          tab={formatMessage({ id: 'aminer.login.reset.email', defaultMessage: 'Sign In' })}
          key="email"
        >
          <EmailRetrieve {...props} />
        </TabPane>
        <TabPane
          tab={formatMessage({ id: 'aminer.login.reset.phone', defaultMessage: 'Quick Login' })}
          key="phone"
        >
          <PhoneRetrieve {...props} />
        </TabPane>
      </Tabs>
    </div>
  )
}


export default page(
  FormCreate(),
)(Retrieve)
