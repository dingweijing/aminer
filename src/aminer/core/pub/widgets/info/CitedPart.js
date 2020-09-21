import React from 'react';
import { classnames } from 'utils';
import PropTypes from 'prop-types';
import { FM } from 'locales';
import styles from './CitedPart.less';

const CitedPart = props => {
  const { paper, n_citation, citedShowZero, ...params } = props;
  const citation = n_citation || (paper && paper.num_citation) || 0;
  // console.log('cited', params)
  if (!citedShowZero && !citation) {
    return <></>;
  }
  return (
    <span className={classnames(styles.cited, 'cited', { zero: citation === 0 })} {...params}>
      <FM id="aminer.paper.cited" defaultMessage="Cited by" />
      {/* <FM id="aminer.common.colon" defaultMessage=": " /> */}
      <strong>{citation}</strong>
    </span>
  );
};

CitedPart.propTypes = {
  paper: PropTypes.object.isRequired,
  citedShowZero: PropTypes.bool,
};
CitedPart.defaultProps = {
  citedShowZero: true
}

export default CitedPart;
