import React from 'react';
import { connect, Link, component } from 'acore';
import { FM, formatMessage } from 'locales';
import { classnames } from 'utils';
import { getProfileUrl } from 'utils/profile-utils';
import { ExpertLink } from 'aminer/components/widgets';
import display from 'utils/display';
import { Hole } from 'components/core';
import helper from 'helper';
import { Tooltip } from 'antd';
import { sysconfig } from 'systems';
import { PersonFollow } from 'aminer/core/search/c/widgets';
import { Tags, SimilarPerson } from 'aminer/components/person/c';
import { ProfileInfo, PersonListZoneType } from 'aminer/components/person/person_type';
import styles from './Person.less';

interface PropsType {
  imgSrcWidth: string;
  enableImgLazyLoad: boolean;
  showViews: boolean;
  showBind: boolean;
  className: string;
  COVIDHotExpert: any;
  contentLeftZone: PersonListZoneType;
  contentRightZone: PersonListZoneType;
  contentBottomZone: PersonListZoneType;
  tagZone: PersonListZoneType;
  person: ProfileInfo;
  target: string;
  mode: string;
}

const Person = (props: PropsType) => {
  const {
    imgSrcWidth = '240',
    enableImgLazyLoad,
    showViews = true,
    showBind = true,
    className,
    COVIDHotExpert,
  } = props;
  const { target, mode = 'list' } = props;
  const { contentLeftZone, contentRightZone, contentBottomZone, tagZone, indicesZone } =
    props || {};

  const { person } = props;

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

  const renderAvatar = (imageSrc: string, name: string) => {
    if (enableImgLazyLoad) {
      return <img data-src={imageSrc} src={display.DefaultAvatar} alt={name} />;
    }
    return <img src={imageSrc} alt={name} />;
  };

  const onBind = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const avatar = person && display.personAvatar(person.avatar, 0, imgSrcWidth);

  const { nameBlock } = renderNames(person.name, person.name_zh);

  const { indices = {}, profile = {} } = person;
  const { hindex, citations, pubs } = indices;

  const position = display.localValue(sysconfig.Locale, profile.position, profile.position_zh);
  const affiliation = display.localValue(
    sysconfig.Locale,
    profile.affiliation || profile.org,
    profile.affiliation_zh,
  );

  const defaultZones = mode === 'list' ? listModeZone : cardModeZone;

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
              {renderAvatar(avatar, person.name)}
            </Link>
          </ExpertLink>
          {showViews && (
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
          <div className="title">
            {person.id && (
              <ExpertLink author={person} toLinkNoCover={target === '_blank'}>
                <Link
                  to={getProfileUrl(person.name, person.id)}
                  className="titleName"
                  target={target}
                >
                  <strong>
                    {nameBlock}
                    {showBind && (
                      <i
                        className={classnames('fa fa-check-circle-o', {
                          bind: person.bind,
                        })}
                        onClick={onBind}
                      />
                    )}
                  </strong>
                </Link>
              </ExpertLink>
            )}
            {!person.id && (
              <span>
                <strong>
                  {nameBlock}
                  {showBind && (
                    <i
                      className={classnames('fa fa-check-circle-o', {
                        bind: person.bind,
                      })}
                      onClick={onBind}
                    />
                  )}
                </strong>
              </span>
            )}

            {person.id && COVIDHotExpert && COVIDHotExpert.includes(person.id) && (
              <a
                className="covid"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://lfs.aminer.cn/misc/COVID-19Experts/${person.id}.pdf`}
              >
                <FM id="aminer.person.covid" defaultMessage="COVID-19 HOT Expert" />
              </a>
            )}
          </div>
          <Hole
            name="PersonList.indicesZone"
            fill={indicesZone}
            defaults={defaultZones.indicesZone}
            param={{ person }}
            config={{ containerClass: 'indicesZone' }}
          />
          {/* {indices && (
            <p className="statsLine">
              <>
                <span>
                  <em>h</em>-index
                </span>
                <FM id="aminer.common.colon" defaultMessage=": " />
                <span className="statst">{hindex || 0}</span>
              </>

              <span className="split" />

              <>
                <FM id="aminer.common.paper" defaultMessage="#Paper" />
                <FM id="aminer.common.colon" defaultMessage=": " />
                <span className="statst">{pubs || 0}</span>
              </>

              <span className="split" />

              <>
                <FM id="aminer.common.citation" defaultMessage="#Citation" />
                <FM id="aminer.common.colon" defaultMessage=": " />
                <span className="statst">{citations || 0}</span>
              </>
            </p>
          )} */}
          {profile && profile.position && (
            <p>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-bao" />
              </svg>
              <span>{position}</span>
            </p>
          )}
          {profile && affiliation && (
            <p>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-lacale" />
              </svg>
              <span>{affiliation}</span>
            </p>
          )}
          <Hole
            name="PersonList.tagZone"
            fill={tagZone}
            defaults={defaultZones.tagZone || []}
            param={{ person }}
            config={{ containerClass: 'tagZone' }}
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
        param={{ person, id: person.id, index: props.index }}
        config={{ containerClass: 'contentRight' }}
      />
    </div>
  );
};

export default component(
  connect(({ aminerSearch, auth }) => ({
    COVIDHotExpert: aminerSearch.COVIDHotExpert,
    // infocards: aminerSearch.infocards,
    user: auth.user,
  })),
)(Person);

const listModeZone = {
  tagZone: [({ person }: { person: ProfileInfo }) => <Tags key={1} person={person} />],
  contentBottomZone: [
    // ({ person }: { person: ProfileInfo }) => (
    //   <SimilarPerson
    //     key={10}
    //     person={person}
    //     // personInfocard={this.personInfocard}
    //     infocardShow={infocardShow}
    //     infocardHide={infocardHide}
    //   />
    // ),
  ],
  contentLeftZone: [],
  contentRightZone: [
    ({ person }: { person: ProfileInfo }) => (
      <PersonFollow
        key={5}
        personId={person.id}
        isFollowing={person.is_following}
        numFollowed={person.num_followed}
      />
    ),
  ],
  indicesZone: [
    ({ person }: { person: ProfileInfo }) => {
      const { indices } = person;
      const { hindex, citations, pubs } = indices || {};
      return (
        <p className="statsLine">
          <>
            <span>
              <em>h</em>-index
            </span>
            <FM id="aminer.common.colon" defaultMessage=": " />
            <span className="statst">{hindex || 0}</span>
          </>

          <span className="split" />

          <>
            <FM id="aminer.common.paper" defaultMessage="#Paper" />
            <FM id="aminer.common.colon" defaultMessage=": " />
            <span className="statst">{pubs || 0}</span>
          </>

          <span className="split" />

          <>
            <FM id="aminer.common.citation" defaultMessage="#Citation" />
            <FM id="aminer.common.colon" defaultMessage=": " />
            <span className="statst">{citations || 0}</span>
          </>
        </p>
      );
    },
  ],
};
const cardModeZone = {
  tagZone: [],
  contentBottomZone: [],
  contentLeftZone: [],
  contentRightZone: [],
  indicesZone: [],
};
