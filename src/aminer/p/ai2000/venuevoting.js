/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo } from 'react';
import { connect, component, withRouter, Link } from 'acore';
import consts from 'consts';
import { FM } from 'locales';
import { Layout } from 'aminer/layouts';
import { sysconfig } from 'systems';
// import { BackTop } from 'antd';
import { FieldsVote } from 'aminer/p/ai2000/component';
import styles from './venuevoting.less';

const { AI2000_Vote_ID, AI2000_Default_Year } = sysconfig;

// Components

const VenuePage = props => {
  const { domainInfo, dispatch, location } = props;

  const { pathname } = location;

  const aiType = useMemo(() => (pathname && pathname.startsWith('/ai2000') ? 'ai10' : 'ai'), [
    pathname,
  ]);
  useEffect(() => {
    dispatch({
      type: 'aminerAI10/GetSSRDomainInfoData',
      payload: { aiType, year: AI2000_Default_Year },
    });
  }, []);

  return (
    <Layout>
      <article className={styles.article}>
        <p>The top journals and conferences recommended by the China Computer Federation (CCF) are used as the candidate venues, which are listed in the table below. The dark ones are used in the 2020 edition of AI 2000 Annual List. For future versions, we sincerely invite all 2020 winners to nominate the top venues of each field by using the “like” and “dislike” buttons in the table.</p>
        <FieldsVote y={AI2000_Default_Year} vote_id={AI2000_Vote_ID} domainInfo={domainInfo} />
      </article>
    </Layout>
  );
};

export default component(
  withRouter,
  connect(({ aminerAI10 }) => ({
    domainInfo: aminerAI10.domainInfo,
  })),
)(VenuePage);
