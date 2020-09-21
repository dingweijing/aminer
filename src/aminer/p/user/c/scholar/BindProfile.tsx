import React, { useEffect, useState, useRef, useMemo } from 'react';
import { component, connect, history } from 'acore';
import { classnames } from 'utils';
import { Popconfirm, message, Popover } from 'antd';
import consts from 'consts';
import { FM, formatMessage } from 'locales';
import { ProfileInfo } from 'aminer/components/person/person_type';
import { PubInfo } from 'aminer/components/pub/pub_type';
import { FormComponentProps } from 'antd/lib/form/Form';
import { Spin } from 'aminer/components/ui';
import PublicationList from 'aminer/components/pub/PublicationList.tsx';
import ProfileInfoPanel from './ProfileInfoPanel';
import styles from './BindProfile.less';

interface IPropTypes extends FormComponentProps {
  dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
  // user: IUser;
  profile: ProfileInfo;
  profilePubs: PubInfo[];
  loading: boolean;
}

const BindProfile: React.FC<IPropTypes> = props => {
  const { dispatch, profile, profilePubs, loading, userinfo } = props;
  const [stamp, setStamp] = useState<boolean>(false);
  const timer = useRef<NodeJS.Timer>();

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  useEffect(() => {
    dispatch({
      type: 'profile/resetPubPage',
      // type: 'profile/resetProfilePubs',
    });
    const { id } = profile || {};
    if (id) {
      dispatch({
        type: 'profile/getPersonPapers',
        payload: {
          id,
          offset: 0,
          size: 5,
          searchType: 'all',
          sorts: ['!year'],
        },
      });
    }
  }, [profile]);

  const onBindMe = async () => {
    if (userinfo?.bind) {
      await dispatch({
        type: 'social/UnBind',
      });
    }
    dispatch({
      type: 'social/BindMe',
      payload: {
        id: profile.id,
      },
    }).then(res => {
      if (res.status) {
        // message.success(formatMessage({ id: 'aminer.user.bind.success', defaultMessage: 'Successfully Binded' }));
        setStamp(true);
        dispatch({
          type: 'social/setBind',
          payload: {
            pid: profile.id,
          },
        });
        // localStorage.removeItem('lc_aminer_me-data');
        timer.current = setTimeout(() => {
          // setIsBind(profile?.id || '');
          history.push('/user/scholar');
        }, 2000);
      } else {
        message.error(res?.message || '');
      }
    });
  };

  const bottomZone = useMemo(() => {
    return [
      () => (
        <div
          key={6}
          className={classnames('certified_image', {
            show: profile?.bind,
            stamp,
            [styles.stamp]: stamp,
          })}
        >
          <img src={`${consts.ResourcePath}/sys/aminer/certified.png`} alt="" />
        </div>
      ),
      () => (
        <div className="certified" key={66}>
          {!profile?.bind && (
            <Popconfirm
              overlayClassName="confirm_certified_popconfirm"
              placement="left"
              title={
                userinfo?.bind
                  ? formatMessage({ id: 'aminer.user.binded.re' })
                  : formatMessage({ id: 'aminer.user.bind.confirm' })
              }
              onConfirm={onBindMe}
              okText={formatMessage({ id: 'aminer.user.bind.confirm.btn' })}
              cancelText={formatMessage({ id: 'aminer.logout.confirm.cancel' })}
            >
              <button type="button" className="certified_btn">
                <FM id="aminer.user.bind" />
              </button>
            </Popconfirm>
          )}
          {profile?.bind && (
            <button type="button" disabled className="verified_btn">
              <FM id="aminer.user.verified" />
            </button>
          )}
        </div>
      ),
    ];
  }, [profile, stamp, userinfo]);

  return (
    <div className={classnames(styles.bindProfile, 'bind-profile')}>
      <Spin loading={loading} />
      <ProfileInfoPanel
        profile={profile}
        bottomZone={bottomZone}
        title={formatMessage({ id: 'aminer.user.bind.expert' })}
      >
        {!!profilePubs?.length && (
          <div className="recent_pubs">
            <div className="pub_title">
              <FM id="aminer.user.pubs.recent" />
            </div>
            <div className="publist">
              <PublicationList
                papers={profilePubs}
                contentRightZone={[]}
                showInfoContent={[]}
                showAuthorCard={false}
                showSearchWithNoId={false}
                isAuthorsClick={false}
              />
            </div>
          </div>
        )}
      </ProfileInfoPanel>
    </div>
  );
};

export default component(
  connect(({ profile, loading, social }) => ({
    // user: auth.user,
    profilePubs: profile.profilePubs,
    userinfo: social.userinfo,
    loading: loading.effects['profile/getPersonPapers'],
  })),
)(BindProfile);

// import React, { useEffect, useState, useRef } from 'react';
// import { component, connect, Link } from 'acore';
// import { classnames } from 'utils';
// import { Popconfirm, message } from 'antd';
// import consts from 'consts';
// import { FM, formatMessage } from 'locales';
// import display from 'utils/display';
// import helper from 'helper';
// import { getProfileUrl } from 'utils/profile-utils';
// import { ProfileInfo } from 'aminer/components/person/person_type';
// import { PubInfo } from 'aminer/components/pub/pub_type';
// import { ExpertLink } from 'aminer/components/widgets';
// import { FormComponentProps } from 'antd/lib/form/Form';
// import { IUser } from 'aminer/components/common_types';
// import { Spin } from 'aminer/components/ui';
// import PublicationList from 'aminer/components/pub/PublicationList.tsx';
// import styles from './BindProfile.less';

// interface IPropTypes extends FormComponentProps {
//   dispatch: (config: { type: string; payload?: object | boolean }) => Promise<any>;
//   user: IUser;
//   profile: ProfileInfo;
//   profilePubs: PubInfo[];
//   loading: boolean;
// }

// const renderNames = (name: string, nameZh: string) => {
//   const { mainName, subName, isDefaultLocale } = helper.renderLocalNames(name, nameZh);
//   const nameBlock = (
//     <div>
//       {mainName}
//       {subName && (
//         <span className={styles.sub}>{isDefaultLocale ? `（${subName}）` : `(${subName})`}</span>
//       )}
//     </div>
//   );
//   const nameText = isDefaultLocale ? `${mainName}（${subName}）` : `${mainName} (${subName})`;
//   return { nameBlock, nameText, mainName };
// };

// const BindProfile: React.FC<IPropTypes> = props => {
//   const { dispatch, user, profile, profilePubs, loading, setIsBind } = props;
//   const [stamp, setStamp] = useState<boolean>(false);
//   const timer = useRef<NodeJS.Timer>();

//   useEffect(() => {
//     return () => {
//       if (timer.current) {
//         clearTimeout(timer.current);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     dispatch({
//       type: 'profile/resetPubPage',
//       // type: 'profile/resetProfilePubs',
//     });
//     const { id } = profile || {};
//     if (id) {
//       dispatch({
//         type: 'profile/getPersonPapers',
//         payload: {
//           id,
//           offset: 0,
//           size: 5,
//           searchType: 'all',
//           sorts: ['!year'],
//         },
//       });
//     }
//   }, [profile]);

//   const onBindMe = () => {
//     setStamp(true);
//     timer.current = setTimeout(() => {
//       setIsBind(profile?.id || '')
//     }, 2000);
//     // dispatch({
//     //   type: 'social/BindMe',
//     //   payload: {
//     //     id: profile.id,
//     //   },
//     // }).then(res => {
//     //   if (res.status) {
//     //     message.success(formatMessage({ id: 'aminer.common.success', defaultMessage: 'Success' }));
//     //   } else {
//     //     message.error(res?.message || '')
//     //   }
//     // });
//   };

//   const avatar = profile && display.personAvatar(profile.avatar, 0, 80);

//   const { nameBlock, mainName } = (profile && renderNames(profile.name, profile.name_zh)) || {};

//   return (
//     <div className={classnames(styles.bindProfile, 'bind-profile')}>
//       <Spin loading={loading} />
//       <div className="panel_title">
//         <FM id="aminer.user.isme" />
//       </div>
//       <div className="profile_detail">
//         <div className="img_box">
//           <img src={avatar} alt="" />
//         </div>
//         <div className="info_content">
//           <div
//             className={classnames('certified_image', {
//               show: profile?.bind,
//               [styles.stamp]: stamp,
//             })}
//           >
//             <img src={`${consts.ResourcePath}/sys/aminer/certified.png`} alt="" />
//           </div>
//           <div className="author_name">
//             <ExpertLink author={profile}>
//               <Link to={getProfileUrl(profile.name, profile.id)} target="_blank">
//                 <strong>{nameBlock}</strong>
//               </Link>
//             </ExpertLink>
//           </div>
//           {profile?.profile?.position && (
//             <p className="position">
//               {/* <i className="fa fa-briefcase" /> */}
//               <span>{profile.profile.position}</span>
//             </p>
//           )}

//           {profile?.profile?.affiliation && (
//             <p className="affiliation">
//               {/* <i className="fa fa-bank" /> */}
//               <span>{profile.profile.affiliation}</span>
//             </p>
//           )}
//           <div className="certified">
//             {!profile?.bind && (
//               <Popconfirm
//                 overlayClassName="confirm_certified_popconfirm"
//                 placement="left"
//                 title={formatMessage({ id: 'aminer.user.bind.confirm' })}
//                 onConfirm={onBindMe}
//                 okText="Yes"
//                 cancelText="No"
//               >
//                 <button type="button" className="certified_btn">
//                   <FM id="aminer.user.certified" />
//                 </button>
//               </Popconfirm>
//             )}
//             {profile?.bind && (
//               <button type="button" disabled className="verified_btn">
//                 <FM id="aminer.user.verified" />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//       {!!profilePubs?.length && (
//         <div className="recent_pubs">
//           <div className="pub_title">
//             <FM id="aminer.user.pubs.recent" />
//           </div>
//           <div className="publist">
//             <PublicationList
//               papers={profilePubs}
//               contentRightZone={[]}
//               showInfoContent={[]}
//               showAuthorCard={false}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default component(
//   connect(({ auth, profile, loading }) => ({
//     user: auth.user,
//     profilePubs: profile.profilePubs,
//     loading: loading.effects['profile/getPersonPapers'],
//   })),
// )(BindProfile);
