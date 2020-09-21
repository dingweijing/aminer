import React, { Component } from 'react'
import { FM, formatMessage } from 'locales';
import { getLangLabel } from 'helper';
import styles from './Banner.less'

/* eslint-disable max-len */
const Icon = ({ onClick }) => (<img src="https://fileserver.aminer.cn/sys/aminer/homepage/arrow.png" onClick={onClick} alt="" className={styles.arrow}/>)

const redirectTo = url => {
  // window.location.href = url
  if (window.open) {
    window.open(url, '_blank')
  } else {
    window.location.href = url
  }
}

const InfoComponent = ({ id, message, url, message_id, lang }) => {
  const onClick = () => redirectTo(`${url}?lang=${lang}`)
  return (
  <div className={styles.infoComponent} >
    <div className={styles.title}>
      <span onClick={onClick}> <FM id={id} /></span>
      <Icon onClick={onClick} />
    </div>
<div className={styles.message} onClick={onClick}>
  <FM id={message_id} defaultMessage={message}/>
</div>
  </div>
)
}

const infoArray = [
  { id: 'aminer.home.banner.info.title1',
url: 'https://aminer.cn/data-covid19/',
  message_id: 'aminer.home.banner.info.message1',
  message: 'For fighting against COVID-19 pandemic, open and comprehensive big data may help researchers, officials and medical staffs to understand the virus and pandemic more.' },
  { id: 'aminer.home.banner.info.title2',
message_id: 'aminer.home.banner.info.message2',
   url: 'https://covid-dashboard.aminer.cn',
message: 'COVID-19 Graph - Knowledge Dashboard is a knowledge-based global COVID-19 epidemic risk prediction and work resumption decision-making system,' },
  { id: 'aminer.home.banner.info.title3',
message_id: 'aminer.home.banner.info.message3',
  url: 'https://covid-19.aminer.cn/kg',
message: 'For fighting against COVID-19 pandemic, open and comprehensive knowledge has been always desired by people all over the world including researchers, officials, medical staffs ' },
]

const Banner = ({ lang }) => (
  <div className={styles.wrapper}>
    <div className={styles.imgsLayer}>
      <img src="https://fileserver.aminer.cn/sys/aminer/homepage/left.png" alt="" className={styles.rna}/>
      <img src="https://fileserver.aminer.cn/sys/aminer/homepage/kg%202111.png" alt="" className={styles.right}/>
    </div>
    <div className={styles.topLayer}>
        <div className={styles.head}>
          <img src="https://fileserver.aminer.cn/sys/aminer/homepage/icon.png" alt="" className={styles.sunIcon}/>
          <span onClick={() => redirectTo(`https://covid-19.aminer.cn/?lang=${lang}`)}>
          <FM id="aminer.home.banner.title" />
          </span>
          <Icon onClick={() => redirectTo(`https://covid-19.aminer.cn/?lang=${lang}`)}/>
        </div>
        <div className={styles.bottom}>
          {infoArray.map(i => (<InfoComponent {...i} key={i.id} lang={lang}/>))}
        </div>
    </div>
  </div>
)

export default Banner;
