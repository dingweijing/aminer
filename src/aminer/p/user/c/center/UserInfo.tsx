import React from 'react';
import { classnames } from 'utils';
import * as profileUtils from 'utils/profile-utils';
import { FM, } from 'locales';
import { IUserInfo } from 'aminer/components/common_types';
import { BaseInfo, Password } from './index';
import styles from './UserInfo.less';

interface IPropTypes {
  // dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  userinfo: IUserInfo;
}

const UserInfo: React.FC<IPropTypes> = props => {
  const { dispatch, userinfo } = props;

  const { img: avatar, id: uid, name, lname, fname } = userinfo || {};
  // const { influence, popularity, socialstat } = userinfo || {};
  // const { fc_total, followers } = socialstat || {};
  const name_label = name || `${fname} ${lname}`;

  return (
    <div className={classnames(styles.userInfo, 'user_info')}>
      <div className="info_content">
        <div className="info_content_inner">
          <div className="avatar">
            <img src={profileUtils.getAvatar(avatar, uid, 80)} alt="" />
          </div>
          <div className="name_line">
            <span className="name">{name_label}</span>
          </div>
          {/* <div className="baseinfo_line">
            <div className="baseinfo_line_inner">
              <div className="info_item active">
                <span className="info_icon">
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-position" />
                  </svg>
                </span>
              </div>
              <div className="info_item active">
                <span className="info_icon">
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-mi" />
                  </svg>
                </span>
              </div>
              <div className="info_item active">
                <span className="info_icon"></span>
              </div>
              <div className="info_item active">
                <span className="info_icon">
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-email" />
                  </svg>
                </span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      {/* <div className="stats_content">
        <div className="stats">
          <div className="stats_item total">
            <span className="count">{fc_total}</span>
            <span className="label">
              <FM id="aminer.user.follow.total" />
            </span>
          </div>
          <div className="stats_item">
            <span className="count">{followers || '-'}</span>
            <span className="label">
              <FM id="aminer.user.follow.me" />
            </span>
          </div>
          <div className="stats_item">
            <span className="count">{influence || '-'}</span>
            <span className="label">
              <FM id="aminer.user.follow.influence" />
            </span>
          </div>
          <div className="stats_item">
            <span className="count">{popularity || '-'}</span>
            <span className="label">
              <FM id="aminer.user.follow.popularity" />
            </span>
          </div>
        </div>
      </div> */}
      <div className="edit_info">
        <div className="baseinfo_content part">
          <h3 className="title">
            <FM id="aminer.person.baseinfo" />
          </h3>
          <BaseInfo userinfo={userinfo} />
        </div>
        <div className="account_content part">
          <h3 className="title">
            <FM id="aminer.user.account.info" />
          </h3>
          <div>
            <Password className="accout_item" userinfo={userinfo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
