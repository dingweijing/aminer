import React, { useEffect, useState, useRef } from 'react';
import { connect, Link, P, history, component } from 'acore';
import PropTypes from 'prop-types';
import { FM, zhCN, formatMessage } from 'locales';
import { classnames } from 'utils';
import { getSearchPathname } from 'utils/search-utils';
import { getProfileUrl } from 'utils/profile-utils';
import { ExpertLink } from 'aminer/components/widgets';
import display from 'utils/display';
import { Hole, ListTristate } from 'components/core';
import helper from 'helper';
import smallcard from 'helper/smallcard';
import { Tooltip } from 'antd';
import { sysconfig } from 'systems';
import { useImageLazyLoad } from 'utils/hooks';
import { PersonVote, PersonFollow, SimilarPerson, SmallCard } from 'aminer/core/search/c/widgets';
import styles from './PersonList.less';

// !!! TODO need refactor this file.
let card = null;
let timer = null;
const PersonList = props => {
  useImageLazyLoad();
  const smallCard = useRef();
  const cid = useRef(props.id || Math.random());
  const { onSearchQuery, source, stpye } = props;
  const { dispatch } = props;

  const {
    personList,
    imgSrcWidth,
    enableImgLazyLoad,
    showViews,
    showBind,
    className,
    COVIDHotExpert,
  } = props;
  const { contentLeftZone, contentRightZone, contentBottomZone, plugins, special, target } = props;
  const { imgBoxStyle } = props;

  let { results: persons } = props;
  if (personList) {
    persons = personList;
  }

  useEffect(() => {
    card = smallcard.init(cid.current);
  });

  const handleSearchQuery = query => {
    if (onSearchQuery) {
      onSearchQuery(query);
      return;
    }
    if (source === 'sogou' || source === 'true') {
      let url = '';
      if (stpye == 'wap') {
        url = `http://scholar.sogou.com/xueshu?keyword=${query}&TabMode=2`;
      } else {
        url = `http://scholar.sogou.com/xueshu?ie=utf-8&keyword=${query}&TabMode=2`;
      }
      window.open(url, '_top');
      return;
    }
    dispatch({ type: 'searchperson/toggleAdvancedSearch', payload: true });
    target
      ? window.open(getSearchPathname(query), '_blank')
      : (window.location.href = getSearchPathname(query));
  };

  const showProfile = (name, id) => {
    let url = '';
    if (name && name.toLowerCase().match(/[a-zA-Z]+/g)) {
      url = name
        .toLowerCase()
        .match(/[a-zA-Z]+/g)
        .join('-');
    }
    if (source === 'sogou' || source === 'true') {
      window.top.postMessage(`aminerLink###profile/${url}/${id}`, '*');
      return;
    }
    // window.open(getProfileUrl(name, id));
    history.push(getProfileUrl(name, id));
  };

  const infocardShow = (target, sid) => {
    if (card) {
      card.show(target, sid, { x: 5, y: 60 });
    }
    if (smallCard.current) {
      smallCard.current.cancelHide();
      timer = setTimeout(() => {
        smallCard.current.getData();
      }, 0);
    }
  };

  const onRef = cardref => {
    smallCard.current = cardref;
  };

  const infocardHide = () => {
    if (timer) {
      clearTimeout(timer);
    }
    if (smallCard.current) {
      smallCard.current.tryHideCard();
    }
  };

  const defaultZones = {
    contentLeftZone: [({ person }) => <PersonVote key={0} person={person} source={source} />],
    contentRightZone: [
      ({ person }) => (
        <PersonFollow
          key={5}
          personId={person.id}
          isFollowing={person.is_following}
          numFollowed={person.num_followed}
          source={source}
        />
      ),
    ],
    contentBottomZone: [
      ({ person }) => (
        <SimilarPerson
          key={10}
          person={person}
          // personInfocard={this.personInfocard}
          infocardShow={infocardShow}
          infocardHide={infocardHide}
        />
      ),
    ],
  };

  const renderNames = (name, nameZh) => {
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

  const renderAvatar = (imageSrc, name) => {
    if (enableImgLazyLoad) {
      return <img data-src={imageSrc} src={display.DefaultAvatar} alt={name} />;
    }
    return <img src={imageSrc} alt={name} />;
  };

  const onBind = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div id={`${cid.current}_ROOT`} className={classnames(styles[className], styles.personList)}>
      <SmallCard
        onRef={onRef}
        id={cid.current}
      // sid={sid} pid={pid}
      />
      {persons &&
        persons.map((person, index) => {
          const avatar = person && display.personAvatar(person.avatar, 0, imgSrcWidth);

          const { nameBlock } = renderNames(person.name, person.name_zh);
          let { tags, tags_zh } = person;
          const { tags_translated_zh } = person;
          tags_zh = tags_zh || tags_translated_zh;

          if (sysconfig.Locale === zhCN) {
            [tags, tags_zh] = [tags_zh, tags];
          }
          tags = tags && tags.length ? tags : tags_zh;
          tags = tags && tags.slice(0, 8);

          const { indices = {}, profile = {} } = person;
          const { hindex, citations, pubs } = indices;

          const position = display.localValue(
            sysconfig.Locale,
            profile.position,
            profile.position_zh,
          );
          const affiliation = display.localValue(
            sysconfig.Locale,
            profile.affiliation || profile.org,
            profile.affiliation_zh,
          );

          return (
            <div className={styles.carousel} key={person.id} id={`pid_${person.id}`}>
              <Hole
                name="PersonList.contentLeftZone"
                fill={contentLeftZone}
                defaults={defaultZones.contentLeftZone}
                plugins={P.getHoles(plugins, 'PersonList.contentLeftZone')}
                param={{ person, index }}
                config={{ containerClass: styles.contentLeft }}
              />

              <div className={styles.imgBox} style={imgBoxStyle}>
                <ExpertLink author={person} toLinkNoCover={target === '_blank'}>
                  <Link
                    to={getProfileUrl(person.name, person.id)}
                    className={styles.img}
                    target={target}
                  >
                    {/* <img {...imgprops} alt={person.name} /> */}
                    {renderAvatar(avatar, person.name)}
                  </Link>
                </ExpertLink>
                {showViews && (
                  <p className={styles.views}>
                    <Tooltip
                      placement="top"
                      title={`${formatMessage({
                        id: 'aminer.common.views',
                        defaultMessage: 'views',
                      })}
                          ${formatMessage({
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

              <div className={styles.content}>
                <div className={styles.title}>
                  {person.id && (
                    <ExpertLink author={person} toLinkNoCover={target === '_blank'}>
                      <Link
                        to={getProfileUrl(person.name, person.id)}
                        className={styles.titleName}
                        target={target}
                      >
                        <strong>
                          {nameBlock}
                          {showBind && (
                            <i
                              className={classnames('fa fa-check-circle-o', {
                                [styles.bind]: person.bind,
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
                              [styles.bind]: person.bind,
                            })}
                            onClick={onBind}
                          />
                        )}
                      </strong>
                    </span>
                  )}

                  {person.id && COVIDHotExpert && COVIDHotExpert.includes(person.id) && (
                    <a
                      className={styles.covid}
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://lfs.aminer.cn/misc/COVID-19Experts/${person.id}.pdf`}
                    >
                      <FM id="aminer.person.covid" defaultMessage="COVID-19 HOT Expert" />
                    </a>
                  )}
                </div>

                {indices && (
                  <p className={styles.statsLine}>
                    <>
                      <span>
                        <em>h</em>-index
                      </span>
                      <FM id="aminer.common.colon" defaultMessage=": " />
                      <span className={styles.statst}>{hindex || 0}</span>
                    </>

                    <span className={styles.split} />

                    <>
                      <FM id="aminer.common.paper" defaultMessage="#Paper" />
                      <FM id="aminer.common.colon" defaultMessage=": " />
                      <span className={styles.statst}>{pubs || 0}</span>
                    </>

                    <span className={styles.split} />

                    <>
                      <FM id="aminer.common.citation" defaultMessage="#Citation" />
                      <FM id="aminer.common.colon" defaultMessage=": " />
                      <span className={styles.statst}>{citations || 0}</span>
                    </>
                  </p>
                )}

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

                {tags && tags.length !== 0 && (
                  <p className={styles.tags}>
                    {tags.map((tag, index) => {
                      if (!tag) {
                        return null;
                      }
                      return (
                        <button type="button" className={styles.tag} key={index}>
                          <span onClick={handleSearchQuery.bind(this, tag)}>{tag}</span>
                        </button>
                      );
                    })}
                  </p>
                )}

                <Hole
                  name="PersonList.contentBottomZone"
                  fill={contentBottomZone}
                  defaults={defaultZones.contentBottomZone}
                  plugins={P.getHoles(plugins, 'PersonList.contentBottomZone')}
                  param={{ person }}
                  config={{ containerClass: styles.contentBottom }}
                />
              </div>

              <Hole
                name="PersonList.contentRightZone"
                fill={contentRightZone}
                defaults={defaultZones.contentRightZone}
                plugins={P.getHoles(plugins, 'PersonList.contentRightZone')}
                param={{ person, id: person.id }}
                config={{ containerClass: styles.contentRight }}
              />
            </div>
          );
        })}
    </div>
  );
};
PersonList.propTypes = {
  showViews: PropTypes.bool,
  showBind: PropTypes.bool,
  imgSrcWidth: PropTypes.string,
  imgBoxStyle: PropTypes.object,
  enableImgLazyLoad: PropTypes.bool,
  plugins: PropTypes.any,
  contentLeftZone: PropTypes.array,
  contentRightZone: PropTypes.array,
  contentBottomZone: PropTypes.array,
};
PersonList.defaultProps = {
  showViews: true,
  showBind: true,
  imgSrcWidth: '240',
  imgBoxStyle: {
    width: '90px',
    minWidth: '90px',
    height: '90px',
  },
};

export default component(
  connect(({ searchperson, aminerSearch, auth }) => ({
    searchperson,
    results: searchperson.results,
    topic: aminerSearch.topic,
    COVIDHotExpert: aminerSearch.COVIDHotExpert,
    // infocards: aminerSearch.infocards,
    user: auth.user,
  })),
)(PersonList);
