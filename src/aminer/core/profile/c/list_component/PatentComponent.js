import React, { useState, useRef } from 'react';
import { component, connect } from 'acore';
import { classnames } from 'utils';
import { FM } from 'locales';
import PatentList from './PatentList';
import styles from './PubComponent.less';

const PatentComponent = props => {
  const {
    profilePatents,
    profilePatentsTotal,
    dispatch,
    pid,
    size = 20,
    profilePatentsEnd,
  } = props;

  // console.log('profilePatents', profilePatents)
  // console.log('profilePatentsTotal', profilePatentsTotal)

  const loadMorePatents = () => {
    dispatch({
      type: 'profile/getProfilePatents',
      payload: { id: pid, size },
    });
  };

  // const loadMorePapers = () => {
  //   getProfilePapers(sort);
  // }
  if (!profilePatentsTotal || !profilePatents.length) {
    return false;
  }

  return (
    <section className={styles.profilePapers}>
      <h2 className="part_title">
        <span>
          <span className="title">
            <FM id="aminer.person.patents" defaultMessage="Patents" />
          </span>
          {/* {profilePatents && (
          <span className="num">{`共 ${profilePatentsTotal} 篇`}</span>
        )} */}
        </span>
      </h2>
      <div className="part_content">
        <PatentList pid={pid} patents={profilePatents} end={profilePatentsEnd} />
        {profilePatents && !profilePatentsEnd && (
          <div className="more_paper">
            <span className="more_btn" onClick={loadMorePatents}>
              加载更多
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default component(
  connect(({ profile }) => ({
    profilePatents: profile.profilePatents,
    profilePatentsTotal: profile.profilePatentsTotal,
    profilePatentsEnd: profile.profilePatentsEnd,
  })),
)(PatentComponent);
