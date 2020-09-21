import React, { PureComponent, useEffect, useState, useCallback, useMemo } from 'react';
import { connect, component, router, page } from 'acore';
import { Layout } from 'aminer/layouts';
import { Tabs, Badge, Button } from 'antd';
import { FM, saveLocale, formatMessage } from 'locales';
import { logtime } from 'utils/log';
import helper from 'helper';
import { sysconfig } from 'systems';
import { isLogin, isRoster, saveLocalToken, isPeekannotationlog } from 'utils/auth';
import { Spin } from 'aminer/components/ui';
import ProfileInfo from './c/ProfileInfo';
import { ResearchInterest } from './c/vis';
import ResumeCard from './c/ResumeCard';
import {
  PersonBio, PersonBioEdit,
  PersonEducation,
  PersonExperience,
  PersonStatusLabel
} from './c/resume';
import { PersonNote, PersonMerge } from './c/annotation';
import ProfileRadarChart from './c/ProfileRadarChart';
import ProfileInfoRight from './c/ProfileInfoRight';
import { PubComponentEdit, } from './c/list_component';
import { ProfileBaseInfo } from './c';
import { getProfileInfo } from 'helper/profile'
import styles from './edit.less';


const { Profile_List_Length = 100 } = sysconfig;


// * Special Query:
// * token=bianyigetoken  -- 默认使用这个token来访问api。假登录。
// * source=true  -- 使用iframe的方式来嵌入页面，隐藏header和footer。
// * gobock=true  -- 添加一个退回到上一页的按钮。
const ProfileEditHome = props => {
  const { token, source, gobock } = helper.parseUrlParam(props, {}, [
    'token', 'source', 'gobock'
  ]);
  const { id: pid } = helper.parseMatchesParam(props, {}, ['id', 'name']);

  const { dispatch, match, location, profileID, profilePubsTotal } = props;
  const { avgScores, profileData, user, roles, loading, profilePubs, profilePatents, profileProjects, transitionState } = props;
  const [labelTabKey, setlabelTabKey] = useState('overview');
  const userIsRoster = isRoster(user) || isPeekannotationlog(user);

  // * Post when in iframe.

  useEffect(() => {
    // TODO 纯粹为了计数的。换成宋健改写api。
    dispatch({
      type: 'profile/GetProfile',
      payload: { id: pid }
    });
  }, [])

  useEffect(() => {
    if (pid && pid !== profileID) {
      if (!transitionState) {
        dispatch({
          type: 'profile/resetProfile'
        });
      }
      dispatch({
        type: 'profile/getProfileBaseData',
        payload: { id: pid, size: Profile_List_Length }
      });
      dispatch({ type: 'aminerSearch/getCOVIDHotExpert' });
    }

    // return () => {
    //   dispatch({
    //     type: 'profile/resetProfile'
    //   });
    // }
  }, [pid])

  const contrib = avgScores && avgScores.filter(score => score.key === 'contrib')[0];
  const activity_indices = { contrib: contrib === undefined ? 0 : contrib.score };
  const resume = (profileData && profileData.profile) || {}

  const { bio, edu, note, notes } = resume;

  if (profileID !== pid) {
    return false
  }

  const createEditInfo = () => {
    if (!profileData) {
      return {}
    }
    const { profile: info } = profileData

    if (info) {
      return getProfileInfo(profileData);
    }
    return {}
  }

  const tabConfig = {
    overview: {
      key: formatMessage({ id: 'aminer.person.overview', defaultMessage: 'Overview' }),
      content: () => {
        return <div className={styles.content}>
          <div className={styles.left}>
            <ProfileBaseInfo pid={pid} names={{ name: profileData && profileData.name, name_zh: profileData && profileData.name_zh }} cardType info={createEditInfo()} lock={profileData && profileData.is_lock} />
            <br />
            <PersonEducation pid={pid} education={edu} lock={profileData && profileData.is_lock} />
            <br />
            <PersonExperience pid={pid}
              work={profileData && profileData.profile && profileData.profile.work}
              experience={profileData && profileData.work}
              lock={profileData && profileData.is_lock} />
          </div>
          <div className={styles.right} style={{ maxWidth: '50%', width: '50%' }}>
            {userIsRoster && <PersonStatusLabel pid={pid} />}
            <PersonBio pid={pid} bio={bio} lock={profileData && profileData.is_lock} />
            <br />
            {userIsRoster && <PersonNote pid={pid} note={notes} />}
          </div>
        </div >
      }
    },
    paper: {
      key: <><span className={styles.paperTab}>{formatMessage({ id: 'aminer.search.tab.paper', defaultMessage: 'Papers' })}</span>
        <Badge overflowCount={10000} count={profilePubsTotal || 0} style={{ backgroundColor: '#428bca' }} />
      </>,
      content: () => {
        return <PubComponentEdit pid={pid} size={Profile_List_Length} lock={profileData && profileData.is_lock} />
      }
    },
    merge: {
      key: formatMessage({ id: 'com.profileMerge.button.merge', defaultMessage: 'Merge' }),
      content: () => {
        return <PersonMerge names={{
          name: profileData && profileData.name,
          name_zh: profileData && profileData.name_zh
        }} pid={pid} />
      }
    },
    upload: {
      key: formatMessage({ id: 'aminer.paper.upload', defaultMessage: 'Upload' }),
      content: () => {
        return <div>Upload</div>
      }
    },
    labeltool: {
      key: formatMessage({ id: 'aminer.person.labeltool', defaultMessage: 'Label Tool' }),
      content: () => {
        return <div>Label Tool</div>
      }
    }
  }

  const userTabConfig = () => {
    let items = ['overview', 'paper'];
    if (isLogin(user)) {
      items = ['overview', 'paper', 'merge', 'upload'];
    }
    if (userIsRoster) {
      items = ['overview', 'paper', 'merge', 'upload', 'labeltool'];
    }
    return items;
  }

  const onChangeTab = (k) => {
    setlabelTabKey(k);
  }

  return (
    <Layout showSearch
      showHeader={source !== 'sogou' && source !== 'true' && source !== 'nsfc'}
      showFooter={source !== 'sogou' && source !== 'true' && source !== 'nsfc'}
    >
      <Spin loading={loading} />
      {profileData && profileData.is_admin_hidden && (
        <div>
          <h1>{profileData.name || profileData.name_zh}</h1>
          <div>This author has hidden all his personal information.</div>
        </div>
      )}

      {(!profileData || !profileData.is_admin_hidden) && (
        <article className={styles.profileEditPage} id="profile_body">
          {/* <Button type='primary' icon='left' size='small' onClick={() => router.goBack()}>返回</Button> */}
          <section className="profile_info" id="menu_base_info">
            <section className="profile_line info_line">
              <div className="left_part">
                <ProfileInfo editType={true} profileData={profileData} activity_indices={activity_indices} personId={pid} />
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
          <section className={styles.mainzone}>
            <div className={styles.tabZone}>
              <Tabs activeKey={labelTabKey} className={styles.tabPane} onChange={onChangeTab} tabPosition='left'>
                {userTabConfig().map(n => {
                  return <Tabs.TabPane key={n} tab={tabConfig[n]['key']} />
                })}
              </Tabs>
              <div className={styles.tabItem}>{tabConfig[labelTabKey].content()}</div>
            </div>
          </section>
        </article>
      )}

    </Layout >
  )
}

ProfileEditHome.getInitialProps = async ({ store,match, isServer, }) => {
  const { id } = match.params || {};
  if (!isServer) { return; }
  logtime('getInitialProps::ProfileHome')

  if (id) {
    await store.dispatch({
      type: 'profile/getProfileBaseData',
      payload: { id, size: Profile_List_Length }
    });
  }
  logtime('getInitialProps::ProfileHome Done')
  const { profile } = store.getState();
  return { profile };
};

export default component(connect(({ auth, profile, loading }) => ({
  user: auth.user,
  roles: auth.roles,
  loading: loading.effects['profile/getProfileBaseData'],
  profileData: profile.profile,
  transitionState: profile.transitionState,
  profileID: profile.profileID,
  profilePubs: profile.profilePubs,
  profilePatents: profile.profilePatents,
  profileProjects: profile.profileProjects,
  profilePubsTotal: profile.profilePubsTotal,
})))(ProfileEditHome)
