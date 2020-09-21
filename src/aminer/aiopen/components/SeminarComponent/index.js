import React, { Component } from 'react';
import { FM } from 'locales';
import styles from './style.less'

const SeminarComponent = ({ date, city, title, deadline, remain }) => (
  <div className={styles.SeminarComponent}>
    <div className="left">
      <span className="date">{date}<span>月</span></span>
      <span className="city">{city}</span>
    </div>
    <div className="right">
      <div>
        <h4>{title} </h4>
        <p className="p1">
          <FM id="aiopen.index.SeminarComponent.deadline"></FM>
          {deadline}
        </p>
        <p className="p2">
          <FM id="aiopen.index.SeminarComponent.remain"></FM>
          {remain}
        </p>
      </div>

    </div>
  </div>
)

export default SeminarComponent;
