import React from 'react';
import PropTypes from 'prop-types';
import { getPubLabels } from '../../utils';

const LabelPart = props => {
  const { paper } = props;
  const labels = getPubLabels(paper);
  // console.log('labels', labels)
  if (!labels || !labels.length) {
    return false;
  }
  return (
    <span className="labels">
      {labels &&
        labels.length > 0 &&
        labels.map(label => (
          <span className="label" key={label}>
            {label}
          </span>
        ))}
    </span>
  );
};

LabelPart.propTypes = {
  paper: PropTypes.object.isRequired,
};

export default LabelPart;
