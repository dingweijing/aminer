import React from 'react';
import { component, Link, page, connect } from 'acore';
import display from 'utils/display';
import PropTypes from 'prop-types';
import { FM, zhCN, formatMessage } from 'locales';
import { Hole } from 'components/core';
import helper, { getLangLabel } from 'helper';
import { sysconfig } from 'systems';
import { ExpertLink } from 'aminer/components/widgets';
import { getSearchPathname } from 'utils/search-utils';
import { getProfileUrl } from 'utils/profile-utils';
import { classnames } from 'utils';
import styles from './SingleAuthor.less';

const SingleAuthor = props => {
  const { person, others, className } = props;
  const { avatar } = person;

  const { personZone, authorBlockClick } = props;
  const {
    rightZone,
    nameRightZone,
    contentRightZone,
    contentBottomZone,
    statisticsZone,
    contactZone,
    tagZone,
  } = personZone;

  const { enableImgLazyLoad } = props;

  const { profile } = person;

  const position = profile && getLangLabel(profile.position, profile.position_zh);
  const affiliation = profile && getLangLabel(profile.affiliation, profile.affiliation_zh);

  return (
    <div
      className={classnames(styles.authorItem, className)}
      key={person.id}
      id={`pid_${person.id}`}
      onClick={authorBlockClick ? authorBlockClick.bind(null, person.id) : () => {}}
    >
      <div className="image_box desktop_device">
        <ExpertLink author={person}>
          <Link to={getProfileUrl(person.name, person.id)} className="img" target="_blank">
            {/* <img {...imgprops} alt={person.name} /> */}
            {renderAvatarCom(avatar, person.name, enableImgLazyLoad)}
          </Link>
        </ExpertLink>
      </div>
      <div className="info_box">
        {/* <div className="content"> */}
        <div className="person_name_line">
          {renderNamesCom(person)}
          <Hole
            name="PersonList.nameRightZone"
            fill={nameRightZone}
            defaults={defaultZone.nameRightZone}
            param={{ person }}
            config={{ containerClass: 'nameRightZone' }}
          />
        </div>
        <Hole
          name="PersonList.statisticsZone"
          fill={statisticsZone}
          defaults={defaultZone.statisticsZone}
          param={{ person }}
          config={{ containerClass: 'statisticsZone' }}
        />
        <div className="contact_info">
          {/* <Hole
            name="PersonList.contactZone"
            fill={contactZone}
            defaults={defaultZone.contactZone}
            param={{ person }}
            config={{ containerClass: 'contactZone' }}
          /> */}
          {/* {contactZone(['position'])} */}
          {position && (
            <p>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-bao" />
              </svg>
              <span>{position}</span>
            </p>
          )}

          {affiliation && (
            <p>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-lacale" />
              </svg>
              <span>{affiliation}</span>
            </p>
          )}
        </div>

        <Hole
          name="PersonList.tagZone"
          fill={tagZone}
          defaults={defaultZone.tagZone}
          param={{ person }}
          config={{ containerClass: 'tagZone' }}
        />

        {/*  */}

        <div>
          <Hole
            name="PersonList.contentBottomZone"
            fill={contentBottomZone}
            defaults={defaultZone.contentBottomZone}
            param={{ person, others }}
            config={{ containerClass: 'contentBottomZone' }}
          />
        </div>

        <div className="itemRightTop">
          <Hole
            name="PersonList.contentRightZone"
            fill={contentRightZone}
            defaults={defaultZone.contentRightZone}
            param={{ person, index: props.index }}
            config={{ containerClass: 'contentRightZone' }}
          />
        </div>
      </div>
      {rightZone && rightZone.length > 0 && <div className="right_split" />}
      <Hole
        name="PersonList.rightZone"
        fill={rightZone}
        defaults={defaultZone.rightZone}
        param={{ person }}
        config={{ containerClass: 'rightZone' }}
      />
    </div>
  );
};

SingleAuthor.propTypes = {
  showViews: PropTypes.bool,
  showBind: PropTypes.bool,
  imgSrcWidth: PropTypes.string,

  personZone: PropTypes.object,
  enableImgLazyLoad: PropTypes.bool,
};
SingleAuthor.defaultProps = {
  showViews: true,
  showBind: true,
  imgSrcWidth: '240',
  personZone: {},
  enableImgLazyLoad: true,
};

export default component(connect())(SingleAuthor);

const renderAvatarCom = (imageSrc, name, enableImgLazyLoad) => {
  const avatar = display.personAvatar(imageSrc, 0);
  if (enableImgLazyLoad) {
    return <img data-src={imageSrc} src={display.DefaultAvatar} alt={name} />;
  }
  return <img src={avatar} alt={name} />;
};

const renderNamesCom = person => {
  const { nameBlock } = renderNames(person.name, person.name_zh);
  return (
    <span>
      {person.id && (
        <ExpertLink author={person}>
          <Link to={getProfileUrl(person.name, person.id)} className="titleName" target="_blank">
            <strong>{nameBlock}</strong>
          </Link>
        </ExpertLink>
      )}
      {!person.id && (
        <span>
          <strong>{nameBlock}</strong>
        </span>
      )}
    </span>
  );
};

const renderNames = (name, nameZh) => {
  const { mainName, subName, isDefaultLocale } = helper.renderLocalNames(name, nameZh);
  const nameBlock = (
    <div className={styles.profileName}>
      <span className={styles.name}>{mainName}</span>
      {subName && <span className={styles.sub}>{isDefaultLocale ? '' : `(${subName})`}</span>}
    </div>
  );
  const nameText = isDefaultLocale ? `${mainName}` : `${mainName} (${subName})`;
  return { nameBlock, nameText };
};

const defaultTags = ({ person }) => {
  let { tags, tags_zh } = person;
  const { tags_translated_zh } = person;
  tags_zh = tags_zh || tags_translated_zh;

  if (sysconfig.Locale === zhCN) {
    [tags, tags_zh] = [tags_zh, tags];
  }
  tags = tags && tags.length ? tags : tags_zh;
  tags = tags && tags.slice(0, 8);

  return (
    <>
      {tags && tags.length !== 0 && (
        <p className="tags">
          {tags.map(tag => {
            if (!tag || !tag.t) {
              return null;
            }
            return (
              <button type="button" className="tag" key={tag.t}>
                <Link to={`${getSearchPathname(tag)}`} target="_blank">
                  {tag.t}
                </Link>
              </button>
            );
          })}
        </p>
      )}
    </>
  );
};

const defaultStatistics = [
  ({ person }) => {
    const { indices } = person || {};
    const { hindex, pubs, citations } = indices || {};
    return (
      <div className={styles.little_statistic_box}>
        <div className="statistic">
          {/* <p className="statistic_line">
            <FM id="aminer.common.views" defaultMessage="Views" />
            <FM id="aminer.common.colon" defaultMessage=": " />
            <span className="count">{dynamic.num_viewed || '-'}</span>
          </p> */}
          <p className="statistic_line">
            <span>
              <em>h</em>-index
            </span>
            <FM id="aminer.common.colon" defaultMessage=": " />
            <span className="count">{hindex || 0}</span>
          </p>
          <span className="split" />
          <p className="statistic_line">
            <FM id="aminer.common.paper" defaultMessage="#Paper" />
            <FM id="aminer.common.colon" defaultMessage=": " />
            <span className="count">{pubs || 0}</span>
          </p>
          <span className="split" />
          <p className="statistic_line">
            <FM id="aminer.common.citation" defaultMessage="#Citation" />
            <FM id="aminer.common.colon" defaultMessage=": " />
            <span className="count">{citations || 0}</span>
          </p>
        </div>
      </div>
    );
  },
];

const defaultZone = {
  rightZone: [],
  nameRightZone: [],
  statisticsZone: defaultStatistics,
  contentRightZone: [],
  contentBottomZone: [],
  tagZone: [person => defaultTags(person)],
  contactZone: contacts => {
    return contacts.map(contact => {
      return contact_config[contact](contact);
    });
  },
};

const contact_config = {
  position: position => {
    return (
      <p>
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-bao" />
        </svg>
        <span>{position}</span>
      </p>
    );
  },
};
