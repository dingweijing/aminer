/* eslint-disable no-console, react/no-find-dom-node */
import React, { Component } from 'react';
import { renderChildren } from 'acore';
import { logFundebug } from 'utils/debug';

export default class ErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });

    logFundebug(error, info);

    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
    console.error('ErrorBoundary:::', error, info);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{
          border: 'solid 1px red',
          margin: 8,
          padding: 8,
        }}>
          <h1>Something went wrong.</h1>
        </div>
      );
    }
    return renderChildren(children);
  }
}
/* eslint-enable no-console, react/no-find-dom-node */
