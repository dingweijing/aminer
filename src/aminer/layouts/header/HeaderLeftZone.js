import React from 'react';
import { classnames } from 'utils';
import { Link } from 'acore';
import PropTypes from 'prop-types';
import HeaderNav from './HeaderNav';
import consts from 'consts';
import styles from './HeaderLeftZone.less';

const version = 'v1';
const imgPath = `${consts.ResourcePath}/sys/aminer/layout/${version}`;

const HeaderLeftZone = props => {
  const { className, showSearch, showNav } = props;

  return (
    <>
      <div className={classnames(styles.logo, styles[className])}>
        <a
          href="http://www.ckcest.cn/"
          aria-label="ckcest"
          target="_blank"
          rel="noopener noreferrer"
          className={classnames(styles.minHide, styles.kst)}
        >
          {className === 'home' && (
            <img src={`${imgPath}/ckcest.png`} alt="ckcest" style={{ width: '38px' }} />
          )}
          {className !== 'home' && (
            <img src={`${imgPath}/ckcest_home.png`} style={{ width: '38px' }} alt="ckcest" />
          )}
        </a>
        <span className={styles.minHide} />
        <Link to="/" className={styles.aminer} aria-label="aminer">
          {className === 'home' && (
            <img src={`${imgPath}/aminer_logo.png`} alt="AMiner" style={{ width: '72px' }} />
          )}
          {className !== 'home' && (
            <svg className="icon" aria-hidden="true" style={{ fontSize: '72px' }}>
              <use xlinkHref="#icon-AMinerlogo" />
            </svg>
          )}
        </Link>
      </div>
      {showNav && <HeaderNav className={className} showSearch={showSearch} />}
    </>
  );
};

HeaderLeftZone.propTypes = {
  className: PropTypes.string,
};
HeaderLeftZone.defaultProps = {
  // className: 'home'
};

export default HeaderLeftZone;
