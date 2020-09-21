import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { connect, history, Link, page, withRouter } from 'acore';
import { classnames } from 'utils';
import { sysconfig } from 'systems';
import { isLogin } from 'utils/auth';
import { FM, formatMessage } from 'locales';
import { Layout } from 'aminer/layouts';
import { NE } from 'utils/compare';
import Annotation from './annotation';
import MyMasterReadingTree from './masterReadingTree';
import { Menu } from './components';
import styles from './index.less';

const Dashboard = props => {
  // const menuRef = useRef();
  const { match: { params: { type } }, dispatch, currentID, user } = props;

  useEffect(() => {
    if (!isLogin(user)) {
      history.push(`/login?callback=${encodeURIComponent(location.pathname.substr(1))}`);
    }
  }, []);

  const getPageContent = () => {
    if (type === 'annotation') {
      return <Annotation />;
    } else if (type == 'mrt') {
      return <MyMasterReadingTree />;
    }
  };

  return (
    <Layout>
      <article className={styles.wrapper}>
        <section className={styles.article}>
          <aside className="menu">
            <Menu type={type} />
          </aside>

          <section className="page_content">
            {getPageContent()}
          </section>
        </section>
      </article>
    </Layout>
  );
};

export default page(
  connect(({ auth }) => ({
    user: auth.user,
  })),
)(Dashboard);

