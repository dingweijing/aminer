import React from 'react';
import { classnames } from 'utils';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd'; // TODO del
import { formatMessage, FM } from 'locales';
import styles from './ViewPart.less';

const ViewPart = props => {
  const { paper } = props;
  return (
    <span className={classnames(styles.views, 'views')}>
      <Tooltip
        placement="top"
        title={`${formatMessage({
          id: 'aminer.common.views',
          defaultMessage: 'views',
        })}${formatMessage({
          id: 'aminer.common.colon',
          defaultMessage: ': ',
        })}${paper.num_viewed || 0}`}
      >
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-eye" />
        </svg>
        <FM id="aminer.paper.view" />

        {paper.num_viewed || 0}
      </Tooltip>
    </span>
  );
};

ViewPart.propTypes = {
  paper: PropTypes.object.isRequired,
};

export default ViewPart;
