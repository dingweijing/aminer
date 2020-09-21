import React, { useEffect, useState } from 'react';
import { page, connect } from 'acore';
import { Layout } from 'aminer/layouts';
import { message } from 'antd';
import { logtime } from 'utils/log';
import { ConfBasic, ConfInfo } from './c';
import styles from './detail.less';

const ConferenceDetail = props => {
  const { match: { params: { id } },
    dispatch, confIntro, confInfo } = props;

  useEffect(() => {
    if (id && (!confIntro || !confInfo)) {
      dispatch({
        type: 'rank/getConfRankDetail',
        payload: {
          id,
          year_begin: 2015,
          year_end: new Date().getFullYear(),
        }
      })
    }
  }, [id]);

  return (
    <Layout showSearch>
      <article className={styles.conference}>
        <ConfBasic id={id} confIntro={confIntro} />
        <ConfInfo id={id} information={confInfo} />
      </article>
    </Layout>
  );
}

ConferenceDetail.getInitialProps = async params => {
  logtime('getInitialProps::ConferenceDetail init');
  const { store, isServer, match } = params;
  if (!isServer) { return }
  const { id } = match.params || {};
  if (id) {
    await store.dispatch({
      type: 'rank/getConfRankDetail',
      payload: {
        id,
        year_begin: 2015,
        year_end: new Date().getFullYear(),
      }
    })
    logtime('getInitialProps::ConferenceDetail Done')
  }
  const { rank } = store.getState();
  return { rank };
}

export default page(connect(({ rank }) => ({
  confIntro: rank.confIntro,
  confInfo: rank.confInfo
})))(ConferenceDetail)
