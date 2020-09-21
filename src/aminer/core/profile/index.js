import React, { PureComponent, useEffect, useState, useRef, useMemo } from 'react';
import { connect, component, history, Link } from 'acore';
import { Layout } from 'aminer/layouts';
// import { syncMatchesToState } from 'helper';
import { classnames, qs } from 'utils';
import { Spin as ASpin } from 'antd';
import { FM, saveLocale, formatMessage } from 'locales';
import { logtime } from 'utils/log';
import { decodeLocation } from 'utils/misc';
import helper from 'helper';
import { sysconfig } from 'systems';
import { getLangLabel } from 'helper';
import { isLogin, isRoster, isALLRoster } from 'utils/auth';
import { Spin } from 'aminer/components/ui';
import { setUserTrack } from 'utils/aminer-common';
import ProfileInfo from './c/ProfileInfo';

import {
  PersonBio,
  PersonEducation,
  PersonExperience,
  ACM_Citations as ACMCitations,
} from './c/resume';
import PersonNote from './c/annotation/PersonNote';
import ProfileInfoRight from './c/ProfileInfoRight';
import { ResearchInterest } from './c/vis';
import ProfileRadarChart from './c/ProfileRadarChart';
import ProfileSimilarAuthors from './c/ProfileSimilarAuthors';
import { PubComponent, ProjectComponent, PatentComponent } from './c/list_component';
// import PersonBio from './c/PersonBio';
// import TabZone from './c/PersonTabzone';
import styles from './index.less';

const { Profile_List_Length = 100 } = sysconfig;

const menuData = [
  { tag_id: 'menu_base_info', id: 'aminer.person.baseinfo' },
  { tag_id: 'menu_paper', id: 'aminer.person.papers', data: 'profilePubs' },
  { tag_id: 'menu_patent', id: 'aminer.person.patents', data: 'profilePatents' },
  { tag_id: 'menu_project', id: 'aminer.person.projects', data: 'profileProjects' },
];

// * Special Query:
// * token=bianyigetoken  -- 默认使用这个token来访问api。假登录。
// * source=true  -- 使用iframe的方式来嵌入页面，隐藏header和footer。
// * gobock=true  -- 添加一个退回到上一页的按钮。
const ProfileHome = props => {
  // console.log('==================================================================================== render profile');

  const { token, source, gobock, anchor } = helper.parseUrlParam(props, {}, [
    'token',
    'source',
    'gobock',
    'anchor',
  ]);
  const { id: pid } = helper.parseMatchesParam(props, {}, ['id', 'name']);

  const { dispatch, match, location, profileID } = props;
  const { avgScores, profileData, user, loading, transitionState } = props;

  const [domainInfo, setDomainInfo] = useState();
  const [domainLoading, setDomainLoading] = useState(false);

  // * iframe嵌入，第三方嵌入
  useEffect(() => {
    // if (token === 'bianyigetoken') {
    if (source === 'true') {
      const key = 'zh-CN';
      sysconfig.Locale = key;
      saveLocale(sysconfig.SYSTEM, key);
    }
  }, []);

  useEffect(() => {
    anchor && scrollToAnchor(anchor);
  }, [anchor]);

  // * Post when in iframe.
  useEffect(() => {
    const postHeight = () => {
      const aminerHeight = document.getElementById('profile_body').offsetHeight;
      if (aminerHeight !== 0) {
        if (source === 'true') {
          window.top.postMessage(`aminerHeight###${aminerHeight}###${pid}`, '*');
        } else {
          window.top.postMessage(`aminerHeight###${aminerHeight}`, '*');
        }
      }
    };
    let timer;
    if (source === 'true' || source === 'sogou' || source === 'nsfc') {
      timer = setInterval(postHeight, 1000);
      return () => {
        clearInterval(timer);
      };
    }
    return undefined;
  }, [source]);

  useEffect(() => {
    // TODO 纯粹为了计数的。换成宋健改写api。
    dispatch({
      type: 'profile/GetProfile',
      payload: { id: pid },
    });
  }, []);

  useEffect(() => {
    const payload = { id: pid };
    setUserTrack(dispatch, {
      type: 'aminer.profile',
      target_type: 'detail',
      payload: JSON.stringify(payload),
    });
  }, [pid]);

  useEffect(() => {
    if (pid && pid !== profileID) {
      if (!transitionState) {
        dispatch({
          type: 'profile/resetProfile',
        });
      }
      dispatch({
        type: 'profile/getProfileBaseData',
        payload: { id: pid, size: Profile_List_Length },
      }).then(sid => {
        if (sid && sid !== pid) {
          helper.routeToReplace(props, null, { id: sid });
        }
      });
      // getInterestVisData();
    }
    dispatch({ type: 'aminerSearch/getCOVIDHotExpert' });
    // return () => {
    //   dispatch({
    //     type: 'profile/resetProfile'
    //   });
    // }
  }, [pid]);

  const getDomainInfo = () => {
    if (domainLoading) {
      return;
    }
    setDomainLoading(true);
    dispatch({
      type: 'domain/PersonDomainsDistrebution',
      payload: {
        id: pid,
      },
    }).then(res => {
      setDomainLoading(false);
      setDomainInfo(res || []);
    });
  };

  // useEffect(() => {
  //   console.log('profileData.id', profileData);
  // }, [profileData]);

  // console.log('---', profileData);

  const goBack = () => {
    history.goBack();
  };

  const scrollToAnchor = anchorName => {
    if (anchorName) {
      // 找到锚点
      const anchorElement = document.getElementById(anchorName);
      const menuElement = document.getElementById(`to_${anchorName}`);
      if (menuElement.classList.contains('disable')) {
        return;
      }
      const menuContainer = menuElement.parentElement;
      Array.from(menuContainer.children).forEach(item => {
        item.classList.remove('active');
      });

      menuElement.classList.add('active');
      // 如果对应id的锚点存在，就跳转到锚点
      if (anchorElement) {
        anchorElement.scrollIntoView({
          behavior: 'instant',
        });
      }
    }
  };

  const name_label = useMemo(() => {
    if (profileData) {
      return getLangLabel(profileData.name, profileData.name_zh);
    }
    return '';
  });

  const pageKeywords = useMemo(() => {
    if (!profileData) return false;
    // const tags = (profileData && profileData.tags) || []
    // const tags_zh = (profileData && profileData.tags_zh) || []
    // return formatMessage(({
    //   id: 'aminer.person.keywords',
    //   values: {
    //     name: name_label
    //   }
    // }))
    return sysconfig.Locale === 'zh-CN' ? `${name_label}，AI Profile` : `${name_label}, AI Profile`;
    // return (
    //   keywords &&
    //   keywords
    //     .filter(item => !!item)
    //     .slice(0, 8)
    //     .join(',')
    // );
  });

  const pageDesc = useMemo(() => {
    if (!profileData) return false;
    const { profile = {} } = profileData;
    const { affiliation, affiliation_zh, bio } = profile;
    const affiliation_label = getLangLabel(affiliation, affiliation_zh);
    let desc = `${name_label}, ${affiliation_label}, ${bio}`;
    desc = desc.replace(/<br>/g, ', ');
    return `${desc.slice(0, 300)}...`;
  });

  const pageTitle = useMemo(() => {
    return sysconfig.Locale === 'zh-CN'
      ? `${name_label || 'Expert'}-AI Profile`
      : `${name_label || 'Expert'}-AI Profile`;
  });

  const DomainInfoZone = useMemo(() => {
    return (
      <div className="specialzone_annotate domain_info">
        {!domainInfo && (
          <div className="more_btn" onClick={getDomainInfo}>
            <span className="pointer_btn">查看更多信息</span>
            <ASpin size="small" spinning={domainLoading} />
          </div>
        )}
        {domainInfo && domainInfo.length === 0 && <div className="domain_infoline">无</div>}
        {domainInfo &&
          domainInfo.length > 0 &&
          domainInfo.map(domain => {
            const { name, name_zh, cid } = domain;
            const { csum, cavg, np, p } = domain;
            return (
              <div key={cid} className="domain_infoline">
                <Link to={`/channel/${cid}`} target="_blank">
                  <span>{getLangLabel(name, name_zh)}</span>
                </Link>
                <span className="statistic">论文占比：{p ? `${(p * 100).toFixed(2)}%` : 0}</span>
                <span className="statistic">总论文数：{np || 0}</span>
                <span className="statistic">总引用数：{csum || 0}</span>
                <span className="statistic">平均引用数：{cavg ? cavg.toFixed(2) : 0}</span>
              </div>
            );
          })}
      </div>
    );
  }, [pid, domainInfo, domainLoading]);

  const contrib = avgScores && avgScores.filter(score => score.key === 'contrib')[0];
  const activity_indices = { contrib: contrib === undefined ? 0 : contrib.score };
  const resume = (profileData && profileData.profile) || {};
  const acm_citations = profileData && profileData.acm_citations;
  const { bio, edu, note } = resume;

  if (profileID !== pid) {
    return false;
  }

  // if (!profileData) {
  //   return false;
  // }

  // console.log('profileData', profileData)

  return (
    <Layout
      showSearch
      className="profile"
      pageUniqueTitle={pageTitle}
      pageDesc={pageDesc}
      pageKeywords={pageKeywords}
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
      {(!profileData || !profileData.is_admin_hidden) && profileData && (
        <article className={styles.profilePage} id="profile_body">
          {gobock === 'true' && (
            <div className="go_back" onClick={goBack}>
              返回
            </div>
          )}
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
            {isALLRoster(user) && DomainInfoZone}
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

          {/* {(isRoster(user) || isPeekannotationlog(user)) && (
            <div className={classnames(styles.note, 'specialzone_annotate')}>
              <PersonNote pid={pid} note={note} lock={profileData && profileData.is_lock} />
            </div>
          )} */}

          {/* <section className={classnames(styles.profileResume,
          { [styles.three]: !acm_citations || acm_citations.length === 0 }
        )}> */}
          <section className="profile_resume">
            <div className="left">
              {acm_citations && (
                <div className="part">
                  <ACMCitations acm_citations={acm_citations} />
                </div>
              )}
              {!acm_citations && (
                <div className="part" />
              )}

              {isLogin(user) && (
                <div className="part">
                  <PersonExperience
                    pid={pid}
                    work={profileData && profileData.profile && profileData.profile.work}
                    experience={profileData && profileData.work}
                    lock={profileData && profileData.is_lock}
                  />
                </div>
              )}
              {!isLogin(user) && (
                <div className="part" />
              )}

              {isLogin(user) && (
                <div className="part">
                  <PersonEducation
                    data={[]}
                    pid={pid}
                    education={edu}
                    lock={profileData && profileData.is_lock}
                  />
                </div>
              )}

              {!isLogin(user) && (
                <div className="part" />
              )}




              <div className="part">
                <PersonBio pid={pid} bio={bio} lock={profileData && profileData.is_lock} />
              </div>
            </div>
            <div className="right">
              {/* {profileSimilar && profileSimilar.length > 0 && ( */}
              {/* <div className="similar_part">
              <div className="title">
                <FM id="aminer.person.similar.author" defaultMessage="Similar Authors" />
              </div>
              <div className="content">

              </div>
            </div> */}
              <ProfileSimilarAuthors personId={pid} />
              {/* )} */}
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
            <div className="right">
              <div className="menus">
                {menuData &&
                  menuData.map((menu, index) => (
                    <a
                      key={menu.id}
                      id={`to_${menu.tag_id}`}
                      className={classnames('menu_item', {
                        active: index === 0,
                        disable: menu.data && (!props[menu.data] || props[menu.data].length === 0),
                      })}
                      // href={`#${item.tag_id}`}
                      onClick={() => {
                        scrollToAnchor(`${menu.tag_id}`);
                      }}
                    >
                      <FM id={menu.id} />
                    </a>
                  ))}
              </div>
            </div>
          </section>
        </article>
      )}
    </Layout>
  );
};

ProfileHome.getInitialProps = async ({ store, match, isServer }) => {
  console.log(
    '==================================================================================== render',
  );
  const { id } = match.params || {};
  if (!isServer) {
    return;
  }
  logtime('getInitialProps::ProfileHome');

  if (id) {
    await store
      .dispatch({
        type: 'profile/getProfileBaseData',
        payload: { id, size: Profile_List_Length },
      })
      .then(async sid => {
        if (sid && sid !== id) {
          history.replace(`/profile/${sid}`);
          throw new Error(`HANDLABLE_ERROR:{"type":"redirect","url":"${`/profile/${sid}`}"}`);
          // helper.routeToReplace(props, null, { id: profileData.id });
        }
      });
  }
  logtime('getInitialProps::ProfileHome Done');
  const { profile } = store.getState();
  return { profile };
};

export default component(
  connect(({ aminerPerson, auth, publications, profile, loading, aminerSearch }) => ({
    user: auth.user,
    roles: auth.roles,
    publications,
    loading: loading.effects['profile/getProfileBaseData'],
    profileData: profile.profile,
    transitionState: profile.transitionState,
    profileID: profile.profileID,
    profileSimilar: aminerPerson.profileSimilar,
    profilePubs: profile.profilePubs,
    profilePatents: profile.profilePatents,
    profileProjects: profile.profileProjects,
    COVIDHotExpert: aminerSearch.COVIDHotExpert,
  })),
)(ProfileHome);
