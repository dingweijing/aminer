import React, { Component } from 'react';
import { Timeline, Spin } from 'antd'
import styles from '../timeLine.less';
import styles2 from './style.less'

const transDate = time => {
  const [date, t] = time.split(' ')
  const d = new Date(Date.parse(date.replace('年', '/').replace('月', '/').replace('日', '')))
  return `${d.toLocaleDateString()}    ${t}`
}

 function ExpertNews(props) {
   const { desc, source, time, title, url, onClick } = props
  return (
    <Timeline.Item>
      <div className={styles2.spinWrapper}>
          <div>
        <div className={[styles.timeLineDate, styles.titleBlue, styles2.time].join(' ')}>{transDate(time)}
          <span className={styles2.source}>{source}</span>
        </div>
        <div onClick={e => onClick(e, url)} className={styles2.title}>{title}</div>
         <div onClick={e => onClick(e, url)} className={[styles.nodeInfo, styles2.desc].join(' ')}>
              {desc}
         </div>
      </div>
      </div>

     </Timeline.Item>
  )
}


function NewsList({ expert_news, goPage, saveType }) {
  const onClick = (evt, url) => {
    goPage(evt, url, saveType)
  }
  const isValid = expert_news && expert_news.length
 return (
  <div className={styles2.spinWrapper}>
    {isValid && expert_news.map(exp => (<ExpertNews key={exp.url} {...exp} onClick={onClick}/>))}
    <div className={styles2.spin}>
              <Spin spinning={!isValid}></Spin>
          </div>

  </div>
 )
}

export default NewsList
