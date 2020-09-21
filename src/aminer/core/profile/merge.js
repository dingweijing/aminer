import React, { useEffect, useMemo } from 'react';
import { connect, component, router, page } from 'acore';
import PersonMerge from './c/annotation/PersonMerge';
import { Layout } from 'aminer/layouts';
import { sysconfig } from 'systems';
import helper from 'helper';
import styles from './merge.less'

const { Profile_List_Length = 100 } = sysconfig;

const ProfileMerge = props => {

  const { source } = helper.parseUrlParam(props, {}, ['source']);

  const { id: pid } = helper.parseMatchesParam(props, {}, ['id', 'name']);

  const { dispatch, profileID, transitionState, profileData } = props

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

  }, [pid])

  // const pageKeywords = useMemo(() => {
  //   if (!profileData) return false;
  //   const { tags = [], tags_zh = [] } = profileData;
  //   const keywords = [profileData.name, profileData.name_zh, ...tags, ...tags_zh];
  //   return keywords && keywords.filter(item => !!item).slice(0, 8).join(',');
  // }, [pid])

  // const pageDesc = useMemo(() => {
  //   if (!profileData) return false;
  //   const { profile = {} } = profileData;
  //   const { affiliation, affiliation_zh } = profile;
  //   return `${profileData.name || profileData.name_zh}, ${affiliation || affiliation_zh}`
  // }, [pid])

  return (
    <Layout showSearch
      showHeader={source !== 'sogou' && source !== 'true' && source !== 'nsfc'}
      showFooter={source !== 'sogou' && source !== 'true' && source !== 'nsfc'}
    >
      <div className={styles.profileMerge}>
        <PersonMerge names={{
          name: profileData && profileData.name,
          name_zh: profileData && profileData.name_zh
        }} pid={pid} />
      </div>
    </Layout>
  )

}

export default component(connect(({ profile }) => ({
  profileData: profile.profile,
  profileID: profile.profileID,
  transitionState: profile.transitionState,
})))(ProfileMerge)
