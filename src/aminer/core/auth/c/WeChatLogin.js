import React, { useEffect } from 'react';
import { connect } from 'acore';
import { Layout } from 'aminer/layouts';
import { Spin } from 'aminer/components/ui';

const WeChatLogin = (props) => {

  const { location, dispatch } = props;

  useEffect(() => {
    cbUrl()
  }, []);

  const cbUrl = () => {
    const { query } = location || {}
    const { code } = query;
    if (code) {
      dispatch({
        type: 'auth/wechatLogin',
        payload: { code }
      })
    } else {
      // 登录失败
    }
  }
  // /wechatlogin?callback=&code=061rrYm12KA65U08Cpn12SqYm12rrYmf&state=STATE

  return (
    <Layout>
      <Spin loading={true} size="big" />
    </Layout>
  )
}


export default connect()(WeChatLogin)
