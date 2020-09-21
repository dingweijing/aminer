import React from 'react';
import { connect, Link, component } from 'acore';
import { FM, formatMessage } from 'locales';
import { classnames } from 'utils';
import { getProfileUrl } from 'utils/profile-utils';
import { ExpertLink, FollowBtn } from 'aminer/components/widgets';
import display from 'utils/display';
import { Hole } from 'components/core';
import { Tooltip } from 'antd';
import { ProfileInfo, PersonListZoneType } from 'aminer/components/person/person_type';
import { PersonName, IndicesRow, Information } from './index';
import Tags from './Tags';
import styles from './PersonItem.less';

interface IPropTypes {
  imgSrcWidth: string;
  enableImgLazyLoad: boolean;
  showViews: boolean;
  showBind: boolean;
  showInfo: boolean;
  isTagClick: boolean;
  className: string;
  // tagZone: PersonListZoneType;
  person: ProfileInfo;
  personTarget: string;
  mode: 'v1' | 'v2' | 'v3' | 'table';
  followSize: 'normal' | 'small';
  colNum: number;
  person_index: number;
  eStatSite: 0 | 1;
  extraStat: Array<{ label: string; count: number }>;
  extraInfo: Array<{ icon: string; text: string }>;

  onTagClick: (query: string) => void;

  indicesZone: Array<(parmas: object) => JSX.Element>;
  tagZone: Array<(parmas: object) => JSX.Element>;
  contentBottomZone: Array<(parmas: object) => JSX.Element>;
  nameRightZone: Array<(parmas: object) => JSX.Element>;
  leftZone: Array<(parmas: object) => JSX.Element>;
  rightZone: Array<(parmas: object) => JSX.Element>;
  rightBottomZone: Array<(parmas: object) => JSX.Element>;
}

const renderAvatar = (enableImgLazyLoad: boolean, imageSrc: string, name: string) => {
  if (enableImgLazyLoad) {
    return <img data-src={imageSrc} src={display.DefaultAvatar} alt={name} />;
  }
  return <img src={imageSrc} alt={name} />;
};

const PersonItem: React.FC<IPropTypes> = props => {
  const { imgSrcWidth = '240', enableImgLazyLoad, className, mode, colNum = 4, followSize } = props;
  const { person, personTarget = '_blank', showViews = true, person_index } = props;
  const { indicesZone, extraStat, eStatSite, showBind, showInfo = true } = props;
  const { extraInfo } = props;
  const { tagZone, isTagClick, onTagClick } = props;
  const { contentBottomZone, nameRightZone, leftZone, rightZone, rightBottomZone } = props;

  const avatar = person && display.personAvatar(person.avatar, 0, imgSrcWidth);

  const item_style = {
    width: mode !== 'table' ? '100%' : `calc((100% - ${(colNum - 1) * 15}px) / ${colNum})`,
    marginRight: person_index % colNum === colNum - 1 ? '0px' : '15px',
  };

  if (!person) {
    return <></>;
  }

  return (
    <div
      style={item_style}
      className={classnames(styles.personItem, styles[className], styles[mode], 'person-list-item')}
    >
      {mode === 'v1' && (
        <Hole
          name="PersonList.contentLeftZone"
          fill={leftZone}
          defaults={[]}
          param={{ person }}
          config={{ containerClass: 'left-zone desktop_device' }}
        />
      )}
      <div className="inner-content">
        <div className="imgBox">
          <Link to={getProfileUrl(person?.name, person?.id)} className="img" target={personTarget}>
            {/* <img {...imgprops} alt={person.name} /> */}
            {renderAvatar(enableImgLazyLoad, avatar, person?.name)}
          </Link>
          {showViews && mode === 'v1' && (
            <p className="views">
              <Tooltip
                placement="top"
                title={`${formatMessage({
                  id: 'aminer.common.views',
                  defaultMessage: 'views',
                })}${formatMessage({
                  id: 'aminer.common.colon',
                  defaultMessage: ': ',
                })}${person.num_viewed || 0}`}
              >
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-eye" />
                </svg>

                {person.num_viewed || 0}
              </Tooltip>
            </p>
          )}
        </div>
        <div className="content">
          <div className="name_line">
            <PersonName person={person} showBind={showBind} target={personTarget} />
            {mode !== 'table' && (
              <Hole
                name="PersonList.nameRightZone"
                fill={nameRightZone}
                defaults={mode === 'v1' ? defaultFollowZone : []}
                param={{ person, index: person_index, followSize }}
                config={{ containerClass: 'name-right-zone' }}
              />
            )}
          </div>
          {mode !== 'v2' && (
            <Hole
              name="PersonList.indicesZone"
              fill={indicesZone}
              defaults={defaultIndicesZone}
              param={{ person, extraStat, eStatSite, mode, index: person_index }}
              config={{ containerClass: 'indices-zone' }}
            />
          )}
          {showInfo && (
            <Information person={person} extraInfo={extraInfo} shorthand={mode === 'v3'} />
          )}
          <Hole
            name="PersonList.tagZone"
            fill={tagZone}
            defaults={defaultTagZone}
            param={{ person, isTagClick, onTagClick, index: person_index }}
            config={{ containerClass: 'tag-zone' }}
          />
          <Hole
            name="PersonList.contentBottomZone"
            fill={contentBottomZone}
            defaults={[]}
            param={{ person, index: person_index }}
            config={{ containerClass: 'content-bottom-zone' }}
          />
        </div>
      </div>
      {(mode === 'v1' || mode === 'v3') && (
        <Hole
          name="PersonList.contentRightZone"
          fill={rightZone}
          defaults={mode === 'v1' ? [] : defaultFollowZone}
          param={{ person, followSize }}
          config={{ containerClass: 'right-zone' }}
        />
      )}
      {mode === 'v2' && (
        <div className="statistic_content desktop_device">
          <Hole
            name="PersonList.indicesZone"
            fill={indicesZone}
            defaults={defaultIndicesZone}
            param={{ person, extraStat, eStatSite, mode, index: person_index }}
            config={{ containerClass: 'indices-zone' }}
          />
          <Hole
            name="PersonList.rightBottomZone"
            fill={rightBottomZone}
            defaults={defaultFollowZone}
            param={{ person, index: person_index, followSize }}
            config={{ containerClass: 'right-bottom-zone' }}
          />
        </div>
      )}
    </div>
  );
};

export default component(connect())(PersonItem);

const defaultIndicesZone = [
  ({ person, extraStat, eStatSite, mode }: { person: ProfileInfo; eStatSite: 0 | 1 }) => {
    const { indices } = person;
    const isCrosswise = mode !== 'v2';
    return (
      <IndicesRow
        key={3}
        statistic={indices}
        extraStat={extraStat}
        site={eStatSite}
        isCrosswise={isCrosswise}
      />
    );
  },
];

const defaultTagZone = [
  ({
    person,
    isTagClick,
    onTagClick,
  }: {
    person: ProfileInfo;
    isTagClick: boolean;
    onTagClick: (query: string) => void;
  }) => <Tags key={1} person={person} isTagClick={isTagClick} onTagClick={onTagClick} />,
];
const defaultFollowZone = [
  ({ person, followSize }: { person: ProfileInfo; followSize: 'normal' | 'small' }) => (
    <FollowBtn key={5} entity={person} size={followSize} type="e" />
  ),
];
