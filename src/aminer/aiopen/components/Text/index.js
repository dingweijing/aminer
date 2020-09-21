import React, { Component } from 'react';
import { FM } from 'locales';
import styles from './style.less'

const Text = ({ label, value, valueComponent }) => (
  <div className={styles.Text}>
    <span className="label">{label}</span>
    <span className="value">{valueComponent || value}</span>
  </div>
)

const Paragraph = ({ label, value }) => (
  <div className={styles.Paragraph}>
    <span>{label}</span>
    <p>{value}</p>
  </div>
)

export { Text, Paragraph };
