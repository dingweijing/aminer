import React from 'react';
import { Layout } from 'aminer/layouts';
import { Login } from 'aminer/core/auth/c';
import { Link } from 'acore';
import { FM, formatMessage } from 'locales';
import HeaderLeftZone from '../../../layouts/header/HeaderLeftZone';
import styles from './index.less';

const LoginPage = () => {

  // const signInByCKCEST = () => {
  //   if (window) {
  //     const url = `https://sso.ckcest.cn/login?service=https://api.aminer.cn/api/auth/ckcestauth/signin?forward=${window.location.protocol}//${window.location.host}/ckcest/sso`
  //     window.open(url, '_blank', 'width=1230,height=710,menubar=no,toolbar=no,status=no,scrollbars=no,resizable=yes,directories=no,status=no,location=no');
  //   }
  // }

  // const renderLogToReg = () => (
  //   <div className={styles.logToReg}>
  //     <Link to="/signup" className={styles.linkToReg}>
  //       <svg className="icon linkIcon" aria-hidden="true">
  //         <use xlinkHref="#icon-arrow" />
  //       </svg>
  //       <FM id="aminer.login.register" />
  //     </Link>
  //   </div>
  // )

  return (
    <Layout rightZone={[]} showSidebar={false} showNav className='home'>
      <article className={styles.article}>
        <section className={styles.content}>
          <Login page />
        </section>
      </article>
    </Layout>
  )
};

export default LoginPage;
