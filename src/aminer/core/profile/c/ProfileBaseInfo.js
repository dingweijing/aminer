import React, { useEffect, useState, useMemo, memo } from 'react';
import classnames from 'classnames';
import { connect, component, Link } from 'acore';
import PropTypes from 'prop-types';
import { Button, Tooltip, Modal, message, Input } from 'antd';
import { FM, formatMessage, getLocale } from 'locales';
import { isLogin, isRoster, isLockAuth, isBianYiGeToken } from 'utils/auth';
import { cutUrl } from 'utils/profile-utils';
import { getPositionMap } from 'helper/profile';
import { getLangLabel } from 'helper';
import ResumeCard from './ResumeCard';
import ProfileBaseInfoEdit from './ProfileBaseInfoEdit';
import styles from './ProfileBaseInfo.less';

const { TextArea } = Input;

const ProfileBaseInfo = props => {
  const {
    info,
    dispatch,
    user,
    pid,
    lock,
    editType,
    names,
    cardType,
    COVIDHotExpert,
    intl,
  } = props;
  const [editInfo, setEditInfo] = useState(info);

  useEffect(() => {
    setEditInfo(info);
  }, [pid, info]);

  const isAdminShow = isRoster(user);
  const login = isLogin(user);

  const [edit, setEdit] = useState(false);

  const showLogin = () => {
    dispatch({ type: 'modal/login' });
  };

  const isUserEdit = () => {
    if (lock) {
      if (isLockAuth(user)) {
        Modal.error({
          content: '请解锁后修改',
        });
      } else {
        Modal.error({
          content: '信息已被锁不能修改，请联系 feedback@aminer.cn',
        });
      }
      return false;
    }
    return true;
  };

  const toggleEdit = () => {
    if (isUserEdit()) {
      setEdit(!edit);
    }
  };
  const afterEdit = (data = {}) => {
    setEditInfo({ ...data });
    setEdit(!edit);
    dispatch({
      type: 'profile/refreshNewInfo',
      payload: data,
    });
    // message.success('success');
  };

  const homepage = useMemo(() => {
    let home = editInfo && editInfo.homepage ? editInfo.homepage : '';
    home = cutUrl(home);
    // if (home && home.length > 60) {
    //   const center = home.slice(41, home.length - 18);
    //   home = home.replace(center, '...');
    // }
    return home;
  }, [editInfo]);

  const COVIDHotExpertZone = useMemo(() => {
    if (COVIDHotExpert && COVIDHotExpert.includes(pid)) {
      return (
        <div className="covid">
          <p className="info_line">
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-bd-" />
            </svg>
            <a
              className={classnames('', 'baseInfo')}
              target="_blank"
              rel="noopener noreferrer"
              href={`https://lfs.aminer.cn/misc/COVID-19Experts/${pid}.pdf`}
            >
              <FM id="aminer.person.covid" defaultMessage="COVID-19 HOT Expert" />
            </a>
          </p>
          <p className="info_line">
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-bd-" />
            </svg>
            <a
              className={classnames('', 'baseInfo')}
              target="_blank"
              rel="noopener noreferrer"
              href="https://2019-ncov.aminer.cn"
            >
              <FM id="aminer.person.talentmore" defaultMessage="Find more in AI-Talent" />
            </a>
          </p>
        </div>
      );
    }
    return null;
  }, [COVIDHotExpert, pid]);

  const showInfoText = useMemo(() => {
    const affArr = [
      (editInfo && editInfo.affiliation) || '',
      (editInfo && editInfo.affiliation_zh) || '',
    ];
    let showPosition =
      editInfo.position &&
      getPositionMap[editInfo.position] &&
      getPositionMap[editInfo.position][getLocale()];
    showPosition = showPosition
      ? showPosition
      : getLangLabel(editInfo.position, editInfo.position_zh);
    // console.log(' afterEdit showPosition', showPosition);
    // console.log(' afterEdit showPosition', JSON.stringify(editInfo, null, '\t'))
    if (!edit) {
      return (
        <div className="expert_info_content">
          {/*getLocale*/}
          {editInfo && showPosition && (
            <p className="info_line">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-position" />
              </svg>
              <span className={classnames('baseInfo')}>{showPosition}</span>
            </p>
          )}
          {affArr.map((n, m) => {
            return (
              n && (
                <p key={`${n}${m}`} className="info_line">
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-affiliation" />
                  </svg>
                  <TextArea
                    className={classnames('textarea', 'baseInfo')}
                    autoSize
                    disabled
                    value={n}
                  ></TextArea>
                </p>
              )
            );
          })}

          {!login && (
            <p className="should_login" onClick={showLogin}>
              <FM id="aminer.common.loginview" defaultMessage="Sign in to view more" />
            </p>
          )}
          {login && (
            <div>
              {editInfo && editInfo.phone && login && (
                <p className="info_line">
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-phone" />
                  </svg>
                  <span className={classnames('baseInfo')}>{editInfo.phone}</span>
                </p>
              )}

              {editInfo && editInfo.fax && login && (
                <p className="info_line">
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-fax" />
                  </svg>
                  <span className={classnames('baseInfo')}>{editInfo.fax}</span>
                </p>
              )}

              {editInfo && editInfo.email && login && (
                <p className="email info_line">
                  {isAdminShow && (
                    <Tooltip placement="top" title="仅高级管理员可见文字">
                      <svg className="icon info_icon" aria-hidden="true">
                        <use xlinkHref="#icon-info" />
                      </svg>
                    </Tooltip>
                  )}
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-email" />
                  </svg>
                  {editInfo.email.startsWith('/magic') && (
                    <img src={`https://apiv2.aminer.cn${info.email}`} alt="" />
                  )}
                  {!editInfo.email.startsWith('/magic') && (
                    <span className={classnames('baseInfo')}>{editInfo.email}</span>
                  )}
                </p>
              )}

              {editInfo && editInfo.homepage && homepage && login && (
                <p className="info_line">
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-global" />
                  </svg>
                  <a
                    className={classnames('homepage', 'baseInfo')}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={editInfo.homepage}
                  >
                    {homepage}
                  </a>
                </p>
              )}

              {editInfo && editInfo.hp && login && (
                <p className="info_line">
                  <Tooltip title="官方主页">
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-global" />
                    </svg>
                  </Tooltip>
                  <a
                    className={classnames('homepage', 'baseInfo')}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={editInfo.hp}
                  >
                    {cutUrl(editInfo.hp)}
                  </a>
                </p>
              )}

              {editInfo && editInfo.gs && login && (
                <p className="info_line">
                  <Tooltip title="google">
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-global" />
                    </svg>
                  </Tooltip>
                  <a
                    className={classnames('homepage', 'baseInfo')}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={editInfo.gs}
                  >
                    {cutUrl(editInfo.gs)}
                  </a>
                </p>
              )}

              {editInfo && editInfo.dblp && login && (
                <p className="info_line">
                  <Tooltip title="dblp">
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-global" />
                    </svg>
                  </Tooltip>
                  <a
                    className={classnames('homepage', 'baseInfo')}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={editInfo.dblp}
                  >
                    {cutUrl(editInfo.dblp)}
                  </a>
                </p>
              )}

              {editInfo && editInfo.address && login && (
                <p className="info_line">
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-address" />
                  </svg>
                  {/* <span>{editInfo.address}</span> */}
                  <TextArea
                    className={classnames('baseInfo', 'textarea')}
                    autoSize
                    disabled
                    value={editInfo.address}
                  ></TextArea>
                </p>
              )}
            </div>
          )}


        </div>
      );
    }
    return <div />;
  }, [editType, edit, editInfo, user, intl?.locale]);

  if (cardType) {
    return (
      <div className={classnames(styles.profile_base_info, 'container-wrong')}>
        <ResumeCard
          edit={edit}
          condition={isUserEdit}
          toggleEdit={toggleEdit}
          leftIcon={
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#icon-researchers" />
            </svg>
          }
          title={<FM id="aminer.common.information" defaultMessage="Information" />}
        >
          {!edit && showInfoText}
          {edit && (
            <ProfileBaseInfoEdit
              pid={pid}
              names={names}
              infoData={editInfo}
              afterEdit={afterEdit}
              cancleEdit={toggleEdit}
            />
          )}
        </ResumeCard>
      </div>
    );
  }

  return (
    <div className={classnames(styles.profile_base_info, 'container-wrong')}>
      {/* FIXME: FIX render */}
      {!(isRoster(user) && !editType && !isBianYiGeToken(user)) && <div className="edit_btn desktop_device" />}
      {isRoster(user) && !editType && !isBianYiGeToken(user) && (
        <div className="edit_btn desktop_device">
          {!edit && (
            <Tooltip
              placement="top"
              title={formatMessage({
                id: 'aminer.common.edit',
                defaultMessage: 'Edit',
              })}
            >
              <svg className="icon" aria-hidden="true" onClick={toggleEdit}>
                <use xlinkHref="#icon-edit" />
              </svg>
            </Tooltip>
          )}
          {edit && (
            <Tooltip
              placement="top"
              title={formatMessage({
                id: 'aminer.common.cancel',
                defaultMessage: 'Cancel',
              })}
            >
              <svg className="icon" aria-hidden="true" onClick={toggleEdit}>
                <use xlinkHref="#icon-modal_close" />
              </svg>
            </Tooltip>
          )}
        </div>
      )}
      {showInfoText}
      {edit && login && (
        <ProfileBaseInfoEdit
          pid={pid}
          infoData={editInfo}
          names={names}
          afterEdit={afterEdit}
          cancleEdit={toggleEdit}
          editType={editType}
        />
      )}
      {!(edit && login) && (
        <div />
      )}
      {COVIDHotExpertZone}
    </div>
  );
};

ProfileBaseInfo.propTypes = {
  editType: PropTypes.bool,
  cardType: PropTypes.bool,
};

ProfileBaseInfo.defaultProps = {
  editType: false,
  cardType: false,
};

export default component(
  connect(({ auth, aminerPerson, debug, aminerSearch }) => ({
    profile: aminerPerson.profile,
    user: auth.user,
    // isUserLogin: auth.isUserLogin, // 是否已经登录
    canAnnotate: auth.canAnnotate, // 是否可以标注
    ShowAnnotation: debug.ShowAnnotation,
    COVIDHotExpert: aminerSearch.COVIDHotExpert,
  })),
)(ProfileBaseInfo);

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
