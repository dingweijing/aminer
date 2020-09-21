import React, { useEffect, useState, useMemo } from 'react';
import { connect, Link, component } from 'acore';
import PropTypes from 'prop-types';
import { FM, formatMessage } from 'locales';
import { useGetFollowsByID } from 'utils/hooks';
import { classnames } from 'utils';
import { isLogin } from 'utils/auth';
import { getProfileUrl } from 'utils/profile-utils';
import { ExpertLink } from 'aminer/components/widgets';
import { Hole } from 'components/core';
import { PersonItem } from 'aminer/components/expert/c';
import PersonTopPubs from './PersonTopPubs';
import styles from './AI2000PersonList.less';

const AI10PersonList = props => {
  const { dispatch, user, persons, withFollow = true } = props;

  const person_data = useMemo(() => persons && persons.map(person => person && person.person), [
    persons,
  ]);

  useGetFollowsByID(dispatch, withFollow && isLogin(user), person_data);

  const { className, typeid, scholarsDynamicValue, label } = props;
  const { contentRankZone, nameRightZone, rightBottomZone } = props;

  return (
    <div className={classnames(styles[className], styles.personList)}>
      {persons &&
        persons.length > 0 &&
        persons.map((item, index) => {
          const { person, ...params } = item;
          const {
            country,
            dctoral_school,
            citation,
            is_chinese,
            rank,
            pubs: personPubs,
            award_path,
          } = item;
          if (!person) {
            return false;
          }

          const dynamic = (scholarsDynamicValue && scholarsDynamicValue[person.id]) || {};

          const item_params = {
            mode: 'v2',
            nameRightZone,
            extraInfo: [
              {
                icon: 'address',
                text: country,
              },
              {
                icon: 'edu-s',
                text: is_chinese && dctoral_school,
              },
            ],
            extraStat: [
              {
                label: formatMessage({ id: 'aminer.common.views' }),
                count: dynamic.num_viewed || '-',
              },
            ],
            contentBottomZone: [
              ({ person: _person }) => (
                <PersonTopPubs
                  pid={_person.id}
                  label={label}
                  pubs={personPubs}
                  domain_id={typeid}
                  citation={citation}
                />
              ),
            ],
            rightBottomZone,
            // ? ['__DEFAULT_PLACEHOLDER__', ...rightBottomZone]
            // : ['__DEFAULT_PLACEHOLDER__'],
          };
          // if (rightBottomZone) {
          //   item_params.rightBottomZone = rightBottomZone;
          // }

          return (
            <PersonItem person={{ ...params, ...person }} {...item_params} followSize="small" />
          );

          return (
            <div className="personItem" key={person.id} id={`pid_${person.id}`}>
              <div className="info_box">
                {/* {country && (
                  <p>
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-address" />
                    </svg>
                    <span>{country}</span>
                  </p>
                )}
                {dctoral_school && is_chinese && (
                  <p>
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-edu-s" />
                    </svg>
                    <span>{dctoral_school}</span>
                  </p>
                )} */}

                <div className="little_statistic_box mobile_device">
                  <div className="statistic">
                    <p className="statistic_line">
                      <FM id="aminer.common.views" defaultMessage="Views" />
                      <FM id="aminer.common.colon" defaultMessage=": " />
                      <span className="count">{dynamic.num_viewed || '-'}</span>
                    </p>
                  </div>
                </div>

                <div>
                  {/* <SimilarPerson
                    isAuthorOuter
                    person={person}
                    showAvatar={false}
                    className="ai10_author_list"
                    infocardShow={infocardShow}
                    infocardHide={infocardHide}
                  /> */}

                  {/* {award_path && <Certificate pid={person.id} award_path={award_path} />} */}
                </div>

                <div className="itemRightTop">
                  <Hole
                    name="PersonList.contentRankZone"
                    fill={contentRankZone}
                    defaults={[]}
                    param={{ person, index, rank }}
                    config={{ containerClass: 'contentRank' }}
                  />
                  <div className="little_image mobile_device">
                    <ExpertLink author={person}>
                      <Link
                        to={getProfileUrl(person.name, person.id)}
                        className="img"
                        target="_blank"
                      >
                        {/* <img {...imgprops} alt={person.name} /> */}
                        {renderAvatar(avatar, person.name)}
                      </Link>
                    </ExpertLink>
                  </div>
                </div>
              </div>

              <div className="statistic_box desktop_device">
                {/* {(dynamic.num_followed || dynamic.num_followed === 0) && (
                  <div className="follow_btn">
                    <PersonFollow
                      key={5}
                      personId={person.id}
                      isFollowing={dynamic.is_following}
                      numFollowed={dynamic.num_followed}
                      source={source}
                    />
                  </div>
                )}
                {award_path && <Certificate pid={person.id} award_path={award_path} />} */}
              </div>
            </div>
          );
        })}
    </div>
  );
};
AI10PersonList.propTypes = {
  showViews: PropTypes.bool,
  showBind: PropTypes.bool,
  imgSrcWidth: PropTypes.string,
  showAuthorCard: PropTypes.bool,
  enableImgLazyLoad: PropTypes.bool,
  plugins: PropTypes.any,
  contentLeftZone: PropTypes.array,
};
AI10PersonList.defaultProps = {
  showViews: true,
  showBind: true,
  imgSrcWidth: '240',
  showAuthorCard: false,
};

export default component(
  connect(({ searchperson, aminerSearch, auth, aminerAI10 }) => ({
    searchperson,
    topic: aminerSearch.topic,
    // infocards: aminerSearch.infocards,
    user: auth.user,
    scholarsDynamicValue: aminerAI10.scholarsDynamicValue,
  })),
)(AI10PersonList);
