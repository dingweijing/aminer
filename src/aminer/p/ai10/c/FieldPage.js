import React, { useState, useEffect, useMemo, memo, lazy } from 'react';
import { connect, component, Link, dynamic } from 'acore';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import consts from 'consts';
import { PersonList } from 'aminer/core/person/c';
import { Spin } from 'aminer/components/ui';
import styles from './FieldPage.less';

const version = 'v1';
const imgPath = `${consts.ResourcePath}/sys/aminer/ai10/${version}`;

const Trajectorie = memo(props => {
  const { id } = props;
  return <iframe
    title="traj2"
    src={`https://traj2.aminer.cn/external-groupOverview?domain=${id}&flag=aminer`}
    className="showbox" height="100%" width="100%"
    ng-src="url" allowFullScreen="allowfullscreen"
    webkitallowfullscreen="webkitallowfullscreen"
  />
})

const FieldPage = props => {
  const { persons, showMenu, field, typeid, dispatch, loading, alias } = props;

  // ？这个设计好么？是否需要重写Modal？
  const showIframe = () => {
    if (!typeid) {
      return
    }
    dispatch({
      type: 'modal/open',
      payload: {
        title: formatMessage({ id: 'aminer.person.trajectories', defaultMessage: "Scholars' Trajectories and Heat Map" }),
        height: '90vh',
        width: '90vw',
        content: <Trajectorie id={typeid} />
      }
    });
  };

  const top10 = useMemo(() => (persons ? persons.slice(0, 10) : []), [persons]);

  const top100 = useMemo(() => (persons ? persons.slice(-90) : []), [persons]);

  const conferences = useMemo(() => ({
    '5b20ca63530c706c541a9f4a': `AAAI ${formatMessage({ id: 'ai10.field.conference.and' })} IJCAI`,
    '5b20cd06530c706c541aa2b1': `STOC ${formatMessage({ id: 'ai10.field.conference.and' })} FOCS`,
    '5b20cf71530c706c541aa64f': 'ACM EC',
    '5b20d071530c706c541aa80d': `ACM CCS ${formatMessage({ id: 'ai10.field.conference.and' })} IEEE S&P`,
    '5b20d2de530c706c541aac5f': `SIGCHI、UIST ${formatMessage({ id: 'ai10.field.conference.and' })} UbiComp`,
    '5b20d4d6530c706c541aaf87': 'TVCG',
    '5b20d69a530c706c541ab319': 'SIGIR',
    '5b20d85d530c706c541ab648': `ICML ${formatMessage({ id: 'ai10.field.conference.and' })} NIPS`,
    '5b20da2d530c706c541ab9ab': `KDD ${formatMessage({ id: 'ai10.field.conference.and' })} WSDM`,
    '5b20de1c530c706c541ac11e': `KR&R ${formatMessage({ id: 'ai10.field.conference.and' })} ISWC`,
    '5b20e0ce530c706c541ac622': 'ICCV',
    '5b20e321530c706c541ac9c6': 'SIGGRAPH',
    '5b20e5c0530c706c541acdc5': 'ACL',
    '5b20e7bf530c706c541ad07d': 'ICASSP',
    '5b20e93b530c706c541ad302': `ICRA ${formatMessage({ id: 'ai10.field.conference.and' })} IROS`,
    '5b20eab5530c706c541ad4ff': `SIGMOD ${formatMessage({ id: 'ai10.field.conference.and' })} VLDB`,
    '5b20ec61530c706c541ad77f': 'ACMMM',
    '5b20edd6530c706c541ad934': `SOSP ${formatMessage({ id: 'ai10.field.conference.and' })} USENIX`,
    '5b20ef71530c706c541adb5c': 'RecSys',
    '5b20f130530c706c541add84': 'IEEE loT Journal',
    '5b20f311530c706c541adf98': 'IEEEVR'
  }), []);

  const defaultContentBottomZone = useMemo(() => [], []);

  const top10_defaultContentLeftZone = useMemo(() => [({ index }) => (
    <div key={6} className={styles.personRanking}>
      <div className={classnames(styles.no, { [styles.red]: index < 3 })}>
        <span>{index + 1}</span>
      </div>
    </div>
  )], []);

  const top100_defaultContentLeftZone = useMemo(() => [({ index }) => (
    <div key={8} className={styles.personRanking}>
      <div className={styles.no}>
        <span>{index + 11}</span>
      </div>
    </div>
  )], []);

  // console.log('fieldPage render', loading)
  return (
    <div className={styles.field_page}>
      <div className="home_title">
        <svg className="icon menu_icon" aria-hidden="true" onClick={showMenu}>
          <use xlinkHref="#icon-menu1" />
        </svg>
        <FM id="ai10.field.title"
          defaultMessage="AI-10 Most Influential Scholars"
          tagName="h1"
          values={{ field: `${formatMessage({ id: field })}` }}
        />
        <p className="pull_right">
          <svg className="icon bell_icon" aria-hidden="true" onClick={showMenu}>
            <use xlinkHref="#icon-bell" />
          </svg>
          &nbsp;If you are not here, &nbsp;
          <Link to={`/ai10/${alias}/position`}>check your position here &nbsp;</Link>
          or &nbsp;
          <a href="mailto:award@aminer.org">contact us.</a>
        </p>
      </div>
      <div className="home_content">
        <Spin loading={loading} />
        <FM
          id="ai10.home.desc"
          defaultMessage={'The AMiner Most Influential Scholar Annual List in Artificial Intelligence (AI) names the world\'s top-cited research scholars from the fields of AI. The list is conferred in recognition of outstanding technical achievements with lasting contribution and impact to the research community. In 2018, the winners are among the most-cited scholars whose paper was published in the top venues of their respective subject fields between 2007 and 2017. Recipients are automatically determined by a computer algorithm deployed in the AMiner system that tracks and ranks scholars based on citation counts collected by top-venue publications. In specific, this list aims to find the most cited AI scholars in the top venues.If you have any comments, suggestions, or corrections to make, please feel free to contact us at'}
          tagName="div"
          values={{
            email: <a className="email" href="mailto:award@aminer.org"> award@aminer.org</a>,
            conference: conferences[typeid],
            field: formatMessage({ id: field })
          }}
        />

        {persons && persons.length > 0 && (
          <div>

            <div className="top10_title">
              <FM id="ai10.field.top10"
                defaultMessage="Top 10 Most Influential Scholars"
                tagName="h2"
              />
              <div className="show_trajectory" onClick={showIframe}>
                <img src={`${imgPath}/show-trajectory.png`} alt="" />
                <p>Show Trajactories & Heat</p>
              </div>
            </div>

            <PersonList
              id="pl1"
              personList={top10}
              showBind={false}
              contentLeftZone={top10_defaultContentLeftZone}
              contentBottomZone={defaultContentBottomZone}
            />

            <div className="top100_title">
              <FM id="ai10.field.top100"
                defaultMessage="Top 100 Most Influential Scholars"
                tagName="h2"
              />
            </div>

            <PersonList
              id="pl2"
              personList={top100}
              showBind={false}
              enableImgLazyLoad
              contentLeftZone={top100_defaultContentLeftZone}
              contentBottomZone={defaultContentBottomZone}
            />

          </div>
        )}

      </div>
    </div>
  );
};

export default component(connect(({ loading }) => ({
  loading: loading.effects['aminerAI10/getAwardRosterTop100']
})))(FieldPage);
