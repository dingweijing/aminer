import React from 'react';
import { Layout } from 'aminer/layouts';
import { Register } from 'aminer/core/auth/c';
import { FM, formatMessage } from 'locales';
import HeaderLeftZone from '../../../layouts/header/HeaderLeftZone';
import styles from './index.less';

const RegisterPage = () => {
  return (
    <Layout rightZone={[]} showSidebar={false} showNav className='home'>
      <article className={styles.article}>

        <section className={styles.content}>
          <div className={styles.loginHeader}>
            {/* <div className={styles.rightZone}>
              <Link to='/login' className={styles.signUpBtn}>
              {`-> ${formatMessage({ id: 'aminer.login.register.signin', defaultMessage: 'Already have an account, login directly.' })}`}
              </Link>
            </div> */}
            <div className={styles.registerTip1}><FM id='aminer.regiest.tip3' /></div>
            <div className={styles.registerTip2}><FM id='aminer.regiest.tip2' /></div>
          </div>
          <div className={styles.leftZone}>
            <span>{formatMessage({ id: 'aminer.regiest.tip1' })}</span>
            <span>{formatMessage({ id: 'aminer.regiest.tip2' })}</span>
            <span>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-search2" />
              </svg>
              {formatMessage({ id: 'aminer.regiest.tip4' })}
            </span>
            <span>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-emizhifeiji" />
              </svg>
              {formatMessage({ id: 'aminer.regiest.tip5' })}
            </span>
            <span>{formatMessage({ id: 'aminer.regiest.tip6' })}</span>
            <span>{formatMessage({ id: 'aminer.regiest.tip7' })}</span>
            <span>{formatMessage({ id: 'aminer.regiest.tip8' })}</span>
            <span>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-graduation-cap" />
              </svg>
              {formatMessage({ id: 'aminer.regiest.tip9' })}
            </span>
            <span>{formatMessage({ id: 'aminer.regiest.tip10' })}</span>
            <span>{formatMessage({ id: 'aminer.regiest.tip11' })}</span>
            <span>{formatMessage({ id: 'aminer.regiest.tip12' })}</span>
          </div>
          <Register page />
        </section>

      </article>
    </Layout>
  );
};

export default RegisterPage;
