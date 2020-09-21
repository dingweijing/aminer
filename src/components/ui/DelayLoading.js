/**
 *  Created by BoGao on 2018-03-31;
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const LOADING_DELAY = 300;

export default class DelayLoading extends PureComponent {
  static propTypes = {
    delay: PropTypes.bool,
    text: PropTypes.string,
  };

  static defaultProps = {
    delay: true,
    text: 'Loading ...',
  };

  constructor(props) {
    super(props);
    this.state = {
      show: !props.delay,
    };
    if (props.delay) {
      this.timer = setTimeout(() => {
        if (!this.state.show) {
          this.setState({ show: true });
        }
      }, LOADING_DELAY);
    }
  }

  componentWillUnmount = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextProps.condition !== this.props.condition;
  // }

  render() {
    return this.state.show ? <div>{this.props.text}</div> : false;
  }
}
