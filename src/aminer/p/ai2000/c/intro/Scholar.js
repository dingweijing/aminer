import React from 'react';
import { classnames } from 'utils';
import { sysconfig } from 'systems';
import { FM, formatMessage } from 'locales';
import PropTypes from 'prop-types';
import display from 'utils/display';
import styles from './Scholar.less';

const Scholar = props => {
  const { personData = {} } = props;
  const { person = {}, awards } = personData;
  const { imgBoxStyle, imgSrcWidth, type, enableImgLazyLoad, showPos } = props;
  const avatar = person && display.personAvatar(person.avatar, 0, 90);
  const langKey = sysconfig.Locale === 'en-US' ? 'name' : 'name_zh';

  const renderAvatar = (imageSrc, name) => {
    if (enableImgLazyLoad) {
      return <img data-src={imageSrc} src={display.DefaultAvatar} alt={name} />;
    }
    return <img src={imageSrc} alt={name} />;
  };

  if (!personData || !person) {
    return false;
  }

  const { profile } = person;

  return (
    <div className={styles.page}>
      <div className={classnames('scholar', { [type]: type })}>
        <div className="imgBox">
          <a href={`/profile/${person.id}`} target="_black">
            {renderAvatar(avatar, person.name)}
          </a>
        </div>

        <div className="content">
          <div className="title">
            <a href={`/profile/${person.id}`} target="_black">
              <strong>
                {person.name}
                {sysconfig.Locale === 'zh-CN' && person.name_zh && (
                  <span className="sub">({person.name_zh})</span>
                )}
              </strong>
            </a>

            {/* <i className={classnames("fa fa-check-circle-o", { [styles.bind]: person.bind })} /> */}
          </div>
          <p className="statsLine">
            <span className="tip">
              <span className="statst">
                <em>h</em>-index{formatMessage({ id: 'aminer.common.colon', defaultMessage: ': ' })}
              </span>
              <span>{person.h_index || 0}</span>
            </span>
            <span className="split">|</span>
            <span className="tip">
              <span className="statst">
                <FM id="aminer.common.paper" defaultMessage="#Paper" />
                <FM id="aminer.common.colon" defaultMessage=":" />
              </span>
              <span>{person.n_pubs || 0}</span>
            </span>
            <span className="split">|</span>
            <span className="tip">
              <span className="statst">
                <FM id="aminer.common.citation" defaultMessage="#Citation" />
                <FM id="aminer.common.colon" defaultMessage=":" />
              </span>
              <span>{person.n_citation || 0}</span>
            </span>
          </p>
          {showPos && profile && profile.position && (
            <p className="black">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-bao" />
              </svg>
              <span>{profile.position}</span>
            </p>
          )}

          {profile && profile.affiliation && (
            <p className="black">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-lacale" />
              </svg>
              <span>{profile.affiliation}</span>
            </p>
          )}
        </div>
      </div>
      <ul className="province_list">
        {awards &&
          awards.map((item, index) => {
            const { rank, domain_name, domain_name_zh, domain_id } = item;
            return (
              <li className="province_item" key={domain_id}>
                <span className="ranking">#{rank}</span>
                <span className="field">in {item[`domain_${langKey}`]}</span>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

Scholar.propTypes = {
  enableImgLazyLoad: PropTypes.bool,
  showPos: PropTypes.bool,
};

Scholar.defaultProps = {
  enableImgLazyLoad: true,
  showPos: true,
};

export default Scholar;
