import React, { useState, useRef, useEffect } from 'react';
import { component, connect } from 'acore';
import { classnames } from 'utils';
import { FM } from 'locales';
import { sysconfig } from 'systems';
import ProjectList from './ProjectList';
import styles from './PubComponent.less';

const { Profile_List_Length = 100 } = sysconfig;
const ProjectComponent = props => {
  const { profileProjects, profileProjectsTotal, dispatch, pid, size = 20 } = props;

  // console.log('profileProjects', profileProjects)
  // console.log('profileProjectsTotal', profileProjectsTotal)
  useEffect(() => {
    dispatch({
      type: 'profile/getProfileProjects',
      payload: { id: pid, size: Profile_List_Length, reset: true },
    });
  })

  const loadMoreProfects = () => {
    dispatch({
      type: 'profile/getProfileProjects',
      payload: { id: pid, size },
    });
  };

  // const loadMorePapers = () => {
  //   getProfilePapers(sort);
  // }
  if (!profileProjectsTotal || !profileProjects.length) {
    return false;
  }

  return (
    <section className={styles.profilePapers}>
      <h2 className="part_title">
        <span>
          <span className="title">
            <FM id="aminer.person.projects" defaultMessage="Projects" />
          </span>
          {profileProjects && <span className="num">{`共 ${profileProjectsTotal} 篇`}</span>}
        </span>
      </h2>
      <div className="part_content">
        <ProjectList
          projects={profileProjects}
          end={!(profileProjects.length < profileProjectsTotal)}
        />
        {profileProjects && profileProjects.length < profileProjectsTotal && (
          <div className="more_paper">
            <span className="more_btn" onClick={loadMoreProfects}>
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
    profileProjects: profile.profileProjects,
    profileProjectsTotal: profile.profileProjectsTotal,
  })),
)(ProjectComponent);
