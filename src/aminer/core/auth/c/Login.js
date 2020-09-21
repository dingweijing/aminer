import React, { PureComponent } from 'react';
import { connect, Link, FormCreate, withRouter } from 'acore';
import { FM, formatMessage } from 'locales';
import { Tabs } from 'antd';
import { sysconfig } from 'systems';
import classnames from 'classnames';
import consts from 'consts';
import EmailLogin from './login/EmailLogin'
import PhoneLogin from './login/PhoneLogin'
import styles from './Login.less';

const TabPane = Tabs.TabPane;
@withRouter
@FormCreate()
@connect()
class LoginModal extends PureComponent {

  state = {

  }

  clearError = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'auth/initLoginForm' });
  }

  signInByCKCEST = () => {
    if (window) {
      const url = `https://sso.ckcest.cn/login?service=https://api.aminer.cn/api/auth/ckcestauth/signin?forward=${window.location.protocol}//${window.location.host}/ckcest/sso`
      window.open(url, '_blank', 'width=1230,height=710,menubar=no,toolbar=no,status=no,scrollbars=no,resizable=yes,directories=no,status=no,location=no');
    }
  }

  signInByWechat = () => {
    console.log('ptops', this.props);
    const { location } = this.props || {};
    const { query } = location || {};
    const { callback } = query || {};
    // router.push({
    //   pathname: '/wechatlogin',
    //   query: {
    //     cb: callback,
    //   },
    // })
    const cbUrl = `https://www.aminer.cn/wechatlogin?callback=${callback}`
    const url = `https://open.weixin.qq.com/connect/qrconnect?appid=wxb232d145fe483574&redirect_uri=${cbUrl}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`
    if (window) {
      window.location.href = url
    }
  }

  render() {
    const { page } = this.props;
    return (
      <>
        <div className={styles.loginContainer}>
          <div className={classnames(styles.loginContainerLeft, { hiddenLeft: !page }, 'loginContainerLeft')}>
            <span className={styles.imgTopWord}>AMiner，<FM id="aminer.login.img.word" /></span>
            <img src={`${consts.ResourcePath}/sys/aminer/layout/register_img1.png`} />
            <span className={styles.imgBottomWord}>Turina. Alan M. "Sovable and unsolvable problems." Science News-ens. fr 39 (1954).</span>
          </div>
          <div className={classnames(styles.loginContainerRight, { fullRight: !page }, 'loginContainerRight')}>
            {/* <EmailLogin {...this.props} /> */}
            <Tabs defaultActiveKey="phone" animated={false} size='large' onChange={this.clearError}>
              <TabPane
                tab={formatMessage({ id: 'aminer.login.signin.phone', defaultMessage: 'Quick Login' })}
                key="phone"
              >
                <PhoneLogin {...this.props} />
              </TabPane>
              <TabPane
                tab={formatMessage({ id: 'aminer.login.signin.email', defaultMessage: 'Sign In' })}
                key="email"
              >
                <EmailLogin {...this.props} />
              </TabPane>
            </Tabs>
          </div>
        </div>
        <div className={classnames(styles.otherLogin, { autoOther: !page }, 'otherLogin')}>
          <div className={styles.otherLoginTip}>{'- '}<FM id='aminer.login.signin.other' defaultMessage='Or sign in using' />{' -'}</div>
          <div className={styles.loginItem}>
            <div className={classnames(styles.loginItemImg, styles.wechat)} onClick={this.signInByWechat}>
              <svg className={classnames(styles.wechatlogin, 'icon')} aria-hidden="true">
                <use xlinkHref="#icon-weixin" />
              </svg>
            </div>
            <div className={classnames(styles.loginItemImg, styles.ckcest)} onClick={this.signInByCKCEST}>
              <svg className={classnames(styles.ckcestlogin, 'icon')} aria-hidden="true">
                <use xlinkHref="#icon-gcysvg" />
              </svg>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default LoginModal;

/*

*/
