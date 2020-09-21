import React from 'react';
import { classnames } from 'utils';
import { FM, formatMessage } from 'locales';
import PropTypes from 'prop-types';
import display from 'utils/display';
import styles from './Scholar.less';


const Scholar = props => {
  const { person } = props;
  const { imgBoxStyle, imgSrcWidth, type, enableImgLazyLoad } = props;
  const avatar = person && display.personAvatar(person.avatar, 0, 90);

  const renderAvatar = (imageSrc, name) => {
    if (enableImgLazyLoad) {
      return (
        <img data-src={imageSrc} src={display.DefaultAvatar} alt={name} />
      )
    }
    return (<img src={imageSrc} alt={name} />)
  }

  return (
    <div className={styles.page}>
      <div className={classnames('scholar', { [type]: type })}>
        <div className='imgBox'>
          <a href={`/profile/${person.id}`} target='_black'>
            {renderAvatar(avatar, person.name)}
          </a>

        </div>

        <div className='content'>
          <div className='title'>
            <a href={`/profile/${person.id}`} target='_black'>
              <strong>{person.name}{person.name_zh && <span className='sub'>({person.name_zh})</span>}</strong>
            </a>

            {/* <i className={classnames('fa fa-check-circle-o', { [styles.bind]: person.bind })} /> */}
          </div>
          <p className='statsLine'>
            <span className='tip'>
              <span className='statst'><em>h</em>-index{formatMessage({ id: 'aminer.common.colon', defaultMessage: ':' })}</span>
              <span>{person.indices ? person.indices.h_index : 0}</span>
            </span>
            <span className='split'>|</span>
            <span className='tip'>
              <span className='statst'>
                <FM id="aminer.common.paper" defaultMessage='#Paper' />
                <FM id="aminer.common.colon" defaultMessage=':' />
              </span>
              <span>{person.indices ? person.indices.g_index : 0}</span>
            </span>
            <span className='split'>|</span>
            <span className='tip'>
              <span className='statst'>
                <FM id="aminer.common.citation" defaultMessage='#Citation' />
                <FM id="aminer.common.colon" defaultMessage=':' />
              </span>
              <span>{person.indices ? person.indices.num_citation : 0}</span>
            </span>
          </p>
          {person.pos && person.pos[0] && (
            <p className='black'>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-bao" />
              </svg>
              <span>{person.pos[0].n || person.pos[0].n_zh}</span>
            </p>
          )}

          {person.aff && (person.aff.desc || person.aff.desc_zh) && (
            <p className='black'>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#icon-lacale" />
              </svg>
              <span>{person.aff.desc || person.aff.desc_zh}</span>
            </p>
          )}
        </div>
      </div>
      <ul className='province_list'>
        {person.province && person.province.map((item, index) => {
          const { ranking, field } = item
          return (
            <li className='province_item' key={index}>
              <span className='ranking'>{ranking}</span>
              <span className='field'>{`in ${field}`}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

Scholar.propTypes = {
  enableImgLazyLoad: PropTypes.bool
}

Scholar.defaultProps = {
  enableImgLazyLoad: true
}

export default Scholar;
