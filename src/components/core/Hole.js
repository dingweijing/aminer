import React, { } from 'react';
import PropTypes from 'prop-types';
import { component, connect, hole } from 'acore';
import { classnames } from 'utils';
import styles from './Hole.less';

// TODO change to hooks.

const Hole = props => {
  const { name, fill, defaults, param, config, debug, plugins } = props;

  let holeContent = param
    ? hole.fillFuncs(fill, defaults, plugins, param, config)
    : hole.fill(fill, defaults); // don't support plugin.

  if (!holeContent) {
    holeContent = false;
  }

  // DEBUG ONLY
  if (process.env.NODE_ENV !== 'production') {
    switch (debug && debug.HighlightHoles) {
      case 'yes':
        if (!holeContent) {
          return false;
        }
        break;
      case 'all':
        return (
          <div className={classnames({
            [styles.debugHoleBox]: true,
            [styles.empty]: !holeContent,
          })}>
            <div className={styles.debugTitle}>{name}</div>
            <div className={styles.debugContent}>
              {holeContent}
            </div>
          </div>
        );
      case 'none':
      default:
        return holeContent;
    }
  }

  return holeContent;
}

Hole.defaultProps = {
  name: 'HOLE',
};

Hole.static = {
  name: PropTypes.string,
  fill: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  defaults: PropTypes.array,
  param: PropTypes.object,
  config: PropTypes.object,
  plugins: PropTypes.array,
  // other configs.
};

export default component(
  connect(({ debug }) => ({ debug }))
)(Hole);
