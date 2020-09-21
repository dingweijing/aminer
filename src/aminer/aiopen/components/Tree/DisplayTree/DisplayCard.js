import React, { Component } from 'react';
import { Icon } from 'antd'
import { FM } from 'locales';

import styles from './style.less'

const quoteIcon = 'https://static.aminer.cn/misc/aiopen/img/quote.png'
const thumbIcon = 'https://static.aminer.cn/misc/aiopen/img/thumbs-up.png'

const DisplayCard = props => {
  const { name, num, title, title1, title2, title3, title4 } = props

  return title3 ? (
    <div className={styles.DisplayCard}>
      <div className={styles.numWrapper}>
        <span>
          <Icon type="user" className={styles.userIcon} />
          {name}</span>
        <span>
          <img src={quoteIcon} className={styles.icon} alt="" />
          {num}</span>
        <span>
          <Icon type="book" />
          {num}
        </span>
        <span><Icon type="eye" className={styles.icon} />{num}</span>
        <span>
          <div className={styles.thumb}>
            <img src={thumbIcon} className={styles.thumbIcon} alt="" />
          </div>
          {num}</span>
      </div>
      <p className={styles.desc1}>{title1}</p>
      <p className={styles.desc2}>{title2}</p>
      <p className={styles.desc3}>{title3}</p>
      <p className={styles.desc4}>{title4}</p>
    </div>
  ) : <div className="singleLine">{name}</div>
}

export default DisplayCard;
