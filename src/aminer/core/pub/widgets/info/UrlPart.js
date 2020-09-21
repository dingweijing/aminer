import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd'; // TODO del
import pubHelper from 'helper/pub';
import { classnames } from 'utils';
import { formatMessage, FM } from 'locales';
import styles from './UrlPart.less';

const UrlPart = props => {
  const { paper, getPubUrl, placement, maxWidth, showLable } = props;

  const href = getPubUrl(paper.urls);

  if (!href) {
    return false;
  }

  return (
    <span className={classnames(styles.urlPart, 'urlPart')}>
      <Tooltip placement={placement || 'top'} title={href} overlayStyle={{ maxWidth }}>
        <a className="url" href={href} target="_black">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-global" />
          </svg>
          {showLable && <FM id="aminer.paper.original" />}
        </a>
      </Tooltip>
    </span>
  );
};

UrlPart.propTypes = {
  paper: PropTypes.object.isRequired,
  getPubUrl: PropTypes.func,
  showLable: PropTypes.bool,
  maxWidth: PropTypes.string,
};

UrlPart.defaultProps = {
  getPubUrl: pubHelper.getPubUrl,
  showLable: true,
  maxWidth: '100%'
};

export default UrlPart;
