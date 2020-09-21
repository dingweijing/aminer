import React, { useEffect, useState, useRef } from 'react';
import { component, connect, Link } from 'acore';
import { classnames } from 'utils';
import { Popconfirm, message } from 'antd';
import consts from 'consts';
import { FM, formatMessage } from 'locales';
import { Hole } from 'components/core';
import display from 'utils/display';
import helper from 'helper';
import { getProfileUrl } from 'utils/profile-utils';
import { ProfileInfo } from 'aminer/components/person/person_type';
import { PubInfo } from 'aminer/components/pub/pub_type';
import { ExpertLink } from 'aminer/components/widgets';
import { FormComponentProps } from 'antd/lib/form/Form';
import { IUser } from 'aminer/components/common_types';
import { Spin } from 'aminer/components/ui';
import styles from './ProfileInfoPanel.less';

interface IPropTypes extends FormComponentProps {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  user: IUser;
  profile: ProfileInfo;
  profilePubs: PubInfo[];
  loading: boolean;
  isGotoProfile: boolean;
  title: string;
  bottomZone: Array<({ paper, id }: { paper: PubInfo; id: string }) => JSX.Element>;
}

const renderNames = (name: string, nameZh: string) => {
  const { mainName, subName, isDefaultLocale } = helper.renderLocalNames(name, nameZh);
  const nameBlock = (
    <div>
      {mainName}
      {subName && (
        <span className={styles.sub}>{isDefaultLocale ? `（${subName}）` : `(${subName})`}</span>
      )}
    </div>
  );
  const nameText = isDefaultLocale ? `${mainName}（${subName}）` : `${mainName} (${subName})`;
  return { nameBlock, nameText, mainName };
};

const ProfileInfoPanel: React.FC<IPropTypes> = props => {
  const { dispatch, user, title, profile, loading, bottomZone, isGotoProfile = true } = props;

  const avatar = profile && display.personAvatar(profile.avatar, 0, 80);

  const { nameBlock, mainName } = (profile && renderNames(profile.name, profile.name_zh)) || {};

  return (
    <div className={classnames(styles.bindProfile, 'bind-profile')}>
      {/* <Spin loading={loading} /> */}
      <div className="panel_title">{title}</div>
      {profile?.bind && (
        <div className="id_binded">
          <FM
            id="aminer.user.verified.tip"
            values={{
              email: (
                <a
                  className="email"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="mailto:feedback@aminer.cn"
                >
                  feedback@aminer.cn
                </a>
              ),
            }}
          />
        </div>
      )}
      <div className="profile_detail">
        <div className="img_box">
          <img src={avatar} alt="" />
        </div>
        <div className="info_content">
          <div className="author_name">
            {isGotoProfile && (
              <ExpertLink author={profile}>
                <Link to={getProfileUrl(profile.name, profile.id)} target="_blank">
                  <strong>{nameBlock}</strong>
                </Link>
              </ExpertLink>
            )}
            {!isGotoProfile && <strong>{nameBlock}</strong>}
          </div>
          {profile?.profile?.position && (
            <p className="position">
              {/* <i className="fa fa-briefcase" /> */}
              <span>{profile.profile.position}</span>
            </p>
          )}

          {profile?.profile?.affiliation && (
            <p className="affiliation">
              {/* <i className="fa fa-bank" /> */}
              <span>{profile.profile.affiliation}</span>
            </p>
          )}
          <Hole
            name="PersonInfo.bottomZone"
            fill={bottomZone}
            defaults={[]}
            param={{ profile }}
            config={{ containerClass: 'bottom-zone' }}
          />
        </div>
      </div>
      <div className="panel_content">{props.children}</div>
    </div>
  );
};

export default component(
  connect(({ auth, profile, loading }) => ({
    user: auth.user,
    profilePubs: profile.profilePubs,
    // loading: loading.effects['profile/getPersonPapers'],
  })),
)(ProfileInfoPanel);
