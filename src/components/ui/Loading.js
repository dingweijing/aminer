import React, { Component } from 'react';
import { classnames } from 'utils';
import styles from './Loading.less';

export default class Loading extends Component {
  state = {};

  render() {
    const { fatherStyle } = this.props;
    return (
      <div className={classnames(styles.loading, fatherStyle)}>
        <div data-reactid="482" />
        <div data-reactid="483" />
        <div data-reactid="484" />
        <div data-reactid="485" />
        <div data-reactid="486" />
      </div>
    );
  }
}
