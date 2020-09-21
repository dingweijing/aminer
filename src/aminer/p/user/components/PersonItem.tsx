import React from 'react';
import { connect, Link, component } from 'acore';
import { classnames } from 'utils';
import { getProfileUrl } from 'utils/profile-utils';
import { ExpertLink, FollowBtn } from 'aminer/components/widgets';
import display from 'utils/display';
import { Hole } from 'components/core';
import helper, { getLangLabel } from 'helper';
// import { PersonFollow } from 'aminer/core/search/c/widgets';
import { ProfileInfo, PersonListZoneType } from 'aminer/components/person/person_type';
import TopicTags from './TopicTags';
import styles from './PersonItem.less';

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

const renderNames = (name: string | undefined, nameZh: string | undefined) => {
  const { mainName, subName, isDefaultLocale } = helper.renderLocalNames(name, nameZh);
  const nameBlock = (
    <span className={styles.profileName}>
      <span className={styles.name}>{mainName}</span>
      {subName && (
        <span className={styles.sub}>{isDefaultLocale ? `（${subName}）` : `(${subName})`}</span>
      )}
    </span>
  );
  const nameText = isDefaultLocale ? `${mainName}（${subName}）` : `${mainName} (${subName})`;
  return { nameBlock, nameText };
};

const renderAvatar = (imageSrc: string, name: string, enableImgLazyLoad: boolean) => {
  if (enableImgLazyLoad) {
    return <img data-src={imageSrc} src={display.DefaultAvatar} alt={name} />;
  }
  return <img src={imageSrc} alt={name} />;
};

const PersonItem: React.FC<IPropsType> = props => {
  const { imgSrcWidth = 80, enableImgLazyLoad, className } = props;
  const { target = '_blank' } = props;
  const { contentLeftZone, contentRightZone, contentBottomZone, tagZone, indicesZone } =
    props || {};

  const { person } = props;

  const avatar = person && display.personAvatar(person.avatar, 0, imgSrcWidth);

  const { nameBlock } = renderNames(person.name, person.name_zh);

  const { profile = {} } = person;

  const position = getLangLabel(profile.position, profile.position_zh);
  const affiliation = getLangLabel(profile.affiliation || profile.org, profile.affiliation_zh);

  return (
    <div
      className={classnames(styles.PersonItem, styles[className], 'person-list-item', className)}
      key={person.id}
      id={`pid_${person.id}`}
    >
      <Hole
        name="PersonList.contentLeftZone"
        fill={contentLeftZone}
        defaults={defaultZones.contentLeftZone}
        param={{ person }}
        config={{ containerClass: 'contentLeft' }}
      />

      <div className="inner-content">
        <div className="imgBox">
          <ExpertLink author={person} toLinkNoCover={target === '_blank'}>
            <Link to={getProfileUrl(person.name, person.id)} className="img" target={target}>
              {/* <img {...imgprops} alt={person.name} /> */}
              {renderAvatar(avatar, person.name, enableImgLazyLoad)}
            </Link>
          </ExpertLink>
        </div>

        <div className="content">
          <div className="title">
            {person.id && (
              <ExpertLink author={person} toLinkNoCover={target === '_blank'}>
                <Link
                  to={getProfileUrl(person.name, person.id)}
                  className="titleName"
                  target={target}
                >
                  {nameBlock}
                </Link>
              </ExpertLink>
            )}
            {!person.id && (
              <span>
                <strong>{nameBlock}</strong>
              </span>
            )}
          </div>
          <Hole
            name="PersonList.indicesZone"
            fill={indicesZone}
            defaults={defaultZones.indicesZone}
            param={{ person }}
            config={{ containerClass: 'indicesZone' }}
          />

          {/* {profile && profile.position && (
            <p>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-bao" />
              </svg>
              <span>{position}</span>
            </p>
          )} */}
          {profile && (affiliation || position) && (
            <p className="pro_line">
              {position && <span>{position}</span>}
              {position && affiliation && <span>, </span>}
              {affiliation && <span>{affiliation}</span>}
            </p>
          )}
          <Hole
            name="PersonList.tagZone"
            fill={tagZone}
            defaults={defaultZones.tagZone || []}
            param={{ person }}
            config={{ containerClass: 'tags-zone' }}
          />
          <Hole
            name="PersonList.contentBottomZone"
            fill={contentBottomZone}
            defaults={defaultZones.contentBottomZone || []}
            param={{ person }}
            config={{ containerClass: 'contentBottom' }}
          />
        </div>
      </div>

      <Hole
        name="PersonList.contentRightZone"
        fill={contentRightZone}
        defaults={defaultZones.contentRightZone || []}
        param={{ person, id: person.id }}
        config={{ containerClass: 'content-right-zone' }}
      />
    </div>
  );
};

export default component(
  connect(({ auth }) => ({
    user: auth.user,
  })),
)(PersonItem);

const defaultZones = {
  tagZone: [({ person }: { person: ProfileInfo }) => <TopicTags key={1} topics={person.tags} />],
  contentBottomZone: [],
  contentLeftZone: [],
  contentRightZone: [
    ({ person }: { person: ProfileInfo }) => (
      <FollowBtn
        key={5}
        type="e"
        entity={person}
        withNum={false}
        // personId={person.id}
        is_following={person.is_following}
        // numFollowed={person.num_followed}
      />
    ),
  ],
  indicesZone: [],
};
