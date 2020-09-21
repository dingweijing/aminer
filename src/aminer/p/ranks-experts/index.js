import React, { useEffect, useState } from 'react';
import { page, connect } from 'acore';
import { Layout } from 'aminer/layouts';
import { classnames } from 'utils';
import { FM } from 'locales';
import helper from 'helper';
import { Pagination } from 'antd';
import { logtime } from 'utils/log';
import { Spin } from 'aminer/components/ui';
import { PersonCard } from 'aminer/core/person/widgets';
import styles from './index.less';

let size = 20, pageN = 1;

const ExpertRank = props => {
  const { dispatch, loading, personRankByType, personAllRank, expertRankKey, total = 0 } = props;
  const { type = '' } = helper.parseMatchesParam(props, {}, ['type']);

  useEffect(() => {
    if ((type && !personRankByType) || (type && type !== expertRankKey)) {
      dispatch({
        type: 'rank/getExpertRank',
        payload: { type, offset: (pageN - 1) * size, size, }
      });
    } else if ((!type && !personAllRank) || (!type && expertRankKey)) {
      dispatch({ type: 'rank/getPersonOverall' })
    }
  }, [type]);

  const onChangeType = (check) => {
    if (check === type) { return }
    pageN = 1;
    helper.routeTo(props, null, { type: check }, {
      transferPath: [
        { from: '/ranks/experts', to: '/ranks/experts/:type' },
      ],
    });
  }

  const onChangePage = (n) => {
    pageN = n;
    dispatch({
      type: 'rank/getExpertRank',
      payload: { type, offset: (pageN - 1) * size, size, }
    });
  }

  const labelsData = personAllRank && [{ attr: '', label: '' }, ...personAllRank];

  return (
    <Layout>
      <article className={styles.expertRP}>
        <h1>
          <FM id='aminer.rank.researcher' defalutMessage='Researcher Rank' />
        </h1>
        <div className={styles.menuItems}>
          {labelsData && labelsData.length > 0 && (labelsData.map(({ label, attr }, index) => {
            return (
              <span key={index} className={classnames(styles.label, { [styles.select]: type === attr })}
                onClick={onChangeType.bind(this, attr)}>
                <span>{label || <FM id='aminer.rank.sort.all' defaultMessage='Overall' />}</span>
              </span>
            )
          }))}
        </div>

        <div className={styles.container}>
          <div className={styles.left}>
            <Spin loading={!!loading} />
            {!type && personAllRank && personAllRank.length > 0 && (
              <div className={styles.listContent}>
                {personAllRank.map(item => {
                  const { list } = item;
                  return (
                    <div key={item.attr} className={styles.list}>
                      <p className={classnames(styles.listTitle, styles.line)}>
                        <span className={classnames(styles.row1, styles.row)}>
                          <span className={styles.text}>
                            <FM id='aminer.rank.top3' defalutMessage='Top 3 by' />&nbsp;
                              <span>{item.label}</span>
                          </span>
                        </span>
                        <span className={classnames(styles.row2, styles.row)}>
                          <span className={styles.text}>{item.label}</span>
                        </span>
                        <span className={classnames(styles.row3, styles.row)}>
                          <span className={styles.text}>
                            <FM id='aminer.rank.rank' defalutMessage='Rank' />
                          </span>
                        </span>
                      </p>
                      <ul className={styles.personList}>
                        {list && list.length > 0 && list.map((person, index) => {
                          return (
                            <li className={styles.line} key={person.id}>
                              <span className={classnames(styles.row1, styles.row)}>
                                <PersonCard person={person}
                                  showEndorseBtn={false}
                                  showFollowBtn={false}
                                  showViews={false}
                                  tagClick={false}
                                />
                              </span>
                              <span className={classnames(styles.row2, styles.row)}>
                                <span className={styles.text}>{person.rank}</span>
                              </span>
                              <span className={classnames(styles.row3, styles.row)}>
                                <span className={styles.text}>{index + 1}</span>
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                })}
              </div>
            )}

            {type && personRankByType && personRankByType.length > 0 && (
              <div className={styles.listContent}>
                <div className={styles.list}>
                  <p className={classnames(styles.listTitle, styles.line)}>
                    <span className={classnames(styles.row1, styles.row)}>
                      <span className={styles.text}>
                        {/* <FM id='aminer.rank.top3' defalutMessage='Top 3 by' />&nbsp; */}
                        {/* <span>{item.label}</span> */}
                      </span>
                    </span>
                    <span className={classnames(styles.row2, styles.row)}>
                      <span className={styles.text}>
                        <FM id={`aminer.rank.sort.${type}`} defalutMessage={type} />
                      </span>
                    </span>
                    <span className={classnames(styles.row3, styles.row)}>
                      <span className={styles.text}>
                        <FM id='aminer.rank.rank' defalutMessage='Rank' />
                      </span>
                    </span>
                  </p>
                  <ul className={styles.personList}>
                    {personRankByType.map((person, index) => {
                      return (
                        <li className={styles.line} key={person.id}>
                          <span className={classnames(styles.row1, styles.row)}>
                            <PersonCard person={person}
                              showEndorseBtn={false}
                              showFollowBtn={false}
                              showViews={false}
                            />
                          </span>
                          <span className={classnames(styles.row2, styles.row)}>
                            <span className={styles.text}>{person.rank}</span>
                          </span>
                          <span className={classnames(styles.row3, styles.row)}>
                            <span className={styles.text}>{(pageN - 1) * size + index + 1}</span>
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <div className={styles.pagination}>
                  <Pagination
                    current={pageN}
                    defaultCurrent={pageN}
                    total={total}
                    pageSize={size}
                    onChange={onChangePage}
                  />
                </div>

              </div>

            )}

          </div>
          <div className={styles.right}>
            <div className={styles.help}>
              <p className={styles.helpTitle}>HELP</p>
              <div className={styles.helpContent}>
                <p className={styles.subTitle}>Experts' Statistics</p>
                <div className={styles.info}>
                  We calculate several features of authors, including <span style={{ fontStyle: 'italic' }}>h</span>-index: &nbsp;, A-Index, G-Index, Total citation number, Diversity,
Sociability, Activity, New Star and Rising Star.  <a shape="rect" href="/ranks/ranks-res-help">please click here</a>.
                  </div>
              </div>
            </div>
          </div>
        </div>


      </article>
    </Layout>
  );
}

ExpertRank.getInitialProps = async ({ store, match, isServer }) => {
  logtime('getInitialProps::ExpertRank init');
  const { params: { type } } = match || {};
  if (!isServer) { return; }
  if (type) {
    await store.dispatch({
      type: 'rank/getExpertRankAndMenu',
      payload: { type, offset: (pageN - 1) * size, size, }
    });
  } else {
    await store.dispatch({ type: 'rank/getPersonOverall' })
  }
  const { rank } = store.getState();
  return { rank };
};

export default page(connect(({ loading, rank }) => ({
  loading: loading.effects['rank/getExpertRank'] || loading.effects['rank/getPersonOverall'],
  expertRankKey: rank.expertRankKey,
  personAllRank: rank.personAllRank,
  personRankByType: rank.personRankByType,
  total: rank.personRankTotal,
})))(ExpertRank)
