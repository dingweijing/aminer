import React, { Component } from 'react';
import { FM } from 'locales';
import styles from './style.less'

const CityModal = props => {
  const { visible, fromName, toName, value, onClose } = props
  return (
    visible ?
      (<div className={styles.CityModal}>
        <div className="top">
          <span>{fromName}-{toName}迁徙学者</span>
          <span className="closeHandler" onClick={onClose}>x</span>
        </div>
        <div className="content">
          <p className="cityTitle">{fromName}->{toName}</p>
          <p className="cityValue">{value} <span>人</span></p>
        </div>
      </div>) : null
  )
}

export default CityModal;
