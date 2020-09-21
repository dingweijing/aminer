import React from 'react';
import { Layout } from 'aminer/layouts';
import { Forget } from 'aminer/core/auth/c';
import { Link } from 'acore';
import { FM, formatMessage } from 'locales';
import HeaderLeftZone from '../../../layouts/header/HeaderLeftZone';
import styles from './index.less';

const ForgetPage = () => {

  return (
    <Layout rightZone={[]} showSidebar={false} className='home'>
      <article className={styles.article}>
        <section className={styles.content}>
          <Forget page />
        </section>
      </article>
    </Layout>
  )
};

export default ForgetPage;
