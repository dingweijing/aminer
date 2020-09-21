import React, { } from 'react';
import { page } from 'acore';
import { sysconfig } from 'systems';
import { formatMessage } from 'locales';
import { Layout } from 'aminer/layouts';
// import { RightZone } from 'layouts/aminer/headers';
import { HomeTop, ResStat, NewArrival, Menu, AdvertiseCN, Questionnaire } from '@/aminer/core/home/c';
import styles from './index.less';

/**
 * Author: xenaluo
 * Refactor by BoGao 2019-06-10
 * AMiner Homepage
 *   2019-06-10 - to hooks
 */

const { Show_Questionnaire, Questionnaire_Start_Date, Questionnaire_End_Date } = sysconfig;

const Home: React.FC<{}> = () => {
  const preventFormat = '';

  // useEffect(() => {
  //   console.log('---- ---- --- -- - in', props);
  //   return () => {
  //     console.log('---- ---- --- -- - out');
  //   };
  // }, [])

  const now = new Date();
  const isShowQuestionnaire =
    (now - new Date(Questionnaire_Start_Date)) >= 0 &&
    (new Date(Questionnaire_End_Date) - now) >= 0;

  return (
    <Layout
      className="home"
      pageTitle="AMiner"
      pageSubTitle={formatMessage({
        id: 'aminer.home.pageTitle',
        defaultMessage: 'AI赋能学术搜索',
      })}
    >
      <article className={styles.article}>

        <section className="top">

          <HomeTop />

          <section className="resState">
            <ResStat />
          </section>
        </section>

        <section className="imageSwipper">
          <NewArrival />
        </section>

        <section className="menuWrapper">
          <Menu />
        </section>

        {Show_Questionnaire && isShowQuestionnaire && (
          <section className="questionnaire desktop_device">
            <Questionnaire />
          </section>
        )}

        {sysconfig.Locale === 'zh-CN' && (
          <section className="advertiseCN">
            <AdvertiseCN />
          </section>
        )}

      </article>
    </Layout>
  );
};


/* eslint-disable consistent-return */
Home.getInitialProps = async ({ store, isServer }) => {
  console.log('>>>>> --------storegetInitialProps ', isServer, global.SSR_COOKIE, ']');

  if (!isServer) return;
  await store.dispatch({ type: 'aminerCommon/getHomeData', payload: { size: 5 } })
  const { report, aminerCommon } = store.getState();
  return { report, aminerCommon };
};

export default page()(Home);
