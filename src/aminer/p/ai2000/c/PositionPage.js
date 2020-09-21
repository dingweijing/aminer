import React, { useState, useEffect, useMemo, memo } from 'react';
import { connect, component, Link, history, withRouter } from 'acore';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import consts from 'consts';
import { sysconfig } from 'systems';
import { isLogin, isGod } from 'utils/auth';
import * as profileUtils from 'utils/profile-utils';
import { Spin } from 'antd';
// import { Spin } from 'aminer/components/ui';
import { SearchNameBox } from 'aminer/core/search/c/control';
import { Scholar } from './index';
import styles from './PositionPage.less';

const version = 'v1';
const orgPath = `${consts.ResourcePath}/sys/aminer/ai10/orgs/${version}`;

const { AI2000_Default_Year } = sysconfig;
const now = new Date().getFullYear() - 0;

const PositionPage = props => {
  const { dispatch, loading, year, aiType, location } = props;
  const { pathname, query } = location
  const { personAwards, showMenu } = props;
  const { user } = props;
  const bind = user && user.raw_info && user.raw_info.bind;
  const login = isLogin(user);
  const userLink = user && profileUtils.getProfileUrl(user.name, bind);
  const y = useMemo(() => (year ? year - 0 : AI2000_Default_Year), [year]);
  const langKey = sysconfig.Locale === 'en-US' ? 'name' : 'name_zh';
  const { pid, name } = query || {};


  const searchPersonAward = useMemo(
    () => (aid, profile, isMe) => {
      const type = pathname.includes('ai2000') ? 'AI 2000' : 'AI ALL'
      dispatch({
        type: 'aminerAI10/getPersonAwardsById',
        payload: {
          person_id: aid,
          //  recent_10: true,
          year: y,
          profile,
          type,
          isMe,
        },
      });
    },
    [],
  );

  useEffect(() => {
    if (name && pid) {
      searchPersonAward(pid, { id: pid, name }, true);
    } else if (bind) {
      searchPersonAward(bind, { id: bind, name: user.name }, true);
    }
    return () => {
      dispatch({ type: 'aminerAI10/cleanAwardList' });
    };
  }, []);

  const signin = () => {
    dispatch({ type: 'modal/login' }); // TODO rename model.
  };

  const goLink = () => {
    if (!login) {
      dispatch({ type: 'modal/login' });
      return;
    }
    dispatch(
      history.push({
        pathname: '/user/scholar',
      }),
    );
  };

  const goCheck = () => {
    if (!login) {
      dispatch({ type: 'modal/login' });
      return;
    }
    if (!bind) {
      alert('Please complete part ii');
      return;
    }
    dispatch(
      history.push({
        pathname: userLink,
      }),
    );
  };

  const nothing = () => { };

  return (
    <div className={styles.position_page}>
      <ul className="profile_award_list">
        {personAwards &&
          personAwards.length > 0 &&
          personAwards.map(profile => {
            const { id, name, awards } = profile;
            return (
              <li key={id} className="profile_award">
                <svg className="icon menu_icon mobile_device" aria-hidden="true" onClick={showMenu}>
                  <use xlinkHref="#icon-menu1" />
                </svg>
                <p className={classnames('name', { no_award: awards.length === 0 })}>
                  <Link target="_blank" to={`/profile/${profile.id}`}>
                    {profile.name}
                  </Link>
                </p>

                {awards && awards.length === 0 && (
                  <p className="no_award award_line">
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-jingshicopy" />
                    </svg>
                    <span>According to the data, this scholar is no ranking.</span>
                  </p>
                )}
                {awards && awards.length > 0 && (
                  <ul className="award_list">
                    {awards.map((award, index) =>
                      // const image = parseInt(award.type) ? 'silver' : 'golden';
                      (
                        <li key={award.domain_id} className="award award_line">
                          {/* <img src={`/sys/aminer/${image}.png`} alt="" /> */}
                          <Link
                            target="_blank"
                            to={`/${aiType}${year ? `/year/${year}` : ''}/${award.domain_id}`}
                          >
                            <span>
                              {now} AI 2000 Most Influential Scholar List in{' '}
                              {award[`domain_${langKey}`]}, rank: {award.rank}
                            </span>
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </li>
            );
          })}
      </ul>
      {loading && <Spin spinning={loading} size="small" />}
      <div className="spacing"></div>
      <SearchNameBox searchProfileAward={searchPersonAward} />
      <div className="check_you">
        <div className={classnames('part signin', { able: !login })}>
          <div className="top">
            <div className="image" onClick={!login ? signin : nothing}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-icon-" />
              </svg>
            </div>
            <div className="text" onClick={signin}>
              Sign in or Sign up
            </div>
          </div>
          <div className="desc">Sign in as a (AMiner) user</div>
        </div>

        <div className={classnames('part link', { able: !login || !bind })}>
          <div className="top">
            <div className="image" onClick={!login || !bind ? goLink : nothing}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-icon-1" />
              </svg>
            </div>
            <div className="text" onClick={!login || !bind ? goLink : nothing}>
              Link to your scholar profile
            </div>
          </div>
          <div className="desc">Connect your account to the scholar profile</div>
        </div>

        <div className="part publication able">
          <div className="top">
            <div className="image" onClick={goCheck}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-icon-2" />
              </svg>
            </div>
            <div className="text" onClick={goCheck}>
              Publication Check
            </div>
          </div>
          <div className="desc">Double check your publications in the profile</div>
        </div>
      </div>
    </div>
  );
};

export default component(
  withRouter,
  connect(({ loading, aminerAI10, auth }) => ({
    loading: loading.effects['aminerAI10/getPersonAwardsById'],
    personAwards: aminerAI10.personAwards,
    user: auth.user,
  })),
)(PositionPage);
