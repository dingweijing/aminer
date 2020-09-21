import React, { useEffect, useState, useRef, useMemo } from 'react';
import { connect, component, history } from 'acore';
import { Popconfirm, message, Button } from 'antd';
import { FM, formatMessage } from 'locales';
import { sysconfig } from 'systems';
import { getLangLabel } from 'helper';
import { Spin } from 'aminer/components/ui';
import Clipboard from 'clipboard';
import ProfileInfo from 'aminer/core/profile/c/ProfileInfo';

import {
  PersonBio,
  PersonEducation,
  PersonExperience,
  ACM_Citations as ACMCitations,
} from 'aminer/core/profile/c/resume';
import ProfileInfoRight from 'aminer/core/profile/c/ProfileInfoRight';
import { ResearchInterest } from 'aminer/core/profile/c/vis';
import ProfileRadarChart from 'aminer/core/profile/c/ProfileRadarChart';
import ProfileSimilarAuthors from 'aminer/core/profile/c/ProfileSimilarAuthors';
import {
  PubComponent,
  ProjectComponent,
  PatentComponent,
} from 'aminer/core/profile/c/list_component';
import styles from './PersonalHomepage.less';

const { Profile_List_Length = 100 } = sysconfig;

interface IPropTypes {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  pid: string;
  profileID: string;
}

const PersonalHomepage: React.FC<IPropTypes> = props => {
  const { pid } = props;
  const { dispatch, profileID } = props;
  const { avgScores, profileData, user, loading, transitionState } = props;
  const clipboard = useRef();

  useEffect(() => {
    dispatch({ type: 'expertSearch/reset' });
    if (!clipboard.current) {
      clipboard.current = new Clipboard('#share_link');
    }
  }, []);

  useEffect(() => {
    if (pid && pid !== profileID) {
      if (!transitionState) {
        dispatch({
          type: 'personalProfile/resetProfile',
        });
      }
      dispatch({
        type: 'personalProfile/getProfileBaseData',
        payload: { id: pid, size: Profile_List_Length },
      });
    }
  }, [pid]);

  const contrib = avgScores && avgScores.filter(score => score.key === 'contrib')[0];
  const activity_indices = { contrib: contrib === undefined ? 0 : contrib.score };
  const resume = (profileData && profileData.profile) || {};
  const acm_citations = profileData && profileData.acm_citations;
  const { bio, edu } = resume;

  // if (profileID !== pid) {
  //   return false;
  // }
  const onUnbind = () => {
    dispatch({
      type: 'social/UnBind',
    }).then(res => {
      if (res.status) {
        message.success(
          formatMessage({
            id: 'aminer.user.unbind.success',
            defaultMessage: 'Successfully Unbound',
          }),
        );
        // localStorage.removeItem('lc_aminer_me-data');
        setTimeout(() => {
          // setIsBind(res?.aid || '');
          history.push('/user/scholar?t=findyourself');
        }, 500);
      } else {
        message.error(res?.message || '');
      }
    });
  };

  const onShare = () => {
    message.success(
      formatMessage({ id: 'aminer.user.share.success', defaultMessage: 'Share Success' }),
    );
  };

  return (
    <div className={styles.personalHomepage}>
      <div className="tips">
        <FM
          id="aminer.user.binded.tip"
          values={{
            name: (
              <a
                href={`/profile/${pid}`}
                className="bind_name"
                target="_blank"
                rel="noopener noreferrer"
              >
                {getLangLabel(profileData?.name, profileData?.name_zh)}
              </a>
            ),
            btn: (
              <Popconfirm
                overlayClassName="confirm_certified_popconfirm unbind"
                placement="bottom"
                title={formatMessage({ id: 'aminer.user.unbind.confirm' })}
                onConfirm={onUnbind}
                okText={formatMessage({ id: 'aminer.user.unbind.btn' })}
                cancelText={formatMessage({ id: 'aminer.logout.confirm.cancel' })}
              >
                <span className="unbind_btn">
                  <FM id="aminer.user.unbind.text" />
                </span>
              </Popconfirm>
            ),
            share_btn: (
              <span className="share_btn">
                <Button
                  onClick={onShare}
                  id="share_link"
                  size="small"
                  data-clipboard-text={`https://www.aminer.cn/profile/${pid}?s=social`}
                >
                  <FM id="aminer.user.share.btn" defaultMessage="share" />
                </Button>
              </span>
            ),
          }}
        />
        {/* <div className="info">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-info_t" />
          </svg>
        </div> */}
      </div>
      <div className="homepage">
        <Spin loading={loading} />
        {profileData && profileData.is_admin_hidden && (
          <div>
            <h1>{profileData.name || profileData.name_zh}</h1>
            <div>This author has hidden all his personal information.</div>
          </div>
        )}
        {(!profileData || !profileData.is_admin_hidden) && (
          <article className={styles.profilePage} id="profile_body">
            <section className="profile_info" id="menu_base_info">
              <section className="profile_line info_line">
                <div className="left_part">
                  <ProfileInfo
                    editType={false}
                    profileData={profileData}
                    activity_indices={activity_indices}
                    personId={pid}
                  />
                </div>
                <div className="right_part">
                  <ProfileInfoRight pid={pid} />
                </div>
              </section>

              <section className="profile_line vis_line">
                <div className="left_part">
                  <ResearchInterest pid={pid} />
                </div>

                <div className="right_part">
                  <div className="profileRandar">
                    <div className="title">
                      <FM id="aminer.person.author_statistics" defaultMessage="Author Statistics" />
                    </div>
                    <div className="content">
                      <ProfileRadarChart personId={pid} />
                    </div>
                  </div>
                </div>
              </section>
            </section>

            <section className="profile_resume">
              <div className="left">
                {acm_citations && (
                  <div className="part">
                    <ACMCitations acm_citations={acm_citations} />
                  </div>
                )}

                <div className="part">
                  <PersonExperience
                    pid={pid}
                    work={profileData && profileData.profile && profileData.profile.work}
                    experience={profileData && profileData.work}
                    lock={profileData && profileData.is_lock}
                  />
                </div>

                <div className="part">
                  <PersonEducation
                    pid={pid}
                    education={edu}
                    lock={profileData && profileData.is_lock}
                  />
                </div>

                <div className="part">
                  <PersonBio pid={pid} bio={bio} lock={profileData && profileData.is_lock} />
                </div>
              </div>
              <div className="right">
                <ProfileSimilarAuthors personId={pid} />
              </div>
            </section>

            <section className="list_part">
              <div className="left">
                <div id="menu_paper">
                  <PubComponent
                    pid={pid}
                    size={Profile_List_Length}
                    lock={profileData && profileData.is_lock}
                  />
                </div>
                <div id="menu_patent">
                  <PatentComponent pid={pid} size={Profile_List_Length} />
                </div>
                <div id="menu_project">
                  <ProjectComponent pid={pid} size={Profile_List_Length} />
                </div>
              </div>
            </section>
          </article>
        )}
      </div>
    </div>
  );
};

export default component(
  connect(({ aminerPerson, auth, publications, personalProfile, loading, aminerSearch }) => ({
    user: auth.user,
    roles: auth.roles,
    publications,
    loading: loading.effects['personalProfile/getProfileBaseData'],
    profileData: personalProfile.profile,
    transitionState: personalProfile.transitionState,
    profileID: personalProfile.profileID,
    profileSimilar: aminerPerson.profileSimilar,
    profilePubs: personalProfile.profilePubs,
    profilePatents: personalProfile.profilePatents,
    profileProjects: personalProfile.profileProjects,
  })),
)(PersonalHomepage);
