import React from 'react';
import styles from './style.less'

const EN = 'en-US'
const CN = 'zh-CN'

const Indicator = props => {
  const { lang, onToggleLang } = props
  return (
    <div className={styles.Indicator} >
      <div onClick={onToggleLang.bind(null, EN)} className={[styles.left, lang === EN ? styles.active : ''].join(' ')}>
        EN
      </div>
      <div onClick={onToggleLang.bind(null, CN)} className={[styles.right, lang === CN ? styles.active : ''].join(' ')}>中文</div>
    </div>
  )
}

export default Indicator;
