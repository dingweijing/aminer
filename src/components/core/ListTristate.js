/**
 *  Created by BoGao on 2018-03-31;
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderChildren, hole } from 'acore';
import { DelayLoading } from 'components/ui';
import { classnames } from 'utils';
import { anyNE } from 'utils/compare';
import styles from './Hole.less';

// NOTE: Only monitor on condition change. init and empty are ignored.

export default class ListTristate extends Component {
  static propTypes = {
    condition: PropTypes.any,
    init: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    empty: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    content: PropTypes.any,
    test: PropTypes.any, // 当条件变化时，刷新组件.
  };

  static defaultProps = {
    init: <DelayLoading />,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return anyNE(nextProps, this.props, 'condition', 'test');
  }

  render() {
    const { condition, init, empty, test, content } = this.props;
    if (!condition) {
      return init;
    }

    // is immutable List
    // if (List.isList(condition) && condition.size === 0) {
    //   return empty;
    // }

    // is []
    if (condition && condition.length === 0) {
      return empty;
    }

    if (content) {
      return content;
    }
    return renderChildren(this.props.children);
  }
}
