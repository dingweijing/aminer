import React, { Component } from 'react';
import { FM } from 'locales';
import { classnames } from 'utils'
import styles from './style.less'

const Panel = ({ children, title, className, outClassName }) => (
  <div className={classnames(styles.Panel, outClassName)}>
    {title && <div className="title">{title}</div>}
    <div className={className}>
      {children && React.Children.map(children, i => i)}
    </div>
  </div>
)

export default Panel;
