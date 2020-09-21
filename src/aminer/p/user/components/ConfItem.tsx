import React from 'react';
import { connect, Link, component } from 'acore';
import { FM, formatMessage } from 'locales';
import { classnames } from 'utils';
import { getProfileUrl } from 'utils/profile-utils';
import { ExpertLink } from 'aminer/components/widgets';
import display from 'utils/display';
import { Hole } from 'components/core';
import helper, { getLangLabel } from 'helper';
import { Tooltip } from 'antd';
import { sysconfig } from 'systems';
// import { PersonFollow } from 'aminer/core/search/c/widgets';
import { Tags, SimilarPerson } from 'aminer/components/person/c';
import { ProfileInfo, PersonListZoneType } from 'aminer/components/person/person_type';
import TopicTags from './TopicTags';
import styles from './ConfItem.less';

interface IPropsType {
  imgSrcWidth: string;
  enableImgLazyLoad: boolean;
  className: string;
  indicesZone: PersonListZoneType;
  contentLeftZone: PersonListZoneType;
  contentRightZone: PersonListZoneType;
  contentBottomZone: PersonListZoneType;
  tagZone: PersonListZoneType;
  person: ProfileInfo;
  target: string;
  mode: string;
}

const formatTime = (time: Date) => new Date(time).format('MM.dd,yyyy');

const ConfItem: React.FC<IPropsType> = props => {
  const { imgSrcWidth = 80, enableImgLazyLoad, className } = props;
  const { target = '_blank', conf } = props;
  const { contentLeftZone, contentRightZone, contentBottomZone, tagZone, indicesZone } =
    props || {};

  // const { person } = props;

  // const avatar = person && display.personAvatar(person.avatar, 0, imgSrcWidth);

  // const { nameBlock } = renderNames(person.name, person.name_zh);

  // const { profile = {} } = person;

  // const affiliation = getLangLabel(profile.affiliation || profile.org, profile.affiliation_zh);

  return (
    <div
      className={classnames(styles.confItem, 'conf-list-item', {
        // [styles.showActionConf]:
        //   showAction && isLogin(user) && (isAuthed(roles) || conf.uid === user.id),
      })}
      key={conf.id}
    >
      <div className="content">
        <div className="logo">
          <a
            title={conf.short_name}
            // href={`/conf/${conf.short_name}`}
            // onClick={setConfInfoToStorage.bind(null, conf)}
          >
            <img src={conf.logo} alt={conf.short_name} />
          </a>
        </div>
        <div className="rightZone">
          <div className="basicInfo">
            <div className="title">
              <h2 style={{ display: 'none' }}>{conf.short_name}</h2>
              <a
                // href={`/conf/${conf.short_name}`}
                title={conf.short_name}
                // onClick={setConfInfoToStorage.bind(null, conf)}
              >
                {conf.full_name}
              </a>
            </div>
            <div className="info">
              {(conf.begin_date || conf.end_date) && (
                <span className="date">
                  <svg className="icon" aria-hidden="true">
                    <use xlinkHref="#icon-time1" />
                  </svg>
                  <span>{formatTime(conf.begin_date)}</span>
                  {conf.begin_date && conf.end_date && <span> - </span>}
                  <span>{formatTime(conf.end_date)}</span>
                  {/* <span>{conf.year}</span> */}
                </span>
              )}
              <span>
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-position1" />
                </svg>
                {conf.address}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Hole
        name="PersonList.contentRightZone"
        fill={contentRightZone}
        defaults={defaultZones.contentRightZone || []}
        // defaults={[]}
        param={{ conf, id: conf.id }}
        config={{ containerClass: 'content-right-zone' }}
      />
    </div>
  );
};

export default component(
  connect(({ auth }) => ({
    user: auth.user,
  })),
)(ConfItem);

const defaultZones = {
  // tagZone: [({ person }: { person: ProfileInfo }) => <TopicTags key={1} topics={person.tags} />],
  // contentBottomZone: [],
  // contentLeftZone: [],
  contentRightZone: [
    // ({ person }: { person: ProfileInfo }) => (
    //   <RecommedFollow
    //     key={5}
    //     // personId={person.id}
    //     // isFollowing={person.is_following}
    //     // numFollowed={person.num_followed}
    //   />
    // ),
  ],
  indicesZone: [],
};
