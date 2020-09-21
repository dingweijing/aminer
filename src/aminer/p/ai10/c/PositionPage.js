import React, { useState, useEffect, useMemo, memo } from 'react';
import { connect, component, Link, history } from 'acore';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import consts from 'consts';
import { isLogin } from 'utils/auth';
import * as profileUtils from 'utils/profile-utils';

import { Spin } from 'aminer/components/ui';
import { SearchNameBox } from 'aminer/core/search/c/control';
import { Scholar } from './index';
import styles from './PositionPage.less';

const version = 'v1';
const orgPath = `${consts.ResourcePath}/sys/aminer/ai10/orgs/${version}`;

const PositionPage = props => {
  const { persons, showMenu, field, typeid, dispatch, loading } = props;
  const { profileAwards } = props;
  const { user } = props;
  const bind = user && user.raw_info && user.raw_info.bind;
  const login = isLogin(user);
  const userLink = user && profileUtils.getProfileUrl(user.name, bind);

  const searchProfileAward = useMemo(() => (aid, profile, year = 2018) => {
    dispatch({
      type: 'aminerAI10/getListAwardsByAid',
      payload: {
        aid, year, profile
      }
    });
  }, []);

  useEffect(() => {
    if (bind) {
      const profile = {
        id: user.id, name: user.name
      };
      searchProfileAward(user.id, profile);
    }
    return () => {
      dispatch({ type: 'aminerAI10/cleanAwardList' });
    };
  }, [user]);

  const signin = () => {
    dispatch({ type: 'modal/login' }); // TODO rename model.
  };

  const goLink = () => {
    if (!login) {
      dispatch({ type: 'modal/login' });
      return;
    }
    history.push({
      pathname: '/linkyourself'
    });
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
    history.push({
      pathname: userLink
    });
  };

  const nothing = () => { };

  // console.log('profileAwards', profileAwards)
  return (
    <div className={styles.position_page}>
      <ul className="profile_award_list">
        {profileAwards && profileAwards.length > 0 && profileAwards.map(profile => {
          const { awards } = profile;
          return (
            <li key={profile.id} className="profile_award">
              <p className={classnames('name', { no_award: awards.length === 0 })}>
                <Link target="_blank" to={`/profile/${profile.id}`}>{profile.name}</Link>
              </p>

              {awards && awards.length === 0 && (
                <p className="no_award award_line">
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-jingshicopy" />
                  </svg>
                  <span>Unfortunately, according to our data, you are not listed in top 500.</span>
                </p>
              )}
              {awards && awards.length > 0 && (
                <ul className="award_list">
                  {awards.map(award => {
                    const image = parseInt(award.type) ? 'silver' : 'golden';
                    return (
                      <li key={award.id} className="award award_line">
                        <img src={`/sys/aminer/${image}.png`} alt="" />
                        <Link target="_blank" to={`/ai10/${award.id}`}>
                          <span>{award.value}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
      <SearchNameBox searchProfileAward={searchProfileAward} />

      <div className="check_you">
        <div className={classnames('part signin', { able: !login })}>
          <div className="top">
            <div className="image" onClick={!login ? signin : nothing}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-icon-" />
              </svg>
            </div>
            <div className="text" onClick={signin}>Sign in or Sign up</div>
          </div>
          <div className="desc">
            Sign in as a (AMiner) user
          </div>
        </div>

        <div className={classnames('part link', { able: !login || !bind })}>
          <div className="top">
            <div className="image" onClick={(!login || !bind) ? goLink : nothing}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-icon-1" />
              </svg>
            </div>
            <div className="text" onClick={(!login || !bind) ? goLink : nothing}>Link to your scholar profile</div>
          </div>
          <div className="desc">
            Connect your account to the scholar profile
          </div>
        </div>

        <div className="part publication able">
          <div className="top">
            <div className="image" onClick={goCheck}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-icon-2" />
              </svg>
            </div>
            <div className="text" onClick={goCheck}>Publication Check</div>
          </div>
          <div className="desc">
            Double check your publications in the profile
          </div>
        </div>
      </div>
    </div>
  );
};

export default component(connect(({ loading, aminerAI10, auth }) => ({
  loading: loading.effects['aminerAI10/getAwardRosterTop100'],
  profileAwards: aminerAI10.profileAwards,
  user: auth.user
})))(PositionPage);
