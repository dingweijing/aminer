import React, { useEffect, useState, useMemo, memo } from 'react';
import classnames from 'classnames';
import consts from 'consts';
import { connect, component, Link } from 'acore';
import PropTypes from 'prop-types';
import { Button, Tooltip, Modal, message } from 'antd';
import { FM, formatMessage } from 'locales';
import { getProfileInfo } from 'helper/profile';
import * as profileUtils from 'utils/profile-utils';
import { useGetFollowsByID } from 'utils/hooks';
import { AnnotationZone } from 'amg/zones';
import { isLogin, isRoster, isLockAuth, isPeekannotationlog, isBianYiGeToken } from 'utils/auth';
import { FollowBtn } from 'aminer/components/widgets';
// import { PersonFollow } from 'aminer/core/search/c/widgets';
import AnnotationNote from './annotation/AnnotationNote';
import ProfileModificationLock from './annotation/ProfileModificationLock';
import StatusLabel from './annotation/StatusLabel';
import { PersonLinks, TrajectoryIFramePic } from '../widgets';
import { ProfileUploadAvatar, ProfileBaseInfo, PersonAwards } from './index';
import Candles from './Candles';
import PersonRefresh from './PersonRefresh';
import { PersonPassAway } from './resume';
import styles from './ProfileInfo.less';

const ProfileInfo = props => {
  const { dispatch, editType /* isUserLogin, canAnnyotate, ShowAnnotation */ } = props;
  const { profile: profiledata, profileData, personId, auth, user, passawayData = {} } = props;
  const profile = profileData || profiledata;
  // const { is_passedaway, can_burncandles } = passawayData || {};
  const {
    is_passedaway,
    disable_candles,
    can_burncandles,
    userburned,
    n_candles,
    profile: passaway = {},
  } = passawayData || {};
  const { passaway_reason, passaway_year, passaway_month, passaway_day } = passaway || {};

  // flags
  const isUserLogin = isLogin(user);
  const login = isUserLogin;
  // const userIsRoster = isRoster(user)

  const userCanLabel = isRoster(user) || isPeekannotationlog(user);

  const getPerson = () => {
    dispatch({ type: 'aminerPerson/getPerson', payload: { ids: [personId] } });
  };

  const follow_profiles = useMemo(() => {
    return [profile];
  }, [profile]);
  useGetFollowsByID(dispatch, isLogin(user), follow_profiles);

  useEffect(() => {
    if (profile && profile.id) {
      dispatch({
        type: 'editProfile/GetPassawayInfo',
        payload: { id: profile.id },
      });
    }
    return () => {
      dispatch({
        type: 'editProfile/resetPassawayInfo',
      });
    };
  }, [profile && profile.id]);

  const nameBlock = useMemo(
    () => (
      <span className="name">
        {profile.name}
        {profile.name_zh && <span className="sub">({profile.name_zh})</span>}
      </span>
    ),
    [profile.name, profile.name_zh],
  );

  // * this is annotation related.
  // const lockBlock = useMemo(() => userIsRoster && (
  //   <ProfileModificationLock pid={profile.id} lock={profile.is_lock} />
  // ), [userIsRoster, profile.is_lock])

  // const lockBlock = useMemo(() => (
  // ), [userIsRoster, profile.is_lock])
  const lockBlock = (
    <AnnotationZone monitors={[profile.is_lock]}>
      <ProfileModificationLock pid={profile.id} lock={profile.is_lock} />
    </AnnotationZone>
  );

  // userIsRoster && (
  // ), [userIsRoster, profile.is_lock])

  const info = profile.profile;
  const user_id = user && user.id;

  const editInfo = useMemo(() => {
    if (info) {
      return getProfileInfo(profile);
    }
    return {};
  }, [info]);

  let avatarList = null;

  const onUploadAvatar = () => {
    if (!avatarList) {
      Modal.warning({ title: 'Please upload photos' });
      return;
    }
    const avatars = [];
    avatarList &&
      avatarList.map(n => {
        avatars.push({ url: n.url });
      });
    dispatch({
      type: 'editProfile/updateAvatars',
      payload: { id: personId, avatars },
    })
      .then(data => {
        if (data && data.succeed) {
          dispatch({ type: 'profile/getPersonById', payload: { ids: [personId] } });
          dispatch({ type: 'modal/close' });
        } else {
          message.error('upload error');
        }
      })
      .catch(error => {
        message.error((error && error.message) || 'Please contact admin');
      });
    avatarList = null;
  };

  const changeAvatars = list => {
    avatarList = list;
  };

  const decideIsOpen = () => {
    if (login) {
      if (profile.is_lock) {
        Modal.error({
          content: isLockAuth(user)
            ? '请解锁后修改'
            : '信息已被锁不能修改，请联系 feedback@aminer.cn',
        });
        return false;
      }
      return true;
    }
    if (!login) {
      dispatch({ type: 'modal/login' });
      return false;
    }
  };

  const openUploadAvatar = () => {
    if (decideIsOpen()) {
      dispatch({
        type: 'modal/open',
        payload: {
          title: 'Upload Avatar',
          height: '300px',
          width: '900px',
          showFooter: true,
          onOk: onUploadAvatar,
          content: <ProfileUploadAvatar changeAvatars={changeAvatars} personId={personId} />,
        },
      });
    }
  };
  const showGray = useMemo(() => {
    return is_passedaway && can_burncandles && !disable_candles;
  }, [is_passedaway, can_burncandles, disable_candles]);
  return (
    <div className={classnames(styles.profile_info, 'profile-info', 'container-wrong')}>
      <div className="avatar_zone">
        <img
          src={profileUtils.getAvatar(profile.avatar, '', 160)}
          className={classnames('avatar', { death: showGray })}
          alt={profile.avatar}
          title={profile.name_zh}
        />
        {/* <button className="change_image" type="button">更换照片</button> */}

        <div className="views">
          <div>
            <span className="label">
              <FM id="aminer.common.views" defaultMessage="views" />
              <FM id="aminer.common.colon" defaultMessage=": " />
            </span>
            <span className="num">{profile.num_viewed || 0}</span>
          </div>
          {/* {!isBianYiGeToken(user) && (
            <Button size="small" icon="cloud-upload" onClick={openUploadAvatar}>
              <FM id="aminer.person.uploadavatar" defaultMessage="Update Photo" />
            </Button>
          )} */}
          <br />
          {isLogin(user) && !isBianYiGeToken(user) && <PersonRefresh pid={profile.id} />}

          {showGray && (
            <div className="passaway">
              <div>{/* <FM id="aminer.person.death.reason" /> */}</div>
              <Candles
                gender={editInfo && editInfo.gender}
                pid={profile.id}
                userburned={userburned}
                n_candles={n_candles}
              // can_burncandles={can_burncandles}
              // disable_candles={disable_candles}
              />
            </div>
          )}

          <AnnotationZone monitors={[profile.id]}>
            <AnnotationNote pid={profile.id} />
          </AnnotationZone>
        </div>

        {/* Award init position */}
      </div>

      {/* ----------------------------------------- */}
      <div className="info_zone">
        {profile && (
          <>
            <div className="title">
              <h1>
                {nameBlock}

                {/* bind */}
                <Tooltip placement="top" title="This  Profile is Bind by User.">
                  <i
                    className="fa fa-check-circle-o fa-fw bindsign"
                    style={{ color: profile.bind ? '#428bca' : '' }}
                  />
                </Tooltip>

                {/* lock */}
                {lockBlock}
              </h1>
              <span className="rank">
                {profile && profile.id && profile.id !== user_id && !isBianYiGeToken(user) && (
                  // <PersonFollow
                  //   personId={profile.id}
                  //   isFollowing={profile.is_following}
                  //   numFollowed={profile.num_followed}
                  // />
                  <FollowBtn size="small" key={5} entity={profile} type="e" />
                )}
              </span>
            </div>
            <div className="spliter" />
          </>
        )}

        <div className="expert_basic_info">
          <div className="expert_basic_info_left">
            <ProfileBaseInfo
              editType={editType}
              info={props.newInfo || editInfo}
              pid={profile.id}
              lock={profile.is_lock}
            />

            <PersonPassAway />

            {isUserLogin && (
              <PersonAwards
                personId={
                  personId // TODO DEBUG..... LOADING FIRST.
                }
              />
            )}

            <div className="edit_profile">
              {isUserLogin && !editType && (
                <Link
                  to={`/profilemerge/${profile.id}`}
                  className="edit_btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FM id="com.profileMerge.button.merge" defaultMessage="Merge" />
                </Link>
              )}
              {userCanLabel && !editType && (
                <a
                  href={`https://adata.aminer.cn/profile/${profile.id}`}
                  className="edit_btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FM id="aminer.person.edit" defaultMessage="Edit Profile" />
                </a>
              )}
            </div>
          </div>

          {/* <div className="change_info"> */}
          {/* TODO */}
          {/* <span className={styles.change_user}>[xxxx]</span> */}
          {/* <i className='fa fa-edit' /> */}
          {/* </div> */}
        </div>

        <div className="spliter" />

        <div className="expert_bottom_info">
          <PersonLinks links={profile.links} homepage={info && info.homepage} />
          {/* {!isUserLogin && (
            // <p className="should_login" onClick={showLogin}><em className="login">Login</em> to view external links </p>
            <>
              <div className="hiddentiptle" />
              <div className="__links">
                <p />
              </div>
            </>
          )}
          {isUserLogin && (
            <>
              <div className="hiddentitle">Links:</div>
              <div className="__links">
                <PersonLinks links={profile.links} homepage={info && info.homepage} />
              </div>
            </>
          )} */}

          <TrajectoryIFramePic personId={profile && profile.id} className="show_trajectory" />
        </div>

        {/* TODO profile.locks.edit.status==false && isLoggedIn() */}
        {/* <button className="contact_btn" type="button">
          {`${formatMessage({ id: 'aminer.person.contact_manager', defaultMessage: 'Contact the discipline manager' })}`}
        </button> */}
        {/* TODO 这里放一个可以手工添加修改的tabs. */}
      </div>
      {/* {console.log('=========', profile)} */}
      {/* {false && <div>
          <div>Radar</div>
          <div>Tags</div>
        </div>
        } */}
      {/* <ProfileInfoRight /> */}
    </div>
  );
};

export default component(
  connect(({ auth, aminerPerson, editProfile, debug, profile }) => ({
    profile: aminerPerson.profile,
    user: auth.user,
    // flags
    isUserLogin: auth.isUserLogin, // 是否已经登录
    canAnnotate: auth.canAnnotate, // 是否可以标注
    ShowAnnotation: debug.ShowAnnotation,
    passawayData: editProfile.passawayData,
    newInfo: profile.newInfo,
  })),
)(ProfileInfo);

//  {/* facebook */}
//  <span className={classnames('fa-stack fa-lg', { [styles.high]: links['facebook'] && links['facebook'].url })}>
//  <i className="fa fa-circle fa-stack-2x" />
//  <i className="rounded-x fa-stack-1x fa-inverse fa fa-facebook" />
// </span>
// {/* twitter */}
// <span className={classnames('fa-stack fa-lg', { [styles.high]: links['twitter'] && links['twitter'].url })}>
//  <i className="fa fa-circle fa-stack-2x" />
//  <i className="rounded-x fa-stack-1x fa-inverse fa fa-twitter" />
// </span>
// {/* vl */}
// <span className={classnames('fa-stack fa-lg', { [styles.high]: links['vl'] && links['vl'].url })}>
//  <i className="fa fa-circle fa-stack-2x" />
//  <i className="rounded-x fa-stack-1x fa-inverse fa fa-youtube-play" />
// </span>
// {/* gs */}
// <span className={classnames('fa-stack fa-lg', { [styles.high]: links['gs'] && links['gs'].url })}>
//  <i className="fa fa-circle fa-stack-2x" />
//  <i className="rounded-x fa-stack-1x fa-inverse fa fa-graduation-cap" />
// </span>
// {/* weibo */}
// <span className={classnames('fa-stack fa-lg', { [styles.high]: links['weibo'] && links['weibo'].url })}>
//  <i className="fa fa-circle fa-stack-2x" />
//  <i className="rounded-x fa-stack-1x fa-inverse fa fa-weibo" />
// </span>
